import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  inquiry_id: string;
  customer_email: string;
  customer_name: string;
  quote_amount: number;
  message?: string;
  design_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      inquiry_id, 
      customer_email, 
      customer_name, 
      quote_amount, 
      message, 
      design_name 
    }: QuoteEmailRequest = await req.json();

    console.log(`Sending quote email to ${customer_email} for inquiry ${inquiry_id}`);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Generate account link
    const accountLink = "https://ramesses.com/account";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Georgia', serif; background-color: #faf9f7; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e2dc;">
          <!-- Header -->
          <div style="background-color: #1a1a2e; padding: 32px; text-align: center;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px; font-weight: normal; letter-spacing: 2px;">
              RAMESSÉS
            </h1>
            <p style="color: #a0a0a0; margin: 8px 0 0 0; font-size: 12px; letter-spacing: 1px;">
              MASTER JEWELER • EST. 47TH STREET
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 32px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Dear ${customer_name},
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Thank you for your interest in creating a custom piece with Ramessés. 
              We've reviewed your ${design_name || 'custom jewelry'} request and are pleased to provide you with a quote.
            </p>
            
            <!-- Quote Box -->
            <div style="background-color: #faf9f7; border: 2px solid #d4af37; padding: 24px; text-align: center; margin: 32px 0;">
              <p style="color: #666; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
                Your Quote
              </p>
              <p style="color: #1a1a2e; font-size: 36px; font-weight: bold; margin: 0;">
                $${quote_amount.toLocaleString()}
              </p>
            </div>
            
            ${message ? `
            <div style="background-color: #f5f5f5; padding: 20px; border-left: 3px solid #d4af37; margin: 24px 0;">
              <p style="color: #333; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">
                "${message}"
              </p>
              <p style="color: #666; font-size: 12px; margin: 12px 0 0 0;">
                — Your Ramessés Design Team
              </p>
            </div>
            ` : ''}
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 24px 0;">
              This quote includes all materials, craftsmanship, and quality assurance by our master jeweler. 
              To proceed with your custom piece, simply log into your account and approve the quote.
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${accountLink}" 
                 style="display: inline-block; background-color: #d4af37; color: #1a1a2e; padding: 16px 40px; 
                        text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 1px;
                        text-transform: uppercase;">
                View in Your Account
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
              Questions? Reply to this email or call us directly. We're here to help bring your vision to life.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #1a1a2e; padding: 24px; text-align: center;">
            <p style="color: #d4af37; margin: 0 0 8px 0; font-size: 14px;">
              Ramessés Jewelry
            </p>
            <p style="color: #a0a0a0; margin: 0; font-size: 12px;">
              47th Street Diamond District • New York
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ramessés Jewelry <onboarding@resend.dev>",
        to: [customer_email],
        subject: `Your Custom Jewelry Quote - $${quote_amount.toLocaleString()}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Quote email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-cad-quote-email function:", error);
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
