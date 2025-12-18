import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SurpriseInput {
  mode: 'engagement' | 'general';
  user_id?: string | null;
}

// Curated defaults for tasteful surprise designs
const SURPRISE_DEFAULTS = {
  engagement: {
    project_type: 'engagement_ring',
    metals: ['14k yellow gold', '14k white gold', '18k yellow gold', 'platinum'],
    stone_shapes: ['oval', 'round brilliant', 'cushion', 'emerald cut', 'pear'],
    stone_types: ['lab diamond', 'natural diamond'],
    center_sizes: [1.0, 1.25, 1.5, 1.75, 2.0],
    styles: ['solitaire', 'hidden halo', 'halo', 'three-stone', 'pavé band'],
    budget_ranges: ['$3,000–$5,000', '$5,000–$7,000', '$7,000–$10,000'],
    band_widths: [1.8, 2.0, 2.2, 2.4],
    pave_options: ['none', 'half pavé', '3/4 pavé', 'full pavé']
  },
  general: {
    project_type: 'ring',
    metals: ['14k yellow gold', '14k rose gold', 'sterling silver', '18k white gold'],
    stone_shapes: ['round', 'oval', 'cushion', 'marquise', 'baguette'],
    stone_types: ['sapphire', 'emerald', 'ruby', 'lab diamond', 'moissanite'],
    center_sizes: [0.5, 0.75, 1.0, 1.25],
    styles: ['bezel set', 'tension set', 'cluster', 'vintage-inspired', 'modern minimalist'],
    budget_ranges: ['$1,500–$3,000', '$3,000–$5,000', '$5,000–$7,000'],
    band_widths: [2.0, 2.5, 3.0],
    pave_options: ['none', 'accent stones', 'side baguettes']
  }
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSurpriseInputs(mode: 'engagement' | 'general') {
  const defaults = SURPRISE_DEFAULTS[mode];
  
  return {
    project_type: defaults.project_type,
    ring_style: pickRandom(defaults.styles),
    metal_preference: pickRandom(defaults.metals),
    stone_shape: pickRandom(defaults.stone_shapes),
    stone_type: pickRandom(defaults.stone_types),
    center_size_ct: pickRandom(defaults.center_sizes),
    band_width_mm: pickRandom(defaults.band_widths),
    pave_preference: pickRandom(defaults.pave_options),
    budget_range: pickRandom(defaults.budget_ranges),
    description: 'Surprise me with a beautiful, tasteful design that feels special and unique.',
    inspiration_image_descriptions: [],
    mode: mode,
    num_concepts: 1
  };
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

    const input: SurpriseInput = await req.json();

    if (!input.mode || !['engagement', 'general'].includes(input.mode)) {
      return new Response(
        JSON.stringify({ error: 'mode must be "engagement" or "general"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating surprise design for mode:', input.mode);

    // Generate random but tasteful inputs
    const surpriseInputs = generateSurpriseInputs(input.mode);
    console.log('Surprise inputs:', JSON.stringify(surpriseInputs, null, 2));

    // Step 1: Call ai_generate_design_concepts
    console.log('Calling ai-generate-design-concepts...');
    const conceptResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-generate-design-concepts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surpriseInputs)
    });

    if (!conceptResponse.ok) {
      const errorText = await conceptResponse.text();
      console.error('Concept generation failed:', conceptResponse.status, errorText);
      
      if (conceptResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (conceptResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Concept generation failed: ${conceptResponse.status}`);
    }

    const conceptData = await conceptResponse.json();
    
    if (!conceptData.success || !conceptData.concepts || conceptData.concepts.length === 0) {
      console.error('No concepts returned:', conceptData);
      throw new Error('Failed to generate concept');
    }

    const concept = conceptData.concepts[0];
    console.log('Generated concept:', concept.name);

    // Step 2: Call ai_render_design_images
    console.log('Calling ai-render-design-images...');
    const renderResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-render-design-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        concept_json: concept,
        design_id: null // Don't save automatically
      })
    });

    if (!renderResponse.ok) {
      const errorText = await renderResponse.text();
      console.error('Image rendering failed:', renderResponse.status, errorText);
      
      if (renderResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (renderResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Image rendering failed: ${renderResponse.status}`);
    }

    const renderData = await renderResponse.json();
    
    if (!renderData.success) {
      console.error('Image rendering unsuccessful:', renderData);
      throw new Error(renderData.error || 'Failed to render images');
    }

    console.log('Successfully generated surprise design with images');

    // Return the complete surprise design (stateless - not saved)
    return new Response(
      JSON.stringify({
        success: true,
        concept: concept,
        hero_image_url: renderData.hero_image_url,
        side_image_url: renderData.side_image_url,
        top_image_url: renderData.top_image_url,
        // Include the form inputs used so UI can save them if user wants
        form_inputs: surpriseInputs
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-surprise-design:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});