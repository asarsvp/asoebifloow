const SUPABASE_URL  = 'https://ctdrthpfmrcxsmunyabn.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZHJ0aHBmbXJjeHNtdW55YWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDgyMzgsImV4cCI6MjA5NDA4NDIzOH0.iKR0gDGTXS7VEincwk90UDs8mGEVsaw0JZiClO-OgRo';

exports.handler = async function(event) {
  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization, Prefer',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  // Extract the table/query path from the request
  // e.g. /.netlify/functions/supabase-proxy?path=/rest/v1/guests?event_id=eq.xxx
  const params = event.queryStringParameters || {};
  const path   = params.path || '/rest/v1/';
  const method = event.httpMethod;
  const body   = event.body || undefined;

  const headers = {
    'apikey':        SUPABASE_ANON,
    'Authorization': 'Bearer ' + SUPABASE_ANON,
    'Content-Type':  'application/json',
    'Prefer':        event.headers['prefer'] || ''
  };

  try {
    const res = await fetch(SUPABASE_URL + path, {
      method,
      headers,
      body: method !== 'GET' ? body : undefined
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: text
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
