//Version 20250826 11:28AM
(function(){
  if (window.__revJsonLdInit) return; // guard against double‑init in Preview/Code Compile
  window.__revJsonLdInit = true;

  function ready(fn){
    // Use 'load' instead of 'DOMContentLoaded'. This waits for all resources (like
    // other scripts that might render content) to finish loading. It's more patient
    // and increases the chance of finding elements like '#richtext-field'.
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn);
  }

  function getMeta(name){
    var el = document.querySelector('meta[name="' + name + '"]');
    return el ? (el.getAttribute('content') || '') : '';
  }

  function toISO(dateString){
    if (!dateString) return '';
    var d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toISOString();
  }

  ready(function(){
    // The CMS data blob must exist and be valid JSON
    var dataEl = document.getElementById('revrebel-post');
    if (!dataEl){
      console.error('[REVREBEL JSON-LD] #revrebel-post element not found');
      return;
    }

    var raw = dataEl.textContent || dataEl.innerText || '';
    var d;
    try {
      d = JSON.parse(raw);
    } catch (e){
      console.error('[REVREBEL JSON-LD] Invalid JSON inside #revrebel-post:', e);
      return;
    }

    // Validate essentials
    if (!d || !d.title || !d.authorName || !d.authorSlug){
      console.error('[REVREBEL JSON-LD] Missing required fields (title, authorName, authorSlug).');
      return;
    }

    /**
     * This function builds and injects the final JSON-LD script.
     * It's called after we've attempted to find the rich text field.
     * @param {number|undefined} wordCount - The calculated word count.
     */
    function buildAndInject(wordCount) {
      // Get the canonical URL from the <link> tag, falling back to the page's URL.
      const canonicalTag = document.querySelector('link[rel="canonical"]');
      const pageUrl = canonicalTag ? canonicalTag.href : window.location.href;

      // Normalize author URL/@id to absolute URL
      var authorSlug = (d.authorSlug || '').replace(/^\//, '');
      var authorUrl = 'https://revrebel.io/author/' + authorSlug;

      // Collect images (filter empties)
      var images = [];
      if (d.image1x1) images.push(d.image1x1);
      if (d.image4x3) images.push(d.image4x3);
      if (d.image16x9) images.push(d.image16x9);

      // Dates: prefer custom rev:* metas; fall back to article:* if present; emit ISO8601
      var dp = toISO(getMeta('revrebel:date-published')) || toISO(getMeta('article:published_time'));
      var dm = toISO(getMeta('revrebel:date-modified'))  || toISO(getMeta('article:modified_time'));

      var jsonld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": d.title,
        "description": d.description || '',
        "image": images,
        "url": pageUrl,
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
        "author": {
          "@type": "Person",
          "@id": authorUrl,
          "name": d.authorName,
          "url": authorUrl,
          "description": d.authorBio || undefined,
          "image": d.authorImage ? {
            "@type": "ImageObject",
            "url": d.authorImage
          } : undefined
        },
        "publisher": {
          "@type": "Organization",
          "name": d.publisherName || "CNTLShift",
          "logo": {
            "@type": "ImageObject",
            "url": d.publisherLogo || "https://res.cloudinary.com/revrebel/image/upload/v1756121061/website/brand/CTRLShift_bqjn17.png",
            "width": d.publisherLogoWidth ? parseInt(d.publisherLogoWidth, 10) : undefined,
            "height": d.publisherLogoHeight ? parseInt(d.publisherLogoHeight, 10) : undefined
          }
        },
        "datePublished": dp || undefined,
        "dateModified": dm || undefined,
        "articleSection": d.category || '',
        "keywords": d.keywords || '',
        "wordCount": wordCount
      };

      var s = document.createElement('script');
      s.type = 'application/ld+json';
      s.text = JSON.stringify(jsonld); // Modern browsers support .text
      document.head.appendChild(s);
    }

    // Poll for the richtext-field, as it may be rendered by Webflow after the initial 'load' event.
    let attempts = 0;
    const intervalId = setInterval(function() {
      const richTextField = document.getElementById("richtext-field");
      attempts++;
      if (richTextField || attempts >= 15) { // Try for ~3 seconds
        clearInterval(intervalId);
        let finalWordCount;
        if (richTextField) {
          const text = richTextField.innerText || richTextField.textContent || "";
          finalWordCount = text.split(/\s+/).filter(Boolean).length;
        } else {
          console.log('[REVREBEL JSON-LD] Note: #richtext-field not found after waiting. Word count will be omitted.');
        }
        buildAndInject(finalWordCount);
      }
    }, 200); // Check every 200ms
  });
})();

/*
  --------------------------------------------------------------------------
  -- HOW TO USE IN WEBFLOW -------------------------------------------------
  --------------------------------------------------------------------------

  1. Add the external script to your site/page settings (e.g., Before </body>).
     This loads the code on your page.
     For best results (especially for debugging), include all attributes:
     `<script
        defer
        src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/blog-meta-data.js"
        type="text/javascript"
        referrerpolicy="no-referrer"
        crossorigin="anonymous"></script>`

  2. Place the following JSON data block in an HTML Embed on your page, also
     before the </body> tag.
     Ensure the Webflow CMS bindings resolve correctly on publish.
     IMPORTANT: Keep the id exactly "revrebel-post".

  <script type="application/json" id="revrebel-post">
    {
    "title": "{{wf {&quot;path&quot;:&quot;name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "description": "{{wf {&quot;path&quot;:&quot;summary&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    // Use 1.91:1 ratio (1200x630) for the main image, as it's optimal for social sharing (X, FB, LinkedIn).
    "image16x9": "https://res.cloudinary.com/revrebel/image/upload/c_fill,w_1200,h_630/{{wf {&quot;path&quot;:&quot;cloudinary-image-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "image4x3":  "https://res.cloudinary.com/revrebel/image/upload/c_crop,ar_4:3/{{wf {&quot;path&quot;:&quot;cloudinary-image-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "image1x1":  "https://res.cloudinary.com/revrebel/image/upload/c_crop,ar_1:1/{{wf {&quot;path&quot;:&quot;cloudinary-image-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "authorName": "{{wf {&quot;path&quot;:&quot;expert-contributor:name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "authorSlug": "{{wf {&quot;path&quot;:&quot;expert-contributor:slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "category": "{{wf {&quot;path&quot;:&quot;category:name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "keywords": "{{wf {&quot;path&quot;:&quot;keywords&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "publisherName": "CNTLShift, The REVREBEL Blog",
    // For publisherLogo, use a square (1:1) logo, at least 112x112 pixels.
    "publisherLogo": "https://res.cloudinary.com/revrebel/image/upload/v1756121061/website/brand/CTRLShift_bqjn17.png",
    "publisherLogoWidth": "512",
    "publisherLogoHeight": "512",
    // For authorImage, use a clear, square (1:1) headshot, at least 300x300 pixels.
    "authorBio": "{{wf {&quot;path&quot;:&quot;expert-contributor:bio-summary&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "authorImage": "{{wf {&quot;path&quot;:&quot;expert-contributor:picture-url&quot;,&quot;type&quot;:&quot;Link&quot;\} }}"
  }
  </script>

  3. (Optional) Place these meta tags in the <head> of your page for more
     accurate date information. The script will find them and convert the
     dates to the required ISO 8601 format for schema.org.

  <meta name="revrebel:date-published" content="{{wf {&quot;path&quot;:&quot;publish-date&quot;,&quot;transformers&quot;:[{&quot;name&quot;:&quot;date&quot;,&quot;arguments&quot;:[&quot;MMM DD, YYYY&quot;]\}],&quot;type&quot;:&quot;Date&quot;\} }}">
  <meta name="revrebel:date-modified"  content="{{wf {&quot;path&quot;:&quot;updated-on&quot;,&quot;transformers&quot;:[{&quot;name&quot;:&quot;date&quot;,&quot;arguments&quot;:[&quot;MMM DD, YYYY&quot;]\}],&quot;type&quot;:&quot;Date&quot;\} }}">

  4. (Recommended) For dynamic word counts, ensure your main blog post
     content element (the Rich Text element in Webflow) has the ID
     "richtext-field". The script will automatically calculate the word count
     from this element. You do not need to add a "wordCount" property to the
     JSON data block above.

*/
