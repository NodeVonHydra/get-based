// Vercel Edge Function — AI API proxy
// Eliminates CORS restrictions for all AI providers.
// Keys pass through from the client, never stored server-side.

export const config = { runtime: 'edge' };

// Allowlisted provider URL prefixes — only these can be proxied
const ALLOWED_ORIGINS = [
  'https://api.anthropic.com/',
  'https://openrouter.ai/',
  'https://api.venice.ai/',
  // Routstr — ready when they are
  // 'https://api.routstr.com/',
];

function isAllowedUrl(url) {
  return ALLOWED_ORIGINS.some(origin => url.startsWith(origin));
}

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }

  const { url, headers, body } = payload;

  if (!url || !isAllowedUrl(url)) {
    return new Response(JSON.stringify({ error: 'URL not allowed' }), {
      status: 403,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }

  try {
    const upstreamRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });

    // For non-streaming responses or errors, forward as-is
    const contentType = upstreamRes.headers.get('content-type') || '';
    const isStream = contentType.includes('text/event-stream') || contentType.includes('application/x-ndjson');

    if (!isStream) {
      const responseBody = await upstreamRes.text();
      return new Response(responseBody, {
        status: upstreamRes.status,
        headers: {
          ...corsHeaders(),
          'Content-Type': contentType || 'application/json',
        },
      });
    }

    // Stream SSE response through
    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: {
        ...corsHeaders(),
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: `Upstream error: ${e.message}` }), {
      status: 502,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
