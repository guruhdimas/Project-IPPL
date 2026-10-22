/* Layout bersama halaman Pembimbing — sidebar, topbar, footer ditulis SEKALI di sini.
   Pakai di tiap halaman:
     <aside id="pb-sidebar" data-active="jadwal"></aside>
     <div class="pb-main"><header id="pb-topbar"></header> ... <div id="pb-foot"></div></div>
     <link rel="stylesheet" href="css/pb-layout.css">  +  <script src="js/pb-layout.js"></script>
   data-active: dashboard | kelola | jadwal | tugas | absensi | pengumuman | penilaian
   Opsional (sebelum script ini): window.PB_USER = {nama:'...', role:'...'}; window.PB_LOGOUT_URL = 'login.html'; */
(function () {
  'use strict';
  const USER = Object.assign({nama: 'Abdul Husein, S.T', role: 'Pembimbing',
    foto: 'assets/pembimbing/profile.png', logo: 'assets/pembimbing/logo.png'}, window.PB_USER || {});

  const IC = {
    home: `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="currentColor"><path d="M3 11.5 12 3l9 8.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>`,
    group: `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="currentColor"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6z"/><circle cx="17.5" cy="9" r="2.8"/><path d="M17 13.5c3.2 0 5 1.8 5 4.5v2h-4.5v-1.8c0-1.9-.6-3.5-1.6-4.6.3-.1.7-.1 1.1-.1z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="currentColor"><path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3z"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 2v4M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    requirements: `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
    inspection: `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 13l2 2 4-4"/></svg>`,
    commercial: `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="currentColor"><path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z"/><path d="M16.5 8.5a4.5 4.5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    graph: `<svg viewBox="0 0 24 24" width="25" height="25" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3v17h17"/><path d="m8 15 3-4 3 2 5-6"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`
  };
  const LOGO = `<svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="21" fill="#1d2b21" stroke="#caa42e" stroke-width="2.5"/><path d="M28 12v30M20 17c0 6 3 9 8 9s8-3 8-9M21 36c2 4 4 6 7 6s5-2 7-6M9 22c-3 5-3 11 0 16M47 22c3 5 3 11 0 16" fill="none" stroke="#caa42e" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  const AVA = `<svg viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="21" fill="#9ca3af"/><circle cx="21" cy="16" r="7" fill="#fff"/><path d="M7.5 35c1.2-7 6.5-10 13.5-10s12.3 3 13.5 10a21 21 0 0 1-27 0z" fill="#fff"/></svg>`;

  /* href null = halaman belum ada (akan menampilkan pesan). Isi nanti bila file-nya sudah dibuat. */
  const NAV = [
    {k: 'dashboard',  t: 'Dasboard',         ic: 'home',         href: 'dashboard-pembimbing.html'},
    {k: 'kelola',     t: 'Kelola Anggota',   ic: 'group',        href: 'kelola-anggota-pembimbing.html'},
    {k: 'jadwal',     t: 'Jadwal',           ic: 'calendar',     href: 'jadwal-pembimbing.html'},
    {k: 'tugas',      t: 'Tugas',            ic: 'requirements', href: 'tugas-pembimbing.html'},
    {k: 'absensi',    t: 'Absensi',          ic: 'inspection',   href: 'absensi-pembimbing.html'},
    {k: 'pengumuman', t: 'Pengumuman',       ic: 'commercial',   href: null},
    {k: 'penilaian',  t: 'Indeks Penilaian', ic: 'graph',        href: null}
  ];

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sb = document.getElementById('pb-sidebar');
  if (!sb) return;
  const active = sb.dataset.active;

  /* Toast bersama: window.toast('pesan') */
  let toastEl, tt;
  window.toast = function (msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'pb-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), 2400);
  };

  /* Sidebar */
  sb.classList.add('pb-sidebar');
  sb.innerHTML = `<div class="pb-brand"><i class="pb-logo">${LOGO}<img src="${esc(USER.logo)}" alt="" onerror="this.remove()"></i><b>SMA TRISULA PRAJA</b></div>
    <nav class="pb-nav" aria-label="Menu pembimbing">${NAV.map(n => {
      const on = n.k === active;
      return `<a href="${n.href || '#'}" data-k="${n.k}"${on ? ' class="on" aria-current="page"' : ''}${n.href ? '' : ' data-soon'}>${IC[n.ic]}${esc(n.t)}</a>`;
    }).join('')}</nav>
    <button class="pb-logout" type="button">Logout</button>`;

  /* Topbar */
  const tb = document.getElementById('pb-topbar');
  if (tb) {
    tb.classList.add('pb-topbar');
    tb.innerHTML = `<button class="pb-burger" type="button" aria-label="Buka menu">${IC.menu}</button>
      <i class="pb-ava">${AVA}<img src="${esc(USER.foto)}" alt="" onerror="this.remove()"></i>
      <div class="pb-who">${esc(USER.nama)}<span class="pb-badge">${esc(USER.role)}</span></div>`;
  }

  /* Footer */
  const ft = document.getElementById('pb-foot');
  if (ft) { ft.classList.add('pb-foot'); ft.textContent = 'Portal Ekstrakurikuler © 2026 · SMA Trisula Praja'; }

  /* Backdrop menu geser (layar kecil) */
  const bd = document.createElement('div'); bd.className = 'pb-backdrop'; bd.id = 'pb-backdrop'; document.body.appendChild(bd);
  const closeMenu = () => { sb.classList.remove('open'); bd.classList.remove('on'); };

  document.addEventListener('click', e => {
    const a = e.target.closest('#pb-sidebar a');
    if (a) {
      if (a.hasAttribute('data-soon')) { e.preventDefault(); toast('Halaman ' + a.textContent.trim() + ' belum dihubungkan'); }
      else if (a.classList.contains('on')) { e.preventDefault(); document.dispatchEvent(new CustomEvent('pb:nav-active')); }
      return closeMenu();
    }
    if (e.target.closest('.pb-logout')) {
      if (!confirm('Yakin ingin keluar?')) return;
      if (window.PB_LOGOUT_URL) location.href = window.PB_LOGOUT_URL; else toast('Logout (hubungkan ke halaman login pembimbing)');
      return;
    }
    if (e.target.closest('.pb-burger')) { sb.classList.add('open'); bd.classList.add('on'); return; }
    if (e.target === bd) closeMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
})();
