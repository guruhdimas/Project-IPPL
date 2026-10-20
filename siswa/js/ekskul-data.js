// Data ekstrakurikuler yang dipakai bersama oleh:
// daftar-ekskul.html, pendaftaran-ekskul.html, dan pendaftaran-berhasil.html
// Jika nanti ada database, ganti isi array ini dengan data dari server.
var EKSKUL = [
  {
    id: 'robotic-iot', nama: 'Robotic & IoT Club',
    deskripsi: 'Merakit dan memprogram robot untuk kompetisi.',
    pembimbing: 'Abdul Husein, S.T', jadwal: 'Sabtu, 08.00 - 11.00', terisi: 3, kuota: 8
  },
  {
    id: 'basket-futsal', nama: 'Basket dan Futsal Club',
    deskripsi: 'Membangun kebugaran, kerja sama tim, kedisiplinan, dan kemampuan berkompetisi.',
    pembimbing: 'Lukman Hakim, S.Pd', jadwal: 'Sabtu, 14.00 - 17.00', terisi: 21, kuota: 60
  },
  {
    id: 'cyber', nama: 'Cyber Security & Programming',
    deskripsi: 'Belajar pemrograman, jaringan komputer, keamanan digital, dan pengembangan website.',
    pembimbing: 'Abdul Husein, S.T', jadwal: 'Sabtu, 09.00 - 12.00', terisi: 7, kuota: 10
  },
  {
    id: 'debate', nama: 'English Debate & Speech',
    deskripsi: 'Melatih cara berkomunikasi, argumentasi, presentasi, dan kemampuan berbahasa Inggris.',
    pembimbing: 'Ajeng Mirna, S.pd', jadwal: 'Sabtu, 15.00 - 17.00', terisi: 3, kuota: 6
  },
  {
    id: 'seni', nama: 'Seni & Budaya Nusantara',
    deskripsi: 'Mengembangkan bakat tari tradisional, musik, teater, dan pelestarian budaya Indonesia.',
    pembimbing: 'Dewi Ratna, S.Pd', jadwal: 'Minggu, 09.00 - 12.00', terisi: 5, kuota: 17
  },
  {
    id: 'science', nama: 'Science & Research Club',
    deskripsi: 'Mengembangkan penelitian, eksperimen, karya ilmiah, dan inovasi untuk kompetisi sains.',
    pembimbing: 'Fathul Masrani, S.T, M.T', jadwal: 'Sabtu, 09.00 - 12.00', terisi: 1, kuota: 8
  }
];

function cariEkskul(id) {
  for (var i = 0; i < EKSKUL.length; i++) if (EKSKUL[i].id === id) return EKSKUL[i];
  return EKSKUL[0];
}

function tanggalHariIni() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
