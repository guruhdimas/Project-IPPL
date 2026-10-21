// Sidebar siswa bersama. Dipasang di setiap halaman siswa dengan:
//   <div id="sidebar-slot"></div><script src="js/sidebar.js"></script>
// Ubah menu di SINI saja, semua halaman ikut berubah.
(function () {
  var I = {
    grid:  '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    list:  '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    cal:   '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    clip:  '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    user:  '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    brief: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    bar:   '<path d="M12 20V10M18 20V4M6 20v-4"/>',
    out:   '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    menu:  '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };
  var MENU = [
    ['dashboard-siswa.html', 'Dashboard', 'grid'],
    ['daftar-ekskul.html', 'Daftar Ekskul', 'list'],
    ['jadwal.html', 'Jadwal', 'cal'],
    ['tugas.html', 'Tugas', 'clip'],
    ['absensi.html', 'Absensi', 'user'],
    ['pengumuman.html', 'Pengumuman', 'brief'],
    ['penilaian.html', 'Penilaian', 'bar']
  ];
  // Halaman turunan yang menyalakan menu induknya
  var INDUK = { 'detail-ekskul.html': 'daftar-ekskul.html', 'pendaftaran-ekskul.html': 'daftar-ekskul.html' };

  function svg(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + '</svg>';
  }

  var file = location.pathname.split('/').pop() || 'dashboard-siswa.html';
  file = INDUK[file] || file;

  var html =
    '<aside class="sb" id="sidebar" aria-label="Menu siswa">' +
      '<div class="sb-brand"><div class="sb-logo"><img src="assets/logo.png" alt="Logo SMA Trisula Praja" onerror="this.style.display=\'none\'"></div>' +
      '<div class="sb-name">SMA TRISULA PRAJA<span>EKSTRAKURIKULER</span></div></div>' +
      '<div class="sb-scroll" role="navigation" aria-label="Menu utama"><p class="sb-label">Menu Utama</p>' +
      MENU.map(function (m) {
        var on = m[0] === file;
        return '<a class="sb-link' + (on ? ' is-active' : '') + '" href="' + m[0] + '"' + (on ? ' aria-current="page"' : '') + '>' + svg(m[2]) + m[1] + '</a>';
      }).join('') + '</div>' +
      '<div class="sb-foot"><a class="sb-out" href="login.html">' + svg('out') + 'Keluar</a></div>' +
    '</aside><div class="sb-backdrop" id="sbBackdrop"></div>';

  // Hapus sidebar versi lama bila masih tertinggal di halaman (supaya tidak dobel)
  document.querySelectorAll('aside.sidebar, aside.side').forEach(function (a) { a.remove(); });

  var me = document.currentScript, slot = document.getElementById('sidebar-slot');
  if (slot) slot.outerHTML = html;
  else if (me) me.insertAdjacentHTML('beforebegin', html);
  else document.body.insertAdjacentHTML('afterbegin', html);

  function ready() {
    var out = document.querySelector('.sb-out');
    if (out) out.addEventListener('click', function () { try { localStorage.removeItem('peran'); } catch (e) {} });
    document.querySelectorAll('aside.sidebar, aside.side').forEach(function (a) { a.remove(); });
    var sb = document.getElementById('sidebar'), bd = document.getElementById('sbBackdrop');
    function set(open) { sb.classList.toggle('is-open', open); bd.classList.toggle('is-on', open); }
    var header = document.querySelector('.main > header, header.header, .main header');
    if (header) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sb-toggle'; b.setAttribute('aria-label', 'Buka menu'); b.innerHTML = svg('menu');
      b.addEventListener('click', function () { set(!sb.classList.contains('is-open')); });
      var kiri = header.querySelector('.header__left');
      if (!kiri) {
        // Header tanpa pembungkus kiri: bungkus judul agar tombol tidak mengacaukan tata letak
        var h1 = header.querySelector('h1');
        kiri = document.createElement('div');
        kiri.style.cssText = 'display:flex;align-items:center;min-width:0';
        if (h1) { header.insertBefore(kiri, h1); kiri.appendChild(h1); } else header.insertBefore(kiri, header.firstChild);
      }
      kiri.insertBefore(b, kiri.firstChild);
    }
    bd.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
