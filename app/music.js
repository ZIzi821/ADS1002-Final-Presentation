/* Opening music (CC BY 4.0, Kevin MacLeod) and small sound effects made in the browser with Web Audio. */
(function () {
  var TRACKS = [
    { id: "riley", title: "Life of Riley", artist: "Kevin MacLeod", src: "assets/music/life-of-riley.mp3" },
    { id: "funk", title: "Funkorama", artist: "Kevin MacLeod", src: "assets/music/funkorama.mp3" },
    { id: "carefree", title: "Carefree", artist: "Kevin MacLeod", src: "assets/music/carefree.mp3" },
    { id: "none", title: "No music", artist: "", src: "" }
  ];
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var audio = new Audio(), ctx = null, fadeId = 0, base = 0.8, enabled = store.get("rf-music") !== "off";
  audio.preload = "auto";
  var current = TRACKS.filter(function (t) { return t.id === store.get("rf-track"); })[0] || TRACKS[0];

  function setTrack(id) {
    current = TRACKS.filter(function (t) { return t.id === id; })[0] || TRACKS[0];
    store.set("rf-track", current.id);
    audio.pause();
    if (current.src) { audio.src = current.src; audio.load(); } else audio.removeAttribute("src");
  }
  function fade(to, secs, then) {
    var id = ++fadeId, from = audio.volume, t0 = performance.now();
    (function step(now) {
      if (id !== fadeId) return;
      var p = Math.min(1, (now - t0) / (secs * 1000));
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * p));
      if (p < 1) requestAnimationFrame(step); else if (then) then();
    })(t0);
  }
  function play(opts) {
    opts = opts || {};
    if (!enabled || !current.src) return;
    var start = function () {
      if (opts.at != null) audio.currentTime = opts.at < 1 && audio.duration ? audio.duration * opts.at : opts.at;
      audio.volume = opts.fadeIn ? 0 : base;
      var p = audio.play(); if (p && p.catch) p.catch(function () {});
      if (opts.fadeIn) fade(base, opts.fadeIn);
    };
    if (opts.at != null && audio.readyState < 1) audio.addEventListener("loadedmetadata", start, { once: true }); else start();
  }
  function stop(secs) { if (audio.paused) return; fade(0, secs || 1.5, function () { audio.pause(); }); }
  function duck(level, secs) { if (!audio.paused) fade(base * level, secs || .8); }

  /* --- sound effects --- */
  function ac() {
    if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function noise(c, secs) {
    var b = c.createBuffer(1, c.sampleRate * secs, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var s = c.createBufferSource(); s.buffer = b; return s;
  }
  var SFX = {
    bell: function (c, t) { // shop door bell: two bright partials
      [1320, 1760, 2640].forEach(function (f, k) {
        var o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f;
        env(g, t + k * 0.09, 0.005, 0.18 / (k + 1), 1.1); o.connect(g).connect(c.destination); o.start(t + k * 0.09); o.stop(t + 1.4);
      });
    },
    whoosh: function (c, t) {
      var s = noise(c, 0.6), f = c.createBiquadFilter(), g = c.createGain(); f.type = "bandpass"; f.Q.value = 0.8;
      f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3000, t + 0.45);
      env(g, t, 0.15, 0.25, 0.4); s.connect(f).connect(g).connect(c.destination); s.start(t); s.stop(t + 0.6);
    },
    rattle: function (c, t) { // roller shutter
      var s = noise(c, 1.2), f = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      f.type = "lowpass"; f.frequency.value = 1400; lfo.frequency.value = 22; lg.gain.value = 0.06;
      lfo.connect(lg).connect(g.gain); g.gain.setValueAtTime(0.08, t); g.gain.linearRampToValueAtTime(0, t + 1.15);
      s.connect(f).connect(g).connect(c.destination); s.start(t); lfo.start(t); s.stop(t + 1.2); lfo.stop(t + 1.2);
    },
    pop: function (c, t) {
      var o = c.createOscillator(), g = c.createGain(); o.type = "triangle";
      o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(980, t + 0.08);
      env(g, t, 0.005, 0.07, 0.12); o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.2);
    },
    ding: function (c, t) { // cash register style ding
      var o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = 2093;
      env(g, t, 0.003, 0.2, 0.9); o.connect(g).connect(c.destination); o.start(t); o.stop(t + 1);
    },
    buzz: function (c, t) { // neon sign hum flicker
      var o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter(); o.type = "sawtooth"; o.frequency.value = 100;
      f.type = "lowpass"; f.frequency.value = 700; env(g, t, 0.02, 0.05, 0.35); o.connect(f).connect(g).connect(c.destination); o.start(t); o.stop(t + 0.45);
    }
  };
  function sfx(name) { if (!enabled) return; var c = ac(); if (c && SFX[name]) SFX[name](c, c.currentTime + 0.01); }

  window.Music = {
    TRACKS: TRACKS, audio: audio,
    get current() { return current; },
    get enabled() { return enabled; },
    setTrack: setTrack, play: play, stop: stop, duck: duck, sfx: sfx, unlock: ac,
    toggle: function () {
      enabled = !enabled; store.set("rf-music", enabled ? "on" : "off");
      if (!enabled) audio.pause();
      return enabled;
    },
    pause: function () { audio.pause(); },
    resume: function () { if (enabled && current.src && audio.currentTime > 0) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } }
  };
  setTrack(current.id);
})();
