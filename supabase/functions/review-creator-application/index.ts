import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewRequest {
  application_id: string;
  action: "approve" | "reject";
  reviewer_notes?: string;
  display_name?: string; // For approved creators
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the JWT from the request to identify the admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role using the has_role function
    const { data: isAdmin } = await supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { application_id, action, reviewer_notes, display_name }: ReviewRequest = await req.json();

    console.log(`Admin ${user.id} reviewing application ${application_id} - Action: ${action}`);

    // Fetch the application
    const { data: application, error: fetchError } = await supabase
      .from("creator_applications")
      .select("*")
      .eq("id", application_id)
      .single();

    if (fetchError || !application) {
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (application.status === "approved" || application.status === "rejected") {
      return new Response(
        JSON.stringify({ error: "Application has already been reviewed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "approve") {
      // Create creator profile
      const { data: creatorProfile, error: profileError } = await supabase
        .from("creator_profiles")
        .insert({
          user_id: application.user_id,
          display_name: display_name || application.name,
          status: "active"
        })
        .select()
        .single();

      if (profileError) {
        console.error("Error creating creator profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Failed to create creator profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add creator role to user
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: application.user_id, 
          role: "creator" 
        }, { 
          onConflict: "user_id,role" 
        });

      if (roleError) {
        console.error("Error adding creator role:", roleError);
      }

      // Update application status
      await supabase
        .from("creator_applications")
        .update({
          status: "approved",
          reviewer_id: user.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", application_id);

      // Send approval email
      try {
        await resend.emails.send({
          from: "Ramessés Jewelry <onboarding@resend.dev>",
          to: [application.email],
          subject: "🎉 Welcome to the Ramessés Creator Marketplace!",
          html: `
            <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px;">Congratulations!</h1>
                <div style="width: 60px; height: 2px; background: #D4AF37; margin: 0 auto;"></div>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${application.name},</p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We're thrilled to welcome you to the <strong>Ramessés Creator Marketplace</strong>! 
                Your application has been approved, and you're now officially a Ramessés Creator.
              </p>
              
              <div style="background: linear-gradient(135deg, #0B1B36 0%, #15233E 100%); padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
                <p style="color: #D4AF37; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                  What You Can Do Now:
                </p>
                <ul style="color: white; text-align: left; font-size: 14px; line-height: 2;">
                  <li>Submit your custom jewelry designs for publication</li>
                  <li>Earn commissions when customers order your designs</li>
                  <li>Track your earnings in your Creator Dashboard</li>
                  <li>Build your portfolio within the Ramessés ecosystem</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ramesses.com/creator-dashboard" style="background: #D4AF37; color: #0B1B36; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Access Your Creator Dashboard
                </a>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Our team is here to support you every step of the way. If you have questions about 
                submitting designs or the commission structure, feel free to reach out.
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Welcome to the family!<br>
                <strong style="color: #0B1B36;">The Ramessés Team</strong>
              </p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px;">
                  © ${new Date().getFullYear()} Ramessés Jewelry. All rights reserved.
                </p>
              </div>
            </div>
          `
        });
        console.log("Approval email sent");
      } catch (emailError) {
        console.error("Error sending approval email:", emailError);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Application approved",
          creator_profile_id: creatorProfile.id 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "reject") {
      // Update application status
      await supabase
        .from("creator_applications")
        .update({
          status: "rejected",
          reviewer_id: user.id,
          notes: reviewer_notes ? `${application.notes || ""}\n\nReviewer Notes: ${reviewer_notes}` : application.notes,
          updated_at: new Date().toISOString()
        })
        .eq("id", application_id);

      // Send rejection email
      try {
        await resend.emails.send({
          from: "Ramessés Jewelry <onboarding@resend.dev>",
          to: [application.email],
          subject: "Update on Your Creator Application",
          html: `
            <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #0B1B36; font-size: 28px; margin-bottom: 10px;">Application Update</h1>
                <div style="width: 60px; height: 2px; background: #D4AF37; margin: 0 auto;"></div>
              </div>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${application.name},</p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in becoming a Ramessés Creator. After careful review, 
                we've decided not to move forward with your application at this time.
              </p>
              
              ${reviewer_notes ? `
              <div style="background: #F7F3ED; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #0B1B36; font-size: 14px; margin: 0;">
                  <strong>Feedback:</strong><br>
                  ${reviewer_notes}
                </p>
              </div>
              ` : ''}
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                This decision is not permanent. We encourage you to continue developing your craft 
                and reapply in the future with new designs or an updated portfolio.
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for your understanding.<br>
                <strong style="color: #0B1B36;">The Ramessés Team</strong>
              </p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #888; font-size: 12px;">
                  © ${new Date().getFullYear()} Ramessés Jewelry. All rights reserved.
                </p>
              </div>
            </div>
          `
        });
        console.log("Rejection email sent");
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
      }

      return new Response(
        JSON.stringify({ success: true, message: "Application rejected" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error reviewing application:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
