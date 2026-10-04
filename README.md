# answer Willy — Interactive Personal Quiz

Website kuis personal modern, dreamy, dan mobile-first yang menguji seberapa jauh seseorang mengenal Willy / Wibian.

---

## 🌟 Fitur Utama

- **Mobile-First Experience**: Didesain khusus untuk layar sentuh ponsel (360px–430px) dengan target sentuh tombol luas dan nyaman, namun tetap responsif di layar desktop.
- **Cute & Cosmic Aesthetics**: Palet pastel dreamy, background langit malam berbintang, kartu glassmorphism, dan animasi mengambang (floating mascot).
- **Separation of Concerns**: Seluruh pertanyaan, skor, opsi, dan tier hasil dipisahkan ke `quiz-config.js`, sehingga Anda tidak perlu menyentuh logic `app.js` untuk mengganti konten.
- **Linear Flow & Strict Navigation**: Alur terarah (Landing Name Entry ➔ Introduction Gate ➔ Q1–Q10 ➔ Dramatic Pause ➔ Result ➔ Leaderboard). Navigasi mundur/back dibatasi secara ketat.
- **Non-patterned Scoring**: 10 pertanyaan dengan 10 opsi tiap pertanyaan. Jawaban benar bernilai 100 poin, jawaban salah bernilai 0–50 poin dengan distribusi acak dan tanpa pola.
- **Dynamic Score Tiers & Theme Shift**:
  - `900–1000`: Perfect Celestial (*You know Willy REALLY well.*)
  - `750–899`: Very Good Cosmic (*Almost Willy Expert!*)
  - `500–749`: Neutral Starlight (*Not bad, but...*)
  - `250–499`: Low Echo (*You don't know Willy that well.*)
  - `0–249`: Cosmic Void / Eerie (*Who are you...?*)
- **Leaderboard dengan Aturan Re-take**:
  - Menggunakan `localStorage` (key: `answerWillyLeaderboard`).
  - Hanya attempt pertama dari suatu nama yang tercatat di Leaderboard.
  - Normalisasi nama (mengabaikan perbedaan huruf besar/kecil dan spasi).
  - Peringkat diurutkan berdasarkan skor tertinggi, dengan durasi pengerjaan tercepat sebagai tie-breaker.
  - Highlight peserta aktif dengan tag **"YOU"**.

---

## 📁 Struktur File

```
kuis-willy/
├── index.html         # Struktur semantik HTML5, meta mobile-first & Google Fonts
├── styles.css         # Desain sistem CSS variables, tema glassmorphism & tier styling
├── quiz-config.js     # Data kuis terpusat (pertanyaan, opsi, skor, & tier)
├── app.js             # Logic state, controller, scoring isolator, animasi & leaderboard
├── mascot.png         # Gambar mascot utama (dapat diganti kapan saja)
└── README.md          # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan

Karena dibuat murni menggunakan **HTML, CSS, dan Vanilla JavaScript**, Anda dapat menjalankannya dengan cara berikut:

### Opsi 1: Buka Langsung di Browser
Cukup klik dua kali file `index.html` di File Explorer Anda.

### Opsi 2: Menggunakan Local Server (Direkomendasikan untuk uji coba mobile di browser DevTools)
Buka terminal di folder ini dan jalankan:
```bash
# Menggunakan Python:
python -m http.server 8080

# Atau menggunakan Node (npx):
npx serve
```
Kemudian buka browser di `http://localhost:8080`.

---

## 🎨 Panduan Kustomisasi

### 1. Mengganti Pertanyaan, Opsi, atau Skor
Buka file `quiz-config.js`. Cari array `questions`:
```javascript
{
  id: 1,
  question: "Pertanyaan Anda di sini...",
  options: [
    { text: "Pilihan A", score: 20 },
    { text: "Pilihan B (Kunci Jawaban)", score: 100 },
    { text: "Pilihan C", score: 0 },
    ...
  ]
}
```

### 2. Mengganti Mascot
- Cukup ganti file `mascot.png` di folder utama dengan gambar mascot baru Anda (format PNG transparan rasio 1:1 sangat direkomendasikan).
- Atau ubah properti `mascot` pada `themeConfig` di `quiz-config.js`.

### 3. Mengganti Tema / Background
Warna dan gradasi latar belakang setiap tier dapat diubah dengan mudah di `styles.css`:
- `body.theme-perfect`
- `body.theme-good`
- `body.theme-neutral`
- `body.theme-low`
- `body.theme-terrifying`

### 4. Reset Leaderboard (Untuk Testing / Development)
Untuk membersihkan data leaderboard lokal di browser Anda saat testing, buka Console Developer Tools (tekan `F12` ➔ Console) dan ketik:
```javascript
window.resetLeaderboard();
```
Atau bersihkan cache `localStorage` secara manual pada menu Application ➔ Local Storage.
