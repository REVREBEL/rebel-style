/*! REVREBEL Social Share (Webflow CMS) --------------------- 
 *
 *  - Reads #revrebel-post JSON in <head> and meta tags (canonical/OG/Twitter)
 *  - data-share="[x|linkedin|facebook|pinterest|reddit|email|copy|whatsapp|telegram|blog-rss]"
 *  - Optional overrides via: data-share-url, -title, -desc, -image, -via, -hashtags, -utm
 *  - Optional wrapper defaults via [data-share-root] with same attributes (incl. data-utm)
 */


/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Social Share  -->
<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/social-share.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END Social Share -->

*/


/*! ------------------ HOW TO USE IN WEBFLOW --------------- 

(Optional) Add a wrapper with global defaults/UTMs
Add a div around your buttons and set attributes in Element Settings → Custom attributes. 
The data-share-root attribute should be placed at the wrapper-level.

 - Any share-related attributes you place on that wrapper (e.g. data-utm, data-share-image, 
   data-share-via, data-share-hashtags) act as defaults for all buttons inside it.

 - The button itself can override these by having the same attribute directly (data-share-url, 
   data-share-title, etc.).

 - If neither the button nor the root has a given attribute, the script falls back to the 
   age’s metadata (canonical URL, OG tags, etc.).


Name: data-share-root            Value: (anything; presence is enough)
Name: data-utm                   Value: utm_source=blog&utm_medium=share&utm_campaign=post
Name: data-share-image           Value: (bind to main image URL if you want to force a specific one)
Name: data-share-via             Value: revrebel          (for X)
Name: data-share-hashtags        Value: hotels,revrebel   (comma list)

Add your buttons (any element works)

Give each button a data-share value. Use your own classes/icons.

<a class="btn-share" data-share="x">X</a>
<a class="btn-share" data-share="linkedin">LinkedIn</a>
<a class="btn-share" data-share="facebook">Facebook</a>
<a class="btn-share" data-share="pinterest">Pinterest</a>
<a class="btn-share" data-share="reddit">Reddit</a>
<a class="btn-share" data-share="email">Email</a>
<a class="btn-share" data-share="whatsapp">WhatsApp</a>
<a class="btn-share" data-share="telegram">Telegram</a>
<a class="btn-share" data-share="blog-rss">RSS</a>

<button class="btn-share" data-share="copy">Copy Link</button>

(Optional) Per‑button overrides
Need a special UTM or title on one network?

Name: data-utm            Value: utm_source=twitter&utm_medium=share&utm_campaign=post
Name: data-share-title    Value: {{ bind to CMS Title or custom }}
Name: data-share-url      Value: {{ bind to CMS URL if different from canonical }}
Name: data-share-image    Value: {{ bind to a different image (e.g., Pinterest‑optimized) }}
Name: data-share-hashtags Value: hotels,webflow,analytics

*/


/** 
 * Component Name: Share-Buttons --------------------- 
 *
 * Provides a unified sharing system for elements with `[data-share]` attributes.
 * 
 * Features:
 * - Gathers metadata (canonical, OpenGraph, Twitter, custom JSON in #revrebel-post)
 * - Builds provider-specific share URLs (X/Twitter, LinkedIn, Facebook, etc.)
 * - Handles UTM appending and collection-based RSS links
 * - Opens popup windows for social providers, or copies links to clipboard
 * - Enhances accessibility with ARIA roles, labels, and keyboard support
 * 
 * Usage:
 * <button data-share="linkedin"></button>
 * <button data-share="copy" data-share-url="https://..."></button>
 */

(function () {
  "use strict";

  /* ------------------ Utilities ------------------ */

  /** 
   * Shortcut for querySelector.
   * @param {string} sel - CSS selector
   * @param {ParentNode} [root=document] - Search context
   * @returns {Element|null}
   */
  const qs = (sel, root = document) => root.querySelector(sel);

  /** 
   * Shortcut for querySelectorAll, returns Array.
   * @param {string} sel - CSS selector
   * @param {ParentNode} [root=document] - Search context
   * @returns {Element[]}
   */
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** 
   * Safe URI encoder.
   * @param {string|undefined|null} v - Value to encode
   * @returns {string}
   */
  const enc = (v) => encodeURIComponent(v ?? "");

  /** 
   * Read `<meta name="...">`.
   * @param {string} name - Meta tag name
   * @returns {string}
   */
  const meta = (name) => qs(`meta[name="${name}"]`)?.content || "";

  /** 
   * Read `<meta property="...">`.
   * @param {string} prop - OG property name
   * @returns {string}
   */
  const og = (prop) => qs(`meta[property="${prop}"]`)?.content || "";

  /* ------------------ Head Data ------------------ */

  /** @type {string} */
  const canonical = qs('link[rel="canonical"]')?.href || location.href;

  /** @type {Object<string, any>} */
  let headData = {};
  try { headData = JSON.parse(qs('#revrebel-post')?.textContent || "{}"); } catch { }

  /** @type {Object} Default share payload */
  const base = {
    // Always prefer the canonical URL as the single source of truth for the page's address.
    // This aligns with the logic in meta-data.js and is more robust.
    url: canonical,
    title: headData.title || og("og:title") || document.title,
    description: headData.description || og("og:description") || meta("description") || "",
    image: headData.image16x9 || og("og:image") || meta("twitter:image") || "",
    via: (meta("twitter:site") || "").replace(/^@/, ""),
    hashtags: ""
  };

  /* ------------------ Core Functions ------------------ */

  /**
   * Normalize hashtag string by removing all `#` characters.
   * Accepts either comma-separated string or single hashtag.
   *
   * @param {string} val - Raw hashtag string, e.g. "#hotels,#revrebel"
   * @returns {string} Cleaned string, e.g. "hotels,revrebel"
   */
  function normalizeHashtags(val) {
    if (!val) return "";
    return val.replace(/#/g, "").trim();
  }

  /**
   * Merge strategy: button attr → wrapper attr → base payload.
   * @param {Element} el - The clicked share button
   * @returns {Object} Share payload with url, title, description, image, via, hashtags
   */
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
      title: pick("data-share-title", base.title),
      description: pick("data-share-desc", base.description),
      image: pick("data-share-image", base.image),
      via: pick("data-share-via", base.via),
      hashtags: normalizeHashtags(pick("data-share-hashtags", base.hashtags))
    };
  }

  /**
   * Append UTM parameters to a URL.
   * @param {string} url - Base URL
   * @param {string} utm - Querystring of UTM params ("a=1&b=2")
   * @returns {string}
   */
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

  /**
   * Returns "<origin>/<first-path-segment>/" from a URL.
   * Example: "https://revrebel.io/blogs/post" -> "https://revrebel.io/blogs/"
   * @param {string} url - Input URL
   * @returns {string}
   */
  function getRootAndCollection(url) {
    let u;
    try {
      u = new URL(url, (typeof location !== "undefined" ? location.origin : undefined));
    } catch {
      return "";
    }
    const first = u.pathname.split("/").filter(Boolean)[0] || "";
    return u.origin + (first ? `/${first}/` : "/");
  }

  /**
   * Opens a centered popup window.
   * @param {string} url - URL to open
   */
  function popup(url) {
    const w = 640, h = 720;
    const dualLeft = window.screenLeft ?? screen.left ?? 0;
    const dualTop = window.screenTop ?? screen.top ?? 0;
    const width = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const height = window.innerHeight || document.documentElement.clientHeight || screen.height;
    const left = width / 2 - w / 2 + dualLeft;
    const top = height / 2 - h / 2 + dualTop;

    const win = window.open(
      url,
      "_blank",
      `noopener,noreferrer,scrollbars=yes,resizable=yes,toolbar=no,location=no,width=${w},height=${h},top=${top},left=${left}`
    );
    if (win && win.focus) win.focus();
  }

  /* ------------------ Share URL Builders ------------------ */

  /** @type {Record<string,(d:Object)=>string>} */
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

    copy: (d) => d.url,

    "blog-rss": (d) => `${getRootAndCollection(d.url)}rss.xml`
  };

  /* ------------------ Event Handlers ------------------ */

  /**
   * Handle click on a share button.
   * - Builds the share URL
   * - Handles "copy to clipboard" fallback
   * - Opens popup or new tab
   * @param {MouseEvent} e
   */
  async function onClick(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const type = (btn.getAttribute("data-share") || "").toLowerCase();
    const builder = builders[type];
    if (!builder) return;

    const data = resolveData(btn);

    if (type === "copy") {
      const urlToCopy = builder(data);
      try {
        await navigator.clipboard.writeText(urlToCopy);
        btn.setAttribute("data-copied", "true");
        const prev = btn.getAttribute("aria-label");
        btn.setAttribute("aria-label", "Link copied");
        setTimeout(() => {
          btn.removeAttribute("data-copied");
          if (prev) btn.setAttribute("aria-label", prev);
        }, 1500);
      } catch {
        window.prompt("Copy this link:", urlToCopy);
      }
      return;
    }

    const url = builder(data);
    const popupTypes = new Set(["x", "linkedin", "facebook", "pinterest", "reddit"]);

    if (popupTypes.has(type)) {
      popup(url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  /**
   * Enhance a share element with ARIA role, label, keyboard events.
   * @param {Element} el - Button element
   */
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

  /**
   * Initialize: Enhance all `[data-share]` elements.
   */
  function init() {
    qsa("[data-share]").forEach(enhance);
  }

  /* ------------------ Boot ------------------ */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
