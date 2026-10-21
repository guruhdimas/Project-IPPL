// Penjaga akses halaman Siswa.
// Dipasang di <head> setiap halaman siswa: jika belum login sebagai Siswa,
// langsung dialihkan ke halaman login (halaman tujuan diingat lewat ?next=).
// Catatan: ini hanya penjaga tampilan di browser. Untuk keamanan sungguhan,
// pemeriksaan harus dilakukan di server (PHP + sesi).
(function () {
  var peran = null;
  try { peran = localStorage.getItem('peran'); } catch (e) {}
  if (peran !== 'siswa') {
    var tujuan = location.pathname.split('/').pop() || 'dashboard-siswa.html';
    window.location.replace('login.html?peran=siswa&next=' + encodeURIComponent(tujuan));
  }
})();
