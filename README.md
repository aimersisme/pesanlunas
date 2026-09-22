# PesanLunas v0.1.5 — Performance Hotfix

Perbaikan ini fokus pada dashboard/navigasi yang terasa lambat setelah deployment produksi.

## Yang diubah

- `getActiveBusiness()` sekarang hanya **1 query** (`business_members` + relasi `businesses`).
- Menghapus `auth.getUser()` kedua dari setiap halaman aplikasi. Middleware tetap menjaga sesi dan RLS tetap menjadi batas keamanan database.
- Dashboard/Pesanan/Piutang menggunakan **Supabase server client yang sama** saat resolve bisnis.
- Menambahkan `loading.tsx` + skeleton agar navigasi langsung memberi respons visual.
- Menambahkan `/api/perf` untuk mengukur latency Auth/DB dan melihat region function Vercel tanpa membocorkan key.
- Tidak ada perubahan schema database. **Jangan jalankan MASTER SQL ulang.**

## Deploy

1. Replace source lama dengan isi folder ini.
2. Commit/push ke `main`.
3. Redeploy Vercel (boleh Clear Build Cache).
4. Login lalu buka `/dashboard`.
5. Setelah login, buka `/api/perf` dan lihat `authMs`, `dbMs`, dan `vercelRegion`.

Jika latency masih tinggi, cocokkan region Function Vercel dengan region Supabase. Untuk pengguna Indonesia dengan project Supabase di Singapore/Southeast Asia, function Vercel sebaiknya juga ditempatkan sedekat mungkin dengan Singapore.
