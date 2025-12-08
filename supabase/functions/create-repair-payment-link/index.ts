import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreatePaymentLinkRequest {
  repair_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("create-repair-payment-link invoked");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const shopifyAccessToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN")!;
    
    const shopifyDomain = "0hag3q-aj.myshopify.com";
    const shopifyAdminApiVersion = "2025-01";

    // Get the authorization header to validate user
    const authHeader = req.headers.get("authorization");
    
    // Create admin client for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user client to verify auth
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader || "" } }
    });

    // Parse request
    const { repair_id }: CreatePaymentLinkRequest = await req.json();
    
    if (!repair_id) {
      throw new Error("repair_id is required");
    }

    console.log("Processing repair_id:", repair_id);

    // Fetch the repair quote
    const { data: repair, error: repairError } = await supabaseAdmin
      .from("repair_quotes")
      .select("*")
      .eq("id", repair_id)
      .single();

    if (repairError || !repair) {
      console.error("Repair not found:", repairError);
      throw new Error("Repair quote not found");
    }

    console.log("Found repair:", repair.id, "email:", repair.email, "quoted_price:", repair.quoted_price);

    // Validate quoted price
    if (!repair.quoted_price || repair.quoted_price <= 0) {
      throw new Error("Repair does not have a valid quoted price");
    }

    // Check if user is authorized (either owns the repair or email matches)
    const { data: { user } } = await supabaseUser.auth.getUser();
    
    if (user) {
      // Authenticated user - check ownership
      if (repair.user_id && repair.user_id !== user.id) {
        throw new Error("Not authorized to access this repair");
      }
    } else {
      // Guest flow - we allow it if they have the repair_id (link from email)
      console.log("Guest access for repair:", repair_id);
    }

    // Check if we already have a valid payment link
    if (repair.payment_link_url && repair.payment_status === 'pending') {
      console.log("Returning existing payment link");
      return new Response(
        JSON.stringify({
          success: true,
          payment_link_url: repair.payment_link_url,
          existing: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create a Shopify Draft Order using Admin API
    const draftOrderData = {
      draft_order: {
        line_items: [
          {
            title: `Jewelry Repair – Repair #${repair_id.slice(0, 8)}`,
            price: repair.quoted_price.toString(),
            quantity: 1,
            taxable: true,
          }
        ],
        email: repair.email,
        note: `Repair Quote ID: ${repair_id}\nItem: ${repair.item_type || 'Jewelry'}\nRepair Type: ${repair.repair_type || 'General Repair'}`,
        tags: `repair,repair-${repair_id}`,
        use_customer_default_address: false,
      }
    };

    console.log("Creating Shopify draft order:", JSON.stringify(draftOrderData));

    const draftOrderResponse = await fetch(
      `https://${shopifyDomain}/admin/api/${shopifyAdminApiVersion}/draft_orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyAccessToken,
        },
        body: JSON.stringify(draftOrderData),
      }
    );

    if (!draftOrderResponse.ok) {
      const errorText = await draftOrderResponse.text();
      console.error("Shopify draft order creation failed:", errorText);
      throw new Error(`Failed to create Shopify draft order: ${errorText}`);
    }

    const draftOrderResult = await draftOrderResponse.json();
    const draftOrder = draftOrderResult.draft_order;

    console.log("Draft order created:", draftOrder.id, "invoice_url:", draftOrder.invoice_url);

    // The invoice_url is the payment link for the draft order
    const paymentLinkUrl = draftOrder.invoice_url;

    if (!paymentLinkUrl) {
      throw new Error("No invoice URL returned from Shopify");
    }

    // Update the repair quote with payment info
    const { error: updateError } = await supabaseAdmin
      .from("repair_quotes")
      .update({
        payment_link_url: paymentLinkUrl,
        payment_status: "pending",
        shopify_reference: draftOrder.id.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", repair_id);

    if (updateError) {
      console.error("Error updating repair with payment link:", updateError);
      throw new Error("Failed to save payment link");
    }

    console.log("Repair updated with payment link");

    return new Response(
      JSON.stringify({
        success: true,
        payment_link_url: paymentLinkUrl,
        shopify_reference: draftOrder.id.toString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error creating repair payment link:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
