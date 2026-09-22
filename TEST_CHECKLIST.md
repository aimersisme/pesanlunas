# PesanLunas v0.2.0 — Checklist Test CRUD

Gunakan satu akun Owner utama dan, untuk pengujian role, satu email kedua.

## A. Upgrade existing development project
- [ ] Backup repo/source saat ini.
- [ ] Jalankan **hanya** `supabase/migrations/202609220002_crud_patch.sql` pada database v1.0 yang sudah aktif.
- [ ] Replace source GitHub dengan v0.2.0.
- [ ] Pastikan env Supabase di Vercel tetap terisi.
- [ ] Redeploy Vercel.
- [ ] Buka `/api/health` dan pastikan `supabaseConfigured: true`.

## B. Account & usaha
- [ ] Login Owner.
- [ ] Buka Lainnya → Akun Saya; ubah nama/nomor telepon.
- [ ] Ganti password lalu login ulang.
- [ ] Buka Pengaturan Usaha; ubah alamat/WA/email/prefix dokumen.

## C. Pelanggan
- [ ] Tambah pelanggan.
- [ ] Cari pelanggan.
- [ ] Edit pelanggan.
- [ ] Nonaktifkan pelanggan.
- [ ] Soft-delete pelanggan test.
- [ ] Uji pagination/page size jika data cukup banyak.

## D. Produk & jasa
- [ ] Tambah item katalog.
- [ ] Edit nama, harga, satuan, SKU.
- [ ] Nonaktifkan item.
- [ ] Soft-delete item test.
- [ ] Uji search + pagination.

## E. Custom field
- [ ] Cek field bawaan template bisnis.
- [ ] Tambah text field.
- [ ] Tambah dropdown dan isi opsi dengan koma.
- [ ] Edit required/visibility/order.
- [ ] Hapus field test yang belum dipakai.

## F. Metode pembayaran
- [ ] Tambah Cash.
- [ ] Tambah Bank/ewallet/QRIS.
- [ ] Edit rekening/instruksi.
- [ ] Nonaktifkan salah satu metode.
- [ ] Hapus metode test.

## G. Order end-to-end
- [ ] Klik Catat Order.
- [ ] Pilih pelanggan dan tambah minimal 2 item.
- [ ] Isi custom field wajib.
- [ ] Isi diskon/biaya/pajak bila perlu.
- [ ] Catat DP awal.
- [ ] Simpan; pastikan nomor Order + Invoice otomatis terbentuk.
- [ ] Buka detail order dan ubah status pengerjaan.
- [ ] Uji pencarian/filter daftar order.

## H. Revisi order
- [ ] Buat satu order test tanpa pembayaran.
- [ ] Void invoice aktif dari Detail Invoice.
- [ ] Buka revisi order.
- [ ] Ubah item/qty/harga/tanggal/custom field.
- [ ] Simpan; pastikan invoice baru diterbitkan.

## I. Invoice & pembayaran
- [ ] Buka daftar Invoice.
- [ ] Catat cicilan.
- [ ] Upload bukti pembayaran opsional.
- [ ] Buka bukti via signed URL.
- [ ] Catat cicilan berikutnya sampai Lunas.
- [ ] Buat link invoice publik dan buka di incognito.
- [ ] Print/Save PDF dari halaman invoice publik.
- [ ] Buat transaksi test lain lalu uji refund.
- [ ] Uji void catatan pembayaran pada data test.

## J. Piutang
- [ ] Pastikan unpaid/partial muncul di Piutang.
- [ ] Pastikan jatuh tempo/overdue sesuai tanggal.
- [ ] Klik WhatsApp manual.
- [ ] Setelah lunas, pastikan tidak lagi dihitung sebagai piutang aktif.

## K. Template pesan & WhatsApp
- [ ] Tambah/edit/hapus template pesan.
- [ ] Test mode manual.
- [ ] Jika menguji Fonnte, isi `FONNTE_TOKEN` server-side lalu redeploy.
- [ ] Jika menguji Starsender, isi `STARSENDER_API_KEY` server-side lalu redeploy.
- [ ] Test pengiriman gateway dan cek delivery log/database.

## L. Team & role
- [ ] Owner membuat invitation untuk email kedua.
- [ ] Login email kedua lalu buka link invitation `/join?token=...`.
- [ ] Pastikan anggota masuk ke bisnis.
- [ ] Uji role Staff: order/customer, tidak boleh pengaturan sensitif.
- [ ] Uji role Finance: pembayaran/piutang.
- [ ] Owner ubah role/status anggota.

## M. Laporan & audit
- [ ] Pilih periode laporan.
- [ ] Cocokkan Nilai Order, Uang Diterima, dan Piutang Aktif dengan transaksi test.
- [ ] Export CSV Order.
- [ ] Export CSV Pembayaran.
- [ ] Owner/Admin buka Aktivitas dan cek log penting.

## N. Mobile/PWA
- [ ] Test lebar 360–430 px.
- [ ] Navigasi Beranda / Pesanan / Piutang / Lainnya nyaman.
- [ ] Install PWA.
- [ ] Refresh halaman detail langsung (deep link) tidak 404/error.

## O. Test keamanan minimum
- [ ] Login user dari bisnis lain tidak dapat membaca data bisnis pertama.
- [ ] Staff tidak dapat mengubah business settings.
- [ ] Token gateway tidak muncul di browser/localStorage.
- [ ] Public invoice token hanya membuka invoice yang sesuai.
- [ ] Invoice void tidak menerima pembayaran baru.

## v0.2.1 — Performance & Piutang UI
- [ ] Jalankan migration `202609220003_performance_ui.sql` sekali.
- [ ] Beranda → Pesanan → Piutang → Beranda tidak terasa menunggu lama seperti v0.2.0.
- [ ] Dashboard menampilkan persentase tertagih bulan ini.
- [ ] Pesanan menampilkan Total Order, Sisa Tagihan, Dalam Proses.
- [ ] Piutang menampilkan total aktif, risiko terlambat, jatuh tempo 7 hari, tingkat tertagih, cicilan aktif.
- [ ] Aging piutang 1–7 / 8–30 / >30 hari sesuai due date.
- [ ] Progress pembayaran invoice berubah setelah cicilan dicatat.
- [ ] Invoice lunas tidak muncul lagi pada daftar piutang aktif.
