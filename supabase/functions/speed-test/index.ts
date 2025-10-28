import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Ping endpoint - lightweight response
    if (path.endsWith('/ping')) {
      return new Response(
        JSON.stringify({ timestamp: Date.now(), status: 'ok' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    // Download endpoint - serve test file
    if (path.includes('/download/')) {
      const sizeParam = path.split('/download/')[1];
      const sizeInMB = parseInt(sizeParam) || 1;
      const sizeInBytes = sizeInMB * 1024 * 1024;
      
      // Generate random binary data
      const buffer = new Uint8Array(sizeInBytes);
      crypto.getRandomValues(buffer);
      
      return new Response(buffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/octet-stream',
          'Content-Length': sizeInBytes.toString(),
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Content-Disposition': `attachment; filename="test-${sizeInMB}mb.bin"`,
        },
      });
    }

    // Upload endpoint - accept and discard data
    if (path.endsWith('/upload') && req.method === 'POST') {
      // Read the body to simulate processing
      await req.arrayBuffer();
      
      return new Response(
        JSON.stringify({ 
          status: 'success', 
          timestamp: Date.now(),
          message: 'Upload received'
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Speed test error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});