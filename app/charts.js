/* Chart animations: played once each time a slide opens, in the order the presenter talks about them.
   Content is never changed; with reduced motion everything is simply shown in its final state. */
(function () {
  if (!window.gsap) return;
  var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.body.classList.add("cj");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (v) { return Math.round(v).toLocaleString("en-US"); };
  var live = [];
  function track(t) { live.push(t); return t; }
  function stopAll() { live.forEach(function (t) { t.progress(1).kill(); }); live = []; }

  function growBars(bars, opts) {
    opts = opts || {};
    return track(gsap.fromTo(bars, { scaleX: 0, transformOrigin: "0% 50%" },
      { scaleX: 1, duration: opts.duration || .6, stagger: opts.stagger == null ? .09 : opts.stagger, delay: opts.delay || 0, ease: "power3.out" }));
  }
  function countText(el, to, suffix, delay, dur) {
    var o = { v: 0 }; el.textContent = "0" + (suffix || "");
    return track(gsap.to(o, { v: to, duration: dur || .6, delay: delay || 0, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v) + (suffix || ""); } }));
  }
  function pulse(el, delay, color) {
    return track(gsap.fromTo(el, { boxShadow: "0 0 0 0 " + (color || "rgba(200,16,46,.55)") },
      { boxShadow: "0 0 0 10px rgba(200,16,46,0)", duration: .7, delay: delay, repeat: 1, ease: "power2.out", clearProps: "boxShadow" }));
  }

  var SLIDES = {
    /* slide 4: histogram of store means, left to right, then the 114-store bin pulses */
    3: function () {
      var rows = $$("#hist .row");
      growBars(rows.map(function (r) { return $(".trk i", r); }), { stagger: .1 });
      rows.forEach(function (r, k) { var s = $("span:last-child", r), v = parseInt(s.textContent, 10); countText(s, v, " stores", k * .1, .6); });
      if (rows[0]) pulse($(".trk", rows[0]), rows.length * .1 + .5);
    },
    /* slide 5: red line draws, dashed line follows, December peaks pop; weekday bars grow in order */
    4: function () {
      var l1 = $("#ts .l1"), c2 = $("#ts .c2r"), pk = $$("#ts .pk");
      if (l1) track(gsap.fromTo(l1, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "power1.inOut", autoRound: false }));
      if (c2) track(gsap.fromTo(c2, { attr: { width: 0 } }, { attr: { width: 900 }, duration: 1.1, delay: 1.5, ease: "power1.inOut" }));
      track(gsap.fromTo(pk, { scale: 0, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: .45, stagger: .25, delay: 2.4, ease: "back.out(3)" }));
      growBars($$("#wk .trk i"), { delay: .3, stagger: .07 });
    },
    /* slide 6: dots appear from few to many customers, so the upward drift shows; then the two promotion bars */
    5: function () {
      track(gsap.fromTo($$("#sc .pt"), { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
        { scale: 1, opacity: 1, duration: .3, ease: "back.out(3)", stagger: { amount: 1.5 } }));
      var rows = $$("#pr .row");
      growBars(rows.map(function (r) { return $(".trk i", r); }), { delay: .5, stagger: .45, duration: .7 });
      rows.forEach(function (r, k) { var s = $("span:last-child", r); countText(s, parseInt(s.textContent.replace(/,/g, ""), 10), "", .5 + k * .45, .7); });
      if (rows[1]) pulse($(".trk", rows[1]), 1.8);
    },
    /* slide 8: the eight models grow in validation rank order */
    7: function () {
      var rows = $$("#md button.row");
      growBars(rows.map(function (r) { return $(".trk i", r); }), { stagger: .08 });
      track(gsap.fromTo(rows, { x: -16, opacity: 0 }, { x: 0, opacity: 1, duration: .35, stagger: .08, ease: "power2.out", clearProps: "transform,opacity" }));
    },
    /* slide 9: calendar days flip in one by one, the total counts up */
    8: function () { cal(true); }
  };

  function cal(countUp) {
    var cells = $$("#cal button");
    track(gsap.fromTo(cells, { rotationX: -90, opacity: 0, transformPerspective: 400 }, { rotationX: 0, opacity: 1, duration: .35, stagger: .028, ease: "power2.out", clearProps: "transform,opacity" }));
    if (countUp) {
      var t = $("#tot"), end = parseFloat(t.textContent) || 0, o = { v: 0 };
      track(gsap.to(o, { v: end, duration: 1.2, delay: .2, ease: "power2.out", onUpdate: function () { t.textContent = o.v.toFixed(2); } }));
    }
  }

  window.Charts = {
    play: function (k) {
      stopAll();
      if (RM || !SLIDES[k]) return;
      SLIDES[k]();
    },
    /* weekday toggle: every bar morphs to its new value; Sunday flashes when it collapses or recovers */
    wk: function (from, to, max) {
      if (RM) return;
      var rows = $$("#wk .row");
      rows.forEach(function (r, k) {
        var bar = $(".trk i", r), s = $("span:last-child", r), o = { v: from[k] };
        gsap.fromTo(bar, { width: from[k] / max * 100 + "%" }, { width: to[k] / max * 100 + "%", duration: .8, ease: "power3.inOut" });
        gsap.to(o, { v: to[k], duration: .8, ease: "power3.inOut", onUpdate: function () { s.textContent = fmt(o.v); } });
      });
      var sun = rows[6];
      if (sun) gsap.fromTo(sun, { backgroundColor: "rgba(200,16,46,.28)" }, { backgroundColor: "rgba(200,16,46,0)", duration: 1.4, delay: .5, ease: "power2.out", clearProps: "backgroundColor" });
    },
    /* July reveal: red July bars appear one by one, the profile row flashes, then the table rows slide in */
    july: function () {
      if (RM) return;
      var jr = $$("#md > div.row"), bars = jr.map(function (r) { return $(".trk i", r); });
      gsap.fromTo(jr, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: .3, stagger: .14, ease: "power2.out", clearProps: "transform,opacity" });
      gsap.fromTo(bars, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: .5, stagger: .14, ease: "power3.out" });
      var prof = $("#md > div.row.hi");
      if (prof) gsap.fromTo(prof, { backgroundColor: "rgba(200,16,46,.3)" }, { backgroundColor: "rgba(200,16,46,0)", duration: 1.2, delay: jr.length * .14 + .3, repeat: 1, ease: "power2.out", clearProps: "backgroundColor" });
      var d = jr.length * .14 + .5;
      gsap.fromTo($("#vd"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45, delay: d, clearProps: "transform,opacity" });
      gsap.fromTo($$("#jl tbody tr"), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: .4, stagger: .15, delay: d + .3, ease: "power2.out", clearProps: "transform,opacity" });
    },
    cal: function () { if (!RM) cal(false); },
    stop: stopAll
  };
})();
