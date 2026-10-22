// Halaman Kelola Anggota (Pembimbing).
// Data contoh disimpan di localStorage browser. Jika nanti ada database (PHP + MySQL),
// ganti fungsi muatData() dan simpanData() dengan permintaan ke server.
(function () {
  var KEY = 'kelolaAnggotaV1';
  var KUOTA = 30;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- Data ----------
  var EKSKUL = [
    { id: 'robotic', nama: 'Robotic', jadwal: 'Rabu 14.00',
      deskripsi: 'Merakit robot, mempelajari sensor, mikrokontroler, Internet of Things, dan mengikuti kompetisi teknologi.' },
    { id: 'cyber', nama: 'Cyber', jadwal: 'Senin 14.00',
      deskripsi: 'Belajar pemrograman, jaringan komputer, keamanan digital, pengembangan website, dan kompetisi Capture the Flag secara legal.' },
    { id: 'english', nama: 'English Club', jadwal: 'Selasa 14.00',
      deskripsi: 'Melatih cara berkomunikasi, argumentasi, presentasi, dan kemampuan berbahasa Inggris.' },
    { id: 'science', nama: 'Science Research Club', jadwal: 'Kamis 14.00',
      deskripsi: 'Mengembangkan penelitian, eksperimen, karya ilmiah, dan inovasi untuk kompetisi sains.' },
    { id: 'seni', nama: 'Seni Dan Budaya', jadwal: 'Jumat 14.00',
      deskripsi: 'Mengembangkan bakat tari tradisional, musik, teater, dan pelestarian budaya Indonesia.' },
    { id: 'basket', nama: 'Basket Dan Futsal', jadwal: 'Sabtu 08.00',
      deskripsi: 'Membangun kebugaran, kerja sama tim, kedisiplinan, dan kemampuan berkompetisi.' }
  ];

  function P(nama, kelas) { return { id: uid(), nama: nama, kelas: kelas, tanggal: '10 Okt 2026', status: 'Menunggu' }; }
  function A(nama, kelas, gabung, hadir, tugas) { return { id: uid(), nama: nama, kelas: kelas, gabung: gabung, hadir: hadir, tugas: tugas }; }
  var seq = 0;
  function uid() { seq += 1; return 'm' + Date.now().toString(36) + seq + Math.random().toString(36).slice(2, 5); }

  function dataAwal() {
    return {
      diampu: [],
      anggota: {
        robotic: {
          pending: [P('Dimas Saputra', 'XII IPA 2'), P('Agus Santoso', 'XII IPA 1'), P('Rahayu Dwi Kartika', 'XI IPS 1')],
          aktif: [A('Dimas Saputra', 'XII IPA 2', '10 Februari 2025', '100%', 1), A('Agus Santoso', 'XII IPA 1', '12 Februari 2025', '92%', 2),
                  A('Rahayu Dwi Kartika', 'XI IPS 1', '12 Februari 2025', '88%', 2), A('Dwi Kartika', 'XII IPA 3', '3 Maret 2025', '85%', 1),
                  A('Randi Rahmat', 'XII IPA 2', '3 Maret 2025', '90%', 2), A('Wahyu Firmawan', 'XI IPS 2', '9 Maret 2025', '78%', 1)]
        },
        cyber: {
          pending: [P('Randi Darmawan', 'XI IPA 3')],
          aktif: [A('Fajar Nugroho', 'XII IPA 1', '5 Februari 2025', '95%', 3), A('Salsabila Putri', 'XI IPA 2', '8 Februari 2025', '90%', 2)]
        },
        english: { pending: [], aktif: [A('Nadia Ramadhani', 'XI IPS 1', '14 Februari 2025', '96%', 2), A('Bagas Prakoso', 'XII IPS 2', '14 Februari 2025', '84%', 1)] },
        science: { pending: [P('Citra Lestari', 'X IPA 1')], aktif: [A('Hendra Wijaya', 'XII IPA 3', '20 Februari 2025', '89%', 2)] },
        seni: { pending: [], aktif: [A('Putri Anindita', 'XI IPS 3', '2 Maret 2025', '93%', 1)] },
        basket: { pending: [P('Rizky Maulana', 'X IPS 2')], aktif: [A('Alvin Pratama', 'XII IPS 1', '1 Maret 2025', '87%', 0), A('Kevin Saputra', 'XI IPA 1', '1 Maret 2025', '91%', 1)] }
      }
    };
  }

  function muatData() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.anggota && d.diampu) return d;
      }
    } catch (e) {}
    return dataAwal();
  }
  function simpanData() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  var S = muatData();
  var view = { name: S.diampu.length ? 'diampu' : 'pilih', id: null, tab: 'verifikasi' };
  var f = { q: '', eks: '', kelas: '', status: 'Menunggu' };

  function cari(id) { return EKSKUL.filter(function (e) { return e.id === id; })[0]; }
  function grup(id) { return S.anggota[id]; }
  function tanggalIni() { return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }
  function inisial(n) { return n.split(/\s+/).slice(0, 2).map(function (x) { return x.charAt(0).toUpperCase(); }).join(''); }
  function menunggu(id) { return grup(id).pending.filter(function (p) { return p.status === 'Menunggu'; }); }
  function resetFilter() { f = { q: '', eks: '', kelas: '', status: 'Menunggu' }; }

  // ---------- Toast ----------
  var tt;
  function toast(msg, err) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'toast is-on' + (err ? ' is-err' : '');
    clearTimeout(tt);
    tt = setTimeout(function () { t.className = 'toast'; }, 2600);
  }

  // ---------- Potongan HTML ----------
  function kuotaHtml(n, card) {
    var pct = Math.min(100, Math.round(n / KUOTA * 100));
    return '<div class="kuota' + (card ? ' kuota--card' : '') + '"><div class="kuota__row"><span>Kuota</span><b>' + n + '/' + KUOTA + '</b></div>' +
      '<div class="kuota__track" role="progressbar" aria-valuemin="0" aria-valuemax="' + KUOTA + '" aria-valuenow="' + n + '" aria-label="Kuota"><div class="kuota__fill" style="width:' + pct + '%"></div></div></div>';
  }
  function selectEks(val) {
    return '<select class="km-select" id="fEks" aria-label="Filter ekskul"><option value="">Semua Ekskul</option>' +
      EKSKUL.filter(function (e) { return view.name === 'pilih' || S.diampu.indexOf(e.id) > -1; }).map(function (e) {
        return '<option value="' + e.id + '"' + (val === e.id ? ' selected' : '') + '>' + esc(e.nama) + '</option>';
      }).join('') + '</select>';
  }
  function selectKelas(list, val) {
    var kelas = [];
    list.forEach(function (m) { if (kelas.indexOf(m.kelas) < 0) kelas.push(m.kelas); });
    kelas.sort();
    return '<select class="km-select" id="fKelas" aria-label="Filter kelas"><option value="">Kelas</option>' +
      kelas.map(function (k) { return '<option' + (val === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('') + '</select>';
  }

  // ---------- Tampilan: pilih / diampu ----------
  function renderDaftar() {
    var pilih = view.name === 'pilih';
    $('#app').innerHTML =
      '<section class="km-panel">' +
        '<div class="km-band"><div><h1>Kelola Ekstrakurikuler</h1><p>' + (pilih ? 'Pilih Ekstrakurikuler Yang Ingin Diampu' : 'Verifikasi Pendaftar, Dan Kelola Anggota') + '</p></div>' +
        (pilih && S.diampu.length ? '<button class="km-back" type="button" data-act="ke-diampu">Lihat yang diampu</button>' : '') +
        (!pilih ? '<button class="km-back" type="button" data-act="ke-pilih">+ Tambah Ekskul</button>' : '') + '</div>' +
        '<div class="km-body">' +
          '<div class="km-toolbar">' +
            '<div class="km-search"><input class="km-input" id="fQ" type="search" placeholder="Cari Ekstrakurikuler ..." aria-label="Cari ekstrakurikuler" value="' + esc(f.q) + '" /></div>' +
            selectEks(f.eks) +
            (pilih ? '' : '<button class="km-btn" type="button" data-act="reset">Reset</button>') +
          '</div>' +
          '<div class="eks-grid" id="list"></div>' +
        '</div>' +
      '</section>';
    isiDaftar();
  }

  function isiDaftar() {
    var pilih = view.name === 'pilih';
    var q = f.q.trim().toLowerCase();
    var items = EKSKUL.filter(function (e) {
      if (!pilih && S.diampu.indexOf(e.id) < 0) return false;
      if (f.eks && e.id !== f.eks) return false;
      return !q || (e.nama + ' ' + e.deskripsi).toLowerCase().indexOf(q) > -1;
    });
    $('#list').innerHTML = items.length ? items.map(function (e) {
      if (pilih) {
        var sudah = S.diampu.indexOf(e.id) > -1;
        return '<article class="eks-card"><h3>' + esc(e.nama) + '</h3><p class="eks-card__desc">' + esc(e.deskripsi) + '</p>' +
          '<div class="eks-card__foot"><button class="chip-btn" type="button" data-act="ampu" data-id="' + e.id + '"' + (sudah ? ' disabled' : '') + '>' + (sudah ? 'Sudah Diampu' : 'Ampu Ekskul') + '</button></div></article>';
      }
      return '<article class="eks-card"><div class="eks-card__top"><h3>' + esc(e.nama) + '</h3><span class="badge-open">Di Buka</span></div>' +
        '<p class="eks-card__desc">' + esc(e.deskripsi) + '</p>' +
        '<div class="eks-card__meta"><div>Pembimbing: <b>' + esc(PEMBIMBING.nama) + '</b></div><div>Jadwal: <b>' + esc(e.jadwal) + '</b></div></div>' +
        kuotaHtml(grup(e.id).aktif.length, true) +
        '<div class="eks-card__foot"><button class="chip-btn" type="button" data-act="kelola" data-id="' + e.id + '">Kelola Anggota' +
        (menunggu(e.id).length ? '<span class="chip-n" title="Pendaftar menunggu verifikasi">' + menunggu(e.id).length + '</span>' : '') + '</button></div></article>';
    }).join('') : '<p class="km-empty">Tidak ada ekstrakurikuler yang cocok.</p>';
  }

  // ---------- Tampilan: detail (verifikasi / anggota aktif) ----------
  function renderDetail() {
    var e = cari(view.id), g = grup(view.id), ver = view.tab === 'verifikasi';
    var nMenunggu = menunggu(view.id).length;
    var penuh = g.aktif.length >= KUOTA;
    var sumber = ver ? g.pending : g.aktif;

    $('#app').innerHTML =
      '<div class="km-tabs-row">' +
        '<div class="km-tabs" role="tablist">' +
          '<button class="km-tab' + (ver ? ' is-on' : '') + '" role="tab" aria-selected="' + ver + '" data-act="tab" data-tab="verifikasi">Verifikasi' + (nMenunggu ? '<span class="n">' + nMenunggu + '</span>' : '') + '</button>' +
          '<button class="km-tab' + (!ver ? ' is-on' : '') + '" role="tab" aria-selected="' + !ver + '" data-act="tab" data-tab="aktif">Anggota Aktif</button>' +
        '</div>' +
        '<button class="km-back" type="button" data-act="ke-diampu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>' + esc(e.nama) + '</button>' +
      '</div>' +
      '<section class="km-panel">' +
        '<div class="km-band"><div class="km-band__left"><div><h1>' + (ver ? 'Verifikasi Pendaftaran' : 'Anggota Aktif Ekstrakurikuler') + '</h1><p>' + (ver ? 'Terima Atau Tolak Pendaftar' : 'Kelola Anggota Ekskul') + '</p></div>' + kuotaHtml(g.aktif.length, false) + '</div>' +
        (ver ? '<button class="btn-all" type="button" data-act="terima-semua"' + (nMenunggu && !penuh ? '' : ' disabled') + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>Terima Semua (' + nMenunggu + ')</button>' : '') + '</div>' +
        '<div class="km-body">' +
          '<div class="km-toolbar">' +
            '<div class="km-search"><input class="km-input" id="fQ" type="search" placeholder="Cari Nama Siswa ..." aria-label="Cari nama siswa" value="' + esc(f.q) + '" /></div>' +
            selectKelas(sumber, f.kelas) +
            (ver ? '<select class="km-select" id="fStatus" aria-label="Filter status"><option' + (f.status === 'Menunggu' ? ' selected' : '') + '>Menunggu</option><option' + (f.status === 'Ditolak' ? ' selected' : '') + '>Ditolak</option></select>' : '') +
            '<button class="km-btn" type="button" data-act="reset">Reset</button>' +
          '</div>' +
          '<div class="tbl-wrap"><table class="tbl' + (ver ? '' : ' tbl--aktif') + '"><thead><tr>' +
            (ver ? '<th>Nama Siswa</th><th>Kelas</th><th>Ekstrakurikuler</th><th>Tanggal Daftar</th><th>Status</th><th>Aksi</th>'
                 : '<th>Nama Siswa</th><th>Kelas</th><th>Ekstrakurikuler</th><th>Status</th><th><span class="sr">Aksi</span></th>') +
          '</tr></thead><tbody id="rows"></tbody></table></div>' +
        '</div>' +
      '</section>';
    isiBaris();
  }

  function isiBaris() {
    var e = cari(view.id), g = grup(view.id), ver = view.tab === 'verifikasi';
    var q = f.q.trim().toLowerCase();
    var rows = (ver ? g.pending.filter(function (p) { return p.status === f.status; }) : g.aktif).filter(function (m) {
      return (!q || m.nama.toLowerCase().indexOf(q) > -1) && (!f.kelas || m.kelas === f.kelas);
    });
    var cols = ver ? 6 : 5;
    $('#rows').innerHTML = rows.length ? rows.map(function (m) {
      if (ver) {
        var wait = m.status === 'Menunggu';
        return '<tr><td class="nm">' + esc(m.nama) + '</td><td>' + esc(m.kelas) + '</td><td>' + esc(e.nama) + '</td><td class="tgl">' + esc(m.tanggal) + '</td>' +
          '<td><span class="st ' + (wait ? 'st--wait' : 'st--no') + '">' + m.status + '</span></td>' +
          '<td>' + (wait ? '<span class="aksi"><button class="ab ab--ok" type="button" data-act="terima" data-id="' + m.id + '">Terima</button><button class="ab ab--no" type="button" data-act="tolak" data-id="' + m.id + '">Tolak</button></span>' : '&ndash;') + '</td></tr>';
      }
      return '<tr><td class="nm">' + esc(m.nama) + '</td><td>' + esc(m.kelas) + '</td><td>' + esc(e.nama) + '</td><td><span class="st st--ok">Aktif</span></td>' +
        '<td><button class="ab ab--kelola" type="button" data-act="profil" data-id="' + m.id + '">Kelola</button></td></tr>';
    }).join('') : '<tr><td class="empty" colspan="' + cols + '">' + (ver ? 'Tidak ada pendaftar ' + f.status.toLowerCase() + '.' : 'Belum ada anggota aktif.') + '</td></tr>';
  }

  // ---------- Aksi ----------
  function terimaSatu(id) {
    var g = grup(view.id);
    if (g.aktif.length >= KUOTA) return false;
    var p = g.pending.filter(function (x) { return x.id === id; })[0];
    if (!p) return false;
    g.pending = g.pending.filter(function (x) { return x.id !== id; });
    // Siswa yang sudah menjadi anggota aktif tidak ditambahkan dua kali
    var sudah = g.aktif.some(function (a) { return a.nama === p.nama && a.kelas === p.kelas; });
    if (sudah) return true;
    g.aktif.push({ id: uid(), nama: p.nama, kelas: p.kelas, gabung: tanggalIni(), hadir: '0%', tugas: 0 });
    return true;
  }

  function bukaProfil(id) {
    var e = cari(view.id), m = grup(view.id).aktif.filter(function (x) { return x.id === id; })[0];
    if (!m) return;
    var prev = document.activeElement;
    var el = document.createElement('div');
    el.className = 'modal';
    el.innerHTML = '<div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="mTitle">' +
      '<div class="modal__head"><h2 id="mTitle">Profil Anggota</h2><button class="modal__x" type="button" data-m="tutup" aria-label="Tutup">&times;</button></div>' +
      '<div class="modal__body"><div class="prof"><div class="prof__av" aria-hidden="true">' + esc(inisial(m.nama)) + '</div>' +
      '<div><p class="prof__name">' + esc(m.nama) + '</p><p class="prof__sub">' + esc(m.kelas) + ' &middot; ' + esc(e.nama) + '</p></div></div>' +
      '<div class="prof__stats"><div class="prof__stat"><span>Bergabung</span><b>' + esc(m.gabung) + '</b></div>' +
      '<div class="prof__stat"><span>Kehadiran</span><b>' + esc(m.hadir) + '</b></div>' +
      '<div class="prof__stat"><span>Tugas Dikumpul</span><b>' + esc(m.tugas) + '</b></div></div></div>' +
      '<div class="modal__foot"><button class="mbtn mbtn--danger" type="button" data-m="keluarkan">Keluarkan</button><button class="mbtn" type="button" data-m="tutup">Tutup</button></div></div>';
    document.body.appendChild(el);
    function tutup() {
      document.removeEventListener('keydown', onKey);
      el.remove();
      if (prev && prev.focus) prev.focus();
    }
    function onKey(ev) { if (ev.key === 'Escape') tutup(); }
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', function (ev) {
      var t = ev.target;
      if (t === el) return tutup();
      var a = t.closest('[data-m]');
      if (!a) return;
      if (a.getAttribute('data-m') === 'tutup') return tutup();
      if (window.confirm('Keluarkan ' + m.nama + ' dari ' + e.nama + '?')) {
        var g = grup(view.id);
        g.aktif = g.aktif.filter(function (x) { return x.id !== id; });
        simpanData();
        tutup();
        renderDetail();
        toast(m.nama + ' dikeluarkan dari ' + e.nama);
      }
    });
    $('.modal__x', el).focus();
  }

  // ---------- Event ----------
  var app = $('#app');

  app.addEventListener('input', function (ev) {
    if (ev.target.id !== 'fQ') return;
    f.q = ev.target.value;
    if (view.name === 'detail') isiBaris(); else isiDaftar();
  });
  app.addEventListener('change', function (ev) {
    var id = ev.target.id;
    if (id === 'fEks') { f.eks = ev.target.value; isiDaftar(); }
    else if (id === 'fKelas') { f.kelas = ev.target.value; isiBaris(); }
    else if (id === 'fStatus') { f.status = ev.target.value; isiBaris(); }
  });

  app.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id');

    if (act === 'ampu') {
      if (S.diampu.indexOf(id) < 0) S.diampu.push(id);
      simpanData();
      toast('Kamu sekarang mengampu ' + cari(id).nama);
      resetFilter(); view = { name: 'diampu', id: null, tab: 'verifikasi' }; renderDaftar();
    } else if (act === 'ke-pilih') {
      resetFilter(); view = { name: 'pilih', id: null, tab: 'verifikasi' }; renderDaftar();
    } else if (act === 'ke-diampu') {
      resetFilter(); view = { name: 'diampu', id: null, tab: 'verifikasi' }; renderDaftar();
    } else if (act === 'kelola') {
      resetFilter(); view = { name: 'detail', id: id, tab: 'verifikasi' }; renderDetail();
    } else if (act === 'tab') {
      resetFilter(); view.tab = b.getAttribute('data-tab'); renderDetail();
    } else if (act === 'reset') {
      resetFilter();
      if (view.name === 'detail') renderDetail(); else renderDaftar();
    } else if (act === 'terima') {
      if (terimaSatu(id)) { simpanData(); renderDetail(); toast('Pendaftar diterima'); }
      else toast('Kuota sudah penuh', true);
    } else if (act === 'tolak') {
      var p = grup(view.id).pending.filter(function (x) { return x.id === id; })[0];
      if (p && window.confirm('Tolak pendaftaran ' + p.nama + '?')) {
        p.status = 'Ditolak';
        simpanData(); renderDetail(); toast('Pendaftaran ditolak');
      }
    } else if (act === 'terima-semua') {
      var list = menunggu(view.id);
      if (!list.length) return;
      if (!window.confirm('Terima ' + list.length + ' pendaftar sekaligus?')) return;
      var n = 0;
      list.forEach(function (x) { if (terimaSatu(x.id)) n += 1; });
      simpanData(); renderDetail();
      toast(n === list.length ? n + ' pendaftar diterima' : n + ' diterima, sisanya tidak muat karena kuota penuh', n !== list.length);
    } else if (act === 'profil') {
      bukaProfil(id);
    }
  });

  // ---------- Sidebar & topbar ----------
  var side = $('#sidebar');
  $('#menuBtn').addEventListener('click', function () { side.classList.toggle('is-open'); });
  $('.main').addEventListener('click', function () { side.classList.remove('is-open'); });
  $('#logout').addEventListener('click', keluarAkun);
  if (typeof PEMBIMBING !== 'undefined') $('#namaPembimbing').textContent = PEMBIMBING.nama;

  renderDaftar();
})();
