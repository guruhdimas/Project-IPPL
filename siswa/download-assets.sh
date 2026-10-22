#!/usr/bin/env bash
# Unduh aset dari Figma ke folder assets/ (URL dari Figma berlaku 7 hari sejak dibuat).
# Jalankan dari folder ini:  bash download-assets.sh
set -e
mkdir -p assets/pembimbing && cd assets/pembimbing
A="https://www.figma.com/api/mcp/asset/ec6d0217-5087-4389-8893-0a34fa802379"
B="https://www.figma.com/api/mcp/asset/e68410c3-b9d1-403e-91bd-6530718a3b4a"

curl -fL -o profile.png      "$A/b4a2b.png"
curl -fL -o home.png         "$A/bed1e.png"
curl -fL -o group.png        "$A/db7da.png"
curl -fL -o calendar.png     "$A/3f5ab.png"
curl -fL -o inspection.png   "$A/52eae.png"
curl -fL -o commercial.png   "$A/ec157.png"
curl -fL -o requirements.png "$A/8a980.png"
curl -fL -o graph.png        "$A/44bdd.png"
curl -fL -o logo.png         "$A/d6486.png"
curl -fL -o done.png         "$B/5eb82.png"
curl -fL -o filter.png       "$B/ffa6d.png"

echo "Selesai: $(ls | wc -l) file di assets/"
