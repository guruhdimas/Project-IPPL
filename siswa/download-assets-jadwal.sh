#!/usr/bin/env bash
# Unduh ikon tambahan halaman Jadwal ke assets/ (URL Figma berlaku 7 hari).
# Jalankan dari folder ini:  bash download-assets-jadwal.sh
# (Ikon sidebar/logo dari download-assets.sh juga dipakai halaman ini.)
set -e
mkdir -p assets/pembimbing && cd assets/pembimbing
A="https://www.figma.com/api/mcp/asset/bfe369e4-fd67-4317-8e85-d50f90362b93"

curl -fL -o chevron-down.svg  "$A/d9109.svg"
curl -fL -o plus.svg          "$A/050d7.svg"
curl -fL -o chevron-left.svg  "$A/182a1.svg"
curl -fL -o chevron-right.svg "$A/f922a.svg"
curl -fL -o close.svg         "$A/bc94c.svg"

echo "Selesai."
