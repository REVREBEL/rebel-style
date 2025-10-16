
// If the ID changes per render, match the datepicker title pattern
(function stripDynamicId() {
  const el = document.querySelector('[id^="datepicker-"][id$="-title"]');
  if (el) el.textContent = el.textContent.replace(/\s*\b\d{4}\b$/, '');
})();


(() => {
  // Change this if you want to force a specific container
  const scope = document.querySelector('#choose-items-step-0') || document;

  const matchesTitle = (el) =>
    el &&
    el.nodeType === 1 &&
    el.matches?.('[id^="datepicker-"][id$="-title"]');

  const stripYear = (el) => {
    if (!el || !el.textContent) return;
    // Remove a trailing 4-digit year (handles normal & non-breaking spaces)
    el.textContent = el.textContent.replace(/\s*\u00A0?\b\d{4}\b\s*$/, '');
  };

  const scan = (root = scope) => {
    // Handle the element itself
    if (matchesTitle(root)) stripYear(root);
    // Handle any matching descendants
    root.querySelectorAll?.('[id^="datepicker-"][id$="-title"]').forEach(stripYear);
  };

  // Initial pass
  scan();

  // Observe for re-renders and text changes
  /**
   const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'characterData') {
        // Character data changed; ensure its parent chain is a title
        const el = m.target.parentNode;
        if (el && matchesTitle(el)) stripYear(el);
        continue;
      }
      // New or changed nodes
      if (m.type === 'childList') {
        m.addedNodes.forEach((n) => scan(n));
      }
      // Attribute changes (ID might flip)
      if (m.type === 'attributes' && matchesTitle(m.target)) {
        stripYear(m.target);
      }
    }
  });

  obs.observe(scope, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['id']
  });
  */ 
})();


(() => {
  const form = document.querySelector('.extended-form-wrapper[id^="FormEmbed_"][id$="-extended-form"]');
  if (!form) return;
  const id = form.id; // e.g., "FormEmbed_…-extended-form"

  // Your explicit path to the first THEAD row's TH cells:
  const topHeadTh =
    '#choose-items-step-0 > div:nth-child(1) > section > div.book-me-calendar.calendar.ng-scope > div > div > div > table > thead > tr:first-child > th';


  const css = `
    /* 1) When choice-step-more-options is active: set bg + text color */
    .extended-form-wrapper#${CSS.escape(id)}.choice-step-more-options .book-me-calendar.calendar table thead tr:first-child th button,
    .extended-form-wrapper#${CSS.escape(id)} .book-me-calendar.calendar table tr:first-child th button.uib-left::before,
    .extended-form-wrapper#${CSS.escape(id)} .book-me-calendar.calendar table tr:first-child th button.uib-right::after,
    ${topHeadTh} > button,
    ${topHeadTh} {
      background-color: #163666 !important;
      color: #B2D3DE !important;
    }

    /* 2) Change top background to white */
    #${CSS.escape(id)} > div.book-me.w-100 > div.book-me__background > div {
      background-color: #fff !important;
    }

    }

    /* 3) Default case: set bg only (text color left to inherit) */
    .extended-form-wrapper#${CSS.escape(id)} .book-me-calendar.calendar table thead tr:first-child th button,
    ${topHeadTh} > button,
    ${topHeadTh} {
      background-color: #163666 !important;
    }

    /* Ensure the button doesn't reintroduce its own bg and that it inherits color */
    .book-me-calendar.calendar thead tr:first-child th > button {
      background: transparent !important;
      color: inherit !important;
      display: block; width: 100%; 
    }

    /* Optional: make TH carry padding so it shows regardless of inner elements */ 
    /*  
    .book-me-calendar.calendar thead tr:first-child th {
      padding: 8px 12px !important;
      border: 0 !important;
    }  
    */   
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();



(() => {
  const el = document.querySelector('.extended-form-wrapper[id^="FormEmbed_"][id$="-extended-form"]');
  if (!el) return;
  const id = el.id; // e.g., "FormEmbed_…-extended-form"
  const css = `
    .extended-form-wrapper#${CSS.escape(id)} .uib-day .text-info {
        color: color-mix(in srgb, currentColor 30%, white) !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();



(() => {
  const form = document.querySelector('.extended-form-wrapper[id^="FormEmbed_"][id$="-extended-form"]');
  const day  = document.querySelector('[id^="datepicker-"][id$="-17"] > button'); // example: day “17”
  if (!form || !day) return;

  const dayCellId = day.parentElement.id; // e.g., "datepicker-161-6809-17"
  const css = `
    /* Make span colors inherit the button color */
    #${CSS.escape(dayCellId)} > button.btn-info .text-info,
    #${CSS.escape(dayCellId)} > button.btn-info .text-muted {
      color: inherit !important;
    }
    /* Optional: keep muted look without forcing a gray color */
    #${CSS.escape(dayCellId)} > button.btn-info .text-muted {
      opacity: .65 !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();



// Add an override <style> tag as the LAST stylesheet and keep it last.
(() => {
  const form = document.querySelector('.extended-form-wrapper[id^="FormEmbed_"][id$="-extended-form"]');
  if (!form) return;
  const id = form.id;
  const css = `
    /* Neutralize Bootstrap's .text-info/.text-muted inside this form */
    .extended-form-wrapper#${CSS.escape(id)} .appointment-card__duration,   
    .extended-form-wrapper#${CSS.escape(id)} .uib-day .text-info,
    .extended-form-wrapper#${CSS.escape(id)} .uib-day .text-muted {
      color: inherit !important;
    }
  `;

  const style = document.createElement('style');
  style.setAttribute('data-override', 'booking-dp');
  style.textContent = css;

  const append = () => document.head.appendChild(style);

  // Run as late as possible
  if (document.readyState === 'complete') append();
  else window.addEventListener('load', append, { once: true });

  // If anything else is appended later (SPA, widgets), re-append ours to stay last
  const keepLast = new MutationObserver(() => {
    if (style !== document.head.lastElementChild) document.head.appendChild(style);
  });
  keepLast.observe(document.head, { childList: true });
})();



(() => {
  const form = document.querySelector('.extended-form-wrapper[id^="FormEmbed_"][id$="-extended-form"]');
  if (!form) return;
  const id = form.id;
  const css = `
    .extended-form-wrapper#${CSS.escape(id)} .uib-day .text-info,
    .extended-form-wrapper#${CSS.escape(id)} .uib-day .text-muted {
      color: inherit !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
