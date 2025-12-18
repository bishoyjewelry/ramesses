import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConceptSpec {
  name: string;
  overview: string;
  metal: string;
  center_stone: {
    shape: string;
    size_mm: string;
    type: string;
    approx_ct?: string;
  };
  setting_style: string;
  band: {
    width_mm: string;
    style: string;
    pave: string;
    shoulders: string;
  };
  gallery_details: string;
  prongs: string;
  accent_stones: string;
  manufacturing_notes: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
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

    // Create Supabase client with user's auth
    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { design_id, num_concepts = 2 } = await req.json();

    if (!design_id) {
      return new Response(JSON.stringify({ error: "design_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Loading design ${design_id} for user ${user.id}`);

    // Load the design using service role client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
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

    // Verify ownership
    if (design.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "You don't have permission to access this design" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Generating ${num_concepts} variations for design: ${design.name}`);

    // Extract specs and inputs
    const specSheet = design.spec_sheet || {};
    const formInputs = design.form_inputs || {};
    const flowType = design.flow_type || "engagement";

    // Build the system prompt for variations
    const systemPrompt = `You are a senior jewelry designer preparing structured design briefs for a CAD and bench jewelry team on NYC's 47th Street.

Your job is to create ${num_concepts} NEW VARIATIONS of an existing ring concept. Each variation should be inspired by the original but with meaningful differences in style, setting, or details.

ORIGINAL DESIGN REFERENCE:
${JSON.stringify(specSheet, null, 2)}

ORIGINAL CLIENT INPUTS:
${JSON.stringify(formInputs, null, 2)}

Design rules for variations:
- Keep the same general project type (${flowType === "engagement" ? "engagement ring" : "custom jewelry"})
- Maintain the client's stated preferences (metal type, budget range, stone preferences) unless creating an intentional upgrade variant
- Each variation should feel distinct but cohesive with the client's taste
- All designs must be physically manufacturable with standard casting and stone-setting techniques
- Proportions must be realistic: band thickness, prong sizes, stone heights, pavé coverage
- Avoid fragile, impossible, or gimmicky details

Output format:
Return a JSON object with a "concepts" array containing exactly ${num_concepts} elements. Each element must match this schema:

{
  "concepts": [
    {
      "name": "Short, premium concept name",
      "overview": "1–3 sentence summary in client-friendly language",
      "metal": "e.g. 14k yellow gold",
      "center_stone": {
        "shape": "stone shape",
        "size_mm": "approx size in millimeters",
        "type": "stone type",
        "approx_ct": "approximate carat weight"
      },
      "setting_style": "e.g. 4-prong solitaire, bezel, halo",
      "band": {
        "width_mm": "realistic band width (1.8–2.4mm typical)",
        "style": "e.g. plain, knife-edge, comfort fit",
        "pave": "pavé coverage description",
        "shoulders": "shoulder design description"
      },
      "gallery_details": "gallery architecture details",
      "prongs": "prong style and count",
      "accent_stones": "side stones/halo/pavé details",
      "manufacturing_notes": "1–3 bullet notes for CAD/bench"
    }
  ]
}

IMPORTANT: Return ONLY the JSON object. No markdown, no code blocks, no explanation.`;

    // Call AI to generate concept variations
    console.log("Calling Lovable AI for concept generation...");
    
    const conceptResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate ${num_concepts} distinct variations of this design. Make each one feel fresh while respecting the client's core preferences.` }
        ],
      }),
    });

    if (!conceptResponse.ok) {
      const errorText = await conceptResponse.text();
      console.error("AI concept generation failed:", conceptResponse.status, errorText);
      
      if (conceptResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (conceptResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to generate design variations");
    }

    const conceptData = await conceptResponse.json();
    const specsText = conceptData.choices?.[0]?.message?.content;

    if (!specsText) {
      throw new Error("No content returned from AI");
    }

    // Parse the JSON response
    let specs;
    try {
      // Clean up potential markdown formatting
      let cleanedText = specsText.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      specs = JSON.parse(cleanedText.trim());
    } catch (e) {
      console.error("Failed to parse specs JSON:", specsText);
      throw new Error("Failed to parse design specifications");
    }

    if (!specs.concepts || !Array.isArray(specs.concepts)) {
      throw new Error("Invalid response format - missing concepts array");
    }

    console.log(`Generated ${specs.concepts.length} concept specs, now generating images...`);

    // Build image prompt for each view
    const buildImagePrompt = (concept: ConceptSpec, view: "hero" | "side_profile" | "top_down") => {
      const conceptJson = JSON.stringify(concept, null, 2);
      
      return `You are a rendering assistant for a high-end jewelry brand.

Your job is to generate a photorealistic render of a single ring design that will be used as a visual guide for a CAD jeweler and as a preview for customers. The design must look physically manufacturable and realistic, matching standard jewelry proportions and finish quality.

Ring design specification (JSON):
${conceptJson}

View to render: ${view}

Rendering rules:
- Metal type and color must follow the specification exactly
- Center stone shape, size, and cut must be clearly visible and accurately represented
- Prongs and setting style must be realistic and visible
- Band width and style must match the spec
- Accent stones and pavé (if any) must be consistent and evenly spaced
- Lighting should be soft studio lighting, premium jewelry photography quality
- Background must be clean, neutral, and uncluttered (light gradient or plain)

View definitions:
- "hero": three-quarter angle showing both the top of the stone and the band; this is the primary glamour shot
- "side_profile": side view that clearly shows the height of the setting, gallery, and how the stone is held
- "top_down": directly overhead view that shows the outline of the stone, halo (if present), and band shape

Style:
- Photorealistic, premium, high-end jewelry shot
- No hands, no models, no props, no branding—just the ring on a neutral background
- Proportions must look physically manufacturable, not exaggerated or stylized`;
    };

    // Generate images for each concept
    const conceptsWithImages = await Promise.all(
      specs.concepts.map(async (concept: ConceptSpec, index: number) => {
        const images = { hero: "", side: "", top: "" };
        
        try {
          const views: Array<{ key: "hero" | "side" | "top"; view: "hero" | "side_profile" | "top_down" }> = [
            { key: "hero", view: "hero" },
            { key: "side", view: "side_profile" },
            { key: "top", view: "top_down" }
          ];

          const imagePromises = views.map(async ({ key, view }) => {
            const prompt = buildImagePrompt(concept, view);
            
            const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash-image-preview",
                messages: [{ role: "user", content: prompt }],
                modalities: ["image", "text"]
              }),
            });

            if (!imageResponse.ok) {
              console.error(`Image generation ${view} failed:`, imageResponse.status);
              return { key, url: null };
            }

            const imageData = await imageResponse.json();
            const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
            return { key, url: imageUrl || null };
          });

          const results = await Promise.all(imagePromises);
          results.forEach(({ key, url }) => {
            if (url) images[key] = url;
          });
        } catch (imgError) {
          console.error("Image generation error for concept", index, ":", imgError);
        }

        return { concept, images };
      })
    );

    console.log("Saving new designs to database...");

    // Save each variation as a new user_design
    const newDesignIds: string[] = [];

    for (const { concept, images } of conceptsWithImages) {
      const { data: newDesign, error: insertError } = await supabaseAdmin
        .from("user_designs")
        .insert({
          user_id: user.id,
          name: concept.name,
          overview: concept.overview,
          flow_type: flowType,
          form_inputs: formInputs,
          spec_sheet: concept,
          hero_image_url: images.hero || null,
          side_image_url: images.side || null,
          top_image_url: images.top || null,
          status: "draft",
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error inserting design:", insertError);
      } else if (newDesign) {
        newDesignIds.push(newDesign.id);
        console.log(`Created new design: ${newDesign.id}`);
      }
    }

    console.log(`Successfully created ${newDesignIds.length} new design variations`);

    return new Response(JSON.stringify({
      success: true,
      message: `Created ${newDesignIds.length} new design variations`,
      design_ids: newDesignIds
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-variations-from-design:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
