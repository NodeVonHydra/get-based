// Vercel Edge Function — AI API proxy
// Eliminates CORS restrictions for all AI providers.
// Keys pass through from the client, never stored server-side.

export const config = { runtime: 'edge' };

// Allowlisted provider URL prefixes — only these can be proxied
const ALLOWED_ORIGINS = [
  'https://openrouter.ai/',
  'https://api.venice.ai/',
  'https://api.routstr.com/',
  'https://api.ppq.ai/',
];

function isAllowedUrl(url) {
  if (ALLOWED_ORIGINS.some(origin => url.startsWith(origin))) return true;
  // Allow any HTTPS endpoint (Custom API, decentralized Routstr nodes, etc.)
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch { return false; }
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
    return new Response(JSON.stringify({ error: 'Method not allowed. Use POST with {url, headers, body?, method?}' }), {
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

  const { url, headers, body, method: upstreamMethod } = payload;

  if (!url || !isAllowedUrl(url)) {
    return new Response(JSON.stringify({ error: 'URL not allowed' }), {
      status: 403,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    });
  }

  try {
    const fetchMethod = (upstreamMethod || 'POST').toUpperCase();
    const fetchOpts = {
      method: fetchMethod,
      headers: {
        ...(fetchMethod !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
    };
    if (fetchMethod !== 'GET' && body) {
      fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    const upstreamRes = await fetch(url, fetchOpts);

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
