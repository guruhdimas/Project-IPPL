// Penjaga akses halaman Pembimbing.
// Dipanggil di bagian <head> setiap halaman pembimbing: jika yang masuk bukan
// Pembimbing (belum login atau login sebagai Siswa), dialihkan ke halaman login.
// Catatan: ini hanya penjaga tampilan di browser. Untuk keamanan sungguhan,
// pemeriksaan harus dilakukan di server (PHP + sesi).
(function () {
  var peran = null;
  try { peran = localStorage.getItem('peran'); } catch (e) {}
  if (peran !== 'pembimbing') {
    window.location.replace('login.html?peran=pembimbing');
  }
})();

// Dipakai tombol "Keluar": hapus peran lalu kembali ke halaman login.
function keluarAkun(e) {
  if (e) e.preventDefault();
  try { localStorage.removeItem('peran'); } catch (err) {}
  window.location.href = 'login.html';
}
