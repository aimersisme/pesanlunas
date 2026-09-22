# TEST CHECKLIST — PesanLunas v0.2.7

## Tampilan & Tema
- Buka Lainnya → Tampilan & Tema.
- Pastikan 10 preset tampil.
- Klik setiap preset dan pastikan preview langsung mengubah aplikasi.
- Pastikan tombol Kembalikan mengembalikan tema tersimpan.
- Klik Terapkan Tema sebagai Owner.
- Pindah ke Beranda, Pesanan, Piutang, Produk & Jasa, dan Catat Order.
- Refresh browser dan pastikan tema tetap aktif.
- Logout/login lagi dan pastikan tema tetap aktif setelah sinkronisasi.

## Custom Brand
- Aktifkan Custom Brand.
- Ubah warna utama, aksen, background, card, dan teks.
- Ubah model sudut Soft / Balanced / Tegas.
- Ubah shadow Floating / Soft / Flat.
- Simpan dan refresh.
- Pastikan setting tetap tersimpan.

## Role
- Owner dapat menyimpan tema.
- Admin/Staff/Finance dapat preview tetapi tombol simpan tidak aktif.

## Midnight Glow
- Terapkan Midnight Glow.
- Pastikan teks, form, navbar, menu, card, notice, customer picker, dan tombol tetap terbaca.
- Pastikan tidak ada field putih menyilaukan yang merusak dark theme.

## Regression
- Catat Order masih bisa memilih pelanggan lama dan menambah pelanggan baru langsung.
- Team page tidak menampilkan ambiguous relationship error.
- Panduan role tetap tampil dan editable oleh Owner.
- SKU katalog tetap otomatis mengikuti prefix.
- Dashboard/Pesanan/Piutang tetap dapat dibuka.
- Tidak ada SQL patch baru yang dijalankan untuk v0.2.7.
