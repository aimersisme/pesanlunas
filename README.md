# PesanLunas v0.2.7 — Theme Engine + Custom Brand

Versi ini mencakup seluruh update v0.2.6 (Quick Customer Order), v0.2.5 (Team Fix + Panduan Role editable), Auto SKU, performance/runtime fix sebelumnya, lalu menambahkan **10 tema aplikasi + Custom Brand**.

## 10 preset tema
1. Emerald Fresh — clean/friendly (default)
2. Coral Bloom — warm/creative
3. Navy Executive — professional/bold
4. Mocha Cream — warm/premium
5. Mint Sky — airy/modern
6. Rose Sakura — elegant/soft
7. Terracotta Studio — natural/crafted
8. Mono Luxe — minimal/luxe
9. Citrus Pop — playful/energetic
10. Midnight Glow — dark/tech

Setiap tema mengubah bukan hanya warna utama, tetapi juga karakter card, radius, shadow, field, navbar, chart, tombol, stage/background, dan beberapa treatment visual agar tiap pembeli terasa punya aplikasi berbeda.

## Custom Brand
Menu baru: **Lainnya → Tampilan & Tema**.

Owner dapat:
- Preview tema tanpa menyimpan.
- Terapkan preset.
- Aktifkan Custom Brand.
- Atur warna utama, warna aksen, background, warna card, warna teks.
- Pilih model sudut: Soft / Balanced / Tegas.
- Pilih model shadow: Floating / Soft / Flat.

Setting disimpan ke `business_settings` dengan key `appearance_theme` dan otomatis disinkronkan di browser. Role selain Owner dapat melihat dan mencoba preview, tetapi tidak dapat menyimpan.

## Tidak perlu SQL patch
v0.2.7 memakai tabel `business_settings` yang sudah ada. Untuk database pengembangan yang sekarang:

1. Replace source GitHub dengan isi package v0.2.7.
2. Push ke branch production.
3. Redeploy Vercel.
4. Jangan jalankan MASTER SQL atau patch baru untuk update ini.
5. Buka Lainnya → Tampilan & Tema dan test 10 preset.

## Catatan performa
Theme runtime membaca localStorage terlebih dahulu sehingga perubahan tampilan terasa instan. Sinkronisasi setting Supabase dilakukan di background setelah halaman tampil dan hanya sekali per session browser.
