<?php
// Koneksi khusus halaman Profil. Pengaturan bawaan Laragon.
// Jika kamu sudah punya file koneksi sendiri di folder api, boleh diganti
// dengan memakai file itu (cukup pastikan fungsi db() mengembalikan PDO).
const DB_HOST = '127.0.0.1';
const DB_PORT = 3306;
const DB_NAME = 'portal_ekskul';
const DB_USER = 'root';
const DB_PASS = '';

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
             PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
             PDO::ATTR_EMULATE_PREPARES => false]
        );
    }
    return $pdo;
}

function kirim_json($data, int $kode = 200): void {
    http_response_code($kode);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
