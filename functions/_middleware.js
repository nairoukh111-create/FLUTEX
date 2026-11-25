// Canonical host, preview indexing protection and shared primary navigation.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "www.flutexindustrial.com") {
    url.hostname = "flutexindustrial.com";
    return Response.redirect(url.toString(), 301);
  }
  const preview = url.hostname.endsWith(".flutex.pages.dev") || url.hostname === "flutex.pages.dev";
  let response = await context.next();
  if (preview) {
    response = new Response(response.body, response);
    response.headers.set("X-Robots-Tag", "noindex");
  }
  if (context.request.method !== "GET" || ![200,404].includes(response.status) ||
      !(response.headers.get("content-type") || "").toLowerCase().includes("text/html")) return response;
  if (url.pathname.startsWith("/api/")) return response;
  const rewriter = new HTMLRewriter().on("head", {
    element(head) { head.append('<link rel="stylesheet" href="/assets/css/primary-nav.v1.css">', {html:true}); }
  });
  for (const [prefix,label] of [["","Cutting Parameters"],["/ar","براميتر القطع"]]) {
    const target=prefix+"/parameters";
    const current=[target,target+"/",target+".html"].includes(url.pathname);
    rewriter.on('header.site-header nav.nav-links a[href="'+prefix+'/products"]', {
      element(anchor) {
        if (current) {
          const classes=(anchor.getAttribute("class")||"").split(/\s+/).filter(c=>c&&c!=="active");
          if(classes.length)anchor.setAttribute("class",classes.join(" "));else anchor.removeAttribute("class");
          anchor.removeAttribute("aria-current");
        }
        anchor.after('<a href="'+target+'"'+(current?' class="active" aria-current="page"':'')+'>'+label+'</a>',{html:true});
      }
    });
  }
  const transformed=rewriter.transform(response);
  // The HTML representation differs from the underlying static asset.
  const output=new Response(transformed.body, transformed);
  output.headers.delete("etag");
  output.headers.delete("content-length");
  output.headers.delete("last-modified");
  return output;
}
