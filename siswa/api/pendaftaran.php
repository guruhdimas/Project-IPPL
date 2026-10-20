<?php
// POST api/pendaftaran.php  (JSON)
//   kirim pendaftaran : {ekskul_id, nis, hp, wali, hp_wali, alasan, pengalaman}
//   batalkan          : {aksi: "batal", ekskul_id}   (hanya jika status masih Menunggu)
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') galat('Metode tidak didukung.', 405);

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) galat('Data tidak valid.');

function teks($in, $k) { return isset($in[$k]) ? trim((string) $in[$k]) : ''; }
function hpValid($v) { return (bool) preg_match('/^0\d{8,13}$/', preg_replace('/[\s-]/', '', $v)); }

$ekskulId = teks($in, 'ekskul_id');
if ($ekskulId === '') galat('Ekstrakurikuler belum dipilih.');

try {
    $pdo = db();

    // ---------- Batalkan ----------
    if (teks($in, 'aksi') === 'batal') {
        $st = $pdo->prepare("DELETE FROM pendaftaran WHERE siswa_id = :s AND ekskul_id = :e AND status = 'Menunggu'");
        $st->execute([':s' => SISWA_ID, ':e' => $ekskulId]);
        if ($st->rowCount() === 0) galat('Pendaftaran tidak bisa dibatalkan (tidak ada, atau sudah diproses pembimbing).', 409);
        kirim(['pesan' => 'Pendaftaran dibatalkan.']);
    }

    // ---------- Kirim pendaftaran: validasi sisi server ----------
    $nis = teks($in, 'nis'); $hp = teks($in, 'hp'); $wali = teks($in, 'wali');
    $hpWali = teks($in, 'hp_wali'); $alasan = teks($in, 'alasan'); $pengalaman = teks($in, 'pengalaman');

    if (!preg_match('/^\d{4,20}$/', $nis)) galat('NIS wajib diisi (angka saja).');
    if (!hpValid($hp)) galat('Nomor HP siswa tidak valid.');
    if (mb_strlen($wali) < 3) galat('Nama orang tua/wali wajib diisi.');
    if (!hpValid($hpWali)) galat('Nomor HP orang tua/wali tidak valid.');
    if (mb_strlen($alasan) < 10) galat('Alasan bergabung minimal 10 karakter.');

    $pdo->beginTransaction();

    // Kunci baris ekskul agar dua pendaftaran bersamaan tidak melewati kuota
    $st = $pdo->prepare('SELECT kuota, anggota_awal FROM ekskul WHERE id = :e FOR UPDATE');
    $st->execute([':e' => $ekskulId]);
    $e = $st->fetch();
    if (!$e) { $pdo->rollBack(); galat('Ekstrakurikuler tidak ditemukan.', 404); }

    $st = $pdo->prepare("SELECT COUNT(*) FROM pendaftaran WHERE ekskul_id = :e AND status = 'Disetujui'");
    $st->execute([':e' => $ekskulId]);
    if ((int) $e['anggota_awal'] + (int) $st->fetchColumn() >= (int) $e['kuota']) {
        $pdo->rollBack(); galat('Kuota ekstrakurikuler ini sudah penuh.', 409);
    }

    $st = $pdo->prepare('SELECT 1 FROM pendaftaran WHERE siswa_id = :s AND ekskul_id = :e');
    $st->execute([':s' => SISWA_ID, ':e' => $ekskulId]);
    if ($st->fetch()) { $pdo->rollBack(); galat('Kamu sudah mendaftar ke ekstrakurikuler ini.', 409); }

    $st = $pdo->prepare('INSERT INTO pendaftaran (siswa_id, ekskul_id, tanggal, nis, hp, wali, hp_wali, alasan, pengalaman)
                         VALUES (:s, :e, CURDATE(), :nis, :hp, :wali, :hpw, :alasan, :peng)');
    $st->execute([':s' => SISWA_ID, ':e' => $ekskulId, ':nis' => $nis, ':hp' => $hp, ':wali' => $wali,
                  ':hpw' => $hpWali, ':alasan' => $alasan, ':peng' => $pengalaman !== '' ? $pengalaman : null]);

    $pdo->prepare('UPDATE siswa SET no_hp = :hp WHERE id = :s')->execute([':hp' => $hp, ':s' => SISWA_ID]);
    $pdo->commit();

    kirim(['pesan' => 'Pendaftaran terkirim.', 'status' => 'Menunggu'], 201);
} catch (Throwable $err) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    galat('Terjadi kesalahan pada server.', 500);
}
