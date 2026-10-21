<?php
require __DIR__ . '/koneksi_profil.php';

// Hitung panjang teks (karakter, bukan byte) tanpa bergantung pada mbstring.
function panjang(string $t): int {
    return function_exists('mb_strlen') ? mb_strlen($t, 'UTF-8') : (int)preg_match_all('/./us', $t);
}

// NIS siswa yang sedang login. Sementara diambil dari parameter;
// setelah login memakai database, ganti dengan $_SESSION.
function ambil_nis($nis): string {
    $nis = trim((string)$nis);
    if (!preg_match('/^[0-9A-Za-z\-]{3,20}$/', $nis)) {
        kirim_json(['ok' => false, 'pesan' => 'NIS tidak valid'], 400);
    }
    return $nis;
}

function data_profil(string $nis): ?array {
    $st = db()->prepare('SELECT id, nis, nama, kelas, angkatan, no_hp, email, alamat, bio FROM siswa WHERE nis = ?');
    $st->execute([$nis]);
    $s = $st->fetch();
    if (!$s) return null;

    // Ekskul yang diikuti = pendaftaran berstatus Disetujui
    $st = db()->prepare(
        "SELECT e.nama, p.status, p.jabatan FROM pendaftaran p
         JOIN ekskul e ON e.id = p.ekskul_id
         WHERE p.siswa_id = ? AND p.status IN ('Disetujui','Menunggu')
         ORDER BY p.status = 'Disetujui' DESC, e.nama");
    $st->execute([$s['id']]);
    $baris = $st->fetchAll();

    $aktif     = array_values(array_filter($baris, fn($b) => $b['status'] === 'Disetujui'));
    $disetujui = array_column($aktif, 'nama');
    // 'Anggota' (bawaan) ditampilkan sebagai 'Anggota Aktif'; Ketua/Sekretaris dst. tampil apa adanya.
    $jabatan   = $aktif ? ($aktif[0]['jabatan'] === 'Anggota' ? 'Anggota Aktif' : $aktif[0]['jabatan']) : null;
    $menunggu  = array_column(array_filter($baris, fn($b) => $b['status'] === 'Menunggu'), 'nama');

    return [
        'nama' => $s['nama'], 'nis' => $s['nis'], 'kelas' => $s['kelas'],
        'angkatan' => (string)$s['angkatan'], 'email' => (string)$s['email'],
        'telepon' => (string)$s['no_hp'], 'alamat' => (string)$s['alamat'],
        'bio' => (string)$s['bio'],
        'jabatan' => $jabatan ?? ($menunggu ? 'Menunggu Persetujuan' : 'Belum Bergabung'),
        'eksul' => $disetujui ? implode(', ', $disetujui) : ($menunggu ? implode(', ', $menunggu) . ' (menunggu)' : '-'),
    ];
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $nis = ambil_nis($_GET['nis'] ?? '');
        $d = data_profil($nis);
        if (!$d) kirim_json(['ok' => false, 'pesan' => 'Siswa tidak ditemukan'], 404);
        kirim_json(['ok' => true, 'data' => $d]);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $in  = json_decode(file_get_contents('php://input'), true) ?? [];
        $nis = ambil_nis($in['nis'] ?? '');

        // Hanya kolom ini yang boleh diubah siswa (NIS, kelas, angkatan tidak).
        $nama    = trim((string)($in['nama'] ?? ''));
        $email   = trim((string)($in['email'] ?? ''));
        $telepon = trim((string)($in['telepon'] ?? ''));
        $alamat  = trim((string)($in['alamat'] ?? ''));
        $bio     = trim((string)($in['bio'] ?? ''));

        if ($nama === '' || panjang($nama) > 100)
            kirim_json(['ok' => false, 'pesan' => 'Nama wajib diisi (maks. 100 karakter)'], 422);
        if ($email !== '' && (panjang($email) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL)))
            kirim_json(['ok' => false, 'pesan' => 'Format email tidak valid'], 422);
        if (panjang($telepon) > 20 || !preg_match('/^[0-9+\-\s]*$/', $telepon))
            kirim_json(['ok' => false, 'pesan' => 'Nomor telepon tidak valid'], 422);
        if (panjang($alamat) > 255) kirim_json(['ok' => false, 'pesan' => 'Alamat terlalu panjang'], 422);
        if (panjang($bio) > 2000)   kirim_json(['ok' => false, 'pesan' => 'Bio terlalu panjang'], 422);

        $st = db()->prepare('UPDATE siswa SET nama=?, email=?, no_hp=?, alamat=?, bio=? WHERE nis=?');
        $st->execute([$nama, $email ?: null, $telepon ?: null, $alamat ?: null, $bio ?: null, $nis]);

        $d = data_profil($nis);
        if (!$d) kirim_json(['ok' => false, 'pesan' => 'Siswa tidak ditemukan'], 404);
        kirim_json(['ok' => true, 'data' => $d]);
    }

    kirim_json(['ok' => false, 'pesan' => 'Metode tidak didukung'], 405);
} catch (Throwable $e) {
    error_log($e->getMessage());
    kirim_json(['ok' => false, 'pesan' => 'Gagal terhubung ke database'], 500);
}
