// Pembungkus pemanggilan API (folder api/ di server Laragon).
// Dipakai oleh daftar-ekskul, pendaftaran-ekskul, pendaftaran-berhasil, dan detail-ekskul.
var API = {
  _panggil: function (url, opsi) {
    return fetch(url, opsi).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) {}
        if (!j) throw new Error('Server tidak membalas dengan benar. Buka lewat http://localhost/siswa/ dan pastikan PHP berjalan.');
        if (!r.ok) throw new Error(j.pesan || 'Terjadi kesalahan.');
        return j;
      });
    }, function () {
      throw new Error('Tidak bisa terhubung ke server. Pastikan Laragon (Apache & MySQL) menyala.');
    });
  },
  _kirim: function (data) {
    return API._panggil('api/pendaftaran.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
  },
  semuaEkskul: function () { return API._panggil('api/ekskul.php'); },
  satuEkskul: function (id) { return API._panggil('api/ekskul.php?id=' + encodeURIComponent(id || '')); },
  kirimPendaftaran: function (data) { return API._kirim(data); },
  batalkan: function (ekskulId) { return API._kirim({ aksi: 'batal', ekskul_id: ekskulId }); }
};

// "2026-10-20" -> "20 Oktober 2026"
function formatTanggal(iso) {
  var d = iso ? new Date(iso + 'T00:00:00') : new Date();
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
function tanggalHariIni() { return formatTanggal(null); }
