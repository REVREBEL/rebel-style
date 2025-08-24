(function(){
try{
mo = new MutationObserver(function(list){
for (var i=0;i<list.length;i++){
var m = list[i];
if (m.type === 'attributes' && m.attributeName === 'class'){
var has = w.classList.contains('is-visible');
// If always-on or before first decision, enforce
if (window.REV_SHARE_ALWAYS_ON || !firstDecisionMade){
if (!has){ w.classList.add('is-visible'); log('re-assert visible (class removed externally)'); }
}
}
}
});
mo.observe(w, { attributes:true, attributeFilter:['class'] });
}catch(_){}

// 3) Manual console helpers
window.revShareDebug = function(on){
if (typeof on === 'undefined') on = !w.classList.contains('is-visible');
if (on){ assertVisible(); } else { w.classList.remove('is-visible'); w.style.opacity=''; w.style.pointerEvents=''; }
log('manual toggle ->', !!on);
};
window.revShareForceAlways = function(on){ window.REV_SHARE_ALWAYS_ON = !!on; if (on) assertVisible(); log('always-on =', !!on); };

// 4) If user forces always-on, stop here
if (window.REV_SHARE_ALWAYS_ON){ log('ALWAYS_ON active'); return; }

// 5) Observer logic (when section exists). Decides first time, then disables assertVisible.
function decide(on){
if (on){ assertVisible(); }
else {
w.classList.remove('is-visible');
w.style.opacity=''; w.style.pointerEvents='';
}
if (!firstDecisionMade){ firstDecisionMade = true; log('first decision ->', on); }
}

if (sec && 'IntersectionObserver' in window){
var io = new IntersectionObserver(function(entries){
for (var i=0;i<entries.length;i++){
var e = entries[i];
if (e.target !== sec) continue;
var on = e.isIntersecting && e.intersectionRatio >= THRESHOLD;
// Extra bottom guard: if section bottom is within ~120px of viewport bottom, keep showing longer
var r = sec.getBoundingClientRect();
var vh = window.innerHeight || document.documentElement.clientHeight;
var nearEnd = (r.bottom - vh) < -120; // negative means past bottom
if (nearEnd) on = false;
decide(on);
log('IO ratio=', e.intersectionRatio.toFixed(3), 'on=', on, 'nearEnd=', nearEnd);
}
}, { root:null, rootMargin: ROOT_MARGIN, threshold: buildThresholds(THRESHOLD) });
io.observe(sec);
// Re-check after late layout changes
setTimeout(function(){ try{ io.unobserve(sec); io.observe(sec); }catch(_){} }, 600);
} else if (sec) {
// Scroll fallback
var ticking = false;
function frac(){
var b = sec.getBoundingClientRect(); var vh = window.innerHeight || document.documentElement.clientHeight;
var top = Math.max(0, b.top), bot = Math.min(vh, b.bottom); var vis = Math.max(0, bot-top); var base = Math.min(vh, b.height||1);
return base ? (vis/base) : 0;
}
function update(){ if (ticking) return; ticking = true; window.requestAnimationFrame(function(){ var on = frac() >= THRESHOLD; decide(on); ticking = false; }); }
window.addEventListener('scroll', update, {passive:true});
window.addEventListener('resize', update, {passive:true});
update(); setTimeout(update,300); setTimeout(update,1200);
} else {
// No section found; keep visible so the feature is usable rather than broken.
decide(true);
log('no section present; pinned visible');
}
});

function buildThresholds(main){
var arr = [0, 0.01, 0.05, main, 0.25, 0.5, 0.75, 1];
var seen={}, out=[]; for (var i=0;i<arr.length;i++){ var v=Math.max(0,Math.min(1,+arr[i]||0)); if(!seen[v]){seen[v]=1; out.push(v);} }
out.sort(function(a,b){return a-b}); return out;
}
})();
