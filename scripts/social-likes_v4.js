(function () {
  "use strict";
  /**
 * @overview
 * This script manages the "likes" and "views" system for blog posts using custom `data-*` attributes.
 * Elements configured with these attributes dynamically fetch, display, and update values from an API.
 *
 * ## Data Attributes
 *
 * - `data-post-views="{{SLUG}}"`  
 *   Identifies an element that displays the numeric view count for a blog post.
 *
 * - `data-post-likes="{{SLUG}}"`  
 *   Identifies an element that displays the numeric like count for a blog post.
 *
 * - `data-like-btn="{{SLUG}}"`  
 *   Marks an element as an interactive "like" button. Clicking it will POST a like to the API and
 *   update local storage.
 *
 * - `like-icon="{{SLUG}}"`  
 *   Refers to the visual icon representing a "like". Toggles the `is-liked` class for styling (e.g., color change).
 *
 * - `like-post="{{SLUG}}"`  
 *   Refers to the text element tied to a like button. Toggles the `is-liked` class to change its text
 *   from "like this XXX" to "liked".
 *
 * ## Behavior
 *
 * - **Unique Identifier**  
 *   The `{{SLUG}}` value acts as a unique identifier for each blog post. It is used both for API
 *   requests and to track liked content across multiple pages.
 *
 * - **Like Handling**  
 *   - Clicking a `data-like-btn` element triggers a POST request to the Like API.  
 *   - The post slug is saved in local storage to persist the "liked" state.  
 *   - On subsequent page loads, the script checks local storage and re-applies the `is-liked` class
 *     to any matching `like-icon` or `like-post` elements.
 *
 * - **View & Like Counters**  
 *   - Elements with `data-post-views` or `data-post-likes` attributes trigger a single GET request to
 *     the API.  
 *   - The script populates each element with the retrieved numeric values.  
 *   - View counts are always displayed with a `+` prefix (e.g., `+12`).
 *
 * ## Class Behavior
 *
 * - `is-liked`  
 *   - Applied to a `like-icon` → changes icon color.  
 *   - Applied to a `like-post` → updates text content from "like this XXX" to "liked".
 *
 * ## Summary
 * Together, these attributes and classes allow blog posts to dynamically display API-driven
 * view and like counts, while preserving user interactions across multiple pages through local storage.
 */
  (function () {
    "use strict";

    /**
     * This function contains the entire application logic. It is called by the
     * bootstrapper only after the necessary elements are present in the DOM.
     * @returns {void}
     */
    function run() {
      // --- Application-level Guards ---
      if (window.__social_likes_active) return;
      window.__social_likes_active = true;
      console.log("[Likes] Elements found. Running main logic.");

      /**
       * The base URL for the Xano API endpoints.
       * @constant {string}
       */
      const BASE = "https://x8ki-letl-twmt.n7.xano.io/api:cYJipMDK";
 

      // --- DOM & Utility Helpers ---

      /**
       * A robust querySelectorAll that always returns an array.
       * @param {string} sel - CSS selector.
       * @param {HTMLElement|Document} [root=document] - Root to search within.
       * @returns {HTMLElement[]} An array of elements found.
       */
      const $all = (sel, root = document) =>
        Array.from(root.querySelectorAll(sel));

      /**
       * Scans the DOM for all like/view related data attributes and returns a
       * Set of all unique slugs found on the page.
       * @returns {Set<string>} A Set of unique slug strings.
       */
      const getSlugsOnPage = () => new Set(
        $all('[data-like-btn], [data-post-likes], [data-post-views]')
          .map(el => el.getAttribute('data-like-btn') || el.getAttribute('data-post-likes') || el.getAttribute('data-post-views'))
          .filter(slug => slug && slug.trim())
          .map(slug => slug.trim())
      );

      // --- UI Update Functions ---

      /**
       * Updates the UI of a like button and its inner elements to reflect the
       * 'liked' state. It applies '.is-liked' to the wrapper and icon, and
       * '.is-like' to the text element, and changes the text content.
       * @param {string} slug - The slug of the post to update.
       * @param {boolean} liked - The new liked state.
       */
      const setLikedUI = (slug, liked) => {
        const btns = $all(`.like-button[data-like-btn="${slug}"]`);
        btns.forEach((btn) => {
          btn.classList.toggle("is-liked", liked);

          const icon = btn.querySelector(".like-icon");
          if (icon) icon.classList.toggle("is-liked", liked);

          const postText = btn.querySelector(".like-post");
          if (postText) {
            postText.classList.toggle("is-like", liked);
            // Store original text and update to "Liked"
            if (liked) {
              if (!postText.dataset.originalText) {
                postText.dataset.originalText = postText.textContent;
              }
              postText.textContent = "Liked";
            } else {
              // Restore original text if it exists
              if (postText.dataset.originalText) {
                postText.textContent = postText.dataset.originalText;
              }
            }
          }
        });
      };

      /**
       * Finds all elements for a given slug that display the like count and
       * updates their text content.
       * @param {string} slug - The slug of the post.
       * @param {number} likes - The number of likes.
       */
      const updateLikesText = (slug, likes) => {
        $all(`[data-post-likes="${slug}"]`).forEach((el) => {
          el.textContent = likes?.toLocaleString() ?? "0";
        });
      };

      /**
       * Finds all elements for a given slug that display the view count and
       * updates their text content, prefixed with a "+".
       * @param {string} slug - The slug of the post.
       * @param {number} views - The number of views.
       */
      const updateViewsText = (slug, views) => {
        $all(`[data-post-views="${slug}"]`).forEach((el) => {
          el.textContent = `+${views?.toLocaleString() ?? "0"}`;
        });
      };

      // --- LocalStorage Interaction ---

      /**
       * Generates the localStorage key for a post's liked state.
       * @param {string} slug - The post slug.
       * @returns {string} The localStorage key.
       */
      const getLikedKey = (slug) => `liked:${slug}`;

      /**
       * Generates the localStorage key for a post's last viewed timestamp.
       * @param {string} slug - The post slug.
       * @returns {string} The localStorage key.
       */
      const getViewedKey = (slug) => `viewed:${slug}`;

      // --- API Interaction ---

      /**
       * Creates a new record in the Xano database for a given slug. This is
       * called when a GET request reveals a post has no stats yet.
       * @async
       * @param {string} slug - The slug of the post to create.
       * @returns {Promise<object|null>} The newly created record, or null on failure.
       */
      const createRecord = async (slug) => {
        try {
          const r = await fetch(`${BASE}/blog_stats/${encodeURIComponent(slug)}`, {
            method: "POST",
          });
          if (!r.ok) {
            console.error(`[Likes] Failed to create record for "${slug}": ${r.status}`);
            return null;
          }
          return await r.json();
        } catch (e) {
          console.error(`[Likes] Network error creating record for "${slug}":`, e);
          return null;
        }
      };

      /**
       * Fetches the like and view counts for a given slug. If the slug is not
       * found, it triggers the createRecord function.
       * @async
       * @param {string} slug - The slug of the post.
       * @returns {Promise<object|null>} The blog_stats object, or null on failure.
       */
      const fetchStats = async (slug) => {
        try {
          const r = await fetch(`${BASE}/blog_stats/${encodeURIComponent(slug)}`);
          if (r.ok) return await r.json();

          const responseText = await r.text();
          if (responseText.includes("Slug Not Found")) {
            console.log(`[Likes] Record for "${slug}" not found. Attempting to create.`);
            return await createRecord(slug);
          }

          console.error(`[Likes] API Error fetching blog_stats for "${slug}": ${r.status}`, responseText);
          return null;
        } catch (e) {
          console.error(`[Likes] Network error fetching blog_stats for "${slug}":`, e);
          return null;
        }
      };

      /**
       * Increments the view count for a slug via a POST request. This is guarded
       * by localStorage to only happen once per 24 hours per browser.
       * @async
       * @param {string} slug - The slug of the post to update.
       * @returns {Promise<object|null>} The updated stats object, or null.
       */
      const maybeIncrementViews = async (slug) => {
        const key = getViewedKey(slug);
        const lastMs = Number(localStorage.getItem(key) || "0");
        const now = Date.now();
        const DAY = 24 * 60 * 60 * 1000;
        if (now - lastMs <= DAY) return null; // Guard: Already viewed recently.

        try {
          const r = await fetch(`${BASE}/blog_stats_views/${encodeURIComponent(slug)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ record_type: "view" }),
          });
          if (!r.ok) return null;
          const data = await r.json();
          localStorage.setItem(key, String(now));
          return data;
        } catch (e) {
          console.error(`[Likes] Error incrementing blog_stats_views for "${slug}":`, e);
          return null;
        }
      };

      /**
       * Increments the like count for a slug via a POST request.
       * @async
       * @param {string} slug - The slug of the post to update.
       * @returns {Promise<object|null>} The updated blog_stats_likes object, or null.
       */
      const incrementLikes = async (slug) => {
        try {
          const r = await fetch(`${BASE}/blog_stats_likes/${encodeURIComponent(slug)}`, {
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

      // --- Event Binding ---

      /**
       * A single, delegated event listener on the document body to handle clicks
       * on any like button, including those added dynamically to the page.
       */
      document.body.addEventListener("click", async (e) => {
        const btn = e.target.closest('[data-like-btn]');
        if (!btn) return;

        e.preventDefault();
        const slug = btn.getAttribute("data-like-btn")?.trim();
        if (!slug) return;

        // Guard: Do not allow re-liking from the same browser.
        const likedKey = getLikedKey(slug);
        if (localStorage.getItem(likedKey)) return;

        // Optimistic UI update: Show the liked state immediately.
        setLikedUI(slug, true);
        localStorage.setItem(likedKey, "1");

        // Send the like to the API.
        const data = await incrementLikes(slug);
        if (data) {
          // If successful, update the count from the API response.
          updateLikesText(slug, data.likes);
        } else {
          // If the API call fails, revert the UI and remove the local record.
          console.error(`[Likes] Failed to save like for "${slug}". Reverting UI.`);
          setLikedUI(slug, false);
          localStorage.removeItem(likedKey);
        }
      });

      // --- Main Initialization Logic ---

      /**
       * This is the main execution block. It finds all unique slugs on the page,
       * then for each one, it fetches stats, updates the UI, and attempts to
       * increment the view count.
       */
      const uniqueSlugs = getSlugsOnPage();
      if (uniqueSlugs.size === 0) return; // no work

      uniqueSlugs.forEach(async (slug) => {
        // First, set the UI based on localStorage for immediate feedback.
        const isLikedLocally = !!localStorage.getItem(getLikedKey(slug));
        setLikedUI(slug, isLikedLocally);

        // Then, fetch the latest stats from the server.
        const stats = await fetchStats(slug);
        if (stats) {
          updateLikesText(slug, stats.likes);
          updateViewsText(slug, stats.views);
        } else {
          // If fetching fails or the record is new, default to 0.
          updateLikesText(slug, 0);
          updateViewsText(slug, 0);
        }

        // Finally, attempt to increment the view count for this session.
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
     * This function boots the application. It waits for the like/view elements
     * to appear in the DOM before running the main `run()` function. This is
     * crucial for pages where content is loaded or filtered dynamically.
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

      // Otherwise, use a MutationObserver to wait for them to be added.
      const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector(selector)) {
          window.__social_likes_booted = true;
          run();
          obs.disconnect(); // Important: run only once.
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Start the application ---
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  })();
}());

