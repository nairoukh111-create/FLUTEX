const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RFQ_SERVICE || typeof env.RFQ_SERVICE.fetch !== "function") {
    return json(
      { error: "RFQ service is not configured yet. Please use email or WhatsApp." },
      503,
    );
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return json({ error: "Expected a multipart RFQ submission." }, 415);
  }

  try {
    return await env.RFQ_SERVICE.fetch(request);
  } catch (error) {
    console.error("RFQ service request failed", error);
    return json(
      { error: "Unable to submit RFQ right now. Please use email or WhatsApp." },
      502,
    );
  }
}

export function onRequest(context) {
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }

  return json({ error: "Method not allowed." }, 405);
}
