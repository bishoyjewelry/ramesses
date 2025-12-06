import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateDesignRequest {
  action: "create" | "update" | "publish" | "archive";
  design_id?: string;
  creator_profile_id: string;
  title: string;
  description?: string;
  main_image_url: string;
  gallery_image_urls?: string[];
  category: string;
  base_price: number;
  base_cost_estimate?: number;
  allowed_metals?: string[];
  stone_options?: object;
  commission_type?: string;
  commission_value?: number;
}

interface UpdateDesignRequest {
  action: "update" | "publish" | "archive" | "reject";
  design_id: string;
  updates?: Partial<CreateDesignRequest>;
  admin_notes?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { action } = body;

    // Check if user is admin
    const { data: isAdmin } = await supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" });

    // Check if user is a creator
    const { data: creatorProfile } = await supabase
      .from("creator_profiles")
      .select("id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    console.log(`User ${user.id} performing ${action} on design. Admin: ${isAdmin}, Creator: ${!!creatorProfile}`);

    if (action === "create") {
      // Only admins can create designs (on behalf of creators)
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required to create designs" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const {
        creator_profile_id,
        title,
        description,
        main_image_url,
        gallery_image_urls,
        category,
        base_price,
        base_cost_estimate,
        allowed_metals,
        stone_options,
        commission_type,
        commission_value
      } = body;

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + "-" + Date.now();

      const { data: design, error: createError } = await supabase
        .from("designs")
        .insert({
          creator_profile_id,
          title,
          slug,
          description,
          main_image_url,
          gallery_image_urls: gallery_image_urls || [],
          category,
          base_price,
          base_cost_estimate,
          allowed_metals: allowed_metals || [],
          stone_options,
          commission_type: commission_type || "percentage",
          commission_value: commission_value || 10,
          status: "pending_approval"
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating design:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create design" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, design }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "publish") {
      // Only admins can publish designs
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required to publish designs" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { design_id } = body;

      const { data: design, error: updateError } = await supabase
        .from("designs")
        .update({ 
          status: "published",
          updated_at: new Date().toISOString()
        })
        .eq("id", design_id)
        .select()
        .single();

      if (updateError) {
        console.error("Error publishing design:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to publish design" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Design published", design }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "archive" || action === "reject") {
      // Only admins can archive/reject designs
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { design_id } = body;
      const newStatus = action === "archive" ? "archived" : "rejected";

      const { data: design, error: updateError } = await supabase
        .from("designs")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", design_id)
        .select()
        .single();

      if (updateError) {
        console.error(`Error ${action}ing design:`, updateError);
        return new Response(
          JSON.stringify({ error: `Failed to ${action} design` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: `Design ${newStatus}`, design }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "update") {
      const { design_id, updates } = body;

      // Fetch the design to check ownership
      const { data: existingDesign } = await supabase
        .from("designs")
        .select("*, creator_profiles!inner(user_id)")
        .eq("id", design_id)
        .single();

      if (!existingDesign) {
        return new Response(
          JSON.stringify({ error: "Design not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Allow if admin OR if creator owns this design
      const isOwner = creatorProfile && existingDesign.creator_profile_id === creatorProfile.id;
      
      if (!isAdmin && !isOwner) {
        return new Response(
          JSON.stringify({ error: "Access denied" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // If creator updates, set status back to pending_approval
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (!isAdmin && isOwner) {
        updateData.status = "pending_approval";
      }

      const { data: design, error: updateError } = await supabase
        .from("designs")
        .update(updateData)
        .eq("id", design_id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating design:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update design" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, design }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error managing design:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
