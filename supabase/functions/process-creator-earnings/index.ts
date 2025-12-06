import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateEarningRequest {
  action: "create_earning" | "mark_paid" | "process_payout";
  design_id?: string;
  order_id?: string;
  sale_amount?: number;
  earning_ids?: string[];
  period?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only admins can process earnings
    const { data: isAdmin } = await supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: CreateEarningRequest = await req.json();
    const { action } = body;

    console.log(`Admin ${user.id} processing earnings action: ${action}`);

    if (action === "create_earning") {
      const { design_id, order_id, sale_amount } = body;

      if (!design_id || !order_id || !sale_amount) {
        return new Response(
          JSON.stringify({ error: "design_id, order_id, and sale_amount are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch design to get commission info
      const { data: design, error: designError } = await supabase
        .from("designs")
        .select("*, creator_profiles(id, user_id, display_name)")
        .eq("id", design_id)
        .single();

      if (designError || !design) {
        return new Response(
          JSON.stringify({ error: "Design not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Calculate commission
      let commission_amount: number;
      if (design.commission_type === "percentage") {
        commission_amount = (sale_amount * design.commission_value) / 100;
      } else {
        commission_amount = design.commission_value;
      }

      // Get current period (YYYY-MM format)
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Create earning record
      const { data: earning, error: earningError } = await supabase
        .from("creator_earnings")
        .insert({
          design_id,
          creator_profile_id: design.creator_profile_id,
          order_id,
          sale_amount,
          commission_amount,
          status: "pending",
          period
        })
        .select()
        .single();

      if (earningError) {
        console.error("Error creating earning:", earningError);
        return new Response(
          JSON.stringify({ error: "Failed to create earning record" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Created earning ${earning.id} for creator ${design.creator_profile_id}: $${commission_amount}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          earning,
          message: `Commission of $${commission_amount.toFixed(2)} recorded for ${design.creator_profiles?.display_name}`
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "mark_paid") {
      const { earning_ids } = body;

      if (!earning_ids || earning_ids.length === 0) {
        return new Response(
          JSON.stringify({ error: "earning_ids are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: earnings, error: updateError } = await supabase
        .from("creator_earnings")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in("id", earning_ids)
        .select();

      if (updateError) {
        console.error("Error marking earnings as paid:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update earnings" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${earnings.length} earnings marked as paid`,
          earnings 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "process_payout") {
      const { period } = body;

      // Get all pending/ready_to_pay earnings for the period (or all if no period specified)
      let query = supabase
        .from("creator_earnings")
        .select(`
          *,
          creator_profiles(id, user_id, display_name),
          designs(title)
        `)
        .in("status", ["pending", "ready_to_pay"]);

      if (period) {
        query = query.eq("period", period);
      }

      const { data: earnings, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching earnings:", fetchError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch earnings" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Aggregate by creator
      const creatorTotals: Record<string, {
        creator_profile_id: string;
        display_name: string;
        total_commission: number;
        earning_ids: string[];
        earning_count: number;
      }> = {};

      for (const earning of earnings) {
        const creatorId = earning.creator_profile_id;
        if (!creatorTotals[creatorId]) {
          creatorTotals[creatorId] = {
            creator_profile_id: creatorId,
            display_name: earning.creator_profiles?.display_name || "Unknown",
            total_commission: 0,
            earning_ids: [],
            earning_count: 0
          };
        }
        creatorTotals[creatorId].total_commission += Number(earning.commission_amount);
        creatorTotals[creatorId].earning_ids.push(earning.id);
        creatorTotals[creatorId].earning_count++;
      }

      const summary = Object.values(creatorTotals);

      return new Response(
        JSON.stringify({ 
          success: true, 
          period: period || "all",
          total_earnings: earnings.length,
          total_payout: summary.reduce((acc, c) => acc + c.total_commission, 0),
          creators: summary
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error processing earnings:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
