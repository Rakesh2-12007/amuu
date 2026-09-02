/* =================================================================
   💖 ROMANTIC WEBSITE INTERACTIVE SCRIPT 💖
   ================================================================= */

// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
  // Main State Management
  const state = {
    config: window.romanticConfig || {},
    currentPage: "landing",
    audio: {
      isPlaying: false,
      ctx: null,
      synthInterval: null,
      customAudio: null,
      chordIndex: 0,
      noteIndex: 0
    },
    canvas: {
      el: null,
      ctx: null,
      particles: [],
      animationFrame: null
    },
    envelope: {
      isOpen: false,
      isExpanded: false,
      typingTimer: null
    },
    games: {
      completed: new Set(),
      // Game 1: Catch Hearts
      catchHearts: {
        score: 0,
        timeLeft: 0,
        interval: null,
        hearts: [],
        canvas: null,
        ctx: null,
        animationFrame: null,
        isActive: false
      },
      // Game 2: Memory
      memory: {
        cards: [],
        flippedCards: [],
        moves: 0,
        matchedCount: 0,
        lockBoard: false
      },
      // Game 3: Escape Heart
      escape: {
        score: 0,
        speed: 8
      },
      // Game 4: Puzzle
      puzzle: {
        grid: [1, 2, 3, 4, 5, 6, 7, 8, 0], // 0 is empty
        tiles: []
      }
    },
    quiz: {
      currentIndex: 0,
      score: 0
    },
    surprise: {
      stage: 0,
      isExploding: false
    },
    secretRoomUnlocked: false,
    chat: {
      currentUser: localStorage.getItem("romantic_chat_user") || null,
      messages: [],
      eventSource: null
    },
    easterEggs: {
      starClicks: 0,
      keySequence: ""
    }
  };

  // Safe helper to fetch config keys
  function getConfigValue(path, fallback) {
    let current = state.config;
    for (const key of path) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return fallback;
      }
    }
    return current;
  }

  /* =================================================================
     🎹 AUDIO & SYNTHESIZER SYSTEM 🎹
     ================================================================= */
  
  // Romantic Chord Progression (Warm Rhodes-like Piano synthesized in C Major keys)
  // Fmaj7 -> Cmaj7 -> G6 -> Am
  const synthChords = [
    [174.61, 220.00, 261.63, 329.63], // F3, A3, C4, E4 (Fmaj7)
    [130.81, 196.00, 261.63, 329.63], // C3, G3, C4, E4 (Cmaj7)
    [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4 (G6)
    [220.00, 261.63, 329.63, 440.00]  // A3, C4, E4, A4 (Am)
  ];

  function initAudio() {
    if (state.audio.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      state.audio.ctx = new AudioContextClass();
    }
  }

  function playPianoNote(frequency, duration, time) {
    if (!state.audio.ctx || state.audio.ctx.state === 'suspended') return;
    
    const ctx = state.audio.ctx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    // Triangle wave gives a soft flute/bell-like sound
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, time);

    // Warm low-pass filter to sound like an electric piano (Rhodes)
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(800, time);
    filterNode.Q.setValueAtTime(1.2, time);

    // Fade envelope: Quick attack, long linear release
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.18, time + 0.05); // volume peak
    gainNode.gain.setValueAtTime(0.18, time + duration - 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration); // decay

    // Connections
    osc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Plays note-by-note loop
  function startSynthLoop() {
    if (!state.audio.ctx) return;
    if (state.audio.synthInterval) clearInterval(state.audio.synthInterval);
    
    let step = 0;
    const tempo = 450; // ms per note

    state.audio.synthInterval = setInterval(() => {
      if (!state.audio.isPlaying) return;
      
      const chordIndex = Math.floor(step / 4) % synthChords.length;
      const noteInChord = step % 4;
      const frequency = synthChords[chordIndex][noteInChord];
      
      // Schedule note instantly in web audio context
      const time = state.audio.ctx.currentTime;
      playPianoNote(frequency, 1.2, time);
      
      step++;
    }, tempo);
  }

  function toggleAudio(forceMute = null) {
    initAudio();
    
    const audioBtn = document.getElementById("audio-toggle");
    const audioIcon = audioBtn?.querySelector("span");
    
    if (state.audio.ctx && state.audio.ctx.state === 'suspended') {
      state.audio.ctx.resume();
    }

    let shouldPlay = !state.audio.isPlaying;
    if (forceMute !== null) shouldPlay = !forceMute;

    if (shouldPlay) {
      state.audio.isPlaying = true;
      if (audioIcon) audioIcon.textContent = "🔊";
      if (audioBtn) audioBtn.classList.remove("opacity-50");
      
      // Start ambient synth progression
      startSynthLoop();
    } else {
      state.audio.isPlaying = false;
      if (audioIcon) audioIcon.textContent = "🔇";
      if (audioBtn) audioBtn.classList.add("opacity-50");
      
      if (state.audio.synthInterval) {
        clearInterval(state.audio.synthInterval);
        state.audio.synthInterval = null;
      }
    }
  }

  // Play custom tick sound for typing
  function playTickSound() {
    if (!state.audio.isPlaying || !state.audio.ctx) return;
    const ctx = state.audio.ctx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // Setup floating audio toggle
  const audioBtn = document.getElementById("audio-toggle");
  audioBtn?.addEventListener("click", () => toggleAudio());

  /* =================================================================
     ❤️ BACKGROUND CANVAS HEART PARTICLES ❤️
     ================================================================= */
  
  function initBackgroundCanvas() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    
    state.canvas.el = canvas;
    state.canvas.ctx = canvas.getContext("2d");
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Spawn initial particles
    const particleCount = window.innerWidth < 768 ? 20 : 45;
    for (let i = 0; i < particleCount; i++) {
      state.canvas.particles.push(createParticle(true));
    }
    
    animateParticles();
  }

  function resizeCanvas() {
    if (state.canvas.el) {
      state.canvas.el.width = window.innerWidth;
      state.canvas.el.height = window.innerHeight;
    }
  }

  function createParticle(randomY = false) {
    const size = Math.random() * 15 + 8;
    return {
      x: Math.random() * window.innerWidth,
      y: randomY ? Math.random() * window.innerHeight : window.innerHeight + size * 2,
      size: size,
      speedY: Math.random() * 0.35 + 0.12,
      swaySpeed: Math.random() * 0.01 + 0.003,
      swayOffset: Math.random() * Math.PI * 2,
      swayRadius: Math.random() * 15 + 5,
      opacity: Math.random() * 0.5 + 0.2,
      type: Math.random() > 0.4 ? "heart" : "sparkle",
      color: Math.random() > 0.5 ? "rgba(244, 114, 182, " : "rgba(192, 132, 252, "
    };
  }

  function drawHeart(ctx, x, y, size, fillStyle) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    
    // Draw heart path
    ctx.moveTo(0, -size / 4);
    ctx.bezierCurveTo(-size / 2, -size, -size, -size / 3, -size, size / 6);
    ctx.bezierCurveTo(-size, size / 1.5, -size / 5, size, 0, size * 1.25);
    ctx.bezierCurveTo(size / 5, size, size, size / 1.5, size, size / 6);
    ctx.bezierCurveTo(size, -size / 3, size / 2, -size, 0, -size / 4);
    
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(ctx, x, y, size, fillStyle) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  }

  function animateParticles() {
    const { el, ctx, particles } = state.canvas;
    if (!el) return;

    ctx.clearRect(0, 0, el.width, el.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speedY;
      p.swayOffset += p.swaySpeed;
      const currentX = p.x + Math.sin(p.swayOffset) * p.swayRadius;

      // Draw particle
      const fillStyle = p.color + p.opacity + ")";
      if (p.type === "heart") {
        drawHeart(ctx, currentX, p.y, p.size, fillStyle);
      } else {
        drawSparkle(ctx, currentX, p.y, p.size / 1.5, fillStyle);
      }

      // Recycle particles that move off-screen
      if (p.y < -p.size * 2) {
        particles[i] = createParticle(false);
      }
    }

    state.canvas.animationFrame = requestAnimationFrame(animateParticles);
  }

  /* =================================================================
     🗺️ ROUTING & SECTION NAVIGATION 🗺️
     ================================================================= */
  
  function showSection(sectionId) {
    const currentSection = document.getElementById(`section-${state.currentPage}`);
    const nextSection = document.getElementById(`section-${sectionId}`);
    
    if (nextSection) {
      // Clean up active games if switching away
      if (state.currentPage === "games" && sectionId !== "games") {
        stopCatchHeartsGame();
      }

      // Hide current
      if (currentSection) {
        currentSection.classList.add("hidden");
        currentSection.classList.remove("opacity-100", "scale-100");
      }

      // Show next
      nextSection.classList.remove("hidden");
      setTimeout(() => {
        nextSection.classList.add("opacity-100", "scale-100");
        nextSection.classList.remove("opacity-0", "scale-95");
      }, 50);

      state.currentPage = sectionId;

      // Special transitions or setups per section
      if (sectionId === "timeline") {
        initTimeline();
      } else if (sectionId === "secret") {
        resetSecretRoom();
      } else if (sectionId === "chat") {
        initChatRoom();
      } else if (sectionId === "games") {
        initGamesArcade();
      } else if (sectionId === "quiz") {
        resetQuiz();
      } else if (sectionId === "midnight") {
        initMidnightCorner();
      } else if (sectionId === "surprise") {
        resetSurprise();
      }

      // Update Navigation styling
      document.querySelectorAll("[data-nav-target]").forEach(btn => {
        const target = btn.getAttribute("data-nav-target");
        if (target === sectionId) {
          btn.classList.add("text-pink-600", "font-bold", "scale-105");
          btn.classList.remove("text-gray-500");
          try {
            btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          } catch (err) {}
        } else {
          btn.classList.remove("text-pink-600", "font-bold", "scale-105");
          btn.classList.add("text-gray-500");
        }
      });

      // Scroll to top of window page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Initialize Routing Buttons
  document.querySelectorAll("[data-nav-target]").forEach(button => {
    button.addEventListener("click", (e) => {
      const target = button.getAttribute("data-nav-target");
      showSection(target);
    });
  });

  // Enter Little World CTA
  const enterBtn = document.getElementById("enter-world-btn");
  enterBtn?.addEventListener("click", () => {
    // Start canvas particle background
    initBackgroundCanvas();
    
    // Attempt audio unlock
    toggleAudio(false); // Play audio if allowed by browser

    // Transition elements
    const introScreen = document.getElementById("section-landing");
    const mainApp = document.getElementById("main-app");
    const floatingNav = document.getElementById("floating-nav");

    introScreen.classList.add("opacity-0", "scale-110");
    setTimeout(() => {
      introScreen.classList.add("hidden");
      mainApp.classList.remove("hidden");
      floatingNav.classList.remove("hidden");
      setTimeout(() => {
        mainApp.classList.add("opacity-100");
        floatingNav.classList.add("opacity-100");
        showSection("message");
      }, 50);
    }, 500);
  });

  /* =================================================================
     💌 A LITTLE MESSAGE (DIGITAL LETTER) 💌
     ================================================================= */
  
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const envelopeLetter = document.getElementById("envelope-letter");
  const readAgainBtn = document.getElementById("read-again-btn");
  
  envelopeWrapper?.addEventListener("click", (e) => {
    if (!state.envelope.isOpen) {
      e.stopPropagation();
      state.envelope.isOpen = true;
      envelopeWrapper.classList.add("open");
      
      // Wait for flap opening animation before popping out card
      setTimeout(() => {
        envelopeLetter.classList.add("scale-105");
      }, 600);
    }
  });

  envelopeLetter?.addEventListener("click", (e) => {
    if (state.envelope.isOpen && !state.envelope.isExpanded) {
      e.stopPropagation();
      state.envelope.isExpanded = true;
      envelopeLetter.classList.add("expanded");
      document.body.style.overflow = "hidden"; // Lock scroll
      
      // Start typing message
      setTimeout(startMessageTyping, 400);
    }
  });

  // Floating Close Button on expanded card
  const closeLetterBtn = document.getElementById("close-letter-btn");
  closeLetterBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    state.envelope.isExpanded = false;
    envelopeLetter.classList.remove("expanded");
    document.body.style.overflow = ""; // Unlock scroll
  });

  function startMessageTyping() {
    const textContainer = document.getElementById("typed-message-content");
    if (!textContainer) return;
    
    // Clear previous
    textContainer.innerHTML = "";
    if (state.envelope.typingTimer) clearTimeout(state.envelope.typingTimer);

    const fullText = getConfigValue(["message", "typedMessage"], "Hello Special Someone.");
    let idx = 0;
    
    // Split HTML tags correctly to prevent raw code printing
    const parts = [];
    let currentText = "";
    
    // Break string into text nodes and tag codes
    for (let i = 0; i < fullText.length; i++) {
      if (fullText[i] === "<") {
        if (currentText) {
          parts.push({ type: "text", val: currentText });
          currentText = "";
        }
        let tag = "";
        while (fullText[i] !== ">" && i < fullText.length) {
          tag += fullText[i];
          i++;
        }
        tag += ">";
        parts.push({ type: "tag", val: tag });
      } else {
        currentText += fullText[i];
      }
    }
    if (currentText) {
      parts.push({ type: "text", val: currentText });
    }

    let partIdx = 0;
    let charIdx = 0;

    function typeNextChar() {
      if (partIdx >= parts.length) {
        readAgainBtn.classList.remove("hidden");
        return;
      }

      const p = parts[partIdx];
      if (p.type === "tag") {
        textContainer.innerHTML += p.val;
        partIdx++;
        state.envelope.typingTimer = setTimeout(typeNextChar, 50);
      } else {
        textContainer.innerHTML += p.val[charIdx];
        playTickSound();
        charIdx++;
        if (charIdx >= p.val.length) {
          partIdx++;
          charIdx = 0;
        }
        // Typing speed delay
        state.envelope.typingTimer = setTimeout(typeNextChar, Math.random() * 40 + 20);
      }
    }

    typeNextChar();
  }

  readAgainBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    readAgainBtn.classList.add("hidden");
    startMessageTyping();
  });

  /* =================================================================
     🎮 LET'S PLAY (MINI-GAMES INTERACTION) 🎮
     ================================================================= */
  
  function initGamesArcade() {
    renderGameCardGrid();
    checkAllGamesWon();
  }

  function renderGameCardGrid() {
    const winBadge1 = document.getElementById("win-badge-game1");
    const winBadge2 = document.getElementById("win-badge-game2");
    const winBadge3 = document.getElementById("win-badge-game3");
    const winBadge4 = document.getElementById("win-badge-game4");

    if (winBadge1) winBadge1.classList.toggle("hidden", !state.games.completed.has("game1"));
    if (winBadge2) winBadge2.classList.toggle("hidden", !state.games.completed.has("game2"));
    if (winBadge3) winBadge3.classList.toggle("hidden", !state.games.completed.has("game3"));
    if (winBadge4) winBadge4.classList.toggle("hidden", !state.games.completed.has("game4"));
  }

  // Setup game select buttons
  document.querySelectorAll("[data-game-id]").forEach(card => {
    card.addEventListener("click", () => {
      const gameId = card.getAttribute("data-game-id");
      openGameOverlay(gameId);
    });
  });

  function openGameOverlay(gameId) {
    const overlay = document.getElementById("game-overlay");
    const titleEl = document.getElementById("overlay-game-title");
    const bodyEl = document.getElementById("overlay-game-body");

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    document.body.style.overflow = "hidden"; // Lock scroll

    if (gameId === "game1") {
      titleEl.innerHTML = "❤️ Catch the Hearts";
      setupCatchHearts(bodyEl);
    } else if (gameId === "game2") {
      titleEl.innerHTML = "🧠 Heart Memory";
      setupHeartMemory(bodyEl);
    } else if (gameId === "game3") {
      titleEl.innerHTML = "💗 Don't Let the Heart Escape";
      setupEscapeHeart(bodyEl);
    } else if (gameId === "game4") {
      titleEl.innerHTML = "🧩 Love Puzzle";
      setupLovePuzzle(bodyEl);
    }
  }

  // Close Game Overlay
  const closeGameBtn = document.getElementById("close-game-btn");
  closeGameBtn?.addEventListener("click", closeGameOverlay);

  function closeGameOverlay() {
    const overlay = document.getElementById("game-overlay");
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
    document.body.style.overflow = ""; // Unlock scroll

    // Stop loops
    stopCatchHeartsGame();
    renderGameCardGrid();
  }

  // Mark a game as won and show arcade state update
  function markGameWon(gameId) {
    state.games.completed.add(gameId);
    checkAllGamesWon();
  }

  function checkAllGamesWon() {
    const overallWin = document.getElementById("overall-games-win");
    const arcadeSection = document.getElementById("arcade-container");
    if (state.games.completed.size === 4) {
      if (overallWin) {
        overallWin.classList.remove("hidden");
        // Inject win text
        overallWin.querySelector("p").innerText = getConfigValue(["games", "winScreenMessage"], "You Won! 🥰");
      }
      if (arcadeSection) arcadeSection.classList.add("opacity-50");
    } else {
      if (overallWin) overallWin.classList.add("hidden");
      if (arcadeSection) arcadeSection.classList.remove("opacity-50");
    }
  }

  /* --- Game 1: Catch the Hearts --- */
  function setupCatchHearts(container) {
    const gConf = getConfigValue(["games", "catchHearts"], { duration: 30, targetScore: 20 });
    
    container.innerHTML = `
      <div class="text-center w-full flex flex-col items-center">
        <p class="text-sm text-gray-600 mb-4">${gConf.instructions}</p>
        <div class="flex justify-between w-full max-w-sm font-bold text-gray-700 mb-2">
          <div>Time Left: <span id="game1-timer" class="text-pink-600">${gConf.duration}</span>s</div>
          <div>Score: <span id="game1-score" class="text-pink-600">0</span> / ${gConf.targetScore}</div>
        </div>
        <div class="relative w-full max-w-sm h-64 bg-pink-50 rounded-xl overflow-hidden border border-pink-200 cursor-crosshair">
          <canvas id="game1-canvas" class="w-full h-full block"></canvas>
          <div id="game1-start-screen" class="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center p-4">
            <button id="game1-start-btn" class="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-bold shadow-lg transition transform hover:scale-105">
              Start Game 🚀
            </button>
          </div>
        </div>
      </div>
    `;

    const canvas = document.getElementById("game1-canvas");
    const startScreen = document.getElementById("game1-start-screen");
    const startBtn = document.getElementById("game1-start-btn");

    if (!canvas || !startBtn) return;

    startBtn.addEventListener("click", () => {
      startScreen.classList.add("hidden");
      startCatchHeartsGame(canvas);
    });
  }

  function startCatchHeartsGame(canvas) {
    const gConf = getConfigValue(["games", "catchHearts"], { duration: 30, targetScore: 20 });
    
    state.games.catchHearts.isActive = true;
    state.games.catchHearts.score = 0;
    state.games.catchHearts.timeLeft = gConf.duration;
    state.games.catchHearts.hearts = [];
    state.games.catchHearts.canvas = canvas;
    state.games.catchHearts.ctx = canvas.getContext("2d");

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    state.games.catchHearts.ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Start Timer
    const timerText = document.getElementById("game1-timer");
    const scoreText = document.getElementById("game1-score");

    state.games.catchHearts.interval = setInterval(() => {
      state.games.catchHearts.timeLeft--;
      if (timerText) timerText.innerText = state.games.catchHearts.timeLeft;
      
      if (state.games.catchHearts.timeLeft <= 0) {
        stopCatchHeartsGame();
        
        // Show result
        const finalScore = state.games.catchHearts.score;
        const target = gConf.targetScore;
        const container = document.getElementById("overlay-game-body");

        if (finalScore >= target) {
          markGameWon("game1");
          triggerConfetti();
          container.innerHTML = `
            <div class="text-center p-6 flex flex-col items-center">
              <span class="text-6xl mb-4">🏆</span>
              <h3 class="text-2xl font-bold text-pink-600 mb-2">You Won!</h3>
              <p class="text-gray-600 mb-6">Incredible! You caught ${finalScore} hearts and completed the challenge! 🎉</p>
              <button onclick="document.getElementById('close-game-btn').click()" class="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg transition">Back to Games</button>
            </div>
          `;
        } else {
          container.innerHTML = `
            <div class="text-center p-6 flex flex-col items-center">
              <span class="text-6xl mb-4">💔</span>
              <h3 class="text-2xl font-bold text-purple-700 mb-2">Time's Up!</h3>
              <p class="text-gray-600 mb-6">You caught ${finalScore} hearts, but needed ${target} to win. Want to try again?</p>
              <button id="retry-game1-btn" class="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg transition">Retry Game 🔁</button>
            </div>
          `;
          document.getElementById("retry-game1-btn")?.addEventListener("click", () => setupCatchHearts(container));
        }
      }
    }, 1000);

    // Click/Tap catcher
    canvas.addEventListener("mousedown", handleHeartClick);
    canvas.addEventListener("touchstart", handleHeartTouch, { passive: false });
    canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    function handleHeartClick(e) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      catchHeartAt(clickX, clickY);
    }

    function handleHeartTouch(e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const clickX = touch.clientX - rect.left;
        const clickY = touch.clientY - rect.top;
        catchHeartAt(clickX, clickY);
      }
    }

    function catchHeartAt(x, y) {
      const list = state.games.catchHearts.hearts;
      for (let i = list.length - 1; i >= 0; i--) {
        const h = list[i];
        // Expanded collision circle check for mobile finger taps (+28px padding)
        const dist = Math.hypot(h.x - x, h.y - y);
        if (dist < h.size + 28) {
          list.splice(i, 1);
          state.games.catchHearts.score++;
          if (scoreText) scoreText.innerText = state.games.catchHearts.score;
          playTickSound();
          break;
        }
      }
    }

    // Spawning loop
    let lastSpawn = 0;
    const spawnRate = 800; // ms between spawns

    function loop(time) {
      if (!state.games.catchHearts.isActive) return;

      const ctx = state.games.catchHearts.ctx;
      ctx.clearRect(0, 0, width, height);

      // Spawn new hearts
      if (time - lastSpawn > spawnRate) {
        lastSpawn = time;
        const size = Math.random() * 12 + 10;
        const fallSpeed = Math.random() * 2 + 1.5 + (state.games.catchHearts.score * 0.05); // speed up with score
        state.games.catchHearts.hearts.push({
          x: Math.random() * (width - size * 2) + size,
          y: -size * 2,
          size: size,
          speed: fallSpeed,
          swaySpeed: Math.random() * 0.04 + 0.01,
          swayRadius: Math.random() * 3 + 1,
          swayOffset: Math.random() * Math.PI * 2,
          color: Math.random() > 0.4 ? "#f43f5e" : "#ec4899" // rose or pink
        });
      }

      // Draw hearts
      const list = state.games.catchHearts.hearts;
      for (let i = list.length - 1; i >= 0; i--) {
        const h = list[i];
        h.y += h.speed;
        h.swayOffset += h.swaySpeed;
        const currentX = h.x + Math.sin(h.swayOffset) * h.swayRadius;

        drawHeart(ctx, currentX, h.y, h.size, h.color);

        // Delete if out of bounds
        if (h.y > height + h.size * 2) {
          list.splice(i, 1);
        }
      }

      state.games.catchHearts.animationFrame = requestAnimationFrame(loop);
    }

    state.games.catchHearts.animationFrame = requestAnimationFrame(loop);
  }

  function stopCatchHeartsGame() {
    state.games.catchHearts.isActive = false;
    if (state.games.catchHearts.interval) {
      clearInterval(state.games.catchHearts.interval);
      state.games.catchHearts.interval = null;
    }
    if (state.games.catchHearts.animationFrame) {
      cancelAnimationFrame(state.games.catchHearts.animationFrame);
    }
  }

  /* --- Game 2: Heart Memory --- */
  function setupHeartMemory(container) {
    const configSymbols = getConfigValue(["games", "memoryGame", "symbols"], ["🌸", "🧸", "🐱", "🍩", "🎀", "🍦", "✨", "🐼"]);
    
    // Duplicate symbols for pairing
    let deck = [...configSymbols, ...configSymbols];
    
    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);

    state.games.memory = {
      cards: deck,
      flippedCards: [],
      moves: 0,
      matchedCount: 0,
      lockBoard: false
    };

    container.innerHTML = `
      <div class="text-center w-full flex flex-col items-center">
        <p class="text-sm text-gray-600 mb-4">${getConfigValue(["games", "memoryGame", "instructions"], "")}</p>
        <div class="font-bold text-gray-700 mb-4">Moves: <span id="memory-moves" class="text-pink-600">0</span></div>
        <div class="grid grid-cols-4 gap-3 w-full max-w-xs memory-grid" id="memory-grid-container"></div>
      </div>
    `;

    const gridContainer = document.getElementById("memory-grid-container");
    if (!gridContainer) return;

    deck.forEach((symbol, index) => {
      const card = document.createElement("div");
      card.className = "memory-card w-full aspect-square";
      card.setAttribute("data-card-index", index);
      card.innerHTML = `
        <div class="card-front"></div>
        <div class="card-back">${symbol}</div>
      `;
      card.addEventListener("click", () => handleMemoryCardClick(card, index, symbol));
      gridContainer.appendChild(card);
    });
  }

  function handleMemoryCardClick(cardEl, index, symbol) {
    const m = state.games.memory;
    if (m.lockBoard) return;
    if (cardEl.classList.contains("flipped")) return;

    // Flip card
    cardEl.classList.add("flipped");
    playTickSound();
    m.flippedCards.push({ element: cardEl, index, symbol });

    if (m.flippedCards.length === 2) {
      m.moves++;
      const movesText = document.getElementById("memory-moves");
      if (movesText) movesText.innerText = m.moves;

      m.lockBoard = true;
      const first = m.flippedCards[0];
      const second = m.flippedCards[1];

      if (first.symbol === second.symbol) {
        // Matched
        m.matchedCount++;
        m.flippedCards = [];
        m.lockBoard = false;

        const deckLength = m.cards.length;
        if (m.matchedCount === deckLength / 2) {
          // Completed Memory Game!
          setTimeout(() => {
            markGameWon("game2");
            triggerConfetti();
            const container = document.getElementById("overlay-game-body");
            container.innerHTML = `
              <div class="text-center p-6 flex flex-col items-center">
                <span class="text-6xl mb-4">🧠🌟</span>
                <h3 class="text-2xl font-bold text-pink-600 mb-2">Memory Master!</h3>
                <p class="text-gray-600 mb-6">You solved the matching pairs in ${m.moves} moves! Stellar job! ❤️</p>
                <button onclick="document.getElementById('close-game-btn').click()" class="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg transition">Back to Games</button>
              </div>
            `;
          }, 600);
        }
      } else {
        // Not matched, flip back
        setTimeout(() => {
          first.element.classList.remove("flipped");
          second.element.classList.remove("flipped");
          m.flippedCards = [];
          m.lockBoard = false;
        }, 1000);
      }
    }
  }

  /* --- Game 3: Don't Let the Heart Escape --- */
  function setupEscapeHeart(container) {
    const gConf = getConfigValue(["games", "escapeHeart"], { targetScore: 10, funnyMessages: ["Keep trying!"] });
    state.games.escape.score = 0;

    container.innerHTML = `
      <div class="text-center w-full flex flex-col items-center">
        <p class="text-sm text-gray-600 mb-4">${gConf.instructions}</p>
        <div class="font-bold text-gray-700 mb-4">Hits: <span id="escape-score" class="text-pink-600">0</span> / ${gConf.targetScore}</div>
        <div class="relative w-full max-w-sm h-64 bg-purple-50 rounded-xl border border-purple-200 overflow-hidden" id="escape-game-box">
          <div id="escape-heart-btn" class="absolute w-12 h-12 flex justify-center items-center text-3xl cursor-pointer select-none transition-all duration-100 ease-out" style="left: 45%; top: 40%;">
            💗
          </div>
        </div>
        <div id="escape-message" class="mt-4 text-sm font-semibold text-purple-700 italic h-6">Try to catch it!</div>
      </div>
    `;

    const heart = document.getElementById("escape-heart-btn");
    const gameBox = document.getElementById("escape-game-box");
    const msgEl = document.getElementById("escape-message");

    if (!heart || !gameBox) return;

    // Movement speeds up per hit
    function relocateHeart() {
      const boxRect = gameBox.getBoundingClientRect();
      const maxX = boxRect.width - 48; // Heart size width
      const maxY = boxRect.height - 48;

      const randomX = Math.random() * maxX;
      const randomY = Math.random() * maxY;

      heart.style.left = `${randomX}px`;
      heart.style.top = `${randomY}px`;
    }

    // Flee on hover (mouse cursor)
    heart.addEventListener("mouseenter", () => {
      relocateHeart();
      showFunnyMessage();
    });

    // Touch proximity dodge for mobile screens
    function handleTouchDodge(e) {
      if (!e.touches || !e.touches[0]) return;
      const touch = e.touches[0];
      const boxRect = gameBox.getBoundingClientRect();
      const touchX = touch.clientX - boxRect.left;
      const touchY = touch.clientY - boxRect.top;

      const heartLeft = parseFloat(heart.style.left) || (boxRect.width * 0.45);
      const heartTop = parseFloat(heart.style.top) || (boxRect.height * 0.4);
      const heartCenterX = heartLeft + 24;
      const heartCenterY = heartTop + 24;

      const dist = Math.hypot(touchX - heartCenterX, touchY - heartCenterY);
      if (dist < 65 && dist > 15) {
        if (Math.random() < 0.65) {
          relocateHeart();
          showFunnyMessage();
        }
      }
    }

    gameBox.addEventListener("touchmove", handleTouchDodge, { passive: true });
    gameBox.addEventListener("touchstart", handleTouchDodge, { passive: true });

    // Tap/Click catcher
    function onHeartHit(e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      state.games.escape.score++;
      
      const scoreEl = document.getElementById("escape-score");
      if (scoreEl) scoreEl.innerText = state.games.escape.score;
      
      playTickSound();
      relocateHeart();

      if (state.games.escape.score >= gConf.targetScore) {
        markGameWon("game3");
        triggerConfetti();
        setTimeout(() => {
          container.innerHTML = `
            <div class="text-center p-6 flex flex-col items-center">
              <span class="text-6xl mb-4">⚡🏃‍♀️</span>
              <h3 class="text-2xl font-bold text-pink-600 mb-2">Caught it!</h3>
              <p class="text-gray-600 mb-6">No escaping you! You grabbed it ${gConf.targetScore} times. Amazing speed! ❤️</p>
              <button onclick="document.getElementById('close-game-btn').click()" class="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg transition">Back to Games</button>
            </div>
          `;
        }, 300);
      }
    }

    heart.addEventListener("touchstart", onHeartHit, { passive: false });
    heart.addEventListener("click", onHeartHit);

    function showFunnyMessage() {
      const idx = Math.floor(Math.random() * gConf.funnyMessages.length);
      if (msgEl) {
        msgEl.innerText = gConf.funnyMessages[idx];
      }
    }
  }

  /* --- Game 4: Love Puzzle --- */
  function setupLovePuzzle(container) {
    const solvedMsg = getConfigValue(["games", "lovePuzzle", "solvedMessage"], "You Solved It! ❤️");
    
    // We do a classic 3x3 sliding tile puzzle using numbers or custom cells.
    // The tiles are numbered 1 to 8, with 0 as the empty slot.
    // Let's create an elegant grid layout.
    
    // To make sure it's solvable, we'll shuffle it using random valid moves from solved state
    let grid = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    
    // Simulate ~100 random slides to shuffle
    for (let i = 0; i < 150; i++) {
      const blankIndex = grid.indexOf(0);
      const row = Math.floor(blankIndex / 3);
      const col = blankIndex % 3;
      const candidates = [];
      if (row > 0) candidates.push(blankIndex - 3); // Up
      if (row < 2) candidates.push(blankIndex + 3); // Down
      if (col > 0) candidates.push(blankIndex - 1); // Left
      if (col < 2) candidates.push(blankIndex + 1); // Right
      
      const nextSlide = candidates[Math.floor(Math.random() * candidates.length)];
      grid[blankIndex] = grid[nextSlide];
      grid[nextSlide] = 0;
    }

    state.games.puzzle.grid = grid;

    container.innerHTML = `
      <div class="text-center w-full flex flex-col items-center">
        <p class="text-sm text-gray-600 mb-4">${getConfigValue(["games", "lovePuzzle", "instructions"], "")}</p>
        <div class="grid grid-cols-3 gap-2 w-64 h-64 sm:w-64 sm:h-64 max-w-full aspect-square bg-purple-100 rounded-xl p-2 border border-purple-200" id="puzzle-grid-container"></div>
      </div>
    `;

    renderPuzzleGrid();
  }

  function renderPuzzleGrid() {
    const gridContainer = document.getElementById("puzzle-grid-container");
    const container = document.getElementById("overlay-game-body");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";
    const grid = state.games.puzzle.grid;

    grid.forEach((num, index) => {
      const tile = document.createElement("div");
      
      if (num === 0) {
        // Blank slot
        tile.className = "w-full h-full bg-purple-50/20 rounded-lg";
      } else {
        tile.className = "w-full h-full glass-card flex justify-center items-center text-xl font-bold text-pink-600 border border-pink-300 rounded-lg shadow-sm cursor-pointer select-none puzzle-tile hover:bg-white transition-colors duration-150";
        tile.innerText = num;
        tile.addEventListener("click", () => handlePuzzleTileClick(index));

        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        tile.addEventListener("touchstart", (e) => {
          if (e.touches[0]) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
        }, { passive: true });

        tile.addEventListener("touchend", (e) => {
          if (!e.changedTouches[0]) return;
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const dx = touchEndX - touchStartX;
          const dy = touchEndY - touchStartY;

          // If swiped or tapped, attempt slide
          if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            handlePuzzleTileClick(index);
          }
        }, { passive: true });
      }
      gridContainer.appendChild(tile);
    });

    // Check if Solved
    const solvedPattern = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const isSolved = grid.every((num, idx) => num === solvedPattern[idx]);
    
    if (isSolved) {
      setTimeout(() => {
        markGameWon("game4");
        triggerConfetti();
        container.innerHTML = `
          <div class="text-center p-6 flex flex-col items-center">
            <span class="text-6xl mb-4">🧩🎉</span>
            <h3 class="text-2xl font-bold text-pink-600 mb-2">Puzzle Solved!</h3>
            <p class="text-gray-600 mb-6 font-semibold px-4">${getConfigValue(["games", "lovePuzzle", "solvedMessage"], "You fit perfectly in my life. ❤️")}</p>
            <button onclick="document.getElementById('close-game-btn').click()" class="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-lg transition">Back to Games</button>
          </div>
        `;
      }, 300);
    }
  }

  function handlePuzzleTileClick(index) {
    const grid = state.games.puzzle.grid;
    const blankIndex = grid.indexOf(0);

    const clickRow = Math.floor(index / 3);
    const clickCol = index % 3;
    const blankRow = Math.floor(blankIndex / 3);
    const blankCol = blankIndex % 3;

    // Check adjacency (manhattan distance === 1)
    const isAdjacent = Math.abs(clickRow - blankRow) + Math.abs(clickCol - blankCol) === 1;

    if (isAdjacent) {
      // Swap tiles
      grid[blankIndex] = grid[index];
      grid[index] = 0;
      playTickSound();
      renderPuzzleGrid();
    }
  }

  /* =================================================================
     🔐 SECRET ROOM SECTION 🔐
     ================================================================= */
  
  const pinInput = document.getElementById("pin-input");
  const pinSubmitBtn = document.getElementById("pin-submit");
  const lockPromptScreen = document.getElementById("lock-prompt-screen");
  const terminalScreen = document.getElementById("secret-terminal-screen");
  const secretContentScreen = document.getElementById("secret-content-screen");

  function resetSecretRoom() {
    if (state.secretRoomUnlocked) {
      if (lockPromptScreen) lockPromptScreen.classList.add("hidden");
      if (terminalScreen) terminalScreen.classList.add("hidden");
      if (secretContentScreen) secretContentScreen.classList.remove("hidden");
      revealSecretRoom();
    } else {
      if (lockPromptScreen) lockPromptScreen.classList.remove("hidden");
      if (terminalScreen) terminalScreen.classList.add("hidden");
      if (secretContentScreen) secretContentScreen.classList.add("hidden");
      if (pinInput) pinInput.value = "";
    }
  }

  // Keypad inputs
  document.querySelectorAll("[data-keypad-val]").forEach(key => {
    key.addEventListener("click", () => {
      const val = key.getAttribute("data-keypad-val");
      if (val === "clear") {
        if (pinInput) pinInput.value = "";
      } else {
        if (pinInput && pinInput.value.length < 4) {
          pinInput.value += val;
          playTickSound();
        }
      }
    });
  });

  pinSubmitBtn?.addEventListener("click", () => {
    checkPin();
  });

  function checkPin() {
    const entered = pinInput?.value || "";
    const correct = getConfigValue(["secretRoom", "correctPin"], "1207");

    if (entered === correct) {
      // Access Granted!
      state.secretRoomUnlocked = true;
      triggerConfetti();
      startTerminalSequence();
    } else {
      // Shakes passcode box
      const passcodeBox = document.getElementById("passcode-container");
      passcodeBox?.classList.add("surprise-stage-shake", "border-red-500");
      if (pinInput) pinInput.value = "";
      
      setTimeout(() => {
        passcodeBox?.classList.remove("surprise-stage-shake", "border-red-500");
      }, 500);
    }
  }

  function startTerminalSequence() {
    lockPromptScreen.classList.add("hidden");
    terminalScreen.classList.remove("hidden");

    const logsContainer = document.getElementById("terminal-logs");
    if (!logsContainer) return;
    
    logsContainer.innerHTML = "";
    const terminalLines = getConfigValue(["secretRoom", "terminalMessages"], ["ACCESSING PRIVATE NETWORK..."]);
    
    let lineIdx = 0;

    function typeTerminalLine() {
      if (lineIdx >= terminalLines.length) {
        setTimeout(revealSecretRoom, 800);
        return;
      }

      const p = document.createElement("p");
      p.className = "text-green-400 font-mono text-sm mb-1 terminal-cursor";
      logsContainer.appendChild(p);
      
      const lineContent = terminalLines[lineIdx];
      let charIdx = 0;

      function typeChar() {
        if (charIdx >= lineContent.length) {
          p.classList.remove("terminal-cursor");
          lineIdx++;
          setTimeout(typeTerminalLine, 400);
          return;
        }
        
        p.innerText += lineContent[charIdx];
        charIdx++;
        playTickSound();
        setTimeout(typeChar, 30);
      }

      typeChar();
    }

    typeTerminalLine();
  }

  function revealSecretRoom() {
    terminalScreen.classList.add("hidden");
    secretContentScreen.classList.remove("hidden");

    // Populates data from config
    const jokesList = document.getElementById("secret-jokes-list");
    if (jokesList) {
      jokesList.innerHTML = "";
      const jokes = getConfigValue(["secretRoom", "insideJokes"], []);
      jokes.forEach(joke => {
        const li = document.createElement("li");
        li.className = "text-gray-200 border-b border-purple-900/50 pb-2 mb-2 last:border-b-0";
        li.innerHTML = `🌟 <span class="ml-2 font-mono text-sm">${joke}</span>`;
        jokesList.appendChild(li);
      });
    }

    // Polaroids
    const photoContainer = document.getElementById("secret-photos-container");
    if (photoContainer) {
      photoContainer.innerHTML = "";
      const photos = getConfigValue(["secretRoom", "photos"], []);
      
      photos.forEach((ph, index) => {
        // Random tilt angle for realistic polaroid style
        const tilt = (Math.random() * 6 - 3).toFixed(1);
        const polaroid = document.createElement("div");
        polaroid.className = "romantic-photo-frame mx-auto max-w-[220px]";
        polaroid.style.setProperty("--rotation", `${tilt}deg`);
        
        // Use custom URL or render clean inline SVG vector representation
        let imgHtml = "";
        if (ph.url) {
          imgHtml = `<img src="${ph.url}" alt="${ph.title}" class="w-full h-40 object-cover border border-gray-100 rounded-sm mb-3">`;
        } else {
          imgHtml = `
            <div class="w-full h-40 bg-gradient-to-tr from-pink-200 to-purple-300 border border-gray-100 rounded-sm mb-3 flex flex-col justify-center items-center p-4 text-center">
              <span class="text-4xl mb-1">📸</span>
              <p class="text-xs font-semibold text-purple-900">${ph.title}</p>
              <p class="text-[9px] text-gray-500">Double-tap for love</p>
            </div>
          `;
        }

        polaroid.innerHTML = `
          ${imgHtml}
          <div class="font-fancy text-xs font-bold text-purple-950 mb-1">${ph.title}</div>
          <div class="text-[9px] text-gray-500 leading-tight">${ph.caption}</div>
        `;
        
        polaroid.addEventListener("dblclick", () => {
          triggerConfetti();
          playTickSound();
        });

        photoContainer.appendChild(polaroid);
      });
    }

    // Letters/Notes
    const notesContainer = document.getElementById("secret-notes-container");
    if (notesContainer) {
      notesContainer.innerHTML = "";
      const notes = getConfigValue(["secretRoom", "notes"], []);
      
      notes.forEach(note => {
        const card = document.createElement("div");
        card.className = "p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200";
        card.innerHTML = `
          <h4 class="font-semibold font-fancy text-pink-400 mb-2 border-b border-purple-900/60 pb-1 text-sm flex items-center">
            🔐 <span class="ml-1.5">${note.title}</span>
          </h4>
          <p class="text-xs leading-relaxed text-gray-300 font-sans italic">"${note.text}"</p>
        `;
        notesContainer.appendChild(card);
      });
    }
  }

  /* =================================================================
     🧩 OUR MINI QUIZ 🧩
     ================================================================= */
  
  function resetQuiz() {
    state.quiz.currentIndex = 0;
    state.quiz.score = 0;
    
    const intro = document.getElementById("quiz-intro-screen");
    const container = document.getElementById("quiz-play-screen");
    const result = document.getElementById("quiz-result-screen");

    if (intro) intro.classList.remove("hidden");
    if (container) container.classList.add("hidden");
    if (result) result.classList.add("hidden");
  }

  const startQuizBtn = document.getElementById("start-quiz-btn");
  startQuizBtn?.addEventListener("click", () => {
    document.getElementById("quiz-intro-screen")?.classList.add("hidden");
    document.getElementById("quiz-play-screen")?.classList.remove("hidden");
    renderQuizQuestion();
  });

  function renderQuizQuestion() {
    const qList = getConfigValue(["quiz", "questions"], []);
    const idx = state.quiz.currentIndex;

    if (idx >= qList.length) {
      showQuizResults();
      return;
    }

    const q = qList[idx];
    
    // Update progress bar
    const progressFill = document.getElementById("quiz-progress-fill");
    const progressPercent = Math.round((idx / qList.length) * 100);
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const qCountText = document.getElementById("quiz-count");
    if (qCountText) qCountText.innerText = `Question ${idx + 1} of ${qList.length}`;

    const qText = document.getElementById("quiz-question-text");
    if (qText) qText.innerText = q.question;

    const optGrid = document.getElementById("quiz-options-container");
    if (optGrid) {
      optGrid.innerHTML = "";
      
      q.options.forEach((opt, oIdx) => {
        const button = document.createElement("button");
        button.className = "w-full text-left px-5 py-3.5 glass-card rounded-xl text-sm text-purple-950 font-medium hover:bg-pink-100/50 hover:border-pink-300 transition-all border duration-150 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm flex justify-between items-center";
        button.innerHTML = `<span>${opt}</span> <span class="opacity-0 font-bold transition-all text-xs">select →</span>`;
        
        button.addEventListener("click", () => {
          // Disable all buttons in container
          optGrid.querySelectorAll("button").forEach(btn => btn.disabled = true);
          
          handleQuizSelection(button, oIdx, q.correctIndex, q.explanation);
        });

        optGrid.appendChild(button);
      });
    }

    // Hide explanation box
    const feedbackBox = document.getElementById("quiz-explanation-box");
    if (feedbackBox) feedbackBox.classList.add("hidden");
  }

  function handleQuizSelection(buttonEl, selectedIdx, correctIdx, explanation) {
    const isCorrect = selectedIdx === correctIdx;
    
    if (isCorrect) {
      state.quiz.score++;
      buttonEl.classList.add("bg-emerald-100", "border-emerald-300", "text-emerald-950");
      buttonEl.querySelector("span:last-child").innerHTML = "✅";
      buttonEl.querySelector("span:last-child").classList.remove("opacity-0");
      triggerConfetti();
    } else {
      buttonEl.classList.add("bg-rose-100", "border-rose-300", "text-rose-950");
      buttonEl.querySelector("span:last-child").innerHTML = "❌";
      buttonEl.querySelector("span:last-child").classList.remove("opacity-0");

      // Show correct index button highlight
      const optionsContainer = document.getElementById("quiz-options-container");
      const correctBtn = optionsContainer.children[correctIdx];
      correctBtn.classList.add("bg-emerald-50", "border-emerald-200", "text-emerald-900");
    }

    playTickSound();

    // Show Explanation
    const feedbackBox = document.getElementById("quiz-explanation-box");
    const feedbackTitle = document.getElementById("quiz-explanation-title");
    const feedbackText = document.getElementById("quiz-explanation-text");

    if (feedbackBox) {
      feedbackBox.classList.remove("hidden");
      if (feedbackTitle) feedbackTitle.innerText = isCorrect ? "Spot On! 🎉" : "Ah, Close! 😉";
      if (feedbackText) feedbackText.innerText = explanation;
    }

    // Next question trigger
    const nextBtn = document.getElementById("quiz-next-btn");
    if (nextBtn) {
      nextBtn.classList.remove("hidden");
      // Re-assign listener to prevent duplication
      const handler = () => {
        state.quiz.currentIndex++;
        renderQuizQuestion();
        nextBtn.classList.add("hidden");
        nextBtn.removeEventListener("click", handler);
      };
      nextBtn.addEventListener("click", handler);
    }
  }

  function showQuizResults() {
    document.getElementById("quiz-play-screen")?.classList.add("hidden");
    const resultScreen = document.getElementById("quiz-result-screen");
    resultScreen?.classList.remove("hidden");

    const scorePct = Math.round((state.quiz.score / state.quiz.questions.length) * 100);
    const scoreValText = document.getElementById("quiz-score-value");
    const scoreDesc = document.getElementById("quiz-score-desc");

    if (scoreValText) scoreValText.innerText = `${state.quiz.score} / ${state.quiz.questions.length}`;

    // Get feedback based on score percentage
    let desc = getConfigValue(["quiz", "results", "average"], "");
    if (scorePct === 100) {
      desc = getConfigValue(["quiz", "results", "perfect"], "");
      triggerConfetti();
    } else if (scorePct >= 70) {
      desc = getConfigValue(["quiz", "results", "good"], "");
    } else if (scorePct < 40) {
      desc = getConfigValue(["quiz", "results", "low"], "");
    }

    if (scoreDesc) scoreDesc.innerText = desc;

    document.getElementById("retry-quiz-btn")?.addEventListener("click", resetQuiz);
  }

  /* =================================================================
     🌙 MIDNIGHT CORNER 🌙
     ================================================================= */
  
  function initMidnightCorner() {
    const space = document.getElementById("midnight-starfield");
    if (!space) return;

    // Remove existing
    space.querySelectorAll(".star").forEach(s => s.remove());

    // Generate stars
    const starCount = 60;
    const width = space.offsetWidth;
    const height = space.offsetHeight;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      const delay = Math.random() * 5;
      const dur = Math.random() * 3 + 2;
      star.style.setProperty("--twinkle-dur", `${dur}s`);
      star.style.animationDelay = `${delay}s`;

      space.appendChild(star);
    }

    renderMidnightNotes();
  }

  function renderMidnightNotes() {
    const container = document.getElementById("midnight-notes-container");
    if (!container) return;

    container.innerHTML = "";
    const cards = getConfigValue(["midnightCorner", "cards"], []);

    cards.forEach(card => {
      const flipCard = document.createElement("div");
      flipCard.className = "midnight-note-card w-full h-[180px]";
      
      flipCard.innerHTML = `
        <div class="midnight-note-inner">
          <div class="midnight-note-front font-fancy text-center flex flex-col justify-center items-center shadow-lg border">
            <span class="text-3xl mb-2">⭐</span>
            <p class="font-semibold text-purple-200 text-sm">${card.trigger}</p>
          </div>
          <div class="midnight-note-back text-left shadow-lg border">
            <h4 class="font-fancy font-bold text-pink-400 mb-2 border-b border-purple-900 pb-1 text-sm">${card.heading}</h4>
            <p class="text-[11px] leading-relaxed text-gray-300 font-sans font-medium">${card.message}</p>
          </div>
        </div>
      `;

      flipCard.addEventListener("click", () => {
        flipCard.classList.toggle("opened");
        playTickSound();
      });

      container.appendChild(flipCard);
    });

    // Star Click Easter Egg setup
    const moon = document.getElementById("midnight-moon");
    if (moon) {
      moon.addEventListener("click", () => {
        state.easterEggs.starClicks++;
        playTickSound();
        if (state.easterEggs.starClicks === 5) {
          triggerConfetti();
          alert(`🌟 Moon Easter Egg unlocked! You tapped the crescent moon 5 times!\n\nHere is an extra sweet thought:\n"No matter how dark the sky gets, some stars never stop shining. Thanks for lighting up my world."`);
          state.easterEggs.starClicks = 0;
        }
      });
    }
  }

  /* =================================================================
     💖 SURPRISE SECTION 💖
     ================================================================= */
  
  const surpriseBtn = document.getElementById("surprise-btn");
  const surpriseRevealScreen = document.getElementById("surprise-reveal-screen");
  
  function resetSurprise() {
    state.surprise.stage = 0;
    if (surpriseBtn) {
      surpriseBtn.innerText = getConfigValue(["surprise", "buttonText"], "DON'T CLICK");
      surpriseBtn.className = "px-8 py-5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-bold shadow-2xl transition duration-150 transform hover:scale-105 active:scale-95 text-lg font-fancy cursor-pointer text-center select-none";
      surpriseBtn.classList.remove("surprise-stage-shake");
    }
    if (surpriseRevealScreen) {
      surpriseRevealScreen.classList.add("hidden");
      surpriseRevealScreen.classList.remove("opacity-100");
    }
    const mask = document.getElementById("surprise-mask");
    if (mask) mask.classList.add("hidden");
  }

  surpriseBtn?.addEventListener("click", () => {
    handleSurpriseClick();
  });

  function handleSurpriseClick() {
    const stages = getConfigValue(["surprise", "stages"], []);
    const stage = state.surprise.stage;

    playTickSound();

    if (stage < stages.length) {
      // Shakes and alters button warning text
      surpriseBtn.innerText = stages[stage];
      
      // Stage based actions
      if (stage === 1) {
        surpriseBtn.classList.add("surprise-stage-shake");
      } else if (stage === 2) {
        // Red flashing warnings
        surpriseBtn.classList.add("from-rose-600", "to-red-700");
      }
      
      state.surprise.stage++;
    } else {
      // Final Trigger!
      triggerSurpriseSequence();
    }
  }

  function triggerSurpriseSequence() {
    // 1. Blackout mask
    const mask = document.getElementById("surprise-mask");
    if (mask) {
      mask.classList.remove("hidden");
    }

    // 2. Play alert flash sounds or vibration (standard check)
    let countdown = 3;
    const countdownEl = document.getElementById("surprise-countdown");
    if (countdownEl) {
      countdownEl.innerText = countdown;
      countdownEl.classList.remove("hidden");
    }

    const interval = setInterval(() => {
      countdown--;
      playTickSound();
      if (countdownEl) countdownEl.innerText = countdown;

      if (countdown <= 0) {
        clearInterval(interval);
        if (countdownEl) countdownEl.classList.add("hidden");
        
        // Explode Confetti!
        triggerConfetti();
        triggerConfetti();
        
        // Reveal true message
        revealSurpriseMsg();
      }
    }, 900);
  }

  function revealSurpriseMsg() {
    const mask = document.getElementById("surprise-mask");
    if (mask) mask.classList.add("hidden");
    
    if (surpriseRevealScreen) {
      surpriseRevealScreen.classList.remove("hidden");
      setTimeout(() => {
        surpriseRevealScreen.classList.add("opacity-100");
      }, 50);
    }

    const surpriseTitle = document.getElementById("surprise-title");
    const surpriseText = document.getElementById("surprise-text");

    if (surpriseTitle) surpriseTitle.innerText = getConfigValue(["surprise", "surpriseTitle"], "");
    if (surpriseText) surpriseText.innerText = getConfigValue(["surprise", "surpriseText"], "");
  }

  document.getElementById("close-surprise-btn")?.addEventListener("click", () => {
    resetSurprise();
  });

  /* =================================================================
     📖 MEMORY LANE (TIMELINE ACCORDION) 📖
     ================================================================= */
  
  function initTimeline() {
    const list = document.getElementById("timeline-elements");
    if (!list) return;

    list.innerHTML = "";
    const items = getConfigValue(["memoryLane"], []);

    items.forEach((item, index) => {
      const li = document.createElement("div");
      li.className = "relative mb-8 last:mb-0 md:w-1/2 md:even:ml-auto md:odd:mr-auto md:odd:text-right group";
      
      // Node circle dot
      const isEven = index % 2 === 0;
      const dotClasses = `absolute top-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 border-4 border-white shadow-md z-20 transition transform group-hover:scale-125 duration-150 left-0 md:left-1/2 md:-ml-3`;

      li.innerHTML = `
        <div class="${dotClasses}"></div>
        <div class="pl-8 md:pl-0 md:px-8">
          <div class="glass-card p-5 cursor-pointer shadow-sm hover:shadow-md hover:border-pink-300 transition-all border duration-200" data-timeline-idx="${index}">
            <div class="flex items-center space-x-2.5 ${isEven ? 'md:flex-row-reverse md:space-x-reverse' : ''} mb-1">
              <span class="text-xl">${item.emoji}</span>
              <span class="text-xs font-bold uppercase tracking-wider text-pink-500 font-fancy">${item.date}</span>
            </div>
            <h3 class="font-fancy font-bold text-lg text-purple-950 mb-2">${item.title}</h3>
            <div class="timeline-desc hidden max-h-0 overflow-hidden text-xs text-gray-600 leading-relaxed transition-all duration-300 font-sans italic mt-2 border-t border-pink-100/50 pt-2 text-left">
              ${item.description}
            </div>
          </div>
        </div>
      `;

      // Accordion click
      const card = li.querySelector("[data-timeline-idx]");
      const desc = li.querySelector(".timeline-desc");
      card.addEventListener("click", () => {
        const isCollapsed = desc.classList.contains("hidden");
        
        // Collapse all others
        list.querySelectorAll(".timeline-desc").forEach(d => {
          d.classList.add("hidden");
          d.classList.remove("block");
        });

        if (isCollapsed) {
          desc.classList.remove("hidden");
          desc.classList.add("block");
          playTickSound();
        } else {
          desc.classList.add("hidden");
          desc.classList.remove("block");
        }
      });

      list.appendChild(li);
    });
  }

  /* =================================================================
     🎉 DECORATIVE CONFETTI SYSTEM 🎉
     ================================================================= */
  
  function triggerConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#c084fc", "#fbcfe8"];

    // Spawn 100 random confetti falling physics pieces
    for (let i = 0; i < 110; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -100 - 10,
        r: Math.random() * 5 + 3,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
        speedY: Math.random() * 3 + 2.5,
        speedX: Math.random() * 2 - 1
      });
    }

    let active = true;

    function draw() {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let onScreen = 0;

      pieces.forEach(p => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.tiltAngle) * 0.5;
        p.tilt = Math.sin(p.tiltAngle - (p.r / 2)) * 10;

        if (p.y < canvas.height + 20) {
          onScreen++;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r * 1.5;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + (p.r / 2), p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 2));
        ctx.stroke();
      });

      if (onScreen === 0) {
        active = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        requestAnimationFrame(draw);
      }
    }

    draw();
  }

  /* =================================================================
     ✨ EASTER EGGS SYSTEM ✨
     ================================================================= */
  
  // 1. Secret keyboard typing listener (typing "love" or "amu" triggers full page hearts shower)
  window.addEventListener("keydown", (e) => {
    state.easterEggs.keySequence += e.key.toLowerCase();
    
    // Cap buffer
    if (state.easterEggs.keySequence.length > 10) {
      state.easterEggs.keySequence = state.easterEggs.keySequence.substring(1);
    }

    const secretKeyword = getConfigValue(["easterEggs", "secretWord"], "love");
    const check1 = getConfigValue(["friendName"], "amu").toLowerCase();

    if (state.easterEggs.keySequence.includes(secretKeyword)) {
      triggerConfetti();
      triggerConfetti();
      alert(`❤️ Key Egg unlocked! You typed "${secretKeyword.toUpperCase()}"! Enjoy the shower of feelings.`);
      state.easterEggs.keySequence = "";
    } else if (state.easterEggs.keySequence.includes(check1)) {
      triggerConfetti();
      state.easterEggs.keySequence = "";
    }
  });

  // Logo Click sparkles explosion
  const logo = document.getElementById("app-logo");
  logo?.addEventListener("click", () => {
    triggerConfetti();
    playTickSound();
  });

  // Footer Developers Note trigger
  const devNoteBtn = document.getElementById("dev-note-trigger");
  devNoteBtn?.addEventListener("click", () => {
    const note = getConfigValue(["easterEggs", "devNote"], "Handcrafted with ❤️");
    alert(note);
  });

  // Print cute developer greeting in the system console log
  console.log(getConfigValue(["easterEggs", "devNote"], "Custom coded for a special one. 💗"));

  /* =================================================================
     💬 PRIVATE REAL-TIME CHAT SYSTEM 💬
     ================================================================= */

  function initChatRoom() {
    const lockPrompt = document.getElementById("chat-lock-prompt");
    const identityScreen = document.getElementById("chat-identity-screen");
    const roomInterface = document.getElementById("chat-room-interface");

    if (!lockPrompt || !identityScreen || !roomInterface) return;

    if (!state.secretRoomUnlocked) {
      lockPrompt.classList.remove("hidden");
      identityScreen.classList.add("hidden");
      roomInterface.classList.add("hidden");
      return;
    }

    lockPrompt.classList.add("hidden");

    if (!state.chat.currentUser) {
      identityScreen.classList.remove("hidden");
      roomInterface.classList.add("hidden");
      setupChatIdentityListeners();
    } else {
      identityScreen.classList.add("hidden");
      roomInterface.classList.remove("hidden");
      
      // Update header label
      const userLabel = document.getElementById("chat-user-label");
      if (userLabel) {
        const isAmuu = state.chat.currentUser === "Amuu";
        userLabel.innerText = `Chatting as: ${state.chat.currentUser} ${isAmuu ? '🌸' : '☕'}`;
      }

      // Load history
      const saved = localStorage.getItem("romantic_chat_history");
      if (saved) {
        try {
          state.chat.messages = JSON.parse(saved);
        } catch(e) {
          state.chat.messages = [];
        }
      }
      
      renderChatMessages();
      connectRealTimeChat();
      setupChatRoomListeners();
    }
  }

  function setupChatIdentityListeners() {
    if (state.chat.identityListenersBound) return;
    state.chat.identityListenersBound = true;

    const amuuBtn = document.getElementById("identity-amuu-btn");
    const rakeshBtn = document.getElementById("identity-rakesh-btn");

    amuuBtn?.addEventListener("click", () => {
      state.chat.currentUser = "Amuu";
      localStorage.setItem("romantic_chat_user", "Amuu");
      initChatRoom();
      playTickSound();
    });

    rakeshBtn?.addEventListener("click", () => {
      state.chat.currentUser = "Rakesh";
      localStorage.setItem("romantic_chat_user", "Rakesh");
      initChatRoom();
      playTickSound();
    });
  }

  function setupChatRoomListeners() {
    if (state.chat.roomListenersBound) return;
    state.chat.roomListenersBound = true;

    const sendBtn = document.getElementById("chat-send-btn");
    const inputEl = document.getElementById("chat-input-text");
    const clearBtn = document.getElementById("chat-clear-history-btn");
    const switchBtn = document.getElementById("chat-reset-identity-btn");

    const sendMessage = () => {
      const text = inputEl.value.trim();
      if (!text) return;

      const topic = getConfigValue(["chat", "topic"], "amuu_rakesh_love_chat_2026_xyz");
      const payload = {
        id: Math.random().toString(36).substr(2, 9),
        sender: state.chat.currentUser,
        text: text,
        time: Date.now()
      };

      // Clear input immediately
      inputEl.value = "";

      // Post to ntfy.sh
      fetch(`https://ntfy.sh/${topic}`, {
        method: "POST",
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) {
          console.error("Chat sync failed");
        }
      })
      .catch(err => console.error("Network error on chat send:", err));

      // Append locally and save
      const exists = state.chat.messages.some(m => m.id === payload.id);
      if (!exists) {
        state.chat.messages.push(payload);
        localStorage.setItem("romantic_chat_history", JSON.stringify(state.chat.messages));
        renderChatMessages();
      }
    };

    sendBtn?.addEventListener("click", sendMessage);
    inputEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    clearBtn?.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your local chat history? 🗑️")) {
        state.chat.messages = [];
        localStorage.removeItem("romantic_chat_history");
        renderChatMessages();
        playTickSound();
      }
    });

    switchBtn?.addEventListener("click", () => {
      if (state.chat.eventSource) {
        state.chat.eventSource.close();
        state.chat.eventSource = null;
      }
      state.chat.currentUser = null;
      localStorage.removeItem("romantic_chat_user");
      initChatRoom();
      playTickSound();
    });
  }

  function connectRealTimeChat() {
    // 1. Fetch missed messages (poll last 24h cache)
    const topic = getConfigValue(["chat", "topic"], "amuu_rakesh_love_chat_2026_xyz");
    
    fetch(`https://ntfy.sh/${topic}/json?poll=1`)
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split("\n");
        let hasNew = false;
        lines.forEach(line => {
          if (!line) return;
          try {
            const data = JSON.parse(line);
            if (data.event === "message") {
              const payload = JSON.parse(data.message);
              if (payload && payload.id) {
                const exists = state.chat.messages.some(m => m.id === payload.id);
                if (!exists) {
                  state.chat.messages.push(payload);
                  hasNew = true;
                }
              }
            }
          } catch(e) {}
        });

        if (hasNew) {
          state.chat.messages.sort((a, b) => a.time - b.time);
          localStorage.setItem("romantic_chat_history", JSON.stringify(state.chat.messages));
          renderChatMessages();
        }
      })
      .catch(err => console.error("Error polling chat history:", err));

    // 2. Setup SSE connection
    if (state.chat.eventSource) return;

    try {
      state.chat.eventSource = new EventSource(`https://ntfy.sh/${topic}/sse`);
      state.chat.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "message") {
            const payload = JSON.parse(data.message);
            if (payload && payload.id) {
              const exists = state.chat.messages.some(m => m.id === payload.id);
              if (!exists) {
                state.chat.messages.push(payload);
                localStorage.setItem("romantic_chat_history", JSON.stringify(state.chat.messages));
                renderChatMessages();
                
                // Play notification sound
                if (payload.sender !== state.chat.currentUser) {
                  playTickSound();
                }
              }
            }
          }
        } catch(e) {}
      };
      
      state.chat.eventSource.onerror = (e) => {
        console.warn("SSE connection interrupted. Reconnecting...");
      };
    } catch(err) {
      console.error("SSE init error:", err);
    }
  }

  function renderChatMessages() {
    const thread = document.getElementById("chat-messages-thread");
    if (!thread) return;

    thread.innerHTML = "";
    
    if (state.chat.messages.length === 0) {
      thread.innerHTML = `
        <div class="text-center my-auto p-6 text-gray-400 italic text-xs">
          <p class="text-2xl mb-2">✨💌✨</p>
          <p>This is the start of your private chat history.</p>
          <p class="mt-1">Send a message to say hello!</p>
        </div>
      `;
      return;
    }

    state.chat.messages.forEach(msg => {
      const bubble = document.createElement("div");
      const isSelf = msg.sender === state.chat.currentUser;
      const date = new Date(msg.time);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      if (isSelf) {
        bubble.className = "bg-pink-500 text-white rounded-2xl rounded-tr-none px-4 py-2 text-xs md:text-sm max-w-[80%] self-end shadow-sm relative group transition transform duration-150 hover:scale-[1.01]";
        bubble.innerHTML = `
          <div class="font-sans leading-relaxed break-words">${escapeHTML(msg.text)}</div>
          <span class="text-[8px] text-pink-100 mt-1 block text-right">${timeStr}</span>
        `;
      } else {
        bubble.className = "bg-purple-100 text-purple-950 rounded-2xl rounded-tl-none px-4 py-2 text-xs md:text-sm max-w-[80%] self-start shadow-sm relative group transition transform duration-150 hover:scale-[1.01] border border-purple-200/50";
        bubble.innerHTML = `
          <div class="text-[9px] font-bold text-purple-700 mb-0.5">${msg.sender}</div>
          <div class="font-sans leading-relaxed break-words">${escapeHTML(msg.text)}</div>
          <span class="text-[8px] text-purple-400 mt-1 block text-left">${timeStr}</span>
        `;
      }
      
      thread.appendChild(bubble);
    });

    // Scroll to bottom
    thread.scrollTop = thread.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  /* =================================================================
     💕 OUTRO / RESTART 💕
     ================================================================= */
  
  const restartBtn = document.getElementById("restart-app-btn");
  restartBtn?.addEventListener("click", () => {
    // Scroll cleanly
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      // Toggle views
      const introScreen = document.getElementById("section-landing");
      const mainApp = document.getElementById("main-app");
      const floatingNav = document.getElementById("floating-nav");

      // Turn off audio
      toggleAudio(true);

      // Hide panels
      mainApp.classList.add("hidden");
      mainApp.classList.remove("opacity-100");
      floatingNav.classList.add("hidden");
      floatingNav.classList.remove("opacity-100");

      introScreen.classList.remove("hidden", "opacity-0", "scale-110");
      
      // Reset variables
      state.secretRoomUnlocked = false;
      if (state.chat.eventSource) {
        state.chat.eventSource.close();
        state.chat.eventSource = null;
      }
      state.chat.currentUser = null;
      localStorage.removeItem("romantic_chat_user");

      state.envelope.isOpen = false;
      state.envelope.isExpanded = false;
      envelopeWrapper?.classList.remove("open");
      envelopeLetter?.classList.remove("expanded", "scale-105");
      document.body.style.overflow = "";

      state.games.completed.clear();
      resetQuiz();
      resetSecretRoom();
      resetSurprise();
    }, 400);
  });

});
