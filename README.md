# Portal Digital SERASHA

Portal satu skrin bergaya sinematik untuk warga SMK Raja Shahriman (SERASHA), Beruas, Perak. Halaman ini memaparkan skrin pemuatan peratusan, langit animasi penuh kod dengan empat suasana (subuh, siang, senja, malam), tipografi paparan besar, dan rel kad eSistem yang boleh diseret di bahagian bawah. Dibina dengan React, TypeScript dan Vite.

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

Semua rekod berada di `src/data/systems.ts` dan mematuhi kontrak `SystemEntry` (`src/types/system.ts`). Setiap sistem muncul secara automatik sebagai kad dalam rel bawah; tiada komponen perlu diubah. Medan penting:

- `id`: pengecam unik ringkas, contohnya `tempahan-makmal`.
- `name` dan `description`: teks paparan dalam Bahasa Melayu.
- `url`: alamat HTTPS penuh; dibuka dalam tab baharu dengan `noopener noreferrer`.
- `icon`: salah satu `book-open`, `calendar-days`, `file-text` atau `life-buoy`.
- `accent`: warna CSS untuk sinaran kad.
- `order`: nombor susunan; nombor kecil dahulu.

## Identiti sekolah dan imej latar

Maklumat sekolah (nama, cogan kata, baris hak cipta) berada di `src/data/site.ts`. Fail yang sama menyediakan slot `heroImage` untuk setiap suasana:

```ts
heroImage: {
  dawn: '/hero/sekolah-subuh.jpg',
  day: '/hero/sekolah-siang.jpg',
  dusk: '/hero/sekolah-senja.jpg',
  night: '/hero/sekolah-malam.jpg',
},
```

Letakkan imej dalam `public/hero/` dan isi laluan di atas — imej akan menjadi latar penuh skrin dan lapisan awan kod bertukar menjadi hiasan nipis. Biarkan kosong untuk kekal dengan langit animasi penuh kod.

## Tema empat suasana

Setiap kali dibuka, portal berada dalam mod **automatik**: langit mengikut jam tempatan pelawat dan bertukar sendiri apabila tiba waktunya (subuh 6:00–9:00, siang 9:00–17:00, senja 17:00–19:30, selebihnya malam). Butang di bar navigasi menggilir `Automatik → Subuh → Siang → Senja → Malam` untuk sesi semasa sahaja (tidak disimpan). Tema juga boleh dipaksa melalui parameter URL `?theme=dawn|day|dusk|night|auto`.

## Skop dan kebolehcapaian

Portal ini statik tanpa pangkalan data. Rel eSistem ditatal secara seretan tetikus, leretan sentuhan, atau papan kekunci. Ia menghormati `prefers-reduced-motion` (skrin pemuatan dilangkau, animasi latar dimatikan), mengekalkan fokus papan kekunci yang jelas, dan gagal terbuka apabila storan pelayar disekat.
