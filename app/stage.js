/* Stage show: drugstore opening film, team walk-on, handover cards and curtain call. Needs GSAP (assets/vendor). */
(function () {
  var SITE = "https://zizi821.github.io/ADS1002-Final-Presentation/";
  var PRES = [
    { name: "Li Yiming", ini: "LY", slides: "Slides 1–2", role: "Business context, data and research questions", col: "#c8102e" },
    { name: "Lim Ying Yu", ini: "YY", slides: "Slides 3–4", role: "Data wrangling and store statistics", col: "#1f8a7d" },
    { name: "Tay Chen Zhe", ini: "CZ", slides: "Slides 5–6", role: "Calendar patterns, customers and promotions", col: "#d98a00" },
    { name: "Huang Qingyue", ini: "QY", slides: "Slides 7–8", role: "Forecast design and model results", col: "#3d6fc4" },
    { name: "Yanyu Zhu", ini: "YZ", slides: "Slides 9–10", role: "Scenarios, recommendations and next steps", col: "#7a5cc7" }
  ];
  var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";
  var el, mode = null, film = null, teamTw = null, pendingSlide = null, $ = function (s, r) { return (r || el).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || el).querySelectorAll(s)); };

  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var COLS = ["#c8102e", "#1f8a7d", "#f2a900", "#3d7dd8", "#e86f9a", "#7a5cc7", "#2fa36b", "#ffffff"];

  /* ---------- drawing helpers ---------- */
  function product(r, x, base) {
    var k = Math.floor(r() * 4), c = COLS[Math.floor(r() * COLS.length)], s = "", w;
    if (k === 0) { var h = 26 + r() * 16; w = 14; s = '<rect x="' + x + '" y="' + (base - h) + '" width="14" height="' + h + '" rx="4" fill="' + c + '"/><rect x="' + (x + 4) + '" y="' + (base - h - 6) + '" width="6" height="7" fill="' + c + '"/><rect x="' + (x + 2.5) + '" y="' + (base - h - 11) + '" width="9" height="6" rx="1.5" fill="#33404b"/><rect x="' + (x + 2) + '" y="' + (base - h * .62) + '" width="10" height="8" fill="#fff" opacity=".8"/>'; }
    else if (k === 1) { var bh = 20 + r() * 16; w = 18 + Math.floor(r() * 8); s = '<rect x="' + x + '" y="' + (base - bh) + '" width="' + w + '" height="' + bh + '" rx="2" fill="' + c + '"/><rect x="' + x + '" y="' + (base - bh * .6) + '" width="' + w + '" height="5" fill="#fff" opacity=".75"/>'; }
    else if (k === 2) { w = 10; s = '<rect x="' + x + '" y="' + (base - 38) + '" width="10" height="32" rx="3" fill="' + c + '"/><rect x="' + (x + 2) + '" y="' + (base - 6) + '" width="6" height="6" fill="#33404b"/>'; }
    else { w = 20; s = '<rect x="' + x + '" y="' + (base - 18) + '" width="20" height="18" rx="5" fill="' + c + '"/><rect x="' + (x - 1) + '" y="' + (base - 23) + '" width="22" height="6" rx="2" fill="#33404b"/>'; }
    return { svg: '<g class="prod">' + s + '</g>', w: w };
  }

  function buildFilm() {
    var r = rng(1115), h = [];
    h.push('<defs><linearGradient id="sgN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060b14"/><stop offset="1" stop-color="#16263a"/></linearGradient>' +
      '<linearGradient id="sgD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb37a"/><stop offset=".55" stop-color="#ffd9a8"/><stop offset="1" stop-color="#fff1d6"/></linearGradient>' +
      '<radialGradient id="lampG" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".85"/><stop offset="1" stop-color="#ffe7a3" stop-opacity="0"/></radialGradient>' +
      '<filter id="glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>' +
      '<clipPath id="shutClip"><rect x="482" y="455" width="646" height="265"/></clipPath></defs>');
    h.push('<rect width="1600" height="900" fill="url(#sgN)"/><rect class="day" width="1600" height="900" fill="url(#sgD)" opacity="0"/>');
    h.push('<g class="stars">');
    for (var i = 0; i < 46; i++) h.push('<circle cx="' + (r() * 1600).toFixed(0) + '" cy="' + (r() * 380).toFixed(0) + '" r="' + (0.8 + r() * 1.6).toFixed(1) + '" fill="#fff" opacity="0"/>');
    h.push('</g>');
    /* ---- the world: street + store (zooms out later) ---- */
    h.push('<g class="world">');
    h.push('<rect x="-400" y="250" width="420" height="470" fill="#1b2631"/><rect x="1180" y="200" width="520" height="520" fill="#1b2631"/><rect x="1230" y="260" width="70" height="90" fill="#2c3a47"/><rect x="1340" y="260" width="70" height="90" fill="#2c3a47"/><rect x="1230" y="400" width="70" height="90" fill="#2c3a47"/>');
    h.push('<rect x="-400" y="720" width="2400" height="40" fill="#4a515a"/><rect x="-400" y="760" width="2400" height="200" fill="#262b31"/>');
    for (i = 0; i < 9; i++) h.push('<rect x="' + (i * 200 - 60) + '" y="828" width="110" height="8" fill="#d9d2c0" opacity=".5"/>');
    /* lamp */
    h.push('<polygon class="cone" points="300,342 170,760 430,760" fill="url(#lampG)" opacity="0"/><rect x="294" y="330" width="10" height="390" fill="#36414c"/><rect x="270" y="322" width="58" height="14" rx="5" fill="#36414c"/><ellipse class="bulb" cx="299" cy="340" rx="20" ry="6" fill="#4b5560"/>');
    /* store */
    h.push('<g class="shop"><rect x="450" y="250" width="700" height="472" fill="#efe9dc"/><rect x="438" y="236" width="724" height="22" fill="#d8cfbd"/>');
    h.push('<rect x="470" y="276" width="660" height="92" rx="8" fill="#4a1520"/><text x="800" y="338" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-weight="700" font-size="58" fill="#6d2a35" letter-spacing="8">DROGERIE</text>');
    h.push('<g class="sign" opacity="0"><rect x="470" y="276" width="660" height="92" rx="8" fill="#c8102e" filter="url(#glow)" opacity=".8"/><rect x="470" y="276" width="660" height="92" rx="8" fill="#c8102e"/><text x="800" y="338" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-weight="700" font-size="58" fill="#fff" letter-spacing="8">DROGERIE</text><text x="800" y="360" text-anchor="middle" font-size="13" fill="#ffd6dc" letter-spacing="5">DRUGSTORE · HEALTH · BEAUTY</text></g>');
    /* awning */
    h.push('<g>');
    for (i = 0; i < 12; i++) h.push('<rect x="' + (470 + i * 55) + '" y="380" width="55" height="46" fill="' + (i % 2 ? "#fbf8f1" : "#c8102e") + '"/><circle cx="' + (497.5 + i * 55) + '" cy="426" r="27.5" fill="' + (i % 2 ? "#fbf8f1" : "#c8102e") + '"/>');
    h.push('</g><rect x="470" y="372" width="660" height="10" fill="#8f0b21"/>');
    /* window + shelves + products */
    h.push('<rect class="win" x="490" y="462" width="400" height="250" fill="#141d26"/>');
    var shelves = [540, 618, 696], prods = [];
    shelves.forEach(function (sy) {
      h.push('<rect x="496" y="' + sy + '" width="388" height="6" fill="#b49c7a"/>');
      var x = 504;
      while (x < 862) { var p = product(r, x, sy); if (x + p.w > 878) break; prods.push(p.svg); x += p.w + 4 + Math.floor(r() * 6); }
    });
    h.push('<g class="prods">' + prods.join("") + '</g>');
    h.push('<rect x="490" y="462" width="400" height="250" fill="none" stroke="#8b8172" stroke-width="8"/>');
    /* door */
    h.push('<rect x="920" y="462" width="200" height="258" fill="#22313c"/><rect class="glass" x="936" y="478" width="168" height="160" fill="#2d4252"/><rect x="1088" y="580" width="8" height="34" rx="3" fill="#c9b79c"/>');
    h.push('<line x1="1000" y1="478" x2="1020" y2="500" stroke="#c9b79c" stroke-width="2"/><line x1="1040" y1="478" x2="1020" y2="500" stroke="#c9b79c" stroke-width="2"/>');
    h.push('<g class="osign"><rect x="965" y="500" width="110" height="40" rx="6" fill="#fbf8f1"/><text class="otxt" x="1020" y="527" text-anchor="middle" font-weight="700" font-size="19" fill="#c8102e" letter-spacing="2">CLOSED</text></g>');
    /* shutter */
    h.push('<g clip-path="url(#shutClip)"><g class="shutter"><rect x="482" y="455" width="646" height="265" fill="#8e979f"/>');
    for (i = 0; i < 22; i++) h.push('<rect x="482" y="' + (462 + i * 12) + '" width="646" height="2" fill="#6b747c"/>');
    h.push('</g></g><rect x="474" y="444" width="662" height="16" rx="3" fill="#5f6870"/>');
    h.push('</g>'); // shop
    h.push('</g>'); // world
    /* ---- tile grid: 1,115 stores ---- */
    h.push('<g class="tiles" opacity="0">');
    var top = topSet(), n = 0;
    for (var row = 0; row < 25; row++) for (var col = 0; col < 45; col++) {
      if (n >= 1115) break;
      var cx = 125 + col * 30, cy = 92 + row * 30;
      h.push('<rect class="t' + (top[n] ? " top" : "") + (n === CENTER ? " me" : "") + '" x="' + cx + '" y="' + cy + '" width="22" height="22" rx="4" fill="#3a4752"/>');
      n++;
    }
    h.push('</g>');
    h.push('<g class="cap1" opacity="0"><text x="800" y="62" text-anchor="middle" font-size="34" font-weight="600" fill="#fff"><tspan class="cnt">0</tspan> stores</text></g>');
    h.push('<g class="cap2" opacity="0"><rect x="560" y="836" width="480" height="46" rx="23" fill="#c8102e"/><text x="800" y="866" text-anchor="middle" font-size="20" font-weight="600" fill="#fff">Top 20% = 223 stores · 31.0% of sales</text></g>');
    /* ---- weekly sales line ---- */
    var TS = window.TS || [], L = 130, R = 1400, T = 470, B = 790, lo = 7000, hi = 12000;
    var X = function (k) { return L + k / (TS.length - 1) * (R - L); }, Y = function (v) { return T + (hi - v) / (hi - lo) * (B - T); };
    var d = TS.map(function (q, k) { return (k ? "L" : "M") + X(k).toFixed(1) + "," + Y(q[1]).toFixed(1); }).join("");
    h.push('<g class="chartg" opacity="0">');
    for (var g = 8000; g <= 12000; g += 2000) h.push('<line x1="' + L + '" x2="1500" y1="' + Y(g) + '" y2="' + Y(g) + '" stroke="#ffffff" stroke-opacity=".12"/><text x="' + (L - 12) + '" y="' + (Y(g) + 5) + '" text-anchor="end" font-size="15" fill="#c9c3b6">' + g / 1000 + 'k</text>');
    h.push('<path class="sl" d="' + d + '" pathLength="1" fill="none" stroke="#ff4d63" stroke-width="5" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1"/>');
    var last = TS.length ? [X(TS.length - 1), Y(TS[TS.length - 1][1])] : [R, 600];
    h.push('<path class="aug" d="M' + last[0] + ',' + last[1] + ' L' + (last[0] + 52) + ',' + last[1] + '" fill="none" stroke="#f2a900" stroke-width="5" stroke-dasharray="9 8" opacity="0"/>');
    h.push('<g class="q" opacity="0"><circle cx="' + (last[0] + 80) + '" cy="' + last[1] + '" r="24" fill="#f2a900"/><text x="' + (last[0] + 80) + '" y="' + (last[1] + 10) + '" text-anchor="middle" font-size="28" font-weight="700" fill="#17212b">?</text><text x="' + (last[0] + 80) + '" y="' + (last[1] + 54) + '" text-anchor="middle" font-size="15" fill="#f2a900">Aug 1–28</text></g>');
    TS.forEach(function (q, k) { if (/-12-2[23]$/.test(q[0])) h.push('<g class="pk" data-k="' + k + '" opacity="0"><circle cx="' + X(k) + '" cy="' + Y(q[1]) + '" r="9" fill="#ff4d63"/><text x="' + (X(k) + 16) + '" y="' + (Y(q[1]) + 6) + '" font-size="16" fill="#fff">Dec ' + q[0].slice(0, 4) + '</text></g>'); });
    h.push('<text x="' + L + '" y="' + (B + 46) + '" font-size="16" fill="#c9c3b6">Weekly mean Sales per store, Jan 2013 to Jul 2015 (223 stores)</text></g>');
    h.push('<text class="cap0" x="800" y="878" text-anchor="middle" font-size="22" fill="#fff" opacity="0">Every store has to plan stock and staff before the doors open.</text>');
    return h.join("");
  }
  var CENTER = 12 * 45 + 22;
  function topSet() {
    var r = rng(223), top = {}, c = 0; top[CENTER] = 1; c = 1;
    while (c < 223) { var k = Math.floor(r() * 1115); if (!top[k]) { top[k] = 1; c++; } }
    return top;
  }

  /* ---------- build DOM ---------- */
  function build() {
    el = document.createElement("div"); el.id = "stage"; el.setAttribute("aria-live", "polite");
    var opts = Music.TRACKS.map(function (t) { return '<option value="' + t.id + '"' + (t.id === Music.current.id ? " selected" : "") + ">" + t.title + (t.artist ? " · " + t.artist : "") + "</option>"; }).join("");
    el.innerHTML =
      '<div class="st-splash"><div class="k1">ADS1002 Applied Data Science · Group presentation</div>' +
      '<svg class="shop" tabindex="0" role="button" aria-label="Open the store and start the presentation" viewBox="0 0 200 170"><rect x="20" y="40" width="160" height="125" fill="#efe9dc"/><rect x="28" y="48" width="144" height="30" rx="4" fill="#c8102e"/><text x="100" y="69" text-anchor="middle" font-family="Newsreader,Georgia,serif" font-weight="700" font-size="17" fill="#fff" letter-spacing="2">DROGERIE</text>' +
      [0, 1, 2, 3, 4, 5, 6, 7].map(function (k) { return '<rect x="' + (28 + k * 18) + '" y="80" width="18" height="16" fill="' + (k % 2 ? "#fbf8f1" : "#c8102e") + '"/>'; }).join("") +
      '<rect x="34" y="104" width="78" height="58" fill="#8e979f"/><rect x="34" y="114" width="78" height="2" fill="#6b747c"/><rect x="34" y="126" width="78" height="2" fill="#6b747c"/><rect x="34" y="138" width="78" height="2" fill="#6b747c"/><rect x="34" y="150" width="78" height="2" fill="#6b747c"/><rect x="122" y="104" width="44" height="61" fill="#22313c"/><rect x="128" y="114" width="32" height="12" rx="2" fill="#fbf8f1"/><text x="144" y="123.5" text-anchor="middle" font-size="7.5" font-weight="700" fill="#c8102e">CLOSED</text></svg>' +
      '<div class="k2">Forecasting Rossmann Sales</div><div class="k3">Click the store or press → to open</div>' +
      '<div class="st-opts"><label for="st-track">Opening music</label><select id="st-track">' + opts + '</select></div><div class="st-skip">S skip the opening</div></div>' +
      '<svg class="st-film" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' + buildFilm() + '</svg>' +
      '<div class="st-title"><div class="kk">ADS1002 · Forecasting Rossmann Sales</div><h1>' + "Can historical sales data support a reliable four-week sales plan?".split(" ").map(function (w) { return "<span>" + w + "</span>"; }).join("") + '</h1></div>' +
      '<div class="st-team"><div class="hd">Meet the team</div><div class="sub">Five presenters · two slides each · one story from data to decision</div><div class="badges">' +
      PRES.map(function (p, k) { return '<div class="badge"><div class="bh"><span>STAFF</span><span>0' + (k + 1) + '</span></div><div class="hole"></div><div class="av" style="background:' + p.col + '">' + p.ini + '</div><div class="nm">' + p.name + '</div><div class="sl">' + p.slides + '</div><div class="rl">' + p.role + '</div><div class="bar"></div></div>'; }).join("") + '</div></div>' +
      '<div class="st-hand"><div class="hp hp1"></div><div class="hp hp2"></div><svg class="rays" viewBox="-100 -100 200 200" aria-hidden="true">' + rays() + '</svg><div class="burst"></div><div class="hc"><div class="hno"></div><div class="hk">Next up</div><div class="hnm"></div><div class="hbar"></div><div class="hrl"></div></div><div class="hft"><kbd>→</kbd> continue · <kbd>←</kbd> back</div><div class="flash"></div></div>' +
      '<div class="st-curtain"><div class="rain"></div><p class="ty">Thank you</p><div class="tm">' + PRES.map(function (p) { return "<span>" + p.name + "</span>"; }).join("") + '</div>' +
      '<div class="qr"><span class="qrc"></span><span><b>Try the interactive slides</b>' + SITE.replace("https://", "") + '</span></div><div class="cr"></div></div>' +
      '<div class="st-wipe"><svg viewBox="0 0 120 100" style="position:absolute;right:-110px;top:50%;width:150px;margin-top:-62px"><path d="M6 14h18l14 52h56l12-38H32" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><rect x="40" y="34" width="12" height="16" rx="2" fill="#f2a900"/><rect x="56" y="28" width="10" height="22" rx="2" fill="#4cc4b3"/><rect x="70" y="36" width="14" height="14" rx="3" fill="#fff"/><circle cx="46" cy="82" r="8" fill="#fff"/><circle cx="86" cy="82" r="8" fill="#fff"/></svg></div>' +
      '<div class="st-hint"></div><div class="st-pause">Paused · K to resume</div>';
    document.body.appendChild(el);
    var sel = $("#st-track");
    sel.onchange = function () { Music.setTrack(sel.value); sel.blur(); };
    $(".st-splash .shop").addEventListener("click", function (e) { e.stopPropagation(); next(); });
    $(".st-splash .shop").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); next(); } });
    el.addEventListener("click", function (e) { if (e.target.closest("select,label,.st-opts")) return; if (mode && mode !== "splash") next(); });
  }

  function setMode(m) { mode = m; if (m) { el.dataset.mode = m; el.classList.add("on"); } else { el.classList.remove("on"); el.removeAttribute("data-mode"); } Stage.active = !!m; }
  function hint(txt) { var h = $(".st-hint"); h.innerHTML = txt; gsap.fromTo(h, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5, delay: .2 }); }
  function nohint() { gsap.set($(".st-hint"), { opacity: 0 }); }

  /* ---------- film ---------- */
  function makeFilm() {
    var f = $(".st-film"), q = function (s) { return f.querySelector(s); }, qa = function (s) { return [].slice.call(f.querySelectorAll(s)); };
    var world = q(".world"), z = { p: 0 }, S1 = 22 / 700, cx = 800, cy = 486, tx = 125 + 22 * 30 + 11, ty = 92 + 12 * 30 + 11;
    var tl = gsap.timeline({ paused: true, onComplete: filmDone });
    tl.to(qa(".stars circle"), { opacity: function () { return .4 + Math.random() * .6; }, duration: .8, stagger: { amount: .6, from: "random" } }, 0)
      .call(function () { Music.sfx("buzz"); }, null, .5)
      .to(q(".cone"), { opacity: .9, duration: .06, repeat: 5, yoyo: true, ease: "steps(1)" }, .5)
      .to(q(".cone"), { opacity: .85, duration: .1 }, .9).to(q(".bulb"), { fill: "#ffe7a3", duration: .1 }, .5)
      .call(function () { Music.sfx("buzz"); }, null, 1.3)
      .to(q(".sign"), { opacity: 1, duration: .07, repeat: 7, yoyo: true, ease: "steps(1)" }, 1.3).set(q(".sign"), { opacity: 1 }, 1.9)
      .call(function () { Music.sfx("rattle"); }, null, 2.4)
      .to(q(".shutter"), { y: -275, duration: 1.15, ease: "power2.inOut" }, 2.4)
      .to(q(".win"), { fill: "#fff4dc", duration: .6 }, 3.2).to(q(".glass"), { fill: "#fff4dc", duration: .6 }, 3.2)
      .from(qa(".prod"), { scale: 0, transformOrigin: "50% 100%", duration: .35, ease: "back.out(2.6)", stagger: { each: .025, from: "random" } }, 3.5)
      .call(function () { Music.sfx("pop"); }, null, 3.6).call(function () { Music.sfx("pop"); }, null, 3.95).call(function () { Music.sfx("pop"); }, null, 4.3)
      .to(q(".cap0"), { opacity: 1, duration: .5 }, 3.6)
      .to(q(".osign"), { scaleY: 0, transformOrigin: "50% 0%", duration: .14 }, 4.9)
      .call(function () { var t = q(".otxt"); t.textContent = "OPEN"; t.setAttribute("fill", "#1f8a7d"); Music.sfx("bell"); }, null, 5.04)
      .to(q(".osign"), { scaleY: 1, duration: .3, ease: "back.out(3)" }, 5.04)
      .to(q(".day"), { opacity: 1, duration: 1.4 }, 5.3).to(q(".stars"), { opacity: 0, duration: 1 }, 5.3).to(q(".cone"), { opacity: 0, duration: .8 }, 5.6)
      .to(q(".cap0"), { opacity: 0, duration: .4 }, 6.1)
      /* zoom out to the network of stores */
      .to(z, { p: 1, duration: 1.9, ease: "power2.inOut", onUpdate: function () {
        var s = Math.pow(S1, z.p), x = tx * z.p + cx * (1 - z.p) - cx * s, y = ty * z.p + cy * (1 - z.p) - cy * s;
        world.setAttribute("transform", "translate(" + x.toFixed(2) + "," + y.toFixed(2) + ") scale(" + s.toFixed(4) + ")");
      } }, 6.4)
      .to(q(".day"), { opacity: 0, duration: 1.2 }, 6.8)
      .to(q(".tiles"), { opacity: 1, duration: .6 }, 6.9)
      .from(qa(".tiles .t"), { scale: 0, transformOrigin: "50% 50%", duration: .4, stagger: { amount: 1.3, from: CENTER } }, 6.9)
      .to(world, { opacity: 0, duration: .4 }, 8.1)
      .to(q(".cap1"), { opacity: 1, duration: .4 }, 6.9)
      .to({ v: 0 }, { v: 1115, duration: 1.5, ease: "power1.out", onUpdate: function () { q(".cnt").textContent = Math.round(this.targets()[0].v).toLocaleString("en-US"); } }, 6.9)
      /* top 20% */
      .to(qa(".tiles .t:not(.top)"), { opacity: .22, duration: .7 }, 8.8)
      .to(qa(".tiles .top"), { fill: "#ff4d63", duration: .3, stagger: { amount: .8, from: "random" } }, 8.8)
      .call(function () { Music.sfx("ding"); }, null, 9.1)
      .to(q(".cap2"), { opacity: 1, duration: .4 }, 9.2)
      /* tiles become the weekly sales line */
      .to([q(".tiles"), q(".cap1")], { opacity: 0, y: -30, duration: .6 }, 10.7)
      .to(q(".chartg"), { opacity: 1, duration: .4 }, 10.9).to(q(".cap2"), { opacity: 0, duration: .4 }, 10.9)
      .to(q(".sl"), { strokeDashoffset: 0, duration: 2.2, ease: "none" }, 11.1);
    qa(".pk").forEach(function (p) { tl.to(p, { opacity: 1, duration: .3 }, 11.1 + 2.2 * (+p.dataset.k / ((window.TS || [1, 1]).length - 1))); });
    tl.to(q(".aug"), { opacity: 1, duration: .5 }, 13.3).to(q(".q"), { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: .4, ease: "back.out(3)" }, 13.7)
      .to($(".st-title .kk"), { opacity: 1, duration: .5 }, 13.3)
      .to($$(".st-title h1 span"), { opacity: 1, y: 0, duration: .45, stagger: .07, ease: "power2.out" }, 13.5)
      .to(q(".chartg"), { y: 40, duration: 1.4, ease: "power2.inOut" }, 13.5);
    gsap.set($$(".st-title h1 span"), { y: 18 });
    return tl;
  }
  function resetFilm() {
    if (film) film.kill();
    var f = $(".st-film"); f.innerHTML = buildFilm();
    gsap.set([$(".st-title .kk")].concat($$(".st-title h1 span")), { opacity: 0 });
    film = makeFilm();
  }
  function filmDone() { if (mode === "film") { setMode("title"); hint("<kbd>→</kbd> meet the team"); } }

  /* ---------- team ---------- */
  function team() {
    setMode("team"); nohint(); Music.duck(.45, 1.2);
    var b = $$(".badge");
    gsap.set([$(".st-team .hd"), $(".st-team .sub")], { opacity: 0 });
    gsap.to($(".st-film"), { opacity: .35, duration: .6 });
    gsap.to([$(".st-team .hd"), $(".st-team .sub")], { opacity: 1, y: 0, duration: .5, stagger: .15 });
    teamTw = gsap.fromTo(b, { y: -window.innerHeight, rotation: function () { return -18 + Math.random() * 36; } },
      { y: 0, rotation: function () { return -3 + Math.random() * 6; }, duration: RM ? 0 : 1.1, ease: "elastic.out(1,.55)", stagger: { each: .32, onStart: function () { Music.sfx("pop"); } }, delay: .25,
        onComplete: function () { hint("<kbd>→</kbd> light up the team"); } });
  }
  function lightTeam() {
    setMode("lit"); nohint(); Music.sfx("ding"); Music.duck(.25, 1);
    gsap.to($$(".badge"), { rotation: 0, scale: 1.04, duration: .5, stagger: .05, ease: "back.out(2)" });
    hint("<kbd>→</kbd> start with slide 1");
  }
  function sweepTo(slide, after) {
    var w = $(".st-wipe"); Music.sfx("whoosh"); el.classList.add("sweeping");
    gsap.timeline()
      .fromTo(w, { xPercent: -101 }, { xPercent: 0, duration: RM ? 0 : .55, ease: "power2.in" })
      .call(function () { if (after) after(); setMode(null); el.classList.add("on"); el.dataset.mode = "wipe"; Deck.show(slide); gsap.set($(".st-film"), { opacity: 1 }); })
      .to(w, { xPercent: 101, duration: RM ? 0 : .6, ease: "power2.out" })
      .call(function () { el.classList.remove("sweeping"); if (!mode) { el.classList.remove("on"); el.removeAttribute("data-mode"); } gsap.set(w, { xPercent: -101 }); });
  }
  function enterDeck() { nohint(); Music.stop(2.5); sweepTo(0); }

  /* ---------- handover ---------- */
  function rays() {
    var o = "";
    for (var k = 0; k < 18; k++) { var a = k / 18 * Math.PI * 2, b = a + .07; o += '<polygon points="0,0 ' + (150 * Math.cos(a)).toFixed(1) + "," + (150 * Math.sin(a)).toFixed(1) + " " + (150 * Math.cos(b)).toFixed(1) + "," + (150 * Math.sin(b)).toFixed(1) + '" fill="#fff"/>'; }
    return o;
  }
  var handTl = null;
  function shake(t) { if (!RM) gsap.fromTo(t, { x: 0, y: 0 }, { keyframes: { x: [-22, 18, -14, 10, -6, 3, 0], y: [10, -12, 8, -5, 3, -1, 0] }, duration: .45, ease: "none" }); }
  function burst() {
    var box = $(".st-hand .burst"); box.innerHTML = ""; if (RM) return;
    var r = rng(Date.now() & 0xffff);
    for (var k = 0; k < 22; k++) {
      var p = product(r, 2, 44), sv = document.createElementNS(NS, "svg"), ang = r() * Math.PI * 2, d = Math.min(innerWidth, innerHeight) * (.35 + r() * .45);
      sv.setAttribute("viewBox", "0 0 30 50"); sv.setAttribute("width", 42); sv.setAttribute("height", 70); sv.innerHTML = p.svg; box.appendChild(sv);
      gsap.fromTo(sv, { x: -21, y: -35, scale: .3, opacity: 1, rotation: 0 }, { x: Math.cos(ang) * d - 21, y: Math.sin(ang) * d - 35, scale: 1 + r() * .6, rotation: (r() - .5) * 720, opacity: 0, duration: 1 + r() * .5, ease: "power3.out" });
    }
  }
  /* explosive presenter transition: colour panels slam in, flash, shake, number punch, name letters fly in */
  function handover(n) {
    var sp = Deck.S[n].dataset.sp, k = PRES.map(function (p) { return p.name; }).indexOf(sp), p = PRES[k] || { name: sp, slides: "", role: "", col: "#c8102e" };
    pendingSlide = n; setMode("handover");
    var h = $(".st-hand"), hc = $(".st-hand .hc"), no = $(".st-hand .hno"), nm = $(".st-hand .hnm");
    h.style.setProperty("--pc", p.col);
    no.textContent = "0" + (k + 1); $(".st-hand .hrl").textContent = p.slides + " · " + p.role;
    nm.innerHTML = p.name.split("").map(function (c) { return "<span>" + (c === " " ? "&nbsp;" : c) + "</span>"; }).join("");
    if (handTl) handTl.kill();
    var rays = $(".st-hand .rays"), chars = $$(".st-hand .hnm span");
    gsap.killTweensOf(rays);
    gsap.set([hc, no], { clearProps: "all" });
    if (RM) { gsap.set($$(".st-hand .hp"), { xPercent: 0 }); gsap.set([no, $(".st-hand .hk"), $(".st-hand .hrl"), $(".st-hand .hft")].concat(chars), { opacity: 1 }); gsap.set($(".st-hand .hbar"), { scaleX: 1 }); return; }
    Music.sfx("whoosh");
    handTl = gsap.timeline()
      .fromTo($(".st-hand .hp1"), { xPercent: -115 }, { xPercent: 0, duration: .36, ease: "expo.out" }, 0)
      .fromTo($(".st-hand .hp2"), { xPercent: 115 }, { xPercent: 0, duration: .36, ease: "expo.out" }, .05)
      .call(function () { Music.sfx("boom"); shake(hc); burst(); }, null, .3)
      .fromTo($$(".st-hand .hp"), { scale: 1.08 }, { scale: 1, duration: .5, ease: "power3.out" }, .3)
      .fromTo($(".st-hand .flash"), { opacity: .9 }, { opacity: 0, duration: .5, ease: "power2.out" }, .3)
      .fromTo(rays, { scale: .2, opacity: 0 }, { scale: 1, opacity: .14, duration: .7, ease: "power3.out" }, .3)
      .fromTo(no, { scale: 3.4, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: 0, duration: .5, ease: "back.out(1.7)" }, .26)
      .fromTo($(".st-hand .hk"), { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: .35, ease: "power3.out" }, .45)
      .fromTo(chars, { yPercent: 130, opacity: 0, rotation: function () { return (Math.random() - .5) * 60; } }, { yPercent: 0, opacity: 1, rotation: 0, duration: .5, stagger: .035, ease: "back.out(2.4)" }, .5)
      .call(function () { Music.sfx("hit"); }, null, .62)
      .fromTo($(".st-hand .hbar"), { scaleX: 0 }, { scaleX: 1, duration: .55, ease: "expo.out" }, .8)
      .fromTo($(".st-hand .hrl"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, .9)
      .fromTo($(".st-hand .hft"), { opacity: 0 }, { opacity: 1, duration: .4 }, 1.2)
      .to(no, { scale: 1.05, duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut" }, 1.3);
    gsap.fromTo(rays, { rotation: 0 }, { rotation: 360, duration: 26, ease: "none", repeat: -1 });
  }
  function closeHand(go) {
    var n = pendingSlide; pendingSlide = null;
    if (mode !== "handover" || n == null) return;
    mode = "closing"; Stage.active = false;
    if (handTl) handTl.kill();
    if (go) Deck.show(n, 1);
    if (RM) { setMode(null); return; }
    Music.sfx("whoosh");
    gsap.timeline({ onComplete: function () { gsap.killTweensOf($(".st-hand .rays")); if (mode === "closing") setMode(null); } })
      .to($(".st-hand .hc"), { scale: go ? 1.7 : .6, opacity: 0, duration: .32, ease: "power2.in" }, 0)
      .to([$(".st-hand .rays"), $(".st-hand .hft")], { opacity: 0, duration: .2 }, 0)
      .to($(".st-hand .hp1"), { xPercent: -115, duration: .5, ease: "power4.in" }, .08)
      .to($(".st-hand .hp2"), { xPercent: 115, duration: .5, ease: "power4.in" }, .08);
  }

  /* ---------- curtain call ---------- */
  function curtain() {
    setMode("curtain"); nohint();
    $(".st-curtain .ty").textContent = "Thank you";
    var t = Music.current;
    $(".st-curtain .cr").textContent = t.src ? "Music: “" + t.title + "” by " + t.artist + " (incompetech.com), licensed under CC BY 4.0." : "";
    if (!$(".qrc svg") && window.qrcode) { var qr = qrcode(0, "M"); qr.addData(SITE); qr.make(); $(".qrc").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }
    gsap.fromTo($(".st-curtain .ty"), { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: RM ? 0 : .9, ease: "back.out(1.8)" });
    gsap.fromTo($$(".st-curtain .tm span"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .1, delay: .4 });
    gsap.fromTo([$(".st-curtain .qr"), $(".st-curtain .cr")], { opacity: 0 }, { opacity: 1, duration: .6, delay: 1 });
    Music.play({ at: .4, fadeIn: 2.5 }); Music.sfx("bell");
    rain();
    hint("<kbd>→</kbd> questions");
  }
  function rain() {
    var box = $(".st-curtain .rain"); box.innerHTML = "";
    if (RM) return;
    var r = rng(Date.now() & 0xffff);
    for (var i = 0; i < 36; i++) {
      var p = product(r, 2, 44), s = document.createElementNS(NS, "svg");
      s.setAttribute("viewBox", "0 0 30 50"); s.setAttribute("width", 30); s.setAttribute("height", 50);
      s.innerHTML = p.svg; s.style.left = (r() * 100) + "%"; box.appendChild(s);
      gsap.fromTo(s, { y: -80, rotation: r() * 360, opacity: .9 }, { y: window.innerHeight + 120, rotation: "+=" + (180 + r() * 360), duration: 4 + r() * 4, delay: r() * 3, ease: "none", repeat: -1 });
    }
  }
  function questions() {
    setMode("questions"); nohint(); var ty = $(".st-curtain .ty");
    gsap.timeline().to(ty, { rotationX: 90, duration: .25, ease: "power2.in" }).call(function () { ty.textContent = "Questions?"; }).to(ty, { rotationX: 0, duration: .4, ease: "back.out(2)" });
    hint("<kbd>→</kbd> back to the slides");
  }
  function closeCurtain() { Music.stop(3); gsap.killTweensOf($$(".st-curtain .rain svg")); $(".st-curtain .rain").innerHTML = ""; setMode(null); }

  /* ---------- controller ---------- */
  function killAll() { gsap.globalTimeline.getChildren(true, true, true).forEach(function (t) { t.kill(); }); }
  function openSplash() {
    killAll(); Music.pause(); resetFilm(); setMode("splash"); nohint();
    gsap.set($(".st-film"), { opacity: 1 }); gsap.set($$(".badge"), { clearProps: "all" });
    setTimeout(function () { var s = $(".st-splash .shop"); if (s && s.focus) s.focus({ preventScroll: true }); }, 50);
  }
  function startFilm() {
    Music.unlock(); Music.play({ at: 0 }); setMode("film");
    if (RM) film.progress(1); else film.play(0);
    hint("<kbd>→</kbd> skip ahead");
  }
  function next() {
    switch (mode) {
      case "splash": return startFilm();
      case "film": film.progress(1); return;
      case "title": return team();
      case "team": if (teamTw) teamTw.progress(1); return lightTeam();
      case "lit": return enterDeck();
      case "handover": return closeHand(true);
      case "curtain": return questions();
      case "questions": return closeCurtain();
    }
  }
  function prev() {
    switch (mode) {
      case "film": case "title": return openSplash();
      case "team": case "lit": gsap.to($(".st-film"), { opacity: 1, duration: .4 }); setMode("title"); return hint("<kbd>→</kbd> meet the team");
      case "handover": return closeHand(false);
      case "curtain": return closeCurtain();
      case "questions": return curtain();
    }
  }
  function skip() { killAll(); Music.stop(.6); setMode(null); Deck.show(0); }
  function togglePause() {
    var p = !gsap.globalTimeline.paused(); gsap.globalTimeline.paused(p);
    el.classList.toggle("paused", p); if (!mode) el.classList.toggle("on", p);
    if (p) Music.pause(); else Music.resume();
  }
  function syncMusicBtn() { var b = document.getElementById("mu"); if (b) b.setAttribute("aria-pressed", Music.enabled); }

  var Stage = window.Stage = {
    active: false,
    next: next, prev: prev, handover: handover, curtain: curtain, open: openSplash,
    key: function (e) {
      var k = e.key;
      if (k === "m" || k === "M") { Music.toggle(); syncMusicBtn(); return true; }
      if (k === "k" || k === "K" || k === "b" || k === "B" || k === ".") { togglePause(); return true; }
      if (el.classList.contains("paused") && /^(ArrowRight|ArrowLeft| |PageDown|PageUp|Enter)$/.test(k)) togglePause();
      if (!Stage.active) { if (k === "i" || k === "I") { openSplash(); return true; } return false; }
      if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Enter") { e.preventDefault(); next(); return true; }
      if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); return true; }
      if ((k === "s" || k === "S") && /splash|film|title|team|lit/.test(mode)) { skip(); return true; }
      if (k === "Escape") { if (mode === "handover") closeHand(false); else if (/curtain|questions/.test(mode)) closeCurtain(); else skip(); return true; }
      return true;
    },
    boot: function (startHash) {
      build();
      document.getElementById("intro").onclick = function () { this.blur(); openSplash(); };
      var mb = document.getElementById("mu"); syncMusicBtn(); mb.onclick = function () { Music.toggle(); syncMusicBtn(); this.blur(); };
      if (/nointro/.test(location.search) || /s-\d+/.test(startHash || "")) return;
      openSplash();
    }
  };
})();
