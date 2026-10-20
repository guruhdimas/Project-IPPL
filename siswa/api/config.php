<?php
// Pengaturan koneksi database. Nilai bawaan Laragon: user root, password kosong.
const DB_HOST = '127.0.0.1';
const DB_NAME = 'portal_ekskul';
const DB_USER = 'root';
const DB_PASS = '';

// Sementara belum ada login sungguhan, semua permintaan dianggap dari siswa dengan id ini (Budi Setiawan).
// Saat login server dibuat, ganti dengan id siswa dari session.
const SISWA_ID = 1;

header('Content-Type: application/json; charset=utf-8');

function kirim($data, $kode = 200) {
    http_response_code($kode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function galat($pesan, $kode = 400) {
    kirim(['pesan' => $pesan], $kode);
}

function db() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER, DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
            );
        } catch (Throwable $e) {
            galat('Database tidak bisa dihubungi. Pastikan MySQL di Laragon menyala dan database portal_ekskul sudah diimpor.', 500);
        }
    }
    return $pdo;
}
