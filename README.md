# PesanLunas v0.2.0 — CRUD Tester

**Tagline:** Pesanan tercatat, tagihan cepat lunas.

Release ini dibuat untuk pengujian fitur end-to-end sebelum paket client final.

## Modul yang sudah bisa diuji

- Auth + email confirmation + onboarding bisnis
- Dashboard + statistik dasar
- Pelanggan: tambah, lihat, edit, hapus/soft-delete
- Produk/Jasa: tambah, lihat, edit, hapus/soft-delete
- Pesanan: buat order multi-item, custom field dinamis, DP awal, status, detail, soft-delete
- Invoice: list, detail, link publik, print/save as PDF browser
- Pembayaran: DP/cicilan/pelunasan, refund, void payment
- Piutang: list overdue/partial/unpaid, buka invoice, WhatsApp manual
- Metode pembayaran: CRUD
- Template/custom field: CRUD + dropdown/multiselect options
- Template pesan: CRUD
- Anggota tim: role/status + link undangan (butuh SQL patch v0.2.0)
- Pengaturan usaha: profil, prefix dokumen, timezone, currency
- WhatsApp: mode manual/Fonnte/Starsender (secret gateway tetap server-side)
- Laporan: summary periode + export CSV order/pembayaran
- Activity log untuk Owner/Admin
- PWA mobile-first

## Upgrade dari v0.1.5 yang sedang dipakai

1. **Backup project/repo terlebih dahulu.**
2. Jalankan hanya SQL patch berikut pada Supabase project lama:
   `supabase/migrations/202609220002_crud_patch.sql`
3. Replace source GitHub dengan source v0.2.0 ini.
4. Pastikan environment variables Vercel tetap ada:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` atau `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy ulang di Vercel.
6. Jangan jalankan migration initial lama lagi pada database yang sudah berisi schema v1.0.

## Fresh install client baru

Untuk Supabase baru, gunakan file:

`supabase/PesanLunas_MASTER_Supabase_v1.1_CRUD.sql`

Jalankan sekali pada SQL Editor, lalu deploy source ini ke GitHub/Vercel milik client.

## Catatan penting

- Token Fonnte/Starsender tidak disimpan di tabel client-readable.
- Invoice yang sudah diterbitkan adalah snapshot dan tidak boleh diedit diam-diam.
- Jika nominal/item order perlu direvisi, void invoice terlebih dahulu, lalu lakukan revisi/reissue pada flow berikutnya.
- Public invoice memakai token random yang di-hash di database.
- Database tetap tenant-safe dengan `business_id` + RLS walau edition ini dipakai 1 bisnis per instalasi.

## Test flow disarankan

1. Tambah metode pembayaran.
2. Tambah 2–3 pelanggan.
3. Tambah produk/jasa.
4. Cek custom field dari template bisnis.
5. Catat order + DP.
6. Buka invoice dan buat link publik.
7. Catat cicilan kedua sampai lunas.
8. Test refund/void payment pada order test.
9. Buka Piutang dan test WhatsApp manual.
10. Export laporan CSV.
11. Test role anggota dengan akun email kedua.

## File pengujian

Gunakan `TEST_CHECKLIST.md` agar test CRUD dilakukan berurutan dan gampang melacak modul yang belum lolos.

## Environment opsional WhatsApp otomatis

Tambahkan di Vercel hanya jika provider tersebut akan diuji:

```env
FONNTE_TOKEN=
STARSENDER_API_KEY=
```

Secret gateway tidak memakai prefix `NEXT_PUBLIC_`.
