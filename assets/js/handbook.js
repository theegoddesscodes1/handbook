/* The Handbook · Lilac Desk
   Everything on the site is built from data/products.json.
   Pages: index, guide, planner, apps, videos, help, faq.            */
(function () {
  'use strict';

  /* ---------- icons ---------- */
  var P = {
    home: '<path d="M4 11l8-7 8 7v9H4z"/>',
    start: '<circle cx="12" cy="12" r="8"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    plan: '<rect x="5" y="4" width="14" height="16" rx="1"/><path d="M9 9h6M9 13h6"/>',
    dev: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M11 18h2"/>',
    vid: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
    fix: '<path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0-2-2z"/>',
    faq: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    msg: '<path d="M4 5h16v11H9l-5 4z"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    grid: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
    check: '<path d="M5 12l4.5 4.5L19 7"/>',
    play: '<path d="M9 7l8 5-8 5z"/>',
    download: '<path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    file: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
    note: '<path d="M5 4h14v12l-4 4H5z"/><path d="M15 20v-4h4"/>',
    notebook: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 3v18M12 8h4M12 12h4"/>',
    tablet: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M11 18h2"/>',
    tabletWide: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M18 11v2"/>',
    android: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 6h6"/>',
    computer: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    sticker: '<path d="M5 4h14v9l-6 7H5z"/><path d="M13 20v-5a2 2 0 0 1 2-2h4"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    print: '<path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><rect x="7" y="14" width="10" height="6"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>'
  };
  function ic(name, size, w) {
    size = size || 18;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.3) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || P.file) + '</svg>';
  }

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function strip(s) { return String(s || '').replace(/<[^>]+>/g, ''); }
  function qs(k) { return new URLSearchParams(location.search).get(k); }
  function store(k, v) {
    try {
      if (v === undefined) { var r = localStorage.getItem('hb_' + k); return r ? JSON.parse(r) : null; }
      localStorage.setItem('hb_' + k, JSON.stringify(v));
    } catch (e) { return null; }
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function link(href, extra) {
    // keep the product in every link so shared links still open the right planner
    var h = state.product ? state.product.handle : null;
    if (!h || /^(https?:|mailto:)/.test(href)) return href;
    return href + (href.indexOf('?') > -1 ? '&' : '?') + 'p=' + encodeURIComponent(h) + (extra || '');
  }

  /* ---------- analytics hook ----------
     Page views are counted by the analytics script in each page's <head>.
     track() records clicks like "helpful" and "fixed it" once a tool is chosen. */
  function track(name, data) {
    try { if (typeof window.hbTrack === 'function') window.hbTrack(name, data || {}); } catch (e) {}
  }

  /* ---------- state ---------- */
  var D, state = { product: null, device: null, app: null, done: [] };

  function loadState() {
    var handle = qs('p');
    var visible = D.products.filter(function (p) { return !p.hidden; });
    // a product is found by its current Shopify handle or any old one listed in "aliases"
    var find = function (h) { return D.products.filter(function (p) { return !p.hidden && (p.handle === h || (p.aliases || []).indexOf(h) !== -1); })[0]; };
    if (handle && find(handle)) store('product', find(handle).handle);
    state.product = find(handle) || find(store('product')) || null;
    if (!state.product && visible.length === 1) state.product = visible[0];
    var dv = store('device') || {};
    state.device = dv.device || 'ipad';
    state.app = dv.app || 'goodnotes';
    state.done = (state.product && store('done_' + state.product.handle)) || [];
  }
  function deviceName() { return (D.devices.filter(function (d) { return d.id === state.device; })[0] || {}).name || 'iPad'; }
  function appName() { return (D.apps.filter(function (a) { return a.id === state.app; })[0] || {}).name || 'GoodNotes'; }
  function guide(id) { return D.guides.filter(function (g) { return g.id === id; })[0]; }
  function nextStep() {
    for (var i = 0; i < D.setup.length; i++) if (state.done.indexOf(D.setup[i]) < 0) return D.setup[i];
    return null;
  }
  function markDone(id) {
    if (!state.product) return;
    if (state.done.indexOf(id) < 0) state.done.push(id);
    store('done_' + state.product.handle, state.done);
    track('step-done', { step: id });
  }

  /* ---------- chrome ---------- */
  var NAV = [
    ['home', 'Home', 'index.html', 'home'],
    ['start', 'Getting started', 'guide.html', 'start'],
    ['plan', 'My planner', 'planner.html', 'planner'],
    ['dev', 'Apps & devices', 'apps.html', 'apps'],
    ['vid', 'Videos', 'videos.html', 'videos']
  ];
  var NAV2 = [['fix', 'Troubleshooting', 'help.html', 'help'], ['faq', 'Questions', 'faq.html', 'faq']];
  var TABS = [['home', 'Home', 'index.html', 'home'], ['start', 'Start', 'guide.html', 'start'], ['plan', 'Planner', 'planner.html', 'planner'], ['vid', 'Videos', 'videos.html', 'videos'], ['fix', 'Help', 'help.html', 'help']];

  /* Videos stay hidden everywhere until at least one has a src in data/products.json */
  function hasVideos() { return (D.videos || []).some(function (v) { return v.src; }); }
  function navItems() { return hasVideos() ? NAV : NAV.filter(function (n) { return n[3] !== 'videos'; }); }
  function tabItems() { return hasVideos() ? TABS : TABS.map(function (n) { return n[3] === 'videos' ? ['dev', 'Apps', 'apps.html', 'apps'] : n; }); }

  function chrome(page) {
    var startHref = 'guide.html?g=' + (nextStep() || D.setup[0]);
    var href = function (h, k) { return link(k === 'start' ? startHref : h); };
    var side = '<aside class="sb"><div class="sbin"><a href="' + link('index.html') + '" aria-label="The Handbook home"><img class="logo" src="images/logo-white.png" alt="Lilac Desk"></a><div class="tag">THE HANDBOOK</div>' +
      '<nav aria-label="Handbook"><div class="gl">GUIDE</div>' +
      navItems().map(function (n) { return '<a class="ni' + (page === n[3] ? ' on' : '') + '" href="' + href(n[2], n[3]) + '"' + (page === n[3] ? ' aria-current="page"' : '') + '>' + ic(n[0]) + n[1] + '</a>'; }).join('') +
      '<div class="gl">HELP</div>' +
      NAV2.map(function (n) { return '<a class="ni' + (page === n[3] ? ' on' : '') + '" href="' + href(n[2], n[3]) + '"' + (page === n[3] ? ' aria-current="page"' : '') + '>' + ic(n[0]) + n[1] + '</a>'; }).join('') +
      '</nav><a class="sbchat" href="' + D.site.contactUrl + '">' + ic('msg', 17, 1.4) + 'Message me</a><div class="sbfoot">' + (D.site.licenseUrl ? '<a href="' + D.site.licenseUrl + '">LICENSE</a>' : '') + (D.site.refundsUrl ? '<a href="' + D.site.refundsUrl + '">REFUNDS</a>' : '') + '</div></div></aside>';
    var mtop = '<header class="mtop"><a href="' + link('index.html') + '" aria-label="The Handbook home"><img class="logo" src="images/logo-white.png" alt="Lilac Desk"></a><div class="mtopr"><a class="srchbtn chatbtn" href="' + D.site.contactUrl + '" aria-label="Message me">' + ic('msg', 20, 1.4) + '</a><button class="srchbtn" data-search aria-label="Search the Handbook">' + ic('search', 20) + '</button></div></header>';
    var tabs = '<nav class="tabbar" aria-label="Handbook">' + tabItems().map(function (n) {
      var on = page === n[3] || (n[3] === 'help' && page === 'faq');
      return '<a class="' + (on ? 'on' : '') + '" href="' + href(n[2], n[3]) + '"' + (on ? ' aria-current="page"' : '') + '><span class="pi">' + ic(n[0], 20) + '</span>' + n[1].toUpperCase() + '</a>';
    }).join('') + '</nav>';
    var search = '<div class="search" role="dialog" aria-modal="true" aria-label="Search the Handbook"><div class="spanel"><div class="sfield">' + ic('search', 18) + '<input type="search" placeholder="What do you need help with?" aria-label="Search the Handbook" autocomplete="off"><button data-sclose aria-label="Close search">' + ic('close', 18) + '</button></div><div class="sres"></div></div></div>';
    document.body.innerHTML = '<div class="shell">' + side + '<div class="main">' + mtop + '<div class="content" id="content"></div><footer class="foot wrap"><span class="cap">© ' + new Date().getFullYear() + ' LILAC DESK · THE HANDBOOK</span></footer></div></div>' + tabs + search;
    wireSearch();
    loadChat();
  }

  // Live chat: the Message me button and every contact link open a chat window instead of leaving the Handbook.
  function loadChat() {
    if (window.__lilacChatLoaded) return;
    window.LilacChat = { button: false, openers: 'a[href*="/pages/contact"]' };
    var s = document.createElement('script');
    s.src = 'assets/js/lilac-chat.js';
    s.async = true;
    document.body.appendChild(s);
  }

  function topbar(left) {
    return '<div class="topbar">' + left + '<button class="srchbtn" data-search aria-label="Search the Handbook">' + ic('search', 20) + '</button></div>';
  }
  function ctxBar() {
    var p = state.product;
    if (!p) return topbar('<div class="ctx cap"><span class="cur">THE HANDBOOK</span></div>');
    return topbar('<div class="ctx cap"><span class="cur">' + esc(p.name.toUpperCase()) + '</span><span class="hide-s">·</span><span class="hide-s">' + esc(p.edition.toUpperCase()) + '</span><span>·</span><span>' + esc((deviceName() + ' + ' + appName()).toUpperCase()) + '</span><a class="chg" href="' + link('apps.html') + '">CHANGE</a></div>');
  }
  function crumb(name) {
    return topbar('<div class="ctx cap"><a href="' + link('index.html') + '">HOME</a><span>/</span><span class="cur">' + esc(name.toUpperCase()) + '</span></div>');
  }
  function clipBox(src, note, big) {
    if (src) return '<div class="clip"><video src="' + esc(src) + '" controls playsinline preload="metadata"></video></div>';
    return '<div class="clip"><span class="play" style="' + (big ? '' : 'width:52px;height:52px') + '">' + ic('play', 22, 1.4) + '</span><span class="cap" style="font-size:10px;text-align:center;padding:0 16px">Clip coming soon' + (note ? ': ' + esc(note) : '') + '</span></div>';
  }
  function icard(icon, t, d, extra) {
    return '<div class="card icard"><span class="eico">' + ic(icon, 18) + '</span><span><span class="t">' + t + '</span><span class="d">' + d + '</span>' + (extra || '') + '</span></div>';
  }

  /* ---------- search ---------- */
  function searchIndex() {
    var out = [];
    D.guides.forEach(function (g) {
      var steps = Object.keys(g.steps).map(function (k) { return g.steps[k].join(' '); }).join(' ');
      out.push({ k: 'Guide', t: g.title, href: 'guide.html?g=' + g.id, text: g.title + ' ' + g.intro + ' ' + strip(steps) + ' ' + g.tip });
    });
    D.faq.forEach(function (f, i) { out.push({ k: 'Question', t: f.q, href: 'faq.html#q' + i, text: f.q + ' ' + f.a }); });
    D.trouble.forEach(function (c) {
      c.problems.forEach(function (p, i) { out.push({ k: c.name, t: p.q, href: 'help.html?c=' + c.id + '&i=' + i, text: p.q + ' ' + p.fix }); });
    });
    if (state.product) state.product.pages.forEach(function (pg) {
      out.push({ k: 'My planner', t: pg.name + ' page', href: 'planner.html?page=' + pg.id, text: pg.name + ' ' + pg.about + ' ' + pg.links.map(function (l) { return l.label + ' ' + l.goesTo; }).join(' ') });
    });
    return out;
  }
  function wireSearch() {
    var box = $('.search'), input = $('.search input'), res = $('.sres'), idx = null;
    function open() { idx = idx || searchIndex(); box.classList.add('open'); input.value = ''; render(''); setTimeout(function () { input.focus(); }, 30); }
    function close() { box.classList.remove('open'); }
    function render(q) {
      q = q.trim().toLowerCase();
      if (!q) { res.innerHTML = '<div class="sempty">Try “links”, “import” or “blurry”.</div>'; return; }
      var words = q.split(/\s+/);
      var hits = idx.map(function (r) {
        var hay = (r.t + ' ' + r.text).toLowerCase(), score = 0;
        words.forEach(function (w) { if (hay.indexOf(w) > -1) score += 1; if (r.t.toLowerCase().indexOf(w) > -1) score += 2; });
        return { r: r, s: score };
      }).filter(function (x) { return x.s >= words.length; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 8);
      res.innerHTML = hits.length ? hits.map(function (h) { return '<a href="' + link(h.r.href) + '"><span class="k">' + esc(h.r.k) + '</span><span class="t">' + esc(h.r.t) + '</span></a>'; }).join('') :
        '<div class="sempty">Nothing found for “' + esc(q) + '”. <a class="ul bg" href="' + D.site.contactUrl + '" style="margin-left:6px">MESSAGE ME</a></div>';
      if (q.length > 2) track('search', { q: q });
    }
    document.addEventListener('click', function (e) { if (e.target.closest('[data-search]')) open(); });
    $('[data-sclose]').addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    input.addEventListener('input', function () { render(input.value); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  }

  /* ---------- product chooser ---------- */
  function chooser() {
    var list = D.products.filter(function (p) { return !p.hidden; });
    return '<section class="ph"><div class="lb">// WELCOME</div><h1>Which planner did <i>you</i> get?</h1><p class="bd">Pick yours and the Handbook will show you guides and pages for it. You only need to do this once.</p></section>' +
      '<div class="chooser">' + list.map(function (p) {
        return '<a class="ecard" href="index.html?p=' + encodeURIComponent(p.handle) + '"><span class="eico">' + ic(p.type === 'stickers' ? 'sticker' : 'plan', 18) + '</span><span class="t" style="margin-top:16px">' + esc(p.name) + '</span><span class="cap" style="margin-top:6px;font-size:10px">' + esc(p.edition) + '</span></a>';
      }).join('') + '</div>';
  }

  /* ---------- pages ---------- */
  var pages = {};

  pages.home = function () {
    var c = $('#content');
    if (!state.product) { c.innerHTML = '<div class="wrap">' + topbar('<div class="ctx cap"><span class="cur">THE HANDBOOK</span></div>') + chooser() + '</div>'; return; }
    var p = state.product, nx = nextStep(), done = state.done.length, n = D.setup.length;
    var ng = nx ? guide(nx) : null;
    var bar = D.setup.map(function (id) { return '<span class="' + (state.done.indexOf(id) > -1 ? 'd' : '') + '"></span>'; }).join('');
    var ess = D.essentials.map(function (id) { return id === 'dates' && p.version !== 'undated' ? 'duplicate' : id; });
    var essHtml = ess.map(function (id, i) {
      var g = id === 'fix' ? { card: 'Fix a problem', cardText: 'Links not opening? Start here.', icon: 'fix' } : guide(id);
      var href = id === 'fix' ? 'help.html' : 'guide.html?g=' + id;
      var d = id === 'import' ? 'Add your planner to ' + appName() + '.' : (g.cardText || g.intro);
      return '<a class="ecard" href="' + link(href) + '"><span style="display:flex;justify-content:space-between;align-items:center"><span class="eico">' + ic(g.icon, 18) + '</span><span class="num" style="font-size:20px">' + pad(i + 1) + '</span></span><span class="t">' + esc(g.card || g.title) + '</span><span class="d">' + esc(d) + '</span><span class="r">READ THE GUIDE →</span></a>';
    }).join('');
    var faq = D.faq.slice(0, 5).map(function (f, i) {
      return '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(f.q) + '<span class="px">' + ic('plus', 18) + '</span></summary><div class="ans">' + esc(f.a) + '</div></details>';
    }).join('');
    c.innerHTML = '<div class="wrap">' + ctxBar() +
      '<section class="hero"><div><div class="lb">// WELCOME TO YOUR ' + esc(p.name.replace(/^The /, '').toUpperCase()) + '</div>' +
      '<h1 style="margin:16px 0 14px;font-size:34px;line-height:41px">Your first ten minutes, <i>made simple.</i></h1>' +
      '<p class="bd" style="margin:0;max-width:440px">Five short steps take you from download to your first planned week. Pick up where you left off any time.</p>' +
      '<div style="margin-top:28px;max-width:420px"><div style="display:flex;justify-content:space-between;gap:12px"><span class="cap">YOUR SETUP</span><span class="cap">' + done + ' OF ' + n + ' DONE</span></div><div class="bar" style="margin-top:10px">' + bar + '</div>' +
      '<div style="margin-top:12px;font-size:13.5px;color:var(--body)">' + (ng ? 'Up next: <span class="ser" style="font-size:15px;color:var(--ink-dark)">' + esc(ng.title) + '</span> <span class="cap" style="white-space:nowrap">&nbsp;· ' + ng.minutes + ' MIN</span>' : 'All set. <span class="ser" style="font-size:15px;color:var(--ink-dark)">Happy planning.</span>') + '</div></div>' +
      '<div class="acts" style="display:flex;flex-wrap:wrap;align-items:center;gap:18px 28px;margin-top:26px"><a class="pill" href="' + link('guide.html?g=' + (nx || D.setup[0])) + '">' + (nx ? (done ? 'CONTINUE SETUP' : 'START SETUP') : 'REVIEW SETUP') + '</a>' +
      '<div class="skip" style="display:flex;flex-direction:column;align-items:flex-start;gap:6px"><span class="cap">ALREADY KNOW THIS?</span><a class="ul" href="' + link('planner.html') + '">SKIP AHEAD</a></div></div></div>' +
      '<div class="img" style="background-image:url(' + esc(p.image) + ')" role="img" aria-label="' + esc(p.name) + ' on an iPad"></div></section>' +
      '<div class="esswrap"><section class="sec"><div class="sech"><span class="lb">// THE ESSENTIALS</span><a class="ul" href="' + link('apps.html') + '">VIEW ALL</a></div><div class="ess">' + essHtml + '</div></section></div>' +
      '<section class="sec qa"><div><div class="lb">// QUICK ANSWERS</div><h2 style="margin-top:14px;font-size:26px;line-height:32px">Questions, <i>answered.</i></h2><p class="bd" style="margin:12px 0 22px">The things people ask most, in one place.</p><a class="ul" href="' + link('faq.html') + '">ALL QUESTIONS</a></div><div>' + faq + '</div></section></div>' +
      (D.site.appComingSoon ? '<div class="band" style="margin-top:88px">// Coming soon: the Lilac Desk app.</div>' : '');
    c.classList.add('flush');
    $$('details').forEach(function (d, i) { d.addEventListener('toggle', function () { if (d.open) track('faq-open', { q: D.faq[i].q }); }); });
  };

  pages.start = pages.guide = function () {
    var id = qs('g') || nextStep() || D.setup[0], g = guide(id) || guide(D.setup[0]);
    var c = $('#content'), si = D.setup.indexOf(g.id), isStep = si > -1, p = state.product;
    var steps = (g.steps[state.app] || g.steps['default']).slice();
    if (g.id === 'basics' && p && p.version === 'undated' && g.undatedSteps) steps = steps.concat(g.undatedSteps);
    var stepRow = '';
    if (isStep) {
      stepRow = '<section style="margin-top:34px;max-width:880px"><div style="display:flex;justify-content:space-between;gap:12px"><span class="cap">YOUR SETUP</span><span class="cap">' + state.done.length + ' OF ' + D.setup.length + ' DONE</span></div><div class="steps">' +
        D.setup.map(function (sid, i) {
          var cls = sid === g.id ? 'cur' : (state.done.indexOf(sid) > -1 ? 'dn' : '');
          var chk = cls === 'dn' ? ' <span style="display:inline-flex;vertical-align:-2px">' + ic('check', 12, 1.6) + '</span>' : '';
          return '<a class="' + cls + '" href="' + link('guide.html?g=' + sid) + '"' + (sid === g.id ? ' aria-current="step"' : '') + '><span class="b"></span><span class="t">' + pad(i + 1) + '&nbsp; ' + esc(guide(sid).short) + chk + '</span></a>';
        }).join('') + '</div></section>';
    }
    var prev = isStep && si > 0 ? guide(D.setup[si - 1]) : null;
    var next = isStep && si < D.setup.length - 1 ? guide(D.setup[si + 1]) : null;
    var related = D.guides.filter(function (x) { return x.id !== g.id && !(D.setup.indexOf(x.id) > -1 && isStep) && (x.id !== 'dates' || (p && p.version === 'undated')); }).slice(0, 3);
    c.innerHTML = '<div class="wrap">' + crumb(isStep ? 'Getting started' : 'Guides') +
      '<section class="ph"><div class="lb">// ' + (isStep ? 'GETTING STARTED &nbsp;·&nbsp; STEP ' + (si + 1) + ' OF ' + D.setup.length : 'GUIDE') + '</div><h1>' + g.headline + '</h1><p class="bd">' + esc(g.intro) + '</p></section>' + stepRow +
      '<section class="gl2"><div>' +
      (g.clip ? '<div class="card" style="padding:14px">' + clipBox(g.clip, g.clipNote, true) + '</div>' : '') +
      '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:12px;margin-top:' + (g.clip ? '40px' : '0') + ';margin-bottom:6px"><span class="lb">// HOW TO DO IT</span><span class="cap" style="font-size:10px">SHOWING: ' + esc((deviceName() + ' + ' + appName()).toUpperCase()) + ' &nbsp;<a class="ul bg" style="font-size:10px;padding-bottom:2px" href="' + link('apps.html') + '">CHANGE</a></span></div>' +
      '<div>' + steps.map(function (s, i) { return '<div class="ins"><span class="n">' + pad(i + 1) + '</span><span class="x">' + s + '</span></div>'; }).join('') + '</div>' +
      '<div style="margin-top:28px">' + icard('bulb', 'Good to know', esc(g.tip)) + '</div>' +
      '<div class="navrow">' + (prev ? '<a class="ul" href="' + link('guide.html?g=' + prev.id) + '">← ' + esc(prev.short.toUpperCase()) + '</a>' : '<a class="ul" href="' + link('index.html') + '">← HOME</a>') +
      (isStep ? '<button class="pill" data-done>' + (next ? 'DONE · NEXT STEP' : 'DONE · FINISH SETUP') + '</button>' : '<a class="pill" href="' + link('index.html') + '">BACK TO HOME</a>') + '</div>' +
      '</div><aside class="side">' +
      (next ? '<div class="card" style="padding:22px"><span class="cap" style="font-size:10px">ALREADY KNOW THIS?</span><div class="ser" style="margin-top:8px;font-size:17px;color:var(--ink)">Skip to ' + esc(next.short.toLowerCase()) + '.</div><a class="ul" style="margin-top:16px" href="' + link('guide.html?g=' + next.id) + '">SKIP AHEAD</a></div>' : '') +
      '<div class="card rel" style="padding:22px 22px 10px"><span class="lb">// RELATED</span><div style="margin-top:14px">' +
      (p && p.pages.length ? '<a href="' + link('planner.html') + '">See every link in the page map<span style="color:var(--burgundy);display:flex">' + ic('chev', 15) + '</span></a>' : '') +
      related.map(function (r) { return '<a href="' + link('guide.html?g=' + r.id) + '">' + esc(r.title) + '<span style="color:var(--burgundy);display:flex">' + ic('chev', 15) + '</span></a>'; }).join('') +
      '<a href="' + link('help.html') + '">Something not working?<span style="color:var(--burgundy);display:flex">' + ic('chev', 15) + '</span></a></div></div>' +
      icard('msg', 'Stuck?', 'Tap Message me and I will help.') +
      '</aside></section></div>';
    var btn = $('[data-done]');
    if (btn) btn.addEventListener('click', function () {
      markDone(g.id);
      location.href = link(next ? 'guide.html?g=' + next.id : 'index.html');
    });
    document.title = g.title + ' · The Handbook';
  };

  pages.planner = function () {
    var c = $('#content'), p = state.product;
    if (!p) { c.innerHTML = '<div class="wrap">' + crumb('My planner') + chooser() + '</div>'; return; }
    if (!p.pages.length) {
      c.innerHTML = '<div class="wrap">' + crumb('My planner') + '<section class="ph"><div class="lb">// MY PLANNER</div><h1>' + esc(p.name) + ', <i>page by page.</i></h1><p class="bd">The page map for ' + esc(p.name) + ' ' + esc(p.edition) + ' is on its way. Until then, the guides cover everything you need.</p></section>' +
        '<div style="margin-top:32px;max-width:640px">' + icard('link', 'How the links work', 'Every date, tab and title in your planner is linked. Tap once in reading mode to jump.', '<a class="ul" style="margin-top:12px" href="' + link('guide.html?g=links') + '">READ THE GUIDE</a>') + '</div></div>';
      return;
    }
    var pid = qs('page'), idx = Math.max(0, p.pages.map(function (x) { return x.id; }).indexOf(pid));
    var pg = p.pages[idx], total = p.pages.length;
    var groups = p.pageGroups.map(function (gr) {
      var list = p.pages.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return o.x.group === gr.id; });
      if (!list.length) return '';
      return '<div class="apg"><div class="h">' + esc(gr.name) + '</div>' + list.map(function (o) {
        return '<a class="apt' + (o.i === idx ? ' on' : '') + '" href="' + link('planner.html?page=' + o.x.id) + '"' + (o.i === idx ? ' aria-current="page"' : '') + '><span class="pn2">' + pad(o.i + 1) + '</span><span class="nm">' + esc(o.x.name) + '</span></a>';
      }).join('') + '</div>';
    }).join('');
    var dots = pg.links.map(function (l, i) {
      return '<button class="dot" data-i="' + i + '" style="left:' + l.x + '%;top:' + l.y + '%" aria-label="Link ' + (i + 1) + ': ' + esc(l.label) + '">' + (i + 1) + '</button>';
    }).join('');
    var rows = pg.links.map(function (l, i) {
      return '<div class="lr" data-i="' + i + '"><button class="lrh" aria-expanded="false"><span class="row"><span class="nn">' + (i + 1) + '</span><span style="flex:1;min-width:0"><span class="ser" style="display:block;font-size:16px;color:var(--ink-dark)">' + esc(l.label) + '</span><span class="cap" style="display:block;margin-top:3px;font-size:10px">→ ' + esc(l.goesTo) + '</span></span></span></button>' +
        '<div class="det" hidden><p>' + esc(l.text) + '</p><div class="helpful"><span class="cap" style="font-size:10px;margin-right:4px">HELPFUL?</span><button class="chipb" data-h="yes">YES</button><button class="chipb" data-h="no">NO</button></div></div></div>';
    }).join('');
    var tips = pg.tips.map(function (t, i) {
      return '<div class="ecard" style="padding:22px"><span style="display:flex;justify-content:space-between;align-items:center"><span class="eico">' + ic(t.icon, 18) + '</span><span class="num" style="font-size:18px">' + pad(i + 1) + '</span></span><span class="ser" style="margin-top:18px;font-size:18px;color:var(--ink)">' + esc(t.title) + '</span><span style="margin-top:8px;font-size:13.5px;line-height:21px;color:var(--muted)">' + esc(t.text) + '</span></div>';
    }).join('');
    c.innerHTML = '<div class="wrap">' + crumb('My planner') +
      '<section class="ph" style="padding-bottom:36px"><div class="lb">// MY PLANNER</div><h1>' + esc(p.name) + ', <i>page by page.</i></h1><p class="bd">Every page in your planner, and where each link goes.</p></section>' +
      '<div class="pbar"><div class="pg"><a class="rb" ' + (idx > 0 ? 'href="' + link('planner.html?page=' + p.pages[idx - 1].id) + '"' : 'aria-disabled="true" style="opacity:.35"') + ' aria-label="Previous page">' + ic('back', 16) + '</a><div><div class="cap" style="font-size:10px">PAGE ' + pad(idx + 1) + ' OF ' + pad(total) + '</div><div class="ser" style="margin-top:3px;font-size:19px;color:var(--ink-dark)">The ' + esc(pg.name.toLowerCase()) + ' page</div></div>' +
      '<a class="rb" ' + (idx < total - 1 ? 'href="' + link('planner.html?page=' + p.pages[idx + 1].id) + '"' : 'aria-disabled="true" style="opacity:.35"') + ' aria-label="Next page">' + ic('chev', 16) + '</a></div>' +
      '<button class="apl" aria-expanded="false" aria-controls="allpages">' + ic('grid', 15) + '<span>ALL PAGES</span></button></div>' +
      '<div class="apn" id="allpages" hidden><div class="apw">' + groups + '</div></div>' +
      '<p class="bd" style="margin:20px 0 0">' + esc(pg.about) + '</p>' +
      '<section class="mg" style="margin-top:24px"><div class="card viewer"><div class="page"><img src="' + esc(pg.image) + '" alt="The ' + esc(pg.name) + ' page of ' + esc(p.name) + '">' + dots + '<div class="pop" hidden></div></div>' +
      '<div style="margin-top:14px"><span class="cap" style="font-size:10px">' + (pg.links.length ? 'TAP A NUMBER TO SEE WHERE IT GOES' : 'NO LINKS ON THIS PAGE') + '</span></div></div>' +
      '<div class="card" style="overflow:hidden"><div style="padding:20px 22px 16px;display:flex;justify-content:space-between;align-items:baseline"><span class="lb">// LINKS ON THIS PAGE</span><span class="cap">' + pg.links.length + '</span></div>' +
      (rows || '<div style="padding:4px 22px 22px;font-size:14px;line-height:22px;color:var(--body)">' + esc(pg.tips[0] ? pg.tips[0].text : 'This page has no links.') + '</div>') + '</div></section>' +
      (pg.tips.length ? '<section class="sec"><div class="sech"><span class="lb">// GOOD TO KNOW</span></div><div class="tips">' + tips + '</div></section>' : '') + '</div>';

    var apl = $('.apl'), apn = $('#allpages');
    apl.addEventListener('click', function () { var o = apn.hidden; apn.hidden = !o; apl.setAttribute('aria-expanded', String(o)); });
    var pop = $('.pop');
    function select(i) {
      $$('.dot').forEach(function (d) { d.classList.toggle('on', +d.dataset.i === i); });
      $$('.lr').forEach(function (r) {
        var on = +r.dataset.i === i; r.classList.toggle('on', on); r.querySelector('.lrh').setAttribute('aria-expanded', String(on)); r.querySelector('.det').hidden = !on;
      });
      if (i < 0) { pop.hidden = true; return; }
      var l = pg.links[i];
      pop.innerHTML = '<div class="l">' + esc(l.label) + '</div><div class="g">→ ' + esc(l.goesTo) + '</div>';
      pop.hidden = false;
      pop.style.top = l.y + '%';
      if (l.x > 55) { pop.style.left = 'auto'; pop.style.right = 'calc(' + (100 - l.x) + '% + 22px)'; }
      else { pop.style.right = 'auto'; pop.style.left = 'calc(' + l.x + '% + 22px)'; }
      track('page-link', { page: pg.id, link: l.label });
    }
    $$('.dot').forEach(function (d) { d.addEventListener('click', function () { select(+d.dataset.i); }); });
    $$('.lr').forEach(function (r) {
      r.querySelector('.lrh').addEventListener('click', function () { select(r.classList.contains('on') ? -1 : +r.dataset.i); });
      $$('[data-h]', r).forEach(function (h) {
        h.addEventListener('click', function () {
          $$('[data-h]', r).forEach(function (x) { x.classList.toggle('on', x === h); x.setAttribute('aria-pressed', String(x === h)); });
          track('helpful', { page: pg.id, link: pg.links[+r.dataset.i].label, answer: h.dataset.h });
        });
      });
    });
    if (pg.links.length) select(0);
    document.title = 'The ' + pg.name + ' page · The Handbook';
  };

  pages.apps = function () {
    var c = $('#content');
    function grp(label, key, list) {
      return '<section style="margin-top:36px"><div class="cap" style="margin-bottom:16px">' + label + '</div><div class="chs">' + list.map(function (x) {
        var on = state[key] === x.id;
        return '<button class="ch" data-k="' + key + '" data-v="' + x.id + '" aria-pressed="' + on + '"><span class="eico">' + ic(x.icon, 18) + '</span><span><span class="t">' + esc(x.name) + '</span><span class="s">' + esc(x.sub) + '</span></span><span class="tk">' + ic('check', 12, 1.8) + '</span></button>';
      }).join('') + '</div></section>';
    }
    function guides() {
      return D.guides.filter(function (g) { return g.id !== 'dates' || (state.product && state.product.version === 'undated'); }).map(function (g, i) {
        return '<a class="gr" href="' + link('guide.html?g=' + g.id) + '"><span class="num" style="font-size:17px">' + pad(i + 1) + '</span><span class="ser" style="font-size:17px">' + esc(g.title) + '</span><span class="cap" style="font-size:10px">' + g.minutes + ' MIN</span><span style="color:var(--burgundy);display:flex">' + ic('chev', 15) + '</span></a>';
      }).join('');
    }
    function render(saved) {
      c.innerHTML = '<div class="wrap">' + crumb('Apps & devices') +
        '<section class="ph"><div class="lb">// APPS &amp; DEVICES</div><h1>Set up on <i>your</i> device.</h1><p class="bd">Choose what you use, and every guide in the Handbook will match it.</p></section>' +
        grp('YOUR DEVICE', 'device', D.devices) + grp('YOUR APP', 'app', D.apps) +
        '<div class="saved" aria-live="polite">' + (saved ? ic('check', 14, 1.6) + '<span class="cap" style="color:var(--burgundy);font-size:10px">SAVED. EVERY GUIDE NOW SHOWS ' + esc((deviceName() + ' + ' + appName()).toUpperCase()) + '.</span>' : '') + '</div>' +
        '<section class="gl2" style="margin-top:56px"><div><div style="margin-bottom:16px"><span class="lb">// YOUR GUIDES FOR ' + esc((deviceName() + ' + ' + appName()).toUpperCase()) + '</span></div>' + guides() + '</div>' +
        '<aside class="side">' + icard('faq', 'Not sure which app?', 'Any annotation app that opens PDFs with links will work, like GoodNotes, Notability, Samsung Notes or Xodo.') +
        icard('msg', 'Using something else?', 'Tap Message me and tell me your device. I will point you to the right steps.') + '</aside></section></div>';
      $$('.ch').forEach(function (b) {
        b.addEventListener('click', function () {
          state[b.dataset.k] = b.dataset.v;
          store('device', { device: state.device, app: state.app });
          track('device', { device: state.device, app: state.app });
          render(true);
          var again = $('.ch[data-k="' + b.dataset.k + '"][data-v="' + b.dataset.v + '"]'); if (again) again.focus();
        });
      });
    }
    render(false);
  };

  pages.help = function () {
    var c = $('#content');
    var cat = qs('c') ? D.trouble.filter(function (t) { return t.id === qs('c'); })[0] : null;
    var pi = qs('i') != null ? +qs('i') : -1;
    function render() {
      var cats = D.trouble.map(function (t) {
        return '<button class="ch row" data-c="' + t.id + '" aria-pressed="' + (cat && cat.id === t.id) + '"><span class="eico">' + ic(t.icon, 18) + '</span><span class="t">' + esc(t.name) + '</span></button>';
      }).join('');
      var body = '';
      if (cat) {
        var prob = cat.problems[pi];
        body = '<section class="gl2" style="margin-top:48px"><div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:12px"><span class="lb">// ' + esc(cat.name.toUpperCase()) + '</span><span class="cap" style="font-size:10px">' + esc((deviceName() + ' + ' + appName()).toUpperCase()) + '</span></div>';
        if (prob) {
          body += '<div class="card" style="overflow:hidden" id="fix"><div style="padding:28px 28px 8px"><span class="cap" style="font-size:10px">THE FIX</span><div class="ser" style="margin-top:10px;font-size:22px;line-height:29px;color:var(--ink-dark)">' + esc(prob.q) + '</div><p class="bd" style="margin:12px 0 0">' + esc(prob.fix) + '</p></div>' +
            '<div style="padding:22px 28px 28px" data-result><div class="cap" style="font-size:10px">DID THAT FIX IT?</div><div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:14px"><button class="pill" data-r="yes">YES, IT WORKS</button><button class="pill ghost" data-r="no">NOT YET</button></div></div></div>';
          body += '<div style="margin-top:28px"><span class="cap" style="font-size:10px">MORE IN ' + esc(cat.name.toUpperCase()) + '</span><div style="margin-top:10px">';
        } else {
          body += '<div><span class="cap" style="font-size:10px">WHAT IS HAPPENING?</span><div style="margin-top:10px">';
        }
        body += cat.problems.map(function (pr, i) { return i === pi ? '' : '<a class="prob" href="' + link('help.html?c=' + cat.id + '&i=' + i) + '#fix">' + esc(pr.q) + '<span style="color:var(--burgundy);display:flex">' + ic('chev', 15) + '</span></a>'; }).join('') + '</div></div></div>';
        body += '<aside class="side">' + cheat() + icard('msg', 'Still stuck?', 'Tap Message me and tell me what you have tried. I will help from there.') + '</aside></section>';
      } else {
        body = '<section class="gl2" style="margin-top:48px"><div>' + icard('bulb', 'Almost every problem has a thirty-second fix', 'Pick the area above that matches what is happening, then the problem. Each one has the exact fix.') + '</div><aside class="side">' + cheat() + '</aside></section>';
      }
      c.innerHTML = '<div class="wrap">' + crumb('Troubleshooting') +
        '<section class="ph"><div class="lb">// TROUBLESHOOTING</div><h1>Let&rsquo;s fix it, <i>step by step.</i></h1><p class="bd">Pick where the problem is, then what is happening. I will walk you through it.</p></section>' +
        '<section style="margin-top:40px"><div class="cap" style="margin-bottom:16px">WHERE IS THE PROBLEM?</div><div class="chs" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">' + cats + '</div></section>' + body + '</div>';
      $$('[data-c]').forEach(function (b) { b.addEventListener('click', function () { cat = D.trouble.filter(function (t) { return t.id === b.dataset.c; })[0]; pi = -1; history.replaceState(null, '', link('help.html?c=' + cat.id)); render(); }); });
      $$('[data-r]').forEach(function (b) {
        b.addEventListener('click', function () {
          var yes = b.dataset.r === 'yes', box = $('[data-result]');
          track('fix-result', { problem: cat.problems[pi].q, fixed: yes });
          box.innerHTML = yes ? '<div style="display:flex;gap:12px;align-items:center;color:var(--burgundy)">' + ic('check', 18, 1.6) + '<span class="ser" style="font-size:17px">Wonderful. Back to planning.</span></div>' :
            '<div class="ser" style="font-size:17px;color:var(--ink-dark)">Let&rsquo;s sort it together.</div><p class="bd" style="margin:8px 0 16px">Send me a message with what you tried and which device and app you use. I will get you sorted.</p><a class="pill" href="' + D.site.contactUrl + '">MESSAGE ME</a>';
        });
      });
    }
    function cheat() {
      return '<div class="card" style="padding:22px"><span class="eico">' + ic('download', 18) + '</span><div class="ser" style="margin-top:16px;font-size:17px;color:var(--ink)">Troubleshooting Cheat Sheet</div><p style="margin:6px 0 0;font-size:13.5px;line-height:21px;color:var(--muted)">A thirty-second answer to every common snag. Save it for later.</p><a class="ul" style="margin-top:16px" href="' + D.site.cheatSheetUrl + '" download>DOWNLOAD THE PDF</a></div>';
    }
    render();
  };

  pages.faq = function () {
    var c = $('#content'), h = location.hash.replace('#q', '');
    c.innerHTML = '<div class="wrap">' + crumb('Questions') + '<section class="ph"><div class="lb">// QUESTIONS</div><h1>Questions, <i>answered.</i></h1><p class="bd">The things people ask most. Can&rsquo;t find yours? Search, or message me.</p></section>' +
      '<section style="margin-top:36px;max-width:820px">' + D.faq.map(function (f, i) {
        return '<details id="q' + i + '"' + (String(i) === h ? ' open' : '') + '><summary>' + esc(f.q) + '<span class="px">' + ic('plus', 18) + '</span></summary><div class="ans">' + esc(f.a) + '</div></details>';
      }).join('') + '</section></div>';
    $$('details').forEach(function (d, i) { d.addEventListener('toggle', function () { if (d.open) track('faq-open', { q: D.faq[i].q }); }); });
  };

  pages.videos = function () {
    if (!hasVideos()) { location.replace(link('index.html')); return; }
    var vids = D.videos.filter(function (v) { return v.src; });
    var c = $('#content'), topic = 'All';
    var feat = vids.filter(function (v) { return v.featured; })[0];
    var topics = ['All'].concat(vids.filter(function (v) { return !v.featured; }).map(function (v) { return v.topic; }).filter(function (t, i, a) { return a.indexOf(t) === i; }));
    var watched = store('watched') || [];
    function grid() {
      return vids.filter(function (v) { return !v.featured && (topic === 'All' || v.topic === topic); }).map(function (v) {
        var href = v.src ? v.src : (v.guide ? link('guide.html?g=' + v.guide) : '#');
        return '<a class="vc" style="display:flex;flex-direction:column;min-width:0" href="' + href + '" data-v="' + v.id + '"' + (v.src ? ' target="_blank" rel="noopener"' : '') + '><span class="vth"><span class="pb">' + ic('play', 18, 1.4) + '</span><span class="du">' + esc(v.length) + '</span>' +
          (v.src ? (watched.indexOf(v.id) > -1 ? '<span class="wd">WATCHED</span>' : '') : '<span class="cs">COMING SOON</span>') + '</span><span class="cap" style="font-size:10px;margin-top:14px">' + esc(v.topic.toUpperCase()) + '</span><span class="ser" style="margin-top:6px;font-size:17px;color:var(--ink)">' + esc(v.title) + '</span></a>';
      }).join('');
    }
    function render() {
      c.innerHTML = '<div class="wrap">' + crumb('Videos') +
        '<section class="ph" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 32px"><div><div class="lb">// VIDEOS</div><h1>Watch it <i>done.</i></h1><p class="bd">Short clips, under a minute each.</p></div><span class="cap" style="font-size:10px">SHOWING: ' + esc((deviceName() + ' + ' + appName()).toUpperCase()) + ' &nbsp;<a class="ul bg" style="font-size:10px;padding-bottom:2px" href="' + link('apps.html') + '">CHANGE</a></span></section>' +
        (feat ? '<section class="card feat"><div>' + clipBox(feat.src, null, true) + '</div><div style="padding:8px 16px 8px 0"><span class="cap" style="font-size:10px">START HERE · ' + esc(feat.length) + '</span><div class="ser" style="margin-top:10px;font-size:24px;line-height:31px;color:var(--ink-dark)">' + esc(feat.title) + (state.product ? ' with ' + esc(state.product.name) : '') + '</div><p class="bd" style="margin:10px 0 0">The whole setup in one walkthrough: import, links and your first planned week.</p>' +
          '<a class="pill" style="margin-top:22px" href="' + link('guide.html?g=' + D.setup[0]) + '">' + (feat.src ? 'WATCH THE WALKTHROUGH' : 'READ THE SETUP STEPS') + '</a></div></section>' : '') +
        '<nav class="vt" style="margin-top:48px" aria-label="Video topics">' + topics.map(function (t) { return '<button class="' + (t === topic ? 'on' : '') + '" data-t="' + esc(t) + '" aria-pressed="' + (t === topic) + '">' + esc(t) + '</button>'; }).join('') + '</nav>' +
        '<section class="vgrid">' + grid() + '</section></div>';
      $$('[data-t]').forEach(function (b) { b.addEventListener('click', function () { topic = b.dataset.t; render(); }); });
      $$('[data-v]').forEach(function (a) { a.addEventListener('click', function () { if (watched.indexOf(a.dataset.v) < 0) { watched.push(a.dataset.v); store('watched', watched); } track('video', { id: a.dataset.v }); }); });
    }
    render();
  };

  /* ---------- boot ---------- */
  fetch('data/products.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (data) {
    D = data;
    loadState();
    var page = document.body.getAttribute('data-page') || 'home';
    chrome(page);
    (pages[page] || pages.home)();
    window.scrollTo(0, 0);
  }).catch(function (e) {
    document.body.innerHTML = '<div style="padding:48px 24px;font-family:Georgia,serif;font-size:18px;color:#333">The Handbook could not load. Please refresh the page, or <a style="color:#5A1119;text-decoration:underline" href="https://lilacdesk.com/pages/contact">message me</a>.</div>';
    if (window.console) console.error(e);
  });
})();
