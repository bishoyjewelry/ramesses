import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Admin notification emails - configure as needed
const ADMIN_EMAILS = ["admin@ramesses.com"]; // TODO: Move to secrets or config table

// Email template types
type TemplateType = 
  | "admin_new_cad_request"
  | "customer_cad_received"
  | "customer_quote_ready"
  | "customer_status_update";

interface EmailRequest {
  template: TemplateType;
  to_email: string;
  data: Record<string, unknown>;
}

interface StatusUpdateData {
  customer_name: string;
  new_status: string;
  design_name?: string;
  inquiry_id: string;
}

// HTML escape function to prevent XSS in email templates
function escapeHtml(str: unknown): string {
  const s = String(str ?? '');
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return s.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

// Brand styling constants
const BRAND_COLORS = {
  primary: "#d4af37",
  dark: "#1a1a2e",
  text: "#333333",
  muted: "#666666",
  light: "#faf9f7",
  border: "#e5e2dc",
};

// Base email wrapper
function wrapEmailHtml(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Georgia', serif; background-color: ${BRAND_COLORS.light}; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid ${BRAND_COLORS.border};">
        <!-- Header -->
        <div style="background-color: ${BRAND_COLORS.dark}; padding: 32px; text-align: center;">
          <h1 style="color: ${BRAND_COLORS.primary}; margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 2px;">
            RAMESSES
          </h1>
          <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 12px; letter-spacing: 1px;">
            MASTER JEWELER • EST. 47TH STREET
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 32px;">
          ${content}
        </div>
        
        <!-- Footer -->
        <div style="background-color: ${BRAND_COLORS.dark}; padding: 24px; text-align: center;">
          <p style="color: ${BRAND_COLORS.primary}; margin: 0 0 8px 0; font-size: 14px;">
            Ramesses Jewelry
          </p>
          <p style="color: #a0a0a0; margin: 0; font-size: 12px;">
            47th Street Diamond District • New York
          </p>
          <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 11px;">
            Questions? Reply to this email or visit our website.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template: Admin receives new CAD request
function adminNewCadRequestTemplate(data: Record<string, unknown>): { subject: string; html: string } {
  const { 
    customer_email, 
    customer_name,
    inquiry_id, 
    design_type, 
    design_name, 
    design_overview,
    is_direct_upload,
    admin_link 
  } = data;

  const subject = `New CAD Request: ${escapeHtml(design_name) || 'Direct Upload'} (${escapeHtml(customer_email)})`;
  
  const content = `
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      <strong>New CAD Request Received</strong>
    </p>
    
    <div style="background-color: ${BRAND_COLORS.light}; border: 1px solid ${BRAND_COLORS.border}; padding: 20px; margin: 0 0 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.muted}; font-size: 14px;">Customer:</td>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-size: 14px;">${escapeHtml(customer_name)} (${escapeHtml(customer_email)})</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.muted}; font-size: 14px;">Inquiry ID:</td>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-size: 14px; font-family: monospace;">${escapeHtml(inquiry_id)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.muted}; font-size: 14px;">Type:</td>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-size: 14px;">${escapeHtml(design_type)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.muted}; font-size: 14px;">Source:</td>
          <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-size: 14px;">${is_direct_upload ? 'Direct Upload' : 'AI Design'}</td>
        </tr>
      </table>
    </div>

    ${!is_direct_upload && design_name ? `
    <div style="margin: 0 0 24px 0;">
      <p style="color: ${BRAND_COLORS.muted}; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Design Name</p>
      <p style="color: ${BRAND_COLORS.text}; font-size: 16px; margin: 0; font-weight: bold;">${escapeHtml(design_name)}</p>
    </div>
    ` : ''}

    ${design_overview ? `
    <div style="margin: 0 0 24px 0;">
      <p style="color: ${BRAND_COLORS.muted}; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Overview</p>
      <p style="color: ${BRAND_COLORS.text}; font-size: 14px; margin: 0; line-height: 1.5;">${escapeHtml(design_overview)}</p>
    </div>
    ` : ''}
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${escapeHtml(admin_link)}" 
         style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.dark}; padding: 16px 40px; 
                text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 1px;
                text-transform: uppercase;">
        View in CAD Queue
      </a>
    </div>
  `;

  return { subject, html: wrapEmailHtml(content) };
}

// Template: Customer receives confirmation
function customerCadReceivedTemplate(data: Record<string, unknown>): { subject: string; html: string } {
  const { customer_name, design_name, has_design, account_link } = data;

  const subject = "We received your custom design request";
  
  const content = `
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Dear ${escapeHtml(customer_name)},
    </p>
    
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for submitting your ${design_name ? `"${escapeHtml(design_name)}"` : 'custom jewelry'} design for CAD review!
    </p>
    
    <div style="background-color: ${BRAND_COLORS.light}; border-left: 3px solid ${BRAND_COLORS.primary}; padding: 20px; margin: 24px 0;">
      <p style="color: ${BRAND_COLORS.text}; font-size: 14px; line-height: 1.6; margin: 0;">
        <strong>What happens next:</strong><br><br>
        1. Our 47th Street master jewelers will review your design<br>
        2. We'll prepare a detailed quote for materials and craftsmanship<br>
        3. You'll receive an email with your quote (typically within 1-2 business days)<br>
        4. Once approved, we begin creating your custom piece
      </p>
    </div>
    
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 24px 0;">
      You can track the status of your design anytime in your account.
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${escapeHtml(account_link)}" 
         style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.dark}; padding: 16px 40px; 
                text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 1px;
                text-transform: uppercase;">
        ${has_design ? 'View My Designs' : 'View My Account'}
      </a>
    </div>
    
    <p style="color: ${BRAND_COLORS.muted}; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
      Questions? Simply reply to this email — we're here to help bring your vision to life.
    </p>
  `;

  return { subject, html: wrapEmailHtml(content) };
}

// Template: Customer receives quote
function customerQuoteReadyTemplate(data: Record<string, unknown>): { subject: string; html: string } {
  const { customer_name, quote_amount, design_name, message, account_link } = data;

  const subject = `Your Custom Jewelry Quote Is Ready`;
  
  const content = `
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Dear ${escapeHtml(customer_name)},
    </p>
    
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Great news! We've reviewed your ${escapeHtml(design_name) || 'custom jewelry'} request and are pleased to provide you with a quote.
    </p>
    
    <!-- Quote Box -->
    <div style="background-color: ${BRAND_COLORS.light}; border: 2px solid ${BRAND_COLORS.primary}; padding: 24px; text-align: center; margin: 32px 0;">
      <p style="color: ${BRAND_COLORS.muted}; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
        Your Quote
      </p>
      <p style="color: ${BRAND_COLORS.dark}; font-size: 36px; font-weight: bold; margin: 0;">
        $${Number(quote_amount).toLocaleString()}
      </p>
    </div>
    
    ${message ? `
    <div style="background-color: #f5f5f5; padding: 20px; border-left: 3px solid ${BRAND_COLORS.primary}; margin: 24px 0;">
      <p style="color: ${BRAND_COLORS.text}; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
        "${escapeHtml(message)}"
      </p>
      <p style="color: ${BRAND_COLORS.muted}; font-size: 12px; margin: 12px 0 0 0;">
        — Your Ramessés Design Team
      </p>
    </div>
    ` : ''}
    
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 24px 0;">
      This quote includes all materials, craftsmanship, and quality assurance by our master jeweler. 
      To proceed with your custom piece, simply log into your account to review and approve.
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${escapeHtml(account_link)}" 
         style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.dark}; padding: 16px 40px; 
                text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 1px;
                text-transform: uppercase;">
        Review & Approve Quote
      </a>
    </div>
    
    <p style="color: ${BRAND_COLORS.muted}; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
      Questions about your quote? Reply to this email or call us directly. We're here to help.
    </p>
  `;

  return { subject, html: wrapEmailHtml(content) };
}

// Template: Customer status update
function customerStatusUpdateTemplate(data: Record<string, unknown>): { subject: string; html: string } {
  const { customer_name, new_status, design_name, account_link } = data as unknown as StatusUpdateData & { account_link: string };

  const statusMessages: Record<string, { subject: string; headline: string; body: string }> = {
    reviewed: {
      subject: "Your design has been reviewed",
      headline: "Design Reviewed",
      body: "Great news! Our team has reviewed your design and we're preparing a detailed quote for you. You'll receive it shortly.",
    },
    quoted: {
      subject: "Your custom jewelry quote is ready",
      headline: "Quote Ready",
      body: "We've prepared a quote for your custom piece. Please log into your account to review the details and approve to proceed.",
    },
    approved: {
      subject: "Your design has been approved for CAD",
      headline: "Approved for CAD",
      body: "Thank you for approving the quote! Our CAD team will begin working on your design shortly.",
    },
    in_cad: {
      subject: "Your design is now in CAD",
      headline: "Your Design is Being Created",
      body: "Our CAD team has started working on your design. We're translating your vision into precise technical specifications that will guide our master jewelers.",
    },
    cad_complete: {
      subject: "Your CAD design is complete",
      headline: "CAD Complete - Review Required",
      body: "We've completed the CAD work on your design. Please log into your account to review and approve the final design before production begins.",
    },
    production_ready: {
      subject: "Your piece is ready for production",
      headline: "Production Ready",
      body: "Your design has been finalized and is ready to begin production. Our master jewelers will start handcrafting your piece.",
    },
    completed: {
      subject: "Your custom jewelry is complete",
      headline: "Your Piece is Ready!",
      body: "Congratulations! Your custom piece has been completed. We'll be in touch shortly with shipping details and delivery information.",
    },
    declined: {
      subject: "Your order has been closed",
      headline: "Order Closed",
      body: "Your custom jewelry order has been closed. If you have any questions or would like to restart your project, please don't hesitate to reach out.",
    },
  };

  const statusInfo = statusMessages[new_status] || {
    subject: `Update on your custom jewelry order`,
    headline: "Status Update",
    body: `Your order status has been updated to: ${escapeHtml(new_status)}`,
  };

  const content = `
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Dear ${escapeHtml(customer_name)},
    </p>
    
    <h2 style="color: ${BRAND_COLORS.dark}; font-size: 24px; margin: 0 0 16px 0; font-weight: normal;">
      ${statusInfo.headline}
    </h2>
    
    ${design_name ? `
    <p style="color: ${BRAND_COLORS.muted}; font-size: 14px; margin: 0 0 24px 0;">
      Design: <strong style="color: ${BRAND_COLORS.text};">${escapeHtml(design_name)}</strong>
    </p>
    ` : ''}
    
    <p style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      ${statusInfo.body}
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${escapeHtml(account_link)}" 
         style="display: inline-block; background-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.dark}; padding: 16px 40px; 
                text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 1px;
                text-transform: uppercase;">
        View in My Account
      </a>
    </div>
    
    <p style="color: ${BRAND_COLORS.muted}; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
      Questions? Reply to this email — we're always here to help.
    </p>
  `;

  return { subject: statusInfo.subject, html: wrapEmailHtml(content) };
}

// Main email generation function
function generateEmail(template: TemplateType, data: Record<string, unknown>): { subject: string; html: string } {
  switch (template) {
    case "admin_new_cad_request":
      return adminNewCadRequestTemplate(data);
    case "customer_cad_received":
      return customerCadReceivedTemplate(data);
    case "customer_quote_ready":
      return customerQuoteReadyTemplate(data);
    case "customer_status_update":
      return customerStatusUpdateTemplate(data);
    default:
      throw new Error(`Unknown template: ${template}`);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { template, to_email, data }: EmailRequest = await req.json();

    if (!template || !to_email || !data) {
      return new Response(JSON.stringify({ error: "Missing required fields: template, to_email, data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Sending ${template} email to ${to_email}`);

    // Generate email content
    const { subject, html } = generateEmail(template, data);

    // Send via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ramesses Jewelry <onboarding@resend.dev>",
        to: [to_email],
        subject,
        html,
      }),
    });

    const emailResult = await emailResponse.json();
    const success = emailResponse.ok;

    // Log email to database
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    await supabaseAdmin.from("email_logs").insert({
      to_email,
      template,
      subject,
      related_inquiry_id: data.inquiry_id as string || null,
      related_design_id: data.design_id as string || null,
      metadata: data,
      status: success ? "sent" : "failed",
      error_message: success ? null : JSON.stringify(emailResult),
    });

    if (!success) {
      console.error("Resend API error:", emailResult);
      return new Response(JSON.stringify({ error: "Failed to send email", details: emailResult }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Email sent successfully: ${emailResult.id}`);

    return new Response(JSON.stringify({ success: true, email_id: emailResult.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-cad-workflow-email:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
