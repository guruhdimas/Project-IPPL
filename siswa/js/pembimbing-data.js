// Data bersama halaman Pembimbing.
// Jika nanti ada database, ganti isi bagian ini dengan data dari server.
// Perlu dimuat SETELAH js/ekskul-data.js.

var PEMBIMBING = { nama: 'Abdul Husein, S.T', peran: 'Pembimbing' };

// Nama pendek ekskul seperti yang tampil di daftar pendaftar
var NAMA_SINGKAT = {
  'robotic-iot': 'Robotic', 'basket-futsal': 'Basket', 'cyber': 'Cyber',
  'debate': 'Debate', 'seni': 'Seni', 'science': 'Science'
};

// Contoh pendaftar dari siswa lain (sesuai desain Figma)
var PENDAFTAR_CONTOH = [
  { nama: 'Dimas Saputra',      ekskul: 'Robotic', status: 'Menunggu' },
  { nama: 'Randi Darmawan',     ekskul: 'Cyber',   status: 'Menunggu' },
  { nama: 'Rahayu Dwi Kartika', ekskul: 'Robotic', status: 'Menunggu' }
];

// Pendaftar yang sedang menunggu persetujuan pembimbing ini.
// Pendaftaran yang dikirim siswa lewat formulir (tersimpan di browser yang sama)
// ikut ditampilkan paling depan, selama ekskulnya dibimbing oleh pembimbing ini.
function pendaftarMenunggu() {
  var daftar = [];
  var namaSiswa = 'Budi Setiawan';
  try {
    var p = JSON.parse(localStorage.getItem('profilSiswa'));
    if (p && p.nama) namaSiswa = p.nama;
  } catch (e) {}

  if (typeof semuaPendaftaran === 'function' && typeof EKSKUL !== 'undefined') {
    semuaPendaftaran().forEach(function (d) {
      if (d.status !== 'Menunggu') return;
      var e = cariEkskul(d.id);
      if (e.id === d.id && e.pembimbing === PEMBIMBING.nama) {
        daftar.push({ nama: namaSiswa, ekskul: NAMA_SINGKAT[e.id] || e.nama, status: 'Menunggu' });
      }
    });
  }
  return daftar.concat(PENDAFTAR_CONTOH);
}

function tanggalPanjang() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
