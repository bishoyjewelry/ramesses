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
    
    // Build the prompt based on inputs
    let designPrompt = "";
    
    if (surpriseMe) {
      designPrompt = `Generate a completely random but elegant and manufacturable engagement ring design. 
Be creative but ensure the design is physically possible to manufacture. Choose any style, metal, and stone combination that would appeal to a modern buyer.`;
    } else if (regenerateFrom) {
      designPrompt = `Create a variation of this engagement ring design while keeping the core elements:
Original: ${JSON.stringify(regenerateFrom)}
Create 2 new variations that maintain the same style but with subtle differences in details like band width, prong style, or accent stone placement.`;
    } else {
      const inputs = formInputs as FormInputs;
      
      if (inputs.flowType === "engagement") {
        designPrompt = `Design a custom engagement ring with these specifications:
- Style: ${inputs.style || "elegant solitaire"}
- Center Stone Type: ${inputs.centerStoneType || "natural diamond"}
- Approximate Size: ${inputs.centerStoneSize || "1.0 carat"}
- Metal: ${inputs.metal || "14k white gold"}
- Ring Size: ${inputs.ringSize || "6.5"}
- Budget Range: ${inputs.budget || "$5,000-$10,000"}
- Special Requests: ${inputs.specialRequests || "none"}`;
      } else {
        designPrompt = `Design a custom piece of jewelry with these specifications:
- Type: ${inputs.pieceType || "ring"}
- Metal: ${inputs.metal || "14k gold"}
- Stone Preferences: ${inputs.stonePreferences || "diamond accents"}
- Budget Range: ${inputs.budget || "$2,500-$5,000"}
- Description: ${inputs.description || "elegant and timeless design"}`;
      }
      
      if (inputs.inspirationImages && inputs.inspirationImages.length > 0) {
        designPrompt += `\n\nThe customer has provided inspiration images. Use these as style guidance for the overall aesthetic and design direction.`;
      }
    }

    const numConcepts = surpriseMe ? 1 : (regenerateFrom ? 2 : 3);
    
    const systemPrompt = `You are an expert jewelry designer for a prestigious NYC Diamond District jeweler with 30+ years of experience.
Your task is to generate ${numConcepts} distinct, manufacturable engagement ring concept(s).

IMPORTANT RULES:
1. All designs MUST be physically manufacturable using standard jewelry techniques
2. Avoid impossible geometry or unrealistic proportions
3. Be specific about measurements in millimeters
4. Consider structural integrity and wearability
5. Each concept should be distinct but elegant

For each concept, provide a JSON response with this exact structure:
{
  "concepts": [
    {
      "name": "Elegant name for this design",
      "overview": "2-3 sentence description of the design's key features and appeal",
      "metal": "Specific metal type (e.g., 14k White Gold)",
      "center_stone": {
        "shape": "Round Brilliant, Oval, Cushion, etc.",
        "size_mm": "e.g., 6.5mm (approximately 1 carat)",
        "type": "Natural Diamond, Lab Diamond, Sapphire, etc."
      },
      "setting_style": "Prong, Bezel, Tension, etc.",
      "band": {
        "width_mm": "e.g., 2.0mm",
        "style": "Knife-edge, comfort fit, cathedral, etc.",
        "pave": "None, micro-pavé, channel-set, etc.",
        "shoulders": "Plain, tapered, split shank, etc."
      },
      "gallery_details": "Description of the gallery/undercarriage design",
      "prongs": "4-prong, 6-prong, claw, etc.",
      "accent_stones": "Description of any side stones or accents",
      "manufacturing_notes": "Special notes for the jeweler about crafting this piece"
    }
  ]
}

Respond ONLY with valid JSON, no additional text.`;

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
          { role: "user", content: designPrompt }
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
