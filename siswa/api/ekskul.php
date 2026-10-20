<?php
// GET api/ekskul.php            -> semua ekskul
// GET api/ekskul.php?id=robotic-iot -> satu ekskul
// Setiap ekskul memuat: terisi (anggota awal + pendaftaran Disetujui) dan pendaftaran milik siswa yang sedang masuk.
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') galat('Metode tidak didukung.', 405);

try {
    $pdo = db();
    $sql = "SELECT e.id, e.nama, e.deskripsi, e.pembimbing, e.jadwal, e.kuota,
                   e.anggota_awal + (SELECT COUNT(*) FROM pendaftaran x
                                      WHERE x.ekskul_id = e.id AND x.status = 'Disetujui') AS terisi,
                   p.status AS p_status, p.tanggal AS p_tanggal
            FROM ekskul e
            LEFT JOIN pendaftaran p ON p.ekskul_id = e.id AND p.siswa_id = :sid";
    $params = [':sid' => SISWA_ID];

    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if ($id !== null) { $sql .= ' WHERE e.id = :id'; $params[':id'] = $id; }
    $sql .= ' ORDER BY e.nama';

    $st = $pdo->prepare($sql);
    $st->execute($params);
    $baris = array_map(function ($r) {
        return [
            'id' => $r['id'], 'nama' => $r['nama'], 'deskripsi' => $r['deskripsi'],
            'pembimbing' => $r['pembimbing'], 'jadwal' => $r['jadwal'],
            'kuota' => (int) $r['kuota'], 'terisi' => (int) $r['terisi'],
            'pendaftaran' => $r['p_status'] ? ['status' => $r['p_status'], 'tanggal' => $r['p_tanggal']] : null,
        ];
    }, $st->fetchAll());

    $sw = $pdo->prepare('SELECT nis, nama, kelas, no_hp FROM siswa WHERE id = :sid');
    $sw->execute([':sid' => SISWA_ID]);
    $siswa = $sw->fetch() ?: null;

    if ($id !== null) {
        if (!$baris) galat('Ekstrakurikuler tidak ditemukan.', 404);
        kirim(['ekskul' => $baris[0], 'siswa' => $siswa]);
    }
    kirim(['ekskul' => $baris, 'siswa' => $siswa]);
} catch (Throwable $e) {
    galat('Terjadi kesalahan pada server.', 500);
}
