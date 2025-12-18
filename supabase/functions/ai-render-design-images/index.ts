import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConceptJson {
  name: string;
  overview: string;
  metal: string;
  center_stone: {
    shape: string;
    size_mm: string;
    type: string;
    approx_ct: string;
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

interface RenderInput {
  concept_json: ConceptJson;
  design_id?: string | null;
}

type ViewType = 'hero' | 'side_profile' | 'top_down';

const VIEW_DEFINITIONS: Record<ViewType, string> = {
  hero: 'Three-quarter angle showing the top of the center stone and the band profile. This is the primary marketing view.',
  side_profile: 'Side view showing the height of the setting, gallery details, and how the stone sits above the band.',
  top_down: 'Overhead view showing the stone outline, any halo or accent stones, and the band shape from above.'
};

async function generateImageForView(
  concept: ConceptJson,
  view: ViewType,
  apiKey: string
): Promise<string> {
  const conceptString = JSON.stringify(concept, null, 2);
  
  const prompt = `You are a rendering assistant for a high-end jewelry brand.

Generate a photorealistic render of a single ring design that will be used as a visual guide for a CAD jeweler and as a preview for customers. The design must look physically manufacturable and realistic.

Ring design specification:
${conceptString}

View to render: ${view}
View definition: ${VIEW_DEFINITIONS[view]}

Rendering requirements:
- Metal type and color must match the specification exactly (${concept.metal})
- Center stone: ${concept.center_stone.shape} ${concept.center_stone.type}, approximately ${concept.center_stone.size_mm} / ${concept.center_stone.approx_ct}
- Setting style: ${concept.setting_style}
- Prongs: ${concept.prongs} - must be realistic and clearly visible
- Band: ${concept.band.width_mm} wide, ${concept.band.style} style
- Pavé: ${concept.band.pave}
- Accent stones: ${concept.accent_stones}
- Gallery: ${concept.gallery_details}

Photography style:
- Soft studio lighting, premium jewelry photography quality
- Clean, neutral, minimal background (light gray or white gradient)
- Sharp focus on the ring
- No hands, no models, no props
- Physically manufacturable proportions
- Ultra high resolution, photorealistic render`;

  console.log(`Generating ${view} image for concept: ${concept.name}`);

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-image-preview',
      messages: [
        { role: 'user', content: prompt }
      ],
      modalities: ['image', 'text']
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Image generation failed for ${view}:`, response.status, errorText);
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    if (response.status === 402) {
      throw new Error('AI service credits exhausted. Please contact support.');
    }
    
    throw new Error(`Image generation failed for ${view}: ${response.status}`);
  }

  const data = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl) {
    console.error('No image in response for view:', view, data);
    throw new Error(`No image generated for ${view} view`);
  }

  console.log(`Successfully generated ${view} image`);
  return imageUrl;
}

async function uploadBase64ToStorage(
  supabase: any,
  base64Data: string,
  fileName: string
): Promise<string> {
  // Extract the base64 content (remove data:image/png;base64, prefix)
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image format');
  }

  const imageType = matches[1];
  const base64Content = matches[2];
  
  // Convert base64 to Uint8Array
  const binaryString = atob(base64Content);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const filePath = `design-renders/${fileName}.${imageType}`;

  const { data, error } = await supabase.storage
    .from('form-uploads')
    .upload(filePath, bytes, {
      contentType: `image/${imageType}`,
      upsert: true
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('form-uploads')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration is missing');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const input: RenderInput = await req.json();

    if (!input.concept_json) {
      return new Response(
        JSON.stringify({ error: 'concept_json is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const concept = input.concept_json;
    const designId = input.design_id;

    console.log('Generating images for concept:', concept.name);
    console.log('Design ID:', designId || 'none');

    // Generate all three views
    const views: ViewType[] = ['hero', 'side_profile', 'top_down'];
    const imageResults: Record<string, string> = {};

    for (const view of views) {
      try {
        const base64Image = await generateImageForView(concept, view, LOVABLE_API_KEY);
        
        // Upload to storage and get URL
        const timestamp = Date.now();
        const safeName = concept.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const fileName = `${safeName}-${view}-${timestamp}`;
        
        try {
          const publicUrl = await uploadBase64ToStorage(supabase, base64Image, fileName);
          imageResults[view] = publicUrl;
        } catch (uploadError) {
          // If upload fails, fall back to base64 data URL
          console.warn(`Storage upload failed for ${view}, using base64:`, uploadError);
          imageResults[view] = base64Image;
        }
      } catch (error) {
        console.error(`Failed to generate ${view} image:`, error);
        throw error;
      }
    }

    const result = {
      hero_image_url: imageResults.hero,
      side_image_url: imageResults.side_profile,
      top_image_url: imageResults.top_down
    };

    // If design_id is provided, update the design row
    if (designId) {
      console.log('Updating design with image URLs:', designId);
      
      const { error: updateError } = await supabase
        .from('user_designs')
        .update({
          hero_image_url: result.hero_image_url,
          side_image_url: result.side_image_url,
          top_image_url: result.top_image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', designId);

      if (updateError) {
        console.error('Failed to update design:', updateError);
        // Don't fail the whole request, just log the error
      } else {
        console.log('Successfully updated design with image URLs');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-render-design-images:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});