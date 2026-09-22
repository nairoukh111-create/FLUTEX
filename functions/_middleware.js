// Send every visitor and crawler to one canonical host: https://flutexindustrial.com
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.flutexindustrial.com" || url.hostname.endsWith(".flutex.pages.dev") || url.hostname === "flutex.pages.dev") {
    if (url.hostname.includes("www.")) {
      url.hostname = "flutexindustrial.com";
      return Response.redirect(url.toString(), 301);
    }
    // Preview / pages.dev hosts stay reachable but must never be indexed
    const res = await context.next();
    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex");
    return out;
  }
  return context.next();
}
