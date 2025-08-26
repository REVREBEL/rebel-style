
/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Equalize Height-->
<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/equalize-height.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END Equalize Height -->

*/

/**
 * Equalizes the height of elements that share the same data-match-height group.
 *
 * Usage (HTML):
 * <div class="card" data-match-height="audit-card-items">...</div>
 * <div class="card" data-match-height="audit-card-items">...</div>
 *
 * <div class="card" data-match-height="team-card-items">...</div>
 * <div class="card" data-match-height="team-card-items">...</div>
 *
 * Elements with the same value of `data-match-height`
 * will have their heights matched independently.
 *
 * Dependencies:
 * - jQuery (for DOM selection, iteration, and event binding).
 *
 * Behavior:
 * - On page load, all groups are normalized to the tallest element in the group.
 * - On window resize, heights are recalculated and reapplied.
 */

/**
 * Match and equalize heights of elements with the same data-match-height group.
 */
function matchHeight() {
  // Collect elements grouped by their data-match-height value
  var groups = {};
  $('[data-match-height]').each(function () {
    var group = $(this).data('match-height');
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(this);
  });

  // Reset heights before recalculating
  $('[data-match-height]').css('min-height', 'auto');

  // Loop over each group and apply the tallest height
  $.each(groups, function (group, elements) {
    var maxHeight = 0;
    $(elements).each(function () {
      maxHeight = Math.max(maxHeight, $(this).outerHeight());
    });
    $(elements).css('min-height', maxHeight);
  });
}

/**
 * Initialize matchHeight functionality on page load and window resize.
 */
$(function () {
  matchHeight();                // Run once at load
  $(window).on('resize', matchHeight); // Re-run on resize
});



