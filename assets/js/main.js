(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NOW = new Date();
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  /* =====================================================================
     CERTIFICATES: add one object per certificate.
       title     certificate name
       issuer    who issued it (e.g. "Google · Coursera")
       date      e.g. "Aug 2025" (optional)
       category  "security" | "tech" | "design" | "leadership" | "events" | "general"
       image     path to the certificate image, e.g. "assets/certs/play-it-safe.jpg"
                 (shown in full at its real proportions; JPG/PNG/WebP)
       verify    link to verify it (Coursera/Credly/issuer URL) (optional)
       verifyLabel  button text (optional, default "Verify")
       id        credential ID (optional)
     ===================================================================== */
  const CERTIFICATES = [
    {
      title: 'Google Cybersecurity', issuer: 'Google · Coursera', date: 'Aug 2025', category: 'security',
      image: './assets/certs/google_cs_certificate.jpg', verify: 'https://coursera.org/share/5b21885d1e7ebfc5c92f950aac5b611b'
    },
    {
      title: '111 Days of Learning for Challenge', issuer: 'Code for Change', date: '', image: './assets/certs/111days.jpeg', category: 'Appreciation',
      verify: 'https://drive.google.com/file/d/17hA0r_f_QlcvvgT9OIx-zGbUNpvdmGLe/view?usp=sharing', verifyLabel: 'Verify credential'
    },
    {
      title: 'CTF Champion', issuer: 'Listed on my LinkedIn profile', date: '', category: 'Certificate', image: './assets/certs/ctf.jpg',
      verify: 'https://drive.google.com/file/d/15IfdbA4H43axq9pV3nQU5t0xuokX0iAB/view?usp=sharing', verifyLabel: 'View on LinkedIn'
    },
    {
      title: 'Graphic Design & Digital Marketing', issuer: 'WOW Academy', date: 'Aug 23rd 2023 - Aug 25th 2024', category: 'Certificate', image: './assets/certs/wom.jpg',
      verify: 'https://drive.google.com/file/d/1rDgm4lkxCNAILCgHkD6mHRoxRhc0O-BB/view?usp=sharing', verifyLabel: 'View on Google Drive'
    },
    {
      title: 'Work Experience', issuer: 'General Technology Pvt.Ltd.', date: 'Oct 2023 - Jun 2024', category: 'Experience', image: './assets/certs/experience.jpg',
      verify: 'https://drive.google.com/file/d/1DllKi02LQ5f7VdoVHns8iusfE4QYEUeh/view?usp=sharing', verifyLabel: 'View on Google Drive'
    },
    {
      title: 'Work Experience', issuer: 'General Technology Pvt.Ltd.', date: 'Oct 2023 - Jun 2024', category: 'Certificate', image: './assets/certs/2days.png',
      verify: 'https://drive.google.com/file/d/1XyvTTIWcGXFKEhJNOsLkEoOh53kPaCrR/view?usp=sharing', verifyLabel: 'View on Google Drive'
    }
  ];

  $$('[data-year]').forEach(el => { el.textContent = NOW.getFullYear(); });

  /* ---- Nav: scrolled state + mobile menu ---- */
  const navWrap = $('#navWrap'), menuBtn = $('#menuBtn');
  const setMenu = open => { navWrap.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
  menuBtn.addEventListener('click', () => setMenu(!navWrap.classList.contains('open')));
  $$('#links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---- Scroll-driven: nav state + statement word reveal ---- */
  const st = $('#statement');
  let words = [];
  if (st && !reduce) {
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(st); words = $$('.w', st);
  }
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      navWrap.classList.toggle('scrolled', scrollY > 20);
      if (words.length) {
        const r = st.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .4)));
        const lit = Math.round(p * words.length * 1.15);
        words.forEach((w, i) => { w.style.opacity = i < lit ? '1' : '.28'; });
      }
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();

  /* ---- 3D point sphere ---- */
  const cv = $('#sphere');
  if (cv && cv.getContext) {
    const ctx = cv.getContext('2d'); const dpr = Math.min(2, window.devicePixelRatio || 1);
    const N = 520, pts = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
      pts.push([Math.cos(th) * rad, y, Math.sin(th) * rad, i % 9 === 0]);
    }
    let W = 0, H = 0, R = 0, rotY = 0, tiltX = -.35, tx = -.35, speed = .0022, raf = 0, visible = true;
    const size = () => { const b = cv.getBoundingClientRect(); W = b.width; H = b.height; R = Math.min(W, H) * .44; cv.width = Math.max(1, W * dpr); cv.height = Math.max(1, H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(tiltX), sx = Math.sin(tiltX);
      for (const [x, y, z, acc] of pts) {
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        const persp = 1 / (1.9 - z2 * .55);
        const px = W / 2 + x1 * R * persp * 1.3, py = H / 2 + y2 * R * persp * 1.3;
        const depth = (z2 + 1) / 2;
        const a = .08 + depth * .75;
        ctx.fillStyle = acc ? `rgba(52,211,153,${a})` : `rgba(237,237,237,${a * .85})`;
        ctx.beginPath(); ctx.arc(px, py, (acc ? 1.7 : 1.1) * (.55 + depth * .8), 0, Math.PI * 2); ctx.fill();
      }
    };
    const loop = () => { rotY += speed; tiltX += (tx - tiltX) * .04; draw(); raf = visible ? requestAnimationFrame(loop) : 0; };
    size(); draw();
    addEventListener('resize', () => { size(); draw(); });
    if (!reduce) {
      if (matchMedia('(hover: hover)').matches) addEventListener('pointermove', e => { tx = -.35 + (e.clientY / innerHeight - .5) * .5; speed = .0022 + (e.clientX / innerWidth - .5) * .004; }, { passive: true });
      if ('IntersectionObserver' in window) new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) loop(); }).observe(cv);
      loop();
    }
  }

  /* ---- Rotating role in the bento ---- */
  const rot = $('#rotator');
  if (rot) {
    const items = $$('span', rot); let i = 0;
    const fit = () => { rot.style.width = items[i].scrollWidth + 'px'; };
    rot.style.transition = 'width .6s cubic-bezier(.16,1,.3,1)'; fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if (!reduce) setInterval(() => { i = (i + 1) % items.length; items.forEach(s => { s.style.transform = `translateY(${-i * 100}%)`; }); fit(); }, 2600);
  }

  /* ---- Spotlight on tiles ---- */
  if (matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', e => {
      const t = e.target.closest && e.target.closest('.tile'); if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---- Clock (Kathmandu) ---- */
  const clock = $('#clock'), today = $('#today');
  const tick = () => {
    try {
      const d = new Date();
      clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit' }).format(d);
      if (today) today.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    } catch (e) { clock.textContent = 'NPT'; }
  };
  tick(); setInterval(tick, 15000);

  /* ---- Dates & durations ---- */
  const ym = s => { const [y, m] = s.split('-').map(Number); return { y, m }; };
  const nowYM = { y: NOW.getFullYear(), m: NOW.getMonth() + 1 };
  const fmt = d => `${MONTHS[d.m - 1]} ${d.y}`;
  const months = (a, b) => (b.y - a.y) * 12 + (b.m - a.m) + 1;
  const dur = n => { const y = Math.floor(n / 12), m = n % 12, p = []; if (y) p.push(`${y} yr${y > 1 ? 's' : ''}`); if (m) p.push(`${m} mo${m > 1 ? 's' : ''}`); return p.join(' ') || '1 mo'; };
  $$('.xp details[data-start]').forEach(d => {
    const s = ym(d.dataset.start), present = d.dataset.end === 'present', e = present ? nowYM : ym(d.dataset.end);
    const w = d.querySelector('[data-when]'); if (!w) return;
    w.textContent = `${fmt(s)} – ${present ? 'Present' : fmt(e)}`;
    const b = document.createElement('b'); b.textContent = dur(Math.max(1, months(s, e))); w.appendChild(b);
  });
  const yrs = $('#yrs'); if (yrs) yrs.textContent = Math.floor((months({ y: 2022, m: 7 }, nowYM) - 1) / 12) + '+';

  /* ---- Certificates: render, filter, lightbox ---- */
  const CAT_NAMES = { security: 'Security', tech: 'Tech', design: 'Design', leadership: 'Leadership', events: 'Events', general: 'General' };
  const ICONS = {
    security: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    events: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4"/><circle cx="12" cy="12" r="3"/></svg>',
    other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7"/></svg>'
  };
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  const EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = u => (/^(https?:|mailto:|tel:)/i.test(u || '') || /^[\w./-]+$/.test(u || '')) ? u : '';
  const grid = $('#certGrid'), LIMIT = 4;
  let certFilter = 'all', showAll = false;
  const lb = $('#lightbox');
  const openLb = c => {
    if (!lb || typeof lb.showModal !== 'function') { if (c.image) window.location.href = c.image; return; }
    $('#lbImg').src = c.image; $('#lbImg').alt = `${c.title} certificate`;
    $('#lbTitle').textContent = c.title; $('#lbBy').textContent = [c.issuer, c.date].filter(Boolean).join(' · ');
    const v = $('#lbVerify'); const url = safeUrl(c.verify);
    v.hidden = !url; if (url) { v.href = url; v.firstChild.textContent = (c.verifyLabel || 'Verify credential') + ' '; }
    lb.showModal();
  };
  if (lb) {
    $('#lbClose').addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  }
  const renderCerts = () => {
    if (!grid) return;
    grid.textContent = '';
    const list = CERTIFICATES.filter(c => certFilter === 'all' || c.category === certFilter);
    list.forEach((c, i) => {
      const card = document.createElement('article');
      card.className = 'tile cert-card';
      if (!showAll && i >= LIMIT) card.hidden = true;
      const cat = CAT_NAMES[c.category] || 'Certificate';
      const icon = ICONS[c.category] || ICONS.other;
      const img = safeUrl(c.image), url = safeUrl(c.verify);
      const frame = img
        ? `<button class="cert-frame" type="button" aria-label="Enlarge the ${esc(c.title)} certificate"><span class="cert-box"><img src="${esc(img)}" alt="${esc(c.title)} certificate issued by ${esc(c.issuer)}" loading="lazy" decoding="async"></span><span class="zoom">${EYE}Enlarge</span></button>`
        : `<div class="cert-frame"><div class="cert-ph"><span class="ci${c.category === 'events' ? ' amber' : ''}" aria-hidden="true">${icon}</span><b>${esc(c.title)}</b><small>${esc(cat)}</small></div></div>`;
      card.innerHTML = frame +
        `<div class="cert-body">
          <p class="cert-meta"><span class="cat">${esc(cat)}</span>${c.date ? `<span>${esc(c.date)}</span>` : ''}</p>
          <h3>${esc(c.title)}</h3>
          <p class="by">${esc(c.issuer)}</p>
          ${c.id ? `<p class="cid">Credential ID: ${esc(c.id)}</p>` : ''}
          <div class="cert-actions">
            ${url ? `<a class="verify" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(c.verifyLabel || 'Verify credential')} ${ARROW}</a>` : ''}
            ${img ? `<button class="viewbtn" type="button" data-view>${EYE}Enlarge</button>` : ''}
          </div>
        </div>`;
      card.querySelectorAll('button.cert-frame, [data-view]').forEach(b => b.addEventListener('click', () => openLb(c)));
      grid.appendChild(card);
    });
    const moreWrap = $('#certMoreWrap');
    if (moreWrap) { moreWrap.hidden = list.length <= LIMIT || showAll; $('#certMore').textContent = `Show all ${list.length} certificates`; }
    const nCert = CERTIFICATES.filter(c => c.category !== 'events').length, nEv = CERTIFICATES.length - nCert;
    const pad = n => String(n).padStart(2, '0');
    const cnt = $('#certCount');
    if (cnt) cnt.innerHTML = `<span><b>${pad(nCert)}</b>Certificates</span>` + (nEv ? `<span><b>${pad(nEv)}</b>Event${nEv > 1 ? 's' : ''}</span>` : '');
  };
  const cf = $('#certFilters');
  if (cf) {
    const cats = ['all', ...Object.keys(CAT_NAMES).filter(k => CERTIFICATES.some(c => c.category === k))];
    cats.forEach(k => {
      const b = document.createElement('button'); b.type = 'button'; b.dataset.filter = k;
      b.textContent = k === 'all' ? 'All' : CAT_NAMES[k]; b.setAttribute('aria-pressed', String(k === 'all'));
      b.addEventListener('click', () => { certFilter = k; showAll = false; cf.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderCerts(); });
      cf.appendChild(b);
    });
  }
  const more = $('#certMore'); if (more) more.addEventListener('click', () => { showAll = true; renderCerts(); });
  renderCerts();

  /* ---- Terminal ---- */
  const out = $('#termOut'), form = $('#termForm'), input = $('#termInput');
  if (out && form && input) {
    const LI = 'https://www.linkedin.com/in/sushant-budha-chhetri-25a792282/';
    const LINKS = {
      linkedin: LI, instagram: 'https://www.instagram.com/sushant_budha10/', facebook: 'https://www.facebook.com/sushant.budha.chhetri.2025',
      whatsapp: 'https://wa.me/9779826599812', email: 'mailto:contact@budhasushant.com.np', bugv: 'https://bugv.io/', techaxis: 'https://techaxis.com.np/'
    };
    const link = (href, text) => `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text || href)}</a>`;
    const SECTIONS = ['about', 'journey', 'experience', 'work', 'skills', 'certificates', 'terminal', 'now', 'contact'];
    const XP = [
      ['Sep 2026 – now', 'President, LBEF Entrepreneur Club'], ['current', 'Student Ambassador, BugV'], ['Jun 2026 – now', 'Student Partner, TechAxis'],
      ['Apr 2026 – now', 'Social Media Manager, Leo Club of Samarpan LBEF'], ['Apr – Jul 2026', 'General Member, Code for Change'],
      ['May – Jul 2025', 'Social Media Designer (intern), Delta Dynamics'], ['Oct 2023 – Jun 2024', 'Team Lead, General Technology Pvt. Ltd.'],
      ['Jul 2022 – now', 'Self-employed, Twilr Production']
    ];
    const ktm = () => { try { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', dateStyle: 'medium', timeStyle: 'short' }).format(new Date()); } catch (e) { return new Date().toString(); } };
    const C = {
      help: () => `<span class="hd">Available commands</span>
  <span class="ok">whoami</span>       who I am
  <span class="ok">about</span>        a short summary
  <span class="ok">neofetch</span>     profile at a glance
  <span class="ok">experience</span>   roles and dates
  <span class="ok">education</span>    where I study
  <span class="ok">skills</span>       tools I use
  <span class="ok">certs</span>        certificates
  <span class="ok">projects</span>     things I've built
  <span class="ok">nisc</span>         what I'm building now
  <span class="ok">contact</span>      how to reach me
  <span class="ok">socials</span>      social links
  <span class="ok">open</span> &lt;name&gt;  linkedin · instagram · facebook · whatsapp · email
  <span class="ok">ls</span> / <span class="ok">cd</span> &lt;section&gt;  jump around this page
  <span class="ok">date</span>  <span class="ok">history</span>  <span class="ok">echo</span>  <span class="ok">clear</span>`,
      whoami: () => `<span class="hd">Sushant Budha Chhetri</span>
Cybersecurity Student · BSc IT in Cyber Security @ APU / APIIT
President, LBEF Entrepreneur Club · Student Ambassador, BugV`,
      about: () => `I'm a student interested in cybersecurity, digital design and building useful projects.
I learn by doing, share what I learn, and enjoy working with people who bring different ideas.
I'm open to internships, projects, collaborations and learning from experienced people.`,
      neofetch: () => `<span class="ok">sushant</span>@<span class="ok">portfolio</span>
<span class="mut">-----------------</span>
<span class="ok">Role</span>      Cybersecurity Student
<span class="ok">Study</span>     BSc IT, Cyber Security (APU, 2025–2028)
<span class="ok">Base</span>      Kathmandu · Nepalgunj, Nepal
<span class="ok">Leads</span>     LBEF Entrepreneur Club (President)
<span class="ok">Security</span>  Kali Linux, Burp Suite, Rocky Linux
<span class="ok">Labs</span>      TryHackMe, Hack The Box
<span class="ok">Web</span>       HTML, CSS, JavaScript, WordPress
<span class="ok">Design</span>    Canva, Figma, Premiere / CapCut
<span class="ok">Status</span>    open to internships`,
      experience: () => `<span class="hd">Experience</span>\n` + XP.map(([d, r]) => `  <span class="mut">${d.padEnd(20, ' ')}</span>${esc(r)}`).join('\n'),
      education: () => `<span class="hd">Education</span>
  <span class="mut">2025 – 2028</span>  BSc IT in Cyber Security, APU / APIIT
  <span class="mut">2022 – 2024</span>  Computer Science, Sagarmatha E.B School`,
      skills: () => `<span class="hd">Skills</span>
  <span class="ok">security</span>   Kali Linux · Burp Suite · Rocky Linux · Linux &amp; Bash
  <span class="ok">web</span>        HTML · CSS · JavaScript · WordPress
  <span class="ok">design</span>     Canva · Figma · Premiere / CapCut · Meta Business Suite
  <span class="ok">labs</span>       TryHackMe · Hack The Box
  <span class="ok">people</span>     Leadership · Team management · Event planning`,
      certs: () => `<span class="hd">Certificates</span>\n` + CERTIFICATES.map(c => `  <span class="ok">✓</span> ${esc(c.title)} <span class="mut">(${esc(c.issuer)})</span>`).join('\n') + `\n<span class="mut">Type</span> cd certificates <span class="mut">to see them with images.</span>`,
      projects: () => `<span class="hd">Projects</span>
  <span class="ok">•</span> NISC website &amp; member portal <span class="warn">[in progress]</span>
  <span class="ok">•</span> Hands-on security labs on TryHackMe &amp; Hack The Box
  <span class="ok">•</span> This portfolio: HTML, CSS, JS, strict CSP and security headers
  <span class="ok">•</span> Twilr Production: design, content and digital growth
  <span class="ok">•</span> Social media design for Delta Dynamics and Leo Club`,
      nisc: () => `<span class="hd">NISC website &amp; member portal</span> <span class="warn">[in progress]</span>
Official website for the Nepalgunj IT Students Community, with a member login portal.
  <span class="ok">roles</span>    Admin · Team · Student
  <span class="ok">accounts</span> created by admins only, no public sign-up
  <span class="ok">hosting</span>  Cloudflare + GitHub`,
      contact: () => `<span class="hd">Contact</span>
  <span class="ok">email</span>     ${link('mailto:contact@budhasushant.com.np', 'contact@budhasushant.com.np')}
  <span class="ok">phone</span>     ${link('tel:+9779826599812', '+977 9826599812')}
  <span class="ok">whatsapp</span>  ${link(LINKS.whatsapp, 'wa.me/9779826599812')}
  <span class="ok">linkedin</span>  ${link(LI, 'sushant-budha-chhetri')}`,
      socials: () => Object.entries(LINKS).filter(([k]) => ['linkedin', 'instagram', 'facebook', 'whatsapp'].includes(k)).map(([k, v]) => `  <span class="ok">${k.padEnd(10, ' ')}</span>${link(v)}`).join('\n'),
      ls: () => SECTIONS.map(x => `<span class="ok">${x}/</span>`).join('  '),
      date: () => `${ktm()} <span class="mut">(Kathmandu, UTC+5:45)</span>`,
      pwd: () => '/home/sushant/portfolio',
      history: () => hist.map((h, i) => `  <span class="mut">${String(i + 1).padStart(3, ' ')}</span>  ${esc(h)}`).join('\n') || '<span class="mut">no history yet</span>',
      sudo: args => /hire/.test(args.join(' '))
        ? `<span class="ok">[sudo] access granted.</span> Great choice. Reach me at ${link('mailto:contact@budhasushant.com.np?subject=Let%27s%20work%20together', 'contact@budhasushant.com.np')}`
        : `<span class="warn">sushant is not in the sudoers file.</span> This incident will be reported.`,
      echo: args => esc(args.join(' ')),
      open: args => { const k = (args[0] || '').toLowerCase(); return LINKS[k] ? `Open ${esc(k)}: ${link(LINKS[k])}` : `<span class="err">open: unknown target</span> <span class="mut">try: linkedin, instagram, facebook, whatsapp, email</span>`; },
      cd: args => {
        const t = (args[0] || '').replace(/\/$/, '').toLowerCase();
        if (!t || t === '~' || t === '..') { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return '<span class="mut">back to the top</span>'; }
        const el = document.getElementById(t);
        if (!el || !SECTIONS.includes(t)) return `<span class="err">cd: no such section: ${esc(t)}</span> <span class="mut">(type ls)</span>`;
        setTimeout(() => el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 150);
        return `<span class="mut">moving to</span> ${esc(t)}/`;
      }
    };
    C.xp = C.experience; C.edu = C.education; C.tools = C.skills; C.certificates = C.certs; C.work = C.projects; C.man = C.help; C['?'] = C.help;
    const hist = []; let hIdx = 0;
    const print = (html, cls) => { const d = document.createElement('span'); d.className = 'ln' + (cls ? ' ' + cls : ''); d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; };
    const run = raw => {
      const line = raw.trim();
      print(`<span class="ps">~$</span> ${esc(line)}`);
      if (!line) return;
      hist.push(line); hIdx = hist.length;
      const [cmd, ...args] = line.split(/\s+/);
      const key = cmd.toLowerCase();
      if (key === 'clear' || key === 'cls') { out.textContent = ''; return; }
      const fn = C[key];
      print(fn ? fn(args) : `<span class="err">command not found: ${esc(cmd)}</span> <span class="mut">(type help)</span>`);
    };
    print(`<span class="hd">sushant@portfolio</span> <span class="mut">· last login ${ktm()} from Kathmandu</span>
Welcome. Type <span class="ok">help</span> to see what I can show you.`);
    form.addEventListener('submit', e => { e.preventDefault(); run(input.value); input.value = ''; });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') { if (hIdx > 0) { hIdx--; input.value = hist[hIdx]; } e.preventDefault(); }
      else if (e.key === 'ArrowDown') { if (hIdx < hist.length - 1) { hIdx++; input.value = hist[hIdx]; } else { hIdx = hist.length; input.value = ''; } e.preventDefault(); }
      else if (e.key === 'Tab') {
        const v = input.value.trim().toLowerCase(); if (!v) return;
        const hit = Object.keys(C).concat(['clear']).filter(k => k.startsWith(v));
        if (hit.length === 1) { input.value = hit[0] + ' '; e.preventDefault(); }
        else if (hit.length > 1) { print(hit.join('  '), 'mut'); e.preventDefault(); }
      }
    });
    $('#term').addEventListener('click', e => { if (!e.target.closest('a')) input.focus({ preventScroll: true }); });
    $$('#cmdChips button').forEach(b => b.addEventListener('click', () => { run(b.dataset.cmd); }));
  }

  /* ---- Work filters ---- */
  const cards = $$('.w-card');
  $$('#work .filters button').forEach(btn => btn.addEventListener('click', () => {
    $$('#work .filters button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const f = btn.dataset.filter;
    cards.forEach(c => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
  }));

  /* ---- Reveal on scroll ---- */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(el => io.observe(el));
  }

  /* ---- Active nav link ---- */
  if ('IntersectionObserver' in window) {
    const links = new Map($$('#links a').map(a => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const a = links.get(e.target.id); if (!a) return;
      links.forEach(x => { x.classList.remove('is-active'); x.removeAttribute('aria-current'); });
      a.classList.add('is-active'); a.setAttribute('aria-current', 'true');
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => so.observe(s));
  }

  /* ---- Copy email ---- */
  const EMAIL = 'contact@budhasushant.com.np', copyBtn = $('#copyEmail');
  copyBtn.addEventListener('click', () => {
    const done = t => { copyBtn.textContent = t; clearTimeout(copyBtn._t); copyBtn._t = setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2400); };
    const selectIt = () => { const r = document.createRange(); r.selectNodeContents($('#emailText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Press Ctrl+C'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(() => done('Copied'), selectIt); else selectIt();
  });
})();
