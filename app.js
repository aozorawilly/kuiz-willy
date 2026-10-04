/**
 * =====================================================================
 * answer Willy - Application Logic
 * Theme: Pastel Iridescent / Mint Cards / HD Clean Assets
 * =====================================================================
 */

(function () {
  "use strict";

  // Application State
  const state = {
    userName: "",
    currentQuestionIndex: 0,
    selectedOptionIndex: null,
    answers: [], // Array: { questionId, selectedIndex, score }
    startTime: null,
    endTime: null,
    currentScreen: "landing", // 'landing' | 'gate' | 'quiz' | 'pause' | 'result'
    isSubmitting: false
  };

  // DOM Mount Point
  let viewRoot = null;

  /**
   * Sound & Audio Manager
   * Supports normal BGM ('assets/musik-normal.mp3') & creepy BGM ('assets/musik-creepy.mp3')
   */
  const soundManager = {
    currentTrack: null, // 'normal' | 'creepy'
    isMuted: false,
    hasInteracted: false,
    normalAudio: null,
    creepyAudio: null,

    init() {
      const normalSrc = (quizConfig.settings && quizConfig.settings.audio && quizConfig.settings.audio.normalBgm) || "assets/musik-normal.mp3";
      const creepySrc = (quizConfig.settings && quizConfig.settings.audio && quizConfig.settings.audio.creepyBgm) || "assets/musik-creepy.mp3";

      try {
        this.normalAudio = new Audio(normalSrc);
        this.normalAudio.loop = true;
        this.normalAudio.volume = 0.5;

        this.creepyAudio = new Audio(creepySrc);
        this.creepyAudio.loop = true;
        this.creepyAudio.volume = 0.65;
      } catch (err) {
        console.warn("Audio initialization note:", err);
      }

      // Unlock browser autoplay policy on first user interaction anywhere
      const unlockAudio = () => {
        if (!this.hasInteracted) {
          this.hasInteracted = true;
          if (!this.isMuted) {
            this.play(this.currentTrack || "normal");
          }
        }
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
      };

      window.addEventListener("click", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true });
    },

    play(trackName) {
      if (this.currentTrack === trackName && this.getActiveAudio() && !this.getActiveAudio().paused) {
        return;
      }

      const prevAudio = this.getActiveAudio();
      this.currentTrack = trackName;
      const nextAudio = this.getActiveAudio();

      if (!nextAudio) return;

      // Cross-fade if changing between tracks
      if (prevAudio && prevAudio !== nextAudio) {
        this.fadeAudio(prevAudio, prevAudio.volume, 0, 450, () => {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        });
      }

      if (!this.isMuted && this.hasInteracted) {
        const targetVol = trackName === "creepy" ? 0.65 : 0.5;
        nextAudio.play().then(() => {
          this.fadeAudio(nextAudio, 0, targetVol, 500);
        }).catch((err) => {
          console.log("Audio waiting for user gesture:", err);
        });
      }

      this.updateButtonUI();
    },

    getActiveAudio() {
      if (this.currentTrack === "creepy") return this.creepyAudio;
      return this.normalAudio;
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
      this.hasInteracted = true;

      const active = this.getActiveAudio();
      if (this.isMuted) {
        if (this.normalAudio) this.normalAudio.pause();
        if (this.creepyAudio) this.creepyAudio.pause();
      } else {
        if (!this.currentTrack) this.currentTrack = "normal";
        const next = this.getActiveAudio();
        if (next) {
          next.play().catch(() => {});
        }
      }

      this.updateButtonUI();
    },

    fadeAudio(audio, startVol, endVol, durationMs, onComplete) {
      if (!audio) return;
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        audio.volume = Math.max(0, Math.min(1, startVol + (endVol - startVol) * progress));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          audio.volume = Math.max(0, Math.min(1, endVol));
          if (onComplete) onComplete();
        }
      };
      requestAnimationFrame(step);
    },

    updateButtonUI() {
      const btn = document.getElementById("btn-audio-toggle");
      if (btn) {
        const titleText = this.isMuted ? "Nyalakan Musik" : "Matikan Musik";
        btn.textContent = this.isMuted ? "🔇" : "🔊";
        btn.title = titleText;
        btn.setAttribute("aria-label", titleText);
      }
    }
  };

  /**
   * DOM Ready Initialization
   */
  document.addEventListener("DOMContentLoaded", () => {
    viewRoot = document.getElementById("view-root");
    soundManager.init();
    initSupabase();
    setupHistoryControl();
    renderLanding();
  });

  /**
   * History Control (Mencegah browser back kembali ke soal sebelumnya)
   */
  function setupHistoryControl() {
    window.history.pushState({ screen: "start" }, document.title, window.location.href);

    window.addEventListener("popstate", () => {
      window.history.pushState(null, document.title, window.location.href);
      if (state.currentScreen === "quiz") {
        console.warn("Navigasi mundur tidak diizinkan selama kuis berlangsung.");
      }
    });
  }

  /**
   * Helper: Render Mascot & HD Surrounding Doodles
   */
  function getMascotSectionHTML(showSurrounding = true, customSrc = null, customAlt = null) {
    const defaultMascot = (window.themeConfig && window.themeConfig.mascot) ? window.themeConfig.mascot : "mascot.png";
    const mascotSrc = customSrc || defaultMascot;
    const mascotAlt = customAlt || ((window.themeConfig && window.themeConfig.mascotAlt) ? window.themeConfig.mascotAlt : "Mascot Willy");

    return `
      <div class="mascot-wrapper" aria-hidden="true">
        ${
          showSurrounding
            ? `
          <div class="surrounding-doodles">
            <div class="doodle-item doodle-book-left">
              <img src="assets/doodle_book_purple.png" class="doodle-img-sticker" style="height: 38px;" alt="" />
              <span class="doodle-text ready-left">Ready?</span>
            </div>
            <div class="doodle-item doodle-cloud-right">
              <img src="assets/card_badge_cloud.png" class="doodle-img-sticker" style="height: 32px;" alt="" />
              <span class="doodle-text goodluck-right">Good Luck</span>
            </div>
            <div class="doodle-item doodle-pencil-left">
              <img src="assets/doodle_pencil_yellow.png" class="doodle-img-sticker" style="height: 36px;" alt="" />
            </div>
            <div class="doodle-item doodle-book-right">
              <img src="assets/doodle_book_blue.png" class="doodle-img-sticker" style="height: 38px;" alt="" />
            </div>
          </div>
          `
            : ""
        }

        <div class="mascot-bubble">
          <img 
            id="quiz-mascot"
            class="mascot-img" 
            src="${mascotSrc}" 
            alt="${mascotAlt}"
            onerror="this.onerror=null; this.src='assets/pfp-eyes.png';"
          />
        </div>
      </div>
    `;
  }

  /**
   * Helper: Render Corner Badges for Mint Cards (Cube, Cloud, Triangle)
   */
  function getCardCornerBadgesHTML() {
    return `
      <img src="assets/card_badge_cube.png" class="card-corner-badge badge-cube-tl" alt="" onerror="this.style.display='none'">
      <img src="assets/card_badge_cloud.png" class="card-corner-badge badge-cloud-tr" alt="" onerror="this.style.display='none'">
      <img src="assets/card_badge_triangle.png" class="card-corner-badge badge-tri-br" alt="" onerror="this.style.display='none'">
    `;
  }

  /**
   * Helper: Update Top Header (Show Admin button strictly on Landing page, Audio toggle always)
   */
  function updateHeader(showAdmin = false) {
    const headerEl = document.querySelector(".app-header");
    if (!headerEl) return;

    const audioIcon = soundManager.isMuted ? "🔇" : "🔊";
    const audioTitle = soundManager.isMuted ? "Nyalakan Musik" : "Matikan Musik";

    headerEl.innerHTML = `
      <button type="button" id="btn-audio-toggle" class="audio-toggle-btn" aria-label="${audioTitle}" title="${audioTitle}">
        ${audioIcon}
      </button>
      <div class="top-banner-logo">
        <span class="banner-star" aria-hidden="true">✦</span>
        <span class="banner-text-answer">answer</span>
        <span class="banner-text-willy">Willy</span>
      </div>
      ${
        showAdmin
          ? `<button type="button" id="btn-admin-open" class="admin-trigger-btn" aria-label="Akses Admin" title="Admin Leaderboard">🔒 Admin</button>`
          : ""
      }
    `;

    const audioBtn = document.getElementById("btn-audio-toggle");
    if (audioBtn) {
      audioBtn.addEventListener("click", () => {
        soundManager.toggleMute();
      });
    }

    if (showAdmin) {
      const adminBtn = document.getElementById("btn-admin-open");
      if (adminBtn) {
        adminBtn.addEventListener("click", showAdminLoginModal);
      }
    }
  }

  /**
   * Admin Login Modal with Keycode Verification ('willy123')
   */
  function showAdminLoginModal() {
    const existingModal = document.getElementById("admin-modal-container");
    if (existingModal) existingModal.remove();

    const modalHTML = `
      <div id="admin-modal-container" class="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <div class="admin-modal-card">
          <h3 id="admin-modal-title" class="admin-modal-title">🔒 Admin Access</h3>
          <p class="admin-modal-desc">Masukkan keycode untuk membuka Leaderboard</p>
          <div id="admin-error-box" class="admin-error-text"></div>
          <form id="admin-login-form" onsubmit="return false;">
            <input 
              type="password" 
              id="admin-key-input" 
              class="pill-input" 
              placeholder="Masukkan keycode..." 
              autocomplete="current-password"
              required 
            />
            <div class="admin-modal-btns">
              <button type="button" id="btn-admin-cancel" class="btn-admin-cancel">Batal</button>
              <button type="submit" id="btn-admin-submit" class="btn-admin-submit">Masuk ➔</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("admin-modal-container");
    const input = document.getElementById("admin-key-input");
    const errorBox = document.getElementById("admin-error-box");
    const cancelBtn = document.getElementById("btn-admin-cancel");
    const form = document.getElementById("admin-login-form");

    setTimeout(() => {
      if (input) input.focus();
    }, 150);

    function closeModal() {
      if (modal) modal.remove();
    }

    cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (val === "willy123") {
        closeModal();
        renderAdminLeaderboard();
      } else {
        errorBox.textContent = "Keycode salah! Coba lagi.";
        errorBox.style.display = "block";
        input.value = "";
        input.focus();
      }
    });
  }

  // =========================================================================
  // 1. SCREEN: LANDING (Name Entry)
  // =========================================================================
  function renderLanding() {
    state.currentScreen = "landing";
    document.body.className = ""; // Reset dark / glitch themes to default
    soundManager.play("normal");
    updateHeader(true);

    viewRoot.innerHTML = `
      <section class="view-screen" id="screen-landing">
        ${getMascotSectionHTML(true)}

        <!-- Hero Title -->
        <div class="hero-title-box">
          <h1 class="hero-main-title">
            <span class="title-outline">answer</span>
            <span class="title-solid">Willy</span>
          </h1>
          <p class="hero-subtext">${escapeHTML(quizConfig.subtitle)}</p>
        </div>

        <!-- Mint Card with Form & Corner Badges -->
        <div class="mint-card">
          ${getCardCornerBadgesHTML()}

          <div class="card-content-inner">
            <form id="name-form" onsubmit="return false;">
              <label for="user-name-input" class="field-label">What's your name?</label>
              <input 
                type="text" 
                id="user-name-input" 
                class="pill-input" 
                placeholder="Enter your name..." 
                maxlength="30"
                autocomplete="off"
                autocapitalize="words"
                required
              />
              <p class="field-subtext">Ketikkan namamu untuk memulai kuis.</p>

              <button type="submit" id="btn-name-continue" class="btn-rainbow" disabled>
                Continue ➔
              </button>
            </form>
          </div>
        </div>

        <!-- Bottom Doodles Row (All Clean HD Assets) -->
        <div class="bottom-doodles-wrapper" aria-hidden="true">
          <div class="bottom-doodle-item">
            <span class="doodle-text">Ready?</span>
            <img src="assets/sticker_cloud_question.png" class="bottom-doodle-icon" style="height: 30px;" alt="" />
          </div>
          <div class="bottom-doodle-item">
            <img src="assets/doodle_paw_purple.png" class="bottom-doodle-icon" style="height: 28px;" alt="" />
          </div>
          <div class="bottom-doodle-item">
            <img src="assets/doodle_pencil_pink.png" class="bottom-doodle-icon" style="height: 32px;" alt="" />
          </div>
          <div class="bottom-doodle-item">
            <img src="assets/doodle_paw_pink.png" class="bottom-doodle-icon" style="height: 28px;" alt="" />
          </div>
          <div class="bottom-doodle-item">
            <span class="doodle-text">Good Luck!</span>
            <img src="assets/doodle_book_bottom.png" class="bottom-doodle-icon" style="height: 26px;" alt="" />
          </div>
        </div>
      </section>
    `;

    const nameInput = document.getElementById("user-name-input");
    const continueBtn = document.getElementById("btn-name-continue");
    const nameForm = document.getElementById("name-form");

    setTimeout(() => nameInput.focus(), 250);

    nameInput.addEventListener("input", () => {
      const trimmed = nameInput.value.trim();
      continueBtn.disabled = trimmed.length === 0;
    });

    nameForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleNameSubmit();
    });

    continueBtn.addEventListener("click", () => {
      handleNameSubmit();
    });

    function handleNameSubmit() {
      const rawName = nameInput.value.trim();
      if (!rawName) return;
      state.userName = rawName;
      renderGate();
    }
  }

  // =========================================================================
  // 2. SCREEN: INTRODUCTION / GATE PAGE (Same Mint Theme)
  // =========================================================================
  function renderGate() {
    state.currentScreen = "gate";
    updateHeader(false);

    viewRoot.innerHTML = `
      <section class="view-screen" id="screen-gate">
        ${getMascotSectionHTML(false)}

        <!-- Mint Card Gate -->
        <div class="mint-card">
          ${getCardCornerBadgesHTML()}

          <div class="card-content-inner gate-box">
            <div class="gate-badge-pill">
              <span>✨</span> Welcome, ${escapeHTML(state.userName)}
            </div>

            <h2 class="gate-title-text">${escapeHTML(quizConfig.gate.title)}</h2>
            <p class="gate-rules-text">${escapeHTML(quizConfig.gate.subtext)}</p>
            <p class="gate-subtext-playful">${escapeHTML(quizConfig.gate.playfulText)}</p>

            <button id="btn-gate-start" class="btn-rainbow">
              ${escapeHTML(quizConfig.gate.buttonText)} ➔
            </button>
          </div>
        </div>
      </section>
    `;

    const startBtn = document.getElementById("btn-gate-start");
    startBtn.addEventListener("click", () => {
      startQuiz();
    });
  }

  // =========================================================================
  // 3. START QUIZ
  // =========================================================================
  function startQuiz() {
    state.currentQuestionIndex = 0;
    state.selectedOptionIndex = null;
    state.answers = [];
    state.startTime = Date.now();
    renderQuestion();
  }

  // =========================================================================
  // 4. SCREEN: QUIZ QUESTION (1 by 1)
  // =========================================================================
  function renderQuestion() {
    state.currentScreen = "quiz";
    updateHeader(false);
    state.selectedOptionIndex = null;
    state.isSubmitting = false;

    const qIndex = state.currentQuestionIndex;
    const totalQ = quizConfig.questions.length;
    const qData = quizConfig.questions[qIndex];

    const currentQFormatted = String(qIndex + 1).padStart(2, "0");
    const totalQFormatted = String(totalQ).padStart(2, "0");
    const progressPercent = ((qIndex + 1) / totalQ) * 100;

    // 10 Options HTML
    const optionsHTML = qData.options
      .map((opt, idx) => {
        return `
          <button 
            type="button" 
            class="option-card-btn" 
            data-index="${idx}"
            aria-label="Pilihan ${idx + 1}: ${escapeHTML(opt.text)}"
          >
            <div class="option-circle" aria-hidden="true">
              <div class="option-circle-dot"></div>
            </div>
            <span class="option-text-content">${escapeHTML(opt.text)}</span>
          </button>
        `;
      })
      .join("");

    viewRoot.innerHTML = `
      <section class="view-screen" id="screen-quiz">
        <!-- Progress Bar & Labels -->
        <div class="quiz-progress-section">
          <div class="quiz-progress-labels">
            <span class="q-counter-badge">Question ${currentQFormatted} / ${totalQFormatted}</span>
            <span class="player-name-badge">${escapeHTML(state.userName)}</span>
          </div>
          <div class="rainbow-progress-track" aria-hidden="true">
            <div class="rainbow-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Question Mint Card with Corner Badges -->
        <div class="mint-card">
          ${getCardCornerBadgesHTML()}
          <div class="card-content-inner">
            <h2 class="question-heading">${escapeHTML(qData.question)}</h2>
          </div>
        </div>

        <!-- 10 Options Stack -->
        <div class="quiz-options-container" id="options-container" role="radiogroup" aria-label="Pilihan Jawaban">
          ${optionsHTML}
        </div>

        <!-- Sticky Footer with Next Button -->
        <div class="quiz-sticky-footer">
          <button id="btn-next-question" class="btn-rainbow" disabled>
            ${qIndex === totalQ - 1 ? "Selesaikan Quiz ➔" : "Lanjut ➔"}
          </button>
        </div>
      </section>
    `;

    // Listeners for Options
    const optionButtons = document.querySelectorAll(".option-card-btn");
    optionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedIdx = parseInt(btn.getAttribute("data-index"), 10);
        selectAnswer(selectedIdx);
      });
    });

    // Listener for Next Button
    const nextBtn = document.getElementById("btn-next-question");
    nextBtn.addEventListener("click", () => {
      submitAnswer();
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectAnswer(optionIndex) {
    if (state.isSubmitting) return;

    state.selectedOptionIndex = optionIndex;
    const optionButtons = document.querySelectorAll(".option-card-btn");

    optionButtons.forEach((btn, idx) => {
      if (idx === optionIndex) {
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
      } else {
        btn.classList.remove("selected");
        btn.setAttribute("aria-checked", "false");
      }
    });

    const nextBtn = document.getElementById("btn-next-question");
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  function submitAnswer() {
    if (state.selectedOptionIndex === null || state.isSubmitting) return;
    state.isSubmitting = true;

    const qIndex = state.currentQuestionIndex;
    const qData = quizConfig.questions[qIndex];
    const chosenOption = qData.options[state.selectedOptionIndex];

    state.answers.push({
      questionId: qData.id,
      selectedIndex: state.selectedOptionIndex,
      score: chosenOption.score
    });

    if (state.currentQuestionIndex + 1 < quizConfig.questions.length) {
      state.currentQuestionIndex++;
      renderQuestion();
    } else {
      state.endTime = Date.now();
      showDramaticPauseThenResult();
    }
  }

  // =========================================================================
  // 5. DRAMATIC PAUSE
  // =========================================================================
  function showDramaticPauseThenResult() {
    state.currentScreen = "pause";
    updateHeader(false);

    viewRoot.innerHTML = `
      <section class="view-screen pause-center-box" id="screen-pause">
        <div class="rainbow-spinner" aria-hidden="true"></div>
        <h2 class="pause-main-title">Menganalisis Jawaban...</h2>
        <p class="pause-sub-desc">Menyelaraskan frekuensi pemikiranmu dengan Willy...</p>
      </section>
    `;

    const pauseMs = (quizConfig.settings && quizConfig.settings.dramaticPauseMs) || 1400;

    setTimeout(() => {
      showResult();
    }, pauseMs);
  }

  function calculateScore() {
    return state.answers.reduce((acc, curr) => acc + (curr.score || 0), 0);
  }

  function getScoreTier(totalScore) {
    const tiers = quizConfig.scoreTiers;
    for (const tier of tiers) {
      if (totalScore >= tier.min && totalScore <= tier.max) {
        return tier;
      }
    }
    return tiers[tiers.length - 1];
  }

  // =========================================================================
  // 6. SCREEN: RESULT & REVEAL (Consistent Mint Theme)
  // =========================================================================
  function showResult() {
    state.currentScreen = "result";
    updateHeader(false);

    const totalScore = calculateScore();
    const tier = getScoreTier(totalScore);
    
    // Terapkan class tema ke body (misal: 'theme-terrifying' jika skor < 250)
    document.body.className = tier.theme || "";

    // Backsound management: creepy jika skor < 250, normal jika >= 250
    if (totalScore < 250) {
      soundManager.play("creepy");
    } else {
      soundManager.play("normal");
    }

    const durationMs = (state.endTime && state.startTime) ? (state.endTime - state.startTime) : 0;

    const saveResult = saveLeaderboard({
      name: state.userName,
      score: totalScore,
      durationMs: durationMs,
      completedAt: new Date().toISOString()
    });

    // Khusus skor < 250: ganti foto rubah dengan pfp-eye di assets
    const mascotImgSrc = totalScore < 250 ? "assets/pfp-eye.png" : (tier.mascot || null);
    const mascotImgAlt = totalScore < 250 ? "The Eye" : null;

    viewRoot.innerHTML = `
      <section class="view-screen" id="screen-result">
        ${getMascotSectionHTML(false, mascotImgSrc, mascotImgAlt)}

        <!-- Mint Result Card -->
        <div class="mint-card">
          ${getCardCornerBadgesHTML()}

          <div class="card-content-inner result-box-card">
            <div class="tier-badge-pill">
              ${escapeHTML(tier.badge || "✦")}
            </div>

            <p class="result-for-user">Hasil Quiz untuk <strong>${escapeHTML(state.userName)}</strong></p>

            <div class="score-hero-container">
              <span id="score-counter" class="score-huge-number">0</span>
              <span class="score-max-unit">/ 1000</span>
            </div>

            <h2 class="tier-headline">${escapeHTML(tier.title)}</h2>
            <p class="tier-body-text">${escapeHTML(tier.description)}</p>

            ${
              !saveResult.isFirstAttempt
                ? `<div class="retake-info-box">
                    ✨ Catatan: Ini adalah re-take quiz. Skor pertamamu (<strong>${saveResult.existingScore} pts</strong>) tetap tercatat di Leaderboard.
                  </div>`
                : ""
            }
          </div>
        </div>

        <!-- Leaderboard Section -->
        <div class="leaderboard-wrapper" id="leaderboard-container">
          <!-- Rendered via renderLeaderboard() -->
        </div>

        <!-- Play Again Button -->
        <div style="margin-bottom: 20px;">
          <button id="btn-retake" class="btn-rainbow">
            Mainkan Lagi ↺
          </button>
        </div>
      </section>
    `;

    animateScoreCountUp(totalScore);
    renderLeaderboard();

    const retakeBtn = document.getElementById("btn-retake");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        restartQuiz();
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function animateScoreCountUp(finalScore) {
    const counterEl = document.getElementById("score-counter");
    if (!counterEl) return;

    const duration = (quizConfig.settings && quizConfig.settings.scoreCountUpDurationMs) || 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeOut * finalScore);

      counterEl.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counterEl.textContent = finalScore;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // =========================================================================
  // 7. LEADERBOARD SYSTEM (Supabase Cloud + localStorage Hybrid)
  // =========================================================================
  let supabaseClient = null;

  function initSupabase() {
    if (window.supabase && quizConfig.supabase && quizConfig.supabase.url && quizConfig.supabase.anonKey) {
      try {
        supabaseClient = window.supabase.createClient(quizConfig.supabase.url, quizConfig.supabase.anonKey);
        console.log("[Supabase] Terhubung ke Supabase:", quizConfig.supabase.url);
      } catch (err) {
        console.warn("[Supabase] Inisialisasi gagal:", err);
      }
    }
  }

  async function fetchLeaderboardFromSupabase() {
    if (!supabaseClient) return null;
    const table = (quizConfig.supabase && quizConfig.supabase.tableName) || "leaderboard";
    try {
      const { data, error } = await supabaseClient
        .from(table)
        .select("name, score, duration_ms, completed_at")
        .order("score", { ascending: false })
        .order("duration_ms", { ascending: true })
        .limit(100);

      if (error) {
        console.warn("[Supabase] Fetch error:", error.message);
        return null;
      }

      if (Array.isArray(data)) {
        return data.map((row) => ({
          name: row.name,
          score: row.score,
          durationMs: row.duration_ms || 0,
          completedAt: row.completed_at
        }));
      }
      return null;
    } catch (e) {
      console.warn("[Supabase] Network/fetch error:", e);
      return null;
    }
  }

  async function saveScoreToSupabase(entry) {
    if (!supabaseClient) return false;
    const table = (quizConfig.supabase && quizConfig.supabase.tableName) || "leaderboard";
    try {
      const { error } = await supabaseClient
        .from(table)
        .insert([
          {
            name: entry.name.trim(),
            score: entry.score,
            duration_ms: entry.durationMs || 0,
            completed_at: entry.completedAt || new Date().toISOString()
          }
        ]);

      if (error) {
        console.warn("[Supabase] Gagal menyimpan ke cloud:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("[Supabase] Error simpan cloud:", e);
      return false;
    }
  }

  function normalizeName(name) {
    return (name || "").trim().toLowerCase();
  }

  function formatDate(isoString) {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return "";
    }
  }

  function loadLeaderboard() {
    const storageKey = (quizConfig.settings && quizConfig.settings.localStorageKey) || "answerWillyLeaderboard";
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Gagal membaca leaderboard:", e);
      return [];
    }
  }

  function saveLeaderboard(entry) {
    const storageKey = (quizConfig.settings && quizConfig.settings.localStorageKey) || "answerWillyLeaderboard";
    const list = loadLeaderboard();
    const normalizedNew = normalizeName(entry.name);

    const existing = list.find((item) => normalizeName(item.name) === normalizedNew);

    if (existing) {
      return {
        isFirstAttempt: false,
        existingScore: existing.score
      };
    }

    const newRecord = {
      name: entry.name.trim(),
      score: entry.score,
      durationMs: entry.durationMs || 0,
      completedAt: entry.completedAt
    };

    list.push(newRecord);

    try {
      localStorage.setItem(storageKey, JSON.stringify(list));
    } catch (e) {
      console.error("Gagal menyimpan leaderboard lokal:", e);
    }

    // Simpan ke Supabase di latar belakang
    saveScoreToSupabase(newRecord).then((success) => {
      if (success) {
        console.log("[Supabase] Skor baru tersimpan di cloud database!");
      }
    });

    return {
      isFirstAttempt: true,
      existingScore: entry.score
    };
  }

  async function renderLeaderboard() {
    const container = document.getElementById("leaderboard-container");
    if (!container) return;

    // 1. Tampilkan cache lokal terlebih dahulu (respons instan)
    const localList = loadLeaderboard();
    displayLeaderboardUI(container, localList);

    // 2. Ambil data cloud global terbaru dari Supabase
    if (supabaseClient) {
      const cloudList = await fetchLeaderboardFromSupabase();
      if (cloudList && Array.isArray(cloudList) && container.isConnected) {
        const storageKey = (quizConfig.settings && quizConfig.settings.localStorageKey) || "answerWillyLeaderboard";
        try {
          localStorage.setItem(storageKey, JSON.stringify(cloudList));
        } catch (e) {}

        displayLeaderboardUI(container, cloudList);
      }
    }
  }

  function displayLeaderboardUI(container, list) {
    if (!container) return;
    const currentNormalized = normalizeName(state.userName);

    const sortedList = [...list].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (a.durationMs || 9999999) - (b.durationMs || 9999999);
    });

    let itemsHTML = "";

    if (sortedList.length === 0) {
      itemsHTML = `<div class="lb-empty-msg">Belum ada peserta di leaderboard. Jadilah yang pertama!</div>`;
    } else {
      itemsHTML = sortedList
        .map((item, idx) => {
          const rank = idx + 1;
          const isCurrentUser = currentNormalized !== "" && normalizeName(item.name) === currentNormalized;

          let rankBadge = `${rank}.`;
          if (rank === 1) rankBadge = "🥇";
          else if (rank === 2) rankBadge = "🥈";
          else if (rank === 3) rankBadge = "🥉";

          return `
            <div class="leaderboard-row-item ${isCurrentUser ? "highlight-me" : ""}">
              <div class="lb-left-side">
                <span class="lb-medal">${rankBadge}</span>
                <div class="lb-player-col">
                  <span class="lb-player-name">
                    ${escapeHTML(item.name)}
                    ${isCurrentUser ? `<span class="lb-you-tag">YOU</span>` : ""}
                  </span>
                  <span class="lb-timestamp">${formatDate(item.completedAt)}</span>
                </div>
              </div>
              <div class="lb-score-col">
                <span class="lb-score-val">${item.score}</span>
                <span class="lb-score-pts">pts</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    container.innerHTML = `
      <div class="mint-card">
        ${getCardCornerBadgesHTML()}
        <div class="card-content-inner">
          <div class="leaderboard-title-row">
            <h3 class="leaderboard-title-text">
              <span>🏆</span> Leaderboard
            </h3>
            <span class="leaderboard-pill-count">${sortedList.length} Peserta</span>
          </div>
          <div class="leaderboard-rows">
            ${itemsHTML}
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 8. SCREEN: ADMIN LEADERBOARD
  // =========================================================================
  function renderAdminLeaderboard() {
    state.currentScreen = "admin-leaderboard";
    document.body.className = ""; // Reset dark / glitch theme
    soundManager.play("normal");
    updateHeader(false);

    viewRoot.innerHTML = `
      <section class="view-screen" id="screen-admin-leaderboard">
        <div class="admin-toolbar-row">
          <div class="admin-badge-tag">
            <span>👑</span> Mode Admin
          </div>
          <button type="button" id="btn-admin-logout" class="btn-admin-logout" aria-label="Logout Admin">
            Logout ➔
          </button>
        </div>

        <!-- Leaderboard Mount Point -->
        <div class="leaderboard-wrapper" id="leaderboard-container">
          <!-- Rendered via renderLeaderboard() -->
        </div>

        <!-- Admin Reset Action -->
        <div style="margin-top: 10px; margin-bottom: 24px;">
          <button type="button" id="btn-admin-reset-data" class="btn-admin-reset-data">
            🗑️ Reset Semua Data Leaderboard
          </button>
        </div>
      </section>
    `;

    renderLeaderboard();

    const logoutBtn = document.getElementById("btn-admin-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        renderLanding();
      });
    }

    const resetBtn = document.getElementById("btn-admin-reset-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const confirmReset = window.confirm("Apakah kamu yakin ingin mereset seluruh data leaderboard? Tindakan ini tidak dapat dibatalkan.");
        if (confirmReset) {
          window.resetLeaderboard();
          renderLeaderboard();
        }
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restartQuiz() {
    soundManager.play("normal");
    renderLanding();
  }

  function escapeHTML(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Development helper & Admin reset
  window.resetLeaderboard = async function () {
    const storageKey = (quizConfig.settings && quizConfig.settings.localStorageKey) || "answerWillyLeaderboard";
    localStorage.removeItem(storageKey);
    console.log(`[Leaderboard] Local cache '${storageKey}' berhasil direset.`);

    if (supabaseClient) {
      const table = (quizConfig.supabase && quizConfig.supabase.tableName) || "leaderboard";
      try {
        const { error } = await supabaseClient.from(table).delete().gte("score", 0);
        if (error) {
          console.warn("[Supabase] Gagal mereset database cloud:", error.message);
        } else {
          console.log("[Supabase] Seluruh data leaderboard di cloud berhasil dibersihkan.");
        }
      } catch (e) {
        console.warn("[Supabase] Error saat reset cloud:", e);
      }
    }

    renderLeaderboard();
  };

  // Expose to window
  window.answerWillyApp = {
    state,
    soundManager,
    renderLanding,
    renderGate,
    renderQuestion,
    selectAnswer,
    submitAnswer,
    calculateScore,
    showResult,
    getScoreTier,
    saveLeaderboard,
    loadLeaderboard,
    renderLeaderboard,
    renderAdminLeaderboard,
    showAdminLoginModal,
    resetLeaderboard: window.resetLeaderboard
  };
})();
