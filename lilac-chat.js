/* Lilac Desk live chat
   A "Message me" bubble that opens a chat window. Messages go to the Lilac Desk portal
   (Messages inbox + phone notification); Kerry's replies appear here live.
   Config: window.LilacChat = { endpoint, label, raise } before this script loads, or data- attributes on the script tag.
   Any element with data-lilac-chat opens the chat when clicked. */
(function () {
  if (window.__lilacChatLoaded) return;
  window.__lilacChatLoaded = true;

  var script = document.currentScript || {};
  var ds = (script && script.dataset) || {};
  var cfg = window.LilacChat || {};
  var ENDPOINT = cfg.endpoint || ds.endpoint || 'https://fdxbqdhzzyyggdtbjwnz.supabase.co/functions/v1/portal-contact';
  var LABEL = cfg.label || ds.label || 'Message me';
  var RAISE = cfg.raise || ds.raise || ''; // e.g. "84px" to sit above a sticky bar on phones
  var OWN_BUTTON = !(cfg.button === false || ds.button === 'false'); // false = the page has its own button
  var OPENERS = '[data-lilac-chat]' + (cfg.openers || ds.openers ? ',' + (cfg.openers || ds.openers) : '');
  var KEY = 'lilac-chat-v1';
  var POLL_OPEN = 4000, POLL_CLOSED = 30000;

  /* ---------- storage (never required to work) ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(v) { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch (e) {} }
  var state = load() || null; // { id, token, name, email, seen: lastSeenAdminCreatedAt }
  var messages = [];
  var lastAt = '';
  var open = false, timer = null, opened = Date.now(), sending = false, unread = 0;

  /* ---------- styles ---------- */
  var css = '' +
  '.ldc,.ldc *{box-sizing:border-box}' +
  '.ldc{position:fixed;right:18px;bottom:18px;z-index:2147483000;font-family:Jost,Montserrat,Helvetica,Arial,sans-serif;color:#333}' +
  '.ldc-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px 11px 15px;border:0;border-radius:999px;background:#333;color:#FAFAF8;font:400 13.5px/1 Jost,Montserrat,Helvetica,Arial,sans-serif;letter-spacing:.02em;cursor:pointer;box-shadow:0 10px 28px -12px rgba(51,51,51,.55);transition:background .15s,transform .15s}' +
  '.ldc-btn:hover{background:#5C181E;transform:translateY(-1px)}' +
  '.ldc-btn:focus-visible{outline:2px solid #5C181E;outline-offset:3px}' +
  '.ldc-dot{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#5C181E;color:#fff;font-size:11px;line-height:18px;text-align:center;margin-left:2px}' +
  '.ldc-btn:hover .ldc-dot{background:#fff;color:#5C181E}' +
  '.ldc-win{position:absolute;right:0;bottom:58px;width:360px;max-width:calc(100vw - 28px);height:520px;max-height:calc(100vh - 110px);background:#fff;border:1px solid #e6e2ea;box-shadow:0 24px 60px -24px rgba(51,51,51,.45);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .18s,transform .18s}' +
  '.ldc.on .ldc-win{opacity:1;transform:none;pointer-events:auto}' +
  '.ldc-head{background:#5C181E;color:#fff;padding:16px 18px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}' +
  '.ldc-brand{font-family:"Times New Roman",Times,Georgia,serif;font-size:15px;letter-spacing:4px}' +
  '.ldc-sub{margin-top:5px;font-size:11.5px;letter-spacing:.04em;color:#ecd9dc}' +
  '.ldc-x{background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:0 2px;opacity:.85}' +
  '.ldc-x:hover{opacity:1}' +
  '.ldc-body{flex:1;overflow-y:auto;padding:16px 16px 8px;background:#fff}' +
  '.ldc-intro{font-size:13.5px;line-height:1.6;color:#555;margin:0 0 14px}' +
  '.ldc-eye{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#5C181E;margin:0 0 8px}' +
  '.ldc-f{display:block;margin:0 0 12px}' +
  '.ldc-f span{display:block;font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:#777;margin-bottom:5px}' +
  '.ldc-f input,.ldc-f textarea,.ldc-comp textarea{width:100%;border:0;border-bottom:1px solid #333;border-radius:0;padding:7px 2px;font:400 14px/1.45 Jost,Montserrat,Helvetica,Arial,sans-serif;color:#111;background:transparent;outline:none;resize:none}' +
  '.ldc-f input:focus,.ldc-f textarea:focus{border-bottom-color:#5C181E;box-shadow:0 1px 0 #5C181E}' +
  '.ldc-trap{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
  '.ldc-go{display:block;width:100%;margin-top:6px;padding:13px 16px;border:1px solid #5C181E;border-radius:0;background:#5C181E;color:#fff;font:500 11px/1 Jost,Montserrat,Helvetica,Arial,sans-serif;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer}' +
  '.ldc-go:hover{background:#fff;color:#5C181E}' +
  '.ldc-go:disabled{opacity:.6;cursor:default}' +
  '.ldc-err{font-size:12px;color:#b3261e;margin:8px 0 0}' +
  '.ldc-msg{display:flex;margin:0 0 10px}' +
  '.ldc-msg.me{justify-content:flex-end}' +
  '.ldc-b{max-width:82%;padding:9px 12px;font-size:13.5px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}' +
  '.ldc-msg.me .ldc-b{background:#F3F1F5;color:#222}' +
  '.ldc-msg.them .ldc-b{background:#fff;border:1px solid #e6e2ea;color:#222}' +
  '.ldc-who{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#5C181E;margin:0 0 4px}' +
  '.ldc-time{font-size:10px;color:#999;margin-top:4px}' +
  '.ldc-note{font-size:11.5px;line-height:1.5;color:#888;text-align:center;margin:6px 8px 12px}' +
  '.ldc-comp{display:flex;align-items:flex-end;gap:10px;border-top:1px solid #eee;padding:10px 12px 12px;background:#fff}' +
  '.ldc-comp textarea{border-bottom:0;max-height:110px;padding:8px 2px}' +
  '.ldc-send{flex:none;border:0;background:#5C181E;color:#fff;width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
  '.ldc-send:disabled{opacity:.5;cursor:default}' +
  '.ldc-new{display:block;margin:4px auto 10px;background:none;border:0;font:400 10.5px Jost,Montserrat,Helvetica,Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#888;text-decoration:underline;cursor:pointer}' +
  '@media (max-width:749px){.ldc{right:14px;bottom:' + (RAISE || '14px') + '}.ldc-btn{padding:12px}.ldc-btn .ldc-l{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
  '.ldc.on{left:0;right:0;bottom:0;top:0}.ldc.on .ldc-btn{display:none}.ldc-win{position:fixed;left:0;right:0;bottom:0;top:auto;width:100%;max-width:none;height:min(86vh,640px);max-height:none;border-left:0;border-right:0;border-bottom:0}}' +
  '.ldc.nobtn .ldc-btn{display:none}.ldc.nobtn .ldc-win{bottom:0}.ldc.nobtn:not(.on){pointer-events:none}' +
  '[data-ldc-unread]{position:relative}[data-ldc-unread]::after{content:attr(data-ldc-unread);position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:#5C181E;color:#fff;font-size:11px;line-height:20px;text-align:center;box-shadow:0 0 0 2px #fff}' +
  '@media print{.ldc{display:none}}';

  var icon = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>';
  var sendIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function time(iso) { try { return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }

  /* ---------- DOM ---------- */
  var root, win, body, btn, dot;
  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    root = document.createElement('div');
    root.className = 'ldc' + (OWN_BUTTON ? '' : ' nobtn');
    root.innerHTML =
      '<div class="ldc-win" role="dialog" aria-modal="false" aria-label="Chat with Lilac Desk">' +
        '<div class="ldc-head"><div><div class="ldc-brand">LILAC DESK</div><div class="ldc-sub">Kerry, the designer \u00B7 usually replies within minutes</div></div>' +
        '<button class="ldc-x" type="button" aria-label="Close chat">&times;</button></div>' +
        '<div class="ldc-body" aria-live="polite"></div>' +
        '<div class="ldc-foot"></div>' +
      '</div>' +
      '<button class="ldc-btn" type="button" aria-label="Chat with Lilac Desk">' + icon + '<span class="ldc-l">' + esc(LABEL) + '</span><span class="ldc-dot" hidden></span></button>';
    document.body.appendChild(root);
    win = root.querySelector('.ldc-win');
    body = root.querySelector('.ldc-body');
    btn = root.querySelector('.ldc-btn');
    dot = root.querySelector('.ldc-dot');
    btn.addEventListener('click', function () { setOpen(true); });
    root.querySelector('.ldc-x').addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest && e.target.closest(OPENERS);
      if (t) { e.preventDefault(); setOpen(true); }
    });
    render();
  }

  function setOpen(v) {
    open = v;
    root.classList.toggle('on', v);
    if (v) {
      unread = 0; badge();
      opened = Date.now();
      setTimeout(function () { var f = root.querySelector(state ? '.ldc-comp textarea' : '.ldc-f input'); if (f) f.focus(); }, 60);
      if (state) poll();
    }
    schedule();
  }

  function badge() {
    var n = unread > 9 ? '9+' : String(unread);
    dot.hidden = !unread; dot.textContent = n;
    if (!OWN_BUTTON) Array.prototype.forEach.call(document.querySelectorAll(OPENERS), function (el) { unread ? el.setAttribute('data-ldc-unread', n) : el.removeAttribute('data-ldc-unread'); });
  }

  /* ---------- views ---------- */
  function render() {
    var foot = root.querySelector('.ldc-foot');
    if (!state) {
      foot.innerHTML = '';
      body.innerHTML =
        '<p class="ldc-eye">// Ask me anything</p>' +
        '<p class="ldc-intro">Questions about a planner, setup, or an order? Send a message and I\'ll reply right here. If you step away, my reply goes to your email too.</p>' +
        '<form class="ldc-start" novalidate>' +
          '<label class="ldc-f"><span>Name</span><input name="name" autocomplete="name" maxlength="120"></label>' +
          '<label class="ldc-f"><span>Email</span><input name="email" type="email" autocomplete="email" required maxlength="200"></label>' +
          '<label class="ldc-f"><span>Message</span><textarea name="message" rows="3" required maxlength="2000"></textarea></label>' +
          '<div class="ldc-trap" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>' +
          '<button class="ldc-go" type="submit">Start chat</button>' +
          '<p class="ldc-err" hidden></p>' +
        '</form>';
      body.querySelector('form').addEventListener('submit', start);
      return;
    }
    var html = '<p class="ldc-note">Chatting as ' + esc(state.name || state.email) + '</p>';
    messages.forEach(function (m) {
      var me = m.sender === 'customer';
      html += '<div class="ldc-msg ' + (me ? 'me' : 'them') + '"><div class="ldc-b">' + (me ? '' : '<p class="ldc-who">Kerry</p>') + esc(m.body) + '<div class="ldc-time">' + time(m.created_at) + '</div></div></div>';
    });
    if (messages.length && !messages.some(function (m) { return m.sender === 'admin'; })) {
      html += '<p class="ldc-note">Got it. I\'ll reply here as soon as I can. If you leave, the reply goes to ' + esc(state.email) + '.</p>';
    }
    html += '<button class="ldc-new" type="button">Start a new chat</button>';
    body.innerHTML = html;
    body.scrollTop = body.scrollHeight;
    body.querySelector('.ldc-new').addEventListener('click', function () {
      if (!window.confirm || window.confirm('Start a new chat? This one stays in your email.')) { state = null; messages = []; lastAt = ''; save(null); render(); }
    });
    if (!foot.querySelector('.ldc-comp')) {
      foot.innerHTML = '<form class="ldc-comp"><textarea rows="1" placeholder="Write a message" aria-label="Message" maxlength="2000"></textarea><button class="ldc-send" type="submit" aria-label="Send">' + sendIcon + '</button></form>';
      var form = foot.querySelector('form'), ta = form.querySelector('textarea');
      ta.addEventListener('input', function () { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; });
      ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : send(e); } });
      form.addEventListener('submit', send);
    }
  }

  /* ---------- network ---------- */
  function call(payload) {
    return fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { return { ok: r.ok, status: r.status, body: b }; }); });
  }

  function start(e) {
    e.preventDefault();
    var f = e.target, err = f.querySelector('.ldc-err'), go = f.querySelector('.ldc-go');
    var name = f.name.value.trim(), email = f.email.value.trim(), message = f.message.value.trim();
    function fail(t) { err.textContent = t; err.hidden = false; go.disabled = false; go.textContent = 'Start chat'; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please check your email address.');
    if (message.length < 2) return fail('Please write a message.');
    err.hidden = true; go.disabled = true; go.textContent = 'Sending\u2026';
    call({ action: 'chat_start', name: name, email: email, message: message, page: location.href.slice(0, 300), website: f.website.value, t: Date.now() - opened })
      .then(function (r) {
        if (!r.ok || r.body.error) return fail(r.body.error || 'Something went wrong. Please try again.');
        if (!r.body.id) return fail('Something went wrong. Please try again.');
        state = { id: r.body.id, token: r.body.token, name: name, email: email };
        save(state);
        render();
        poll();
      })
      .catch(function () { fail('Couldn\u2019t send just now. Please email support@lilacdesk.com.'); });
  }

  function send(e) {
    e && e.preventDefault && e.preventDefault();
    var ta = root.querySelector('.ldc-comp textarea'), b = root.querySelector('.ldc-send');
    var text = ta.value.trim();
    if (!text || sending || !state) return;
    sending = true; b.disabled = true;
    var temp = { id: 'tmp' + Date.now(), sender: 'customer', body: text, created_at: new Date().toISOString() };
    messages.push(temp); ta.value = ''; ta.style.height = 'auto'; render();
    call({ action: 'chat_send', id: state.id, token: state.token, message: text })
      .then(function (r) {
        if (r.status === 404) return reset();
        messages = messages.filter(function (m) { return m !== temp; });
        if (!r.ok || r.body.error) { ta.value = text; window.alert(r.body.error || 'Couldn\u2019t send. Please try again.'); }
        else if (r.body.message) { addMessages([r.body.message]); }
        render();
      })
      .catch(function () { messages = messages.filter(function (m) { return m !== temp; }); ta.value = text; render(); window.alert('Couldn\u2019t send. Check your connection and try again.'); })
      .then(function () { sending = false; b.disabled = false; });
  }

  function addMessages(list) {
    var fresh = 0;
    list.forEach(function (m) {
      if (messages.some(function (x) { return x.id === m.id; })) return;
      messages.push(m);
      if (m.created_at > lastAt) lastAt = m.created_at;
      if (m.sender === 'admin' && (!state.seen || m.created_at > state.seen)) fresh++;
    });
    messages.sort(function (a, b) { return a.created_at < b.created_at ? -1 : 1; });
    return fresh;
  }

  function reset() { state = null; messages = []; lastAt = ''; save(null); render(); }

  function poll() {
    if (!state) return;
    var visible = open && document.visibilityState === 'visible';
    call({ action: 'chat_poll', id: state.id, token: state.token, since: lastAt || '', visible: visible })
      .then(function (r) {
        if (r.status === 404) return reset();
        if (!r.ok || !r.body.messages) return;
        var fresh = addMessages(r.body.messages);
        if (fresh) {
          if (visible) { state.seen = lastAt; save(state); }
          else { unread += fresh; badge(); }
        }
        if (r.body.messages.length) render();
      })
      .catch(function () {})
      .then(schedule);
  }

  function schedule() {
    clearTimeout(timer);
    if (!state) return;
    timer = setTimeout(poll, open && document.visibilityState === 'visible' ? POLL_OPEN : POLL_CLOSED);
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && state) poll(); });

  function init() { build(); if (state) poll(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
