import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DesignConceptInput {
  project_type: string;
  ring_style?: string | null;
  metal_preference?: string | null;
  stone_shape?: string | null;
  stone_type?: string | null;
  center_size_ct?: number | null;
  band_width_mm?: number | null;
  pave_preference?: string | null;
  budget_range?: string | null;
  description?: string | null;
  inspiration_image_descriptions?: string[];
  mode: string;
  num_concepts?: number;
}

interface DesignConcept {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const input: DesignConceptInput = await req.json();

    // Validate required inputs
    if (!input.project_type) {
      return new Response(
        JSON.stringify({ error: 'project_type is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!input.mode || !['engagement', 'general', 'surprise'].includes(input.mode)) {
      return new Response(
        JSON.stringify({ error: 'mode must be one of: engagement, general, surprise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const numConcepts = input.num_concepts || 3;
    const inspirationDescriptions = input.inspiration_image_descriptions?.length 
      ? input.inspiration_image_descriptions.join('\n- ')
      : 'None provided';

    const systemPrompt = `You are a senior jewelry designer preparing structured design briefs for a CAD and bench jewelry team on NYC's 47th Street.

Your job is to convert client preferences into exactly ${numConcepts} manufacturable jewelry concepts in a strict JSON format. These briefs will go directly to a CAD jeweler.

Design rules:
- Designs must be physically manufacturable with standard casting and stone-setting.
- Proportions must be realistic: band thickness, prong size, stone height, pavé coverage.
- If inspiration images are provided, use them as primary style references for the overall feel.
- If inputs are missing, infer tasteful defaults for the given project_type and budget.
- For "surprise" mode, be creative and suggest diverse, unexpected but elegant designs.

Output format:
Return ONLY a valid JSON array with exactly ${numConcepts} elements. No markdown, no code blocks, just the raw JSON array.

Each element must match this exact schema:
{
  "name": "Short, premium concept name",
  "overview": "1–3 sentence summary for the client.",
  "metal": "e.g. 14k yellow gold, 18k white gold, platinum",
  "center_stone": {
    "shape": "stone shape",
    "size_mm": "approx size in millimeters",
    "type": "stone type, e.g. lab diamond, natural diamond, sapphire",
    "approx_ct": "approximate carat weight, if relevant"
  },
  "setting_style": "e.g. 4-prong solitaire, bezel, halo, hidden halo, three-stone, etc.",
  "band": {
    "width_mm": "realistic band width (e.g. 1.8–2.4mm)",
    "style": "plain, knife-edge, comfort fit, split shank, cathedral, etc.",
    "pave": "pavé coverage description (none, half, 3/4, full, etc.)",
    "shoulders": "describe any special shoulder design."
  },
  "gallery_details": "describe the gallery/under-gallery in realistic, manufacturable terms.",
  "prongs": "prong style and count, e.g. '4 talon prongs'.",
  "accent_stones": "describe any side stones, halos, pavé, sizes, and placements.",
  "manufacturing_notes": "1–3 bullet-style notes for CAD/bench: minimum thickness, clearances, tolerances."
}

Important:
- Follow the JSON schema exactly.
- Use realistic measurements and proportions.
- Designs should be diverse but aligned with the client's taste and budget.
- Return ONLY the JSON array, nothing else.`;

    const userPrompt = `Generate ${numConcepts} CAD-friendly jewelry design concepts based on the following client inputs:

Project Type: ${input.project_type}
Ring Style: ${input.ring_style || 'Not specified'}
Metal Preference: ${input.metal_preference || 'Not specified'}
Stone Shape: ${input.stone_shape || 'Not specified'}
Stone Type: ${input.stone_type || 'Not specified'}
Approximate Center Size (ct): ${input.center_size_ct || 'Not specified'}
Band Width Preference (mm): ${input.band_width_mm || 'Not specified'}
Pavé Preference: ${input.pave_preference || 'Not specified'}
Budget Range: ${input.budget_range || 'Not specified'}
Description/Notes: ${input.description || 'None provided'}
Inspiration Image Descriptions:
- ${inspirationDescriptions}
Mode: ${input.mode}

Please generate exactly ${numConcepts} diverse, manufacturable design concepts that align with these preferences.`;

    console.log('Calling Lovable AI for design concept generation...');
    console.log('Input:', JSON.stringify(input, null, 2));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('Raw AI response:', content);

    // Parse the JSON from the response
    let concepts: DesignConcept[];
    try {
      // Try to extract JSON from the response (handle potential markdown code blocks)
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      concepts = JSON.parse(jsonString);
      
      if (!Array.isArray(concepts)) {
        throw new Error('Response is not an array');
      }
      
      // Validate each concept has required fields
      for (const concept of concepts) {
        if (!concept.name || !concept.overview || !concept.metal) {
          throw new Error('Concept missing required fields');
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Content was:', content);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse design concepts from AI response',
          raw_response: content 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully generated ${concepts.length} design concepts`);

    return new Response(
      JSON.stringify({ 
        success: true,
        concepts,
        count: concepts.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-generate-design-concepts:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});