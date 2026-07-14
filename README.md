# Portal Digital SMK Raja Shahriman

Portal statik sehenti untuk kakitangan dan warga sekolah mengakses eSistem SMK Raja Shahriman. Antara muka dibina dengan React, TypeScript dan Vite, manakala semua pautan sistem dikawal melalui satu fail konfigurasi bertulis jenis.

## Jalankan secara tempatan

Keperluan: Node.js dan npm.

```powershell
npm install
npm run dev
```

Vite akan memaparkan alamat tempatan untuk dibuka dalam pelayar.

## Semakan sebelum penerbitan

```powershell
npm run test
npm run lint
npm run build
```

Arahan binaan menghasilkan laman statik dalam direktori `dist/`. Muat naik kandungan direktori tersebut ke perkhidmatan pengehosan statik pilihan sekolah.

## Tambah atau kemas kini eSistem

Semua rekod berada di `src/data/systems.ts`. Tambah atau ubah objek dalam tatasusunan `systems`; komponen, carian, penapis kategori dan bahagian pilihan tidak perlu diubah. Setiap rekod mesti mematuhi kontrak `SystemEntry`:

- `id`: pengecam unik dalam format ringkas, contohnya `tempahan-makmal`.
- `name` dan `description`: teks paparan dalam Bahasa Melayu.
- `category`: salah satu `Akademik`, `Pengurusan`, `Kemudahan` atau `Sokongan Digital`.
- `url`: alamat HTTPS penuh. Pautan akan dibuka dalam tab baharu dengan perlindungan `noopener noreferrer`.
- `icon`: salah satu `book-open`, `calendar-days`, `file-text` atau `life-buoy`.
- `accent`: warna CSS yang sah, sebaik-baiknya daripada palet rasmi sekolah.
- `featured`: `true` untuk dipaparkan pada rel pilihan.
- `order`: nombor susunan; nombor lebih kecil dipaparkan dahulu.

Reka bentuk direktori menyokong penambahan sehingga 15 rekod melalui fail ini sahaja.

## Skop dan kebolehcapaian

Portal ini tidak menggunakan pangkalan data atau panel pentadbir. Ia menyediakan carian, penapis, navigasi papan kekunci, fokus yang jelas, rel sentuh pada telefon, serta paparan yang menghormati pilihan `prefers-reduced-motion`.

Spesifikasi reka bentuk: `docs/superpowers/specs/2026-07-14-smkrs-digital-portal-design.md`.

