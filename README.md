# PesanLunas — Next.js Foundation v0.1

> Pesanan tercatat, tagihan cepat lunas.

Foundation ini dibuat untuk dipasang di GitHub/Vercel dan terhubung ke database Supabase PesanLunas yang sudah dijalankan lewat `PesanLunas_MASTER_Supabase_v1.sql`.

## Yang sudah aktif

- Login & register Supabase Auth
- Session SSR + middleware protection
- Onboarding usaha lewat RPC `create_business`
- Pilihan template: Katering, Percetakan, Konveksi, Bengkel, Supplier, Jasa Umum, Kosong
- Dashboard mobile-first dari data Supabase nyata
- Grafik nilai order bulan berjalan
- Daftar pesanan + filter status
- Daftar piutang dari `v_receivables`
- Tombol tagih WhatsApp manual (`wa.me`)
- PWA manifest + service worker dasar
- Bottom navigation: Beranda / Pesanan / Piutang / Lainnya
- CTA `Catat Order`
- RLS tetap ditangani database Supabase

## Belum diaktifkan pada foundation ini

Tombol `Catat Order` masih menuju halaman Pesanan. Form CRUD pelanggan/order akan menjadi fase berikutnya. Menu Lainnya masih berupa navigasi UI sebelum modul CRUD masing-masing dibangun.

## 1. Supabase

SQL master sudah Anda jalankan jika SQL Editor menampilkan `Success. No rows returned`.

File yang sama disalin ke:

`supabase/migrations/202609220001_initial.sql`

Jangan jalankan ulang hanya karena file ada di repo jika database Anda sudah terpasang.

## 2. Ambil URL dan Anon Key

Supabase Dashboard → Project Settings / API, lalu ambil:

- Project URL
- `anon` / publishable key untuk browser

JANGAN taruh Service Role key di `NEXT_PUBLIC_*`.

## 3. Environment lokal

Copy `.env.example` menjadi `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Jalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## 5. Deploy Vercel

1. Push folder ini ke GitHub.
2. Import repository di Vercel.
3. Tambahkan tiga environment variables yang sama.
4. Deploy.
5. Setelah punya URL produksi, ubah `NEXT_PUBLIC_APP_URL` ke URL Vercel/domain Anda.

## 6. Supabase Auth URL

Di Supabase Auth URL Configuration:

- Site URL → URL aplikasi produksi Anda.
- Redirect URLs → tambahkan `http://localhost:3000/**` saat development dan `https://DOMAIN-ANDA/**` untuk production.

Untuk testing cepat, jika Email Confirmation masih aktif, akun baru harus membuka email konfirmasi sebelum bisa login. Jangan mematikan confirmation pada production tanpa mempertimbangkan kebijakan akun Anda.

## Struktur utama

```text
app/
  auth/login
  auth/register
  onboarding
  dashboard
  orders
  receivables
  more
components/
lib/supabase/
supabase/migrations/
```

## Tahap berikutnya

Fase berikutnya adalah membuat **CRUD Pelanggan + Catat Order dinamis**. Form Catat Order akan membaca `custom_field_definitions` hasil template usaha, membuat item pesanan, lalu memanggil RPC `create_order()` sehingga nomor order, snapshot invoice, total, dan optional DP tetap diproses secara atomik oleh database.


## v0.1.1 build hotfix

- Fixed strict TypeScript inference for Supabase nested `customers(name)` relations in the Orders and Dashboard pages.
- Fixed Autoprefixer mixed-support warnings by using `flex-end`.
- No database migration is required for this hotfix.

## Build fix v0.1.2

- Explicitly types Supabase SSR `setAll(cookiesToSet)` in both `lib/supabase/server.ts` and `middleware.ts` for strict TypeScript builds on Vercel.
- Prevents `Parameter 'cookiesToSet' implicitly has an 'any' type` from failing `next build`.

## Build hardening v0.1.3

- Explicit row types for Dashboard, Orders, and Receivables so Supabase `any` inference cannot create `noImplicitAny` build failures.
- Explicit cookie callback item types in server client and middleware.
- Dependency ranges are pinned for repeatable Vercel builds.
- Next.js updated within the 15.5 maintenance line to 15.5.24.
- No database migration is required.
