import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin email for notifications
const ADMIN_EMAILS = ["admin@ramesses.com"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase environment variables not configured");
    }

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client and verify user
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { design_id } = await req.json();

    if (!design_id) {
      return new Response(JSON.stringify({ error: "design_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Submitting design ${design_id} for CAD review by user ${user.id}`);

    // Step 1: Load design and validate ownership
    const { data: design, error: designError } = await supabaseAdmin
      .from("user_designs")
      .select("*")
      .eq("id", design_id)
      .single();

    if (designError || !design) {
      console.error("Design fetch error:", designError);
      return new Response(JSON.stringify({ error: "Design not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (design.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "You don't have permission to submit this design" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (design.status === "submitted_for_cad") {
      return new Response(JSON.stringify({ error: "Design has already been submitted for CAD review" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: Create custom_inquiries row
    const pieceType = design.flow_type === "engagement" ? "Engagement Ring" : "Custom Jewelry";
    const description = `AI Design: ${design.name}\n\n${design.overview || ""}\n\nSpec Sheet: ${JSON.stringify(design.spec_sheet, null, 2)}`;
    const budgetRange = (design.form_inputs as Record<string, string>)?.budget || "Not specified";
    const imageUrls = [design.hero_image_url, design.side_image_url, design.top_image_url].filter(Boolean);

    const { data: inquiry, error: inquiryError } = await supabaseAdmin
      .from("custom_inquiries")
      .insert({
        user_id: user.id,
        piece_type: pieceType,
        description: description,
        budget_range: budgetRange,
        name: user.email?.split("@")[0] || "Customer",
        email: user.email || "",
        image_urls: imageUrls,
        status: "pending",
      })
      .select("id")
      .single();

    if (inquiryError) {
      console.error("Error creating custom inquiry:", inquiryError);
      throw new Error("Failed to create CAD inquiry");
    }

    console.log(`Created custom inquiry ${inquiry.id}`);

    // Step 3: Update design status and link to inquiry
    const { error: updateError } = await supabaseAdmin
      .from("user_designs")
      .update({
        status: "submitted_for_cad",
        cad_submitted_at: new Date().toISOString(),
        custom_inquiry_id: inquiry.id,
      })
      .eq("id", design_id);

    if (updateError) {
      console.error("Error updating design:", updateError);
      throw new Error("Failed to update design status");
    }

    console.log(`Design ${design_id} submitted for CAD review successfully`);

    // Step 4: Send email notifications
    const baseUrl = SUPABASE_URL.replace('.supabase.co', '.lovable.app').replace('https://mxqsqltdwqlpgeyychhk', 'https://mxqsqltdwqlpgeyychhk');
    const siteUrl = "https://ramesses.lovable.app"; // Replace with actual site URL
    
    // Send admin notification
    for (const adminEmail of ADMIN_EMAILS) {
      try {
        await supabaseAdmin.functions.invoke("send-cad-workflow-email", {
          body: {
            template: "admin_new_cad_request",
            to_email: adminEmail,
            data: {
              customer_email: user.email,
              customer_name: user.email?.split("@")[0] || "Customer",
              inquiry_id: inquiry.id,
              design_type: pieceType,
              design_name: design.name,
              design_overview: design.overview,
              is_direct_upload: false,
              admin_link: `${siteUrl}/admin/cad-queue?open=${inquiry.id}`,
            },
          },
        });
        console.log(`Admin notification sent to ${adminEmail}`);
      } catch (emailError) {
        console.error(`Failed to send admin notification to ${adminEmail}:`, emailError);
      }
    }

    // Send customer confirmation
    try {
      await supabaseAdmin.functions.invoke("send-cad-workflow-email", {
        body: {
          template: "customer_cad_received",
          to_email: user.email,
          data: {
            customer_name: user.email?.split("@")[0] || "Customer",
            design_name: design.name,
            has_design: true,
            account_link: `${siteUrl}/my-designs`,
            inquiry_id: inquiry.id,
          },
        },
      });
      console.log(`Customer confirmation sent to ${user.email}`);
    } catch (emailError) {
      console.error("Failed to send customer confirmation:", emailError);
    }

    // Step 5: Return success
    return new Response(JSON.stringify({
      success: true,
      message: "Design submitted for CAD review",
      inquiry_id: inquiry.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in submit-design-for-cad:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
