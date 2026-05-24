const RESEND_KEY = 're_5mpsGEeS_JcpsERF4x6t8aNs318XLZkGn';

exports.handler = async function(event) {

  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, headers: { ...cors, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const resendPayload = {
    from:    'Asoebifloow Event Team <onboarding@resend.dev>',
    to:      payload.to,
    subject: payload.subject,
    text:    payload.text
  };

  if (payload.attachment) {
    resendPayload.attachments = [{
      content:  payload.attachment,
      filename: payload.filename || 'AccessCard.png'
    }];
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_KEY,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify(resendPayload)
    });

    let data = {};
    try { data = await res.json(); } catch(_) {}

    const h = { ...cors, 'Content-Type': 'application/json' };
    if (res.ok) {
      return { statusCode: 200, headers: h, body: JSON.stringify({ success: true, id: data.id }) };
    } else {
      return { statusCode: res.status, headers: h,
               body: JSON.stringify({ error: data.message || data.name || 'Resend error', detail: data }) };
    }
  } catch(e) {
    return { statusCode: 500,
             headers: { ...cors, 'Content-Type': 'application/json' },
             body: JSON.stringify({ error: e.message }) };
  }
};
