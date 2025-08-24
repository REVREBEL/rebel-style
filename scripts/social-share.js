/*! REVREBEL Social Share (Webflow CMS)
 *  - Reads #rev-post JSON in <head> and meta tags (canonical/OG/Twitter)
 *  - data-share="[x|linkedin|facebook|pinterest|reddit|email|copy|whatsapp|telegram]"
 *  - Optional overrides via: data-share-url, -title, -desc, -image, -via, -hashtags, -utm
 *  - Optional wrapper defaults via [data-share-root] with same attributes (incl. data-utm)
 */

/*! ADDING THE SCRIPT:

<!-- START Social Share  -->
<script 
defer src="href="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/social-share.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END Social Share -->

*/

/*! HOW TO USE IN WEBFLOW

A) (Optional) Add a wrapper with global defaults/UTMs
Add a div around your buttons and set attributes in Element Settings → Custom attributes:


Name: data-share-root            Value: (anything; presence is enough)
Name: data-utm                   Value: utm_source=blog&utm_medium=share&utm_campaign=post
Name: data-share-image           Value: (bind to main image URL if you want to force a specific one)
Name: data-share-via             Value: revrebel          (for X)
Name: data-share-hashtags        Value: hotels,revrebel   (comma list)


B) Add your buttons (any element works)
Give each button a data-share value. Use your own classes/icons.


<a class="btn-share" data-share="x">X</a>
<a class="btn-share" data-share="linkedin">LinkedIn</a>
<a class="btn-share" data-share="facebook">Facebook</a>
<a class="btn-share" data-share="pinterest">Pinterest</a>
<a class="btn-share" data-share="reddit">Reddit</a>
<a class="btn-share" data-share="email">Email</a>
<a class="btn-share" data-share="whatsapp">WhatsApp</a>
<a class="btn-share" data-share="telegram">Telegram</a>
<button class="btn-share" data-share="copy">Copy Link</button>



C) (Optional) Per‑button overrides
Need a special UTM or title on one network?

Name: data-utm            Value: utm_source=twitter&utm_medium=share&utm_campaign=post
Name: data-share-title    Value: {{ bind to CMS Title or custom }}
Name: data-share-url      Value: {{ bind to CMS URL if different from canonical }}
Name: data-share-image    Value: {{ bind to a different image (e.g., Pinterest‑optimized) }}
Name: data-share-hashtags Value: hotels,webflow,analytics

 */


(function () {
  "use strict";

  const qs  = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const enc = (v) => encodeURIComponent(v ?? "");

  const meta = (name) => qs(`meta[name="${name}"]`)?.content || "";
  const og   = (prop) => qs(`meta[property="${prop}"]`)?.content || "";

  // Head data (canonical / #rev-post)
  const canonical = qs('link[rel="canonical"]')?.href || location.href;
  let headData = {};
  try { headData = JSON.parse(qs('#rev-post')?.textContent || "{}"); } catch {}

  // Construct a base share payload from head data, with fallbacks
  const base = {
    url:        headData.url || canonical,
    title:      headData.title || og("og:title") || document.title,
    description:headData.description || og("og:description") || meta("description") || "",
    image:      headData.image16x9 || og("og:image") || meta("twitter:image") || "",
    via:        (meta("twitter:site") || "").replace(/^@/, ""),
    hashtags:   "" // optional, can be overridden
  };

  // Merge strategy: button attr → wrapper attr → base
  function resolveData(el) {
    const root = el.closest("[data-share-root]") || qs("[data-share-root]") || document.body;

    const pick = (attr, fallback) =>
      el.getAttribute(attr) ||
      root.getAttribute(attr) ||
      fallback;

    const urlBase = pick("data-share-url", base.url);
    const utmCombined = [root.getAttribute("data-utm"), el.getAttribute("data-utm")]
      .filter(Boolean).join("&");
    const url = utmCombined ? appendUtm(urlBase, utmCombined) : urlBase;

    return {
      url,
      title:     pick("data-share-title", base.title),
      description: pick("data-share-desc", base.description),
      image:     pick("data-share-image", base.image),
      via:       pick("data-share-via", base.via),
      hashtags:  pick("data-share-hashtags", base.hashtags)
    };
  }

  function appendUtm(url, utm) {
    try {
      const u = new URL(url, location.origin);
      utm.split("&").forEach(kv => {
        const [k, v] = kv.split("=");
        if (k) u.searchParams.set(k, v || "");
      });
      return u.toString();
    } catch {
      return url + (url.includes("?") ? "&" : "?") + utm;
    }
  }

  function popup(url) {
    const w = 640, h = 720;
    const dualLeft = window.screenLeft ?? screen.left ?? 0;
    const dualTop  = window.screenTop  ?? screen.top  ?? 0;
    const width  = window.innerWidth  || document.documentElement.clientWidth  || screen.width;
    const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
    const left = width / 2 - w / 2 + dualLeft;
    const top  = height / 2 - h / 2 + dualTop;

    const win = window.open(
      url,
      "_blank",
      `noopener,noreferrer,scrollbars=yes,resizable=yes,toolbar=no,location=no,width=${w},height=${h},top=${top},left=${left}`
    );
    if (win && win.focus) win.focus();
  }

  const builders = {
    x: (d) =>
      `https://twitter.com/intent/tweet?url=${enc(d.url)}&text=${enc(d.title)}`
      + (d.via ? `&via=${enc(d.via)}` : "")
      + (d.hashtags ? `&hashtags=${enc(d.hashtags)}` : ""),

    linkedin: (d) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${enc(d.url)}`,

    facebook: (d) =>
      `https://www.facebook.com/sharer/sharer.php?u=${enc(d.url)}`,

    pinterest: (d) =>
      `https://www.pinterest.com/pin/create/button/?url=${enc(d.url)}`
      + (d.image ? `&media=${enc(d.image)}` : "")
      + `&description=${enc(d.title || d.description)}`,

    reddit: (d) =>
      `https://www.reddit.com/submit?url=${enc(d.url)}&title=${enc(d.title)}`,

    email: (d) =>
      `mailto:?subject=${enc(d.title)}&body=${enc(d.title)}%0A%0A${enc(d.url)}`,

    whatsapp: (d) =>
      `https://api.whatsapp.com/send?text=${enc(d.title + " " + d.url)}`,

    telegram: (d) =>
      `https://t.me/share/url?url=${enc(d.url)}&text=${enc(d.title)}`,

    copy: (d) => d.url
  };

  async function onClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const type = (btn.getAttribute("data-share") || "").toLowerCase();
    if (!type || !builders[type]) return;

    const data = resolveData(btn);

    if (type === "copy") {
      try {
        await navigator.clipboard.writeText(data.url);
        btn.setAttribute("data-copied", "true");
        const prev = btn.getAttribute("aria-label");
        btn.setAttribute("aria-label", "Link copied");
        setTimeout(() => {
          btn.removeAttribute("data-copied");
          if (prev) btn.setAttribute("aria-label", prev);
        }, 1500);
      } catch {
        window.prompt("Copy this link:", data.url);
      }
      return;
    }

    const url = builders[type](data);
    popup(url);
  }

  function enhance(el) {
    el.addEventListener("click", onClick);
    el.setAttribute("role", el.getAttribute("role") || "button");
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    if (!el.getAttribute("aria-label")) {
      const t = el.getAttribute("data-share");
      el.setAttribute("aria-label", `Share on ${t}`);
    }
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  }

  function init() {
    qsa("[data-share]").forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
