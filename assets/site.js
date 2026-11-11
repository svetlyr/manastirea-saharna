/* Shared behaviour for the three Saharna sketches. Each block is optional:
   a page only needs the data-attributes for the parts it uses. */
(() => {
  'use strict';

  const one = (sel, root = document) => root.querySelector(sel);
  const all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = (fn) => { try { fn(); } catch (err) { console.error(err); } };

  // Sample times: the Figma file has the service names but no hours. Replace with the real schedule.
  const SCHEDULE = {
    weekday: [
      { time: '06:00', name: 'Miezonoptica și Utrenia', note: 'Slujba de dimineață', place: 'Biserica mare' },
      { time: '08:30', name: 'Sfânta Liturghie', note: 'Pomenirea pomelnicelor', place: 'Biserica mare' },
      { time: '12:00', name: 'Acatistul Sfântului Macarie', note: 'La racla cu sfintele moaște', place: 'Biserica mare' },
      { time: '17:00', name: 'Vecernia', note: 'Urmată de spovedanie', place: 'Biserica mare' },
      { time: '19:00', name: 'Pavecernița', note: 'Rugăciunile de seară', place: 'Obștea' }
    ],
    sunday: [
      { time: '07:00', name: 'Miezonoptica și Utrenia', note: 'Slujba de dimineață', place: 'Biserica mare' },
      { time: '09:00', name: 'Sfânta Liturghie', note: 'Pomenirea pomelnicelor', place: 'Biserica mare' },
      { time: '12:30', name: 'Acatistul Sfântului Macarie', note: 'La racla cu sfintele moaște', place: 'Biserica mare' },
      { time: '17:00', name: 'Vecernia', note: 'Urmată de spovedanie', place: 'Biserica mare' }
    ],
    feast: [
      { time: '06:30', name: 'Miezonoptica și Utrenia', note: 'Slujba de dimineață', place: 'Biserica mare' },
      { time: '09:00', name: 'Sfânta Liturghie', note: 'Pomenirea pomelnicelor', place: 'Biserica mare' },
      { time: '12:30', name: 'Acatistul Sfântului Macarie', note: 'La racla cu sfintele moaște', place: 'Biserica mare' },
      { time: '17:00', name: 'Vecernia', note: 'Urmată de spovedanie', place: 'Biserica mare' }
    ]
  };

  const dayKey = (date) => (date.getDay() === 0 ? 'sunday' : 'weekday');
  const minutesOf = (time) => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const serviceRow = (service, status) => {
    const row = el('li', 'svc' + (status ? ' is-' + status.key : ''));
    const time = el('time', 'svc-time', service.time);
    time.setAttribute('datetime', service.time);
    const body = el('div', 'svc-body');
    body.append(el('strong', 'svc-name', service.name), el('span', 'svc-note', service.note));
    row.append(time, body, el('span', 'svc-place', status ? status.label : service.place));
    return row;
  };

  const nextService = (now) => {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = SCHEDULE[dayKey(now)].find((s) => minutesOf(s.time) > nowMin);
    if (today) return { service: today, day: 'Azi', inMin: minutesOf(today.time) - nowMin };
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    const first = SCHEDULE[dayKey(tomorrow)][0];
    return { service: first, day: 'Mâine', inMin: 24 * 60 - nowMin + minutesOf(first.time) };
  };

  const relative = (min) => {
    const h = Math.floor(min / 60), m = min % 60;
    if (h === 0) return `peste ${m} min`;
    return m === 0 ? `peste ${h} h` : `peste ${h} h ${m} min`;
  };

  // "Next service" card and today's list
  run(() => {
    const slots = all('[data-next]');
    const todayLists = all('[data-today-list]');
    if (!slots.length && !todayLists.length) return;
    const paint = () => {
      const now = new Date();
      const next = nextService(now);
      const values = { day: next.day, time: next.service.time, name: next.service.name, rel: relative(next.inMin), note: next.service.note };
      slots.forEach((slot) => { slot.textContent = values[slot.dataset.next] || ''; });
      const nowMin = now.getHours() * 60 + now.getMinutes();
      todayLists.forEach((list) => {
        const rows = SCHEDULE[dayKey(now)].map((service) => {
          const isNext = next.day === 'Azi' && service === next.service;
          const status = minutesOf(service.time) <= nowMin
            ? { key: 'past', label: 'Încheiată' }
            : isNext ? { key: 'next', label: 'Urmează' } : { key: 'later', label: service.place };
          return serviceRow(service, status);
        });
        list.replaceChildren(...rows);
      });
    };
    paint();
    setInterval(paint, 60 * 1000);
  });

  // Schedule tabs
  run(() => {
    all('[data-schedule]').forEach((root) => {
      const tabs = all('[data-tab]', root);
      const list = one('[data-schedule-list]', root);
      const panel = one('[role="tabpanel"]', root);
      if (!tabs.length || !list) return;
      const select = (tab, focus) => {
        tabs.forEach((t) => {
          const on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
        });
        list.replaceChildren(...SCHEDULE[tab.dataset.tab].map((s) => serviceRow(s)));
        if (panel && tab.id) panel.setAttribute('aria-labelledby', tab.id);
        if (focus) tab.focus();
      };
      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => select(tab, false));
        tab.addEventListener('keydown', (e) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          e.preventDefault();
          select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
        });
      });
      select(tabs.find((t) => t.dataset.tab === dayKey(new Date())) || tabs[0], false);
    });
  });

  // Menu dialog
  const menu = one('[data-menu]');
  run(() => {
    const opener = one('[data-menu-open]');
    if (!menu || !opener) return;
    opener.addEventListener('click', () => { if (!menu.open) menu.showModal(); });
    all('[data-menu-close]', menu).forEach((b) => b.addEventListener('click', () => menu.close()));
    menu.addEventListener('click', (e) => { if (e.target === menu) menu.close(); });
    menu.addEventListener('close', () => opener.focus());
  });

  // In-page links scroll without relying on URL navigation
  run(() => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      all('dialog[open]').forEach((d) => d.close());
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // Detail panels: any [data-open="dialog-id"] opens that dialog, [data-close] closes it
  run(() => {
    let opener = null;
    document.addEventListener('click', (e) => {
      const open = e.target.closest('[data-open]');
      if (open) {
        const dialog = document.getElementById(open.dataset.open);
        if (dialog && !dialog.open) { opener = open; dialog.showModal(); }
        return;
      }
      const close = e.target.closest('[data-close]');
      if (close) { const dialog = close.closest('dialog'); if (dialog) dialog.close(); return; }
      if (e.target.matches && e.target.matches('dialog[data-panel]')) e.target.close();
    });
    all('dialog[data-panel]').forEach((dialog) => {
      dialog.addEventListener('close', () => { if (opener && opener.isConnected) opener.focus(); });
    });
  });

  // Language switch: marks the choice only, translations are not part of the sketch
  run(() => {
    const names = { ro: 'Română', ru: 'Русский', en: 'English' };
    const status = one('[data-lang-status]');
    const buttons = all('[data-lang]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === button.dataset.lang)));
        if (status) {
          status.textContent = button.dataset.lang === 'ro'
            ? 'Limba selectată: Română.'
            : `Limba selectată: ${names[button.dataset.lang]}. Traducerea urmează.`;
        }
      });
    });
  });

  // Copy IBAN
  run(() => {
    all('[data-copy]').forEach((button) => {
      const label = one('[data-copy-label]', button) || button;
      const idle = label.textContent;
      button.addEventListener('click', async () => {
        let text = 'Copiat';
        try { await navigator.clipboard.writeText(button.dataset.copy); } catch (err) { text = 'Copiați manual'; }
        label.textContent = text;
        setTimeout(() => { label.textContent = idle; }, 2500);
      });
    });
  });

  // Hero video: the pause control appears only once a real video source is added
  run(() => {
    const video = one('[data-hero-video]');
    const toggle = one('[data-video-toggle]');
    if (!video || !toggle || !one('source', video)) return;
    const label = one('[data-video-label]', toggle) || toggle;
    toggle.hidden = false;
    const sync = () => {
      toggle.setAttribute('aria-pressed', String(video.paused));
      label.textContent = video.paused ? 'Pornește filmul' : 'Oprește filmul';
    };
    if (reducedMotion) video.pause();
    toggle.addEventListener('click', () => { if (video.paused) video.play().catch(() => {}); else video.pause(); });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    sync();
  });

  // Header state and chapter index
  run(() => {
    const root = document.documentElement;
    const onScroll = () => root.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const spyLinks = all('[data-spy] a[href^="#"]');
    if (!spyLinks.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        spyLinks.forEach((a) => {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyLinks.forEach((a) => {
      const section = document.getElementById(a.getAttribute('href').slice(1));
      if (section) observer.observe(section);
    });
  });

  // Review aid for the client presentation: a small link back to the cover page with all sketches
  run(() => {
    const link = el('a', '', '\u2190 Toate schițele');
    link.href = 'index.html';
    Object.assign(link.style, {
      position: 'fixed', left: '16px', zIndex: '45', display: 'inline-flex', alignItems: 'center',
      minHeight: '44px', padding: '0 16px', background: '#1A1A1A', color: '#FFFFFF', border: '1px solid #FFFFFF',
      borderRadius: '999px', font: '600 15px/1 system-ui, sans-serif', textDecoration: 'none',
      boxShadow: '0 4px 16px rgba(0,0,0,.3)'
    });
    const place = () => {
      const bar = all('.dock, .bottombar').find((b) => getComputedStyle(b).position === 'fixed' && getComputedStyle(b).display !== 'none');
      link.style.bottom = ((bar ? bar.offsetHeight : 0) + 16) + 'px';
    };
    document.body.append(link);
    place();
    window.addEventListener('resize', place);
  });

  // Pomelnic form
  run(() => {
    const form = one('[data-pform]');
    if (!form) return;
    const success = one('[data-form-success]');
    const summary = one('[data-form-summary]', form);
    const field = (id) => one('#' + id, form);
    const value = (id) => (field(id) ? field(id).value.trim() : '');
    const checks = [
      { id: 'f-name', ok: () => value('f-name').length >= 2, msg: 'Scrieți numele dumneavoastră, ca să vă putem confirma primirea.' },
      { id: 'f-mail', ok: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('f-mail')), msg: 'Scrieți o adresă de email validă, de exemplu nume@exemplu.md.' },
      { id: 'f-vii', ok: () => value('f-vii') !== '' || value('f-adorm') !== '', msg: 'Scrieți cel puțin un nume, la cei vii sau la cei adormiți.' }
    ];
    const show = (check, valid) => {
      const input = field(check.id);
      const error = one('#' + check.id + '-err', form);
      if (input) input.setAttribute('aria-invalid', String(!valid));
      if (error) { error.textContent = valid ? '' : check.msg; error.hidden = valid; }
      return valid;
    };
    const clear = () => {
      checks.forEach((c) => show(c, true));
      all('[aria-invalid]', form).forEach((i) => i.removeAttribute('aria-invalid'));
      if (summary) { summary.hidden = true; summary.replaceChildren(); }
    };
    const submit = () => {
      const failed = checks.filter((c) => !show(c, c.ok()));
      if (failed.length) {
        if (summary) {
          const list = el('ul');
          failed.forEach((c) => {
            const item = el('li');
            const link = el('a', '', c.msg);
            link.href = '#' + c.id;
            item.append(link);
            list.append(item);
          });
          summary.replaceChildren(el('strong', '', 'Mai sunt de completat:'), list);
          summary.hidden = false;
          summary.focus();
        } else if (field(failed[0].id)) field(failed[0].id).focus();
        return;
      }
      clear();
      form.hidden = true;
      if (success) { success.hidden = false; success.focus(); }
    };
    checks.forEach((c) => {
      const input = field(c.id);
      if (input) input.addEventListener('blur', () => { if (input.value !== '' || input.hasAttribute('aria-invalid')) show(c, c.ok()); });
    });
    const adorm = field('f-adorm');
    if (adorm) adorm.addEventListener('blur', () => { if (field('f-vii') && field('f-vii').hasAttribute('aria-invalid')) show(checks[2], checks[2].ok()); });
    form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
    const send = one('[data-form-send]', form);
    if (send) send.addEventListener('click', submit);
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); submit(); }
    });
    const again = one('[data-form-again]');
    if (again) again.addEventListener('click', () => {
      all('input, textarea', form).forEach((i) => { i.value = ''; });
      const type = field('f-type');
      if (type) type.selectedIndex = 0;
      clear();
      if (success) success.hidden = true;
      form.hidden = false;
      const first = field('f-name');
      if (first) first.focus();
    });
  });
})();
