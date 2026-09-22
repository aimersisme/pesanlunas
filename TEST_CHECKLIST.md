# TEST CHECKLIST — PesanLunas v0.2.6

## Catat Order — Pelanggan Lama
- Buka Catat Order.
- Ketik sebagian nama pelanggan lama.
- Pastikan hasil pencarian muncul tanpa pindah halaman.
- Pilih pelanggan.
- Pastikan kartu pelanggan terpilih tampil dan tombol Ganti bekerja.
- Isi item lalu simpan order.

## Catat Order — Pelanggan Baru
- Buka Catat Order.
- Ketik nama yang belum ada.
- Klik Tambah sebagai pelanggan baru.
- Isi Nama + WhatsApp; Email/Alamat opsional.
- Isi item order.
- Simpan.
- Pastikan pelanggan tersimpan di menu Pelanggan.
- Pastikan order dan invoice terbentuk memakai pelanggan tersebut.

## Validasi
- Pelanggan baru tanpa nama harus ditolak.
- Order tanpa pelanggan harus ditolak.
- Item tanpa nama atau qty <= 0 harus ditolak.
- Required custom field tetap divalidasi sebelum pelanggan baru disimpan.

## Regression
- Team page tidak menampilkan ambiguous relationship error.
- Panduan role Owner/Admin/Staff/Finance tampil dan Owner dapat mengedit.
- SKU katalog tetap otomatis mengikuti prefix di Pengaturan Usaha.
- Dashboard/Pesanan/Piutang tetap dapat dibuka.
