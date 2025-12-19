import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrackingRequest {
  repairId: string;
  email?: string;
  phone?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repairId, email, phone }: TrackingRequest = await req.json();

    // Validation
    if (!repairId) {
      console.log('Track repair: Missing repair ID');
      return new Response(
        JSON.stringify({ error: 'Repair ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!email && !phone) {
      console.log('Track repair: Missing email or phone');
      return new Response(
        JSON.stringify({ error: 'Email or phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Build query - only select safe fields
    let query = supabase
      .from('repair_quotes')
      .select('id, status, description, fulfillment_method, updated_at, item_type, repair_type')
      .eq('id', repairId.trim());

    if (email) {
      query = query.ilike('email', email.trim());
    } else if (phone) {
      // Clean phone number for comparison (remove non-digits)
      const cleanPhone = phone.replace(/\D/g, '');
      // Match last 10 digits to handle various formats
      const phonePattern = cleanPhone.slice(-10);
      query = query.or(`phone.ilike.%${phonePattern}%`);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Track repair query error:', error);
      return new Response(
        JSON.stringify({ error: 'Unable to look up repair' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data) {
      console.log(`Track repair: No match found for ID ${repairId}`);
      return new Response(
        JSON.stringify({ error: 'No repair found with the provided details' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Track repair: Found repair ${repairId}`);

    // Return only safe, non-sensitive fields
    return new Response(
      JSON.stringify({
        success: true,
        repair: {
          id: data.id,
          status: data.status,
          description: data.description,
          fulfillment_method: data.fulfillment_method,
          updated_at: data.updated_at,
          item_type: data.item_type,
          repair_type: data.repair_type
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Track repair error:', err);
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
