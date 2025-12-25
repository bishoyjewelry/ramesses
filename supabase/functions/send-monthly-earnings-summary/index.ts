import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to get month name
function getMonthName(monthIndex: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthIndex];
}

// Helper to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // This endpoint can be triggered by cron or manually by admin
    // For cron, we'll skip auth check. For manual, we verify admin.
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (!authError && user) {
        const { data: isAdmin } = await supabase
          .rpc("has_role", { _user_id: user.id, _role: "admin" });
        
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Admin access required" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Calculate last month's period
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const period = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;
    const monthName = getMonthName(lastMonth.getMonth());
    const year = lastMonth.getFullYear();

    console.log(`Generating monthly earnings summary for period: ${period}`);

    // Get all creator profiles with their earnings for last month
    const { data: creatorProfiles, error: profilesError } = await supabase
      .from("creator_profiles")
      .select("id, user_id, display_name")
      .eq("status", "active");

    if (profilesError) {
      console.error("Error fetching creator profiles:", profilesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch creator profiles" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailsSent: string[] = [];
    const errors: string[] = [];

    for (const creator of creatorProfiles || []) {
      // Get earnings for this creator for the period
      const { data: earnings, error: earningsError } = await supabase
        .from("creator_earnings")
        .select(`
          *,
          designs(title, slug)
        `)
        .eq("creator_profile_id", creator.id)
        .eq("period", period);

      if (earningsError) {
        console.error(`Error fetching earnings for creator ${creator.id}:`, earningsError);
        errors.push(`Failed to fetch earnings for ${creator.display_name}`);
        continue;
      }

      // Skip if no earnings
      if (!earnings || earnings.length === 0) {
        console.log(`No earnings for creator ${creator.display_name} in ${period}`);
        continue;
      }

      // Calculate totals
      const totalSales = earnings.reduce((sum, e) => sum + Number(e.sale_amount), 0);
      const totalCommission = earnings.reduce((sum, e) => sum + Number(e.commission_amount), 0);
      const pendingCount = earnings.filter(e => e.status === "pending").length;
      const paidCount = earnings.filter(e => e.status === "paid").length;

      // Get creator's email
      const { data: userData } = await supabase.auth.admin.getUserById(creator.user_id);
      
      if (!userData?.user?.email) {
        console.error(`No email found for creator ${creator.display_name}`);
        errors.push(`No email for ${creator.display_name}`);
        continue;
      }

      // Build earnings breakdown HTML
      const earningsRows = earnings.map(e => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${e.designs?.title || 'Unknown Design'}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(Number(e.sale_amount))}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #D4AF37; font-weight: bold;">${formatCurrency(Number(e.commission_amount))}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            <span style="background: ${e.status === 'paid' ? '#22c55e' : '#f59e0b'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
              ${e.status === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </td>
        </tr>
      `).join("");

      // Send monthly summary email
      try {
        await resend.emails.send({
          from: "Ramesses Jewelry <onboarding@resend.dev>",
          to: [userData.user.email],
          subject: `Your Ramesses Creator earnings for ${monthName} ${year}`,
          html: `
            <div style="font-family: 'Montserrat', sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #0B1B36; font-size: 28px; margin-bottom: 10px;">
                  ${monthName} ${year} Earnings Summary
                </h1>
                <div style="width: 60px; height: 2px; background: #D4AF37; margin: 0 auto;"></div>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Hi ${creator.display_name},
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Here's a summary of your Creator Marketplace earnings for ${monthName} ${year}.
              </p>
              
              <!-- Summary Cards -->
              <div style="display: flex; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #0B1B36 0%, #15233E 100%); padding: 25px; border-radius: 12px; text-align: center;">
                  <p style="color: #888; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Total Sales</p>
                  <p style="color: white; font-size: 24px; font-weight: bold; margin: 0;">${formatCurrency(totalSales)}</p>
                </div>
                <div style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #D4AF37 0%, #E2C89A 100%); padding: 25px; border-radius: 12px; text-align: center;">
                  <p style="color: #0B1B36; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Your Commissions</p>
                  <p style="color: #0B1B36; font-size: 24px; font-weight: bold; margin: 0;">${formatCurrency(totalCommission)}</p>
                </div>
                <div style="flex: 1; min-width: 150px; background: #F7F3ED; padding: 25px; border-radius: 12px; text-align: center;">
                  <p style="color: #666; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">Designs Sold</p>
                  <p style="color: #0B1B36; font-size: 24px; font-weight: bold; margin: 0;">${earnings.length}</p>
                </div>
              </div>
              
              <!-- Earnings Breakdown -->
              <div style="background: white; border: 1px solid #eee; border-radius: 12px; overflow: hidden; margin: 30px 0;">
                <div style="background: #0B1B36; padding: 15px 20px;">
                  <h3 style="color: white; margin: 0; font-size: 16px;">Earnings Breakdown</h3>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #F7F3ED;">
                      <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666;">Design</th>
                      <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Sale</th>
                      <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Commission</th>
                      <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #666;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${earningsRows}
                  </tbody>
                  <tfoot>
                    <tr style="background: #F7F3ED; font-weight: bold;">
                      <td style="padding: 15px;">Total</td>
                      <td style="padding: 15px; text-align: right;">${formatCurrency(totalSales)}</td>
                      <td style="padding: 15px; text-align: right; color: #D4AF37;">${formatCurrency(totalCommission)}</td>
                      <td style="padding: 15px; text-align: center;">—</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <!-- Payout Info -->
              <div style="background: #F7F3ED; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #0B1B36; font-size: 14px; margin: 0;">
                  <strong>💸 Payout Status:</strong><br><br>
                  ${paidCount > 0 ? `✅ ${paidCount} payment(s) already processed<br>` : ''}
                  ${pendingCount > 0 ? `⏳ ${pendingCount} payment(s) pending - will be processed by the 15th of this month` : ''}
                  ${paidCount === 0 && pendingCount === 0 ? 'All payments have been processed' : ''}
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ramesses.com/creator-dashboard" style="background: #D4AF37; color: #0B1B36; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  View Full Dashboard
                </a>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for being part of the Ramesses Creator community!<br>
                <strong style="color: #0B1B36;">The Ramesses Team</strong>
              </p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px;">
                  © ${new Date().getFullYear()} Ramesses Jewelry. All rights reserved.
                </p>
              </div>
            </div>
          `
        });
        
        emailsSent.push(userData.user.email);
        console.log(`Monthly summary sent to ${creator.display_name}`);
      } catch (emailError) {
        console.error(`Error sending email to ${creator.display_name}:`, emailError);
        errors.push(`Failed to send email to ${creator.display_name}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        period,
        emails_sent: emailsSent.length,
        recipients: emailsSent,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error sending monthly summaries:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
