/**
 * =====================================================================
 * answer Willy - Centralized Quiz Configuration
 * =====================================================================
 * File ini memisahkan data kuis, tema, dan threshold skor dari logic UI.
 * Anda dapat dengan mudah mengubah pertanyaan, opsi, skor, tema, dan teks
 * tanpa perlu membongkar kode JavaScript aplikasi di app.js.
 * =====================================================================
 */

const quizConfig = {
  // Metadata Dasar
  title: "answer Willy",
  subtitle: "Let's see how well you actually know me.",
  
  // Teks Halaman Gate / Intro
  gate: {
    title: "How well do you know Willy?",
    subtext: "10 questions. No hints. No going back.",
    playfulText: "Think carefully. Some answers are closer than they look.",
    buttonText: "MULAI"
  },

  // Pengaturan Durasi, Audio & Animasi
  settings: {
    dramaticPauseMs: 1400,     // Jeda dramatis sebelum skor diungkapkan
    scoreCountUpDurationMs: 1800, // Durasi animasi count-up skor
    localStorageKey: "answerWillyLeaderboard",
    audio: {
      normalBgm: "assets/musik-normal.mp3",
      creepyBgm: "assets/musik-creepy.mp3"
    }
  },

  // Konfigurasi Database Supabase (Global Leaderboard)
  supabase: {
    url: "https://bpikbnqhpramcijkdnvj.supabase.co",
    anonKey: "sb_publishable_pLF04fqRJbuzfV92Mqmv9A_ZLsrz20z",
    tableName: "leaderboard"
  },

  /**
   * DATA PERTANYAAN (10 Soal)
   * Setiap soal memiliki 10 opsi.
   * - Jawaban benar SELALU 100 poin.
   * - Jawaban salah SELALU antara 0–50 poin (tidak ada > 50).
   * - Distribusi skor acak & tidak berpola, disertai beberapa nilai 0.
   * - Posisi jawaban benar ditempatkan secara bervariasi agar tidak mudah ditebak.
   */
  questions: [
    {
      id: 1,
      question: "Manakah profil rasa yang paling merepresentasikan preferensi Willy?",
      options: [
        { text: "Matcha dengan kepahitan vegetal yang dominan", score: 20 },
        { text: "Vanilla dengan karakter lembut dan aromatik", score: 35 },
        { text: "Dark chocolate dengan intensitas kakao tinggi", score: 0 },
        { text: "Taro dengan karakter manis dan aroma khasnya", score: 100 }, // Kunci: Taro (100)
        { text: "Caramel dengan nuansa manis dan toasted", score: 40 },
        { text: "Strawberry dengan aksen asam-fruity", score: 15 },
        { text: "Durian dengan aroma yang sangat ekspresif", score: 0 },
        { text: "Coffee dengan karakter pahit dan roasted", score: 10 },
        { text: "Cheese dengan sensasi gurih-krem", score: 45 },
        { text: "Red velvet dengan profil manis dan creamy", score: 25 }
      ]
    },
    {
      id: 2,
      question: "Sebelum akhirnya menapaki jalur PPLG/RPL di SMK Brantas, bidang apakah yang terlebih dahulu terlintas dalam benak Willy sebagai kemungkinan jurusan?",
      options: [
        { text: "Rekayasa Perangkat Lunak", score: 30 },
        { text: "Teknik ketenagalistrikan", score: 100 }, // Kunci: Teknik ketenagalistrikan (100)
        { text: "Teknik Komputer dan Jaringan", score: 45 },
        { text: "Desain Komunikasi Visual", score: 25 },
        { text: "Teknik elektronika industri", score: 0 },
        { text: "Teknik kendaraan ringan", score: 10 },
        { text: "Teknik pemesinan", score: 0 },
        { text: "Teknik instalasi bangunan", score: 35 },
        { text: "Akuntansi dan keuangan", score: 5 },
        { text: "Teknik audio-video", score: 15 }
      ]
    },
    {
      id: 3,
      question: "Di antara benda-benda yang secara praktis menghuni ruang domestik Willy, objek manakah yang justru memiliki tempat paling istimewa dalam preferensinya?",
      options: [
        { text: "Laptop", score: 40 },
        { text: "Tempat tidur", score: 50 },
        { text: "Smartphone", score: 20 },
        { text: "Meja kerja", score: 0 },
        { text: "Headset", score: 35 },
        { text: "Kipas angin", score: 100 }, // Kunci: Kipas angin (100)
        { text: "Kursi", score: 15 },
        { text: "Lampu kamar", score: 0 },
        { text: "Lemari pakaian", score: 5 },
        { text: "Jam dinding", score: 25 }
      ]
    },
    {
      id: 4,
      question: "Di antara objek-objek planetologis berikut, manakah yang paling memiliki daya tarik bagi Willy?",
      options: [
        { text: "Haumea", score: 100 }, // Kunci: Haumea (100)
        { text: "Makemake", score: 45 },
        { text: "Eris", score: 40 },
        { text: "Pluto", score: 50 },
        { text: "Ceres", score: 35 },
        { text: "Neptunus", score: 20 },
        { text: "Uranus", score: 25 },
        { text: "Saturnus", score: 0 },
        { text: "Jupiter", score: 15 },
        { text: "Mars", score: 0 }
      ]
    },
    {
      id: 5,
      question: "Manakah aktivitas kontemplatif yang paling merepresentasikan salah satu bentuk kesukaan Willy ketika memiliki kesempatan untuk mengamati dunia tanpa tuntutan untuk berinteraksi dengannya?",
      options: [
        { text: "Menjelajahi dunia virtual", score: 25 },
        { text: "Mendengarkan musik seorang diri", score: 45 },
        { text: "Membaca mengenai kosmologi", score: 50 },
        { text: "Menulis gagasan filosofis", score: 30 },
        { text: "Menatap langit malam", score: 100 }, // Kunci: Menatap langit malam (100)
        { text: "Mengembangkan proyek pemrograman", score: 0 },
        { text: "Mengamati fenomena alam", score: 35 },
        { text: "Menonton karya animasi", score: 15 },
        { text: "Berjalan tanpa tujuan tertentu", score: 0 },
        { text: "Berdiskusi mengenai konsep abstrak", score: 10 }
      ]
    },
    {
      id: 6,
      question: "Apabila seluruh disiplin berikut diletakkan di hadapan Willy dan ia hanya diperbolehkan mempertahankan satu sebagai bidang ilmu yang paling menarik baginya, manakah yang paling mungkin ia pilih?",
      options: [
        { text: "Filsafat", score: 50 },
        { text: "Kosmologi", score: 45 },
        { text: "Informatika", score: 30 },
        { text: "Teologi", score: 100 }, // Kunci: Teologi (100)
        { text: "Linguistik", score: 0 },
        { text: "Psikologi", score: 35 },
        { text: "Astronomi", score: 40 },
        { text: "Sejarah", score: 15 },
        { text: "Matematika", score: 0 },
        { text: "Biologi", score: 10 }
      ]
    },
    {
      id: 7,
      question: "Apabila Willy tidak lagi diwajibkan mempertahankan bentuk biologis manusia dan diberi kebebasan memilih suatu bentuk makhluk fantastis, eksistensi apakah yang paling merepresentasikan pilihannya?",
      options: [
        { text: "Naga primordial", score: 35 },
        { text: "Phoenix", score: 40 },
        { text: "Kitsune", score: 20 },
        { text: "Seraphim", score: 45 },
        { text: "Griffin", score: 0 },
        { text: "Alicorn", score: 100 }, // Kunci: Alicorn (100)
        { text: "Unicorn", score: 50 },
        { text: "Leviathan", score: 15 },
        { text: "Werewolf", score: 0 },
        { text: "Burung kosmik", score: 30 }
      ]
    },
    {
      id: 8,
      question: "Dari berbagai entitas yang lahir dari mitologi, kosmologi fiksi, dan cosmic horror berikut, manakah yang paling memiliki daya tarik bagi Willy?",
      options: [
        { text: "Yog-Sothoth, The Key and the Gate", score: 50 },
        { text: "Nyarlathotep, The Crawling Chaos", score: 40 },
        { text: "Azathoth, The Blind Idiot God", score: 100 }, // Kunci: Azathoth (100)
        { text: "Shub-Niggurath, The Black Goat", score: 10 },
        { text: "Cthulhu, The Great Old One", score: 30 },
        { text: "The Scarlet King", score: 0 },
        { text: "The King in Yellow", score: 45 },
        { text: "SCP-682", score: 0 },
        { text: "Rimuru Tempest", score: 25 },
        { text: "Ciel", score: 35 }
      ]
    },
    {
      id: 9,
      question: "Dari berbagai kecenderungan berikut, manakah yang menurut Willy merupakan salah satu kekurangan terbesar dalam dirinya sendiri?",
      options: [
        { text: "Kecenderungan terlalu lama mempertimbangkan berbagai kemungkinan", score: 35 },
        { text: "Kesulitan mempertahankan konsistensi terhadap rutinitas", score: 45 },
        { text: "Dorongan untuk terus mengeksplorasi hal-hal baru", score: 20 },
        { text: "Kecenderungan cepat kehilangan ketertarikan terhadap sesuatu yang sedang dikerjakan", score: 100 }, // Kunci: Opsi 1 (100)
        { text: "Kecenderungan mudah terdistraksi oleh stimulus baru", score: 0 },
        { text: "Ketidakmampuan mempertahankan fokus pada satu bidang untuk waktu lama", score: 40 },
        { text: "Kecenderungan mempertanyakan premis yang dianggap sudah mapan", score: 15 },
        { text: "Dorongan untuk berpindah dari satu gagasan ke gagasan lain", score: 0 },
        { text: "Kecenderungan kehilangan motivasi ketika novelty suatu aktivitas menghilang", score: 50 },
        { text: "Kesulitan memelihara ketertarikan terhadap pekerjaan yang telah kehilangan unsur eksplorasinya", score: 30 }
      ]
    },
    {
      id: 10,
      question: "FINAL BOSS: Apabila seluruh batas biologis, epistemologis, dan ontologis manusia ditiadakan, bentuk eksistensi apakah yang paling mendekati aspirasi ekstrem Willy?",
      options: [
        { text: "Menjadi intelek yang mampu memahami seluruh hukum fundamental alam semesta", score: 45 },
        { text: "Menjadi entitas abadi yang terbebas dari seluruh keterbatasan biologis", score: 20 },
        { text: "Mencapai kesadaran yang tidak lagi terikat oleh ruang dan waktu", score: 50 },
        { text: "Menjadi pengamat transenden yang mampu menyaksikan seluruh kemungkinan realitas", score: 35 },
        { text: "Menjadi pencipta suatu realitas baru dengan hukum eksistensialnya sendiri", score: 40 },
        { text: "Menjadi entitas kosmik yang melampaui seluruh bentuk kehidupan konvensional", score: 30 },
        { text: "Mencapai tingkat pengetahuan absolut mengenai seluruh aspek eksistensi", score: 0 },
        { text: "Menjadi eksistensi yang sepenuhnya bebas dari batasan kausalitas", score: 25 },
        { text: "Mengubah dirinya menjadi kesadaran non-material yang dapat mengobservasi seluruh realitas", score: 0 },
        { text: "Menjadi entitas yang melampaui kesadaran dan mampu memanipulasi realitas pada tingkat tinggi", score: 100 } // Kunci: Opsi 1 (100)
      ]
    }
  ],

  /**
   * SCORE TIERS
   * Semakin rendah skor, atmosfer berubah secara bergradasi:
   * Cute Dreamy -> Mysterious -> Unsettling -> Disturbing / Cosmic Void
   */
  scoreTiers: [
    {
      min: 900,
      max: 1000,
      theme: "theme-perfect",
      tone: "Perfect / Suspiciously Knowledgeable",
      badge: "✨ Celestial Soulmate",
      title: "You know Willy REALLY well.",
      description: "Pengetahuanmu tentang Willy melampaui batas wajar. Entah kamu belahan jiwanya atau diam-diam memata-matai setiap detail hidupnya... ini mencurigakan sekaligus sangat menakjubkan!"
    },
    {
      min: 750,
      max: 899,
      theme: "theme-good",
      tone: "Very Good & Mysterious",
      badge: "🌙 Cosmic Companion",
      title: "Almost Willy Expert!",
      description: "Kamu mengenal Willy dengan luar biasa baik. Sebagian besar preferensi terdalam dan cara pandangnya berhasil kamu tebak dengan presisi."
    },
    {
      min: 500,
      max: 749,
      theme: "theme-neutral",
      tone: "Not Bad at All",
      badge: "⭐ Starlight Acquaintance",
      title: "Not bad, but...",
      description: "Kamu mengenalnya cukup baik di permukaan. Namun ada beberapa sudut pandang kosmik dan kontemplasi Willy yang masih menjadi misteri bagimu."
    },
    {
      min: 250,
      max: 499,
      theme: "theme-low",
      tone: "Unsettling",
      badge: "🌫️ Fading Echo",
      title: "You don't know Willy that well.",
      description: "Apakah kamu benar-benar mengenalnya, atau hanya mengenal ilusi yang tampak dari kejauhan? Setiap jawabanmu terasa semakin menjauh dari sosok aslinya..."
    },
    {
      min: 0,
      max: 249,
      theme: "theme-terrifying",
      mascot: "assets/pfp-eye.png",
      tone: "Eerie / Disturbing",
      badge: "👁️ Unknown Anomaly",
      title: "Who are you...?",
      description: "Siapa kamu sebenarnya? Apakah Willy yang sepenuhnya asing bagimu... atau justru eksistensimu sendiri yang tidak pernah benar-benar ada di sini?"
    }
  ]
};

/**
 * THEME & VISUAL CONFIG
 * Anda bisa mengganti file background atau mascot kapan saja.
 */
const themeConfig = {
  mascot: "mascot.png",
  mascotAlt: "Cosmic Mascot Willy",
  sparklesEnabled: true
};

// Export ke window agar dapat diakses oleh app.js
window.quizConfig = quizConfig;
window.themeConfig = themeConfig;
