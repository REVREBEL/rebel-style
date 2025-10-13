<!-- START CLOSE TOGGLE ON TABLET OR LARGER BY DEFAULT -->
<script>
if (window.innerWidth >= 768) {
  document.getElementById('faq-dropdown-1')?.classList.add('w--open');
  document.getElementById('faq-dropdown-2')?.classList.add('w--open');
  document.getElementById('faq-dropdown-3')?.classList.add('w--open');
  document.getElementById('faq-dropdown-4')?.classList.add('w--open');
  document.getElementById('faq-dropdown-5')?.classList.add('w--open');
  document.getElementById('faq-dropdown-6')?.classList.add('w--open');
  document.getElementById('faq-dropdown-7')?.classList.add('w--open');
}
</script>

<!-- END CLOSE TOGGLE ON TABLET OR LARGER BY DEFAULT -->

<!-- START OPEN TOGGLE ON TABLET OR LARGER BY DEFAULT -->

<script>
  var Webflow = Webflow || [];
  Webflow.push(function () {
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    var ids = ['faq-dropdown-1','faq-dropdown-2','faq-dropdown-3','faq-dropdown-4','faq-dropdown-5','faq-dropdown-6','faq-dropdown-7'];

    ids.forEach(function (id) {
      var wrap = document.getElementById(id);
      if (!wrap) return;

      var toggle = wrap.querySelector('.w-dropdown-toggle');
      var list   = wrap.querySelector('.w-dropdown-list');
      
      wrap.classList.remove('w--open');
      classList.remove('w--open');
      if (toggle) { toggle.classList.remove('w--open'); toggle.setAttribute('aria-expanded','false'); }
      if (list)   { list.classList.remove('w--open');   list.style.display = 'none'; }
    });
  });
</script>

<!-- END OPEN TOGGLE ON TABLET OR LARGER BY DEFAULT -->