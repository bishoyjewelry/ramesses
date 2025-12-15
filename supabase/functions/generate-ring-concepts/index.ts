import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FormInputs {
  flowType: "engagement" | "general";
  style?: string;
  centerStoneType?: string;
  centerStoneSize?: string;
  metal?: string;
  ringSize?: string;
  budget?: string;
  specialRequests?: string;
  pieceType?: string;
  stonePreferences?: string;
  description?: string;
  inspirationImages?: string[];
}

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
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { formInputs, surpriseMe = false, regenerateFrom = null } = await req.json();
    const inputs = formInputs as FormInputs;
    
    const numConcepts = surpriseMe ? 1 : (regenerateFrom ? 2 : 3);
    
    // Build client inputs for the prompt
    const projectType = inputs?.flowType === "engagement" ? "engagement_ring" : (inputs?.pieceType || "ring");
    const ringStyle = inputs?.style || "solitaire";
    const metalPreference = inputs?.metal || "14k white gold";
    const stoneShape = inputs?.centerStoneType?.toLowerCase().includes("oval") ? "oval" : 
                       inputs?.centerStoneType?.toLowerCase().includes("cushion") ? "cushion" :
                       inputs?.centerStoneType?.toLowerCase().includes("princess") ? "princess" :
                       inputs?.centerStoneType?.toLowerCase().includes("emerald") ? "emerald" :
                       inputs?.centerStoneType?.toLowerCase().includes("pear") ? "pear" :
                       inputs?.centerStoneType?.toLowerCase().includes("marquise") ? "marquise" : "round";
    const stoneType = inputs?.centerStoneType || "natural diamond";
    const centerSizeCt = inputs?.centerStoneSize || null;
    const bandWidth = null; // Let AI infer based on style
    const pavePreference = ringStyle.toLowerCase().includes("pave") ? "half" : "none";
    const budgetRange = inputs?.budget || "$5,000-$10,000";
    const freeformDescription = inputs?.specialRequests || inputs?.description || "";
    const inspirationDescriptions = inputs?.inspirationImages?.length ? "Customer provided inspiration images" : "";
    const mode = surpriseMe ? "Surprise" : (inputs?.flowType || "engagement");

    // Build the system prompt
    const systemPrompt = `You are a senior jewelry designer preparing structured design briefs for a CAD and bench jewelry team on NYC's 47th Street.

Your job is to convert client preferences into ${numConcepts} manufacturable ring concepts in a strict JSON format. These briefs will go directly to a CAD jeweler, so they must be precise, realistic, and technically feasible.

Client inputs:
- project_type: ${projectType}
- ring_style: ${ringStyle}
- metal_preference: ${metalPreference}
- stone_shape: ${stoneShape}
- stone_type: ${stoneType}
- approx_center_size_ct: ${centerSizeCt || "not specified"}
- band_width_preference_mm: ${bandWidth || "not specified"}
- pave_preference: ${pavePreference}
- budget_range: ${budgetRange}
- description: ${freeformDescription || "none provided"}
- inspiration_images: ${inspirationDescriptions || "none provided"}
- mode: ${mode}
- num_concepts: ${numConcepts}

Design rules:
- All designs must be physically manufacturable with standard casting and stone-setting techniques.
- Proportions must be realistic: band thickness, prong sizes, stone heights, pavé coverage.
- Designs should feel high-end but practical: avoid fragile, impossible, or gimmicky details.
- If inspiration images are provided, use them as primary style references for overall feel and detailing.
- If inputs are missing, infer tasteful defaults consistent with project_type and budget.

Output format:
Return a JSON object with a "concepts" array containing exactly ${numConcepts} elements. Each element must match this schema:

{
  "concepts": [
    {
      "name": "Short, premium concept name, e.g. 'Hidden Halo Aurora'",
      "overview": "1–3 sentence summary explaining the concept in client-friendly language.",
      "metal": "e.g. 14k yellow gold, 18k white gold, platinum",
      "center_stone": {
        "shape": "stone shape",
        "size_mm": "approx size in millimeters",
        "type": "stone type, e.g. lab diamond, natural diamond, sapphire",
        "approx_ct": "approximate carat weight, if relevant"
      },
      "setting_style": "e.g. 4-prong solitaire, bezel, halo, hidden halo, three-stone with tapered baguettes, etc.",
      "band": {
        "width_mm": "realistic band width at the bottom (e.g. 1.8–2.4mm)",
        "style": "e.g. plain, knife-edge, comfort fit, split shank, cathedral, vintage engraved",
        "pave": "describe pavé coverage if any (none, half, three-quarter, full, etc.)",
        "shoulders": "describe any special shoulder design (tapered, cathedral, bypass, twisted, etc.)"
      },
      "gallery_details": "describe gallery architecture and any under-gallery details; must be manufacturable.",
      "prongs": "prong style and count, e.g. '4 talon prongs', '6 rounded prongs', 'double claw prongs'.",
      "accent_stones": "description of any side stones, halos, hidden halos, or pavé details, including approximate sizes and placements.",
      "manufacturing_notes": "1–3 bullet-style sentences with critical notes for CAD/bench, e.g. minimum thickness, stone clearance, prong protection, recommended tolerances."
    }
  ]
}

Important:
- Follow the JSON schema exactly. Do not add extra top-level fields.
- All numerical values must be realistic for fine jewelry (no absurd sizes).
- Use consistent units: millimeters for dimensions, carats in approx_ct where relevant.
- Designs should be diverse but all aligned with the client's taste and budget.
- If mode = "Surprise" or description is very vague, propose tasteful, versatile designs that are easy to wear daily.

Respond ONLY with valid JSON, no additional text.`;

    // Build the user prompt based on mode
    let userPrompt = "";
    
    if (surpriseMe) {
      userPrompt = `Generate ${numConcepts} completely random but elegant and manufacturable ring design(s). Be creative but ensure the designs are physically possible to manufacture. Choose tasteful, versatile styles that would appeal to a modern buyer.`;
    } else if (regenerateFrom) {
      userPrompt = `Create ${numConcepts} variations of this ring design while keeping the core elements:
Original: ${JSON.stringify(regenerateFrom)}
Maintain the same overall style but with subtle differences in details like band width, prong style, gallery design, or accent stone placement.`;
    } else {
      userPrompt = `Generate ${numConcepts} distinct ring concepts based on the client inputs provided. Each design should be unique but aligned with the client's preferences.`;
    }

    // Generate the specs using Lovable AI
    const specResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!specResponse.ok) {
      const errorText = await specResponse.text();
      console.error("AI spec generation error:", specResponse.status, errorText);
      
      if (specResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (specResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to generate design specifications");
    }

    const specData = await specResponse.json();
    let specsText = specData.choices?.[0]?.message?.content || "";
    
    // Clean up the response to extract JSON
    specsText = specsText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let specs;
    try {
      specs = JSON.parse(specsText);
    } catch (e) {
      console.error("Failed to parse specs JSON:", specsText);
      throw new Error("Failed to parse design specifications");
    }

    // Build detailed rendering prompts for each view
    const buildImagePrompt = (concept: ConceptSpec, view: "hero" | "side_profile" | "top_down") => {
      const conceptJson = JSON.stringify(concept, null, 2);
      
      return `You are a rendering assistant for a high-end jewelry brand.

Your job is to generate a photorealistic render of a single ring design that will be used as a visual guide for a CAD jeweler and as a preview for customers. The design must look physically manufacturable and realistic, matching standard jewelry proportions and finish quality.

Ring design specification (JSON):
${conceptJson}

View to render:
${view}

Rendering rules:
- Metal type and color must follow the specification exactly (e.g., 14k yellow gold, 18k white gold, platinum).
- Center stone shape, size, and cut must be clearly visible and accurately represented.
- Prongs and setting style must be realistic and visible (e.g., four-prong, six-prong, bezel, halo, hidden halo).
- Band width and style must match the spec: plain, knife-edge, split shank, cathedral, pavé, etc.
- Accent stones and pavé (if any) must be consistent and evenly spaced.
- Lighting should be soft studio lighting, premium jewelry photography quality.
- Background must be clean, neutral, and uncluttered (light gradient or plain).

View definitions:
- "hero": three-quarter angle showing both the top of the stone and the band; this is the primary glamour shot.
- "side_profile": side view that clearly shows the height of the setting, gallery, and how the stone is held.
- "top_down": directly overhead view that shows the outline of the stone, halo (if present), and band shape.

Style:
- Photorealistic, premium, high-end jewelry shot.
- No hands, no models, no props, no branding—just the ring on a neutral background.
- Proportions must look physically manufacturable, not exaggerated or stylized.

If the JSON is missing a minor detail, infer a tasteful, realistic choice consistent with the rest of the spec.`;
    };

    // Generate images for each concept using Lovable AI image generation
    const conceptsWithImages = await Promise.all(
      specs.concepts.map(async (concept: ConceptSpec, index: number) => {
        const images = { hero: "", side: "", top: "" };
        
        // Generate all three images in parallel
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
          console.error("Image generation error:", imgError);
        }

        return {
          id: `concept-${index + 1}-${Date.now()}`,
          ...concept,
          images
        };
      })
    );

    console.log(`Generated ${conceptsWithImages.length} concepts successfully`);

    return new Response(JSON.stringify({ 
      success: true,
      concepts: conceptsWithImages 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-ring-concepts:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
