import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EarningRequest {
  action: 
    | "create_earning" 
    | "mark_ready_to_pay" 
    | "mark_paid" 
    | "void_earnings"
    | "create_adjustment"
    | "process_payout" 
    | "get_creator_report";
  design_id?: string;
  order_id?: string;
  sale_amount?: number;
  quantity?: number;
  earning_ids?: string[];
  period?: string;
  creator_profile_id?: string;
  reason?: string;
  adjustment_amount?: number;
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

    // Check admin or creator status
    const { data: isAdmin } = await supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" });

    const { data: creatorProfile } = await supabase
      .from("creator_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const body: EarningRequest = await req.json();
    const { action } = body;

    console.log(`User ${user.id} (admin: ${isAdmin}, creator: ${!!creatorProfile}) processing action: ${action}`);

    // ============================================================
    // ACTION: create_earning
    // Called when an order containing a design is fulfilled
    // ============================================================
    if (action === "create_earning") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { design_id, order_id, sale_amount, quantity = 1 } = body;

      if (!design_id || !order_id || sale_amount === undefined) {
        return new Response(
          JSON.stringify({ error: "design_id, order_id, and sale_amount are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch design to get commission info at time of sale
      const { data: design, error: designError } = await supabase
        .from("designs")
        .select("*, creator_profiles(id, user_id, display_name)")
        .eq("id", design_id)
        .maybeSingle();

      if (designError || !design) {
        console.error("Design fetch error:", designError);
        return new Response(
          JSON.stringify({ error: "Design not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Calculate commission based on commission_type
      let commission_amount: number;
      if (design.commission_type === "percentage") {
        // Percentage: commission = sale_amount * (commission_value / 100)
        commission_amount = (sale_amount * design.commission_value) / 100;
      } else {
        // Fixed: commission = commission_value * quantity
        commission_amount = design.commission_value * quantity;
      }

      // Round to 2 decimal places
      commission_amount = Math.round(commission_amount * 100) / 100;

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

      console.log(`Created earning ${earning.id} for creator ${design.creator_profile_id}: $${commission_amount} (${design.commission_type}: ${design.commission_value})`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          earning,
          calculation: {
            commission_type: design.commission_type,
            commission_value: design.commission_value,
            sale_amount,
            quantity,
            commission_amount
          },
          message: `Commission of $${commission_amount.toFixed(2)} recorded for ${design.creator_profiles?.display_name}`
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // ACTION: mark_ready_to_pay
    // Admin marks earnings as ready for payout (order verified non-refundable)
    // ============================================================
    if (action === "mark_ready_to_pay") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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
          status: "ready_to_pay",
          updated_at: new Date().toISOString()
        })
        .in("id", earning_ids)
        .eq("status", "pending") // Only update pending ones
        .select();

      if (updateError) {
        console.error("Error marking earnings as ready_to_pay:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update earnings" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Marked ${earnings.length} earnings as ready_to_pay`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${earnings.length} earnings marked as ready to pay`,
          earnings 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // ACTION: mark_paid
    // Admin marks earnings as paid after payout
    // ============================================================
    if (action === "mark_paid") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { earning_ids } = body;

      if (!earning_ids || earning_ids.length === 0) {
        return new Response(
          JSON.stringify({ error: "earning_ids are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const paidAt = new Date().toISOString();

      const { data: earnings, error: updateError } = await supabase
        .from("creator_earnings")
        .update({
          status: "paid",
          paid_at: paidAt,
          updated_at: paidAt
        })
        .in("id", earning_ids)
        .in("status", ["pending", "ready_to_pay"]) // Only update valid statuses
        .select();

      if (updateError) {
        console.error("Error marking earnings as paid:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update earnings" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const totalPaid = earnings.reduce((sum, e) => sum + Number(e.commission_amount), 0);
      console.log(`Marked ${earnings.length} earnings as paid, total: $${totalPaid.toFixed(2)}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${earnings.length} earnings marked as paid ($${totalPaid.toFixed(2)} total)`,
          paid_at: paidAt,
          total_paid: totalPaid,
          earnings 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // ACTION: void_earnings
    // Admin voids earnings for refunded orders
    // ============================================================
    if (action === "void_earnings") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { earning_ids, order_id, reason } = body;

      // Can void by earning_ids or by order_id
      if (!earning_ids?.length && !order_id) {
        return new Response(
          JSON.stringify({ error: "earning_ids or order_id are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let query = supabase
        .from("creator_earnings")
        .update({
          status: "void",
          updated_at: new Date().toISOString()
        })
        .in("status", ["pending", "ready_to_pay"]); // Only void unpaid earnings

      if (earning_ids?.length) {
        query = query.in("id", earning_ids);
      } else if (order_id) {
        query = query.eq("order_id", order_id);
      }

      const { data: earnings, error: updateError } = await query.select();

      if (updateError) {
        console.error("Error voiding earnings:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to void earnings" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const voidedAmount = earnings.reduce((sum, e) => sum + Number(e.commission_amount), 0);
      console.log(`Voided ${earnings.length} earnings ($${voidedAmount.toFixed(2)}) - Reason: ${reason || "Not specified"}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${earnings.length} earnings voided ($${voidedAmount.toFixed(2)} total)`,
          reason,
          voided_amount: voidedAmount,
          earnings 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // ACTION: create_adjustment
    // Admin creates a negative adjustment for partial refunds
    // ============================================================
    if (action === "create_adjustment") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { creator_profile_id, adjustment_amount, reason, order_id } = body;

      if (!creator_profile_id || adjustment_amount === undefined) {
        return new Response(
          JSON.stringify({ error: "creator_profile_id and adjustment_amount are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      // Create negative adjustment (sale_amount = 0, negative commission)
      const { data: adjustment, error: adjustmentError } = await supabase
        .from("creator_earnings")
        .insert({
          creator_profile_id,
          order_id: order_id || `ADJ-${Date.now()}`,
          sale_amount: 0,
          commission_amount: -Math.abs(adjustment_amount), // Ensure negative
          status: "pending",
          period
        })
        .select()
        .single();

      if (adjustmentError) {
        console.error("Error creating adjustment:", adjustmentError);
        return new Response(
          JSON.stringify({ error: "Failed to create adjustment" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Created adjustment ${adjustment.id} for creator ${creator_profile_id}: -$${Math.abs(adjustment_amount).toFixed(2)} - Reason: ${reason || "Not specified"}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          adjustment,
          reason,
          message: `Adjustment of -$${Math.abs(adjustment_amount).toFixed(2)} created`
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // ACTION: process_payout
    // Get payout summary aggregated by creator
    // ============================================================
    if (action === "process_payout") {
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { period } = body;

      // Get all pending/ready_to_pay earnings
      let query = supabase
        .from("creator_earnings")
        .select(`
          *,
          creator_profiles(id, user_id, display_name),
          designs(title)
        `)
        .in("status", ["pending", "ready_to_pay"]);

      if (period) {
        query = query.lte("period", period); // Include current and earlier unpaid periods
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
        total_sales: number;
        total_commission: number;
        pending_count: number;
        ready_to_pay_count: number;
        earning_ids: string[];
        by_period: Record<string, { sales: number; commission: number; count: number }>;
      }> = {};

      for (const earning of earnings) {
        const creatorId = earning.creator_profile_id;
        if (!creatorTotals[creatorId]) {
          creatorTotals[creatorId] = {
            creator_profile_id: creatorId,
            display_name: earning.creator_profiles?.display_name || "Unknown",
            total_sales: 0,
            total_commission: 0,
            pending_count: 0,
            ready_to_pay_count: 0,
            earning_ids: [],
            by_period: {}
          };
        }

        const creator = creatorTotals[creatorId];
        creator.total_sales += Number(earning.sale_amount);
        creator.total_commission += Number(earning.commission_amount);
        creator.earning_ids.push(earning.id);

        if (earning.status === "pending") {
          creator.pending_count++;
        } else if (earning.status === "ready_to_pay") {
          creator.ready_to_pay_count++;
        }

        // Track by period
        if (!creator.by_period[earning.period]) {
          creator.by_period[earning.period] = { sales: 0, commission: 0, count: 0 };
        }
        creator.by_period[earning.period].sales += Number(earning.sale_amount);
        creator.by_period[earning.period].commission += Number(earning.commission_amount);
        creator.by_period[earning.period].count++;
      }

      const summary = Object.values(creatorTotals);
      const grandTotal = summary.reduce((acc, c) => ({
        sales: acc.sales + c.total_sales,
        commission: acc.commission + c.total_commission
      }), { sales: 0, commission: 0 });

      return new Response(
        JSON.stringify({ 
          success: true, 
          period: period || "all",
          summary: {
            total_earnings_count: earnings.length,
            total_sales: grandTotal.sales,
            total_payout: grandTotal.commission,
            creator_count: summary.length
          },
          creators: summary
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============================================================
    // ACTION: get_creator_report
    // Get earnings report for a specific creator (admin or self)
    // ============================================================
    if (action === "get_creator_report") {
      const { creator_profile_id, period } = body;

      // Determine which creator to report on
      let targetCreatorId = creator_profile_id;

      // If not admin, can only view own report
      if (!isAdmin) {
        if (!creatorProfile) {
          return new Response(
            JSON.stringify({ error: "Not authorized - must be admin or active creator" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        targetCreatorId = creatorProfile.id;
      }

      if (!targetCreatorId) {
        return new Response(
          JSON.stringify({ error: "creator_profile_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch all earnings for this creator
      let query = supabase
        .from("creator_earnings")
        .select(`
          *,
          designs(title, main_image_url)
        `)
        .eq("creator_profile_id", targetCreatorId)
        .order("created_at", { ascending: false });

      if (period) {
        query = query.eq("period", period);
      }

      const { data: earnings, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching creator earnings:", fetchError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch earnings" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Calculate summaries
      const summary = {
        lifetime: { sales: 0, commission: 0, count: 0 },
        pending: { sales: 0, commission: 0, count: 0 },
        ready_to_pay: { sales: 0, commission: 0, count: 0 },
        paid: { sales: 0, commission: 0, count: 0 },
        void: { sales: 0, commission: 0, count: 0 },
        by_period: {} as Record<string, { sales: number; commission: number; count: number }>,
        by_year: {} as Record<string, { sales: number; commission: number; count: number }>
      };

      const paidHistory: Array<{ paid_at: string; commission_amount: number }> = [];

      for (const earning of earnings) {
        const saleAmount = Number(earning.sale_amount);
        const commissionAmount = Number(earning.commission_amount);

        // Lifetime totals (exclude void)
        if (earning.status !== "void") {
          summary.lifetime.sales += saleAmount;
          summary.lifetime.commission += commissionAmount;
          summary.lifetime.count++;
        }

        // By status
        const status = earning.status as string;
        if (status === "pending") {
          summary.pending.sales += saleAmount;
          summary.pending.commission += commissionAmount;
          summary.pending.count++;
        } else if (status === "ready_to_pay") {
          summary.ready_to_pay.sales += saleAmount;
          summary.ready_to_pay.commission += commissionAmount;
          summary.ready_to_pay.count++;
        } else if (status === "paid") {
          summary.paid.sales += saleAmount;
          summary.paid.commission += commissionAmount;
          summary.paid.count++;
        } else if (status === "void") {
          summary.void.sales += saleAmount;
          summary.void.commission += commissionAmount;
          summary.void.count++;
        }

        // By period
        if (!summary.by_period[earning.period]) {
          summary.by_period[earning.period] = { sales: 0, commission: 0, count: 0 };
        }
        if (earning.status !== "void") {
          summary.by_period[earning.period].sales += saleAmount;
          summary.by_period[earning.period].commission += commissionAmount;
          summary.by_period[earning.period].count++;
        }

        // By year
        const year = earning.period.split("-")[0];
        if (!summary.by_year[year]) {
          summary.by_year[year] = { sales: 0, commission: 0, count: 0 };
        }
        if (earning.status !== "void") {
          summary.by_year[year].sales += saleAmount;
          summary.by_year[year].commission += commissionAmount;
          summary.by_year[year].count++;
        }

        // Track paid history
        if (earning.status === "paid" && earning.paid_at) {
          paidHistory.push({
            paid_at: earning.paid_at,
            commission_amount: commissionAmount
          });
        }
      }

      // Calculate unpaid total
      const unpaid = {
        sales: summary.pending.sales + summary.ready_to_pay.sales,
        commission: summary.pending.commission + summary.ready_to_pay.commission,
        count: summary.pending.count + summary.ready_to_pay.count
      };

      return new Response(
        JSON.stringify({ 
          success: true,
          creator_profile_id: targetCreatorId,
          period: period || "all",
          summary: {
            ...summary,
            unpaid
          },
          paid_history: paidHistory.slice(0, 10), // Last 10 payouts
          recent_earnings: earnings.slice(0, 20) // Last 20 earnings
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Valid actions: create_earning, mark_ready_to_pay, mark_paid, void_earnings, create_adjustment, process_payout, get_creator_report" }),
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
