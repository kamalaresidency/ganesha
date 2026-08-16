/**
 * Kamala Residency - Shree Ganesha Festival Celebration
 * Core JavaScript Application & Interactivity
 */

(function () {
  'use strict';

  // --- 1. State Management ---
  const state = {
    images: window.GANESHA_IMAGES || [],
    basePath: 'KR_Ganesha_30_08_25/',
    currentGlimpseIndex: 0,
    glimpseTimer: null,
    isGlimpsePlaying: true,
    gallerySearch: '',
    galleryPage: 1,
    galleryPageSize: 18,
    lightboxIndex: 0,
    isPetalsActive: true,
    audioCtx: null
  };

  function getMetadataForImage(imageName, index) {
    const num = index !== undefined ? index + 1 : '';
    return {
      name: imageName,
      path: state.basePath + imageName,
      title: `Kamala Residency Ganeshotsav 2025`,
      photoNum: num
    };
  }

  // --- 2. Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroVisual();
    initGlimpseSection();
    initGallery();
    initLightbox();
    initExcelControls();
    initPetalShower();
    initSoundEffects();
    initFloatingControls();
  });

  // --- 3. Navigation & Mobile Menu ---
  function initNavigation() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        toggleBtn.textContent = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
      });
    }

    // Smooth scroll and active link spy
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks) {
          navLinks.classList.remove('mobile-open');
          if (toggleBtn) toggleBtn.textContent = '☰';
        }
      });
    });

    // Schedule Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const eventCards = document.querySelectorAll('.event-card');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-day');

        eventCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-day') === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 4. Hero Video Showcase (Playing video/DSC_0106.MOV) ---
  function initHeroVisual() {
    const video = document.getElementById('heroMainVideo');
    const soundBtn = document.getElementById('videoSoundBtn');
    const soundIcon = document.getElementById('videoSoundIcon');
    const soundText = document.getElementById('videoSoundText');
    const playPauseBtn = document.getElementById('videoPlayPauseBtn');
    const playIcon = document.getElementById('videoPlayIcon');
    const fullscreenBtn = document.getElementById('videoFullscreenBtn');

    if (!video) return;

    // Ensure auto-play starts reliably
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Video autoplay requires user interaction:', error);
      });
    }

    // Unmute / Mute Sound Toggle
    if (soundBtn && soundIcon && soundText) {
      soundBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        if (!video.muted) {
          video.volume = 1.0;
          soundIcon.textContent = '🔊';
          soundText.textContent = 'Sound ON';
          soundBtn.style.background = 'var(--gold-primary)';
          soundBtn.style.color = '#000000';
        } else {
          soundIcon.textContent = '🔇';
          soundText.textContent = 'Unmute';
          soundBtn.style.background = '';
          soundBtn.style.color = '';
        }
      });
    }

    // Play / Pause Toggle
    if (playPauseBtn && playIcon) {
      playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playIcon.textContent = '⏸';
        } else {
          video.pause();
          playIcon.textContent = '▶';
        }
      });

      video.addEventListener('play', () => {
        playIcon.textContent = '⏸';
      });

      video.addEventListener('pause', () => {
        playIcon.textContent = '▶';
      });
    }

    // Fullscreen Toggle
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      });
    }
  }

  // --- 5. "Glimpse of Past Celebrations" Feature (User Requirement #1) ---
  function initGlimpseSection() {
    if (!state.images.length) return;

    const shuffleBtn = document.getElementById('shuffleGlimpseBtn');
    const togglePlayBtn = document.getElementById('toggleGlimpsePlay');
    const primaryImg = document.getElementById('primaryGlimpseImg');
    const primaryTitle = document.getElementById('primaryGlimpseTitle');
    const primaryCounter = document.getElementById('glimpseCounter');
    const secondaryStack = document.getElementById('glimpseSecondaryStack');

    function renderGlimpse() {
      if (!state.images.length) return;
      const count = state.images.length;
      const randMain = Math.floor(Math.random() * count);
      state.currentGlimpseIndex = randMain;

      const mainMeta = getMetadataForImage(state.images[randMain], randMain);

      if (primaryImg) {
        primaryImg.style.opacity = '0';
        setTimeout(() => {
          primaryImg.src = mainMeta.path;
          primaryImg.onload = () => { primaryImg.style.opacity = '1'; };
        }, 150);
      }

      if (primaryTitle) primaryTitle.textContent = `Kamala Residency Ganeshotsav 2025`;
      if (primaryCounter) primaryCounter.textContent = `Memory #${randMain + 1} of ${count}`;

      // Pick 3 random unique secondary memories
      if (secondaryStack) {
        secondaryStack.innerHTML = '';
        const picked = new Set([randMain]);

        while (picked.size < Math.min(4, count)) {
          picked.add(Math.floor(Math.random() * count));
        }

        const secondaryIndices = Array.from(picked).slice(1);
        secondaryIndices.forEach(idx => {
          const meta = getMetadataForImage(state.images[idx], idx);
          const item = document.createElement('div');
          item.className = 'secondary-memory-item';
          item.innerHTML = `
            <div class="secondary-memory-thumb">
              <img src="${meta.path}" alt="Kamala Residency Celebration Memory" loading="lazy" />
            </div>
            <div class="secondary-memory-details">
              <h4>Festival Memory #${idx + 1}</h4>
              <p>Kamala Residency 2025</p>
            </div>
          `;
          item.addEventListener('click', () => {
            openLightbox(idx);
          });
          secondaryStack.appendChild(item);
        });
      }
    }

    // Initial render
    renderGlimpse();

    // Shuffle Button Event
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        const dice = shuffleBtn.querySelector('.shuffle-dice-icon');
        if (dice) dice.style.transform = `rotate(${Math.floor(Math.random() * 360 + 360)}deg)`;
        renderGlimpse();
        playTempleChime();
      });
    }

    // Auto Play Slideshow
    function startAutoPlay() {
      stopAutoPlay();
      state.glimpseTimer = setInterval(renderGlimpse, 7000);
      if (togglePlayBtn) {
        togglePlayBtn.classList.add('active');
        togglePlayBtn.innerHTML = '<span>⏸</span> Auto-Play ON';
      }
    }

    function stopAutoPlay() {
      if (state.glimpseTimer) clearInterval(state.glimpseTimer);
      if (togglePlayBtn) {
        togglePlayBtn.classList.remove('active');
        togglePlayBtn.innerHTML = '<span>▶</span> Auto-Play OFF';
      }
    }

    if (togglePlayBtn) {
      togglePlayBtn.addEventListener('click', () => {
        state.isGlimpsePlaying = !state.isGlimpsePlaying;
        if (state.isGlimpsePlaying) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    }

    if (state.isGlimpsePlaying) {
      startAutoPlay();
    }

    // Zoom primary click
    const zoomBtn = document.getElementById('primaryGlimpseZoom');
    const holder = document.getElementById('primaryGlimpseHolder');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(state.currentGlimpseIndex);
      });
    }
    if (holder) {
      holder.addEventListener('click', () => {
        openLightbox(state.currentGlimpseIndex);
      });
    }
  }

  // --- 6. Photo Gallery Grid (Lazy & Paginated 276+ Photos) ---
  function initGallery() {
    const grid = document.getElementById('galleryGrid');
    const searchInput = document.getElementById('gallerySearchInput');
    const loadMoreBtn = document.getElementById('loadMoreGalleryBtn');
    const galleryCountBadge = document.getElementById('galleryCountBadge');

    if (!grid || !state.images.length) return;

    if (galleryCountBadge) {
      galleryCountBadge.textContent = `276 Celebration Memories`;
    }

    function getFilteredList() {
      return state.images.filter((img, idx) => {
        const photoNum = (idx + 1).toString();
        const matchSearch = !state.gallerySearch || 
          img.toLowerCase().includes(state.gallerySearch.toLowerCase()) ||
          photoNum.includes(state.gallerySearch.toLowerCase()) ||
          `photo ${photoNum}`.includes(state.gallerySearch.toLowerCase());
        return matchSearch;
      });
    }

    function renderGallery(append = false) {
      const filtered = getFilteredList();
      const total = filtered.length;

      if (!append) {
        grid.innerHTML = '';
        state.galleryPage = 1;
      }

      const limit = state.galleryPage * state.galleryPageSize;
      const itemsToShow = filtered.slice((state.galleryPage - 1) * state.galleryPageSize, limit);

      if (itemsToShow.length === 0 && !append) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">
            <p style="font-size: 1.2rem;">No celebration memories found matching your search.</p>
            <button class="btn-shuffle" style="margin-top: 1rem;" id="resetGallerySearch">Reset Search</button>
          </div>
        `;
        const resetBtn = document.getElementById('resetGallerySearch');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            state.gallerySearch = '';
            renderGallery(false);
          });
        }
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
      }

      itemsToShow.forEach(img => {
        const originalIndex = state.images.indexOf(img);
        const meta = getMetadataForImage(img, originalIndex);

        const card = document.createElement('div');
        card.className = 'gallery-item';
        card.innerHTML = `
          <img src="${meta.path}" alt="Kamala Residency Celebration Memory #${originalIndex + 1}" loading="lazy" />
          <div class="gallery-item-overlay">
            <h4 class="gallery-item-title">Photo #${originalIndex + 1}</h4>
            <span class="gallery-item-tag">🔍 Click to View HD</span>
          </div>
        `;
        card.addEventListener('click', () => {
          openLightbox(originalIndex);
        });
        grid.appendChild(card);
      });

      if (loadMoreBtn) {
        if (limit < total) {
          loadMoreBtn.style.display = 'inline-flex';
          loadMoreBtn.innerHTML = `<span>📂</span> Load More Memories (${total - limit} remaining)`;
        } else {
          loadMoreBtn.style.display = 'none';
        }
      }
    }

    // Search Input
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.gallerySearch = e.target.value.trim();
          renderGallery(false);
        }, 250);
      });
    }

    // Load More Button
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        state.galleryPage++;
        renderGallery(true);
      });
    }

    // Initial render
    renderGallery(false);
  }

  // --- 7. Fullscreen Lightbox Modal ---
  function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');

    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  function openLightbox(index) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    const title = document.getElementById('lightboxTitle');

    if (!modal || !state.images.length) return;

    state.lightboxIndex = (index + state.images.length) % state.images.length;
    const meta = getMetadataForImage(state.images[state.lightboxIndex], state.lightboxIndex);

    if (img) img.src = meta.path;
    if (counter) counter.textContent = `Photo ${state.lightboxIndex + 1} of ${state.images.length}`;
    if (title) title.textContent = `Kamala Residency Ganeshotsav 2025`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function navigateLightbox(direction) {
    openLightbox(state.lightboxIndex + direction);
  }

  // --- 8. Excel Transparency Container Controls (Mobile & Desktop) ---
  function initExcelControls() {
    const container = document.getElementById('excelDashboardContainer');
    const iframe = document.getElementById('excelIframe');
    const fullscreenBtn = document.getElementById('excelFullscreenBtn');
    const mobileFullscreenBtn = document.getElementById('excelMobileFullscreenBtn');
    const exitFsBtn = document.getElementById('excelExitFsBtn');
    const reloadBtn = document.getElementById('excelReloadBtn');
    const mobileReloadBtn = document.getElementById('excelMobileReloadBtn');

    function toggleFullscreen() {
      if (!container) return;
      const isFs = container.classList.toggle('is-fullscreen-mode');

      if (isFs) {
        document.body.style.overflow = 'hidden';
        if (fullscreenBtn) fullscreenBtn.innerHTML = '<span>✕</span> Exit Fullscreen';
        if (mobileFullscreenBtn) {
          const textSpan = mobileFullscreenBtn.querySelector('.fs-text');
          if (textSpan) textSpan.textContent = '✕ Exit Fullscreen';
        }
      } else {
        document.body.style.overflow = '';
        if (fullscreenBtn) fullscreenBtn.innerHTML = '<span>⛶</span> Fullscreen';
        if (mobileFullscreenBtn) {
          const textSpan = mobileFullscreenBtn.querySelector('.fs-text');
          if (textSpan) textSpan.textContent = 'Expand / Fullscreen Sheet';
        }
      }
    }

    if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
    if (mobileFullscreenBtn) mobileFullscreenBtn.addEventListener('click', toggleFullscreen);
    if (exitFsBtn) exitFsBtn.addEventListener('click', toggleFullscreen);

    // Escape key closes fullscreen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && container && container.classList.contains('is-fullscreen-mode')) {
        toggleFullscreen();
      }
    });

    function reloadExcel() {
      if (!iframe) return;
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 150);
    }

    if (reloadBtn) reloadBtn.addEventListener('click', reloadExcel);
    if (mobileReloadBtn) mobileReloadBtn.addEventListener('click', reloadExcel);
  }

  // --- 9. Falling Flower Petal Physics Simulation ---
  function initPetalShower() {
    const canvas = document.getElementById('petalCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = 35;
    const petals = [];

    // Marigold golden & Rose petals
    const colors = [
      { r: 245, g: 158, b: 11, a: 0.8 }, // Saffron Marigold
      { r: 251, g: 191, b: 36, a: 0.85 }, // Bright Yellow Marigold
      { r: 225, g: 29, b: 72, a: 0.75 }, // Sacred Crimson Rose
      { r: 244, g: 63, b: 94, a: 0.8 }   // Rose Pink
    ];

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20 - Math.random() * 50;
        this.size = 8 + Math.random() * 12;
        this.speedY = 1 + Math.random() * 2.2;
        this.speedX = -0.6 + Math.random() * 1.2;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.04;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.angle) * 0.8 + this.speedX;
        this.angle += this.angleSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(1, Math.sin(this.flip));

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);

        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.4)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      const p = new Petal();
      p.y = Math.random() * height; // distribute initially
      petals.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      if (state.isPetalsActive) {
        petals.forEach(p => {
          p.update();
          p.draw();
        });
      }

      requestAnimationFrame(animate);
    }

    animate();

    const petalToggleBtn = document.getElementById('togglePetalsBtn');
    if (petalToggleBtn) {
      petalToggleBtn.addEventListener('click', () => {
        state.isPetalsActive = !state.isPetalsActive;
        petalToggleBtn.classList.toggle('active', state.isPetalsActive);
      });
    }
  }

  // --- 10. Temple Chime Synthesizer (Web Audio API) ---
  function initSoundEffects() {
    const audioBtn = document.getElementById('toggleAudioBtn');

    function playChime() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!state.audioCtx) state.audioCtx = new AudioContext();
        if (state.audioCtx.state === 'suspended') state.audioCtx.resume();

        const now = state.audioCtx.currentTime;

        // Frequencies for pure harmonious Indian temple bell (Pentatonic harmony)
        const bellFrequencies = [523.25, 659.25, 783.99, 1046.50];

        bellFrequencies.forEach((freq, i) => {
          const osc = state.audioCtx.createOscillator();
          const gain = state.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.005), now + i * 0.06);

          gain.gain.setValueAtTime(0, now + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.2 / (i + 1), now + i * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 3.0);

          osc.connect(gain);
          gain.connect(state.audioCtx.destination);

          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 3.2);
        });
      } catch (err) {
        console.warn('Audio chime error:', err);
      }
    }

    window.playTempleChime = playChime;

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        playChime();
        audioBtn.classList.add('active');
        setTimeout(() => audioBtn.classList.remove('active'), 1500);
      });
    }
  }

  // --- 11. Floating Action Controls ---
  function initFloatingControls() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const shareBtn = document.getElementById('shareFestiveBtn');

    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          scrollTopBtn.style.display = 'flex';
        } else {
          scrollTopBtn.style.display = 'none';
        }
      });

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({
            title: 'Kamala Residency Shree Ganesha Festival 2026',
            text: 'Check out the Kamala Residency Ganesha Utsav celebration, live fund transparency sheet, and photo memories!',
            url: window.location.href
          }).catch(console.warn);
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Celebration website link copied to clipboard! Share with Kamala Residency neighbors.');
        }
      });
    }
  }

})();
