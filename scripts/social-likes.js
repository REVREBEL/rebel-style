

    // --- API Functions ---
    const createRecord = async (slug) => {
      try {
        // This endpoint should create a post with 0 likes/views and return the new record.
        // IMPORTANT: Verify this is the correct endpoint for creating a new record.
        const r = await fetch(`${BASE}/stats/${encodeURIComponent(slug)}`, { method: 'POST' });
        if (!r.ok) {
          console.error(`[Likes] Failed to create record for "${slug}": ${r.status} ${r.statusText}`);
          return null;
        }
        return await r.json();
      } catch (e) {
        console.error(`[Likes] Error creating record for "${slug}":`, e);
        return null;
      }
    };

    const fetchStats = async (slug) => {
      try {
        const r = await fetch(`${BASE}/stats/${encodeURIComponent(slug)}`);
        if (r.ok) {
          return await r.json();
        }

        // If not OK, read the response body to determine the cause.
        const responseText = await r.text();
        if (responseText.includes("Slug Not Found")) {
          // This is the specific case for a new post.
          console.log(`[Likes] Record for "${slug}" not found. Attempting to create.`);
          return await createRecord(slug);
        } else {
          // This is a genuine API failure.
          console.error(`[Likes] API Error for "${slug}": ${r.status} ${r.statusText}`, responseText);
        return null;
      }
      } catch (e) {
        console.error(`[Likes] Network error fetching stats for "${slug}":`, e);
        return null;
      }
    };

    const maybeIncrementViews = async (slug) => {
      