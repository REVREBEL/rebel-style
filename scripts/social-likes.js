// 20250827 7:30AM
/*! REVREBEL Blog Likes & Views Module
 *
 * Handles tracking and displaying likes & views for blog posts
 * using a Xano backend. Automatically initializes on page load.
 *
 * Usage:
 *  - Add `data-like-btn="{{slug}}"` to like button wrappers
 *  - Add `data-post-likes="{{slug}}"` to elements showing like counts
 *  - Add `data-post-views="{{slug}}"` to elements showing view counts
 *  - Script will:
 *      * Fetch counts from Xano
 *      * Increment view once per visitor per 24h
 *      * Increment likes on click
 *      * Store liked state in localStorage and update UI
 */

/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Blog Likes & Views Module  -->

<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/social-likes.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>

<!-- END Blog Likes & Views Module -->
*/


(function () {
  "use strict";

  // This function contains the entire application logic.
  // It will only be called once the necessary elements are on the page.
  function run() {
    // --- Guard against re-initialization ---
    if (window.__social_likes_active) return;
    window.__social_likes_active = true;

    console.log("[Likes] Elements found. Running main logic.");

    /** @constant {string} BASE - The base URL for the Xano API. */
    const BASE = "https://x8ki-letl-twmt.n7.xano.io/api:cYJipMDK";

    // -------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------

    /**
     * QuerySelectorAll wrapper returning an array.
     * @param {string} sel - CSS selector.
     * @param {HTMLElement|Document} [root=document] - Root to search within.
     * @returns {HTMLElement[]} Elements found.
     */
    const $all = (sel, root = document) =>
      Array.from(root.querySelectorAll(sel));

    /**
     * Groups DOM elements by a slug value stored in a given attribute.
     * @param {string} attr - Attribute name to read (e.g. "data-like-btn").
     * @returns {Map<string, HTMLElement[]>} Map of slug → elements.
     */
    const groupBySlug = (attr) => {
      const map = new Map();
      $all(`[${attr}]`).forEach((el) => {
        const slug = el.getAttribute(attr)?.trim();
        if (!slug) return;
        if (!map.has(slug)) map.set(slug, []);
        map.get(slug).push(el);
      });
      return map;
    };

    // -------------------------------------------------------------------
    // Collect slugs and elements
    // -------------------------------------------------------------------

    /** @type {Set<string>} All unique slugs found on the page. */
    const uniqueSlugs = new Set([
      ...groupBySlug("data-like-btn").keys(),
      ...groupBySlug("data-post-likes").keys(),
      ...groupBySlug("data-post-views").keys(),
    ]);

    if (uniqueSlugs.size === 0) return; // no work

    // -------------------------------------------------------------------
    // UI Functions
    // -------------------------------------------------------------------

    /**
     * Toggle liked UI state for a slug.
     * @param {string} slug - Post slug.
     * @param {boolean} liked - Whether it's liked.
     */
    const setLikedUI = (slug, liked) => {
      // Re-query the DOM each time to handle dynamic content.
      const btns = $all(`[data-like-btn="${slug}"]`);
      btns.forEach((btn) => {
        btn.classList.toggle("is-liked", liked);
        // Find and update the icon and text elements inside this specific button.
        const icon = btn.querySelector(".like-icon");
        if (icon) icon.classList.toggle("is-liked", liked);
        const postText = btn.querySelector(".like-post");
        if (postText) postText.classList.toggle("is-like", liked);
      });
    };

    /**
   * Update likes text in DOM.
   * @param {string} slug - Post slug.
   * @param {number} likes - Number of likes.
   */
  const updateLikesText = (slug, likes) => {
    // Re-query the DOM each time to handle dynamic content.
    $all(`[data-post-likes="${slug}"]`).forEach((el) => {
      el.textContent = likes?.toLocaleString() ?? "0";
    });
  };

  
  /**
   * Update views text in DOM (always prefixed with +).
   * @param {string} slug - Post slug.
   * @param {number} views - Number of views.
   */
  const updateViewsText = (slug, views) => {
    // Re-query the DOM each time to handle dynamic content.
    $all(`[data-post-views="${slug}"]`).forEach((el) => {
      el.textContent = `+${views?.toLocaleString() ?? "0"}`;
    });
  };

  // -------------------------------------------------------------------
  // LocalStorage Helpers
  // -------------------------------------------------------------------

  /** @param {string} slug @returns {string} LocalStorage key for likes */
  const getLikedKey = (slug) => `liked:${slug}`;
  /** @param {string} slug @returns {string} LocalStorage key for views */
  const getViewedKey = (slug) => `viewed:${slug}`;

  // Init liked UI state from localStorage
  uniqueSlugs.forEach((slug) => {
    const liked = !!localStorage.getItem(getLikedKey(slug));
    setLikedUI(slug, liked);
  });

  // -------------------------------------------------------------------
  // API Functions
  // -------------------------------------------------------------------

  /**
   * Create a new record in Xano if none exists.
   * @async
   * @param {string} slug - Post slug.
   * @returns {Promise<object|null>} New record or null.
   */
  const createRecord = async (slug) => {
    try {
      const r = await fetch(`${BASE}/stats/${encodeURIComponent(slug)}`, {
        method: "POST",
      });
      if (!r.ok) {
        console.error(
          `[Likes] Failed to create record for "${slug}": ${r.status}`
        );
        return null;
      }
      return await r.json();
    } catch (e) {
      console.error(`[Likes] Error creating record for "${slug}":`, e);
      return null;
    }
  };

  /**
   * Fetch stats (likes, views) for a slug.
   * @async
   * @param {string} slug - Post slug.
   * @returns {Promise<object|null>} Stats or null.
   */
  const fetchStats = async (slug) => {
    try {
      const r = await fetch(`${BASE}/stats/${encodeURIComponent(slug)}`);
      if (r.ok) return await r.json();

      const responseText = await r.text();
      if (responseText.includes("Slug Not Found")) {
        return await createRecord(slug);
      }
      console.error(
        `[Likes] API Error for "${slug}": ${r.status}`,
        responseText
      );
      return null;
    } catch (e) {
      console.error(`[Likes] Network error fetching stats for "${slug}":`, e);
      return null;
    }
  };

  /**
   * Increment views (only once per 24h per browser).
   * @async
   * @param {string} slug - Post slug.
   * @returns {Promise<object|null>} Updated record or null.
   */
  const maybeIncrementViews = async (slug) => {
    const key = getViewedKey(slug);
    const lastMs = Number(localStorage.getItem(key) || "0");
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    if (now - lastMs <= DAY) return null;

    try {
      const r = await fetch(`${BASE}/views/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_type: "view" }),
      });
      if (!r.ok) return null;
      const data = await r.json();
      localStorage.setItem(key, String(now));
      return data;
    } catch (e) {
      console.error(`[Likes] Error incrementing views for "${slug}":`, e);
      return null;
    }
  };

  /**
   * Increment likes.
   * @async
   * @param {string} slug - Post slug.
   * @returns {Promise<object|null>} Updated record or null.
   */
  const incrementLikes = async (slug) => {
    try {
      const r = await fetch(`${BASE}/likes/${encodeURIComponent(slug)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record_type: "like" }),
      });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) {
      console.error(`[Likes] Error incrementing likes for "${slug}":`, e);
      return null;
    }
  };

  // -------------------------------------------------------------------
  // Event Binding
  // -------------------------------------------------------------------

  // Use a single, delegated event listener on the body.
  // This works even if elements are added/removed from the DOM dynamically.
  document.body.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-like-btn]");
    if (!btn) return;

    e.preventDefault();
    const slug = btn.getAttribute("data-like-btn")?.trim();
    if (!slug) return;

    const likedKey = getLikedKey(slug);
    if (localStorage.getItem(likedKey)) return;

    setLikedUI(slug, true);
    localStorage.setItem(likedKey, "1");

    const data = await incrementLikes(slug);
    if (data) {
      updateLikesText(slug, data.likes);
    } else {
      setLikedUI(slug, false);
      localStorage.removeItem(likedKey);
    }
  });

  // -------------------------------------------------------------------
  // Main Logic
  // -------------------------------------------------------------------

  uniqueSlugs.forEach(async (slug) => {
    const stats = await fetchStats(slug);
    if (stats) {
      updateLikesText(slug, stats.likes);
      updateViewsText(slug, stats.views);
    } else {
      updateLikesText(slug, 0);
      updateViewsText(slug, 0);
    }

    // Re-query the DOM to see if a view count element exists for this slug.
    if ($all(`[data-post-views="${slug}"]`).length > 0) {
      const updated = await maybeIncrementViews(slug);
      if (updated) {
        updateViewsText(slug, updated.views);
        if (typeof updated.likes === "number") {
          updateLikesText(slug, updated.likes);
        }
      }
    }
  });
}
  
  /**
   * This function boots the application. It waits for the like/view
   * elements to appear before running the main logic. This handles
   * content that is loaded dynamically.
   */
  function boot() {
    if (window.__social_likes_booted) return;
    const selector = '[data-like-btn], [data-post-likes], [data-post-views]';

    // If elements are already here, run immediately.
    if (document.querySelector(selector)) {
      window.__social_likes_booted = true;
      run();
      return;
    }

    // Otherwise, wait for them to be added to the DOM.
    const observer = new MutationObserver((mutations, obs) => {
      if (document.querySelector(selector)) {
        window.__social_likes_booted = true;
        run();
        obs.disconnect(); // Important: run only once.
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
})();
