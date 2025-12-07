import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RepairStatusEmailRequest {
  repair_id: string;
  previous_status: string | null;
  new_status: string;
}

// Email content configuration based on status
const getEmailContent = (
  status: string,
  customerName: string,
  repairId: string,
  trackingNumber?: string | null
): { subject: string; heading: string; message: string } => {
  const baseContent = {
    pending: {
      subject: "We've Received Your Repair Request",
      heading: "Your Repair Request Has Been Received",
      message: `Thank you for choosing Ramessés Jewelry for your repair needs. We've received your request and our team will review it shortly. You'll receive another email once we've received your item at our workshop.`,
    },
    received: {
      subject: "Your Jewelry Has Arrived at Our Workshop",
      heading: "We've Received Your Jewelry",
      message: `Great news! Your jewelry has safely arrived at our Diamond District workshop. Our master jeweler will carefully inspect it and begin the repair process soon.`,
    },
    in_progress: {
      subject: "Your Repair Is In Progress",
      heading: "Repair Work Has Begun",
      message: `Our master jeweler has begun working on your piece. We're applying 30+ years of expertise to restore your jewelry to its best condition.`,
    },
    polishing: {
      subject: "Your Jewelry Is Being Polished",
      heading: "Final Finishing Touches",
      message: `Your repair is nearly complete! We're now polishing your piece to ensure it looks absolutely stunning when you receive it.`,
    },
    awaiting_parts: {
      subject: "Update: Awaiting Parts for Your Repair",
      heading: "Waiting for Required Materials",
      message: `We're waiting on some materials needed to complete your repair. We'll update you as soon as they arrive and work resumes.`,
    },
    completed: {
      subject: "Your Repair Is Complete",
      heading: "Your Jewelry Is Ready",
      message: `Wonderful news! Your repair has been completed. We'll be shipping it back to you shortly. You'll receive tracking information once it's on its way.`,
    },
    shipped: {
      subject: "Your Jewelry Has Shipped",
      heading: "Your Jewelry Is On Its Way",
      message: trackingNumber
        ? `Your repaired jewelry has been shipped and is on its way back to you! Your tracking number is: ${trackingNumber}`
        : `Your repaired jewelry has been shipped and is on its way back to you! You should receive it within 3-5 business days.`,
    },
  };

  return baseContent[status as keyof typeof baseContent] || {
    subject: "Update on Your Repair",
    heading: "Repair Status Update",
    message: `There's been an update on your repair. Current status: ${status}.`,
  };
};

// Generate HTML email template
const generateEmailHtml = (
  customerName: string,
  repairId: string,
  status: string,
  heading: string,
  message: string,
  trackingNumber?: string | null
): string => {
  const statusBadgeColors: Record<string, string> = {
    pending: "#EAB308",
    received: "#3B82F6",
    in_progress: "#8B5CF6",
    polishing: "#6366F1",
    awaiting_parts: "#F97316",
    completed: "#22C55E",
    shipped: "#14B8A6",
  };

  const badgeColor = statusBadgeColors[status] || "#6B7280";
  const statusLabel = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1a1a1a; font-family: Georgia, serif;">
                Ramessés Jewelry
              </h1>
              <p style="margin: 8px 0 0; color: #C6A962; font-size: 14px; letter-spacing: 1px;">
                MASTER JEWELER SINCE 1990
              </p>
            </td>
          </tr>
          
          <!-- Status Badge -->
          <tr>
            <td style="padding: 30px 40px 0; text-align: center;">
              <span style="display: inline-block; padding: 8px 20px; background-color: ${badgeColor}; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 20px;">
                ${statusLabel}
              </span>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 22px; font-weight: 600; color: #1a1a1a;">
                ${heading}
              </h2>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Dear ${customerName},
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                ${message}
              </p>
              ${trackingNumber && status === "shipped" ? `
              <div style="margin: 24px 0; padding: 16px 20px; background-color: #EFF6FF; border-radius: 8px; border-left: 4px solid #3B82F6;">
                <p style="margin: 0; font-size: 14px; color: #1E40AF;">
                  <strong>Tracking Number:</strong><br>
                  <span style="font-family: monospace; font-size: 16px;">${trackingNumber}</span>
                </p>
              </div>
              ` : ""}
            </td>
          </tr>
          
          <!-- Repair Details -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="padding: 20px; background-color: #fafafa; border-radius: 8px; border: 1px solid #e5e5e5;">
                <p style="margin: 0; font-size: 14px; color: #6b6b6b;">
                  <strong style="color: #1a1a1a;">Repair ID:</strong><br>
                  <span style="font-family: monospace; font-size: 13px;">${repairId.slice(0, 8)}...</span>
                </p>
              </div>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 30px; text-align: center;">
              <a href="https://ramessesjewelry.com/my-repairs" style="display: inline-block; padding: 14px 32px; background-color: #C6A962; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                View Repair Status
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #1a1a1a; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 12px; font-size: 14px; color: #ffffff; text-align: center;">
                Questions about your repair?
              </p>
              <p style="margin: 0; text-align: center;">
                <a href="mailto:support@ramessesjewelry.com" style="color: #C6A962; text-decoration: none; font-size: 14px;">
                  support@ramessesjewelry.com
                </a>
              </p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 12px; color: #888; text-align: center;">
                Ramessés Jewelry · Diamond District, NYC<br>
                47th Street · 30+ Years of Master Craftsmanship
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-repair-status-email function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repair_id, previous_status, new_status }: RepairStatusEmailRequest = await req.json();

    console.log(`Processing repair status email: repair_id=${repair_id}, ${previous_status} -> ${new_status}`);

    // Don't send if status hasn't changed (unless it's a new submission)
    if (previous_status === new_status && previous_status !== null) {
      console.log("Status unchanged, skipping email");
      return new Response(
        JSON.stringify({ success: true, message: "Status unchanged, no email sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch repair details
    const { data: repair, error: fetchError } = await supabase
      .from("repair_quotes")
      .select("*")
      .eq("id", repair_id)
      .single();

    if (fetchError || !repair) {
      console.error("Error fetching repair:", fetchError);
      throw new Error(`Repair not found: ${repair_id}`);
    }

    console.log(`Found repair for ${repair.name} (${repair.email})`);

    // Get email content based on status
    const { subject, heading, message } = getEmailContent(
      new_status,
      repair.name,
      repair_id,
      repair.tracking_number
    );

    // Generate HTML email
    const html = generateEmailHtml(
      repair.name,
      repair_id,
      new_status,
      heading,
      message,
      repair.tracking_number
    );

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Ramessés Jewelry <onboarding@resend.dev>",
      to: [repair.email],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        emailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-repair-status-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
