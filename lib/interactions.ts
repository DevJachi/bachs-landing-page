// @ts-nocheck
// All page behaviour (nav, scenes, globe, tabs, FAQ, theme). Ported from the artifact; runs once on the client.
import land from "./landmask.json";

export function initSite() {
  if (typeof window === "undefined" || (window as any).__bachsInit) return;
  (window as any).__bachsInit = true;
  (window as any).__BACHS_IMG = {"icon": "/images/icon-256.png", "build": "/images/develop.webp", "accept": "/images/acceptwebp.webp", "settle": "/images/settle.webp"};
  (window as any).__LAND = land;

  var IMG = window.__BACHS_IMG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Navigation ---------- */
  var nav = $('#nav');
  if (nav) {
    var inner = nav.firstElementChild;
    var logo = inner.firstElementChild;
    var pill = $('.nav-desktop-links', nav);
    var actions = $('.nav-desktop-actions', nav);
    var navBg = function () { return document.documentElement.classList.contains('theme-dark') ? '#0b0c10' : '#ffffff'; };
    nav.style.background = navBg();
    nav.style.transition = 'background .35s ease-in-out, border-bottom-color .35s ease-in-out';
    [logo, actions].forEach(function (el) { if (el) el.style.transition = 'opacity .25s'; });

    var icon = document.createElement('a');
    icon.href = 'https://bachs.io/';
    icon.style.cssText = 'display:flex;align-items:center;text-decoration:none;border-right:1px solid rgba(0,0,0,0.1);overflow:hidden;white-space:nowrap;width:0;opacity:0;padding:0;transition:all .3s ease-in-out;align-self:stretch';
    icon.innerHTML = '<img alt="Bachs" style="height:1.5rem;border-radius:0.25rem">';
    icon.firstChild.src = IMG.icon || '';
    if (pill) pill.insertBefore(icon, pill.firstChild);

    var scrolled = null;
    var onScroll = function () {
      var s = window.scrollY > 20;
      if (s === scrolled) return;
      scrolled = s;
      nav.style.background = s ? 'transparent' : navBg();
      nav.style.borderBottomColor = s ? 'rgba(0,0,0,0)' : (document.documentElement.classList.contains('theme-dark') ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)');
      [logo, actions].forEach(function (el) {
        if (!el) return;
        el.style.opacity = s ? '0' : '1';
        el.style.pointerEvents = s ? 'none' : 'auto';
      });
      icon.style.width = s ? '3rem' : '0';
      icon.style.opacity = s ? '1' : '0';
      icon.style.padding = s ? '0 0.75rem' : '0';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    window.__navRefresh = function () { scrolled = null; onScroll(); };

    /* Mobile menu */
    var burger = $('.nav-hamburger', nav);
    var menu = null;
    var closeMenu = function () {
      if (menu) {
        var old = menu; menu = null;
        old.classList.remove('is-open');
        setTimeout(function () { old.remove(); }, 320);
      }
      document.body.style.overflow = '';
      document.documentElement.classList.remove('menu-open');
      setBurger(false);
    };
    var setBurger = function (open) {
      if (!burger) return;
      var b = burger.children;
      if (b[0]) b[0].style.transform = open ? 'translateY(6.5px) rotate(45deg)' : 'none';
      if (b[1]) b[1].style.opacity = open ? '0' : '1';
      if (b[2]) b[2].style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : 'none';
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    if (burger) burger.addEventListener('click', function () {
      if (menu) return closeMenu();
      // full-screen sheet under the nav bar; links slide in one after another
      menu = document.createElement('div');
      menu.className = 'm-menu';
      menu.style.paddingTop = (Math.max(0, nav.getBoundingClientRect().bottom) + 12) + 'px';
      var list = document.createElement('nav'); list.className = 'm-links'; list.setAttribute('aria-label', 'Menu');
      var i = 0;
      $$('.nav-desktop-links a', nav).forEach(function (a) {
        if (a === icon || /Book a Demo/.test(a.textContent)) return;
        var m = document.createElement('a');
        m.className = 'm-link'; m.href = a.href; m.textContent = a.textContent.trim(); m.style.setProperty('--i', i++);
        if (a.target) { m.target = a.target; m.rel = 'noopener noreferrer'; }
        m.addEventListener('click', closeMenu);
        list.appendChild(m);
      });
      menu.appendChild(list);
      var btns = document.createElement('div');
      btns.className = 'm-actions'; btns.style.setProperty('--i', i);
      btns.innerHTML =
        '<a class="m-btn m-btn-ghost" href="https://app.bachs.io/login">Sign in</a>' +
        '<a class="m-btn m-btn-dark" href="https://app.bachs.io/signup" target="_blank" rel="noopener noreferrer">Get started<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        '<a class="m-btn m-btn-ghost" href="https://cal.com/collins-uzuegbu-gvs5s7/bachsintro" target="_blank" rel="noopener noreferrer">Book a demo</a>';
      menu.appendChild(btns);
      document.body.appendChild(menu);
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('menu-open');
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (menu) menu.classList.add('is-open'); }); });
      setBurger(true);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 640) closeMenu(); });
  }

  /* ---------- Theme toggle: light / dark, remembered on this device ---------- */
  (function () {
    var root = document.documentElement;
    var SUN = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M8 1.5v1.3M8 13.2v1.3M14.5 8h-1.3M2.8 8H1.5M12.6 3.4l-.9.9M4.3 11.7l-.9.9M12.6 12.6l-.9-.9M4.3 4.3l-.9-.9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
    var MOON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.6 9.9A5.9 5.9 0 0 1 6.1 2.4a5.9 5.9 0 1 0 7.5 7.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    var buttons = [];
    var paint = function () {
      var dark = root.classList.contains('theme-dark');
      buttons.forEach(function (b) {
        b.innerHTML = dark ? SUN : MOON;
        b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      });
    };
    var flip = function () {
      root.classList.add('theme-anim');
      root.classList.toggle('theme-dark');
      try { localStorage.setItem('bachs-theme', root.classList.contains('theme-dark') ? 'dark' : 'light'); } catch (e) {}
      paint();
      if (window.__navRefresh) window.__navRefresh();
      setTimeout(function () { root.classList.remove('theme-anim'); }, 450);
      try { document.dispatchEvent(new Event('bachs-theme')); } catch (e) {}
    };
    var make = function (cls) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'theme-toggle ' + cls;
      b.addEventListener('click', flip);
      buttons.push(b); return b;
    };
    var actions = $('.nav-desktop-actions');
    if (actions) actions.insertBefore(make('tt-desk'), actions.firstChild);
    var burgerBtn = $('.nav-hamburger');
    if (burgerBtn) burgerBtn.parentNode.insertBefore(make('tt-mob'), burgerBtn);
    paint();
  })();

  /* ---------- Build / Accept / Settle tabs ---------- */
  var TABS = {
    Build: { d: 'Built developer-first. Clear documentation, full API control, and one integration for every payment method.', img: IMG.build },
    Accept: { d: 'Accept payments from customers anywhere in the world: cards, mobile money, and stablecoins.', img: IMG.accept },
    Settle: { d: 'Settle in your local currency. NGN, GHS, KES, USD. You choose where your money lands.', img: IMG.settle }
  };
  var tabBtns = $$('.showcase-tab');
  var tabList = $('.showcase-tabs');
  var indicator = null;
  var placeIndicator = function (btn) {
    if (!indicator || !btn) return;
    tabList.style.setProperty('--ind-x', btn.offsetLeft + 'px');
    tabList.style.setProperty('--ind-w', btn.offsetWidth + 'px');
  };
  if (tabList) {
    indicator = document.createElement('span');
    indicator.className = 'showcase-tab-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    tabList.insertBefore(indicator, tabList.firstChild);
    // place it without animating on load, on resize and once the web font has loaded
    var snap = function () {
      tabList.classList.add('no-anim');
      placeIndicator($('.showcase-tab.is-active'));
      void tabList.offsetWidth;
      tabList.classList.remove('no-anim');
    };
    snap();
    window.addEventListener('resize', snap);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(snap);
  }
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.dataset.tab, t = TABS[name];
      if (!t || btn.classList.contains('is-active')) return;
      tabBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      placeIndicator(btn);
      var desc = $('.showcase-description'), img = $('.showcase-image');
      [desc, img].forEach(function (el) { if (el) el.style.opacity = '0'; });
      setTimeout(function () {
        if (desc) desc.textContent = t.d;
        if (img && t.img) { img.src = t.img; img.alt = 'Bachs dashboard: ' + name; }
        [desc, img].forEach(function (el) { if (el) el.style.opacity = '1'; });
      }, 200);
    });
  });

  /* ---------- SDK tabs ---------- */
  var SDK = {
    'Node.js': { title: 'Node.js SDK', d: 'Build payment flows in Node.js with a comprehensive client for checkout sessions, subscriptions, webhooks, and settlement workflows.', list: ['Hosted Checkout Sessions', 'Subscription Lifecycle APIs', 'Webhook Signature Verification', 'Tax & Settlement Controls'], file: 'nvim api/checkout/route.ts',
      code: "// api/checkout/route.ts\nimport Bachs from '@bachs/sdk'\n\nconst b = new Bachs({ key: process.env.BACHS_KEY })\n\nconst session = await b.checkout.create({\n  product:    'prod_pro_monthly',\n  billing:    'subscription',\n  tax:        'auto',\n  crypto:     true,\n  settlement: 'NGN',\n})",
      term: '~ % npm install @bachs/sdk\n✓ Installing...\n✓ Compiled in 112ms' },
    'Python': { title: 'Python SDK', d: 'Build payment flows in Python with a lightweight client for checkout sessions, subscriptions, webhooks, and settlement workflows.', list: ['Hosted Checkout Sessions', 'Subscription Lifecycle APIs', 'Webhook Signature Verification', 'Tax & Settlement Controls'], file: 'nvim api/checkout.py',
      code: '# api/checkout.py\nfrom bachs_sdk import Bachs\n\nclient = Bachs("bk_live_xxx")\n\nsession = client.checkout.create(\n  settlement="NGN",\n  tax="auto",\n  billing="subscription",\n)',
      term: '~ % pip install bachs-sdk\n✓ Installing...\n✓ Ready in 0.9s' },
    'Go': { title: 'Go SDK', d: 'Use strongly typed Go helpers to create checkout sessions, automate billing, and receive settlement events with predictable performance.', list: ['Typed Checkout Client', 'Plan & Usage Billing APIs', 'Webhook Event Parsing', 'Fast Settlement Orchestration'], file: 'nvim api/checkout/main.go',
      code: '// api/checkout/main.go\npackage main\n\nimport "github.com/bachs/bachs-go"\n\nfunc main() {\n  client := bachs.New("bk_live_xxx")\n  _, _ = client.Checkout.Create(bachs.CheckoutParams{\n    Settlement: "NGN",\n    Tax:        "auto",\n    Billing:    "subscription",\n  })\n}',
      term: '~ % go get github.com/bachs/bachs-sdk-go\n✓ Downloading modules...\n✓ Build complete' },
    'REST API': { title: 'REST API', d: 'Use the HTTP API directly for checkout, subscriptions, tax, settlement, and webhooks when you want language-agnostic integration.', list: ['Simple HTTPS Endpoints', 'Idempotent Request Support', 'Signed Webhook Events', 'Global Payment Flows'], file: 'nvim api/checkout.http',
      code: '# api/checkout.http\nPOST /v1/checkout\nHost: api.bachs.io\nAuthorization: Bearer bk_live_xxx\nContent-Type: application/json\n\n{\n  "product": "prod_pro_monthly",\n  "billing": "subscription",\n  "tax": "auto",\n  "crypto": true,\n  "settlement": "NGN"\n}',
      term: '~ % curl https://api.bachs.io/v1/checkout\n✓ 201 Created\n✓ session_url returned' }
  };
  var sdk2 = $('.sdk2');
  if (sdk2) {
    var esc = function (t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var KW = /\b(import|from|const|await|new|package|func|return|true|false|POST|GET)\b/;
    var highlight = function (line) {
      var re = /(\/\/.*$|^\s*#.*$)|('[^']*'|"[^"]*")|\b(import|from|const|await|new|package|func|return|true|false|POST|GET)\b|\b(\d[\d_]*)\b|([{}()\[\],:.=])/g;
      var out = '', last = 0, m;
      while ((m = re.exec(line))) {
        out += esc(line.slice(last, m.index));
        var cls = m[1] ? 'tk-c' : m[2] ? 'tk-s' : m[3] ? 'tk-k' : m[4] ? 'tk-n' : 'tk-p';
        out += '<span class="' + cls + '">' + esc(m[0]) + '</span>';
        last = m.index + m[0].length;
      }
      return out + esc(line.slice(last));
    };
    var linesEl = $('.sdk2-lines', sdk2), termEl = $('.sdk2-term', sdk2), fileEl = $('.sdk2-file', sdk2);
    var titleEl = $('.sdk2-title', sdk2), descEl = $('.sdk2-desc', sdk2), listEls = $$('.sdk2-list span', sdk2);
    var current = 'Node.js';
    var paint = function (s) {
      fileEl.textContent = s.file.replace(/^nvim\s+/, '');
      linesEl.innerHTML = s.code.split('\n').map(function (l) { return '<li>' + (highlight(l) || ' ') + '</li>'; }).join('');
      termEl.innerHTML = s.term.split('\n').map(function (l) {
        if (l.charAt(0) === '✓') return '<span class="ok">' + esc(l) + '</span>';
        if (l.charAt(0) === '~') return '<span class="prompt">~ %</span>' + esc(l.slice(3));
        return esc(l);
      }).join('\n');
      titleEl.textContent = s.title; descEl.textContent = s.d;
      listEls.forEach(function (el, i) { el.textContent = s.list[i] || ''; });
    };
    paint(SDK[current]);

    var tabs = $$('.sdk2-tabs button', sdk2), tabBar = $('.sdk2-tabs', sdk2);
    var ind = document.createElement('span'); ind.className = 'sdk2-ind'; ind.setAttribute('aria-hidden', 'true');
    tabBar.insertBefore(ind, tabBar.firstChild);
    var place = function (btn, snap) {
      if (snap) ind.style.transition = 'none';
      tabBar.style.setProperty('--x', btn.offsetLeft + 'px'); tabBar.style.setProperty('--w', btn.offsetWidth + 'px');
      if (snap) { void ind.offsetWidth; ind.style.transition = ''; }
    };
    var snapActive = function () { place($('.sdk2-tabs .is-active', sdk2), true); };
    snapActive(); window.addEventListener('resize', snapActive);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(snapActive);
    var swapEls = [$('.sdk2-copy', sdk2), $('.sdk2-code', sdk2), termEl];
    swapEls.forEach(function (el) { el.classList.add('sdk2-swap'); });
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.sdk; if (key === current || !SDK[key]) return;
        current = key;
        tabs.forEach(function (t) { var on = t === btn; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
        place(btn);
        swapEls.forEach(function (el) { el.classList.add('is-out'); });
        setTimeout(function () { paint(SDK[key]); swapEls.forEach(function (el) { el.classList.remove('is-out'); }); }, 180);
      });
    });

    var copyBtn = $('.sdk2-copybtn', sdk2), copyLabel = $('span', copyBtn), copyTimer;
    copyBtn.addEventListener('click', function () {
      var text = SDK[current].code;
      var done = function () { copyLabel.textContent = 'Copied'; clearTimeout(copyTimer); copyTimer = setTimeout(function () { copyLabel.textContent = 'Copy'; }, 1600); };
      try {
        navigator.clipboard.writeText(text).then(done, function () { selectCode(); });
      } catch (e) { selectCode(); }
    });
    var selectCode = function () {
      var r = document.createRange(); r.selectNodeContents(linesEl);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      copyLabel.textContent = 'Press Ctrl+C';
    };
  }

  /* ---------- Logo marquee: repeat the set so the loop is seamless ---------- */
  var marquee = $('.logo-marquee');
  if (marquee && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var track = $('.logo-track', marquee), set = $('.logo-set', marquee);
    set.innerHTML += set.innerHTML;                 // each half is wider than the strip
    $$('img', set).slice($$('img', set).length / 2).forEach(function (i) { i.alt = ''; });
    var copy = set.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    $$('img', copy).forEach(function (i) { i.alt = ''; });
    track.appendChild(copy);
    marquee.classList.add('is-ready');
  }

  /* ---------- The gap: words go from grey to their colour as the statement scrolls through ---------- */
  var gapText = $('[data-scroll-words]');
  if (gapText) {
    var words = [];
    $$('[data-tone]', gapText).forEach(function (part) {
      var tone = part.dataset.tone;
      var parts = part.textContent.trim().split(/\s+/);
      part.textContent = '';
      parts.forEach(function (w, i) {
        var s = document.createElement('span');
        s.className = 'gap-word'; s.dataset.tone = tone; s.textContent = w;
        part.appendChild(s);
        if (i < parts.length - 1) part.appendChild(document.createTextNode(' '));
        words.push(s);
      });
    });
    gapText.classList.add('is-split');
    var reduceGap = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lit = -1, ticking = false;
    var update = function () {
      ticking = false;
      var r = gapText.getBoundingClientRect(), vh = window.innerHeight;
      // starts when the statement's top reaches 85% of the screen, done when its bottom reaches 45%
      var start = vh * 0.85, end = vh * 0.45;
      var p = (start - r.top) / ((start - end) + r.height);
      p = Math.max(0, Math.min(1, p));
      var n = reduceGap ? words.length : Math.round(p * words.length);
      if (n === lit) return;
      lit = n;
      words.forEach(function (w, i) { w.classList.toggle('is-on', i < n); });
    };
    var onScrollGap = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScrollGap, { passive: true });
    window.addEventListener('resize', onScrollGap);
    update();
  }

  /* ---------- Fast card: draw each rail from a chip's real edge to the Bachs mark ---------- */
  var hub = $('.hub');
  if (hub) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var lines = $('.hub-lines', hub), core = $('.hub-core', hub), outChip = $('.hub-out', hub);
    var drawHub = function () {
      var box = hub.getBoundingClientRect();
      if (!box.width) return;
      lines.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
      lines.innerHTML = '';
      var c = core.getBoundingClientRect();
      var cx1 = c.left - box.left, cx2 = c.right - box.left, cy = c.top - box.top + c.height / 2;
      var paths = [];
      $$('.hub-src', hub).forEach(function (chip) {
        var r = chip.getBoundingClientRect();
        var x1 = r.right - box.left, y1 = r.top - box.top + r.height / 2, mid = (x1 + cx1) / 2;
        paths.push('M' + x1 + ' ' + y1 + ' C' + mid + ' ' + y1 + ' ' + mid + ' ' + cy + ' ' + cx1 + ' ' + cy);
      });
      var o = outChip.getBoundingClientRect();
      paths.push('M' + cx2 + ' ' + cy + ' L' + (o.left - box.left) + ' ' + cy);
      paths.forEach(function (d, i) {
        var base = document.createElementNS(svgNS, 'path');
        base.setAttribute('d', d); base.setAttribute('class', 'base');
        var pulse = document.createElementNS(svgNS, 'path');
        pulse.setAttribute('d', d); pulse.setAttribute('class', 'pulse'); pulse.setAttribute('pathLength', '100');
        pulse.style.setProperty('--d', (i === paths.length - 1 ? 1.4 : i * 0.9) + 's');
        lines.appendChild(base); lines.appendChild(pulse);
      });
    };
    drawHub();
    window.addEventListener('resize', drawHub);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawHub);
  }

  /* ---------- Global card: hovering a tile sends a soft ripple out from it; ₦ turns its border light ---------- */
  var curGrid = $('.cur-grid');
  if (curGrid && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var curTiles = $$('.cur-tile', curGrid), COLS = 5, busyUntil = 0, lastIdx = -1;
    var ripple = function (from) {
      var now = Date.now();
      if (from === lastIdx && now < busyUntil) return;
      if (now < busyUntil - 350) return;             // let a ripple mostly finish before the next one
      lastIdx = from;
      var fr = Math.floor(from / COLS), fc = from % COLS, maxD = 0;
      curTiles.forEach(function (t, i) {
        var d = Math.max(Math.abs(Math.floor(i / COLS) - fr), Math.abs(i % COLS - fc));
        maxD = Math.max(maxD, d);
        t.style.setProperty('--rd', (d * 70) + 'ms');
        t.classList.remove('is-ripple');
      });
      void curGrid.offsetWidth;                       // restart the animation
      curTiles.forEach(function (t) { t.classList.add('is-ripple'); });
      busyUntil = now + 700 + maxD * 70;
    };
    curTiles.forEach(function (t, i) {
      t.addEventListener('mouseenter', function () {
        ripple(i);
        if (t.classList.contains('is-lit') && !t.classList.contains('is-turning')) {
          t.classList.add('is-turning');
          setTimeout(function () { t.classList.remove('is-turning'); }, 1450);
        }
      });
    });
  }

  /* ---------- One-time reveal for the card grids (stays visible if this never runs) ---------- */
  if ('IntersectionObserver' in window && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var grids = $$('#features .features-grid, .bento-grid');
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); revealObs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    grids.forEach(function (g) {
      var r = g.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.88) return;   // already on screen: leave it as is
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--ri', i); });
      g.classList.add('reveal-ready');
      revealObs.observe(g);
    });
  }

  /* ---------- FAQ: one open at a time, smooth height via grid rows ---------- */
  $$('.faq2-item').forEach(function (item) {
    var q = $('.faq2-q', item);
    q.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      $$('.faq2-item').forEach(function (x) { x.classList.remove('is-open'); $('.faq2-q', x).setAttribute('aria-expanded', 'false'); });
      if (!open) { item.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); }
    });
  });

  /* ---------- Platform: Pay shows a receipt, then the card resets ---------- */
  var payBtn = $('.pc-btn');
  if (payBtn) {
    var payCard = payBtn.closest('.pc'), payBusy = false;
    payBtn.addEventListener('click', function () {
      if (payBusy) return; payBusy = true;
      payBtn.classList.add('is-busy');
      setTimeout(function () {
        payBtn.classList.remove('is-busy');
        payCard.classList.add('is-paid');
        setTimeout(function () { payCard.classList.remove('is-paid'); payBusy = false; }, 2600);
      }, 750);
    });
  }

  /* ---------- Testimonials: hovering, clicking or focusing a card opens it ---------- */
  var tmCards = $$('.tm-card');
  var openCard = function (c) { tmCards.forEach(function (x) { x.classList.toggle('is-active', x === c); }); };
  tmCards.forEach(function (c) {
    c.addEventListener('mouseenter', function () { if (window.innerWidth > 860) openCard(c); });
    c.addEventListener('click', function () { openCard(c); });
    c.addEventListener('focus', function () { openCard(c); });
  });

  /* ---------- CTA globe: a rotating ASCII earth with money moving between cities ---------- */
  var globeCanvas = $('.cta2-globe canvas');
  if (globeCanvas && window.__LAND) {
    var L = window.__LAND, raw = atob(L.bits), LW = L.w, LH = L.h;
    var landAt = function (lat, lon) {
      var r = Math.min(LH - 1, Math.max(0, Math.floor((90 - lat) / 180 * LH)));
      var c = Math.floor(((lon + 180) % 360 + 360) % 360 / 360 * LW);
      var i = r * LW + c;
      return (raw.charCodeAt(i >> 3) >> (i & 7)) & 1;
    };
    var CITIES = { lagos: [6.5, 3.4], accra: [5.6, -0.2], nairobi: [-1.3, 36.8], joburg: [-26.2, 28.0], london: [51.5, -0.1], newyork: [40.7, -74.0], kampala: [0.35, 32.6], dubai: [25.2, 55.3], saopaulo: [-23.5, -46.6], paris: [48.9, 2.35] };
    var ROUTES = [['london', 'lagos'], ['newyork', 'accra'], ['lagos', 'nairobi'], ['dubai', 'kampala'], ['paris', 'joburg'], ['saopaulo', 'lagos'], ['nairobi', 'london'], ['accra', 'joburg']];
    var RAD = Math.PI / 180;
    var toVec = function (lat, lon) { var a = lat * RAD, b = lon * RAD; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };
    var slerp = function (p, q, t) {
      var d = Math.acos(Math.max(-1, Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2])));
      if (d < 1e-6) return p.slice();
      var s = Math.sin(d), a = Math.sin((1 - t) * d) / s, b = Math.sin(t * d) / s;
      return [p[0] * a + q[0] * b, p[1] * a + q[1] * b, p[2] * a + q[2] * b];
    };
    var ctx = globeCanvas.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), size = 0, cell = 0;
    var TILT = -18 * RAD, spin = -20 * RAD, last = 0, running = false;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var resize = function () {
      size = globeCanvas.clientWidth; if (!size) return;
      globeCanvas.width = size * dpr; globeCanvas.height = size * dpr;
      cell = Math.max(7, Math.round(size / 64));
    };
    // rotate a world vector into view space: spin about Y, then tilt about X
    var view = function (v) {
      var cs = Math.cos(spin), sn = Math.sin(spin);
      var x = v[0] * cs + v[2] * sn, z = -v[0] * sn + v[2] * cs, y = v[1];
      var ct = Math.cos(TILT), st = Math.sin(TILT);
      return [x, y * ct - z * st, y * st + z * ct];
    };
    var draw = function (t) {
      if (!size) return;
      var W = size * dpr, R = W * 0.47, cx = W / 2, cy = W / 2, step = cell * dpr;
      ctx.clearRect(0, 0, W, W);
      // soft atmosphere
      var g = ctx.createRadialGradient(cx, cy, R * .6, cx, cy, R * 1.06);
      g.addColorStop(0, 'rgba(82,102,235,0)'); g.addColorStop(.85, 'rgba(82,102,235,.06)'); g.addColorStop(1, 'rgba(82,102,235,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(82,102,235,.18)'; ctx.lineWidth = 1 * dpr; ctx.beginPath(); ctx.arc(cx, cy, R * 1.005, 0, Math.PI * 2); ctx.stroke();
      ctx.font = '600 ' + Math.round(step * 1.02) + 'px "Geist Mono", ui-monospace, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var cs = Math.cos(spin), sn = Math.sin(spin), ct = Math.cos(TILT), st = Math.sin(TILT);
      var LAND_CH = '.:-=+*#%@';
      for (var py = cy - R; py <= cy + R; py += step) {
        for (var px = cx - R; px <= cx + R; px += step) {
          var x = (px - cx) / R, y = -(py - cy) / R, rr = x * x + y * y;
          if (rr > 1) continue;
          var z = Math.sqrt(1 - rr);
          // undo tilt, then undo spin, to get the world point under this cell
          var y1 = y * ct + z * st, z1 = -y * st + z * ct;
          var wx = x * cs - z1 * sn, wz = x * sn + z1 * cs;
          var lat = Math.asin(Math.max(-1, Math.min(1, y1))) / RAD, lon = Math.atan2(wx, wz) / RAD;
          var light = .35 + .65 * Math.max(0, x * -.35 + y * .45 + z * .82);
          if (landAt(lat, lon)) {
            var k = Math.min(LAND_CH.length - 1, Math.floor(light * LAND_CH.length));
            ctx.fillStyle = 'rgba(' + Math.round(40 + 40 * (1 - light)) + ',' + Math.round(70 + 30 * light) + ',' + Math.round(200 + 35 * light) + ',' + (.45 + .55 * light) + ')';
            ctx.fillText(LAND_CH[k], px, py);
          } else if (((px / step + py / step) | 0) % 2 === 0) {
            ctx.fillStyle = 'rgba(40,60,140,' + (.10 + .14 * light) + ')';
            ctx.fillText('·', px, py);
          }
        }
      }
      // transfer arcs: lifted great circles with a pulse running along each
      ROUTES.forEach(function (rt, i) {
        var p = toVec.apply(null, CITIES[rt[0]]), q = toVec.apply(null, CITIES[rt[1]]);
        var N = 48, pts = [];
        for (var k = 0; k <= N; k++) {
          var tt = k / N, v = slerp(p, q, tt), lift = 1 + .22 * Math.sin(Math.PI * tt);
          var w = view([v[0] * lift, v[1] * lift, v[2] * lift]);
          pts.push([cx + w[0] * R, cy - w[1] * R, w[2]]);
        }
        ctx.lineWidth = 1.5 * dpr; ctx.lineCap = 'round';
        for (var k2 = 1; k2 < pts.length; k2++) {
          var a = pts[k2 - 1], b2 = pts[k2];
          if (a[2] < -.05 && b2[2] < -.05) continue;
          ctx.strokeStyle = 'rgba(52,86,226,' + (.32 + .4 * Math.max(0, (a[2] + b2[2]) / 2)) + ')';
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b2[0], b2[1]); ctx.stroke();
        }
        var head = ((t / 2600) + i * .37) % 1, hi = Math.floor(head * N);
        for (var tail = 0; tail < 14; tail++) {
          var idx = hi - tail; if (idx < 1) break;
          var A = pts[idx - 1], Bp = pts[idx];
          if (Bp[2] < -.05) continue;
          ctx.strokeStyle = i % 3 === 2 ? 'rgba(24,170,110,' + (1 - tail / 14) + ')' : 'rgba(40,80,230,' + (1 - tail / 14) + ')';
          ctx.lineWidth = (3 - tail * .15) * dpr;
          ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(Bp[0], Bp[1]); ctx.stroke();
        }
        [p, q].forEach(function (c) {
          var w = view(c); if (w[2] < 0) return;
          ctx.fillStyle = 'rgba(47,91,224,.9)';
          ctx.beginPath(); ctx.arc(cx + w[0] * R, cy - w[1] * R, 2.6 * dpr, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = 'rgba(47,91,224,.25)'; ctx.lineWidth = 4 * dpr;
          ctx.beginPath(); ctx.arc(cx + w[0] * R, cy - w[1] * R, 5 * dpr, 0, Math.PI * 2); ctx.stroke();
        });
      });
    };
    var frame = function (now) {
      if (!running) return;
      if (now - last > 33) { spin += (now - last) * 0.00012; last = now; draw(now); }
      requestAnimationFrame(frame);
    };
    resize(); draw(0);
    window.addEventListener('resize', function () { resize(); draw(last); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(last); });
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
        else if (!vis) running = false;
      }).observe(globeCanvas);
    }
  }

  /* ---------- Platform scene 1: checkout. Pick a method, pay, watch it land in Payments ---------- */
  var co = $('[data-checkout]');
  if (co) {
    var LABEL = { card: 'Pay GH₵ 600.00', bank: 'Get account details', momo: 'Continue with mobile money', crypto: 'Continue with USDT' };
    var METHOD_ROW = { card: 'Card · Visa 4242', bank: 'Bank transfer', momo: 'MTN MoMo', crypto: 'Crypto · TRON (TRC-20)' };
    var coMethod = 'momo', coPay = $('[data-pay]', co), views = $$('.co-view', co);
    var show = function (name) { views.forEach(function (v) { v.hidden = v.dataset.view !== name; }); };
    $$('.co-m', co).forEach(function (m) {
      m.addEventListener('click', function () {
        coMethod = m.dataset.m;
        $$('.co-m', co).forEach(function (x) { var on = x === m; x.classList.toggle('is-open', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
        $$('.co-body', co).forEach(function (b) { b.classList.toggle('is-open', b.dataset.body === coMethod); });
        coPay.textContent = LABEL[coMethod];
      });
    });
    $$('.co-nets', co).forEach(function (group) {
      $$('button', group).forEach(function (b) { b.addEventListener('click', function () { $$('button', group).forEach(function (x) { x.classList.toggle('is-on', x === b); }); }); });
    });
    coPay.addEventListener('click', function () {
      show(coMethod === 'momo' ? 'approve' : 'approve');
      $('.co-view[data-view="approve"] .co-h', co).textContent = coMethod === 'momo' ? 'Approve on your phone' : coMethod === 'bank' ? 'Waiting for confirmation' : coMethod === 'crypto' ? 'Confirming your payment' : 'Processing payment';
      $('.co-view[data-view="approve"] .co-p', co).textContent = coMethod === 'momo' ? 'A prompt was sent to your phone. Approve it to complete this payment.' : coMethod === 'crypto' ? 'Finding it on the network.' : 'This only takes a moment.';
      setTimeout(function () {
        show('done');
        var rows = $('[data-pay-rows]');
        if (rows) {
          var net = $('.co-body[data-body="momo"] .co-net.is-on', co);
          var r = document.createElement('div'); r.className = 'app-tr is-new';
          r.innerHTML = '<span class="num">GH₵ 600.00</span><span><i class="st st-ok">Succeeded</i></span><span>' + (coMethod === 'momo' && net ? net.textContent + ' MoMo' : METHOD_ROW[coMethod]) + '</span><span>ama@acme.io</span><span>Just now</span>';
          rows.insertBefore(r, rows.firstChild);
          if (rows.children.length > 7) rows.removeChild(rows.lastChild);
        }
      }, 750);
    });
    $('[data-again]', co).addEventListener('click', function () { show('form'); });
  }

  /* ---------- Platform scene 2: subscriptions. Change plan, choose proration, update ---------- */
  var sub = $('[data-sub]');
  if (sub) {
    var naira = function (n) { return '₦' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
    var current = { plan: 'Pro', price: 49000 }, pick = null, pro = 'now', mrr = 8412000;
    var preview = $('[data-sub-preview]', sub), save = $('[data-sub-save]', sub), saving = false;
    var render = function () {
      if (!pick || pick.plan === current.plan) { preview.innerHTML = 'Pick a plan to preview the change.'; save.disabled = true; return; }
      var diff = pick.price - current.price, part = Math.round(Math.abs(diff) * 0.68 / 100) * 100;   // 68% of the period left
      var verb = diff > 0 ? 'Upgrade' : 'Downgrade';
      preview.innerHTML = pro === 'now'
        ? verb + ' to <b>' + pick.plan + '</b>. ' + (diff > 0 ? 'A prorated charge of <b>' + naira(part) + '</b> is invoiced today.' : 'A credit of <b>' + naira(part) + '</b> applies to the next invoice.')
        : pro === 'next' ? verb + ' to <b>' + pick.plan + '</b> on <b>Dec 3, 2026</b>. Proration lands on the next invoice.'
        : verb + ' to <b>' + pick.plan + '</b> with no proration.';
      save.disabled = false;
    };
    $$('.sub-plans button', sub).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.sub-plans button', sub).forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
        pick = { plan: b.dataset.plan, price: +b.dataset.price }; render();
      });
    });
    $$('.sub-pro button', sub).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.sub-pro button', sub).forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
        pro = b.dataset.pro; render();
      });
    });
    save.addEventListener('click', function () {
      if (!pick || pick.plan === current.plan || saving) return;
      saving = true; save.classList.add('is-busy');
      setTimeout(function () { save.classList.remove('is-busy'); applyChange(); saving = false; }, 450);
    });
    var applyChange = function () {
      mrr += pick.price - current.price; current = pick; pick = null;
      $$('.sub-plans button', sub).forEach(function (x) { x.classList.toggle('is-current', x.dataset.plan === current.plan); });
      var planEl = $('[data-sub-plan]', sub); planEl.textContent = current.plan + ' · ' + naira(current.price) + ' monthly';
      planEl.classList.add('is-flash'); setTimeout(function () { planEl.classList.remove('is-flash'); }, 900);
      $('[data-sub-inv]', sub).textContent = naira(current.price) + ' on Dec 3, 2026';
      var row = $('[data-sub-row]');
      if (row) {
        $('[data-sub-product]', row).textContent = current.plan; $('[data-sub-amount]', row).textContent = naira(current.price) + ' / month';
        row.classList.add('is-flash'); setTimeout(function () { row.classList.remove('is-flash'); }, 1200);
      }
      var m = $('[data-mrr]'); if (m) m.textContent = '₦' + mrr.toLocaleString('en-US');
      render();
      preview.innerHTML = '<span class="sub-ok"><i><svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></i>Subscription updated to ' + current.plan + '</span>';
    };
  }

  /* ---------- Platform scene 3: plan features. Toggle a flag, every Pro customer's access follows ---------- */
  var editor = $('[data-plan-editor]');
  if (editor) {
    var paintAccess = function (animateFlag) {
      var on = $$('.pf-sw', editor).filter(function (s) { return s.getAttribute('aria-checked') === 'true'; }).map(function (s) { return s.dataset.flag; });
      $$('[data-access] [data-tier="pro"] .acc').forEach(function (cell) {
        cell.innerHTML = on.map(function (f) { return '<i' + (f === animateFlag ? ' class="is-in"' : '') + '>' + f + '</i>'; }).join('');
      });
    };
    paintAccess();
    $$('.pf-sw', editor).forEach(function (s) {
      s.addEventListener('click', function () {
        var now = s.getAttribute('aria-checked') !== 'true';
        s.setAttribute('aria-checked', now ? 'true' : 'false');
        paintAccess(now ? s.dataset.flag : null);
        var foot = $('[data-plan-foot]', editor);
        foot.textContent = (now ? 'Granted ' : 'Revoked ') + s.dataset.flag + ' for 47 Pro subscribers.';
        foot.classList.add('is-flash'); setTimeout(function () { foot.classList.remove('is-flash'); }, 900);
      });
    });
  }

  /* ---------- Global Checkout card: a faint dotted world map peeking in from the top right (desktop) ---------- */
  var fcard = $('#features .feat-checkout');
  if (fcard && window.__LAND) {
    var LM = window.__LAND, lraw = atob(LM.bits);
    var onLand = function (lat, lon) {
      var r = Math.min(LM.h - 1, Math.max(0, Math.floor((90 - lat) / 180 * LM.h)));
      var c = Math.floor(((lon + 180) % 360 + 360) % 360 / 360 * LM.w), i = r * LM.w + c;
      return (lraw.charCodeAt(i >> 3) >> (i & 7)) & 1;
    };
    var mc = document.createElement('canvas'); mc.className = 'feat-map'; mc.setAttribute('aria-hidden', 'true');
    fcard.appendChild(mc);   // last, so the card's position-based icon/title styles are unaffected
    var LAT_N = 78, LAT_S = -56;   // crop the empty poles
    var PINS = [[6.5, 3.4], [5.6, -0.2], [-1.3, 36.8], [51.5, -0.1], [40.7, -74.0], [-26.2, 28.0], [25.2, 55.3]];
    var drawMap = function () {
      var w = mc.clientWidth, h = mc.clientHeight; if (!w) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      mc.width = w * dpr; mc.height = h * dpr;
      var g = mc.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      var dark = document.documentElement.classList.contains('theme-dark');
      var step = 6.5;
      g.fillStyle = dark ? 'rgba(255,255,255,.26)' : 'rgba(30,30,42,.22)';
      for (var y = step / 2; y < h; y += step) {
        var lat = LAT_N - (y / h) * (LAT_N - LAT_S);
        for (var x = step / 2; x < w; x += step) {
          var lon = -180 + (x / w) * 360;
          if (onLand(lat, lon)) { g.beginPath(); g.arc(x, y, 1.15, 0, Math.PI * 2); g.fill(); }
        }
      }
      PINS.forEach(function (p) {
        var x = (p[1] + 180) / 360 * w, y = (LAT_N - p[0]) / (LAT_N - LAT_S) * h;
        var glow = g.createRadialGradient(x, y, 0, x, y, 9);
        glow.addColorStop(0, dark ? 'rgba(120,140,255,.55)' : 'rgba(82,102,235,.45)'); glow.addColorStop(1, 'rgba(82,102,235,0)');
        g.fillStyle = glow; g.beginPath(); g.arc(x, y, 9, 0, Math.PI * 2); g.fill();
        g.fillStyle = dark ? '#8ea0ff' : '#5266eb'; g.beginPath(); g.arc(x, y, 1.8, 0, Math.PI * 2); g.fill();
      });
    };
    drawMap();
    window.addEventListener('resize', drawMap);
    document.addEventListener('bachs-theme', drawMap);
  }

  /* ---------- Footer: back to top ---------- */
  var upLink = $('.foot2-up');
  if (upLink) upLink.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Platform: plan switches toggle ---------- */
  $$('.pc-switch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      sw.classList.toggle('off', !on);
      var dot = sw.parentElement.querySelector('i');
      if (dot) dot.classList.toggle('off', !on);
    });
  });

}
