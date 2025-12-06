import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schemas for each action
const ActionSchema = z.enum([
  "create_earning",
  "mark_ready_to_pay",
  "mark_paid",
  "void_earnings",
  "create_adjustment",
  "process_payout",
  "get_creator_report"
]);

const CreateEarningSchema = z.object({
  action: z.literal("create_earning"),
  design_id: z.string().uuid("Invalid design ID"),
  order_id: z.string().min(1).max(100),
  sale_amount: z.number().min(0).max(10000000),
  quantity: z.number().int().min(1).max(1000).optional()
});

const MarkReadyToPaySchema = z.object({
  action: z.literal("mark_ready_to_pay"),
  earning_ids: z.array(z.string().uuid()).min(1).max(100)
});

const MarkPaidSchema = z.object({
  action: z.literal("mark_paid"),
  earning_ids: z.array(z.string().uuid()).min(1).max(100)
});

const VoidEarningsSchema = z.object({
  action: z.literal("void_earnings"),
  earning_ids: z.array(z.string().uuid()).max(100).optional(),
  order_id: z.string().min(1).max(100).optional(),
  reason: z.string().max(500).optional()
}).refine(data => data.earning_ids?.length || data.order_id, {
  message: "Either earning_ids or order_id is required"
});

const CreateAdjustmentSchema = z.object({
  action: z.literal("create_adjustment"),
  creator_profile_id: z.string().uuid("Invalid creator profile ID"),
  adjustment_amount: z.number().min(0.01).max(1000000),
  reason: z.string().max(500).optional(),
  order_id: z.string().max(100).optional()
});

const ProcessPayoutSchema = z.object({
  action: z.literal("process_payout"),
  period: z.string().regex(/^\d{4}-\d{2}$/, "Period must be YYYY-MM format").optional()
});

const GetCreatorReportSchema = z.object({
  action: z.literal("get_creator_report"),
  creator_profile_id: z.string().uuid("Invalid creator profile ID").optional(),
  period: z.string().regex(/^\d{4}-\d{2}$/, "Period must be YYYY-MM format").optional()
});

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

    const rawBody = await req.json();
    
    // Validate action field first
    const actionResult = ActionSchema.safeParse(rawBody.action);
    if (!actionResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const action = actionResult.data;
    console.log(`User ${user.id} (admin: ${isAdmin}, creator: ${!!creatorProfile}) processing action: ${action}`);

    // ============================================================
    // ACTION: create_earning
    // Called when an order containing a design is fulfilled
    // ============================================================
    if (action === "create_earning") {
      const parseResult = CreateEarningSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return new Response(
          JSON.stringify({ error: parseResult.error.errors[0]?.message || "Invalid input" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { design_id, order_id, sale_amount, quantity = 1 } = parseResult.data;

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
      const parseResult = MarkReadyToPaySchema.safeParse(rawBody);
      if (!parseResult.success) {
        return new Response(
          JSON.stringify({ error: parseResult.error.errors[0]?.message || "Invalid input" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { earning_ids } = parseResult.data;

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
      const parseResult = MarkPaidSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return new Response(
          JSON.stringify({ error: parseResult.error.errors[0]?.message || "Invalid input" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { earning_ids } = parseResult.data;
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
      const parseResult = VoidEarningsSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return new Response(
          JSON.stringify({ error: parseResult.error.errors[0]?.message || "Invalid input" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { earning_ids, order_id, reason } = parseResult.data;

      // Can void by earning_ids or by order_id
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
      const parseResult = CreateAdjustmentSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return new Response(
          JSON.stringify({ error: parseResult.error.errors[0]?.message || "Invalid input" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { creator_profile_id, adjustment_amount, reason, order_id } = parseResult.data;

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
      const parseResult = ProcessPayoutSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return new Response(
          JSON.stringify({ error: parseResult.error.errors[0]?.message || "Invalid input" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { period } = parseResult.data;

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
            total_sales: grandTotal.sales,
            total_commission: grandTotal.commission,
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
      const parseResult = GetCreatorReportSchema.safeParse(rawBody);
      if (!parseResult.success) {
        return new Response(
          JSON.stringify({ error: parseResult.error.errors[0]?.message || "Invalid input" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { creator_profile_id, period } = parseResult.data;

      // If not admin, can only get own report
      let targetCreatorId = creator_profile_id;
      
      if (!isAdmin) {
        if (!creatorProfile) {
          return new Response(
            JSON.stringify({ error: "Creator access required" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        // Force to own profile
        targetCreatorId = creatorProfile.id;
      }

      if (!targetCreatorId) {
        return new Response(
          JSON.stringify({ error: "creator_profile_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch creator info
      const { data: creatorData } = await supabase
        .from("creator_profiles")
        .select("id, display_name, status")
        .eq("id", targetCreatorId)
        .single();

      if (!creatorData) {
        return new Response(
          JSON.stringify({ error: "Creator not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch earnings
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

      // Calculate summary
      const summary = {
        total_sales: 0,
        total_commission: 0,
        pending_commission: 0,
        ready_to_pay_commission: 0,
        paid_commission: 0,
        void_commission: 0,
        by_status: {} as Record<string, { count: number; commission: number }>,
        by_period: {} as Record<string, { sales: number; commission: number; count: number }>
      };

      for (const earning of earnings) {
        summary.total_sales += Number(earning.sale_amount);
        summary.total_commission += Number(earning.commission_amount);

        // By status
        if (!summary.by_status[earning.status]) {
          summary.by_status[earning.status] = { count: 0, commission: 0 };
        }
        summary.by_status[earning.status].count++;
        summary.by_status[earning.status].commission += Number(earning.commission_amount);

        // By period
        if (!summary.by_period[earning.period]) {
          summary.by_period[earning.period] = { sales: 0, commission: 0, count: 0 };
        }
        summary.by_period[earning.period].sales += Number(earning.sale_amount);
        summary.by_period[earning.period].commission += Number(earning.commission_amount);
        summary.by_period[earning.period].count++;

        // By specific status
        if (earning.status === "pending") {
          summary.pending_commission += Number(earning.commission_amount);
        } else if (earning.status === "ready_to_pay") {
          summary.ready_to_pay_commission += Number(earning.commission_amount);
        } else if (earning.status === "paid") {
          summary.paid_commission += Number(earning.commission_amount);
        } else if (earning.status === "void") {
          summary.void_commission += Number(earning.commission_amount);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          creator: creatorData,
          period: period || "all",
          summary,
          earnings: earnings.slice(0, 100) // Limit to 100 for response size
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error processing creator earnings:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});