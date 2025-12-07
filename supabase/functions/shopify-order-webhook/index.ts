import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-shopify-topic, x-shopify-hmac-sha256, x-shopify-shop-domain",
};

interface ShopifyLineItem {
  id: number;
  title: string;
  quantity: number;
  price: string;
  product_id: number;
  variant_id: number;
  sku: string | null;
  name: string;
  properties: Array<{ name: string; value: string }>;
  vendor: string | null;
  product_exists: boolean;
}

interface ShopifyCustomer {
  id: number;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

interface ShopifyOrder {
  id: number;
  name: string; // Order number like #1001
  email: string;
  created_at: string;
  note: string | null;
  customer: ShopifyCustomer | null;
  line_items: ShopifyLineItem[];
  shipping_address?: {
    first_name: string;
    last_name: string;
    phone: string | null;
  };
}

// Configuration for identifying repair products
const REPAIR_IDENTIFIERS = {
  // Product handles that indicate a repair service
  handles: ["repair", "jewelry-repair", "ring-repair", "chain-repair", "watch-repair"],
  // Product types that indicate a repair
  productTypes: ["repair", "service", "jewelry repair"],
  // Tags that indicate a repair (checked against line item title/name)
  titleKeywords: ["repair", "restore", "fix", "resize", "polish", "refinish", "solder"],
  // SKU prefixes for repair services
  skuPrefixes: ["REP-", "REPAIR-", "SVC-"],
};

// Check if a line item is a repair product
function isRepairLineItem(item: ShopifyLineItem): boolean {
  const title = item.title.toLowerCase();
  const name = item.name.toLowerCase();
  const sku = (item.sku || "").toUpperCase();

  // Check title/name for repair keywords
  for (const keyword of REPAIR_IDENTIFIERS.titleKeywords) {
    if (title.includes(keyword) || name.includes(keyword)) {
      console.log(`Line item "${item.title}" matched keyword: ${keyword}`);
      return true;
    }
  }

  // Check SKU prefix
  for (const prefix of REPAIR_IDENTIFIERS.skuPrefixes) {
    if (sku.startsWith(prefix)) {
      console.log(`Line item "${item.title}" matched SKU prefix: ${prefix}`);
      return true;
    }
  }

  // Check vendor (if "Ramesses Repair" or similar)
  if (item.vendor && item.vendor.toLowerCase().includes("repair")) {
    console.log(`Line item "${item.title}" matched vendor: ${item.vendor}`);
    return true;
  }

  return false;
}

// Extract repair type from line item
function extractRepairType(item: ShopifyLineItem): string {
  // Check properties for repair type
  const repairTypeProp = item.properties?.find(
    (p) => p.name.toLowerCase() === "repair type" || p.name.toLowerCase() === "service type"
  );
  if (repairTypeProp) {
    return repairTypeProp.value;
  }

  // Extract from title
  const title = item.title.toLowerCase();
  if (title.includes("ring")) return "Ring Repair";
  if (title.includes("chain") || title.includes("necklace")) return "Chain Repair";
  if (title.includes("bracelet")) return "Bracelet Repair";
  if (title.includes("watch")) return "Watch Repair";
  if (title.includes("earring")) return "Earring Repair";
  if (title.includes("resize")) return "Ring Sizing";
  if (title.includes("polish")) return "Polishing";
  if (title.includes("solder")) return "Soldering";
  if (title.includes("stone") || title.includes("setting")) return "Stone Setting";
  if (title.includes("clasp")) return "Clasp Repair";
  if (title.includes("prong")) return "Prong Repair";

  return "General Repair";
}

// Extract item type from line item
function extractItemType(item: ShopifyLineItem): string {
  const title = item.title.toLowerCase();

  if (title.includes("ring")) return "ring";
  if (title.includes("chain") || title.includes("necklace")) return "necklace";
  if (title.includes("bracelet")) return "bracelet";
  if (title.includes("earring")) return "earrings";
  if (title.includes("watch")) return "watch";
  if (title.includes("pendant")) return "pendant";
  if (title.includes("brooch")) return "brooch";

  return "jewelry";
}

// Extract notes from line item properties
function extractNotes(item: ShopifyLineItem, orderNote: string | null): string {
  const notes: string[] = [];

  // Add order-level notes
  if (orderNote) {
    notes.push(`Order Note: ${orderNote}`);
  }

  // Add line item properties as notes
  if (item.properties && item.properties.length > 0) {
    for (const prop of item.properties) {
      if (prop.name && prop.value) {
        notes.push(`${prop.name}: ${prop.value}`);
      }
    }
  }

  return notes.join("\n");
}

const handler = async (req: Request): Promise<Response> => {
  console.log("shopify-order-webhook invoked");
  console.log("Method:", req.method);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Shopify headers
    const shopifyTopic = req.headers.get("x-shopify-topic");
    const shopifyShopDomain = req.headers.get("x-shopify-shop-domain");

    console.log("Shopify Topic:", shopifyTopic);
    console.log("Shop Domain:", shopifyShopDomain);

    // Parse the order payload
    const order: ShopifyOrder = await req.json();
    console.log("Order ID:", order.id);
    console.log("Order Name:", order.name);
    console.log("Line Items Count:", order.line_items?.length || 0);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Process each line item
    const repairQuotesCreated: string[] = [];

    for (const item of order.line_items) {
      console.log(`Checking line item: ${item.title}`);

      if (!isRepairLineItem(item)) {
        console.log(`Line item "${item.title}" is not a repair product, skipping`);
        continue;
      }

      console.log(`Line item "${item.title}" IS a repair product, creating repair quote`);

      // Build customer name
      let customerName = "Unknown Customer";
      if (order.customer) {
        const firstName = order.customer.first_name || "";
        const lastName = order.customer.last_name || "";
        customerName = `${firstName} ${lastName}`.trim() || "Unknown Customer";
      } else if (order.shipping_address) {
        const firstName = order.shipping_address.first_name || "";
        const lastName = order.shipping_address.last_name || "";
        customerName = `${firstName} ${lastName}`.trim() || "Unknown Customer";
      }

      // Get customer phone
      const phone = order.customer?.phone || order.shipping_address?.phone || null;

      // Build repair quote data
      const repairQuoteData = {
        name: customerName,
        email: order.email,
        phone: phone,
        item_type: extractItemType(item),
        repair_type: extractRepairType(item),
        description: `Shopify Order ${order.name} - ${item.title}\n\n${extractNotes(item, order.note)}`.trim(),
        status: "pending",
        created_at: order.created_at,
        // Note: user_id is left null - can be linked later when customer creates account
      };

      console.log("Inserting repair quote:", repairQuoteData);

      // Insert into repair_quotes
      const { data: insertedQuote, error: insertError } = await supabase
        .from("repair_quotes")
        .insert([repairQuoteData])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting repair quote:", insertError);
        continue;
      }

      console.log("Repair quote created:", insertedQuote.id);
      repairQuotesCreated.push(insertedQuote.id);
    }

    console.log(`Processed order ${order.name}: ${repairQuotesCreated.length} repair quotes created`);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        orderName: order.name,
        repairQuotesCreated: repairQuotesCreated.length,
        repairQuoteIds: repairQuotesCreated,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error processing Shopify order webhook:", error);
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
