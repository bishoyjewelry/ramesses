import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationRequest {
  name: string;
  email: string;
  notes?: string;
  submitted_design_image_urls?: string[];
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { name, email, notes, submitted_design_image_urls }: ApplicationRequest = await req.json();

    console.log("Processing creator application for:", email);

    // Validate required fields
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user exists in auth.users
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      console.log("Found existing user:", userId);
    } else {
      // Create a new user with a random password (they'll need to reset it)
      const tempPassword = crypto.randomUUID();
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: false,
        user_metadata: { name, source: 'creator_application' }
      });

      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create user account" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = newUser.user.id;
      console.log("Created new user:", userId);

      // Assign customer role to new user
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "customer" });

      if (roleError) {
        console.error("Error assigning customer role:", roleError);
      }
    }

    // Check for existing pending application
    const { data: existingApp } = await supabase
      .from("creator_applications")
      .select("id, status")
      .eq("user_id", userId)
      .in("status", ["new", "under_review"])
      .maybeSingle();

    if (existingApp) {
      return new Response(
        JSON.stringify({ error: "You already have a pending application" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the creator application
    const { data: application, error: appError } = await supabase
      .from("creator_applications")
      .insert({
        user_id: userId,
        name,
        email,
        notes: notes || null,
        submitted_design_image_urls: submitted_design_image_urls || [],
        status: "new"
      })
      .select()
      .single();

    if (appError) {
      console.error("Error creating application:", appError);
      return new Response(
        JSON.stringify({ error: "Failed to submit application" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Application created:", application.id);

    // Send confirmation email to applicant
    try {
      await resend.emails.send({
        from: "Ramessés Jewelry <onboarding@resend.dev>",
        to: [email],
        subject: "Your Creator Application Has Been Received",
        html: `
          <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #0B1B36; font-size: 28px; margin-bottom: 10px;">Application Received</h1>
              <div style="width: 60px; height: 2px; background: #D4AF37; margin: 0 auto;"></div>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear ${name},</p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Thank you for applying to become a creator on the Ramessés Creator Marketplace. 
              We're excited to review your application and designs.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Our team will review your submission within 3-5 business days. 
              You'll receive an email once a decision has been made.
            </p>
            
            <div style="background: #F7F3ED; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #0B1B36; font-size: 14px; margin: 0;">
                <strong>What happens next?</strong><br>
                • Our team reviews your portfolio and designs<br>
                • We evaluate fit with the Ramessés brand<br>
                • You'll receive approval or feedback via email
              </p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              If you have any questions, feel free to reply to this email.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Best regards,<br>
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
      console.log("Confirmation email sent to applicant");
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification to admin (you can customize this email)
    try {
      await resend.emails.send({
        from: "Ramessés System <onboarding@resend.dev>",
        to: ["admin@ramesses.com"], // Update with actual admin email
        subject: `New Creator Application: ${name}`,
        html: `
          <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0B1B36;">New Creator Application</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Notes:</strong> ${notes || "None provided"}</p>
            <p><strong>Images Submitted:</strong> ${submitted_design_image_urls?.length || 0}</p>
            <p style="margin-top: 20px;">
              <a href="${supabaseUrl}" style="background: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Review in Admin Dashboard
              </a>
            </p>
          </div>
        `
      });
      console.log("Admin notification sent");
    } catch (emailError) {
      console.error("Error sending admin notification:", emailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Application submitted successfully",
        application_id: application.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error processing application:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
