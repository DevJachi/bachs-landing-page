/* Landing page v3 interactions, in the order the approved page ran them. Each block is isolated so one
   failing cannot stop the rest. Loaded by components/landing-v3/LandingV3.tsx. */
try {
(function () {

  /* ---------- dark mode toggle: remembered on this device only ---------- */
  (function () {
    var root = document.documentElement, btn = document.getElementById('theme');
    root.classList.remove('dark');
    function label() { var d = root.classList.contains('dark'); btn.setAttribute('aria-label', d ? 'Switch to light mode' : 'Switch to dark mode'); }
    label();
    btn.addEventListener('click', function () {
      var d = root.classList.toggle('dark'); label();
      try { localStorage.setItem('bachs-theme', d ? 'dark' : 'light'); } catch (e) {}
    });
  })();
  /* ---------- header: scrolled state, dropdowns, phone menu ---------- */
  var nav = document.getElementById('nav'), panel = document.getElementById('panel');
  var slotLinks = nav.querySelectorAll('.slot-wm a, .slot-cta a');
  function onScroll() {
    var on = window.scrollY > 20;
    if (on !== nav.classList.contains('scrolled')) {
      nav.classList.toggle('scrolled', on);
      slotLinks.forEach(function (a) { a.tabIndex = on ? 0 : -1; });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var lks = nav.querySelectorAll('.lk[data-menu]'), menus = panel.querySelectorAll('.menu'), vp = document.getElementById('vp');
  var order = Array.prototype.map.call(menus, function (m) { return m.dataset.for; }), cur = -1, closeT;
  menus.forEach(function (m) { m.style.transform = 'translateX(48px)'; });
  function openMenu(name) {
    clearTimeout(closeT);
    var ni = order.indexOf(name);
    if (ni === cur && panel.classList.contains('open')) return;
    var wasOpen = panel.classList.contains('open') && cur > -1, dir = wasOpen ? (ni > cur ? 1 : -1) : 0;
    menus.forEach(function (m, i) {
      if (i === ni) {
        m.style.transition = 'none';
        m.style.transform = 'translateX(' + (dir * 64) + 'px)';
        void m.offsetWidth;                                   // start from the side it comes in from
        m.style.transition = '';
        m.style.transform = 'translateX(0)';
        m.classList.add('on');
      } else if (i === cur && wasOpen) {
        m.style.transform = 'translateX(' + (-dir * 64) + 'px)';  // the old menu leaves the other way
        m.classList.remove('on');
      } else {
        m.classList.remove('on');
      }
    });
    vp.style.height = menus[ni].offsetHeight + 'px';
    cur = ni;
    lks.forEach(function (b) { b.setAttribute('aria-expanded', b.dataset.menu === name ? 'true' : 'false'); });
    panel.classList.add('open'); nav.classList.add('dd-open');
  }
  function closeMenu() {
    closeT = setTimeout(function () {
      panel.classList.remove('open'); nav.classList.remove('dd-open');
      lks.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      setTimeout(function () { if (!panel.classList.contains('open')) { menus.forEach(function (m) { m.classList.remove('on'); }); cur = -1; } }, 300);
    }, 140);
  }
  lks.forEach(function (b) {
    b.addEventListener('mouseenter', function () { openMenu(b.dataset.menu); });
    b.addEventListener('click', function () { b.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu(b.dataset.menu); });
  });
  nav.querySelectorAll('.lk:not([data-menu])').forEach(function (a) { a.addEventListener('mouseenter', closeMenu); });
  nav.addEventListener('mouseleave', closeMenu);
  panel.addEventListener('mouseenter', function () { clearTimeout(closeT); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  var burger = document.getElementById('burger');
  burger.addEventListener('click', function () {
    var open = !nav.classList.contains('menu-open');
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
  /* round 96: a link in the phone menu closes the menu as it goes */
  document.querySelectorAll('.sh-links a, .sh-btn').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }); });

  /* phone nav: two circles joined by a neck, like a drop of water. A tap stretches the neck and it springs back */
  (function () {
    var blob = document.querySelector('.blob'); if (!blob) return;
    var gl = blob.querySelector('.blob-gl'), sh = blob.querySelector('.blob-sh b'), bg = document.getElementById('burger'), th = document.getElementById('theme');
    var R = 22, REST = 6, g = 16, v = 0, raf = 0, last = 0;
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function f(n) { return n.toFixed(2); }
    function shape(gap) {
      var c2 = 3 * R + gap, ph = Math.min(74, 50 + Math.max(0, gap - REST) * 1.6) * Math.PI / 180;
      var sx = R * Math.sin(ph), x1 = R + sx, x2 = c2 - sx, yt = R - R * Math.cos(ph), yb = 2 * R - yt;
      var t = (x2 - x1) * .42, dx = Math.cos(ph) * t, dy = Math.sin(ph) * t, room = (R - yt) * .82;
      if (dy > room) { dx *= room / dy; dy = room; }
      return "path('M" + f(x1) + ' ' + f(yt) + ' C' + f(x1 + dx) + ' ' + f(yt + dy) + ' ' + f(x2 - dx) + ' ' + f(yt + dy) + ' ' + f(x2) + ' ' + f(yt) +
        ' A' + R + ' ' + R + ' 0 1 1 ' + f(x2) + ' ' + f(yb) + ' C' + f(x2 - dx) + ' ' + f(yb - dy) + ' ' + f(x1 + dx) + ' ' + f(yb - dy) + ' ' + f(x1) + ' ' + f(yb) +
        ' A' + R + ' ' + R + ' 0 1 1 ' + f(x1) + ' ' + f(yt) + " Z')";
    }
    var rims = blob.querySelectorAll('.blob-rim path');
    function draw() { var c = shape(g); gl.style.clipPath = c; sh.style.clipPath = c; var d = c.slice(6, -2); rims.forEach(function (r) { r.setAttribute('d', d); }); bg.style.transform = 'translateX(' + f(g - REST) + 'px)'; }
    function tick(now) {
      var dt = Math.min(.032, (now - (last || now)) / 1000); last = now;
      v += (-170 * (g - REST) - 11 * v) * dt; g += v * dt;
      if (g < 0) { g = 0; v = Math.abs(v) * .3; }
      draw();
      if (Math.abs(g - REST) > .02 || Math.abs(v) > .05) raf = requestAnimationFrame(tick); else { g = REST; v = 0; draw(); raf = 0; last = 0; }
    }
    function kick(k) { if (still) return; v += k; if (!raf) raf = requestAnimationFrame(tick); }
    if (still) { g = REST; draw(); } else { draw(); raf = requestAnimationFrame(tick); }
    bg.addEventListener('pointerdown', function () { kick(95); });
    th.addEventListener('pointerdown', function () { kick(70); });
  })();


  /* ---------- Bento: dotted map on tile A, and a short self-running story for every tile ---------- */
  (function () {
    var reduceM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* dotted world map, white on the gradient */
    var LM = {"w":200,"h":100,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7//Pu/AAAAAAAAAAAAAAAAAAAAAAAAAMD33////wMAwAdAAACABwAAAAAAAAAAAABo/vv///8BADgBAAAAADAAAAAAAAAAAACHkP/g////AAAAAAAAAwDwAwAAAAAAAAAAYIB+APD//wEAAAAAGADw/wMAAgAAAAAAgC+zbQPg/38AAAAAAAYI/v//BwAAAAEgAID4w/kPgP//AAAACPz//////////z8A/n/+++dzfAD/PwAAwH8AwOz/AQAAAAAE/P///////////////w8AaAAAAAAAAAAAAOH///////////////8HgwMAAAAAAAAAAAAA+P////9z8IAfAAcAfv7+//////////9/AP//////gA4ADwAAgD//////////////P4B/+///fwAeAAgAAIA/8///////////wwUAYID///8AvgEAAACCHf7/////////BzAAABgA/P//B/4DAAAABhr//////////wF4AAACAPj//z//DwAAAAeC/////////38APAAAAAD0//8//x8AAICP////////////DxgAAAAA4P////8fAAAA3P///////////wsAAAAAAMD///9/EAAAAPD///////////8LAAAAAACA/////3gAAAD8////////////AQAAAAAAgP////8FAAAA+P8ffvz//////wEAAAAAAID///+/AAAAAPjnDzz//////38YAAAAAACA////HwAAAIA/zAd4/v////8fDAAAAAAAgP///wcAAACAD7Dx//7///9/DwQAAAAAAID///8BAAAAgA8A+X/8////HwQEAAAAAAAA////AwAAAACHA/n//P////8MAwAAAAAAAP7//wMAAAAA/gNE//////8/7AMAAAAAAAD4//8AAAAAgP8DAP//////f1AAAAAAAAAA6P9/AAAAAID/n4f///////8QAAAAAAAAAPD/QwAAAACA////f///////AAAAAAAAAADQP0AAAAAA4P//P3/+////fwAAAAAAAAAAgD8AAAAAAPD//3//8f///38AAAAAAAAAAEA/AAAAAAD4/////g3+//+/AAAAAAAAAAAAPuAAAAAA+P////wf+L//DwAAAAAAAAAAAD4MAgAAAPj////9H/CPfwAAAAAAAAAAAAB8BjAAAAD4////+Q/wB38BAAAAAAAAAAAA8AcAAAAA+P////MH4AN/gAAAAAAAAAAAAAA/AAAAAPj////zAeAA/IAAAAAAAAAAAAAAPAAAAAD4////NwDAAfgBAQAAAAAAAAAAADAAAAAA+P///w8AwADgAQIAAAAAAAAAAAAw7AMAAPD/////AMAAQAABAAAAAAAAAAAAAP8HAADg/////wAAAQgAAwAAAAAAAAAAAAD+DwAAwP///38AAAAQAAIAAAAAAAAAAAAA/n8AAICA/v9/AAAAFjgAAAAAAAAAAAAAAP7/AAAAAP7/PwAAADwcAAAAAAAAAAAAAAD//wAAAAD+/w8AAAAYvgAAAAAAAAAAAACA//8DAAAA/v8HAAAAMF4gAAAAAAAAAAAAAP//HwAAAP7/AwAAAHDeQAMAAAAAAAAAAID//38AAAD8/wMAAABgQIAfAQAAAAAAAACA////AQAA+P8DAAAAgAAAPgAAAAAAAAAAAP///wEAAPj/AwAAAAAuAC4QAAAAAAAAAAD///8AAAD4/wMAAAAAQABAAAAAAAAAAAAA/v9/AAAA8P8DAAAAAAAAAAAAAAAAAAAAAPz/PwAAAPj/hwAAAAAA8AgAAAAAAAAAAAD8/z8AAAD4/8cAAAAAAP4YAAAAAAAAAAAA8P8/AAAA+P/hAAAAAAD/HQAAAAAAAAAAAOD/PwAAAPj/YAAAAAAA/x8AAAAAAAAAAADg/x8AAAD4f3AAAAAA4P9/gAAAAAAAAAAA4P8fAAAA8P9wAAAAAPj//wAAAAAAAAAAAOD/AwAAAPD/MAAAAAD4//8AAAAAAAAAAADg/wEAAADwPwAAAAAA+P//AQAAAAAAAAAA4P8BAAAA4D8AAAAAAPj//wEAAAAAAAAAAPD/AAAAAOAfAAAAAADw//8BAAAAAAAAAADw/wAAAADADwAAAAAA8P//AQAAAAAAAAAA8H8AAAAAwAcAAAAAAPCB/gAAAAAAAAAAAPAPAAAAAAAAAAAAAAAAAP4AEAAAAAAAAAD4DwAAAAAAAAAAAAAAAAB8ACAAAAAAAAAA+AcAAAAAAAAAAAAAAAAAIABgAAAAAAAAAPgBAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAD4AQAAAAAAAAAAAAAAAAAgABgAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAADwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAgJ8A/v///x8AAAAAAAAAAADQAQAAAAAAwP3/h///////BwAAAAAAAAAA8AMAAADh//////P///////8DAAAAAAAcBMADAADw////////////////BwAAAP9/8P//AQAA+P///////////////wAAAPj/////HwAA4P///////////////38AAOL//////wEABv//////////////////AAAA+P////8DhA/w////////////////HwAAgP///////wH3/////////////////z8AAID/////////////////////////////AwAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="}, raw = atob(LM.bits), mc = document.getElementById('map');
    function onLand(lat, lon) {
      var r = Math.min(LM.h - 1, Math.max(0, Math.floor((90 - lat) / 180 * LM.h)));
      var c = Math.floor(((lon + 180) % 360 + 360) % 360 / 360 * LM.w), i = r * LM.w + c;
      return (raw.charCodeAt(i >> 3) >> (i & 7)) & 1;
    }
    var LAT_N = 72, LAT_S = -50, PINS = [[6.5, 3.4], [5.6, -0.2], [-1.3, 36.8], [51.5, -0.1], [40.7, -74.0], [-26.2, 28.0], [25.2, 55.3]];
    function drawMap() {
      var w = mc.clientWidth, h = mc.clientHeight; if (!w) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      mc.width = w * dpr; mc.height = h * dpr;
      var g = mc.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      var mw = w * 1.1, mh = mw * (LAT_N - LAT_S) / 360 * 1.2, ox = (w - mw) / 2, oy = h * .04;
      var step = Math.max(6, w / 120);
      g.fillStyle = 'rgba(30,30,42,.16)';
      for (var y = step / 2; y < mh; y += step) {
        var lat = LAT_N - (y / mh) * (LAT_N - LAT_S);
        for (var x = step / 2; x < mw; x += step) if (onLand(lat, -180 + (x / mw) * 360)) { g.beginPath(); g.arc(ox + x, oy + y, step * .17, 0, 6.283); g.fill(); }
      }
    }
    if (mc) { drawMap(); window.addEventListener('resize', drawMap); }

    /* a loop runs a list of [ms, step]; the panel row starts the loop of whichever panel is open */
    var LOOPS = {}, mobile = window.matchMedia('(max-width: 900px)').matches;
    function loop(tile, steps, reset) {
      if (!tile) return { start: function () {}, stop: function () {} };
      var i = 0, t = null, on = false;
      function next() { var s = steps[i]; s[1](); i = (i + 1) % steps.length; t = setTimeout(next, s[0]); }
      function start() { if (on || reduceM) return; on = true; i = 0; if (reset) reset(); next(); }
      function stop() { on = false; clearTimeout(t); }
      var api = { start: start, stop: stop };
      LOOPS[tile.dataset.i] = api;
      if (tile.hasAttribute('data-still')) return api;
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: .3 }).observe(tile);
      return api;
    }
    function $1(sel) { return document.querySelector(sel); }

    /* A: bank transfer, mobile money, stablecoins, then pay, then paid */
    (function () {
      var tile = $1('.t-a'); if (!$1('#co-tabs') || !tile) return; var tabs = tile.querySelectorAll('#co-tabs span'), pill = $1('#co-tabs i');
      var det = tile.querySelectorAll('#co-detail > div'), pay = $1('#co-pay'), lab = pay.querySelector('span');
      function show(k) {
        tabs.forEach(function (x, n) { x.classList.toggle('on', n === k); });
        det.forEach(function (x, n) { x.classList.toggle('on', n === k); });
        pill.style.transform = 'translateX(' + (k * 100) + '%)';
        pay.classList.remove('done', 'busy'); lab.textContent = 'Pay $120.00';
      }
      loop(tile, [
        [1400, function () { show(0); }],
        [1400, function () { show(1); }],
        [1400, function () { show(2); }],
        [800, function () { pay.classList.add('busy'); lab.textContent = 'Paying'; }],
        [1700, function () { pay.classList.remove('busy'); pay.classList.add('done'); lab.textContent = 'Paid'; }]
      ]);
    })();

    /* B: copy the link, it's copied, the customer pays, back to the start */
    (function () {
      var tile = $1('.t-b');
      loop(tile, [
        [900, function () { tile.classList.remove('s1', 's2'); }],
        [1100, function () { tile.classList.add('s1'); }],
        [2200, function () { tile.classList.remove('s1'); tile.classList.add('s2'); }]
      ]);
    })();

    /* C: due, then paid */
    (function () {
      var tile = $1('.t-c');
      loop(tile, [[1500, function () { tile.classList.remove('go'); }], [1900, function () { tile.classList.add('go'); }]]);
    })();

    /* D: the billing cycle fills, the charge goes through, the next date moves on */
    (function () {
      var tile = $1('.t-d');
      loop(tile, [
        [60, function () { tile.classList.remove('run', 'go'); }],
        [2300, function () { tile.classList.add('run'); }],
        [1700, function () { tile.classList.remove('run'); tile.classList.add('go'); }]
      ]);
    })();

    /* E: the highlight walks through each currency, with its Withdraw button */
    (function () {
      var tile = $1('.t-e'), rows = tile.querySelectorAll('.bal'), hl = tile.querySelector('.bal-hl');
      function pick(k) { rows.forEach(function (r, n) { r.classList.toggle('on', n === k); }); hl.style.transform = 'translateY(' + (k * 38) + 'px)'; }
      loop(tile, [0, 1, 2, 3].map(function (k) { return [1300, function () { pick(k); }]; }));
    })();

    /* F: a new payout lands on top every couple of seconds: Sending, then Sent */
    (function () {
      var tile = $1('.t-f'), list = $1('#po-list');
      var PEOPLE = [
        ['TM', "Tunde's Market", '₦180,000', '#5458f2'], ['AK', "Ada's Kitchen", '₦250,000', '#5458f2'],
        ['KP', 'Kofi Prints', 'GH₵1,200', '#5458f2'], ['WC', 'Wanjiru & Co', 'KSh18,500', '#5458f2'],
        ['ES', 'Efua Styles', 'GH₵860', '#5458f2'], ['BN', 'Baraka Naturals', 'KSh9,400', '#5458f2']
      ];
      var n = 0;
      function row(p, sent) {
        var d = document.createElement('div'); d.className = 'po-row';
        d.innerHTML = '<span class="av" style="background:' + p[3] + '">' + p[0] + '</span><span class="who"><span class="nm"></span><span class="v">' + p[2] + '</span></span><span class="chip ' + (sent ? 'ok' : 'n') + '">' + (sent ? 'Sent' : 'Sending') + '</span>';
        d.querySelector('.nm').textContent = p[1];
        return d;
      }
      for (var k = 1; k <= 4; k++) list.appendChild(row(PEOPLE[k], true));
      n = 5;
      function add() {
        var d = row(PEOPLE[n % PEOPLE.length], false); n++;
        d.classList.add('new'); list.prepend(d);
        list.classList.remove('shift'); void list.offsetWidth; list.classList.add('shift');
        while (list.children.length > 6) list.lastElementChild.remove();  /* five show, the sixth slides out under the fade */
        setTimeout(function () { var c = d.querySelector('.chip'); c.className = 'chip ok'; c.textContent = 'Sent'; }, 900);
      }
      loop(tile, [[2000, add]]);
    })();



    /* Why us: the shield fills with Bachs-blue squares that twinkle very slowly; the code windows take turns in front */
    (function () {
      var svg = document.getElementById('shield'); if (!svg) return;
      var NS = 'http://www.w3.org/2000/svg', SH = 'M80 8 C98 19 122 24 146 24 L146 88 C146 132 120 162 80 178 C40 162 14 132 14 88 L14 24 C38 24 62 19 80 8 Z';
      var defs = document.createElementNS(NS, 'defs'), cp = document.createElementNS(NS, 'clipPath'), cpp = document.createElementNS(NS, 'path');
      cp.setAttribute('id', 'shclip'); cpp.setAttribute('d', SH); cp.appendChild(cpp); defs.appendChild(cp); svg.appendChild(defs);
      var bg = document.createElementNS(NS, 'path'); bg.setAttribute('d', SH); bg.setAttribute('fill', 'rgba(84,88,242,.08)'); svg.appendChild(bg);
      var g = document.createElementNS(NS, 'g'); g.setAttribute('clip-path', 'url(#shclip)'); svg.appendChild(g);
      var sq = [], seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (var y = 4; y < 184; y += 6) for (var x = 4; x < 160; x += 6) {
        var cx = x - 80, cy = y - 92, d = Math.sqrt(cx * cx * .6 + cy * cy) / 100;
        var o = Math.max(.08, Math.min(1, .95 - d * .7 + (rnd() - .5) * .5));
        var r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 4); r.setAttribute('height', 4); r.setAttribute('rx', .6);
        r.setAttribute('fill', '#5458f2'); r.setAttribute('opacity', o.toFixed(2)); g.appendChild(r); sq.push([r, o]);
      }
      var edge = document.createElementNS(NS, 'path'); edge.setAttribute('d', SH); edge.setAttribute('fill', 'none'); edge.setAttribute('stroke', '#5458f2'); edge.setAttribute('stroke-width', '1.5'); edge.setAttribute('stroke-opacity', '.9'); svg.appendChild(edge);
      var reduceM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceM) setInterval(function () {
        if (document.hidden) return;
        for (var i = 0; i < 6; i++) { var it = sq[Math.floor(rnd() * sq.length)]; it[0].setAttribute('opacity', Math.max(.08, Math.min(1, it[1] + (rnd() - .5) * .6)).toFixed(2)); }
      }, 180);

    })();

    /* people: simple illustrated portraits until real photos and videos arrive */
    (function () {
      var P = {"amara": {"skin": "#6b4129", "hair": "#1a120d", "style": "afro", "shirt": "#e9e4da", "bg": "#d9d4cc"}, "daniel": {"skin": "#efcfb6", "hair": "#6b4a2b", "style": "short", "shirt": "#2f3542", "bg": "#cfd4dc"}, "kwame": {"skin": "#5a3522", "hair": "#120c09", "style": "buzz", "shirt": "#c9d2c4", "bg": "#bfc6bb"}, "sarah": {"skin": "#f2d6c2", "hair": "#c9a26b", "style": "long", "shirt": "#8a6e5a", "bg": "#e1d6cc"}, "wanjiru": {"skin": "#7a4a30", "hair": "#1b1310", "style": "bun", "shirt": "#3f4a5c", "bg": "#cdd0d8"}, "tom": {"skin": "#e9c3a6", "hair": "#2b1d14", "style": "short", "shirt": "#5b6b5d", "bg": "#d7dbd3"}, "zainab": {"skin": "#8d5a3b", "hair": "#1b1310", "style": "long", "shirt": "#b9a48c", "bg": "#ddd2c4"}, "emma": {"skin": "#f3d9c6", "hair": "#7a5230", "style": "bun", "shirt": "#c7cbd4", "bg": "#e6e3df"}, "tunde": {"skin": "#5e3824", "hair": "#120c09", "style": "short", "shirt": "#d8d3c8", "bg": "#c9ccc4"}, "oro": {"skin": "#5c3723", "hair": "#130d0a", "style": "short", "shirt": "#2c3442", "bg": "#c8cbd2"}, "lucy": {"skin": "#f0cdb2", "hair": "#2b1d14", "style": "long", "shirt": "#40465a", "bg": "#d4d6dd"}};
      function hair(st, c) {
        if (st === 'afro') return '<ellipse cx="200" cy="168" rx="98" ry="88" fill="' + c + '"/>';
        if (st === 'buzz') return '<path d="M140 178 C140 120 170 112 200 112 C230 112 260 120 260 178 C250 150 230 140 200 140 C170 140 150 150 140 178Z" fill="' + c + '"/>';
        if (st === 'long') return '<path d="M126 200 C120 120 160 104 200 104 C240 104 280 120 274 200 L284 330 C250 350 150 350 116 330 Z" fill="' + c + '"/>';
        if (st === 'bun') return '<circle cx="200" cy="96" r="30" fill="' + c + '"/><path d="M136 190 C134 128 166 110 200 110 C234 110 266 128 264 190 C250 154 232 146 200 146 C168 146 150 154 136 190Z" fill="' + c + '"/>';
        return '<path d="M136 186 C132 124 166 106 200 106 C236 106 270 124 264 186 C254 150 234 140 200 142 C168 140 146 150 136 186Z" fill="' + c + '"/>';
      }
      function portrait(k, small, fit) {
        var p = P[k]; if (!p) return '';
        var behind = p.style === 'long' || p.style === 'afro' ? hair(p.style, p.hair) : '';
        var front = p.style === 'long' || p.style === 'afro' ? '' : hair(p.style, p.hair);
        var vb = small ? '96 70 208 208' : '0 0 400 480';
        var par = fit === 'open' ? 'xMaxYMax meet' : (small ? 'xMidYMid slice' : 'xMidYMax slice');
        return '<svg class="' + (fit || '') + '" viewBox="' + vb + '" preserveAspectRatio="' + par + '" aria-hidden="true">' +
          '<defs><radialGradient id="lt' + k + (small ? 's' : '') + '" cx="70%" cy="20%" r="90%"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>' +
          '<rect x="-200" y="-200" width="800" height="900" fill="' + p.bg + '"/>' +
          '<rect x="-200" y="-200" width="800" height="900" fill="url(#lt' + k + (small ? 's' : '') + ')"/>' +
          behind +
          '<rect x="176" y="250" width="48" height="70" rx="20" fill="' + p.skin + '"/>' +
          '<path d="M60 500 C70 380 130 330 200 326 C270 330 330 380 340 500 Z" fill="' + p.shirt + '"/>' +
          '<ellipse cx="139" cy="204" rx="11" ry="17" fill="' + p.skin + '"/><ellipse cx="261" cy="204" rx="11" ry="17" fill="' + p.skin + '"/>' +
          '<ellipse cx="200" cy="196" rx="62" ry="76" fill="' + p.skin + '"/>' +
          '<path d="M200 120 C236 122 262 156 262 196 C262 238 236 270 200 272 C222 252 232 226 232 196 C232 162 222 136 200 120Z" fill="#000" opacity=".08"/>' +
          '<path d="M176 326 C186 334 214 334 224 326 L224 312 C214 318 186 318 176 312Z" fill="#000" opacity=".12"/>' +
          '<ellipse cx="200" cy="196" rx="62" ry="76" fill="url(#lt' + k + (small ? 's' : '') + ')" opacity=".35"/>' +
          front + '</svg>';
      }
      document.querySelectorAll('.por[data-person]').forEach(function (el) {
        el.style.background = (P[el.dataset.person] || {}).bg || '';
        el.innerHTML = portrait(el.dataset.person, false, 'strip') + portrait(el.dataset.person, false, 'open');
      });
      document.querySelectorAll('.tw-av[data-person]').forEach(function (el) { el.innerHTML = portrait(el.dataset.person, true); });
    })();

    /* stories: scroll opens the panels one by one; hover (real mouse movement) opens any */
    (function () {
      var track = document.getElementById('st-track'); if (!track) return;
      var pans = document.querySelectorAll('.sp'), cur = 0, last = -1, lastScrollT = 0;
      var mobile = window.matchMedia('(max-width: 900px)').matches;
      function open(k) {
        if (k === cur) return; cur = k;
        pans.forEach(function (pn, n) {
          pn.classList.toggle('on', n === k);
        });
      }
      if (mobile) { pans.forEach(function (pn) { pn.classList.add('on'); }); return; }
      function onScroll() {
        lastScrollT = Date.now();
        var r = track.getBoundingClientRect(), total = track.offsetHeight - innerHeight;
        var prog = Math.min(1, Math.max(0, -r.top / total));
        var k = Math.min(pans.length - 1, Math.floor(prog / .9 * pans.length));
        if (k !== last) { last = k; open(k); }
      }
      var mx = -1, my = -1;
      pans.forEach(function (pn, n) {
        pn.addEventListener('pointermove', function (e) {
          if (e.pointerType !== 'mouse' || (e.clientX === mx && e.clientY === my)) return;
          mx = e.clientX; my = e.clientY;
          if (Date.now() - lastScrollT < 250) return;
          open(n);
        });
      });
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();

    /* features: the list on the left follows the card you are reading */
    (function () {
      var cards = document.querySelectorAll('.sq-card'), groups = document.querySelectorAll('.sq-ng'), links = document.querySelectorAll('.sq-ng a');
      if (!cards.length || !('IntersectionObserver' in window)) return;
      function mark(c) {
        links.forEach(function (a) { a.classList.toggle('on', a.dataset.c === c.classList[1]); });
        groups.forEach(function (g) { g.classList.toggle('on', g.dataset.g === c.dataset.g); });
      }
      mark(cards[0]);
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) mark(e.target); }); }, { rootMargin: '-45% 0px -50% 0px' });
      cards.forEach(function (c) { io.observe(c); });
    })();

    /* FAQ: one answer open at a time, and each one slides open and shut */
    (function () {
      var items = document.querySelectorAll('.fq');
      function set(d, open) {
        var a = d.querySelector('.fq-a');
        if (open) { d.open = true; a.style.height = a.scrollHeight + 'px'; d.classList.add('open'); }
        else { a.style.height = a.scrollHeight + 'px'; void a.offsetHeight; a.style.height = '0px'; d.classList.remove('open');
               setTimeout(function () { if (!d.classList.contains('open')) d.open = false; }, 450); }
      }
      items.forEach(function (d) {
        d.querySelector('summary').addEventListener('click', function (e) {
          e.preventDefault();
          var opening = !d.classList.contains('open');
          items.forEach(function (o) { if (o !== d && o.classList.contains('open')) set(o, false); });
          set(d, opening);
        });
        d.querySelector('.fq-a').addEventListener('transitionend', function () { if (d.classList.contains('open')) this.style.height = 'auto'; });
      });
    })();

    /* developers: the code window. Icon tabs switch the language; the window rises with your scroll */
    (function () {
      var CODE = {"node": {"file": "checkout.ts", "lines": ["import Bachs from '@bachs/sdk'", "", "const bachs = new Bachs({ key: process.env.BACHS_KEY })", "", "// Customers pay by bank, mobile money or stablecoins", "const session = await bachs.checkout.create({", "  product:    'prod_starter',", "  crypto:     true,", "  settlement: 'NGN',", "})", "", "return Response.redirect(session.url)"]}, "python": {"file": "checkout.py", "lines": ["from bachs_sdk import Bachs", "", "client = Bachs(\"bk_live_xxx\")", "", "# Customers pay by bank, mobile money or stablecoins", "session = client.checkout.create(", "    product=\"prod_starter\",", "    crypto=True,", "    settlement=\"NGN\",", ")", "", "print(session.url)"]}, "django": {"file": "views.py", "lines": ["from django.shortcuts import redirect", "from bachs_sdk import Bachs", "", "client = Bachs(\"bk_live_xxx\")", "", "def checkout(request):", "    session = client.checkout.create(", "        product=\"prod_starter\",", "        crypto=True,", "        settlement=\"NGN\",", "    )", "    return redirect(session.url)"]}, "go": {"file": "main.go", "lines": ["package main", "", "import \"github.com/bachs/bachs-go\"", "", "func main() {", "  client := bachs.New(\"bk_live_xxx\")", "", "  session, _ := client.Checkout.Create(bachs.CheckoutParams{", "    Product:    \"prod_starter\",", "    Crypto:     true,", "    Settlement: \"NGN\",", "  })", "  println(session.URL)", "}"]}, "curl": {"file": "terminal", "lines": ["curl https://api.bachs.io/v1/checkout \\", "  -H \"Authorization: Bearer bk_live_xxx\" \\", "  -H \"Content-Type: application/json\" \\", "  -d '{", "    \"product\": \"prod_starter\",", "    \"crypto\": true,", "    \"settlement\": \"NGN\"", "  }'"]}};
      var box = document.getElementById('dc-code'), file = document.getElementById('dc-file'), win = document.getElementById('dc-win');
      if (!box) return;
      var KW = /^(import|from|const|let|await|new|return|def|package|func|true|false|True|curl)$/;
      function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
      function hl(line) {
        if (/^\s*(\/\/|#)/.test(line)) return '<span class="c">' + esc(line) + '</span>';
        var re = /('[^']*'?|"[^"]*"?)|(\b\d+\b)|([A-Za-z_][\w]*)(?=\s*\()|([A-Za-z_][\w]*)|([\s\S])/g, out = '', m;
        while ((m = re.exec(line))) {
          if (m[1]) out += '<span class="s">' + esc(m[1]) + '</span>';
          else if (m[2]) out += '<span class="n">' + m[2] + '</span>';
          else if (m[3]) out += KW.test(m[3]) ? '<span class="k">' + m[3] + '</span>' : '<span class="f">' + m[3] + '</span>';
          else if (m[4]) out += KW.test(m[4]) ? '<span class="k">' + m[4] + '</span>' : m[4];
          else out += esc(m[5]);
        }
        return out;
      }
      var cur = 'node';
      function show(k) {
        cur = k; var c = CODE[k]; file.textContent = c.file;
        box.innerHTML = c.lines.map(function (l, n) { return '<span class="dc-l" style="animation-delay:' + (n * 22) + 'ms">' + (hl(l) || ' ') + '</span>'; }).join('');
        document.querySelectorAll('.dc-tab').forEach(function (t) { var on = t.dataset.k === k; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
      }
      document.querySelectorAll('.dc-tab').forEach(function (t) { t.addEventListener('click', function () { if (t.dataset.k !== cur) show(t.dataset.k); }); });
      var copy = document.getElementById('dc-copy');
      copy.addEventListener('click', function () {
        try { navigator.clipboard.writeText(CODE[cur].lines.join('\n')); } catch (e) {}
        copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy'; }, 1400);
      });
      show('node');
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      function onScroll() {
        var r = win.getBoundingClientRect(), vh = innerHeight;
        var p = Math.min(1, Math.max(0, (vh - r.top) / (vh * .7)));
        var e = 1 - Math.pow(1 - p, 3), side = (1 - e) * 9;
        win.style.transform = 'translateY(' + ((1 - e) * 70).toFixed(1) + 'px)';
        win.style.clipPath = 'inset(0 ' + side.toFixed(2) + '% 0 ' + side.toFixed(2) + '% round 6px 6px 0 0)';
        win.style.opacity = (.35 + .65 * e).toFixed(3);
      }
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    })();

    /* testimonials: arrows (or a click on a side story, or the arrow keys) move the carousel */
    (function () {
      var stage = document.getElementById('tm-stage'); if (!stage) return;
      var cards = [].slice.call(stage.querySelectorAll('.tm-card')), N = cards.length, a = 0;
      function slot(i) { var r = (i - a + N) % N; return r === 0 ? 'on' : r === 1 ? 'next' : r === N - 1 ? 'prev' : 'hid'; }
      function go(to, dir) {
        a = (to + N) % N;
        cards.forEach(function (c, i) {
          var s = slot(i);
          if (c.dataset.slot === 'hid' && s !== 'hid') {       /* enter from the side it is moving in from */
            c.style.transition = 'none'; c.dataset.side = s === 'prev' ? 'l' : 'r'; void c.offsetWidth; c.style.transition = '';
          }
          if (s === 'hid') c.dataset.side = dir < 0 ? 'r' : 'l';
          c.dataset.slot = s;
          c.setAttribute('aria-hidden', s === 'on' ? 'false' : 'true');
        });
      }
      document.getElementById('tm-prev').addEventListener('click', function () { go(a - 1, -1); });
      document.getElementById('tm-next').addEventListener('click', function () { go(a + 1, 1); });
      cards.forEach(function (c, i) { c.addEventListener('click', function () { var s = c.dataset.slot; if (s === 'next') go(a + 1, 1); else if (s === 'prev') go(a - 1, -1); }); });
      stage.closest('.stories').addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(a + 1, 1); if (e.key === 'ArrowLeft') go(a - 1, -1); });
      stage.classList.add('tm-still'); go(0, 1); void stage.offsetWidth; stage.classList.remove('tm-still');
    })();

    /* the wall heading fades in once the wall is in view */
    (function () {
      var h = document.querySelector('.wall-h'); if (!h) return;
      if (!('IntersectionObserver' in window)) { h.classList.add('in'); return; }
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { h.classList.add('in'); io.disconnect(); } }); }, { threshold: .6 });
      io.observe(h);
    })();

    /* the CTA bloom opens as the section comes up */
    (function () {
      var b = document.querySelector('.cta-bloom'); if (!b) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { b.style.setProperty('--cs', 1); b.style.setProperty('--co', 1); return; }
      function onScroll() {
        var r = b.parentNode.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight * .2)));
        b.style.setProperty('--cs', (.7 + .3 * p).toFixed(3)); b.style.setProperty('--co', (.35 + .65 * p).toFixed(3));
      }
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    })();
  })();
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* images reused from elsewhere on the page, so the file carries each photo once */
  document.querySelectorAll('[data-src-from]').forEach(function (i) { var o = document.getElementById(i.dataset.srcFrom); if (o) i.src = o.src; });
  var tmImgs = document.querySelectorAll('.tm-ph img');
  document.querySelectorAll('img[data-tm]').forEach(function (i) { var o = tmImgs[+i.dataset.tm]; if (o) i.src = o.src; });

  /* ---------- the hero film: one 17 second timeline, every element keyed to it ---------- */
  var win = document.getElementById('hb-win'), film = win && win.querySelector('.film');
  if (film) {
    var T = 17000, anims = [], E = 'cubic-bezier(.22,1,.36,1)', EIO = 'cubic-bezier(.65,0,.35,1)', LIN = 'linear';
    var q = function (sel) { return film.querySelector(sel); };
    function fit() { film.style.transform = 'scale(' + (win.clientWidth / 1280) + ')'; }
    fit(); if ('ResizeObserver' in window) new ResizeObserver(fit).observe(win); else addEventListener('resize', fit);
    /* frames: [time, props, easing for the stretch after this frame]. Props carry forward, so every frame is complete. */
    function key(el, frames) {
      if (!el) return;
      var cur = {}, kf = frames.map(function (f) { cur = Object.assign({}, cur, f[1]); var o = Object.assign({}, cur); o.offset = f[0] / T; o.easing = f[2] || LIN; return o; });
      if (kf[0].offset > 0) { var a = Object.assign({}, kf[0]); a.offset = 0; kf.unshift(a); }
      if (kf[kf.length - 1].offset < 1) { var z = Object.assign({}, kf[kf.length - 1]); z.offset = 1; kf.push(z); }
      anims.push(el.animate(kf, { duration: T, iterations: Infinity, fill: 'both' }));
    }
    function tf(x, y, z, rx, ry, s) { return 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(' + s + ')'; }
    function cam(x, y, s) { return 'scale(' + s + ') translate(' + x + 'px,' + y + 'px)'; }
    function at(x, y, s) { return 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')'; }
    var hid = function (b) { return { opacity: 0, filter: 'blur(' + b + 'px)' }; };
    function o(op, b, t) { return { opacity: op, filter: 'blur(' + b + 'px)', transform: t }; }

    /* camera: close on the checkout, pull back for the flow, settle on the dashboard and drift in */
    key(q('.cam'), [[0, { transform: cam(280, 6, 1.24) }], [3300, { transform: cam(280, 6, 1.2) }, EIO], [4600, { transform: cam(44, 0, 1) }],
      [10800, { transform: cam(44, 0, 1) }, EIO], [11700, { transform: cam(0, 0, 1) }], [17000, { transform: cam(0, 0, 1.06) }]]);
    key(q('.f-dots'), [[0, { opacity: .9 }], [17000, { opacity: .9 }]]);

    /* checkout */
    key(q('.f-co'), [[0, o(0, 12, tf(0, 50, 0, 14, 0, .96)), E], [950, o(1, 0, tf(0, 0, 0, 0, 0, 1))], [3500, o(1, 0, tf(0, 0, 0, 0, 0, 1)), EIO],
      [4600, o(1, 0, tf(-30, 0, -60, 0, 18, 1))], [9400, o(1, 0, tf(-30, 0, -60, 0, 18, 1)), E], [10200, o(.55, 2, tf(-60, 0, -140, 0, 24, 1))],
      [10800, o(.55, 2, tf(-60, 0, -140, 0, 24, 1)), E], [11500, o(0, 10, tf(-120, 0, -220, 0, 30, .96))]]);
    key(q('.f-sel'), [[0, { transform: 'translateY(0px)' }], [1800, { transform: 'translateY(0px)' }, E], [2200, { transform: 'translateY(64px)' }]]);
    key(q('.f-pay'), [[0, { backgroundColor: '#0b0c10' }], [6100, { backgroundColor: '#0b0c10' }, E], [6450, { backgroundColor: '#12805c' }]]);
    key(q('.f-pay-t'), [[0, { opacity: 1, transform: 'translateY(0px)' }], [3150, { opacity: 1, transform: 'translateY(0px)' }, E], [3450, { opacity: 0, transform: 'translateY(-14px)' }]]);
    key(q('.f-pay-w'), [[0, { opacity: 0, transform: 'translateY(14px)' }], [3200, { opacity: 0, transform: 'translateY(14px)' }, E], [3500, { opacity: 1, transform: 'translateY(0px)' }],
      [6100, { opacity: 1, transform: 'translateY(0px)' }, E], [6400, { opacity: 0, transform: 'translateY(-14px)' }]]);
    key(q('.f-pay-d'), [[0, { opacity: 0, transform: 'translateY(14px)' }], [6150, { opacity: 0, transform: 'translateY(14px)' }, E], [6450, { opacity: 1, transform: 'translateY(0px)' }]]);

    /* the cursor: picks mobile money, then pays */
    key(q('.f-cur'), [[0, { opacity: 0, transform: at(1180, 720, 1) }], [800, { opacity: 1, transform: at(1180, 720, 1) }, E], [1650, { opacity: 1, transform: at(300, 398, 1) }, E],
      [1750, { opacity: 1, transform: at(300, 398, .82) }, E], [1900, { opacity: 1, transform: at(300, 398, 1) }], [2300, { opacity: 1, transform: at(300, 398, 1) }, EIO],
      [2950, { opacity: 1, transform: at(330, 540, 1) }, E], [3050, { opacity: 1, transform: at(330, 540, .82) }, E], [3200, { opacity: 1, transform: at(330, 540, 1) }],
      [3350, { opacity: 1, transform: at(330, 540, 1) }, E], [3700, { opacity: 0, transform: at(390, 610, 1) }]]);
    function ripple(el, t0) { key(el, [[0, { opacity: 0, transform: 'scale(.2)' }], [t0, { opacity: 0, transform: 'scale(.2)' }], [t0 + 10, { opacity: 1, transform: 'scale(.2)' }, E], [t0 + 600, { opacity: 0, transform: 'scale(1.9)' }]]); }
    ripple(q('.f-rip1'), 1750); ripple(q('.f-rip2'), 3050);

    /* the phone: rises in three quarter view, approve is tapped, it turns away */
    key(q('.f-ph'), [[0, o(0, 14, tf(60, 170, 0, 14, -34, .94))], [3900, o(0, 14, tf(60, 170, 0, 14, -34, .94)), E], [4900, o(1, 0, tf(0, 0, 0, 6, -20, 1))],
      [5250, o(1, 0, tf(0, -4, 0, 5, -18, 1))], [5950, o(1, 0, tf(0, -6, 0, 5, -18, 1)), EIO], [6700, o(0, 10, tf(140, -20, -80, 4, -52, .96))]]);
    ripple(q('.f-ph-rip'), 5300);
    key(q('.f-ph-b'), [[0, { transform: 'scale(1)' }], [5280, { transform: 'scale(1)' }, E], [5380, { transform: 'scale(.95)' }, E], [5520, { transform: 'scale(1)' }]]);
    key(q('.f-ph-ok'), [[0, { opacity: 0 }], [5450, { opacity: 0 }, E], [5700, { opacity: 1 }]]);
    key(q('.f-ph-ok path'), [[0, { strokeDashoffset: 1 }], [5550, { strokeDashoffset: 1 }, E], [5950, { strokeDashoffset: 0 }]]);

    /* status cards: one after another, each spinner turns into a check */
    [[1, 6400], [2, 7050], [3, 7700]].forEach(function (p) {
      var c = q('.f-st' + p[0]), t = p[1];
      key(c, [[0, o(0, 8, tf(36, 16, 0, 0, -12, .97))], [t, o(0, 8, tf(36, 16, 0, 0, -12, .97)), E], [t + 650, o(1, 0, tf(0, 0, 0, 0, 0, 1))],
        [8900, o(1, 0, tf(0, 0, 0, 0, 0, 1)), E], [9400, o(0, 8, tf(-24, -18, 0, 0, 0, .97))]]);
      key(c.querySelector('.f-spin'), [[0, { opacity: 1 }], [t + 650, { opacity: 1 }, E], [t + 800, { opacity: 0 }]]);
      key(c.querySelector('.f-st-ok'), [[0, { opacity: 0, transform: 'scale(.6)' }], [t + 650, { opacity: 0, transform: 'scale(.6)' }, 'cubic-bezier(.34,1.56,.64,1)'], [t + 950, { opacity: 1, transform: 'scale(1)' }]]);
      key(c.querySelector('.f-st-ok path'), [[0, { strokeDashoffset: 1 }], [t + 700, { strokeDashoffset: 1 }, E], [t + 1050, { strokeDashoffset: 0 }]]);
    });

    /* payment received: turns in like a card */
    key(q('.f-ok'), [[0, o(0, 10, tf(60, 0, 0, 0, -62, .96))], [9000, o(0, 10, tf(60, 0, 0, 0, -62, .96)), E], [9900, o(1, 0, tf(0, 0, 0, 0, 0, 1))],
      [10800, o(1, 0, tf(0, 0, 0, 0, 0, 1)), E], [11500, o(0, 10, tf(0, -24, -140, 0, 0, .94))]]);
    key(q('.f-ok-i path'), [[0, { strokeDashoffset: 1 }], [9450, { strokeDashoffset: 1 }, E], [10050, { strokeDashoffset: 0 }]]);
    key(q('.f-ok-i'), [[0, { transform: 'scale(.7)' }], [9300, { transform: 'scale(.7)' }, 'cubic-bezier(.34,1.56,.64,1)'], [9800, { transform: 'scale(1)' }]]);

    /* dashboard: the payment lands at the top of the list and the balance rolls over */
    key(q('.f-dash'), [[0, o(0, 12, tf(0, 30, 0, 0, 0, 1.03))], [11000, o(0, 12, tf(0, 30, 0, 0, 0, 1.03)), E], [11900, o(1, 0, tf(0, 0, 0, 0, 0, 1))],
      [16000, o(1, 0, tf(0, 0, 0, 0, 0, 1)), EIO], [16900, o(0, 10, tf(0, -12, 0, 0, 0, 1.02))]]);
    key(q('.f-rows'), [[0, { transform: 'translateY(0px)' }], [12100, { transform: 'translateY(0px)' }, E], [12700, { transform: 'translateY(56px)' }]]);
    key(q('.f-new'), [[0, { opacity: 0, transform: 'translateX(-14px)', backgroundColor: 'rgba(84,88,242,.08)' }], [12250, { opacity: 0, transform: 'translateX(-14px)', backgroundColor: 'rgba(84,88,242,.08)' }, E],
      [12850, { opacity: 1, transform: 'translateX(0px)', backgroundColor: 'rgba(84,88,242,.08)' }], [13800, { opacity: 1, transform: 'translateX(0px)', backgroundColor: 'rgba(84,88,242,.08)' }, EIO],
      [15000, { opacity: 1, transform: 'translateX(0px)', backgroundColor: 'rgba(84,88,242,0)' }]]);
    key(q('.f-odo-a'), [[0, { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }], [12700, { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }, E],
      [13200, { opacity: 0, transform: 'translateY(-26px)', filter: 'blur(4px)' }]]);
    key(q('.f-odo-b'), [[0, { opacity: 0, transform: 'translateY(26px)', filter: 'blur(4px)' }], [12750, { opacity: 0, transform: 'translateY(26px)', filter: 'blur(4px)' }, E],
      [13250, { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }]]);

    if (reduce) { anims.forEach(function (a) { a.currentTime = 10000; a.pause(); }); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { anims.forEach(function (a) { e.isIntersecting ? a.play() : a.pause(); }); }); }).observe(win);
    }
  }

  /* ---------- hero dots: they part around the cursor and darken under it ---------- */
  var cv = document.getElementById('hero-dots');
  if (cv) {
    var cx = cv.getContext('2d'), hero = document.getElementById('hero'), W = 0, H = 0, dpr = 1, GAP = 20, pts = [], mx = -999, my = -999, tx = -999, ty = -999, raf = 0;
    function dark() { return document.documentElement.classList.contains('dark'); }
    function size() {
      dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; pts = [];
      for (var y = GAP / 2; y < H; y += GAP) for (var x = GAP / 2; x < W; x += GAP) pts.push([x, y]);
      draw();
    }
    function draw() {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
      var base = dark() ? '255,255,255' : '11,12,16', R = 130;
      for (var i = 0; i < pts.length; i++) {
        var x = pts[i][0], y = pts[i][1], dx = x - mx, dy = y - my, d = Math.sqrt(dx * dx + dy * dy), k = d < R ? 1 - d / R : 0, e = k * k;
        if (e > 0) { x += dx / (d || 1) * e * 9; y += dy / (d || 1) * e * 9; }
        cx.fillStyle = 'rgba(' + base + ',' + (0.13 + e * 0.5) + ')';
        cx.beginPath(); cx.arc(x, y, 0.95 + e * 0.9, 0, 6.2832); cx.fill();
      }
    }
    function tick() {
      mx += (tx - mx) * .2; my += (ty - my) * .2; draw();
      if (Math.abs(tx - mx) > .3 || Math.abs(ty - my) > .3) raf = requestAnimationFrame(tick); else raf = 0;
    }
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || reduce) return;
      var r = cv.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (mx < -500) { mx = tx; my = ty; }
      if (!raf) raf = requestAnimationFrame(tick);
    });
    hero.addEventListener('pointerleave', function () { tx = -999; ty = -999; mx = -999; my = -999; draw(); });
    size(); addEventListener('resize', size);
    var th = document.getElementById('theme'); if (th) th.addEventListener('click', function () { setTimeout(draw, 30); });
  }

  /* ---------- customers: hovering a logo with a story brings its story up ---------- */
  var feat = document.getElementById('cust-feat');
  if (feat) {
    var slides = feat.querySelectorAll('.cf-s'), cellsC = document.querySelectorAll('.cust-cell.has');
    function show(k) {
      slides.forEach(function (sl) { sl.classList.toggle('on', sl.dataset.k === k); });
      cellsC.forEach(function (c) { c.classList.toggle('on', c.dataset.k === k); });
    }
    cellsC.forEach(function (c) {
      c.addEventListener('mouseenter', function () { show(c.dataset.k); });
      c.addEventListener('click', function (e) { e.preventDefault(); show(c.dataset.k); });
    });
    show(slides[0].dataset.k);
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* the install line copies, and the icon turns into a green check for a moment */
  document.querySelectorAll('.dd-cp').forEach(function (b) {
    var t;
    b.addEventListener('click', function () {
      var txt = b.parentNode.querySelector('code').textContent;
      try { navigator.clipboard.writeText(txt); } catch (e) {}
      b.classList.add('ok'); clearTimeout(t); t = setTimeout(function () { b.classList.remove('ok'); }, 1500);
    });
  });

  /* customers: the story card cycles on its own; hovering a logo with a story shows it */
  var card = document.getElementById('cu-card');
  if (card) {
    var ss = card.querySelectorAll('.cu-s'), cs = document.querySelectorAll('.cu-cell.has'), i = 0, timer, hold = false;
    var keys = [].map.call(ss, function (x) { return x.dataset.k; });
    function show(k) {
      i = keys.indexOf(k);
      ss.forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); });
      cs.forEach(function (c) { c.classList.toggle('on', c.dataset.k === k); });
    }
    function run() { clearInterval(timer); timer = setInterval(function () { if (!hold) show(keys[(i + 1) % keys.length]); }, 3200); }
    cs.forEach(function (c) {
      c.addEventListener('mouseenter', function () { hold = true; show(c.dataset.k); });
      c.addEventListener('mouseleave', function () { hold = false; run(); });
      c.addEventListener('click', function (e) { e.preventDefault(); show(c.dataset.k); });
    });
    card.addEventListener('mouseenter', function () { hold = true; });
    card.addEventListener('mouseleave', function () { hold = false; run(); });
    show(keys[0]); run();
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  var stage = document.getElementById('dm-stage'); if (!stage) return;
  var film = stage.querySelector('.dfilm'), tabs = document.querySelectorAll('.dm-tab'), scenes = film.querySelectorAll('.sc');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-src-from]').forEach(function (i) { if (!i.src) { var o = document.getElementById(i.dataset.srcFrom); if (o) i.src = o.src; } });
  function fit() { var W = stage.clientWidth, H = stage.clientHeight, s2 = W / 1000, x = .06 * W - 110 * s2, y = H - 584 * s2; film.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s2 + ')'; }
  fit(); if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage); else addEventListener('resize', fit);

  var E = 'cubic-bezier(.22,1,.36,1)', EIO = 'cubic-bezier(.65,0,.35,1)', POP = 'cubic-bezier(.34,1.56,.64,1)';
  var SC = [];   /* per scene: {T, anims} */
  function make(root, T, build) {
    var list = [];
    function key(sel, frames) {
      var el = typeof sel === 'string' ? root.querySelector(sel) : sel; if (!el) { console.warn('missing', sel); return; }
      var cur = {}, kf = frames.map(function (f) { cur = Object.assign({}, cur, f[1]); var o = Object.assign({}, cur); o.offset = Math.min(1, f[0] / T); o.easing = f[2] || 'linear'; return o; });
      if (kf[0].offset > 0) { var a = Object.assign({}, kf[0]); a.offset = 0; kf.unshift(a); }
      if (kf[kf.length - 1].offset < 1) { var z = Object.assign({}, kf[kf.length - 1]); z.offset = 1; kf.push(z); }
      var an = el.animate(kf, { duration: T, fill: 'both' }); an.pause(); list.push(an);
    }
    function cur(pts) {   /* pts: [t, x, y] moves, [t, 'click'] presses */
      var fr = [[0, { opacity: 0, transform: 'translate(' + pts[0][1] + 'px,' + pts[0][2] + 'px) scale(1)' }]], x = pts[0][1], y = pts[0][2];
      fr.push([pts[0][0], { opacity: 1 }, E]);
      pts.slice(1).forEach(function (p) {
        if (p[1] === 'click') { fr.push([p[0], { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)' }, E]); fr.push([p[0] + 90, { transform: 'translate(' + x + 'px,' + y + 'px) scale(.82)' }, E]); fr.push([p[0] + 220, { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)' }]); }
        else if (p[1] === 'hide') { fr.push([p[0], { opacity: 1 }, E]); fr.push([p[0] + 300, { opacity: 0 }]); }
        else { fr.push([p[0] - (p[4] || 700), { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)' }, EIO]); x = p[1]; y = p[2]; fr.push([p[0], { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)' }]); }
      });
      key('.d-cur', fr);
    }
    function fadeSwap(a, b, t, d) { key(a, [[0, { opacity: 1, transform: 'translateY(0px)' }], [t, { opacity: 1, transform: 'translateY(0px)' }, E], [t + (d || 300), { opacity: 0, transform: 'translateY(-10px)' }]]); key(b, [[0, { opacity: 0, transform: 'translateY(10px)' }], [t + 60, { opacity: 0, transform: 'translateY(10px)' }, E], [t + 60 + (d || 300), { opacity: 1, transform: 'translateY(0px)' }]]); }
    function typing(sel, t0, d, n) { key(sel, [[0, { clipPath: 'inset(0 100% 0 0)' }], [t0, { clipPath: 'inset(0 100% 0 0)' }, 'steps(' + n + ', end)'], [t0 + d, { clipPath: 'inset(0 0% 0 0)' }]]); }
    function toast(sel, t0, t1) { key(sel, [[0, { opacity: 0, transform: 'translateX(40px)', filter: 'blur(6px)' }], [t0, { opacity: 0, transform: 'translateX(40px)', filter: 'blur(6px)' }, E], [t0 + 600, { opacity: 1, transform: 'translateX(0px)', filter: 'blur(0px)' }], [t1, { opacity: 1, transform: 'translateX(0px)', filter: 'blur(0px)' }, E], [t1 + 400, { opacity: 0, transform: 'translateX(20px)', filter: 'blur(4px)' }]]); }
    /* the scene itself: in from a soft blur, out the same way */
    key(root, [[0, { opacity: 0, filter: 'blur(10px)', transform: 'translateY(18px) scale(.985)' }, E], [700, { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px) scale(1)' }], [T - 600, { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px) scale(1)' }, E], [T, { opacity: 0, filter: 'blur(8px)', transform: 'translateY(-10px) scale(1)' }]]);
    build(key, cur, fadeSwap, typing, toast);
    SC.push({ T: T, anims: list });
  }
  /* window origin on the stage is (110, 56); all cursor points are stage points */
  var WX = 110, WY = 56;
  /* 1. checkout: pick mobile money, enter the number, continue, approve on the phone, paid */
  make(scenes[0], 9400, function (key, cur, swap, typing, toast) {
    var r = WX + 500 + 60, ay = WY + 36 + 146;
    cur([[900, 1180, 640], [1700, r + 150, ay + 135, 0, 800], [1750, 'click'], [3500, r + 260, WY + 36 + 384 + 112 + 23, 0, 900], [3550, 'click'], [4100, 'hide']]);
    key('.co-sel', [[0, { transform: 'translateY(0px)' }], [1850, { transform: 'translateY(0px)' }, E], [2250, { transform: 'translateY(108px)' }]]);
    key('.co-mx', [[0, { opacity: 0, clipPath: 'inset(0 0 100% 0)' }], [1950, { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, E], [2450, { opacity: 1, clipPath: 'inset(0 0 0% 0)' }]]);
    key('.co-m.cr', [[0, { transform: 'translateY(0px)' }], [1950, { transform: 'translateY(0px)' }, E], [2450, { transform: 'translateY(112px)' }]]);
    key('.co-btn', [[0, { transform: 'translateY(0px)', backgroundColor: '#5458f2' }], [1950, { transform: 'translateY(0px)' }, E], [2450, { transform: 'translateY(112px)' }], [3600, { backgroundColor: '#5458f2' }, E], [3700, { backgroundColor: '#3f43d9' }, E], [3850, { backgroundColor: '#5458f2' }]]);
    swap('.co-btn .b1', '.co-btn .b2', 2000, 300);
    typing('.co-typ', 2600, 800, 11);
    swap('.co-pay', '.co-wait', 3950, 400);
    key('.co-wait', [[0, { opacity: 0, transform: 'translateY(10px)' }], [4010, { opacity: 0, transform: 'translateY(10px)' }, E], [4410, { opacity: 1, transform: 'translateY(0px)' }], [6000, { opacity: 1, transform: 'translateY(0px)' }, E], [6350, { opacity: 0, transform: 'translateY(-10px)' }]]);
    key('.co-ok', [[0, { opacity: 0, transform: 'translateY(12px)' }], [6300, { opacity: 0, transform: 'translateY(12px)' }, E], [6800, { opacity: 1, transform: 'translateY(0px)' }]]);
    key('.co-ok-i', [[0, { transform: 'scale(.6)' }], [6300, { transform: 'scale(.6)' }, POP], [6900, { transform: 'scale(1)' }]]);
    key('.co-ok-i path', [[0, { strokeDashoffset: 1 }], [6500, { strokeDashoffset: 1 }, E], [7000, { strokeDashoffset: 0 }]]);
    toast('.t1', 7000, 8600);
  });
  /* 2. payment links: create one from the takeover sheet, see it at the top of the list, copy it */
  make(scenes[1], 10400, function (key, cur, swap, typing, toast) {
    cur([[700, 1180, 640], [1450, 1043, 176, 0, 750], [1500, 'click'], [2700, 331, 304, 0, 800], [2750, 'click'], [3650, 331, 419, 0, 650], [3700, 'click'],
         [4850, 414, 568, 0, 800], [4900, 'click'], [7000, 932, 356, 0, 900], [7050, 'click'], [8200, 'hide']]);
    key('.pl-new', [[0, { transform: 'scale(1)' }], [1500, { transform: 'scale(1)' }, E], [1600, { transform: 'scale(.97)' }, E], [1750, { transform: 'scale(1)' }]]);
    key('.x-scrim', [[0, { opacity: 0 }], [1650, { opacity: 0 }, E], [2100, { opacity: 1 }], [5150, { opacity: 1 }, E], [5650, { opacity: 0 }]]);
    key('.x-sheet', [[0, { transform: 'translateY(560px)' }], [1650, { transform: 'translateY(560px)' }, 'cubic-bezier(.32,.72,0,1)'], [2300, { transform: 'translateY(0px)' }],
      [5100, { transform: 'translateY(0px)' }, 'cubic-bezier(.32,0,.67,0)'], [5650, { transform: 'translateY(560px)' }]]);
    key('.x-picker', [[0, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)' }], [2750, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)' }, E], [2850, { boxShadow: 'inset 0 0 0 1.5px #455bd1' }], [3800, { boxShadow: 'inset 0 0 0 1.5px #455bd1' }, E], [4000, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)' }]]);
    key('.x-dd', [[0, { opacity: 0, transform: 'translateY(-6px) scale(.98)' }], [2800, { opacity: 0, transform: 'translateY(-6px) scale(.98)' }, E], [3050, { opacity: 1, transform: 'translateY(0px) scale(1)' }],
      [3780, { opacity: 1, transform: 'translateY(0px) scale(1)' }, E], [3950, { opacity: 0, transform: 'translateY(-4px) scale(.99)' }]]);
    key('.x-dp:nth-child(3)', [[0, { backgroundColor: 'rgba(240,240,243,0)' }], [3450, { backgroundColor: 'rgba(240,240,243,0)' }, E], [3600, { backgroundColor: 'rgba(240,240,243,1)' }]]);
    swap('.x-picker .ph', '.x-picker .fl', 3850, 250);
    swap('.x-ph-t .a', '.x-ph-t .b', 4000, 300); swap('.x-ph-a .a', '.x-ph-a .b', 4050, 350);
    root_swaps.call(null);
    function root_swaps() { var n = 0; scenes[1].querySelectorAll('.x-sw').forEach(function (w) { n++; swap(w.querySelector('.a'), w.querySelector('.b'), 4100 + n * 30, 300); }); }
    key('.x-go', [[0, { transform: 'scale(1)' }], [4900, { transform: 'scale(1)' }, E], [5000, { transform: 'scale(.97)' }, E], [5150, { transform: 'scale(1)' }]]);
    key('.x-rows', [[0, { transform: 'translateY(0px)' }], [5750, { transform: 'translateY(0px)' }, E], [6250, { transform: 'translateY(44px)' }]]);
    key('.x-tr.new', [[0, { opacity: 0, transform: 'translateX(-10px)', backgroundColor: 'rgba(240,240,243,1)' }], [5900, { opacity: 0, transform: 'translateX(-10px)', backgroundColor: 'rgba(240,240,243,1)' }, E],
      [6400, { opacity: 1, transform: 'translateX(0px)', backgroundColor: 'rgba(240,240,243,1)' }], [8200, { backgroundColor: 'rgba(240,240,243,1)' }, EIO], [9400, { backgroundColor: 'rgba(240,240,243,0)' }]]);
    swap('.x-tr.new .x-cp .c1', '.x-tr.new .x-cp .c2', 7100, 200);
    toast('.t2', 7300, 9600);
  });
  /* 3. connect: fill in who the account is for, review, create, copy the onboarding link, see it in the list */
  make(scenes[2], 12600, function (key, cur, swap, typing, toast) {
    cur([[700, 1180, 640], [1450, 1063, 176, 0, 750], [1500, 'click'], [2650, 530, 341, 0, 700], [2700, 'click'], [3900, 530, 411, 0, 600], [3950, 'click'],
         [5150, 755, 555, 0, 650], [5200, 'click'], [6050, 818, 598, 0, 600], [6100, 'click'], [7250, 802, 598, 0, 700], [7300, 'click'], [8450, 824, 443, 0, 700], [8500, 'click'], [9400, 'hide']]);
    key('.cn-new', [[0, { transform: 'scale(1)' }], [1500, { transform: 'scale(1)' }, E], [1600, { transform: 'scale(.97)' }, E], [1750, { transform: 'scale(1)' }]]);
    key('.x-scrim', [[0, { opacity: 0 }], [1650, { opacity: 0 }, E], [2100, { opacity: 1 }], [9700, { opacity: 1 }, E], [10200, { opacity: 0 }]]);
    key('.x-sheet', [[0, { transform: 'translateY(560px)' }], [1650, { transform: 'translateY(560px)' }, 'cubic-bezier(.32,.72,0,1)'], [2300, { transform: 'translateY(0px)' }],
      [9650, { transform: 'translateY(0px)' }, 'cubic-bezier(.32,0,.67,0)'], [10200, { transform: 'translateY(560px)' }]]);
    function focus(sel, t0, t1) { key(sel, [[0, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)' }], [t0, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)' }, E], [t0 + 120, { boxShadow: 'inset 0 0 0 1.5px #455bd1' }], [t1, { boxShadow: 'inset 0 0 0 1.5px #455bd1' }, E], [t1 + 150, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)' }]]); }
    var ins = scenes[2].querySelectorAll('.s3 .x-in');
    focus(ins[0], 2700, 3850); focus(ins[1], 3950, 5100);
    key(ins[0].querySelector('.x-ph'), [[0, { opacity: 1 }], [2780, { opacity: 1 }], [2800, { opacity: 0 }]]);
    key(ins[1].querySelector('.x-ph'), [[0, { opacity: 1 }], [4030, { opacity: 1 }], [4050, { opacity: 0 }]]);
    typing('.t1', 2800, 950, 21); typing('.t2', 4050, 700, 14);
    key('.x-rc.co', [[0, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)', backgroundColor: 'rgba(82,102,235,0)' }], [5200, { boxShadow: 'inset 0 0 0 1px rgba(167,167,184,.3)', backgroundColor: 'rgba(82,102,235,0)' }, E], [5400, { boxShadow: 'inset 0 0 0 1.5px #455bd1', backgroundColor: 'rgba(82,102,235,.08)' }]]);
    key('.x-rc.co .x-rd', [[0, { boxShadow: 'inset 0 0 0 1.5px #c3c3cf' }], [5200, { boxShadow: 'inset 0 0 0 1.5px #c3c3cf' }, E], [5400, { boxShadow: 'inset 0 0 0 5px #455bd1' }]]);
    key('.x-bars .b4 i', [[0, { transform: 'scaleX(0)' }], [6200, { transform: 'scaleX(0)' }, E], [6650, { transform: 'scaleX(1)' }]]);
    swap('.s3', '.s4', 6200, 350);
    key('.s4', [[0, { opacity: 0, transform: 'translateY(10px)' }], [6260, { opacity: 0, transform: 'translateY(10px)' }, E], [6610, { opacity: 1, transform: 'translateY(0px)' }], [7400, { opacity: 1, transform: 'translateY(0px)' }, E], [7700, { opacity: 0, transform: 'translateY(-10px)' }]]);
    key('.s5', [[0, { opacity: 0, transform: 'translateY(10px)' }], [7650, { opacity: 0, transform: 'translateY(10px)' }, E], [8050, { opacity: 1, transform: 'translateY(0px)' }]]);
    key('.x-bars', [[0, { opacity: 1 }], [7400, { opacity: 1 }, E], [7700, { opacity: 0 }]]);
    swap('.sw2 .a', '.sw2 .b', 7500, 300);
    key('.x-okc', [[0, { transform: 'scale(.6)' }], [7700, { transform: 'scale(.6)' }, POP], [8200, { transform: 'scale(1)' }]]);
    key('.x-okc path', [[0, { strokeDashoffset: 1 }], [7850, { strokeDashoffset: 1 }, E], [8300, { strokeDashoffset: 0 }]]);
    swap('.x-copy .c1', '.x-copy .c2', 8550, 200);
    toast('.t3', 8700, 11400);
    key('.x-rows', [[0, { transform: 'translateY(0px)' }], [10300, { transform: 'translateY(0px)' }, E], [10800, { transform: 'translateY(44px)' }]]);
    key('.x-tr.new', [[0, { opacity: 0, transform: 'translateX(-10px)', backgroundColor: 'rgba(240,240,243,1)' }], [10450, { opacity: 0, transform: 'translateX(-10px)', backgroundColor: 'rgba(240,240,243,1)' }, E],
      [10950, { opacity: 1, transform: 'translateX(0px)', backgroundColor: 'rgba(240,240,243,1)' }]]);
  });

  /* the stories follow each other on their own, and pause while off screen */
  var cur = -1, visible = true;
  function play(k) {
    if (cur > -1) SC[cur].anims.forEach(function (a) { a.onfinish = null; a.pause(); a.currentTime = 0; });
    cur = k;
    var sc = SC[k];
    if (reduce) { sc.anims.forEach(function (a) { a.currentTime = sc.T * .8; }); return; }
    sc.anims.forEach(function (a) { a.currentTime = 0; if (visible) a.play(); });
    sc.anims[0].onfinish = function () { if (cur === k) play((k + 1) % SC.length); };
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) { visible = e.isIntersecting; if (cur < 0) return; SC[cur].anims.forEach(function (a) { visible ? a.play() : a.pause(); }); });
  }, { threshold: .2 }).observe(stage);
  play(0);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* developers: as you scroll the pinned stack, the layers part and each one is explained in turn */
  var st = document.getElementById('dev-story'); if (!st) return;
  var cells = st.querySelectorAll('.dv-cell'), L = [st.querySelector('.L1'), st.querySelector('.L2'), st.querySelector('.L3')];
  var dot = st.querySelector('.ds-dot'), fill = st.querySelector('.ds-rail i'), left = st.querySelector('.ds-l');
  var mobile = matchMedia('(max-width: 900px)').matches, last = -1;
  if (mobile) { cells.forEach(function (c) { c.classList.add('on'); }); return; }
  function on() {
    var r = st.getBoundingClientRect(), total = st.offsetHeight - innerHeight;
    var p = Math.min(1, Math.max(0, -r.top / total));
    var spread = Math.min(1, p * 1.6), k = Math.min(2, Math.floor(p * 3));
    L[0].setAttribute('transform', 'translate(0 ' + (-46 * spread).toFixed(1) + ')');
    L[2].setAttribute('transform', 'translate(0 ' + (46 * spread).toFixed(1) + ')');
    fill.style.transform = 'scaleY(' + p.toFixed(3) + ')';
    if (k !== last) {
      last = k;
      cells.forEach(function (c, i) { c.classList.toggle('on', i === k); });
      L.forEach(function (l, i) { l.classList.toggle('dim', i !== k); l.classList.toggle('lit', i === k); });
      var c = cells[k], lr = left.getBoundingClientRect(), cr = c.getBoundingClientRect();
      dot.style.top = (cr.top - lr.top + 22) + 'px';
    }
  }
  addEventListener('scroll', on, { passive: true }); addEventListener('resize', function () { last = -1; on(); }); on();
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* customers: joins in the locked grid get a small cross */
  var grid = document.getElementById('cu-grid');
  function marks() {
    if (!grid) return;
    grid.querySelectorAll('.cu-x').forEach(function (x) { x.remove(); });
    if (matchMedia('(max-width: 900px)').matches) return;
    var w = grid.clientWidth, h = grid.clientHeight;
    [1, 2, 3].forEach(function (c) { var x = document.createElement('i'); x.className = 'cu-x'; x.style.left = (w * c / 4) + 'px'; x.style.top = (h / 2) + 'px'; grid.appendChild(x); });
  }
  marks(); addEventListener('resize', marks);

  /* customers: the big story; tabs along its foot, logos above, and it moves on by itself */
  var card = document.getElementById('cu-card');
  if (card) {
    var ss = card.querySelectorAll('.cu-s'), tabs = card.querySelectorAll('.cu-tab'), cells = document.querySelectorAll('.cu-cell.has');
    var keys = [].map.call(ss, function (x) { return x.dataset.k; }), i = 0, bar = null, hold = false;
    function show(k) {
      i = keys.indexOf(k);
      ss.forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); });
      cells.forEach(function (c) { c.classList.toggle('on', c.dataset.k === k); });
      tabs.forEach(function (t) { t.classList.toggle('on', t.dataset.k === k); t.querySelector('b').style.transform = 'scaleX(0)'; });
      if (bar) bar.cancel();
      if (reduce) return;
      var b = card.querySelector('.cu-tab[data-k="' + k + '"] b'); if (!b) return;
      bar = b.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 6000, fill: 'forwards' });
      if (hold) bar.pause();
      bar.onfinish = function () { show(keys[(i + 1) % keys.length]); };
    }
    function pause(v) { hold = v; if (bar) v ? bar.pause() : bar.play(); }
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.k); }); });
    cells.forEach(function (c) { c.addEventListener('mouseenter', function () { show(c.dataset.k); pause(true); }); c.addEventListener('mouseleave', function () { pause(false); }); c.addEventListener('click', function (e) { e.preventDefault(); show(c.dataset.k); }); });
    card.addEventListener('mouseenter', function () { pause(true); }); card.addEventListener('mouseleave', function () { pause(false); });
    show(keys[0]);
  }

  /* currencies, after Ramp's integrations card: a staggered lattice under a soft lens. Tiles near the lens are crisp and full size,
     the rest shrink, fade and lose their tile. The lattice drifts slowly; the lens follows your cursor */
  var fx = document.getElementById('fx');
  if (fx) {
    var FL = ["/landing/assets/535c75b0f5e8.svg", "/landing/assets/8bda8cf1455d.svg", "/landing/assets/fa0bed014d12.svg", "/landing/assets/2368a7cf0fe8.svg", "/landing/assets/e90d2316d220.svg", "/landing/assets/61ba029bce9a.svg", "/landing/assets/64e4960f2c9c.svg", "/landing/assets/8fe80c8320f4.svg", "/landing/assets/13c7f640e579.svg", "/landing/assets/4c55380202d2.svg", "/landing/assets/f893d492aebf.svg", "/landing/assets/e0c41d869199.svg", "/landing/assets/b985a8f0b444.svg", "/landing/assets/131323645c3d.svg", "/landing/assets/6d3089143fe9.svg", "/landing/assets/bcc5c80fc8ee.svg", "/landing/assets/2c6191549470.svg", "/landing/assets/39f1647f67e9.svg", "/landing/assets/28ce5d1eef73.svg", "/landing/assets/1c0fc639b909.svg", "/landing/assets/3a40dd5b1c73.svg", "/landing/assets/c4ff5b9b3f80.svg", "/landing/assets/10e110d66617.svg", "/landing/assets/0c7ac533bce8.svg", "/landing/assets/6e3dc631e56b.svg", "/landing/assets/a6504203d553.svg", "/landing/assets/d7697f8dc93a.svg", "/landing/assets/3f18e1c901b5.svg", "/landing/assets/f0673aefd95e.svg", "/landing/assets/d4d5e6dad962.svg", "/landing/assets/714628f501e9.svg", "/landing/assets/2d41bbe53a28.svg", "/landing/assets/6586e9e7ced7.svg", "/landing/assets/b1f60794fa5c.svg", "/landing/assets/814c4a185a15.svg", "/landing/assets/3b076a59a799.svg", "/landing/assets/82c61b55dec2.svg", "/landing/assets/e3294e42dad7.svg", "/landing/assets/e4e46f8a97be.svg", "/landing/assets/1bd540dfec27.svg", "/landing/assets/c6e7da7ce611.svg", "/landing/assets/bdf56c51e471.svg", "/landing/assets/b9288980a220.svg", "/landing/assets/c4a4256358db.svg", "/landing/assets/11d50c51c5c8.svg", "/landing/assets/62ef93fed8d6.svg", "/landing/assets/c0796276bde5.svg", "/landing/assets/e4cfa04c1719.svg", "/landing/assets/1da5c9cf45b3.svg", "/landing/assets/271440267db3.svg", "/landing/assets/e70b69ae2dda.svg", "/landing/assets/3202bdb0c942.svg", "/landing/assets/b90708bfc9db.svg", "/landing/assets/67c088a27aed.svg", "/landing/assets/52564fe2297a.svg", "/landing/assets/c0a1493f3004.svg", "/landing/assets/e38fc2b99d78.svg", "/landing/assets/f70f85e66766.svg", "/landing/assets/13d1288cabcb.svg", "/landing/assets/4db9e57c9a27.svg", "/landing/assets/495242a47f44.svg", "/landing/assets/745f3ab67912.svg", "/landing/assets/9dc9587005fb.svg"], RANK = [61, 52, 41, 32, 23, 25, 34, 46, 57, 50, 37, 21, 12, 10, 16, 28, 43, 59, 55, 39, 19, 7, 2, 4, 14, 30, 48, 45, 27, 9, 1, 0, 6, 18, 36, 54, 56, 40, 20, 8, 3, 5, 15, 31, 49, 51, 38, 22, 13, 11, 17, 29, 44, 60, 62, 53, 42, 33, 24, 26, 35, 47, 58];
    var GAP = 74, cols = 9, rows = 7, tiles = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var d = document.createElement('div'), fl = FL[RANK[r * cols + c]];
      d.className = 'fx-t';
      d.innerHTML = '<img class="fx-flag" alt="" src="' + fl + '">';
      fx.appendChild(d); tiles.push({ el: d, c: c, r: r });
    }
    var W = 0, H = 0, lx = .5, ly = .55, tx = .5, ty = .55, off = 0, raf = 0, last = 0, inView = false;
    function size() { W = fx.clientWidth; H = fx.clientHeight; }
    function frame(now) {
      var dt = Math.min(50, now - (last || now)); last = now;
      if (!reduce) off = (off + dt * .006) % GAP;
      lx += (tx - lx) * .08; ly += (ty - ly) * .08;
      var cx = lx * W, cy = ly * H, R = Math.max(W, H) * .62;
      for (var k = 0; k < tiles.length; k++) {
        var t = tiles[k], x = (t.c - 1) * GAP + (t.r % 2 ? GAP / 2 : 0) - off, y = (t.r - 1) * GAP * .88 + off * .5;
        var dx = x - cx, dy = y - cy, dist = Math.sqrt(dx * dx + dy * dy), q = Math.min(1, dist / R);
        var bend = 1 - q * q * .28;   /* pull toward the lens a little, like a curved surface */
        var px = cx + dx * bend, py = cy + dy * bend, sc = 1.12 - q * .72, op = 1 - Math.pow(q, 1.6);
        t.el.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
        t.el.style.opacity = Math.max(0, op).toFixed(3);
      }
      if (inView) raf = requestAnimationFrame(frame); else raf = 0;
    }
    var tile = fx.closest('.bt');
    tile.addEventListener('pointermove', function (e) { var r = fx.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; });
    tile.addEventListener('pointerleave', function () { tx = .5; ty = .55; });
    size(); addEventListener('resize', size);
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView && !raf) { last = 0; raf = requestAnimationFrame(frame); } }).observe(fx);
    frame(0);
  }

  /* developers: one chapter at a time; the index, the rail and the stack follow */
  var st = document.getElementById('dev-story');
  if (st) {
    var idx = st.querySelectorAll('.ds-idx span'), ptr = st.querySelectorAll('.dv-ptr'), dots = st.querySelectorAll('.dv-dot');
    var obs = new MutationObserver(function () {
      var k = [].findIndex.call(st.querySelectorAll('.dv-cell'), function (c) { return c.classList.contains('on'); });
      idx.forEach(function (x, n) { x.classList.toggle('on', n === k); });
      ptr.forEach(function (x, n) { x.classList.toggle('hot', n === k); }); dots.forEach(function (x, n) { x.classList.toggle('hot', n === k); });
      var d = st.querySelector('.ds-dot'), sp = idx[k]; if (d && sp) { var lr = st.querySelector('.ds-l').getBoundingClientRect(), r = sp.getBoundingClientRect(); d.style.top = (r.top - lr.top + r.height / 2 - 5) + 'px'; }
    });
    st.querySelectorAll('.dv-cell').forEach(function (c) { obs.observe(c, { attributes: true, attributeFilter: ['class'] }); });
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* bento: the glow follows the cursor along the card's edge */
  document.querySelectorAll('.bt').forEach(function (c) {
    c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });
  /* bento: the expand button opens a short note */
  var bx = document.getElementById('bx-modal'), last = null;
  function closeBx() { bx.classList.remove('on'); setTimeout(function () { bx.hidden = true; if (last) last.focus(); }, 200); }
  document.querySelectorAll('button.bt-x').forEach(function (b) {
    b.addEventListener('click', function () {
      last = b; document.getElementById('bx-t').textContent = b.parentNode.querySelector('h3').textContent; document.getElementById('bx-p').textContent = b.dataset.note;
      bx.hidden = false; requestAnimationFrame(function () { bx.classList.add('on'); bx.querySelector('.bx-close').focus(); });
    });
  });
  bx.addEventListener('click', function (e) { if (e.target === bx || e.target.classList.contains('bx-close')) closeBx(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !bx.hidden) closeBx(); });

  /* a tiny scene runner: steps of [ms, fn], looping while in view */
  function scene(el, steps) {
    var i = 0, t = null, on = false;
    function next() { var s = steps[i]; s[1](); i = (i + 1) % steps.length; t = setTimeout(next, s[0]); }
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !on && !reduce) { on = true; i = 0; next(); } else if (!e.isIntersecting && on) { on = false; clearTimeout(t); } }); }, { threshold: .35 }).observe(el);
  }

  /* link card: choose, create, copied */
  var lf = document.getElementById('lf');
  if (lf) {
    var C = function (a, r) { return function () { if (r) lf.classList.remove.apply(lf.classList, r); if (a) lf.classList.add.apply(lf.classList, a); }; };
    scene(lf, [[900, C(null, ['open', 'hl2', 'picked', 'press', 'busy', 'done'])], [700, C(['open'])], [520, C(['hl2'])], [600, C(['picked'], ['open'])],
      [160, C(['press'])], [1500, C(['busy'], ['press'])], [2600, C(['done'], ['busy'])]]);
  }
  /* spend: the bars fill when you get there; the approval goes through */
  var sp = document.getElementById('spend');
  if (sp) {
    new IntersectionObserver(function (es) { if (es[0].isIntersecting) sp.classList.add('in'); }, { threshold: .3 }).observe(sp);
    var ap = sp.querySelector('.sp-ap');
    if (ap) scene(ap, [[2600, function () { ap.classList.remove('ok', 'press'); }], [160, function () { ap.classList.add('press'); }], [2600, function () { ap.classList.remove('press'); ap.classList.add('ok'); }]]);
  }
  /* agents: the log writes itself once */
  var ag = document.getElementById('agents');
  if (ag) new IntersectionObserver(function (es) { if (es[0].isIntersecting) ag.classList.add('in'); }, { threshold: .3 }).observe(ag);

  /* currencies, closer to Ramp: a dense, still lattice, crisp in the middle and thinning to the edges.
     Under the cursor the tiles swell and lean away like a lens over them; leave and they settle */
  var fx = document.getElementById('fx2');
  if (fx) {
    var CUR = [['sym', '₦'], ['sym', 'GH₵'], ['sym', 'KSh'], ['sym', '$'], ['sym', '₮'], ['sym', 'USDC']];
    var G = 62, cols = 11, rows = 9, T = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var d = document.createElement('i'), cc = CUR[(r * 4 + c * 5 + (r % 2)) % CUR.length];
      d.className = 'fxt'; d.innerHTML = '<i class="' + cc[0] + '">' + (cc[1] || '') + '</i>';
      fx.appendChild(d); T.push({ el: d, c: c, r: r });
    }
    var W = 0, H = 0, mx = -1e4, my = -1e4, tx = -1e4, ty = -1e4, k = 0, kt = 0, raf = 0, drift = 0, lastT = 0;
    function size() { W = fx.clientWidth; H = fx.clientHeight; draw(); }
    function draw() {
      var cx = W / 2, cy = H / 2 + 10, R = Math.max(W, H) * .7;
      for (var n = 0; n < T.length; n++) {
        var t = T[n], x = cx + (t.c - (cols - 1) / 2) * G + (t.r % 2 ? G / 2 : 0) - G / 4 + drift, y = cy + (t.r - (rows - 1) / 2) * G * .9;
        var dx = x - cx, dy = y - cy, q = Math.min(1, Math.sqrt(dx * dx + dy * dy) / R);
        var sc = 1 - q * q * .55, op = Math.max(0, 1 - Math.pow(q, 1.8) * 1.15);
        /* the lens */
        var lx = x - mx, ly = y - my, ld = Math.sqrt(lx * lx + ly * ly), f = k * Math.max(0, 1 - ld / 150), push = f * f * 16;
        x += ld ? lx / ld * push : 0; y += ld ? ly / ld * push : 0; sc *= 1 + f * .22;
        t.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
        t.el.style.opacity = op.toFixed(3);
      }
    }
    function tick(now) {
      var dt = Math.min(40, now - (lastT || now)); lastT = now;
      k += (kt - k) * .12; mx += (tx - mx) * .2; my += (ty - my) * .2;
      draw();
      if (Math.abs(kt - k) > .002 || Math.abs(tx - mx) > .3 || Math.abs(ty - my) > .3) raf = requestAnimationFrame(tick); else { raf = 0; lastT = 0; }
    }
    function go() { if (!raf) raf = requestAnimationFrame(tick); }
    var card = fx.closest('.bt');
    card.addEventListener('pointermove', function (e) { if (!fine || reduce) return; var b = fx.getBoundingClientRect(); tx = e.clientX - b.left; ty = e.clientY - b.top; if (k < .01) { mx = tx; my = ty; } kt = 1; go(); });
    card.addEventListener('pointerleave', function () { kt = 0; go(); });
    size(); addEventListener('resize', size);
  }

  /* developers: as the grid passes through the screen, the three parts light in turn */
  var dg = document.getElementById('dev-grid');
  if (dg) {
    var cells = dg.querySelectorAll('.dv-cell'), L = [dg.querySelector('.L1'), dg.querySelector('.L2'), dg.querySelector('.L3')], ptr = dg.querySelectorAll('.dv-ptr'), dots = dg.querySelectorAll('.dv-dot'), cur = -1;
    function onS() {
      var r = dg.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var p = Math.min(.999, Math.max(0, (vh * .72 - r.top) / (r.height * .9)));
      var k2 = r.top > vh * .72 ? -1 : Math.floor(p * 3);
      if (k2 === cur) return; cur = k2;
      dg.classList.toggle('story', k2 >= 0);
      cells.forEach(function (c, i) { c.classList.toggle('hot', i === k2); });
      L.forEach(function (l, i) { if (!l) return; l.classList.toggle('dim', k2 >= 0 && i !== k2); l.classList.toggle('lit', i === k2); });
      ptr.forEach(function (x, i) { x.classList.toggle('hot', i === k2); }); dots.forEach(function (x, i) { x.classList.toggle('hot', i === k2); });
    }
    addEventListener('scroll', onS, { passive: true }); onS();
  }

  /* CTA: the glow leans toward the cursor, but only so far */
  var cta = document.querySelector('.cta-in'), bloom = document.querySelector('.cta-bloom');
  if (cta && bloom && fine && !reduce) {
    cta.addEventListener('pointermove', function (e) { var r = cta.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      bloom.style.setProperty('--bx', (nx * 180).toFixed(1) + 'px'); bloom.style.setProperty('--by', (ny * 60).toFixed(1) + 'px'); });
    cta.addEventListener('pointerleave', function () { bloom.style.setProperty('--bx', '0px'); bloom.style.setProperty('--by', '0px'); });
  }

  /* customers: the story moves on by itself every six seconds, and holds while you hover */
  var card2 = document.getElementById('cu-card');
  if (card2) {
    var cells2 = document.querySelectorAll('.cu-cell.has'), ss = card2.querySelectorAll('.cu-s'), keys = [].map.call(ss, function (x) { return x.dataset.k; }), hold = false;
    setInterval(function () { if (hold || reduce) return; var on = card2.querySelector('.cu-s.on'), i = keys.indexOf(on ? on.dataset.k : keys[0]), k = keys[(i + 1) % keys.length];
      ss.forEach(function (x) { x.classList.toggle('on', x.dataset.k === k); }); cells2.forEach(function (c) { c.classList.toggle('on', c.dataset.k === k); }); }, 6000);
    card2.addEventListener('mouseenter', function () { hold = true; }); card2.addEventListener('mouseleave', function () { hold = false; });
    cells2.forEach(function (c) { c.addEventListener('mouseenter', function () { hold = true; ss.forEach(function (x) { x.classList.toggle('on', x.dataset.k === c.dataset.k); }); cells2.forEach(function (o) { o.classList.toggle('on', o === c); }); }); c.addEventListener('mouseleave', function () { hold = false; }); });
  }

  /* ask bar: shows once you are past the hero; opens on hover or focus; suggests what fits */
  var ask = document.getElementById('ask'), f = document.getElementById('ask-f'), inp = document.getElementById('ask-in'), out = document.getElementById('ask-out');
  if (ask) {
    var hero = document.getElementById('hero');
    function vis() { ask.classList.add('show'); }
    addEventListener('scroll', vis, { passive: true }); vis();
    var openT;
    function open() { clearTimeout(openT); ask.classList.add('open'); }
    function shut() { openT = setTimeout(function () { if (document.activeElement !== inp && !out.classList.contains('on')) ask.classList.remove('open'); }, 250); }
    ask.addEventListener('mouseenter', open); ask.addEventListener('mouseleave', shut);
    f.addEventListener('click', function () { open(); inp.focus(); });
    inp.addEventListener('focus', open); inp.addEventListener('blur', shut);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { out.classList.remove('on'); inp.blur(); ask.classList.remove('open'); } });
    document.addEventListener('pointerdown', function (e) { if (!ask.contains(e.target)) { out.classList.remove('on'); shut(); } });
    var P = {
      checkout: ['Checkout', 'Bank, card, mobile money and crypto in one place', '#bento'],
      links: ['Payment links', 'Get paid without writing code', '#bento'],
      subs: ['Subscriptions', 'Charge customers on a schedule', '#bento'],
      connect: ['Connect', 'Onboard sellers and route payments to them', '#developers'],
      payouts: ['Payouts', 'Pay sellers and suppliers from your balance', '#bento'],
      stable: ['Stablecoins', 'Accept USDT and USDC', '#bento'],
      wp: ['WordPress plugin', 'Add checkout to a WooCommerce store', '#bento'],
      agents: ['Agent keys', 'Let an AI agent move money within limits', '#agents'],
      spend: ['Spend', 'Budgets and approvals for what goes out', '#enterprise'],
      api: ['API', 'One API for every way your customers pay', '#developers']
    };
    var RULES = [[/market|platform|seller|vendor|driver|rider|creator platform/, ['connect', 'payouts', 'checkout'], 'a platform with sellers'],
      [/saas|subscri|software|app|member|course|school|tuition|student/, ['subs', 'checkout', 'links'], 'recurring revenue'],
      [/shop|store|ecommerce|e-commerce|woo|wordpress|fashion|retail/, ['checkout', 'wp', 'links'], 'an online store'],
      [/freelanc|agency|consult|design|studio|coach|service/, ['links', 'checkout', 'subs'], 'a service business'],
      [/crypto|usdt|usdc|stable|web3|token/, ['stable', 'checkout', 'payouts'], 'crypto payments'],
      [/agent|ai |ai$|llm|automat|bot/, ['agents', 'api', 'checkout'], 'AI agents'],
      [/team|company|enterprise|finance|expense|budget|spend/, ['spend', 'payouts', 'checkout'], 'a growing company']];
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var q = (' ' + inp.value.toLowerCase() + ' ').trim(); if (!q) { inp.focus(); return; }
      var hit = null; for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(q)) { hit = RULES[i]; break; }
      var picks = hit ? hit[1] : ['checkout', 'links', 'api'], label = hit ? hit[2] : 'getting paid online';
      out.innerHTML = '<p>For <b>' + label + '</b>, start here:</p><div class="ask-recs">' + picks.map(function (k) { var x = P[k]; return '<a href="' + x[2] + '"><b>' + x[0] + '</b><span>' + x[1] + '</span></a>'; }).join('') + '</div>';
      out.classList.add('on');
    });
    out.addEventListener('click', function (e) { if (e.target.closest('a')) { out.classList.remove('on'); ask.classList.remove('open'); inp.blur(); } });
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-src-from]').forEach(function (i) { if (!i.getAttribute('src')) { var o = document.getElementById(i.dataset.srcFrom); if (o) i.src = o.src; } });

  /* ask: hover the blob and the question slides out; stay, or click, and it opens for typing */
  var ask = document.getElementById('ask'), inp = document.getElementById('ask-in'), t1;
  if (ask) {
    ask.addEventListener('mouseenter', function () { ask.classList.add('peek'); clearTimeout(t1); t1 = setTimeout(function () { ask.classList.add('open'); }, 650); });
    ask.addEventListener('mouseleave', function () { clearTimeout(t1); if (document.activeElement !== inp && !inp.value) { ask.classList.remove('peek'); ask.classList.remove('open'); } });
    inp.addEventListener('blur', function () { if (!inp.value) { ask.classList.remove('peek'); } });
  }

  /* link card: a fuller loop, with copy and the first payment */
  var lf = document.getElementById('lf');
  if (lf) {
    var steps = [[1000, ''], [700, 'open'], [520, 'open hl2'], [600, 'picked'], [160, 'picked press'], [1500, 'picked busy'], [900, 'picked done'], [1300, 'picked done copied'], [3200, 'picked done copied paid']];
    var i = 0, tm = null, on = false;
    function next() { lf.className = 'lf ' + steps[i][1]; var d = steps[i][0]; i = (i + 1) % steps.length; tm = setTimeout(next, d); }
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !on && !reduce) { on = true; i = 0; next(); } else if (!e.isIntersecting && on) { on = false; clearTimeout(tm); } }); }, { threshold: .35 }).observe(lf);
  }

  /* spend: the steps move on by themselves; a click picks one */
  var st = document.getElementById('sp-steps');
  if (st) {
    var items = st.querySelectorAll('.sp-st'), k = 0, bar = null;
    function go(n) {
      k = n; items.forEach(function (x, j) { x.classList.toggle('on', j === n); x.classList.toggle('done', j < n); x.querySelector('b').style.transform = j < n ? 'scaleX(1)' : 'scaleX(0)'; });
      if (bar) bar.cancel(); if (reduce) return;
      bar = items[n].querySelector('b').animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 3600, fill: 'forwards' });
      bar.onfinish = function () { go((k + 1) % items.length); };
    }
    items.forEach(function (x, j) { x.addEventListener('click', function () { go(j); }); });
    var started = false;
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; go(0); } }, { threshold: .3 }).observe(st);
  }

  /* the card: its sheen slides as you scroll past */
  var card = document.getElementById('bc-card');
  if (card && !reduce) {
    function sheen() { var r = card.getBoundingClientRect(), p = Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / innerHeight)); card.style.setProperty('--gx', (-45 + p * 90).toFixed(1) + '%'); }
    addEventListener('scroll', sheen, { passive: true }); sheen();
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var v = document.querySelector('.hero-vid'); if (v && reduce) { v.removeAttribute('autoplay'); v.pause(); }
  /* startups: reuse the logos already on the page */
  var sr = document.getElementById('stu-r');
  if (sr) document.querySelectorAll('.cu-cell').forEach(function (c, i) { if (i > 5) return; var sp = document.createElement('span'), lg = c.querySelector('.lg'); if (lg) sp.appendChild(lg.cloneNode(true)); sr.appendChild(sp); });
  /* connect: the plane settles as it comes into view */
  var cx = document.getElementById('connect');
  if (cx) new IntersectionObserver(function (es) { if (es[0].isIntersecting) cx.classList.add('in'); }, { threshold: .2 }).observe(cx);
  /* the card follows the cursor: a small lean and a light that moves with you */
  var sc = document.querySelector('.bc-scene'), card = document.getElementById('bc-card');
  if (sc && card && !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    sc.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), nx = (e.clientX - (r.left + r.width / 2)) / (r.width), ny = (e.clientY - (r.top + r.height / 2)) / (r.height);
      nx = Math.max(-1, Math.min(1, nx)); ny = Math.max(-1, Math.min(1, ny));
      card.style.setProperty('--rx', (nx * 10).toFixed(2) + 'deg'); card.style.setProperty('--ry', (-ny * 8).toFixed(2) + 'deg');
      card.style.setProperty('--hx', ((nx + 1) * 50).toFixed(1) + '%'); card.style.setProperty('--hy', ((ny + 1) * 50).toFixed(1) + '%');
      card.style.setProperty('--gx2', (nx * 40).toFixed(1) + '%'); sc.classList.add('hover');
    });
    sc.addEventListener('pointerleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); sc.classList.remove('hover'); });
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* startups: arrows move the row; each card borrows a logo already on the page */
  var row = document.getElementById('sx-row');
  if (row) {
    var cells = document.querySelectorAll('.cu-cell');
    row.querySelectorAll('.sx-c').forEach(function (c) { var src = cells[+c.dataset.logo], lg = src && src.querySelector('.lg'); if (lg) c.querySelector('.sx-logo').appendChild(lg.cloneNode(true)); });
    var tm = document.querySelectorAll('.tm-ph img');
    row.querySelectorAll('img[data-tm]').forEach(function (i) { var o = tm[+i.dataset.tm]; if (o) i.src = o.src; });
    document.querySelectorAll('.sx-a').forEach(function (b) { b.addEventListener('click', function () { var c = row.querySelector('.sx-c'); row.scrollBy({ left: (+b.dataset.d) * (c.offsetWidth + 14), behavior: 'smooth' }); }); });
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function inView(el, on, off) { new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? on() : off(); }); }, { threshold: .3 }).observe(el); }

  /* payouts: replaced by the rising stack further down */
  var pns = null;
  if (pns) {
    var ps = pns.querySelectorAll('.pn'), i = 0, t = null;
    function step() { if (i < ps.length) { ps[i].classList.add('on'); i++; t = setTimeout(step, 700); } else { t = setTimeout(function () { ps.forEach(function (p) { p.classList.remove('on'); }); i = 0; t = setTimeout(step, 700); }, 2600); } }
    if (reduce) ps.forEach(function (p) { p.classList.add('on'); }); else inView(pns, function () { if (!t) step(); }, function () { clearTimeout(t); t = null; });
  }

  /* spend: requests get approved one at a time, with a note popping up for each */
  var panel = null;
  if (panel) {
    var pop = document.createElement('div'); pop.className = 'sp-pop'; pop.innerHTML = '<i class="ios-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12.5 10 16l7.5-8"/></svg></i><span class="ios-tx"><small class="ios-h"><span>Bachs</span><time>now</time></small><b></b><em></em></span>'; panel.appendChild(pop);
    var rows = [].slice.call(panel.querySelectorAll('.sg-r')), waiting = rows.filter(function (r) { return r.querySelector('b.spin, b.warn'); });
    var orig = waiting.map(function (r) { return r.querySelector('span + b').outerHTML; }), k = 0, tm = null;
    var OK = '<b class="ok">Approved <svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="currentColor" opacity=".16"/><path d="M7.5 12.4 10.6 15.5 16.6 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></b>';
    function tick() {
      if (k < waiting.length) {
        var r = waiting[k], st = r.querySelector('span + b'); st.outerHTML = OK;
        pop.querySelector('b').textContent = r.querySelector('span b').textContent + ' approved'; pop.querySelector('em').textContent = r.querySelector('span em').textContent;
        pop.classList.add('on'); setTimeout(function () { pop.classList.remove('on'); }, 1600);
        k++; tm = setTimeout(tick, 2400);
      } else { tm = setTimeout(function () { waiting.forEach(function (r, n) { r.querySelector('span + b').outerHTML = orig[n]; }); k = 0; tm = setTimeout(tick, 1600); }, 2600); }
    }
    if (!reduce) inView(panel, function () { if (!tm) tm = setTimeout(tick, 900); }, function () { clearTimeout(tm); tm = null; });
  }

  /* security seals: tilt and glare follow the cursor */
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) document.querySelectorAll('.s2-t').forEach(function (t) {
    var d = t.querySelector('.seal-disc'); if (!d) return;
    t.addEventListener('pointermove', function (e) { var r = d.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      d.style.setProperty('--rx', ((nx - .5) * 22).toFixed(1) + 'deg'); d.style.setProperty('--ry', ((.5 - ny) * 22).toFixed(1) + 'deg');
      d.style.setProperty('--hx', (nx * 100).toFixed(1) + '%'); d.style.setProperty('--hy', (ny * 100).toFixed(1) + '%'); });
    t.addEventListener('pointerleave', function () { d.style.setProperty('--rx', '0deg'); d.style.setProperty('--ry', '0deg'); d.style.setProperty('--hx', '30%'); d.style.setProperty('--hy', '20%'); });
  });
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* backdrop: the hero sky squeezed into a few pixel columns, then blurred into soft streaks */
  var cv = document.getElementById('hs-bg'), src = document.getElementById('hb-img');
  if (cv && src) { var paint = function () { cv.width = 36; cv.height = 5; var c = cv.getContext('2d'); c.filter = 'hue-rotate(-38deg) saturate(1.08) brightness(1.06)'; c.drawImage(src, 0, src.naturalHeight * .1, src.naturalWidth, src.naturalHeight * .6, 0, 0, 36, 5); };
    src.complete ? paint() : src.addEventListener('load', paint); }

  var win = document.getElementById('hs-win'), app = document.getElementById('q-app'); if (!win || !app) return;
  function fit() { var w = win.clientWidth, k = w / 1280; if (innerWidth <= 900) k = Math.max(k, .42); win.style.setProperty('--k', k.toFixed(4)); app.style.setProperty('--k', k.toFixed(4)); }
  fit(); addEventListener('resize', fit);

  /* revenue chart: thirty days of takings, drawn as a smooth line */
  var D = [6, 9, 18, 7, 3, 2, 4, 5, 1, 10, 40, 70, 22, 0, 0, 0, 84, 58, 18, 8, 96, 14, 6, 5, 4, 1, 12, 3, 16, 9, 20, 32, 52];
  var svg = app.querySelector('.q-chart'), W = 640, H = 210;
  var pts = D.map(function (v, i) { return [i / (D.length - 1) * W, H - 6 - v / 100 * (H - 16)]; });
  var d = 'M' + pts[0][0] + ',' + pts[0][1];
  for (var i = 0; i < pts.length - 1; i++) { var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + Math.min(H - 6, p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + Math.min(H - 6, p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1); }
  var line = svg.querySelector('.q-line'), area = svg.querySelector('.q-area'), g = svg.querySelector('.q-grid');
  line.setAttribute('d', d); area.setAttribute('d', d + ' L' + W + ',' + H + ' L0,' + H + 'Z');
  for (var x = 0; x <= 7; x++) g.insertAdjacentHTML('beforeend', '<line x1="' + x * W / 7 + '" x2="' + x * W / 7 + '" y1="0" y2="' + H + '"/>');
  function drawChart() { if (reduce) return; var L = line.getTotalLength ? 2400 : 0; line.animate([{ strokeDasharray: L + ' ' + L, strokeDashoffset: L }, { strokeDasharray: L + ' ' + L, strokeDashoffset: 0 }], { duration: 1600, easing: 'cubic-bezier(.3,.7,.2,1)' });
    area.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 700, fill: 'backwards' }); }

  /* the revenue figure counts up to its value */
  var big = app.querySelector('.q-big');
  function countUp() { if (reduce) return; var to = 3013745.47, t0 = performance.now();
    (function step(t) { var q = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - q, 3), v = to * e, w = Math.floor(v).toLocaleString('en-US'), c = Math.round((v % 1) * 100).toString().padStart(2, '0');
      big.innerHTML = '<span class="q-amt">₦' + w + '<sup>.' + (q < 1 ? c : '47') + '</sup></span>'; if (q < 1) requestAnimationFrame(step); })(t0); }
  var bar = app.querySelector('.q-bar b');

  /* recent payments: step through the latest few */
  var RP = [['EO', 'Emeka Obi', 'emeka@obi.design', '₦16,616.02', 'May 8, 12:28 PM'], ['AO', 'Ada Okafor', 'ada@okafor.studio', '₦450,000.00', 'May 8, 11:40 AM'], ['KM', 'Kofi Mensah', 'kofi@mensahprints.com', 'GH₵9,400.00', 'May 8, 9:47 AM']], ri = 0, rp = app.querySelector('.q-rp');
  function nextRP(dir) { rp.classList.add('swap'); setTimeout(function () { ri = (ri + (dir || 1) + RP.length) % RP.length; var r = RP[ri];
    rp.querySelector('.q-ini').textContent = r[0]; rp.querySelector('.q-rpi b').textContent = r[1]; rp.querySelector('.q-rpi em').textContent = r[2]; rp.querySelector('.q-paid').textContent = r[3]; rp.querySelector('.q-when').textContent = r[4];
    rp.classList.remove('swap'); }, 220); }
  var arr = rp.querySelectorAll('.q-arr i'); arr[0].addEventListener('click', function () { stop(); nextRP(-1); }); arr[1].addEventListener('click', function () { stop(); nextRP(1); });

  /* payments: a new one lands at the top */
  var rows = document.getElementById('q-payrows'), NEW = [['₦72,500.00', 'Bank transfer', 'Chidi Eze'], ['$480.00', 'USDT', 'Lantern Studio'], ['GH₵1,150.00', 'Mobile money', 'Efua Mensah']], ni = 0;
  function landPayment() { var n = NEW[ni++ % NEW.length], r = document.createElement('div'); r.className = 'q-tr new';
    r.innerHTML = '<span class="q-b">' + n[0] + '</span><span><span class="q-st succeeded">Succeeded</span></span><span>' + n[1] + '</span><span>' + n[2] + '</span><span class="q-mut">Just now</span>';
    rows.insertBefore(r, rows.firstChild); if (rows.children.length > 7) rows.removeChild(rows.lastChild); }

  /* pages */
  var navs = app.querySelectorAll('.q-ni[data-pg]'), pages = app.querySelectorAll('.q-pg'), ORDER = ['home', 'pay', 'bal', 'cus', 'bill'], cur = 'home', timers = [];
  function later(f, ms) { timers.push(setTimeout(f, ms)); }
  function show(k) { cur = k; navs.forEach(function (n) { n.classList.toggle('on', n.dataset.pg === k); }); pages.forEach(function (p) { p.classList.toggle('on', p.dataset.pg === k); });
    if (k === 'home') { drawChart(); countUp(); if (bar && !reduce) { bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; bar.offsetWidth; bar.style.transition = ''; bar.style.transform = 'scaleX(1)'; } }
    if (k === 'pay' && !reduce) later(landPayment, 900); }
  navs.forEach(function (n) { n.addEventListener('click', function () { stop(); show(n.dataset.pg); }); });

  /* autoplay walks the sidebar like someone checking their day; any click hands control to you */
  var auto = !reduce, loop = null, visible = false;
  function stop() { auto = false; timers.forEach(clearTimeout); timers = []; }
  function cycle() { if (!auto || !visible) return; var k = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length];
    if (cur === 'home') { nextRP(1); later(function () { if (auto) show(k); later(cycle, 4200); }, 2000); } else { show(k); later(cycle, k === 'home' ? 3600 : 4200); } }
  new IntersectionObserver(function (es) { es.forEach(function (e) { var was = visible; visible = e.isIntersecting;
    if (visible && !was) { if (cur === 'home') { drawChart(); countUp(); } if (auto) later(cycle, 4200); } if (!visible) { timers.forEach(clearTimeout); timers = []; } }); }, { threshold: .25 }).observe(win);
})();
} catch (e) { console.error(e); }
try {
(function () {
  var hero = document.getElementById('hero'), cv = document.getElementById('hl-c'), gv = document.getElementById('hl-g');
  var nav = document.getElementById('nav');
  if (nav && hero) { var nd = function () { nav.classList.toggle('ondark', hero.classList.contains('dark-hero') && !hero.classList.contains('lite') && hero.getBoundingClientRect().bottom > 68); }; nd(); addEventListener('scroll', nd, { passive: true }); }
  if (!cv || !gv) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c = cv.getContext('2d'), g = gv.getContext('2d'), W = 0, H = 0, dpr = 1, raf = 0, last = 0, on = false;
  /* warm trails stream out to the left, cool ones to the right, from a point just above the middle */
  var WARM = ['255,45,85', '255,77,141', '255,122,61', '209,60,255', '255,94,196'], COOL = ['61,107,255', '79,163,255', '108,123,255', '56,210,255', '138,125,255'];
  function gauss() { var u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function make(fresh) {
    var side = Math.random() < .5 ? -1 : 1;
    return { side: side, col: (side < 0 ? WARM : COOL)[Math.random() * 5 | 0], yo: gauss() * .5, d: fresh ? Math.random() : Math.random() * .08,
      v: .1 + Math.random() * .22, th: 1.1 + Math.random() * 2.6, len: .5 + Math.random() * 1.1, a: .5 + Math.random() * .5, hot: Math.random() < .6 };
  }
  var S = []; for (var i = 0; i < 64; i++) S.push(make(true));
  function size() { dpr = Math.min(2, devicePixelRatio || 1); W = hero.clientWidth; H = hero.clientHeight;
    [cv, gv].forEach(function (k) { k.width = W * dpr; k.height = H * dpr; }); c.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function frame(now) {
    var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
    var cx = W * .5, cy = H * (W < 700 ? .34 : .38), half = W * .5, spread = H * (W < 700 ? .2 : .26);
    c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H); c.globalCompositeOperation = 'lighter';
    for (var k = 0; k < S.length; k++) {
      var t = S[k];
      if (!reduce) t.d += t.v * (.18 + t.d * 1.6) * dt;                  /* faster the further out it gets, like passing traffic */
      if (t.d > 1.25) { S[k] = make(false); continue; }
      var e = Math.pow(t.d, 1.5), head = t.side * (18 + e * half * 1.12), y = cy + t.yo * spread * (.18 + .82 * t.d);
      var L = (14 + e * half * .55) * t.len, x1 = cx + head, x0 = x1 - t.side * L;
      var fade = Math.min(1, Math.max(0, t.d - .04) * 4) * Math.min(1, (1.25 - t.d) * 3) * t.a, th = t.th * (.45 + t.d * 1.1);
      var gr = c.createLinearGradient(x0, 0, x1, 0);
      gr.addColorStop(0, 'rgba(' + t.col + ',0)'); gr.addColorStop(.75, 'rgba(' + t.col + ',' + (.5 * fade).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(' + t.col + ',' + fade.toFixed(3) + ')');
      c.lineCap = 'round'; c.strokeStyle = gr; c.lineWidth = th * 2.6; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      if (t.hot) { var gh = c.createLinearGradient(x0, 0, x1, 0); gh.addColorStop(.35, 'rgba(255,255,255,0)'); gh.addColorStop(1, 'rgba(255,255,255,' + (.9 * fade).toFixed(3) + ')');
        c.strokeStyle = gh; c.lineWidth = th * .8; c.beginPath(); c.moveTo(x0 + t.side * L * .3, y); c.lineTo(x1, y); c.stroke(); }
    }
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, gv.width, gv.height); g.drawImage(cv, 0, 0);
    if (on && !reduce) raf = requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', function () { size(); if (!on || reduce) frame(performance.now()); });
  new IntersectionObserver(function (es) { on = es[0].isIntersecting; cancelAnimationFrame(raf); last = 0; if (on) raf = requestAnimationFrame(frame); }).observe(hero);
  frame(performance.now());
})();
} catch (e) { console.error(e); }
try {
(function () {
  var hero = document.getElementById('hero'); if (!hero || !hero.classList.contains('rv')) return;
  var S = hero.querySelectorAll('.rv-s'), C = hero.querySelectorAll('.rv-cap'), i = 0, t = null, live = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function go() {
    var prev = S[i]; i = (i + 1) % S.length;
    prev.classList.remove('on'); prev.classList.add('off'); setTimeout(function () { prev.classList.remove('off'); }, 1700);
    S[i].classList.remove('off'); var img = S[i].querySelector('img'); img.style.animation = 'none'; img.offsetWidth; img.style.animation = '';
    S[i].classList.add('on'); C.forEach(function (c, k) { c.classList.toggle('on', k === i); });
    t = setTimeout(go, 7000);
  }
  new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !t) t = setTimeout(go, 7000); if (!v) { clearTimeout(t); t = null; } }).observe(hero);
})();
} catch (e) { console.error(e); }
try {
(function () {
  var box = document.getElementById('wv-logos'); if (!box) return;
  var seen = {};
  document.querySelectorAll('.cu-cell .lg').forEach(function (l) {
    if (box.children.length >= 6) return; var k = (l.getAttribute('src') || l.outerHTML).slice(0, 80); if (seen[k]) return; seen[k] = 1;
    var c = l.cloneNode(true); c.removeAttribute('id'); c.setAttribute('aria-hidden', 'true'); box.appendChild(c);
  });
  var v = document.querySelector('.wv-v');
  if (v) new IntersectionObserver(function (es) { es[0].isIntersecting ? v.play().catch(function () {}) : v.pause(); }).observe(v);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* logos: the customer marks, quiet and grey, one per cell */
  var box = document.getElementById('bb-logos');
  if (box) { var seen = {}; document.querySelectorAll('.cu-cell .lg').forEach(function (l) {
    if (box.children.length >= 7) return; var k = (l.getAttribute('src') || l.outerHTML).slice(0, 80); if (seen[k]) return; seen[k] = 1;
    var c = l.cloneNode(true); c.removeAttribute('id'); var cell = document.createElement('span'); cell.setAttribute('aria-hidden', 'true'); cell.appendChild(c); box.appendChild(cell); }); }

  /* the baobab: a real photograph whose crown breaks into pixels at its edges.
     On load the pixels drift in from all around and settle into the tree; then the photo resolves under them. */
  var cv = document.getElementById('bb-tree'); if (!cv) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var img = new Image(), dots = [], ground = [], crisp = null, trunk = null, W = 0, H = 0, tx = 0, ty = 0, tw = 0, th = 0, g = 0, dpr = 1, t0 = 0, raf = 0, live = true;
  function ss(a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }
  function build() {
    dpr = Math.min(2, devicePixelRatio || 1);
    var cssW = cv.clientWidth; tw = Math.round(cssW * .8 * dpr); th = Math.round(tw * img.height / img.width);
    W = Math.round(cssW * dpr); H = Math.round(th * 1.12); tx = (W - tw) / 2; ty = H - th - Math.round(6 * dpr);
    cv.width = W; cv.height = H; cv.style.height = (H / dpr) + 'px';
    var o = document.createElement('canvas'); o.width = tw; o.height = th; var oc = o.getContext('2d'); oc.drawImage(img, 0, 0, tw, th);
    var data = oc.getImageData(0, 0, tw, th).data;
    /* the photograph, solid at the heart of the tree and fading out where the pixels take over */
    crisp = document.createElement('canvas'); crisp.width = tw; crisp.height = th; var cc = crisp.getContext('2d'); cc.drawImage(o, 0, 0);
    cc.globalCompositeOperation = 'destination-in'; cc.save(); cc.translate(tw * .5, th * .4); cc.scale(1, .82);
    var rg = cc.createRadialGradient(0, 0, 0, 0, 0, tw * .5); rg.addColorStop(0, '#000'); rg.addColorStop(.5, '#000'); rg.addColorStop(.9, 'rgba(0,0,0,0)');
    cc.fillStyle = rg; cc.fillRect(-tw, -th * 2, tw * 2, th * 4); cc.restore();
    cc.globalCompositeOperation = 'source-over';
    /* the trunk stays whole down to the ground */
        var tk = document.createElement('canvas'); tk.width = tw; tk.height = th; var kc = tk.getContext('2d'); kc.drawImage(o, 0, 0);
    kc.globalCompositeOperation = 'destination-in'; var hg = kc.createLinearGradient(tw * .352, 0, tw * .572, 0);
    hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(.1, '#000'); hg.addColorStop(.9, '#000'); hg.addColorStop(1, 'rgba(0,0,0,0)');
    kc.fillStyle = hg; kc.fillRect(0, th * .5, tw, th * .5); kc.clearRect(0, 0, tw, th * .5);
    var vg = kc.createLinearGradient(0, th * .5, 0, th * .62); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, '#000'); kc.fillStyle = vg; kc.fillRect(0, 0, tw, th);
    trunk = tk;
    /* pixels */
    g = Math.round(5 * dpr); var cols = Math.ceil(tw / g), rows = Math.ceil(th / g), A = new Float32Array(cols * rows);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { var x = Math.min(tw - 1, c * g + (g >> 1)), y = Math.min(th - 1, r * g + (g >> 1)); A[r * cols + c] = data[(y * tw + x) * 4 + 3] / 255; }
    function near(c, r) { var m = 0; for (var j = -2; j <= 2; j++) for (var i = -2; i <= 2; i++) { var cc2 = c + i, rr = r + j; if (cc2 >= 0 && rr >= 0 && cc2 < cols && rr < rows) m = Math.max(m, A[rr * cols + cc2]); } return m; }
    dots = [];
    for (var r2 = 0; r2 < rows; r2++) for (var c2 = 0; c2 < cols; c2++) {
      var u = (c2 + .5) / cols, v = (r2 + .5) / rows, al = A[r2 * cols + c2];
      var rr2 = Math.hypot((u - .5) / .5, (v - .4) / .44), e = ss(.5, 1.02, rr2);
      if (u > .352 && u < .572 && v > .55) e = Math.max(e * .15, ss(.035, 0, Math.min(u - .352, .572 - u)) * .9);                       /* the trunk keeps its photo */
      var px = c2 * g + (g >> 1), py = r2 * g + (g >> 1), k = (Math.min(th - 1, py) * tw + Math.min(tw - 1, px)) * 4;
      var R = data[k], G = data[k + 1], B = data[k + 2];
      if (al > .25) { if (Math.random() < .12 + e * .85) push(c2, r2, R, G, B, e, .5 + Math.random() * .42); }
      else if (Math.random() < e * .3 && near(c2, r2) > .3) push(c2, r2, 120, 92, 70, Math.max(e, .7), .32 + Math.random() * .3);
    }
    function push(c, r, R, G, B, e, sz) {
      var m = e * .55;                                                     /* the further out, the more it leans to Bachs indigo */
      var col = 'rgb(' + Math.round(R + (69 - R) * m) + ',' + Math.round(G + (91 - G) * m) + ',' + Math.round(B + (209 - B) * m) + ')';
      var x = tx + c * g, y = ty + r * g, ang = Math.atan2(y - (ty + th * .4), x - (tx + tw / 2)) + (Math.random() - .5) * 1.2, d = (90 + Math.random() * 380) * dpr;
      dots.push({ x: x, y: y, sx: x + Math.cos(ang) * d, sy: y + Math.sin(ang) * d, s: g * sz, c: col, e: e, dl: Math.random() * .55 + e * .25, a: 1 });
    }
    /* the ground: a thin line of dark pixels under the trunk */
    ground = []; var gy = ty + th - g * .4;
    for (var gx = tx + tw * .12; gx < tx + tw * .88; gx += g) { var q = 1 - Math.abs((gx - (tx + tw / 2)) / (tw * .38)); if (Math.random() < q * 1.1) ground.push({ x: gx, y: gy + (Math.random() < .3 ? g : 0), s: g * (.35 + q * .45), a: .25 + q * .6 }); }
  }
  var ctx = cv.getContext('2d');
  function draw(now) {
    var t = reduce ? 9 : (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = ss(1.1, 2.2, t); ctx.drawImage(trunk, tx, ty); ctx.drawImage(crisp, tx, ty); ctx.globalAlpha = 1;
    var settled = t > 2.6;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i], p = ss(0, 1, (t - d.dl) / 1.25), x = d.sx + (d.x - d.sx) * p, y = d.sy + (d.y - d.sy) * p;
      if (settled && Math.random() < .02) d.a = .45 + Math.random() * .55;   /* a quiet shimmer at the edges */
      var fade = 1 - ss(1.2, 2.4, t) * (1 - d.e) * .92;                    /* inside, the photo takes over from the pixels */
      ctx.globalAlpha = Math.min(1, p * 1.6) * fade * (settled ? d.a : 1); ctx.fillStyle = d.c; ctx.fillRect(x, y, d.s, d.s);
    }
    ctx.fillStyle = 'rgb(52,40,32)';
    for (var j = 0; j < ground.length; j++) { var gq = ground[j]; ctx.globalAlpha = gq.a * ss(.6, 1.6, t); ctx.fillRect(gq.x, gq.y, gq.s, gq.s * .7); }
    ctx.globalAlpha = 1;
    if (!reduce && live) raf = requestAnimationFrame(settled ? function (n) { setTimeout(function () { draw(n); }, 70); } : draw);
  }
  img.onload = function () { build(); t0 = performance.now(); draw(t0);
    new IntersectionObserver(function (es) { live = es[0].isIntersecting; cancelAnimationFrame(raf); if (live) raf = requestAnimationFrame(draw); }).observe(cv);
    var rw; addEventListener('resize', function () { clearTimeout(rw); rw = setTimeout(function () { build(); t0 = performance.now() - 9000; }, 150); }); };
  img.src = cv.getAttribute('data-src');
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* payouts rise one by one from the bottom right; each new one pushes the stack up a step, and the stack stops at 60% */
  var box = document.getElementById('pns'); if (!box) return;
  var P = [].slice.call(box.querySelectorAll('.pn')).reverse(), shown = 0, done = false;   /* the last pill (Efua) lands first, at the bottom */
  var step = 0, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function layout() { var h = P[0].offsetHeight + 10;
    P.forEach(function (p, k) { var up = shown - 1 - k; p.style.bottom = (24 + Math.max(0, up) * h) + 'px'; p.style.right = 'calc(28px + ' + Math.max(0, up) * 5 + '%)'; }); }
  function next() { if (shown >= P.length) { done = true; return; } P[shown].classList.add('on'); shown++; layout(); setTimeout(next, 900); }
  /* the old ticker may have toggled classes; take over */
  P.forEach(function (p) { p.classList.remove('on'); });
  if (reduce) { shown = P.length; P.forEach(function (p) { p.classList.add('on'); }); layout(); return; }
  new IntersectionObserver(function (es, o) { if (es[0].isIntersecting && !shown) { next(); o.disconnect(); } }, { threshold: .4 }).observe(box);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* a demo that plays itself: someone pays on the checkout by bank transfer, then the merchant sees it land in the dashboard */
  var st = document.getElementById('sm-stage'), win = document.getElementById('sm-win'), app = win && win.querySelector('.q-app'), co = document.getElementById('pc'), cur = document.getElementById('sm-cur'), toast = document.getElementById('sm-toast');
  if (!st || !app || !co) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, visible = false, wake = null, gen = 0;

  function fit() {
    var W = st.clientWidth, mob = innerWidth <= 900, wi = mob ? 16 : Math.round(Math.max(28, W * .047)), k = (W - wi * (mob ? 1 : 2)) / 1280;
    if (mob) k = Math.max(k, .44);
    var wt = mob ? 300 : Math.round(Math.max(56, W * .07));
    st.style.setProperty('--wi', wi + 'px'); st.style.setProperty('--wt', wt + 'px'); st.style.setProperty('--k', k.toFixed(4)); app.style.setProperty('--k', k.toFixed(4));
    if (!mob) st.style.height = Math.round(wt + 760 * k * .82) + 'px'; else st.style.height = '';
  }
  fit(); addEventListener('resize', fit);

  /* the revenue chart, drawn the same way as the real dashboard */
  var D = [6, 9, 18, 7, 3, 2, 4, 5, 1, 10, 40, 70, 22, 0, 0, 0, 84, 58, 18, 8, 96, 14, 6, 5, 4, 1, 12, 3, 16, 9, 20, 32, 66];
  var svg = app.querySelector('.q-chart'), CW = 640, CH = 210, pts = D.map(function (v, i) { return [i / (D.length - 1) * CW, CH - 6 - v / 100 * (CH - 16)]; }), d = 'M' + pts[0];
  for (var i = 0; i < pts.length - 1; i++) { var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + Math.min(CH - 6, p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + Math.min(CH - 6, p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1); }
  var line = svg.querySelector('.q-line'), area = svg.querySelector('.q-area'), grid = svg.querySelector('.q-grid');
  line.setAttribute('d', d); area.setAttribute('d', d + ' L' + CW + ',' + CH + ' L0,' + CH + 'Z');
  if (!grid.childNodes.length) for (var x = 0; x <= 7; x++) grid.insertAdjacentHTML('beforeend', '<line x1="' + x * CW / 7 + '" x2="' + x * CW / 7 + '" y1="0" y2="' + CH + '"/>');

  var big = app.querySelector('.q-big'), rows = app.querySelector('#q-payrows'), navs = app.querySelectorAll('.q-ni[data-pg]'), pages = app.querySelectorAll('.q-pg');
  var rp = app.querySelector('.q-rp');
  function show(k) { navs.forEach(function (n) { n.classList.toggle('on', n.dataset.pg === k); }); pages.forEach(function (p) { p.classList.toggle('on', p.dataset.pg === k); }); }
  function money(v) { var w = Math.floor(v).toLocaleString('en-US'), c = Math.round((v % 1) * 100).toString().padStart(2, '0'); return '<span class="q-amt">₦' + w + '<sup>.' + c + '</sup></span>'; }
  function countTo(from, to, ms) { var t0 = performance.now(); (function f(t) { var q = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - q, 3); big.innerHTML = money(from + (to - from) * e); if (q < 1) requestAnimationFrame(f); })(t0); }

  function sleep(ms) { var g = gen; return new Promise(function (res, rej) { (function tick(left) {
    if (g !== gen) return rej('stop');
    if (!visible) { wake = function () { tick(left); }; return; }
    var t = Math.min(left, 120); setTimeout(function () { left -= t; left <= 0 ? res() : tick(left); }, t); })(ms); }); }
  function point(el, dx, dy) { var r = el.getBoundingClientRect(), s = st.getBoundingClientRect();
    cur.style.setProperty('--cx', (r.left - s.left + r.width * (dx == null ? .5 : dx)) + 'px'); cur.style.setProperty('--cy', (r.top - s.top + r.height * (dy == null ? .55 : dy)) + 'px'); }
  function tap(el) { cur.classList.remove('tap'); cur.offsetWidth; cur.classList.add('tap'); if (el) { el.classList.add('press'); setTimeout(function () { el.classList.remove('press'); }, 160); } }
  function view(name) { co.querySelectorAll('.pc-v').forEach(function (v) { v.classList.toggle('on', v.classList.contains('pc-' + name)); }); }
  function park() { cur.style.setProperty('--cx', (st.clientWidth * .82) + 'px'); cur.style.setProperty('--cy', (st.clientHeight * .9) + 'px'); }

  function reset() {
    win.classList.remove('up'); co.classList.remove('out'); view('pick'); co.querySelectorAll('.pc-m').forEach(function (m) { m.classList.remove('sel'); });
    toast.classList.remove('on'); var f = rows.querySelector('.fresh'); if (f) f.remove(); show('pay'); big.innerHTML = money(3013745.47);
    rp.querySelector('.q-ini').textContent = 'EO'; rp.querySelector('.q-rpi b').textContent = 'Emeka Obi'; rp.querySelector('.q-rpi em').textContent = 'emeka@obi.design'; rp.querySelector('.q-paid').textContent = '₦16,616.02'; rp.querySelector('.q-when').textContent = 'May 8, 12:28 PM';
    park(); cur.style.opacity = '1';
  }
  async function film() {
    reset();
    await sleep(1100);
    var bank = co.querySelector('[data-m="bank"]'); point(bank, .3); await sleep(1000); tap(bank); bank.classList.add('sel');
    await sleep(650); view('bank');
    var sent = document.getElementById('pc-sent'); await sleep(900); point(sent, .55); await sleep(1100); tap(sent);
    await sleep(250); view('wait'); park();
    await sleep(2100); view('done');
    await sleep(2000); co.classList.add('out');
    await sleep(350); win.classList.add('up');
    await sleep(900);
    var r = document.createElement('div'); r.className = 'q-tr fresh';
    r.innerHTML = '<span class="q-b">₦45,000.00</span><span><span class="q-st succeeded">Succeeded</span></span><span>Bank transfer</span><span>Ada Okafor</span><span class="q-mut">Just now</span>';
    rows.insertBefore(r, rows.firstChild); toast.classList.add('on');
    await sleep(2200); toast.classList.remove('on');
    var home = app.querySelector('.q-ni[data-pg="home"]'); point(home, .3); await sleep(1000); tap(home); show('home');
    rp.querySelector('.q-ini').textContent = 'AO'; rp.querySelector('.q-rpi b').textContent = 'Ada Okafor'; rp.querySelector('.q-rpi em').textContent = 'ada@okafor.studio'; rp.querySelector('.q-paid').textContent = '₦45,000.00'; rp.querySelector('.q-when').textContent = 'Just now';
    if (line.animate) { line.animate([{ strokeDasharray: '2400 2400', strokeDashoffset: 2400 }, { strokeDasharray: '2400 2400', strokeDashoffset: 0 }], { duration: 1500, easing: 'cubic-bezier(.3,.7,.2,1)' }); }
    countTo(3013745.47, 3058745.47, 1300);
    await sleep(1600); point(rp, .5, .55); await sleep(2200);
    var balN = app.querySelector('.q-ni[data-pg="bal"]'); point(balN, .3); await sleep(1000); tap(balN); show('bal');
    await sleep(2600); park(); await sleep(600);
    win.classList.remove('up'); await sleep(1100);
    film();
  }
  function start() { gen++; film().catch(function () {}); }
  if (reduce) { win.classList.add('up'); co.classList.add('out'); cur.style.display = 'none'; show('home'); return; }
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && wake) { var w = wake; wake = null; w(); } }, { threshold: .2 }).observe(st);
  start();
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* startups: put each customer's mark in the middle of its card */
  var cells = document.querySelectorAll('#cu-grid .cu-cell');
  document.querySelectorAll('.sx-c').forEach(function (c) {
    var k = +c.getAttribute('data-logo'), cell = cells[k], box = c.querySelector('.sx-img'); if (!cell || !box || box.querySelector('.sx-mark')) return;
    var mark = document.createElement('span'); mark.className = 'sx-mark'; var lg = cell.querySelector('.lg'), node;
    if (lg.classList.contains('lg-px')) { node = new Image(); node.src = '/landing/assets/c3ecf1595517.png'; node.alt = ''; }
    else if (lg.classList.contains('lg-brim')) node = lg.querySelector('svg').cloneNode(true);
    else if (lg.classList.contains('lg-cc')) node = lg.querySelector('img').cloneNode(true);
    else { node = lg.cloneNode(true); mark.classList.add('word'); }
    mark.appendChild(node); box.appendChild(mark);
    var nm = document.createElement('span'); nm.className = 'sx-name'; nm.textContent = cell.getAttribute('aria-label'); box.appendChild(nm);
  });
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function seen(el, fn, th) { if (!el) return; new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { o.disconnect(); fn(); } }, { threshold: th || .4 }).observe(el); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function aim(cur, host, el, dx, dy) { var r = el.getBoundingClientRect(), h = host.getBoundingClientRect(); cur.style.setProperty('--cx', (r.left - h.left + r.width * (dx == null ? .5 : dx)) + 'px'); cur.style.setProperty('--cy', (r.top - h.top + r.height * (dy == null ? .55 : dy)) + 'px'); }
  function tap(cur) { cur.classList.remove('tap'); cur.offsetWidth; cur.classList.add('tap'); }

  /* invoice: fills itself in, gets stamped paid, then starts a fresh one */
  var rc = document.getElementById('rc');
  if (rc) { var F = rc.querySelectorAll('[data-f]');
    async function rcLoop() { while (true) { F.forEach(function (f) { f.classList.remove('f'); }); rc.classList.remove('paid'); await wait(700);
      for (var i = 0; i < F.length; i++) { F[i].classList.add('f'); await wait(420); } await wait(500); rc.classList.add('paid'); await wait(3200); } }
    if (reduce) { F.forEach(function (f) { f.classList.add('f'); }); rc.classList.add('paid'); } else seen(rc, rcLoop, .3); }

  /* spend desktop: an alert arrives, gets opened, gets approved, the window closes */
  var panel = document.querySelector('.sp-panel'), nt = document.getElementById('nt'), mw = document.getElementById('mw'), spc = document.getElementById('sp-cur');
  if (false && panel && nt && mw) {
    var tEl = document.getElementById('mb-t'); function clock() { var d = new Date(), h = d.getHours() % 12 || 12, m = ('0' + d.getMinutes()).slice(-2); tEl.textContent = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()] + ' ' + h + ':' + m; } clock(); setInterval(clock, 30000);
    var used = document.getElementById('mw-used'), bar = document.getElementById('mw-bar'), note = document.getElementById('mw-note'), yes = document.getElementById('mw-yes'), x = document.getElementById('mw-x');
    function park() { spc.style.setProperty('--cx', (panel.clientWidth * .2) + 'px'); spc.style.setProperty('--cy', (panel.clientHeight * .85) + 'px'); }
    async function spLoop() { while (true) {
      park(); mw.classList.remove('on', 'ok'); used.textContent = 'GH₵24,800'; bar.style.width = '83%'; bar.style.background = ''; note.style.visibility = '';
      await wait(900); nt.classList.add('on'); await wait(1300);
      aim(spc, panel, nt, .45, .5); await wait(1000); tap(spc); nt.classList.add('tap'); await wait(160); nt.classList.remove('on', 'tap');
      await wait(250); mw.classList.add('on'); await wait(1300);
      aim(spc, panel, yes, .5, .55); await wait(1100); tap(spc); yes.classList.add('press'); await wait(160); yes.classList.remove('press');
      mw.classList.add('ok'); used.textContent = 'GH₵34,200'; bar.style.width = '100%'; bar.style.background = '#d97706'; note.style.visibility = 'hidden';
      await wait(2600); aim(spc, panel, x, .5, .5); await wait(1000); tap(spc); await wait(150); mw.classList.remove('on'); await wait(1600); } }
    if (reduce) { mw.classList.add('on'); spc.style.display = 'none'; } else seen(panel, spLoop, .35);
  }

  /* vibe coders: the prompt types itself, the tools show up, the code arrives */
  var me = null;
  if (me) { var full = me.getAttribute('data-t'), logos = document.getElementById('ws-logos'), wb = document.getElementById('ws-b'), codes = wb.querySelectorAll('code');
    async function type() { me.textContent = ''; for (var i = 1; i <= full.length; i++) { me.textContent = full.slice(0, i); await wait(34 + Math.random() * 30); }
      await wait(350); logos.classList.add('on'); wb.classList.add('on'); for (var j = 0; j < codes.length; j++) { await wait(380); codes[j].classList.add('on'); } }
    if (reduce) { row.classList.add('on'); logos.classList.add('on'); wb.classList.add('on'); codes.forEach(function (c) { c.classList.add('on'); }); } else seen(me, type, .6); }

  /* enterprise: the entities slide past like a picker, a cursor picks one */
  var ep = null;
  if (ep) { var it = [].slice.call(ep.querySelectorAll('.ep')), idx = 0, ok = document.getElementById('ep-ok'), epc = document.getElementById('ep-cur');
    var SC = [1, .9, .8], OP = [1, .5, .2];
    function lay() { it.forEach(function (e, i) { var d = i - idx, a = Math.abs(d); e.style.transform = 'translateY(' + (d * 50 - (a ? 0 : 0)) + 'px) scale(' + (SC[a] || .7) + ')'; e.style.opacity = a > 2 ? 0 : OP[a]; e.classList.toggle('on', d === 0); e.style.zIndex = 10 - a; }); }
    lay();
    async function epLoop() { while (true) {
      epc.style.setProperty('--cx', (ep.clientWidth * .9) + 'px'); epc.style.setProperty('--cy', (ep.clientHeight * 1.05) + 'px');
      for (var s = 0; s < 3; s++) { await wait(650); idx = (idx + 1) % it.length; lay(); }
      await wait(500); aim(epc, ep, it[idx], .62, .55); await wait(1000); tap(epc); it[idx].classList.add('pk');
      ok.querySelector('b').textContent = it[idx].querySelector('b').textContent; ok.classList.add('on'); await wait(2400); ok.classList.remove('on'); it[idx].classList.remove('pk'); } }
    if (reduce) { } else seen(ep, epLoop, .5); }

  /* indie hackers: a curved lattice of tools, Node.js big and crisp in the middle */
  var ic = null;
  if (ic) { var T = [].slice.call(ic.querySelectorAll('.wi')), mx = 0, my = 0;
    function place() { var W = ic.clientWidth, H = ic.clientHeight, cx = W / 2, cy = H / 2, G = 66, R = Math.max(W, H) * .58;
      T.forEach(function (t, n) { var r = Math.floor(n / 5), c = n % 5, x = cx + (c - 2) * G + (r % 2 ? 0 : 0) + (r - 1) * 0, y = cy + (r - 1) * G * .92;
        if (r !== 1) x += G / 2 * (r === 0 ? -1 : 1) * 0;
        var dx = x - cx + mx, dy = y - cy + my, q = Math.min(1, Math.sqrt(dx * dx + dy * dy) / R), sc = (n === 7 ? 1.28 : 1.02) - q * .62, op = n === 7 ? 1 : Math.max(.08, 1 - Math.pow(q, 1.15) * 1.1);
        t.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ') rotateY(' + (dx / R * 28).toFixed(1) + 'deg) rotateX(' + (-dy / R * 24).toFixed(1) + 'deg)';
        t.style.opacity = op.toFixed(2); t.classList.toggle('c', n === 7); }); }
    place(); addEventListener('resize', place);
    if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) { var card = ic.closest('.wc');
      card.addEventListener('pointermove', function (e) { var r = ic.getBoundingClientRect(); mx = (e.clientX - r.left - r.width / 2) * -.12; my = (e.clientY - r.top - r.height / 2) * -.12; place(); });
      card.addEventListener('pointerleave', function () { mx = my = 0; place(); }); } }

  /* agents: the index follows the rows; the approval sheet rises when its row comes in */
  var rows = [], links = [];
  if (rows.length) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var id = e.target.id; links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + id); }); } }); }, { rootMargin: '-45% 0px -45% 0px' });
    rows.forEach(function (r) { io.observe(r); });
    var apw = document.querySelector('.a3-pn .apw'); if (apw) { if (reduce) apw.classList.add('up'); else seen(apw.parentNode, function () { apw.classList.add('up'); }, .45); } }
})();
} catch (e) { console.error(e); }
try {
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function seen(el, fn, th) { if (!el) return; new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { o.disconnect(); fn(); } }, { threshold: th || .4 }).observe(el); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function aim(cur, host, el, dx, dy) { var r = el.getBoundingClientRect(), h = host.getBoundingClientRect(); cur.style.setProperty('--cx', (r.left - h.left + r.width * (dx == null ? .5 : dx)) + 'px'); cur.style.setProperty('--cy', (r.top - h.top + r.height * (dy == null ? .55 : dy)) + 'px'); }
  function tap(cur) { cur.classList.remove('tap'); cur.offsetWidth; cur.classList.add('tap'); }

  /* the window buttons show their glyphs as the cursor reaches them */
  var tl = document.getElementById('mw-tl'), x = document.getElementById('mw-x');
  if (tl && x) new MutationObserver(function () {}).observe(x, { attributes: true });
  var spc = document.getElementById('sp-cur'), panel = document.querySelector('.sp-panel');
  if (spc && tl) setInterval(function () { var c = spc.getBoundingClientRect(), r = tl.getBoundingClientRect(); tl.classList.toggle('hov', c.left > r.left - 16 && c.left < r.right + 16 && c.top > r.top - 16 && c.top < r.bottom + 16); }, 100);

  /* vibe coders: a caret blinks for a beat, the prompt types itself, the answer streams in, the tools pop in while it answers */
  var me = document.getElementById('ws-me');
  if (me) { var full = me.getAttribute('data-t'), bub = me.parentNode, logos = document.getElementById('ws-logos'), wb = document.getElementById('ws-b'), codes = wb.querySelectorAll('code');
    me.textContent = full; var row = bub.parentNode;
    async function run() { var mq = innerWidth < 641; row.classList.add('on'); await wait(mq ? 250 : 900); wb.classList.add('on'); for (var j = 0; j < codes.length; j++) { await wait(mq ? 200 : 420); codes[j].classList.add('on'); if (j === 0) logos.classList.add('on'); } }
    if (reduce) { me.textContent = full; logos.classList.add('on'); wb.classList.add('on'); codes.forEach(function (c) { c.classList.add('on'); }); } else seen(me.closest('.wc'), run, innerWidth < 641 ? .08 : .55); }

  /* enterprise: an endless list that keeps sliding; now and then it settles, gets clicked, and carries on */
  var ep = document.getElementById('ent-pick');
  if (ep) { var pressEl = null, pressT = 0, it = [].slice.call(ep.querySelectorAll('.ep')), N = it.length, off = 0, ok = document.getElementById('ep-ok'), epc = document.getElementById('ep-cur'), mode = 'run', t0 = 0, last = 0, target = 0, from = 0, live = false;
    function pk(e) { if (e !== pressEl) return 1; var t = performance.now() - pressT; if (t < 110) return 1 - .06 * (t / 110); if (t < 380) { var q = (t - 110) / 270; return .94 + .06 * (1 - Math.pow(1 - q, 3)); } return 1; }
    function lay() { it.forEach(function (e, i) { var d = ((i - off) % N + N * 1.5) % N - N / 2, a = Math.abs(d), sc = Math.max(.6, 1 - a * .11) * pk(e), op = Math.max(0, 1 - a * .42);
      e.style.transform = 'translateY(' + (d * 50).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')'; e.style.opacity = op.toFixed(2); e.style.zIndex = 10 - Math.round(a); }); }
    function park() { epc.style.setProperty('--cx', (ep.clientWidth * .92) + 'px'); epc.style.setProperty('--cy', (ep.clientHeight * 1.1) + 'px'); }
    function frame(now) { if (!live) return; var dt = Math.min(50, now - (last || now)) / 1000; last = now;
      if (mode === 'run') { off += dt * .9; if (now - t0 > 2600) { mode = 'settle'; from = off; target = Math.ceil(off + .35); t0 = now; } }
      else if (mode === 'settle') { var q = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - q, 3); off = from + (target - from) * e; if (q >= 1) { mode = 'click'; click(); } }
      lay(); requestAnimationFrame(frame); }
    async function click() { var k = ((target % N) + N) % N, el = it[k]; aim(epc, ep, el, .62, .55); await wait(950); tap(epc); pressEl = el; pressT = performance.now(); el.classList.add('pk');
      ok.querySelector('b').textContent = el.querySelector('b').textContent; ok.classList.add('on'); await wait(1300); el.classList.remove('pk'); ok.classList.remove('on'); park(); mode = 'run'; t0 = performance.now(); }
    lay(); park();
    if (!reduce) new IntersectionObserver(function (es) { live = es[0].isIntersecting; if (live) { last = 0; t0 = performance.now(); requestAnimationFrame(frame); } }, { threshold: .2 }).observe(ep); }

  /* indie hackers: a full lattice of tools across the card, Node.js in focus, the rest falling away */
  var ic = document.querySelector('.wc-v.icons');
  if (ic) { var T = [].slice.call(ic.querySelectorAll('.wi')), C = T.findIndex(function (t) { return t.hasAttribute('data-c'); }), mx = 0, my = 0;
    var COLS = 7, ROWS = Math.ceil(T.length / COLS), cr = Math.floor(C / COLS), cc = C % COLS;
    function place() { var W = ic.clientWidth, H = ic.clientHeight, G = Math.max(52, Math.min(62, W / 6.2)), R = Math.max(W, H) * .62;
      T.forEach(function (t, n) { var r = Math.floor(n / COLS), c = n % COLS, x = W / 2 + (c - cc) * G + (((r - cr) % 2) ? G / 2 : 0), y = H / 2 + (r - cr) * G * .88;
        var dx = x - W / 2 + mx, dy = y - H / 2 + my, q = Math.min(1, Math.sqrt(dx * dx + dy * dy) / R), ring = Math.round(Math.sqrt((x - W / 2) * (x - W / 2) + (y - H / 2) * (y - H / 2)) / G), sc = n === C ? 1.6 : Math.max(.26, 1 - ring * .2 - q * .1), op = n === C ? 1 : Math.max(0, 1 - Math.pow(q, 1.25) * 1.05);
        t.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ') rotateY(' + (dx / R * 22).toFixed(1) + 'deg) rotateX(' + (-dy / R * 20).toFixed(1) + 'deg)';
        t.style.opacity = op.toFixed(2); t.classList.toggle('c', n === C); }); }
    place(); addEventListener('resize', place);
    if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) { var card = ic.closest('.wc'), raf = 0;
      card.addEventListener('pointermove', function (e) { var r = ic.getBoundingClientRect(); mx = (e.clientX - r.left - r.width / 2) * -.1; my = (e.clientY - r.top - r.height / 2) * -.1; cancelAnimationFrame(raf); raf = requestAnimationFrame(place); });
      card.addEventListener('pointerleave', function () { mx = my = 0; place(); }); } }

  /* agents: the scene is pinned; scrolling moves through the three steps */
  var a4 = document.getElementById('a4');
  if (a4) { var scenes = a4.querySelectorAll('.a4-scene'), lis = a4.querySelectorAll('.a4-steps li'), cur = -1, runs = [null, null, null];
    var ak = document.getElementById('ak'), fs = ak.querySelectorAll('.ak-f'), chs = ak.querySelectorAll('.ak-ch b'), kbtn = ak.querySelector('.ak-btn'), key = ak.querySelector('.ak-key'), keyGen = 0;
    async function keyRun() { var g = ++keyGen; fs.forEach(function (f) { f.textContent = ''; f.classList.remove('on'); }); chs.forEach(function (c) { c.classList.remove('on'); }); key.classList.remove('on');
      await wait(700); for (var i = 0; i < fs.length; i++) { var v = fs[i].getAttribute('data-v'); fs[i].classList.add('on'); for (var k = 1; k <= v.length; k++) { if (g !== keyGen) return; fs[i].textContent = v.slice(0, k); await wait(70); } await wait(250); fs[i].classList.remove('on'); }
      for (var c = 0; c < chs.length; c++) { if (g !== keyGen) return; await wait(260); chs[c].classList.add('on'); }
      await wait(450); kbtn.classList.add('press'); await wait(150); kbtn.classList.remove('press'); await wait(200); key.classList.add('on'); }

    /* the key form fills in as you scroll: each field types, then the ticks, then the key appears */
    var kLens = [].map.call(fs, function (f) { return f.getAttribute('data-v').length; }), kTot = kLens.reduce(function (a, b) { return a + b; }, 0) + chs.length * 6 + 10;
    function keyAt(q) { keyGen++; var u = q * kTot, i, n;
      for (i = 0; i < fs.length; i++) { var v = fs[i].getAttribute('data-v'); n = Math.max(0, Math.min(v.length, Math.floor(u))); fs[i].textContent = v.slice(0, n); fs[i].classList.toggle('on', u > 0 && u < v.length); u -= v.length; }
      for (i = 0; i < chs.length; i++) { chs[i].classList.toggle('on', u >= 6 * (i + 1) - 3); } u -= chs.length * 6;
      kbtn.classList.toggle('press', u > 3 && u < 6); key.classList.toggle('on', u >= 6); }
    var kQ = 0, kTarget = 0, kRaf = 0, kLast = 0;
    function keyTo(q) { kTarget = q; if (!kRaf) { kLast = performance.now(); kRaf = requestAnimationFrame(keyStep); } }
    function keyStep(now) { var dt = Math.min(64, now - kLast); kLast = now;
      var fwd = dt / 70 / kTot, back = dt / 18 / kTot;   /* about 14 characters a second forward, faster when you scroll back */
      kQ = kTarget > kQ ? Math.min(kTarget, kQ + fwd) : Math.max(kTarget, kQ - back);
      keyAt(kQ); kRaf = kQ === kTarget ? 0 : requestAnimationFrame(keyStep); }
    var list = document.getElementById('al-list'), EV = [['checkout.create', '$350.00', 'Done'], ['balance.read', '₦4.78M', 'Done'], ['payout.send', '₦180,000', 'Sent'], ['checkout.create', '₦45,000', 'Done'], ['payout.send', '₦350,000', 'Waiting'], ['balance.read', 'GH₵12,400', 'Done']], ei = 0, logT = null;
    function logStep() { var e = EV[ei++ % EV.length], d = new Date(), r = document.createElement('div'); r.className = 'al-r';
      r.innerHTML = '<time>' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2) + '</time><code>' + e[0] + '</code><span>' + e[1] + '</span><b class="' + (e[2] === 'Waiting' ? 'w' : '') + '">' + e[2] + '</b>';
      list.insertBefore(r, list.firstChild); while (list.children.length > 7) list.removeChild(list.lastChild); logT = setTimeout(logStep, 900); }
    var apw = a4.querySelector('.apw'), apc = a4.querySelector('#a4-cur'), apy = a4.querySelector('#apw-y'), apS = a4.querySelector('.s2'), apGen = 0;
    function apReset() { apGen++; apw.classList.remove('ok'); apy.textContent = 'Approve'; apc.style.transition = 'none'; apc.style.setProperty('--cx', (apS.clientWidth * .97) + 'px'); apc.style.setProperty('--cy', (apS.clientHeight * 1.04) + 'px'); apc.offsetWidth; apc.style.transition = ''; }
    async function apRun() { apReset(); var g = apGen; await wait(900); if (g !== apGen) return; aim(apc, apS, apy, .5, .55); await wait(1150); if (g !== apGen) return;
      tap(apc); apy.classList.add('press'); await wait(170); apy.classList.remove('press'); apw.classList.add('ok'); apy.textContent = '✓ Approved'; }
    function show(k) { if (k === cur) return; cur = k; scenes.forEach(function (s, i) { s.classList.toggle('on', i === k); }); lis.forEach(function (l, i) { l.classList.toggle('on', i === k); });
      clearTimeout(logT); if (k === 2) apRun(); else apReset(); if (k === 0 && mob.matches) keyRun(); if (k === 1) { if (!list.children.length) for (var i = 0; i < 3; i++) { logStep(); clearTimeout(logT); } logT = setTimeout(logStep, 700); } }
    var mob = matchMedia('(max-width: 640px)'), mT = null, mK = 0;
    function mobCycle() { show(mK); var d = [7600, 6200, 5600][mK]; mK = (mK + 1) % 3; mT = setTimeout(mobCycle, d); }
    function onScroll() { var r = a4.getBoundingClientRect(), vh = innerHeight;
      if (mob.matches) { var inV = r.top < vh * .7 && r.bottom > vh * .25;
        if (inV && !mT) { mK = 0; cur = -1; mobCycle(); } else if (!inV && mT) { clearTimeout(mT); mT = null; cur = -1; clearTimeout(logT); keyGen++; apGen++; } return; }
      if (r.top > vh * .6 || r.bottom < 0) { if (cur !== -1) { cur = -1; clearTimeout(logT); keyGen++; apGen++; } return; }
      var span = a4.offsetHeight - vh, p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0; show(p < .34 ? 0 : p < .68 ? 1 : 2); if (p < .34) keyTo(Math.min(1, p / .3)); }
    var tick = false; function sched() { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; onScroll(); }); } }
    addEventListener('scroll', sched, { passive: true }); addEventListener('resize', sched); onScroll(); }
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* the chat page: your question goes in as the first message, the answer reads back, and links point you to where to start */
  var chat = document.getElementById('chat'), col = document.getElementById('ch-col'), scr = document.getElementById('ch-scroll'), cf = document.getElementById('ch-f'), ci = document.getElementById('ch-i');
  var f = document.getElementById('ask-f'), inp = document.getElementById('ask-in'); if (!chat || !f) return;
  var P = {
    checkout: ['Hosted checkout', 'Customers pay by card, bank transfer, mobile money or stablecoins on one page.', '#bento'],
    links: ['Payment links', 'Get paid with a link, with no code and no website needed.', '#bento'],
    subs: ['Subscriptions', 'Charge customers every month, with an invoice for each charge.', '#bento'],
    invoices: ['Invoices', 'Send an invoice and see when it is paid.', '#bento'],
    payouts: ['Balances and payouts', 'Hold money in each currency and withdraw it to your bank.', '#bento'],
    stable: ['Stablecoins', 'Accept USDT and USDC and settle into your account.', '#bento'],
    spend: ['Spend controls', 'Budgets and approvals for money going out.', '#enterprise'],
    agents: ['Agent keys', 'Let an AI agent make payments within limits you set.', '#agents'],
    api: ['The API', 'One API for every way your customers pay.', '#developers']
  };
  var RULES = [
    [/market|platform|seller|vendor|driver|rider|creator|host/, ['checkout', 'payouts', 'api'], 'a platform that pays other people', 'Since you pay sellers or creators, moving money out matters as much as taking it in.'],
    [/saas|subscri|software|app|member|course|school|tuition|student|coach/, ['subs', 'checkout', 'invoices'], 'a business that bills on a schedule', 'You set the plan once, and every charge gets its own invoice.'],
    [/shop|store|ecommerce|e-commerce|woo|wordpress|fashion|retail|food|restaurant|product/, ['checkout', 'links', 'payouts'], 'a shop', 'A shop needs one thing first: an easy way to pay, by bank transfer, mobile money or card, all on one page.'],
    [/freelanc|agency|consult|design|studio|service|contract/, ['invoices', 'links', 'checkout'], 'a service business', 'Services usually get paid by invoice or by link, so you can start without building anything.'],
    [/crypto|usdt|usdc|stable|web3|token/, ['stable', 'checkout', 'payouts'], 'a business that takes stablecoins', 'Customers can pay in USDT or USDC, and you settle into your account in the currency you want.'],
    [/agent|ai |ai$|llm|automat|bot/, ['agents', 'api', 'checkout'], 'a business with AI agents', 'Each agent gets its own key and a limit. Anything over the limit waits for your approval.'],
    [/team|company|enterprise|finance|expense|budget|spend/, ['spend', 'payouts', 'checkout'], 'a growing company', 'Budgets and approvals keep spending in check while money keeps coming in from anywhere.']];
  function pick(q) { var t = ' ' + q.toLowerCase() + ' '; for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t)) return RULES[i]; return [null, ['checkout', 'links', 'payouts'], 'a business getting paid online', 'A checkout page or a payment link is the quickest start. Both take bank transfer, mobile money, cards and stablecoins.']; }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function down() { scr.scrollTo({ top: scr.scrollHeight, behavior: 'smooth' }); }
  function user(t) { var d = document.createElement('div'); d.className = 'ch-u'; d.textContent = t; col.appendChild(d); down(); }
  function words(el, text, base) { var w = text.split(' '); w.forEach(function (x, i) { var s = document.createElement('span'); s.className = 'ch-w'; s.style.animationDelay = (base + i * 28) + 'ms'; s.textContent = x + ' '; el.appendChild(s); }); return base + w.length * 28; }
  function bot(q, first) {
    var r = pick(q), a = document.createElement('div'); a.className = 'ch-a'; a.innerHTML = '<i class="ch-av"></i><div class="ch-b"></div>'; col.appendChild(a); var b = a.querySelector('.ch-b');
    var p1 = document.createElement('p'); b.appendChild(p1); var t = words(p1, 'That sounds like ' + r[2] + '. ' + r[3], 350);
    var p2 = document.createElement('p'); b.appendChild(p2); t = words(p2, 'Here is where I would start:', t + 100);
    var cards = document.createElement('div'); cards.className = 'ch-cards'; b.appendChild(cards);
    r[1].forEach(function (k, i) { var x = P[k], l = document.createElement('a'); l.href = x[2]; l.style.animationDelay = (t + 150 + i * 160) + 'ms'; l.innerHTML = '<div><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5 10.5 8 6 12.5"/></svg>'; cards.appendChild(l); });
    if (first) { var c = document.createElement('div'); c.className = 'ch-cta'; c.style.animationDelay = (t + 150 + r[1].length * 160 + 100) + 'ms'; c.innerHTML = '<a class="btn btn-plain" href="https://app.bachs.io/signup">Get started</a><a class="btn btn-text" href="https://cal.com/collins-uzuegbu-gvs5s7/bachsintro">Talk to sales</a>'; b.appendChild(c); }
    down(); setTimeout(down, t + 600);
  }
  function openChat(q) {
    col.innerHTML = ''; chat.hidden = false; chat.setAttribute('aria-hidden', 'false'); document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { chat.classList.add('on'); }); try { history.pushState({ chat: 1 }, '', '#chat'); } catch (e) {}
    user(q); setTimeout(function () { bot(q, true); }, 500); ci.value = '';
  }
  function closeChat(fromPop) {
    if (chat.hidden) return; chat.classList.remove('on'); document.documentElement.style.overflow = '';
    setTimeout(function () { chat.hidden = true; chat.setAttribute('aria-hidden', 'true'); }, 300);
    if (!fromPop) { try { if (location.hash === '#chat') history.back(); } catch (e) {} }
  }
  f.addEventListener('submit', function (e) { e.preventDefault(); e.stopImmediatePropagation(); var q = inp.value.trim(); if (!q) { inp.focus(); return; } inp.value = ''; inp.blur(); var ask = document.getElementById('ask'); ask.classList.remove('open', 'peek'); openChat(q); }, true);
  cf.addEventListener('submit', function (e) { e.preventDefault(); var q = ci.value.trim(); if (!q) return; ci.value = ''; user(q); setTimeout(function () { bot(q, false); }, 450); });
  document.getElementById('ch-x').addEventListener('click', function () { closeChat(false); });
  document.getElementById('ch-home').addEventListener('click', function (e) { e.preventDefault(); closeChat(false); });
  chat.addEventListener('click', function (e) { var a = e.target.closest('.ch-cards a'); if (!a) return; e.preventDefault(); var id = a.getAttribute('href'); closeChat(false); setTimeout(function () { var el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 340); });
  addEventListener('popstate', function () { closeChat(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeChat(false); });
  /* touch: tapping the blob opens it for typing */
  var bar = document.getElementById('ask-f'), ask = document.getElementById('ask');
  bar.addEventListener('click', function () { ask.classList.add('peek', 'open'); inp.focus(); });
})();
} catch (e) { console.error(e); }
try {
(function () {
  var ivf = document.getElementById('ivf'); if (!ivf) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S = [[1000, ''], [700, 'open'], [520, 'open hl2'], [600, 'picked'], [160, 'picked press'], [1500, 'picked busy'], [900, 'picked done'], [1300, 'picked done copied'], [3200, 'picked done copied paid']], i = 0, t = null, on = false;
  function step() { var x = S[i]; ivf.className = ('lf ' + x[1]).trim(); i = (i + 1) % S.length; t = setTimeout(step, x[0]); }
  if (reduce) { ivf.className = 'lf picked done copied paid'; return; }
  new IntersectionObserver(function (es) { if (es[0].isIntersecting && !on) { on = true; i = 0; step(); } else if (!es[0].isIntersecting && on) { on = false; clearTimeout(t); } }, { threshold: .3 }).observe(ivf);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* invoice ledger: every month a new invoice appears, goes from Open to Paid, and the oldest slides away */
  var list = document.getElementById('ivl-list'); if (!list) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], n = 39, mi = 3, yr = 2026, t = null, on = false;
  var DOC = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3.5H7A2.5 2.5 0 0 0 4.5 6v12A2.5 2.5 0 0 0 7 20.5h10a2.5 2.5 0 0 0 2.5-2.5V9z"/><path d="M14 3.5V9h5.5M8.5 13h7M8.5 16.5h5"/></svg>';
  var CK = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5 10 16.5 18 8"/></svg>';
  function row(paid, anim) {
    var r = document.createElement('div'); r.className = 'ivl-r' + (anim ? ' in' : '');
    r.innerHTML = '<i class="ivl-ic">' + DOC + '</i><span><b>INV-00' + (n++) + '</b><em>' + M[mi] + ' 28, ' + yr + '</em></span><span class="ivl-a">$158.00</span><span class="ivl-s ' + (paid ? 'paid' : 'open') + '">' + (paid ? CK + ' Paid' : 'Open') + '</span>';
    mi++; if (mi > 11) { mi = 0; yr++; } return r;
  }
  for (var k = 0; k < 4; k++) list.insertBefore(row(true, false), list.firstChild);
  function tick() {
    var r = row(false, true); list.insertBefore(r, list.firstChild);
    setTimeout(function () { var s = r.querySelector('.ivl-s'); s.className = 'ivl-s paid'; s.innerHTML = CK + ' Paid'; }, 1300);
    while (list.children.length > 5) { var o = list.lastChild; o.classList.add('out'); (function (x) { setTimeout(function () { x.remove(); }, 400); })(o); break; }
    t = setTimeout(tick, 3000);
  }
  if (reduce) return;
  new IntersectionObserver(function (es) { if (es[0].isIntersecting && !on) { on = true; t = setTimeout(tick, 900); } else if (!es[0].isIntersecting && on) { on = false; clearTimeout(t); } }, { threshold: .3 }).observe(list);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* the quiet currency list: one row lights up at a time */
  var rows = document.querySelectorAll('.sm-ccy li'); if (!rows.length) return;
  var i = 0; rows[0].classList.add('on');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setInterval(function () { rows[i].classList.remove('on'); i = (i + 1) % rows.length; rows[i].classList.add('on'); }, 1800);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* announcement bar: the nav sits under it, then slides up as it scrolls away */
  var bar = document.getElementById('announce'); if (!bar) return;
  function off() { document.documentElement.style.setProperty('--bar-off', Math.max(0, bar.offsetHeight - window.scrollY) + 'px'); }
  off(); addEventListener('scroll', off, { passive: true }); addEventListener('resize', off);
})();
(function () {
  /* hero dots: a field of small points that drift in slow loops, with what Bachs does floating through */
  var pn = document.getElementById('sm-dots'); if (!pn) return;
  var cv = pn.querySelector('canvas'), ctx = cv.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MX = -1e4, MY = -1e4, W = 0, H = 0, D = [], raf = 0, vis = false, PAL = ['69,91,209', '104,110,236', '140,150,250', '181,190,252'];
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function layout() {
    W = pn.clientWidth; H = pn.clientHeight; var dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    D = []; var N = Math.round(Math.min(1500, W * H / 200));
    while (D.length < N) {
      var x = Math.random() * W, y = Math.random() * H, u = x / W, v = y / H;
      var dens = Math.min(1, Math.max(0, (u - .05) / .5)) * (1 - Math.pow((v - .5) * 1.7, 2) * .6);
      if (Math.random() > dens) continue;
      D.push({ bx: x, by: y, rx: rnd(4, 26), ry: rnd(4, 26), ph: rnd(0, 6.28), sp: rnd(.12, .42) * (Math.random() < .5 ? -1 : 1), r: rnd(.9, 2.3), c: PAL[(Math.random() * PAL.length) | 0], a: rnd(.4, .95), tw: rnd(.4, 1.4), ox: 0, oy: 0 });
    }
  }
  function frame(now) {
    var t = now / 1000; ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < D.length; i++) {
      var d = D[i], x = d.bx + d.rx * Math.cos(d.ph + t * d.sp), y = d.by + d.ry * Math.sin(d.ph * 1.3 + t * d.sp * 1.1), a = d.a * (.65 + .35 * Math.sin(t * d.tw + d.ph));
      var ddx = x - MX, ddy = y - MY, dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1, tx = 0, ty = 0; if (dd < 95) { var f = Math.pow(1 - dd / 95, 2) * 48; tx = ddx / dd * f; ty = ddy / dd * f; }
      d.ox += (tx - d.ox) * .14; d.oy += (ty - d.oy) * .14;
      ctx.fillStyle = 'rgba(' + d.c + ',' + a.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(x + d.ox, y + d.oy, d.r, 0, 6.2832); ctx.fill();
    }
    raf = (vis && !reduce) ? requestAnimationFrame(frame) : 0;
  }
  var heroEl = document.getElementById('hero');
  heroEl.addEventListener('pointermove', function (e) { var r = pn.getBoundingClientRect(); MX = e.clientX - r.left; MY = e.clientY - r.top; }, { passive: true });
  heroEl.addEventListener('pointerleave', function () { MX = MY = -1e4; });
  layout(); frame(performance.now());
  addEventListener('resize', function () { layout(); if (!raf) frame(performance.now()); });
  if (!reduce) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { threshold: 0 }).observe(pn);
})();
(function () {
  /* checkout tile: coin pins ride an arc from the lower left to the lower right, small and faint at the ends, large in the middle, and loop for ever */
  var box = document.getElementById('cn'); if (!box) return;
  var COINS = [['₦', '#ffe3c9', '#f5b98a', 'rgba(214,120,60,.45)', '#7a3b12'], ['$', '#dff3e4', '#9bd7ae', 'rgba(40,140,80,.4)', '#1c5a33'], ['₮', '#d6f2ec', '#7fd1c0', 'rgba(20,140,120,.4)', '#0d5c4f'], ['USDC', '#dbe7ff', '#9ab9f5', 'rgba(50,90,200,.4)', '#1d3f94', 1], ['₵', '#fdf0c8', '#efd27e', 'rgba(180,140,20,.4)', '#6f5410'], ['KSh', '#ece0ff', '#bfa2f2', 'rgba(110,70,200,.4)', '#47248f', 1], ['€', '#dde4ff', '#a4b2f3', 'rgba(60,80,200,.4)', '#243a9c'], ['₿', '#ffe6c2', '#f7bb6d', 'rgba(210,130,20,.45)', '#7d4607'], ['£', '#f6dcee', '#e3a3cd', 'rgba(180,60,130,.4)', '#7e1f58'], ['R', '#dcf1d6', '#a5d98f', 'rgba(70,150,40,.4)', '#2f6a17']];
  var els = COINS.map(function (c, ci) {
    var e = document.createElement('div'); e.className = 'cn-c' + (c[5] ? ' sm' : '') + ' p' + [0, 1, 2, 0, 2, 1, 0, 1, 2, 0][ci % 10]; e.style.cssText = '--c1:' + c[1] + ';--c2:' + c[2] + ';--c3:' + c[3] + ';--ink:' + c[4];
    e.innerHTML = '<span>' + c[0] + '</span>'; box.appendChild(e); return e;
  });
  var hv = els.map(function () { return 0; }), px = -999, py = -999, spd = 1, ph = 0, N = els.length, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, vis = false, raf = 0, t0 = 0, W = 0, H = 0;
  function size() { W = box.clientWidth; H = box.clientHeight; }
  function draw(off) {
    var mq = innerWidth < 641, n = mq ? 7 : N;
    for (var i = 0; i < N; i++) {
      if (i >= n) { els[i].style.opacity = 0; continue; }
      var u = (i / n + off) % 1, sn = Math.sin(Math.PI * u), xu = mq ? u - .085 * Math.sin(2 * Math.PI * u) : u, x = -.06 * W + xu * 1.12 * W, y = H * (.94 - .58 * Math.pow(sn, 1.15)),
        sc = (.5 + .62 * sn) * (mq ? .74 : Math.max(.5, Math.min(1, W / 640))), ddx = px - x, ddy = py - y, rr = 40 * sc, tg = (ddx * ddx + ddy * ddy < rr * rr * 1.2) ? 1 : 0, hh = (hv[i] += (tg - hv[i]) * .1), ang = Math.atan2(-.58 * H * 1.15 * Math.pow(sn, .15) * Math.PI * Math.cos(Math.PI * u), 1.12 * W) * .5;
      els[i].style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - 4 * hh).toFixed(1) + 'px) rotate(' + (ang * 57.3 - 2 * hh).toFixed(1) + 'deg) scale(' + (sc * (1 + .05 * hh)).toFixed(3) + ')';
      els[i].style.opacity = Math.min(1, Math.pow(sn, .7) * 1.15).toFixed(3); els[i].style.zIndex = Math.round(sn * 100) + (hh > .1 ? 200 : 0); els[i].style.setProperty('--sx', (-40 + 130 * hh).toFixed(1) + '%');
    }
  }
  function frame(now) { if (!t0) t0 = now; var dt = Math.min(50, now - (frame.l || now)) / 1000; frame.l = now; spd += ((px > -900 ? .25 : 1) - spd) * .08; ph = (ph + dt * .028 * spd) % 1; draw(ph); raf = (vis && !reduce) ? requestAnimationFrame(frame) : 0; }
  size(); draw(.02); addEventListener('resize', function () { size(); draw(.02); });
  box.addEventListener('pointermove', function (e) { var r = box.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; });
  box.addEventListener('pointerleave', function () { px = py = -999; });
  if (!reduce) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { threshold: 0 }).observe(box);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* the globe: land drawn in dots, turning slowly; payments arc between cities and land with the amount */
  var box = document.getElementById('g-globe'); if (!box) return;
  var cv = box.querySelector('canvas'), ctx = cv.getContext('2d'), chipsEl = box.querySelector('.g-chips');
  var LITE = !!box.closest('.lite'), LM = {"w":200,"h":100,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7//Pu/AAAAAAAAAAAAAAAAAAAAAAAAAMD33////wMAwAdAAACABwAAAAAAAAAAAABo/vv///8BADgBAAAAADAAAAAAAAAAAACHkP/g////AAAAAAAAAwDwAwAAAAAAAAAAYIB+APD//wEAAAAAGADw/wMAAgAAAAAAgC+zbQPg/38AAAAAAAYI/v//BwAAAAEgAID4w/kPgP//AAAACPz//////////z8A/n/+++dzfAD/PwAAwH8AwOz/AQAAAAAE/P///////////////w8AaAAAAAAAAAAAAOH///////////////8HgwMAAAAAAAAAAAAA+P////9z8IAfAAcAfv7+//////////9/AP//////gA4ADwAAgD//////////////P4B/+///fwAeAAgAAIA/8///////////wwUAYID///8AvgEAAACCHf7/////////BzAAABgA/P//B/4DAAAABhr//////////wF4AAACAPj//z//DwAAAAeC/////////38APAAAAAD0//8//x8AAICP////////////DxgAAAAA4P////8fAAAA3P///////////wsAAAAAAMD///9/EAAAAPD///////////8LAAAAAACA/////3gAAAD8////////////AQAAAAAAgP////8FAAAA+P8ffvz//////wEAAAAAAID///+/AAAAAPjnDzz//////38YAAAAAACA////HwAAAIA/zAd4/v////8fDAAAAAAAgP///wcAAACAD7Dx//7///9/DwQAAAAAAID///8BAAAAgA8A+X/8////HwQEAAAAAAAA////AwAAAACHA/n//P////8MAwAAAAAAAP7//wMAAAAA/gNE//////8/7AMAAAAAAAD4//8AAAAAgP8DAP//////f1AAAAAAAAAA6P9/AAAAAID/n4f///////8QAAAAAAAAAPD/QwAAAACA////f///////AAAAAAAAAADQP0AAAAAA4P//P3/+////fwAAAAAAAAAAgD8AAAAAAPD//3//8f///38AAAAAAAAAAEA/AAAAAAD4/////g3+//+/AAAAAAAAAAAAPuAAAAAA+P////wf+L//DwAAAAAAAAAAAD4MAgAAAPj////9H/CPfwAAAAAAAAAAAAB8BjAAAAD4////+Q/wB38BAAAAAAAAAAAA8AcAAAAA+P////MH4AN/gAAAAAAAAAAAAAA/AAAAAPj////zAeAA/IAAAAAAAAAAAAAAPAAAAAD4////NwDAAfgBAQAAAAAAAAAAADAAAAAA+P///w8AwADgAQIAAAAAAAAAAAAw7AMAAPD/////AMAAQAABAAAAAAAAAAAAAP8HAADg/////wAAAQgAAwAAAAAAAAAAAAD+DwAAwP///38AAAAQAAIAAAAAAAAAAAAA/n8AAICA/v9/AAAAFjgAAAAAAAAAAAAAAP7/AAAAAP7/PwAAADwcAAAAAAAAAAAAAAD//wAAAAD+/w8AAAAYvgAAAAAAAAAAAACA//8DAAAA/v8HAAAAMF4gAAAAAAAAAAAAAP//HwAAAP7/AwAAAHDeQAMAAAAAAAAAAID//38AAAD8/wMAAABgQIAfAQAAAAAAAACA////AQAA+P8DAAAAgAAAPgAAAAAAAAAAAP///wEAAPj/AwAAAAAuAC4QAAAAAAAAAAD///8AAAD4/wMAAAAAQABAAAAAAAAAAAAA/v9/AAAA8P8DAAAAAAAAAAAAAAAAAAAAAPz/PwAAAPj/hwAAAAAA8AgAAAAAAAAAAAD8/z8AAAD4/8cAAAAAAP4YAAAAAAAAAAAA8P8/AAAA+P/hAAAAAAD/HQAAAAAAAAAAAOD/PwAAAPj/YAAAAAAA/x8AAAAAAAAAAADg/x8AAAD4f3AAAAAA4P9/gAAAAAAAAAAA4P8fAAAA8P9wAAAAAPj//wAAAAAAAAAAAOD/AwAAAPD/MAAAAAD4//8AAAAAAAAAAADg/wEAAADwPwAAAAAA+P//AQAAAAAAAAAA4P8BAAAA4D8AAAAAAPj//wEAAAAAAAAAAPD/AAAAAOAfAAAAAADw//8BAAAAAAAAAADw/wAAAADADwAAAAAA8P//AQAAAAAAAAAA8H8AAAAAwAcAAAAAAPCB/gAAAAAAAAAAAPAPAAAAAAAAAAAAAAAAAP4AEAAAAAAAAAD4DwAAAAAAAAAAAAAAAAB8ACAAAAAAAAAA+AcAAAAAAAAAAAAAAAAAIABgAAAAAAAAAPgBAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAD4AQAAAAAAAAAAAAAAAAAgABgAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAADwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAgJ8A/v///x8AAAAAAAAAAADQAQAAAAAAwP3/h///////BwAAAAAAAAAA8AMAAADh//////P///////8DAAAAAAAcBMADAADw////////////////BwAAAP9/8P//AQAA+P///////////////wAAAPj/////HwAA4P///////////////38AAOL//////wEABv//////////////////AAAA+P////8DhA/w////////////////HwAAgP///////wH3/////////////////z8AAID/////////////////////////////AwAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="}, raw = atob(LM.bits), D = Math.PI / 180, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onLand(lat, lon) { var r = Math.min(LM.h - 1, Math.max(0, Math.floor((90 - lat) / 180 * LM.h))), c = Math.floor(((lon + 180) % 360 + 360) % 360 / 360 * LM.w), i = r * LM.w + c; return (raw.charCodeAt(i >> 3) >> (i & 7)) & 1; }
  var P = [], N = 30000, ga = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < N; i++) { var y = 1 - 2 * (i + .5) / N, th = ga * i, lat = Math.asin(y) / D, lon = ((th / D) % 360 + 540) % 360 - 180; if (lat < -58) continue; if (onLand(lat, lon)) P.push([lat * D, lon * D, Math.random()]); }
  var C = { lagos: [6.5, 3.4], accra: [5.6, -0.2], nairobi: [-1.3, 36.8], joburg: [-26.2, 28.0], cairo: [30.0, 31.2], london: [51.5, -0.1], ny: [40.7, -74.0], dubai: [25.2, 55.3], dakar: [14.7, -17.4], mumbai: [19.1, 72.9], kigali: [-1.9, 30.1], paris: [48.9, 2.3] };
  var R = [['london', 'lagos', 'ng', '₦450,000', 'Lagos'], ['ny', 'accra', 'gh', 'GH₵9,400', 'Accra'], ['dubai', 'nairobi', 'ke', 'KSh 52,000', 'Nairobi'], ['lagos', 'joburg', 'za', 'R18,500', 'Johannesburg'], ['nairobi', 'london', 'gb', '£2,300', 'London'], ['cairo', 'lagos', 'usdc', '$1,200 USDC', 'Lagos'], ['paris', 'dakar', 'sn', 'XOF 380,000', 'Dakar'], ['mumbai', 'nairobi', 'us', '$4,800', 'Nairobi'], ['ny', 'lagos', 'usdc', '$1,200 USDC', 'Lagos'], ['kigali', 'dubai', 'usdt', '$950 USDT', 'Dubai'], ['joburg', 'cairo', 'eg', 'E£ 64,000', 'Cairo']];
  var ICON = {"ng": "/landing/assets/8e0b5aced6ec.png", "gh": "/landing/assets/69e921cb2d6f.png", "ke": "/landing/assets/58788f069eca.png", "za": "/landing/assets/2c86f270ee30.png", "gb": "/landing/assets/7f2612902c7d.png", "sn": "/landing/assets/efd687c08962.png", "eg": "/landing/assets/c108c1e81fd8.png", "us": "/landing/assets/7703ed22d52e.png", "usdt": "/landing/assets/7b3ac183fbc2.svg", "usdc": "/landing/assets/ea531d13dbf0.svg"};
  var W = 0, H = 0, cx = 0, cy = 0, RAD = 0, dpr = 1, lon0 = 14, tilt = 16 * D, arcs = [], vis = false, raf = 0, last = 0, spawnT = 0, ri = 0;
  function size() { W = box.clientWidth; H = box.clientHeight; dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    RAD = Math.min(W * .36, H * .44); cx = W * .5; cy = H * .52; }
  function vec(lat, lon) { var cl = Math.cos(lat); return [cl * Math.sin(lon), Math.sin(lat), cl * Math.cos(lon)]; }
  function view(v) { var l = lon0 * D, x = v[0] * Math.cos(l) - v[2] * Math.sin(l), z0 = v[0] * Math.sin(l) + v[2] * Math.cos(l), yy = v[1] * Math.cos(tilt) - z0 * Math.sin(tilt), zz = v[1] * Math.sin(tilt) + z0 * Math.cos(tilt); return [x, yy, zz]; }
  function slerp(a, b, t) { var d = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))), s = Math.sin(d) || 1, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s; return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2, d]; }
  function col(X, Y, a) { var u = Math.max(0, Math.min(1, ((X - cx) / RAD * .55 - (Y - cy) / RAD * .55 + 1) / 2));
    if (LITE) { var r1, g1, b1; if (u < .5) { var w = u / .5; r1 = 69 + (122 - 69) * w; g1 = 91 + (95 - 91) * w; b1 = 209 + (208 - 209) * w; } else { var w2 = (u - .5) / .5; r1 = 122 + (224 - 122) * w2; g1 = 95 + (122 - 95) * w2; b1 = 208 + (92 - 208) * w2; } return 'rgba(' + (r1 | 0) + ',' + (g1 | 0) + ',' + (b1 | 0) + ',' + Math.min(1, a * 1.7).toFixed(3) + ')'; }
    var r, g, b; if (u < .5) { var q = u / .5; r = 96 + (150 - 96) * q; g = 118 + (120 - 118) * q; b = 255 + (240 - 255) * q; } else { var q2 = (u - .5) / .5; r = 150 + (245 - 150) * q2; g = 120 + (160 - 120) * q2; b = 240 + (128 - 240) * q2; }
    return 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + a.toFixed(3) + ')'; }
  function spawn() {
    for (var k = 0; k < R.length; k++) { var r = R[(ri + k) % R.length], A = C[r[0]], B = C[r[1]], va = view(vec(A[0] * D, A[1] * D)), vb = view(vec(B[0] * D, B[1] * D));
      if (va[2] > .2 && vb[2] > .25 && !arcs.some(function (x) { return x.r === r; })) { ri = (ri + k + 1) % R.length;
        var ch = document.createElement('span'); ch.className = 'g-chip'; ch.innerHTML = '<i class="fl"><img alt="" src="' + ICON[r[2]] + '"></i><b>' + r[3] + '</b><em>' + r[4] + '</em>'; chipsEl.appendChild(ch);
        arcs.push({ r: r, a: vec(A[0] * D, A[1] * D), b: vec(B[0] * D, B[1] * D), t: 0, ch: ch, life: 0 }); return; } }
    ri = (ri + 1) % R.length;
  }
  function draw(dt) {
    ctx.clearRect(0, 0, W, H);
    var g = ctx.createRadialGradient(cx, cy, RAD * .94, cx, cy, RAD * 1.16); g.addColorStop(0, LITE ? 'rgba(80,100,240,.1)' : 'rgba(80,100,240,.2)'); g.addColorStop(1, 'rgba(80,100,240,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, RAD * 1.16, 0, 6.2832); ctx.fill();
    ctx.fillStyle = LITE ? 'rgba(69,91,209,.035)' : 'rgba(255,255,255,.025)'; ctx.beginPath(); ctx.arc(cx, cy, RAD, 0, 6.2832); ctx.fill();
    var l = lon0 * D, cl0 = Math.cos(l), sl0 = Math.sin(l), ct = Math.cos(tilt), st = Math.sin(tilt);
    for (var i = 0; i < P.length; i++) { var p = P[i], cla = Math.cos(p[0]), vx = cla * Math.sin(p[1]), vy = Math.sin(p[0]), vz = cla * Math.cos(p[1]);
      var x = vx * cl0 - vz * sl0, z0 = vx * sl0 + vz * cl0, yy = vy * ct - z0 * st, zz = vy * st + z0 * ct; if (zz < 0) continue;
      var X = cx + RAD * x, Y = cy - RAD * yy, a = (.25 + .75 * zz) * (.7 + .3 * p[2]); ctx.fillStyle = col(X, Y, a); var s = 1.1 + .8 * zz; ctx.fillRect(X - s / 2, Y - s / 2, s, s); }
    for (var k = arcs.length - 1; k >= 0; k--) { var A = arcs[k]; A.t += dt / 1900;
      var head = Math.min(1, A.t), tail = Math.max(0, Math.min(1, (A.t - .45) / 1.0)), lift = .18 + slerp(A.a, A.b, 0)[3] * .12, prev = null;
      for (var j = 0; j <= 48; j++) { var u = tail + (head - tail) * j / 48, v = slerp(A.a, A.b, u), h = 1 + lift * Math.sin(Math.PI * u), q = view([v[0] * h, v[1] * h, v[2] * h]);
        var X2 = cx + RAD * q[0], Y2 = cy - RAD * q[1], show = q[2] > 0 || (q[0] * q[0] + q[1] * q[1]) > 1;
        if (prev && show && prev[2]) { var al = .15 + .85 * (j / 48); ctx.strokeStyle = 'rgba(' + (233 - 90 * (1 - j / 48) | 0) + ',' + (150 - 20 * (1 - j / 48) | 0) + ',' + (140 + 100 * (1 - j / 48) | 0) + ',' + al.toFixed(3) + ')'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(X2, Y2); ctx.stroke(); }
        prev = [X2, Y2, show]; }
      var e = view(A.b), EX = cx + RAD * e[0], EY = cy - RAD * e[1], sv = view(A.a), SX = cx + RAD * sv[0], SY = cy - RAD * sv[1];
      if (sv[2] > 0 && A.t < 1.2) { ctx.fillStyle = 'rgba(140,155,255,.9)'; ctx.beginPath(); ctx.arc(SX, SY, 2.2, 0, 6.2832); ctx.fill(); }
      if (A.t >= 1 && e[2] > 0) { var pt = Math.min(1, (A.t - 1) / .5); ctx.strokeStyle = 'rgba(245,160,128,' + (1 - pt).toFixed(3) + ')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(EX, EY, 3 + 14 * pt, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = '#f4a07e'; ctx.beginPath(); ctx.arc(EX, EY, 2.6, 0, 6.2832); ctx.fill(); }
      if (A.t >= .95 && A.t < 2.9 && e[2] > .05) { A.ch.classList.add('on'); A.ch.style.transform = 'translate(' + (EX + 10).toFixed(1) + 'px,' + (EY - 38).toFixed(1) + 'px)'; } else A.ch.classList.remove('on');
      if (A.t > 3.3) { A.ch.remove(); arcs.splice(k, 1); } }
  }
  function frame(now) { var dt = Math.min(50, now - (last || now)); last = now; lon0 += dt / 1000 * 5; spawnT -= dt; if (spawnT <= 0) { spawn(); spawnT = 1500; } draw(dt); raf = vis ? requestAnimationFrame(frame) : 0; }
  size(); addEventListener('resize', function () { size(); if (!raf) draw(0); });
  if (reduce) { draw(0); return; }
  new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !raf) { last = 0; raf = requestAnimationFrame(frame); } }, { threshold: 0 }).observe(box);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* blog accordion: one story open at a time */
  var ac = document.getElementById('bl-ac'); if (!ac) return;
  var items = [].slice.call(ac.querySelectorAll('.ac-i'));
  items.forEach(function (it) {
    it.querySelector('.ac-h').addEventListener('click', function (e) {
      if (e.target.closest('.ac-cta')) return;
      if (it.classList.contains('on')) return;
      items.forEach(function (o) { var on = o === it; o.classList.toggle('on', on); o.querySelector('.ac-h').setAttribute('aria-expanded', on ? 'true' : 'false'); });
    });
  });
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* the hero ribbons: two flat ribbons wound as a double helix around a horizontal axis, seen almost side-on and a little from above.
     Each is built as a mesh, lit, and painted back to front, so the twists, the broad turns and the see-through crossings come out of the geometry. */
  var cv = document.getElementById('rb'); if (!cv) return;
  var ctx = cv.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, raf = 0, vis = true, t0 = 0;
  function size() { var b = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function norm(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  var LIGHT = norm([-.35, .55, .76]), VIEW = [0, 0, 1];
  var BASE = [212, 224, 253], DEEP = [132, 156, 240];
  function draw(ph) {
    ctx.clearRect(0, 0, W, H); ctx.save();
    var Hb = H - 64 > 120 ? H : H, R = Hb * .37, slope = .9, om = slope / R, bw = R * 1.02, cy = Hb * .5, tilt = 12 * Math.PI / 180, ct = Math.cos(tilt), st = Math.sin(tilt);
    var dx = 6, ns = 8, quads = [];
    for (var r = 0; r < 2; r++) {
      var phi = ph + r * Math.PI, rows = [];
      for (var x = -80; x <= W + 80; x += dx) {
        var th = om * x + phi, ch = Math.cos(th), sh = Math.sin(th);
        var T = norm([1, -R * om * sh, R * om * ch]), N = [0, ch, sh], B = norm(cross(N, T)), row = [];
        for (var j = 0; j <= ns; j++) {
          var sv = (j / ns - .5) * bw, p = [x + sv * B[0], R * ch + sv * B[1], R * sh + sv * B[2]];
          var y2 = p[1] * ct - p[2] * st, z2 = p[1] * st + p[2] * ct;
          row.push([p[0], cy - y2, z2, N]);
        }
        rows.push(row);
      }
      for (var i = 0; i < rows.length - 1; i++) for (j = 0; j < ns; j++) {
        var a = rows[i][j], b = rows[i + 1][j], c = rows[i + 1][j + 1], d = rows[i][j + 1], n = a[3];
        var nv = [n[0], n[1] * ct - n[2] * st, n[1] * st + n[2] * ct], facing = nv[2];
        var lam = Math.abs(nv[0] * LIGHT[0] + nv[1] * LIGHT[1] + nv[2] * LIGHT[2]);
        var hv = norm([LIGHT[0] + VIEW[0], LIGHT[1] + VIEW[1], LIGHT[2] + VIEW[2]]), spec = Math.pow(Math.abs(nv[0] * hv[0] + nv[1] * hv[1] + nv[2] * hv[2]), 24);
        quads.push([(a[2] + b[2] + c[2] + d[2]) / 4, a, b, c, d, lam, spec, facing, j]);
      }
    }
    quads.sort(function (p, q) { return p[0] - q[0]; });
    for (var k = 0; k < quads.length; k++) {
      var q = quads[k], lam2 = q[5], sp = q[6], f = q[7], edge = (q[8] === 0 || q[8] === ns - 1) ? 1 : 0;
      var t = .25 + .75 * lam2, col = [DEEP[0] + (BASE[0] - DEEP[0]) * t, DEEP[1] + (BASE[1] - DEEP[1]) * t, DEEP[2] + (BASE[2] - DEEP[2]) * t];
      var s2 = Math.min(1, sp * .75 + (f < 0 ? 0 : .06)); col = [col[0] + (255 - col[0]) * s2, col[1] + (255 - col[1]) * s2, col[2] + (255 - col[2]) * s2];
      if (edge) col = [col[0] + (255 - col[0]) * .25, col[1] + (255 - col[1]) * .25, col[2] + (255 - col[2]) * .25];
      ctx.fillStyle = 'rgba(' + (col[0] | 0) + ',' + (col[1] | 0) + ',' + (col[2] | 0) + ',' + (f < 0 ? .7 : .78) + ')';
      ctx.beginPath(); ctx.moveTo(q[1][0], q[1][1]); ctx.lineTo(q[2][0] + .5, q[2][1]); ctx.lineTo(q[3][0] + .5, q[3][1]); ctx.lineTo(q[4][0], q[4][1]); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  function frame(now) { if (!t0) t0 = now; draw(.6 + (now - t0) / 1000 * .12); raf = vis ? requestAnimationFrame(frame) : 0; }
  size(); draw(.6);
  addEventListener('resize', function () { size(); draw(.6); });
  if (reduce) return;
  new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(frame); }, { threshold: 0 }).observe(cv);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* the Bachs Card leans toward the pointer across the whole section, and the closing glow follows it across its section */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var sec = document.getElementById('card'), card = document.getElementById('bc-card'), sc = document.querySelector('.bc-scene');
  if (sec && card) {
    sec.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect(), nx = (e.clientX - (r.left + r.width / 2)) / (r.width * 1.4), ny = (e.clientY - (r.top + r.height / 2)) / (r.height * 1.4);
      nx = Math.max(-1, Math.min(1, nx)); ny = Math.max(-1, Math.min(1, ny));
      card.style.setProperty('--rx', (nx * 14).toFixed(2) + 'deg'); card.style.setProperty('--ry', (-ny * 10).toFixed(2) + 'deg');
      card.style.setProperty('--hx', ((nx + 1) * 50).toFixed(1) + '%'); card.style.setProperty('--hy', ((ny + 1) * 50).toFixed(1) + '%');
      card.style.setProperty('--gx2', (nx * 40).toFixed(1) + '%'); if (sc) sc.classList.add('hover');
    }, { passive: true });
    sec.addEventListener('pointerleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); if (sc) sc.classList.remove('hover'); });
  }
  var cta = document.getElementById('cta'), bloom = document.querySelector('.cta-bloom');
  if (cta && bloom) {
    cta.addEventListener('pointermove', function (e) { var r = cta.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
      bloom.style.setProperty('--bx', (nx * 260).toFixed(1) + 'px'); bloom.style.setProperty('--by', (ny * 90).toFixed(1) + 'px'); }, { passive: true });
    cta.addEventListener('pointerleave', function () { bloom.style.setProperty('--bx', '0px'); bloom.style.setProperty('--by', '0px'); });
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* the ask bubble opens for a moment when you arrive, so you notice it, then tucks away */
  var ask = document.getElementById('ask'), inp = document.getElementById('ask-in'); if (!ask) return;
  setTimeout(function () {
    if (ask.matches(':hover') || document.activeElement === inp) return;
    ask.classList.add('peek'); setTimeout(function () { ask.classList.add('open'); }, 140);
    setTimeout(function () { if (ask.matches(':hover') || document.activeElement === inp || (inp && inp.value)) return; ask.classList.remove('open'); setTimeout(function () { ask.classList.remove('peek'); }, 260); }, 1100);
  }, 1500);
})();
(function () {
  /* spend desktop: the dashboard rises onto the desktop; a spend request comes in, opens over the dashboard, gets approved,
     then the payment shows up in Payments and an agent's in-budget payment goes straight through */
  var panel = document.querySelector('.sp-panel'), win = document.getElementById('sp-win'), app = document.getElementById('q-app2');
  var nt = document.getElementById('nt'), mw = document.getElementById('mw'), cur = document.getElementById('sp-cur'), toast = document.getElementById('sp-toast');
  if (!panel || !win || !app || !nt || !mw) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, vis = false, gen = 0, wake = null;
  var tEl = document.getElementById('mb-t');
  function clock() { if (!tEl) return; var d = new Date(), h = d.getHours() % 12 || 12, m = ('0' + d.getMinutes()).slice(-2); tEl.textContent = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] + ' ' + h + ':' + m; }
  clock(); setInterval(clock, 30000);
  function fit() { app.style.setProperty('--k', (win.clientWidth / (innerWidth < 641 ? 760 : 1280)).toFixed(4)); }
  fit(); addEventListener('resize', fit);
  /* the revenue chart */
  var DD = [6, 9, 18, 7, 3, 2, 4, 5, 1, 10, 40, 70, 22, 0, 0, 0, 84, 58, 18, 8, 96, 14, 6, 5, 4, 1, 12, 3, 16, 9, 20, 32, 66];
  var svg = app.querySelector('.q-chart');
  if (svg) { var CW = 640, CH = 210, pts = DD.map(function (v, i) { return [i / (DD.length - 1) * CW, CH - 6 - v / 100 * (CH - 16)]; }), d = 'M' + pts[0];
    for (var i = 0; i < pts.length - 1; i++) { var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + Math.min(CH - 6, p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + Math.min(CH - 6, p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1); }
    var ln = svg.querySelector('.q-line'), ar = svg.querySelector('.q-area'), gr = svg.querySelector('.q-grid');
    if (ln) ln.setAttribute('d', d); if (ar) ar.setAttribute('d', d + ' L' + CW + ',' + CH + ' L0,' + CH + 'Z');
    if (gr && !gr.childNodes.length) for (var x = 0; x <= 7; x++) gr.insertAdjacentHTML('beforeend', '<line x1="' + x * CW / 7 + '" x2="' + x * CW / 7 + '" y1="0" y2="' + CH + '"/>'); }
  var navs = app.querySelectorAll('.q-ni[data-pg]'), pages = app.querySelectorAll('.q-pg'), rows = document.getElementById('q-payrows2');
  function show(k) { navs.forEach(function (n) { n.classList.toggle('on', n.dataset.pg === k); }); pages.forEach(function (p) { p.classList.toggle('on', p.dataset.pg === k); }); }
  var used = document.getElementById('mw-used'), bar = document.getElementById('mw-bar'), note = document.getElementById('mw-note'), yes = document.getElementById('mw-yes');
  function sleep(ms) { var g = gen; return new Promise(function (res, rej) { (function tick(left) {
    if (g !== gen) return rej('stop'); if (!vis) { wake = function () { tick(left); }; return; }
    var t = Math.min(left, 120); setTimeout(function () { left -= t; left <= 0 ? res() : tick(left); }, t); })(ms); }); }
  function point(el, dx, dy) { if (!cur) return; var r = el.getBoundingClientRect(), s = panel.getBoundingClientRect();
    cur.style.setProperty('--cx', (r.left - s.left + r.width * (dx == null ? .5 : dx)) + 'px'); cur.style.setProperty('--cy', (r.top - s.top + r.height * (dy == null ? .55 : dy)) + 'px'); }
  function tap(el) { if (cur) { cur.classList.remove('tap'); cur.offsetWidth; cur.classList.add('tap'); } if (el) { el.classList.add('press'); setTimeout(function () { el.classList.remove('press'); }, 160); } }
  function park() { if (!cur) return; cur.style.setProperty('--cx', (panel.clientWidth * .82) + 'px'); cur.style.setProperty('--cy', (panel.clientHeight * .9) + 'px'); }
  var added = null;
  function reset() { if (added) { added.remove(); added = null; } show('home'); panel.classList.remove('dim'); mw.classList.remove('on', 'ok'); nt.classList.remove('on', 'tap'); toast.classList.remove('on');
    if (used) used.textContent = 'GH₵24,800'; if (bar) { bar.style.width = '83%'; bar.style.background = ''; } if (note) note.style.visibility = ''; park(); }
  async function run() { var g = ++gen;
    try { while (g === gen) {
      reset(); await sleep(250); win.classList.add('up'); await sleep(1800);
      nt.classList.add('on'); await sleep(1300);
      point(nt, .45, .5); await sleep(1000); tap(); nt.classList.add('tap'); await sleep(160); nt.classList.remove('on', 'tap');
      panel.classList.add('dim'); await sleep(180); mw.classList.add('on'); await sleep(1300);
      point(yes, .5, .55); await sleep(1100); tap(yes);
      mw.classList.add('ok'); if (used) used.textContent = 'GH₵34,200'; if (bar) { bar.style.width = '100%'; bar.style.background = '#d97706'; } if (note) note.style.visibility = 'hidden';
      await sleep(1700); mw.classList.remove('on'); await sleep(200); panel.classList.remove('dim'); await sleep(500);
      var payNav = app.querySelector('.q-ni[data-pg="pay"]'); if (payNav) { point(payNav, .4, .5); await sleep(900); tap(payNav); show('pay'); }
      await sleep(350);
      if (rows) { added = document.createElement('div'); added.className = 'q-tr q-new';
        added.innerHTML = '<span class="q-b">−GH₵9,400.00</span><span><span class="q-st succeeded">Paid</span></span><span>Payout</span><span>Expo Ghana Ltd</span><span class="q-mut">Just now</span>';
        rows.insertBefore(added, rows.firstChild); }
      park(); await sleep(900); toast.classList.add('on'); await sleep(2800); toast.classList.remove('on'); await sleep(900);
      win.classList.remove('up'); await sleep(1100);
    } } catch (e) {}
  }
  if (reduce) { win.classList.add('up'); show('home'); return; }
  new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { if (wake) { var w = wake; wake = null; w(); } else if (!gen) run(); } }, { threshold: .3 }).observe(panel);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* logo grid: six places; every so often one logo moves to another place, or a new one comes in from the rest */
  var grid = document.getElementById('lm2-grid'); if (!grid) return;
  var cells = [].slice.call(grid.children), pool = [];
  document.querySelectorAll('.cu-cell .lg').forEach(function (l) { pool.push(l.cloneNode(true)); });
  var v = document.querySelector('.ll-wm svg'); if (v) { var c = v.cloneNode(true), g = c.querySelector('g'); g.setAttribute('fill', '#0b0c10'); g.setAttribute('stroke', '#0b0c10'); c.style.opacity = '.82'; pool.push(c); }
  if (!pool.length) return;
  var shown = [];
  function put(cell, node, animate) {
    var old = cell.firstElementChild, w = document.createElement('span'); w.appendChild(node);
    if (animate) { w.className = 'pre'; cell.appendChild(w); w.offsetWidth; w.className = ''; if (old) { old.className = 'out'; setTimeout(function () { old.remove(); }, 700); } }
    else { cell.innerHTML = ''; cell.appendChild(w); }
  }
  for (var i = 0; i < cells.length; i++) { var n = pool[i % pool.length]; shown.push(i % pool.length); put(cells[i], n.cloneNode(true), false); }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var vis = false, t = null;
  function tick() {
    var hidden = []; for (var k = 0; k < pool.length; k++) if (shown.indexOf(k) < 0) hidden.push(k);
    if (hidden.length && Math.random() < .6) {            /* bring a new logo in */
      var at = Math.floor(Math.random() * cells.length), nk = hidden[Math.floor(Math.random() * hidden.length)];
      shown[at] = nk; put(cells[at], pool[nk].cloneNode(true), true);
    } else {                                              /* two logos trade places */
      var a = Math.floor(Math.random() * cells.length), b = (a + 1 + Math.floor(Math.random() * (cells.length - 1))) % cells.length, tmp = shown[a];
      shown[a] = shown[b]; shown[b] = tmp; put(cells[a], pool[shown[a]].cloneNode(true), true); setTimeout(function () { put(cells[b], pool[shown[b]].cloneNode(true), true); }, 140);
    }
    t = setTimeout(tick, 1600);
  }
  new IntersectionObserver(function (es) { var on = es[0].isIntersecting; if (on && !vis) { vis = true; t = setTimeout(tick, 1200); } else if (!on && vis) { vis = false; clearTimeout(t); } }, { threshold: .3 }).observe(grid);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 66: logos scroll in an endless strip, entering at one guide line and leaving at the other */
  var track = document.getElementById('lm2-track'); if (!track) return;
  var pool = [];
  document.querySelectorAll('.cu-cell .lg').forEach(function (l) { pool.push(l.cloneNode(true)); });
  var v = document.querySelector('.ll-wm svg'); if (v) { var c = v.cloneNode(true), g = c.querySelector('g'); if (g) { g.setAttribute('fill', '#0b0c10'); g.setAttribute('stroke', '#0b0c10'); } c.style.opacity = '.82'; pool.push(c); }
  if (!pool.length) return;
  function group() {
    var gEl = document.createElement('div'); gEl.className = 'lm2-g';
    pool.forEach(function (n) { var it = document.createElement('span'); it.className = 'lm2-c lm2-it'; var w = document.createElement('span'); w.appendChild(n.cloneNode(true)); it.appendChild(w); gEl.appendChild(it); });
    return gEl;
  }
  track.appendChild(group()); var b = group(); b.setAttribute('aria-hidden', 'true'); track.appendChild(b);
  requestAnimationFrame(function () { track.querySelectorAll('.lm2-it').forEach(function (it) { var l = it.querySelector('.lg, svg, img'); if (!l || l.getBoundingClientRect().width < 2) it.remove(); }); });
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 67: no-code cards scroll sideways; the arrows move one card at a time */
  var row = document.getElementById('nc4'), prev = document.getElementById('nc-prev'), next = document.getElementById('nc-next'); if (!row || !prev || !next) return;
  function step() { var c = row.querySelector('.n4'); return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(row).columnGap || 0) : 300; }
  function sync() { var max = row.scrollWidth - row.clientWidth - 2; prev.disabled = row.scrollLeft <= 2; next.disabled = row.scrollLeft >= max; }
  prev.addEventListener('click', function () { row.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { row.scrollBy({ left: step(), behavior: 'smooth' }); });
  row.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 69: Bachs MCP demo. An agent calls a tool: a spark runs agent -> server -> tool, the tool lights up, the log shows the call and its result. */
  var demo = document.getElementById('mcp-demo'); if (!demo) return;
  var svg = document.getElementById('mcp-wires'), hub = document.getElementById('mcp-hub'), log = document.getElementById('mcp-log');
  var ags = [].slice.call(demo.querySelectorAll('.mcp-ag')), tls = [].slice.call(demo.querySelectorAll('.mcp-tl'));
  var NS = 'http://www.w3.org/2000/svg', wa = [], wt = [], dot = null;
  var CALLS = [
    [0, 0, 'create_payment_link(amount: 350, currency: "USD")', 'pay.bachs.io/lantern/logo'],
    [1, 2, 'get_balance(currency: "GHS")', 'GH₵48,200.00 available'],
    [2, 1, 'send_invoice(to: "kofi@mensah.co", total: 4200)', 'Invoice #0042 sent'],
    [0, 3, 'list_transactions(since: "today")', '12 payments, $3,480'],
    [1, 4, 'create_payout(amount: 500000, to: "GTBank ••4821")', 'Waiting for your approval', 'ap'],
    [2, 5, 'issue_card(name: "ads-agent", limit: 200)', 'Card •••• 4291 ready']
  ];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, wide = matchMedia('(min-width: 901px)');
  var k = 0, timer = null, raf = 0, vis = false;
  function curve(x1, y1, x2, y2) { var dx = (x2 - x1) * .5; return 'M' + x1 + ' ' + y1 + ' C' + (x1 + dx) + ' ' + y1 + ' ' + (x2 - dx) + ' ' + y2 + ' ' + x2 + ' ' + y2; }
  function build() {
    svg.innerHTML = ''; wa = []; wt = [];
    if (!wide.matches) return;
    var d = demo.getBoundingClientRect(), h = hub.querySelector('.mcp-core').getBoundingClientRect();
    var hl = h.left - d.left, hr = h.right - d.left, hy = h.top - d.top + h.height / 2;
    ags.forEach(function (el, i) { var r = el.getBoundingClientRect(), p = document.createElementNS(NS, 'path'); p.setAttribute('d', curve(r.right - d.left, r.top - d.top + r.height / 2, hl, hy + (i - 1) * 14)); svg.appendChild(p); wa.push(p); });
    tls.forEach(function (el, i) { var r = el.getBoundingClientRect(), p = document.createElementNS(NS, 'path'); p.setAttribute('d', curve(hr, hy + (i - 2.5) * 8, r.left - d.left, r.top - d.top + r.height / 2)); svg.appendChild(p); wt.push(p); });
    dot = document.createElementNS(NS, 'circle'); dot.setAttribute('r', '3'); dot.style.opacity = '0'; svg.appendChild(dot);
  }
  function run(path, ms) {
    return new Promise(function (res) {
      if (!path || !dot) return setTimeout(res, ms * .6);
      var L = path.getTotalLength(), t0 = performance.now(); dot.style.opacity = '1';
      (function f(now) { var q = Math.min(1, (now - t0) / ms), e = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2, pt = path.getPointAtLength(L * e);
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); if (q < 1) raf = requestAnimationFrame(f); else { dot.style.opacity = '0'; res(); } })(t0);
    });
  }
  function wait(ms) { return new Promise(function (r) { timer = setTimeout(r, ms); }); }
  function clear() { ags.concat(tls).forEach(function (e) { e.classList.remove('on'); }); wa.concat(wt).forEach(function (p) { p.classList.remove('on'); }); }
  function show(c) {
    log.classList.add('swap');
    setTimeout(function () {
      log.querySelector('.mcp-who').textContent = ags[c[0]].querySelector('b').textContent;
      log.querySelector('code').textContent = c[2];
      var r = log.querySelector('.mcp-res'); r.textContent = '…'; r.className = 'mcp-res';
      log.classList.remove('swap');
    }, 280);
  }
  var running = false;
  async function loop() {
    if (running) return; running = true;
    while (vis) {
      var c = CALLS[k % CALLS.length]; k++;
      clear(); ags[c[0]].classList.add('on'); if (wa[c[0]]) wa[c[0]].classList.add('on'); show(c);
      await run(wa[c[0]], 750); if (!vis) break;
      hub.classList.add('hit'); setTimeout(function () { hub.classList.remove('hit'); }, 380);
      if (wt[c[1]]) wt[c[1]].classList.add('on');
      await run(wt[c[1]], 750); if (!vis) break;
      tls[c[1]].classList.add('on');
      var r = log.querySelector('.mcp-res'); r.textContent = c[3]; r.className = 'mcp-res' + (c[4] ? ' ' + c[4] : '');
      await wait(1700);
    }
    running = false;
  }
  build(); addEventListener('resize', function () { build(); });
  if (wide.addEventListener) wide.addEventListener('change', build);
  if (reduce) { ags[0].classList.add('on'); tls[0].classList.add('on'); return; }
  new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { build(); loop(); } else { clearTimeout(timer); cancelAnimationFrame(raf); } }, { threshold: .3 }).observe(demo);

  var cp = document.getElementById('mcp-copy');
  if (cp) cp.addEventListener('click', function () {
    var t = cp.parentNode.querySelector('code').textContent.replace(/^\$\s*/, '');
    try { navigator.clipboard.writeText(t); } catch (e) {}
    var l = cp.querySelector('span'); l.textContent = 'Copied'; setTimeout(function () { l.textContent = 'Copy'; }, 1400);
  });
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 78: rails. Payers' streams tangle and cross, funnel to one point, then run as one straight stream into the settle pill.
     Streams swell in the middle and thin at the ends; everything in white on black. Hovering a payer lifts its stream. */
  var flow = document.getElementById('rl-flow'); if (!flow) return;
  var svg = document.getElementById('rl-bands'), pill = document.getElementById('rl-pill'), ns = [].slice.call(flow.querySelectorAll('.rl-n')), NS = 'http://www.w3.org/2000/svg';
  var ORDER = [3, 0, 5, 1, 4, 2], groups = [];
  function bez(a, b, c, d, t) { var u = 1 - t; return [u*u*u*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t*t*t*d[0], u*u*u*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t*t*t*d[1]]; }
  function ribbon(segs, w0, w1) {
    var pts = [];
    segs.forEach(function (sg, k) { for (var j = (k ? 1 : 0); j <= 36; j++) pts.push(bez(sg[0], sg[1], sg[2], sg[3], j / 36)); });
    var L = [], R = [], n = pts.length;
    for (var i = 0; i < n; i++) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      var s = i / (n - 1), w = w0 + (w1 - w0) * Math.pow(Math.sin(Math.PI * s), 1.4) + 3 * Math.pow(Math.sin(Math.PI * s * 3), 2) * Math.sin(Math.PI * s);
      var nx = -dy / len * w / 2, ny = dx / len * w / 2;
      L.push((pts[i][0] + nx).toFixed(1) + ' ' + (pts[i][1] + ny).toFixed(1)); R.push((pts[i][0] - nx).toFixed(1) + ' ' + (pts[i][1] - ny).toFixed(1));
    }
    return 'M' + L.join(' L') + ' L' + R.reverse().join(' L') + 'Z';
  }
  function line(segs) { var d = 'M' + segs[0][0].join(' '); segs.forEach(function (g) { d += ' C' + g[1].join(' ') + ' ' + g[2].join(' ') + ' ' + g[3].join(' '); }); return d; }
  function el(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function draw() {
    var f = flow.getBoundingClientRect(), pr = pill.getBoundingClientRect(), W = f.width;
    svg.innerHTML = '<defs>' +
      '<linearGradient id="rlL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".7"/></linearGradient>' +
      '<linearGradient id="rlB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".03"/><stop offset=".45" stop-color="#fff" stop-opacity=".085"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>' +
      '<linearGradient id="rlS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity=".95"/></linearGradient>' +
      '<linearGradient id="rlSB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".02"/><stop offset=".5" stop-color="#fff" stop-opacity=".075"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></linearGradient></defs>';
    groups = [];
    var n = ns.length, ys = [], x1s = [];
    ns.forEach(function (node) { var r = node.querySelector('.rl-amt'), a = node.querySelector('.rl-pair').getBoundingClientRect(); var st = (r && getComputedStyle(r).display !== 'none') ? r.getBoundingClientRect().right : a.right; x1s.push(st - f.left + 10); ys.push(a.top - f.top + a.height / 2); });
    var cy = pr.top - f.top + pr.height / 2, xe = pr.left - f.left + 2, xf = x1s[0] + (xe - x1s[0]) * .68;
    var ORDER = [2, 0, 4, 1, 5, 3], xm = x1s[0] + (xf - x1s[0]) * .42;
    ns.forEach(function (node, i) {
      var x1 = x1s[i], y1 = ys[i], ym = ys[ORDER[i]] + (ys[1] - ys[0]) * .25, yf = cy + (i - (n - 1) / 2) * 1.4;
      var A = [[x1, y1], [x1 + (xm - x1) * .55, y1], [xm - (xm - x1) * .45, ym], [xm, ym]];
      var B = [[xm, ym], [xm + (xf - xm) * .5, ym], [xf - (xf - xm) * .45, yf], [xf, yf]];
      var C = [[xf, yf], [xf + (xe - xf) * .3, yf], [xe - (xe - xf) * .3, yf], [xe, yf]];
      var g = el('g', {}), band = el('path', { d: ribbon([A, B], 3, 18), fill: 'url(#rlB)', class: 'bd' }), ln = el('path', { d: line([A, B, C]), class: 'ln' });
      g.appendChild(band); g.appendChild(ln); svg.appendChild(g); groups.push(g);
    });
    var bun = el('path', { d: 'M' + xf + ' ' + (cy - 6) + ' L' + xe + ' ' + (cy - 7) + ' L' + xe + ' ' + (cy + 7) + ' L' + xf + ' ' + (cy + 6) + 'Z', class: 'bun' });
    svg.insertBefore(bun, svg.firstChild.nextSibling);
    var sb = el('path', { d: 'M' + xf + ' ' + (cy - 3) + ' C' + (xf + 30) + ' ' + (cy - 3) + ' ' + (xf + 40) + ' ' + (cy - 13) + ' ' + (xf + 70) + ' ' + (cy - 13) + ' L' + xe + ' ' + (cy - 13) + ' L' + xe + ' ' + (cy + 13) + ' L' + (xf + 70) + ' ' + (cy + 13) + ' C' + (xf + 40) + ' ' + (cy + 13) + ' ' + (xf + 30) + ' ' + (cy + 3) + ' ' + xf + ' ' + (cy + 3) + 'Z', fill: 'url(#rlSB)', class: 'sb' });
    var sl = el('path', { d: 'M' + xf + ' ' + cy + ' L' + xe + ' ' + cy, class: 'sl' });
    
  }
  ns.forEach(function (node, i) {
    node.addEventListener('mouseenter', function () { if (groups[i]) groups[i].classList.add('on'); });
    node.addEventListener('mouseleave', function () { if (groups[i]) groups[i].classList.remove('on'); });
  });
  draw(); addEventListener('resize', draw); addEventListener('load', draw);
  if (window.ResizeObserver) new ResizeObserver(draw).observe(flow);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 84: Bachs MCP. Tabs on top pick the agent and its install line; the matching nodes in the diagram light up. */
  var root = document.getElementById('mcx'); if (!root) return;
  var tabs = [].slice.call(root.querySelectorAll('.mcx-tab')), nodes = [].slice.call(root.querySelectorAll('.mcx-n')), groups = [].slice.call(root.querySelectorAll('.mcx-tr .tg'));
  var hint = document.getElementById('mcx-hint'), codeEl = document.getElementById('mcx-code'), copy = document.getElementById('mcx-copy');
  function pick(t) {
    var on = t.getAttribute('data-n').split(',').map(Number);
    tabs.forEach(function (x) { var s = x === t; x.classList.toggle('on', s); x.setAttribute('aria-selected', s); });
    nodes.forEach(function (n, j) { n.classList.toggle('on', on.indexOf(j) > -1); });
    groups.forEach(function (g, j) { g.classList.toggle('on', on.indexOf(j) > -1); });
    hint.textContent = t.getAttribute('data-hint'); codeEl.textContent = t.getAttribute('data-cmd');
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { pick(t); }); });
  copy.addEventListener('click', function () { try { navigator.clipboard.writeText(codeEl.textContent); } catch (e) {} var l = copy.querySelector('span'); l.textContent = 'Copied'; setTimeout(function () { l.textContent = 'Copy'; }, 1400); });
  pick(tabs[0]);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 86: rails grid wakes up around the cursor */
  var el = document.getElementById('developers'); if (!el || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  el.addEventListener('pointermove', function (e) { var r = (el.querySelector('.dev-in') || el).getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); el.classList.add('lit'); });
  el.addEventListener('pointerleave', function () { el.classList.remove('lit'); });
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 88: size the MCP imagery so the right-hand agents sit half off the screen and Claude half off the bottom */
  var st = document.getElementById('mcx-stage'); if (!st) return;
  function fit() {
    if (innerWidth < 901) { st.style.width = ''; st.style.marginBottom = ''; return; }
    st.style.width = '600px';
    var left = st.getBoundingClientRect().left, W = Math.max(600, (document.documentElement.clientWidth - left) / .772);
    st.style.setProperty('width', W + 'px', 'important'); st.style.setProperty('margin-bottom', (-W * .52 * .12) + 'px', 'important');
  }
  fit(); addEventListener('resize', fit); addEventListener('load', fit);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 90: MCP command box bottom lines up with the bottom of the Gemini node; dark grid stops under the rails */
  var pick = document.querySelector('.mcx-pick'), box = document.querySelector('.mcx-box'), gem = document.querySelector('.mcx-n[data-a="3"]');
  var dev = document.getElementById('developers'), rails = document.getElementById('rails'), code = document.getElementById('dv-code');
  function place() {
    if (pick && box && gem) {
      pick.style.transform = '';
      
    }
    if (dev && rails) {
      var t = dev.getBoundingClientRect().top, rb = rails.getBoundingClientRect().bottom, ct = code ? code.getBoundingClientRect().top : rb;
      dev.style.setProperty('--gh', Math.round((rb + ct) / 2 - t) + 'px');
    }
  }
  addEventListener('load', place); addEventListener('resize', place); setTimeout(place, 600); place();
  if (window.ResizeObserver) { var st = document.querySelector('.mcx-stage'); if (st) new ResizeObserver(place).observe(st); }
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 92: stats count up once when they come into view */
  var g = document.querySelector('.stx-g'); if (!g) return;
  function run() {
    g.classList.add('on'); if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    g.querySelectorAll('b[data-to]').forEach(function (b) {
      var to = +b.dataset.to, v = b.querySelector('.v'); if (!v || to < 5) return;
      var t0 = performance.now(), D = 1200;
      (function tick(t) { var k = Math.max(0, Math.min(1, (t - t0) / D)), e = 1 - Math.pow(1 - k, 3); v.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(tick); })(t0);
    });
  }
  if (!('IntersectionObserver' in window)) return run();
  var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: .3 }); io.observe(g);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 93: startup cards hover the way Stripe's case study carousel does: the hovered card's picture widens by 3.6%,
     the cards before it slide left and the cards after it slide right by half of that, the picture itself is never stretched */
  var row = document.getElementById('sx-row'); if (!row || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var S = 1.036, cards = [].slice.call(row.querySelectorAll('.sx-c'));
  function set(i) {
    cards.forEach(function (c, j) {
      var w = c.querySelector('.sx-img').offsetWidth, sh = i < 0 ? 0 : (j <= i ? -1 : 1) * w * (S - 1) / 2;
      c.style.setProperty('--sc', i === j ? S : 1); c.style.setProperty('--sh', sh.toFixed(2) + 'px');
    });
  }
  cards.forEach(function (c, i) { c.addEventListener('pointerenter', function () { set(i); }); });
  row.addEventListener('pointerleave', function () { set(-1); });
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 96: no-code cards with a page open it on click or Enter */
  document.querySelectorAll('article.n4[data-href]').forEach(function (a) {
    a.setAttribute('role', 'link'); a.setAttribute('tabindex', '0'); a.style.cursor = 'pointer';
    function go() { location.href = a.getAttribute('data-href'); }
    a.addEventListener('click', go);
    a.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  });
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* hero: the agent menu opens on tap as well as hover */
  document.querySelectorAll('.sm-agent').forEach(function (a) { var b = a.querySelector('.sm-ag-btn'); if (b) b.addEventListener('click', function (e) { e.stopPropagation(); a.classList.toggle('open'); }); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.sm-agent')) document.querySelectorAll('.sm-agent.open').forEach(function (a) { a.classList.remove('open'); }); });
})();
(function () {
  /* spend on phones: a request arrives on the phone, opens as a sheet, gets approved, and lands in Recent */
  var ph = document.getElementById('sp-ph'); if (!ph || !matchMedia('(max-width: 640px)').matches) return;
  var scr = document.getElementById('ph-scr'), nt = document.getElementById('ph-nt'), dim = document.getElementById('ph-dim'), sh = document.getElementById('ph-sh'), yes = document.getElementById('ph-yes'), tap = document.getElementById('ph-tap'),
    list = document.getElementById('ph-list'), used = document.getElementById('ph-used'), bar = document.getElementById('ph-bar');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, vis = false, started = false, added = [];
  function wait(ms) { return new Promise(function (r) { (function chk(left) { if (!vis) return setTimeout(function () { chk(left); }, 200); if (left <= 0) return r(); setTimeout(function () { chk(left - 100); }, 100); })(ms); }); }
  function aim(el, dx, dy) { var r = el.getBoundingClientRect(), s = scr.getBoundingClientRect(); tap.style.setProperty('--tx', (r.left - s.left + r.width * dx) + 'px'); tap.style.setProperty('--ty', (r.top - s.top + r.height * dy) + 'px'); }
  function press() { tap.classList.remove('tap'); tap.offsetWidth; tap.classList.add('tap'); }
  function row(cls, ini, name, tag, amt) { var d = document.createElement('div'); d.className = 'ph-r new ' + cls; d.innerHTML = '<i>' + ini + '</i><span><b>' + name + '</b><em class="tag">' + tag + '</em></span><b>' + amt + '</b>'; list.insertBefore(d, list.firstChild); added.push(d); }
  function reset() { added.forEach(function (d) { d.remove(); }); added = []; sh.classList.remove('on', 'ok'); dim.classList.remove('on'); nt.classList.remove('on', 'tap'); tap.classList.remove('on');
    used.innerHTML = 'GH₵24,800 <small>of GH₵30,000</small>'; bar.style.width = '83%'; bar.style.background = ''; }
  if (reduce) { sh.classList.add('on'); dim.classList.add('on'); return; }
  async function run() {
    while (true) {
      reset(); await wait(700);
      nt.classList.add('on'); await wait(1100);
      aim(nt, .5, .55); tap.classList.add('on'); await wait(900); press(); nt.classList.add('tap'); await wait(200); nt.classList.remove('on', 'tap');
      dim.classList.add('on'); sh.classList.add('on'); await wait(1300);
      aim(yes, .5, .55); await wait(1000); press(); yes.classList.add('press'); await wait(160); yes.classList.remove('press');
      sh.classList.add('ok'); used.innerHTML = 'GH₵34,200 <small>of GH₵30,000</small>'; bar.style.width = '100%'; bar.style.background = '#d97706';
      await wait(1600); tap.classList.remove('on'); sh.classList.remove('on'); dim.classList.remove('on'); await wait(450);
      row('', 'EG', 'Expo Ghana Ltd', 'Approved by you', '−GH₵9,400'); await wait(1800);
      row('ag', 'AG', 'Meta Ads', 'Paid by ads-agent, in budget', '−GH₵2,100'); await wait(3400);
    }
  }
  new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis && !started) { started = true; run(); } }, { threshold: .3 }).observe(ph);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* platforms: the seller who still owed documents gets verified while you look */
  var f = document.getElementById('pf-flip'); if (!f || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var st = f.querySelector('.pf-s'), pp = f.querySelector('.pf-p');
  new IntersectionObserver(function (es, o) {
    if (!es[0].isIntersecting) return; o.disconnect();
    setTimeout(function () { st.className = 'pf-s ok'; st.textContent = 'Verified'; pp.textContent = 'Weekly'; f.classList.add('flash'); }, 1800);
  }, { threshold: .6 }).observe(f);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* no code needed: four cards side by side, every demo running. They restart the first time the section comes into view. */
  var acc = document.getElementById('nc-acc'); if (!acc) return;
  var ps = [].slice.call(acc.querySelectorAll('.nc-p')), seen = false;
  ps.forEach(function (p) { p.classList.add('on'); });
  new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting || seen) return; seen = true;
    ps.forEach(function (p) { p.classList.remove('on'); });
    setTimeout(function () { ps.forEach(function (p) { p.classList.add('on'); }); }, 60);
  }, { threshold: .25 }).observe(acc);
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 39: scripted scenes for three no-code panels. Each runs when its panel opens and resets when it closes. */
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function panelOf(el) { return el && el.closest('.nc-p'); }
  function watch(el, start, stop) {
    var p = panelOf(el); if (!p) return;
    var was = p.classList.contains('on');
    if (was) start();
    new MutationObserver(function () { var now = p.classList.contains('on'); if (now === was) return; was = now; stop(); if (now) start(); })
      .observe(p, { attributes: true, attributeFilter: ['class'] });
  }
  function timers() { var ts = []; return { at: function (ms, fn) { ts.push(setTimeout(fn, ms)); }, clear: function () { ts.forEach(clearTimeout); ts = []; } }; }

  /* payment links: the wheel turns one step at a time */
  var arc = document.getElementById('v-arc');
  if (arc) {
    var it = [].slice.call(arc.querySelectorAll('.arc-i')), N = it.length, k = 0, tick = null, prev = [];
    function place(first) {
      it.forEach(function (el, i) {
        var d = ((i - k) % N + N) % N; if (d > N / 2) d -= N;
        if (!first && prev[i] !== undefined && Math.abs(d - prev[i]) > 1) { el.classList.add('jump'); }
        el.style.setProperty('--d', d);
        var a = Math.abs(d); el.style.setProperty('--o', a >= 4 ? 0 : a === 0 ? 1 : a === 1 ? .55 : a === 2 ? .32 : .14);
        el.classList.toggle('on', d === 0); prev[i] = d;
      });
      requestAnimationFrame(function () { it.forEach(function (el) { el.classList.remove('jump'); }); });
    }
    place(true);
    watch(arc, function () { if (reduce) return; clearInterval(tick); tick = setInterval(function () { k = (k + 1) % N; place(false); }, 1700); },
      function () { clearInterval(tick); });
  }

  /* agents: type, send, think, call the tool, answer */
  var cl = document.getElementById('v-cl');
  if (cl) {
    var T = timers(), typed = cl.querySelector('.cl-typed'), txt = cl.querySelector('.cl-txt'), msg = cl.querySelector('.cl-me').textContent;
    var words = txt.getAttribute('data-text').split(' ');
    txt.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var ws = [].slice.call(txt.querySelectorAll('.w'));
    var S = ['s-ready', 's-press', 's-sent', 's-ai', 's-tool', 's-card'];
    function reset() { T.clear(); S.forEach(function (c) { cl.classList.remove(c); }); typed.textContent = ''; ws.forEach(function (w) { w.classList.remove('on'); }); }
    function end() { typed.textContent = ''; cl.classList.add('s-sent', 's-ai', 's-tool', 's-card'); ws.forEach(function (w) { w.classList.add('on'); }); }
    watch(cl, function () {
      reset(); if (reduce) return end();
      var t = 500, step = 26;
      for (var i = 1; i <= msg.length; i++) (function (n) { T.at(t + n * step, function () { typed.textContent = msg.slice(0, n); if (n === 1) cl.classList.add('s-ready'); }); })(i);
      t += msg.length * step + 350;
      T.at(t, function () { cl.classList.add('s-press'); });
      T.at(t + 160, function () { cl.classList.remove('s-press', 's-ready'); typed.textContent = ''; cl.classList.add('s-sent'); });
      T.at(t + 550, function () { cl.classList.add('s-ai'); });
      T.at(t + 1700, function () { cl.classList.add('s-tool'); });
      var w0 = t + 2200;
      ws.forEach(function (w, j) { T.at(w0 + j * 55, function () { w.classList.add('on'); }); });
      T.at(w0 + ws.length * 55 + 250, function () { cl.classList.add('s-card'); });
    }, reset);
  }

  /* wordpress: a cursor switches the plugin on, picks Bachs and places the order */
  var wp = document.getElementById('v-wp');
  if (wp) {
    var W = timers(), cur = wp.querySelector('.wp-cur');
    var SW = ['s-cur', 's-tg', 's-co', 's-pick', 's-press', 's-load', 's-done'];
    function to(sel, dx, dy) {
      var r = wp.getBoundingClientRect(), b = wp.querySelector(sel).getBoundingClientRect();
      cur.style.setProperty('--cx', (b.left - r.left + (dx == null ? b.width / 2 : dx)) + 'px');
      cur.style.setProperty('--cy', (b.top - r.top + (dy == null ? b.height / 2 : dy)) + 'px');
    }
    function tap() { cur.classList.remove('tap'); void cur.offsetWidth; cur.classList.add('tap'); }
    function wreset() { W.clear(); SW.forEach(function (c) { wp.classList.remove(c); }); cur.style.setProperty('--cx', (wp.clientWidth - 30) + 'px'); cur.style.setProperty('--cy', (wp.clientHeight + 10) + 'px'); }
    watch(wp, function () {
      wreset(); if (reduce) { wp.classList.add('s-tg', 's-co', 's-pick'); return; }
      W.at(300, function () { wp.classList.add('s-cur'); });
      W.at(500, function () { to('.v-tg', 22, 12); });
      W.at(1450, function () { tap(); wp.classList.add('s-tg'); });
      W.at(1800, function () { wp.classList.add('s-co'); });
      W.at(2200, function () { to('.wp-bachs .v-rd', 9, 10); });
      W.at(3150, function () { tap(); wp.classList.add('s-pick'); });
      W.at(3500, function () { to('.v-wp-btn', null, 22); });
      W.at(4450, function () { tap(); wp.classList.add('s-press'); });
      W.at(4600, function () { wp.classList.remove('s-press'); wp.classList.add('s-load'); });
      W.at(5600, function () { wp.classList.remove('s-load', 's-cur'); wp.classList.add('s-done'); });
    }, wreset);
  }
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* round 58: payment links, take two. Copy the link, then payments land on it one by one. */
  var root = document.getElementById('v-pl'); if (!root) return;
  var p = root.closest('.nc-p'), card = document.getElementById('pl-card'), list = document.getElementById('pl-list');
  var nEl = document.getElementById('pl-n'), totEl = document.getElementById('pl-tot');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CARD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>';
  var P = [
    ['gh', '', 'Ama Owusu', 'Mobile money · Ghana', 'GH₵5,250'],
    ['ng', '', 'Chidi Eze', 'Bank transfer · Nigeria', '₦540,000'],
    ['usdt', '₮', 'Sam Lee', 'Stablecoin · USDT', '350 USDT'],
    ['ke', '', 'Wanjiru Kamau', 'M-Pesa · Kenya', 'KSh 45,200'],
    ['card', CARD, 'Maya Brooks', 'Card · United States', '$350.00']
  ];
  var ts = [], n = 0, tot = 0, shown = 0;
  function at(ms, fn) { ts.push(setTimeout(fn, ms)); }
  function money(v) { return '$' + Math.round(v).toLocaleString('en-US'); }
  function count(to) {
    var from = shown, t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / 600); shown = from + (to - from) * (1 - Math.pow(1 - k, 3));
      totEl.textContent = money(shown); if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  function row(d, paid) {
    var r = document.createElement('div'); r.className = 'pl-r';
    r.innerHTML = '<i class="pl-ic ' + d[0] + '">' + d[1] + '</i><span><b>' + d[2] + '</b><em>' + d[3] + '</em></span>' +
      '<span class="pl-amt"><strong>$350.00</strong><small>paid ' + d[4] + '</small></span><u class="pl-st' + (paid ? ' paid' : '') + '">' + (paid ? 'Paid' : 'Pending') + '</u>';
    return r;
  }
  function add() {
    var d = P[n % P.length]; n++;
    var r = row(d, false); r.classList.add('in');
    list.insertBefore(r, list.firstChild);
    var rows = list.querySelectorAll('.pl-r:not(.out)');
    if (rows.length > 4) { var last = rows[rows.length - 1]; last.classList.add('out'); setTimeout(function () { last.remove(); }, 420); }
    var c = n;
    at(900, function () { var u = r.querySelector('.pl-st'); u.textContent = 'Paid'; u.classList.add('paid'); nEl.textContent = c; tot += 350; count(tot); });
    at(2300, add);
  }
  function reset() { ts.forEach(clearTimeout); ts = []; n = 0; tot = 0; shown = 0; list.innerHTML = ''; nEl.textContent = '0'; totEl.textContent = '$0'; card.classList.remove('copied'); }
  function start() {
    reset();
    if (reduce) { for (var i = 2; i >= 0; i--) list.appendChild(row(P[i], true)); nEl.textContent = '3'; totEl.textContent = '$1,050'; return; }
    at(500, function () { card.classList.add('copied'); });
    at(1700, function () { card.classList.remove('copied'); });
    at(1100, add);
  }
  var was = null;
  function check() { var on = p.classList.contains('on') && getComputedStyle(root).display !== 'none'; if (on === was) return; was = on; if (on) start(); else reset(); }
  new MutationObserver(check).observe(p, { attributes: true, attributeFilter: ['class'] }); check();
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* agents panel: connected agents add payment links to the same list your team uses */
  var ax = document.getElementById('v-ax'); if (!ax) return;
  var p = ax.closest('.nc-p'), list = document.getElementById('ax-list'), apps = ax.querySelectorAll('.ax-app'), start = list.innerHTML, t = null, n = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NAMES = ['ChatGPT', 'Claude', 'Gemini'];
  var LOGO = [].map.call(apps, function (a) { return a.querySelector('.ax-lg').outerHTML; });
  var R = [[0, 'Logo files for Kofi', '$350.00'], [1, 'Catering deposit', 'GH₵2,500'], [2, 'Hoodie restock', 'KSh 6,800'], [0, 'Consulting call', '$150.00'], [1, 'Event tickets', '₦45,000'], [2, 'Workshop seat', 'GH₵600']];
  function add() {
    var r = R[n % R.length]; n++;
    apps.forEach(function (a, i) { a.classList.toggle('on', i === r[0]); });
    var row = document.createElement('div'); row.className = 'ax-r in';
    row.innerHTML = LOGO[r[0]].replace('ax-lg', 'ax-av lg ax-lg') + '<span><b>' + r[1] + '</b><em>Created by ' + NAMES[r[0]] + ', just now</em></span><strong>' + r[2] + '</strong><u>Active</u>';
    list.insertBefore(row, list.firstChild);
    var rows = list.querySelectorAll('.ax-r:not(.out)');
    if (rows.length > 4) { var last = rows[rows.length - 1]; last.classList.add('out'); setTimeout(function () { last.remove(); }, 420); }
    if (n % 2 === 1) setTimeout(function () { var u = row.querySelector('u'); u.textContent = 'Paid'; u.classList.add('paid'); }, 1700);
    t = setTimeout(add, 2800);
  }
  function stop() { clearTimeout(t); t = null; }
  function reset() { stop(); n = 0; list.innerHTML = start; apps.forEach(function (a) { a.classList.remove('on'); }); }
  var was = false;
  function check() { var on = p.classList.contains('on'); if (on === was) return; was = on; if (on) { reset(); if (!reduce) t = setTimeout(add, 700); } else reset(); }
  new MutationObserver(check).observe(p, { attributes: true, attributeFilter: ['class'] }); check();
})();
} catch (e) { console.error(e); }
try {
(function () {
  /* hero: a faint dot grid that scatters as you scroll away, and leans away from the cursor */
  var hero = document.getElementById('hero'); if (!hero) return;
  var c = document.createElement('canvas'); c.className = 'hdots'; c.setAttribute('aria-hidden', 'true'); hero.insertBefore(c, hero.firstChild);
  var x = c.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dots = [], W = 0, H = 0, dpr = 1, mx = -999, my = -999, raf = 0, GAP = 18;
  function build() {
    dpr = Math.min(2, devicePixelRatio || 1); W = hero.clientWidth; H = hero.clientHeight;
    c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
    dots = []; var cx = W / 2, cy = H * .45;
    for (var yy = GAP / 2; yy < H; yy += GAP) for (var xx = GAP / 2; xx < W; xx += GAP) {
      var a = Math.atan2(yy - cy, xx - cx) + (Math.random() - .5) * 1.4, d = 18 + Math.random() * 70;
      dots.push([xx, yy, Math.cos(a) * d, Math.sin(a) * d, .5 + Math.random() * .5]);
    }
    draw();
  }
  function draw() {
    raf = 0; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
    var s = reduce ? 0 : Math.max(0, Math.min(1, scrollY / (H * .7))), e = s * s * (3 - 2 * s);
    if (s >= 1) return;
    x.fillStyle = 'rgb(11,12,16)';
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i], px = d[0] + d[2] * e, py = d[1] + d[3] * e;
      var lift = 0;
      if (!reduce && mx > -900) { var dx = px - mx, dy = py - my, r2 = dx * dx + dy * dy; if (r2 < 32400) { var dd = Math.sqrt(r2), k = 1 - dd / 180; lift = k * k * (3 - 2 * k); if (dd < 90) { var f = (1 - dd / 90) * 6 / Math.max(1, dd); px += dx * f; py += dy * f; } } }
      x.globalAlpha = (.1 + .2 * lift) * (1 - e * .85) * (d[4] * e + (1 - e));
      x.beginPath(); x.arc(px, py, .9, 0, 6.2832); x.fill();
    }
  }
  function ask() { if (!raf) raf = requestAnimationFrame(draw); }
  build(); addEventListener('resize', function () { clearTimeout(build.t); build.t = setTimeout(build, 150); });
  addEventListener('scroll', function () { if (scrollY < H * 1.1) ask(); }, { passive: true });
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    hero.addEventListener('pointermove', function (ev) { var r = hero.getBoundingClientRect(); mx = ev.clientX - r.left; my = ev.clientY - r.top; ask(); });
    hero.addEventListener('pointerleave', function () { mx = my = -999; ask(); });
  }
})();
} catch (e) { console.error(e); }
