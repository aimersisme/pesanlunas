# PesanLunas v0.2.3 — Automatic SKU

**Edition:** Single-install / per-client  
**Tagline:** Pesanan tercatat, tagihan cepat lunas.

Release ini tetap **bukan SaaS multi-tenant**. Satu instalasi ditujukan untuk satu client/bisnis dengan Supabase, GitHub, dan Vercel milik client tersebut.

## Yang dibenahi di v0.2.1

### Performa navigasi
- Menghapus `auth.getUser()` dari middleware agar setiap perpindahan menu tidak melakukan network round-trip Auth tambahan.
- Dashboard sekarang memakai **1 RPC payload** untuk business context + summary + chart + aktivitas terbaru.
- Pesanan memakai **1 RPC payload** untuk counter + search + list.
- Piutang memakai **1 RPC payload** untuk KPI + aging + list.
- Menambah index pada hot path `business_members`, `orders`, dan `invoices`.
- Service worker tidak lagi mengintersep semua GET request dinamis.
- RLS tetap menjadi batas keamanan database.

### UI/UX
- Dashboard: kartu persentase pembayaran bulan ini.
- Pesanan: ringkasan Total Order, Sisa Tagihan, dan Dalam Proses.
- Piutang: dashboard total piutang, persentase terlambat, tingkat tertagih, jatuh tempo 7 hari, cicilan aktif, aging 1–7 / 8–30 / >30 hari, progress pembayaran per invoice.
- Empty state dibuat lebih informatif dan punya CTA.
- Card dibuat lebih hidup dengan gradient ringan, bukan putih polos.

## Upgrade dari v0.2.0 yang sedang dipakai

1. **Jalankan SQL patch ini sekali saja:**
   `supabase/migrations/202609220003_performance_ui.sql`
2. Replace source GitHub dengan source v0.2.1.
3. Environment Vercel lama tetap dipakai.
4. Redeploy Vercel. Disarankan **Clear Build Cache** sekali pada deployment pertama v0.2.1.
5. Jangan jalankan MASTER SQL pada database yang sudah berjalan.

## Fresh install client baru

Gunakan:

`supabase/PesanLunas_MASTER_Supabase_v1.3_AUTO_SKU.sql`

Jalankan sekali pada Supabase baru, kemudian deploy source v0.2.1.

## Test performa utama

Setelah deploy:

1. Login → Dashboard.
2. Klik `Pesanan` → `Piutang` → `Beranda` beberapa kali.
3. Perpindahan menu utama seharusnya jauh lebih cepat daripada v0.2.0 karena query berantai telah dipangkas.
4. Buat order dengan DP lalu cek Piutang: KPI, persentase, aging, dan progress harus ikut berubah.
5. Catat cicilan sampai lunas dan pastikan invoice hilang dari Piutang aktif.

## Catatan

- Fonnte/Starsender tetap opsional dan secret tetap server-side.
- Invoice yang diterbitkan tetap snapshot.
- Database schema tetap memakai `business_id` + RLS untuk isolasi dan struktur yang rapi, tetapi edition ini dijalankan sebagai satu bisnis per instalasi.

## v0.2.2 Runtime Resilience
- Dashboard tidak lagi crash jika RPC performance v0.2.1 gagal; otomatis fallback ke query/RPC dasar.
- Endpoint `/api/diagnostics` untuk memeriksa Auth + RPC business/dashboard/orders/receivables dengan pesan error asli.
- Tidak membutuhkan SQL baru jika database v0.2.0/v0.2.1 sudah terpasang.

## v0.2.3 Automatic SKU
- SKU Produk/Jasa tidak lagi diketik manual.
- Owner menentukan `Prefix SKU Produk/Jasa` di Pengaturan Usaha.
- Database menghasilkan SKU atomik, contoh `KUE-000001`, `KUE-000002`.
- Counter dipisahkan per prefix; mengganti prefix baru dapat mulai dari `000001`.
- SKU yang sudah terbentuk dikunci saat edit agar histori transaksi konsisten.
- Upgrade database berjalan: jalankan `supabase/migrations/202609220004_auto_sku.sql` sekali.
