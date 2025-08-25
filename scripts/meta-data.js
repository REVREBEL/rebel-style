(function(){
  if (window.__revJsonLdInit) return; // guard against double‑init in Preview/Code Compile
  window.__revJsonLdInit = true;

  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
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

    // Get the canonical URL from the <link> tag, falling back to the page's URL.
    // This is the most reliable source for the page's primary URL.
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

    // Calculate word count dynamically from the rich text field.
    // Falls back to the 'wordCount' value from the JSON data block if the element isn't found.
    let finalWordCount;
    const richTextField = document.getElementById("richtext-field");
    if (richTextField) {
      // Use innerText to get the rendered text content, which is closer to what a user sees.
      const text = richTextField.innerText || richTextField.textContent || "";
      // Split by whitespace and filter out empty strings from multiple spaces.
      finalWordCount = text.split(/\s+/).filter(Boolean).length;
    } else {
      // Fallback to the value from the data block if the element is not present.
      finalWordCount = d.wordCount ? parseInt(d.wordCount, 10) : undefined;
      if (!d.wordCount) {
        console.log('[REVREBEL JSON-LD] Note: #richtext-field not found and no wordCount in data block.');
      }
    }


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
          // The script will automatically include width and height if you provide them.
          "width": d.publisherLogoWidth ? parseInt(d.publisherLogoWidth, 10) : undefined,
          "height": d.publisherLogoHeight ? parseInt(d.publisherLogoHeight, 10) : undefined
        }
      },
      "datePublished": dp || undefined,
      "dateModified": dm || undefined,
      "articleSection": d.category || '',
      "keywords": d.keywords || '',
      "wordCount": finalWordCount
    };

    // JSON.stringify will automatically omit keys with `undefined` values,
    // so we don't need to manually clean the object.

    var s = document.createElement('script');
    s.type = 'application/ld+json';
    try {
      s.text = JSON.stringify(jsonld);
    } catch (e){
      s.appendChild(document.createTextNode(JSON.stringify(jsonld)));
    }
    document.head.appendChild(s);
  });
})();

/*
  --------------------------------------------------------------------------
  -- HOW TO USE IN WEBFLOW -------------------------------------------------
  --------------------------------------------------------------------------

  /*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Meta-Data Capture + Publish-->

<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/share-icons-visibility.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>

<!-- END Meta-Data Capture + Publish  -->

*/

  1. Place the JavaScript code (the (function(){...})(); block above) in
     Page Settings → Before </body> tag.

  2. Place the following JSON data block on the page, also before the </body> tag.
     Ensure the Webflow CMS bindings resolve correctly on publish.
     IMPORTANT: Keep the id exactly "revrebel-post".

  <script type="application/json" id="revrebel-post">
  {
    "title": "{{wf {&quot;path&quot;:&quot;name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "description": "{{wf {&quot;path&quot;:&quot;summary&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "image16x9": "https://res.cloudinary.com/revrebel/image/upload/{{wf {&quot;path&quot;:&quot;cloudinary-image-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}/ar_16:9,c_thumb,g_auto",
    "image4x3":  "https://res.cloudinary.com/revrebel/image/upload/{{wf {&quot;path&quot;:&quot;cloudinary-image-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}/ar_4:3,c_thumb,g_auto",
    "image1x1":  "https://res.cloudinary.com/revrebel/image/upload/{{wf {&quot;path&quot;:&quot;cloudinary-image-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}/ar_1:1,c_thumb,g_auto",
    "authorName": "{{wf {&quot;path&quot;:&quot;expert-contributor:name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "authorSlug": "{{wf {&quot;path&quot;:&quot;expert-contributor:slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "category": "{{wf {&quot;path&quot;:&quot;category:name&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    "keywords": "{{wf {&quot;path&quot;:&quot;keywords&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",

    "publisherName": "CNTLShift",
    // For publisherLogo, use a square (1:1) logo, at least 112x112 pixels.
    "publisherLogo": "https://.../path-to-your-CNTLShift-logo.png",
    "publisherLogoWidth": "512",
    "publisherLogoHeight": "512",
    "authorBio": "{{wf {&quot;path&quot;:&quot;expert-contributor:bio&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}",
    // For authorImage, use a clear, square (1:1) headshot, at least 300x300 pixels.
    "authorImage": "{{wf {&quot;path&quot;:&quot;expert-contributor:profile-image&quot;,&quot;type&quot;:&quot;ImageRef&quot;\} }}",
  }
  </script>

  3. (Optional) Place these meta tags in the <head> of your page for more
     accurate date information. The script will find them and convert the
     dates to the required ISO 8601 format for schema.org.

  <meta name="revrebel:date-published" content="{{wf {&quot;path&quot;:&quot;publish-date&quot;,&quot;transformers&quot;:[{&quot;name&quot;:&quot;date&quot;,&quot;arguments&quot;:[&quot;MMM DD, YYYY&quot;]\}],&quot;type&quot;:&quot;Date&quot;\} }}">
  <meta name="revrebel:date-modified"  content="{{wf {&quot;path&quot;:&quot;updated-on&quot;,&quot;transformers&quot;:[{&quot;name&quot;:&quot;date&quot;,&quot;arguments&quot;:[&quot;MMM DD, YYYY&quot;]\}],&quot;type&quot;:&quot;Date&quot;\} }}">

  4. (Recommended) For dynamic word counts, ensure your main blog post
     content element (the Rich Text element in Webflow) has the ID
     "richtext-field". The script will automatically calculate the word
     count. The "wordCount" property in the JSON block above will be
     used as a fallback if this element is not found.

*/
