# PesanLunas v0.2.6 — Quick Customer Order Flow

Versi ini mencakup seluruh update v0.2.5 (Team Fix + Panduan Role editable), v0.2.3 Auto SKU, performance/runtime fix sebelumnya, dan menyederhanakan alur **Catat Order**.

## Perubahan utama v0.2.6

### Pelanggan langsung dari Catat Order
User tidak lagi wajib pindah ke menu Pelanggan sebelum membuat order.

Di bagian paling atas form Catat Order:
- Ketik nama / nomor WhatsApp / email untuk mencari pelanggan lama.
- Klik hasil pencarian untuk memakai pelanggan yang sudah ada.
- Jika pelanggan belum ada, klik **Tambah sebagai pelanggan baru**.
- Form cepat pelanggan baru muncul di halaman yang sama: Nama, WhatsApp, Email, Alamat.
- Pelanggan baru otomatis disimpan saat order disimpan.
- Setelah itu sistem meneruskan proses order + invoice seperti biasa.

Jika pembuatan order gagal setelah pelanggan baru berhasil dibuat, pelanggan tidak hilang. Form otomatis beralih memakai pelanggan yang baru tersimpan dan menampilkan pesan error order agar user bisa memperbaiki data tanpa mengetik pelanggan lagi.

## Tidak perlu SQL patch
v0.2.6 memakai tabel `customers` dan RPC order yang sudah ada. Untuk database pengembangan yang sekarang, cukup replace source dan redeploy.

## Upgrade
User yang belum meng-upload v0.2.5 dapat langsung memakai v0.2.6. Semua perubahan v0.2.5 sudah termasuk.

1. Replace source GitHub dengan isi package v0.2.6.
2. Push ke branch production.
3. Redeploy Vercel.
4. Jangan jalankan MASTER SQL atau patch baru untuk update ini.
5. Test Catat Order dengan pelanggan lama dan pelanggan baru.
