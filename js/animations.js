/* ============================================
   WINE'S LIFE PRIVATE MEMBERS
   Luxury Animations Engine v2
   GSAP + ScrollTrigger + Lenis + Custom Cursor
   + Horizontal Scroll + Text Scramble + 3D Tilt
   + Word-by-Word + Grain + Marquee
   Ref: Veuve Clicquot · Krug · Dom Pérignon
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== PAGE LOADER ==========
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');

  if (loader && loaderFill) {
    gsap.to(loaderFill, {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            initAnimations();
          }
        });
      }
    });
  } else {
    initAnimations();
  }

  function initAnimations() {

    // ========== LENIS SMOOTH SCROLL ==========
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ========== CUSTOM CURSOR ==========
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');

    if (cursor && cursorDot && window.innerWidth > 768) {
      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;
      let dotX = 0, dotY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      const hoverTargets = document.querySelectorAll('a, button, .btn, .hscroll-card, .benefit-item, .home-pillar, .partner-item, .card');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorDot.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorDot.classList.remove('hover'); });
      });

      document.addEventListener('mousedown', () => cursor.classList.add('click'));
      document.addEventListener('mouseup', () => cursor.classList.remove('click'));

      document.body.style.cursor = 'none';
      document.querySelectorAll('a, button').forEach(el => el.style.cursor = 'none');
    }

    // ========== GSAP REGISTER ==========
    gsap.registerPlugin(ScrollTrigger);

    // ========== HERO ANIMATIONS ==========
    const heroTimeline = gsap.timeline({ delay: 0.3 });
    const heroEls = {
      eyebrow: document.querySelector('.hero__eyebrow'),
      title: document.querySelector('.hero__title'),
      subtitle: document.querySelector('.hero__subtitle'),
      divider: document.querySelector('.hero__divider'),
      desc: document.querySelector('.hero__description'),
      cta: document.querySelector('.hero__cta'),
      scroll: document.querySelector('.hero__scroll'),
    };

    Object.values(heroEls).forEach(el => {
      if (el) { el.style.animation = 'none'; el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; }
    });
    if (heroEls.divider) heroEls.divider.style.transform = 'scaleX(0)';

    heroTimeline
      .to(heroEls.eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to(heroEls.title, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.5')
      .to(heroEls.subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
      .to(heroEls.divider, { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.5')
      .to(heroEls.desc, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to(heroEls.cta, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .to(heroEls.scroll, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

    // Hero parallax
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
      gsap.to(heroBg, { y: 200, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
    }

    // Hero content fade
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      gsap.to(heroContent, { opacity: 0, y: -80, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: '80% top', scrub: 0.5 } });
    }

    // ========== SCROLL-LINKED VIDEO ==========
    const heroVideo = document.querySelector('.hero__bg video');
    if (heroVideo) {
      heroVideo.pause();
      // Play video on load, but also link speed to scroll
      heroVideo.play();

      let lastScrollY = 0;
      let scrollSpeed = 0;

      lenis.on('scroll', ({ velocity }) => {
        scrollSpeed = Math.abs(velocity);
        // Slow down video when scrolling fast (cinematic feel)
        if (heroVideo.playbackRate !== undefined) {
          const rate = Math.max(0.2, 1 - scrollSpeed * 0.001);
          heroVideo.playbackRate = Math.min(rate, 1);
        }
      });
    }

    // ========== SECTION REVEALS ==========
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';

      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // ========== MANIFESTO LINES ==========
    document.querySelectorAll('.manifesto-lines p').forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(30px)';
      line.classList.remove('visible');

      gsap.to(line, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: i * 0.15,
        scrollTrigger: { trigger: line, start: 'top 80%', toggleActions: 'play none none none' }
      });
    });

    // ========== HR ANIMATION ==========
    document.querySelectorAll('.hr').forEach(hr => {
      gsap.fromTo(hr, { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.5, ease: 'power2.inOut', scrollTrigger: { trigger: hr, start: 'top 90%', toggleActions: 'play none none none' } }
      );
    });

    // ========== SECTION DIVIDERS ==========
    document.querySelectorAll('.section__divider').forEach(div => {
      gsap.fromTo(div, { scaleX: 0, transformOrigin: 'center' },
        { scaleX: 1, duration: 1, ease: 'power2.inOut', scrollTrigger: { trigger: div, start: 'top 85%', toggleActions: 'play none none none' } }
      );
    });

    // ========== BENEFITS STAGGER (legacy grid) ==========
    const benefitItems = document.querySelectorAll('.benefit-item');
    if (benefitItems.length > 0) {
      gsap.fromTo(benefitItems, { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.benefits-grid', start: 'top 80%', toggleActions: 'play none none none' } }
      );
    }

    // ========== BENEFITS EDITORIAL ==========
    document.querySelectorAll('.benefits-editorial .benefit-row, .bp-row:not(.bp-row--text-only)').forEach((row, i) => {
      const image = row.querySelector('.benefit-row__image, .bp-row__image');
      const content = row.querySelector('.benefit-row__content, .bp-row__content');
      const img = image ? image.querySelector('img') : null;
      const isEven = i % 2 === 1;

      // Image clip-path reveal
      if (image) {
        const clipFrom = isEven ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
        gsap.fromTo(image,
          { clipPath: clipFrom },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' }
          }
        );
      }

      // Image parallax
      if (img) {
        gsap.fromTo(img,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.4 }
          }
        );
      }

      // Content fade-up
      if (content) {
        const children = content.children;
        gsap.fromTo(children,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
      }
    });

    // ========== EDITORIAL ROWS (journeys, allocation) ==========
    // NOTE: .pm-row is handled by page-specific animations in private-members.html
    document.querySelectorAll('.journey-full, .alloc-row').forEach((row, i) => {
      const image = row.querySelector('.journey-full__img, .alloc-row__image');
      const content = row.querySelector('.journey-full__content, .alloc-row__content');
      const img = image ? image.querySelector('img') : null;
      const isEven = i % 2 === 1;

      if (image) {
        const clipFrom = isEven ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
        gsap.fromTo(image,
          { clipPath: clipFrom },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' }
          }
        );
      }

      if (img) {
        gsap.fromTo(img,
          { scale: 1.15 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.4 }
          }
        );
      }

      if (content) {
        gsap.fromTo(content.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
      }
    });

    // ========== PILLAR STAGGER ==========
    const pillars = document.querySelectorAll('.home-pillar');
    if (pillars.length > 0) {
      gsap.fromTo(pillars, { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.home-pillars', start: 'top 80%', toggleActions: 'play none none none' } }
      );
    }

    // ========== FOUNDING COUNTER ==========
    const foundingNumber = document.querySelector('.founding__number');
    if (foundingNumber) {
      const target = parseInt(foundingNumber.dataset.count) || 100;
      foundingNumber.textContent = '0';
      gsap.to({ val: 0 }, {
        val: target, duration: 2.5, ease: 'power2.out',
        scrollTrigger: { trigger: foundingNumber, start: 'top 80%', toggleActions: 'play none none none' },
        onUpdate: function() { foundingNumber.textContent = Math.round(this.targets()[0].val); }
      });
    }

    // ========== EYEBROW LETTER SPACING ==========
    document.querySelectorAll('.section__eyebrow').forEach(eyebrow => {
      gsap.fromTo(eyebrow, { letterSpacing: '0.1em', opacity: 0 },
        { letterSpacing: '0.35em', opacity: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: eyebrow, start: 'top 85%', toggleActions: 'play none none none' } }
      );
    });

    // ========== MAGNETIC BUTTONS ==========
    document.querySelectorAll('.btn').forEach(btn => {
      if (window.innerWidth <= 768) return;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });

    // ========== NAV HIDE/SHOW ==========
    const nav = document.querySelector('.nav');
    if (nav) {
      ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 400) {
            gsap.to(nav, { y: -100, duration: 0.4, ease: 'power2.in' });
          } else {
            gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.out' });
          }
        }
      });
    }

    // ========== PARALLAX ON HEADERS ==========
    document.querySelectorAll('.section__header').forEach(header => {
      gsap.to(header, { y: -30, ease: 'none', scrollTrigger: { trigger: header, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });
    });

    // ========== HORIZONTAL SCROLL — JOURNEYS ==========
    const hscrollSection = document.getElementById('journeysHscroll');
    const hscrollTrack = document.getElementById('journeysTrack');

    if (hscrollSection && hscrollTrack) {
      const cards = hscrollTrack.querySelectorAll('.hscroll-card');
      const totalScrollWidth = () => hscrollTrack.scrollWidth - window.innerWidth + 100;

      // Pin and scroll horizontally
      gsap.to(hscrollTrack, {
        x: () => -totalScrollWidth(),
        ease: 'none',
        scrollTrigger: {
          trigger: hscrollSection,
          start: 'top top',
          end: () => `+=${totalScrollWidth()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      // Stagger cards in — all at once when section enters
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: hscrollSection,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    }

    // ========== 3D TILT ON CARDS ==========
    const tiltTargets = document.querySelectorAll('.hscroll-card, .home-pillar');
    tiltTargets.forEach(card => {
      if (window.innerWidth <= 768) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * 12; // vertical tilt
        const tiltY = (x - 0.5) * -12; // horizontal tilt

        gsap.to(card, {
          rotateX: tiltX,
          rotateY: tiltY,
          transformPerspective: 800,
          duration: 0.4,
          ease: 'power2.out',
        });

        // Update shine position
        card.style.setProperty('--mouse-x', (x * 100) + '%');
        card.style.setProperty('--mouse-y', (y * 100) + '%');
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
        });
      });

      // Add shine overlay
      const shine = document.createElement('div');
      shine.style.cssText = `
        position: absolute; inset: 0; pointer-events: none; opacity: 0;
        background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08) 0%, transparent 60%);
        transition: opacity 0.4s ease;
      `;
      card.style.position = 'relative';
      card.style.transformStyle = 'preserve-3d';
      card.appendChild(shine);
      card.addEventListener('mouseenter', () => shine.style.opacity = '1');
      card.addEventListener('mouseleave', () => shine.style.opacity = '0');
    });

    // ========== TEXT SCRAMBLE ==========
    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&·×÷';

    function scrambleText(element) {
      const original = element.textContent;
      const length = original.length;
      let iteration = 0;

      const interval = setInterval(() => {
        element.textContent = original.split('').map((char, i) => {
          if (i < iteration) return original[i];
          if (char === ' ') return ' ';
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');

        iteration += 1 / 2;
        if (iteration >= length) {
          clearInterval(interval);
          element.textContent = original;
        }
      }, 40);
    }

    // Trigger scramble on scroll
    document.querySelectorAll('[data-scramble]').forEach(el => {
      const originalText = el.textContent;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => scrambleText(el),
      });
    });

    // ========== WORD-BY-WORD OPACITY ==========
    const wbwElement = document.getElementById('wordByWord');
    if (wbwElement) {
      const text = wbwElement.textContent.trim();
      const words = text.split(/\s+/);
      wbwElement.innerHTML = words.map(w => `<span class="wbw-word">${w}</span>`).join(' ');

      const wbwWords = wbwElement.querySelectorAll('.wbw-word');
      const totalWords = wbwWords.length;

      ScrollTrigger.create({
        trigger: '#stickyText',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIndex = Math.floor(progress * totalWords * 1.2); // slightly faster

          wbwWords.forEach((word, i) => {
            if (i <= activeIndex) {
              word.classList.add('active');
            } else {
              word.classList.remove('active');
            }
          });
        }
      });
    }

    // ========== IMAGE CLIP-PATH REVEAL ==========
    // Apply to journey card backgrounds
    document.querySelectorAll('.hscroll-card__bg').forEach((bg, i) => {
      gsap.fromTo(bg,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: bg.closest('.hscroll-card') || bg,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.1,
        }
      );
    });

    // ========== CTA BLOCK ==========
    const ctaBlock = document.querySelector('.home-cta-block');
    if (ctaBlock) {
      gsap.fromTo(ctaBlock, { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: ctaBlock, start: 'top 80%', toggleActions: 'play none none none' } }
      );
    }

    // ========== SCROLL PROGRESS BAR ==========
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      z-index: 10001; transform-origin: left; transform: scaleX(0);
    `;
    document.body.appendChild(progressBar);

    gsap.to(progressBar, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });

    // ========== STATS PARALLAX STAGGER ==========
    const stats = document.querySelectorAll('.stat');
    if (stats.length > 0) {
      gsap.fromTo(stats, { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.stats', start: 'top 80%', toggleActions: 'play none none none' } }
      );
    }

    // ========== SECTION TITLE CLIP-PATH REVEAL ==========
    document.querySelectorAll('.section__title').forEach(title => {
      gsap.fromTo(title,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // ========== DESCRIPTION LINE-BY-LINE REVEAL ==========
    document.querySelectorAll('.section__description').forEach(desc => {
      // Split text into wrapped lines using a temporary span approach
      const text = desc.textContent.trim();
      const words = text.split(/\s+/);
      desc.innerHTML = words.map(w => `<span style="display:inline-block; opacity:0; transform:translateY(12px);">${w}</span>`).join(' ');

      const wordSpans = desc.querySelectorAll('span');
      gsap.to(wordSpans, {
        opacity: 1, y: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: desc, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    // ========== "O QUE É" CARDS — HOVER GLOW ==========
    document.querySelectorAll('.section__inner [style*="background: var(--noir)"]').forEach(card => {
      if (window.innerWidth <= 768) return;

      card.style.position = 'relative';
      card.style.overflow = 'hidden';

      const glow = document.createElement('div');
      glow.style.cssText = `
        position: absolute; inset: 0; pointer-events: none; opacity: 0;
        background: radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.06) 0%, transparent 60%);
        transition: opacity 0.4s ease;
      `;
      card.appendChild(glow);

      card.addEventListener('mouseenter', () => glow.style.opacity = '1');
      card.addEventListener('mouseleave', () => glow.style.opacity = '0');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        glow.style.setProperty('--glow-x', x + '%');
        glow.style.setProperty('--glow-y', y + '%');
      });
    });

    // Logo slider — pure CSS animation, no scroll interference

    // ========== PARALLAX DEPTH LAYERS ==========
    // Eyebrows move slower, titles move faster — creates depth
    document.querySelectorAll('.section__eyebrow').forEach(el => {
      gsap.to(el, {
        y: -15, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.2 }
      });
    });

    // Founding number parallax
    const foundingNum = document.querySelector('.founding__number');
    if (foundingNum) {
      gsap.to(foundingNum, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: foundingNum, start: 'top bottom', end: 'bottom top', scrub: 0.3 }
      });
    }

    // ========== PARTNER GRID — STAGGER REVEAL ==========
    const partnerItems = document.querySelectorAll('.partner-item');
    if (partnerItems.length > 0) {
      gsap.fromTo(partnerItems,
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.partner-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );

      // ========== PARTNER ITEMS — 3D TILT + GLOW ==========
      partnerItems.forEach(card => {
        if (window.innerWidth <= 768) return;

        card.style.transformStyle = 'preserve-3d';

        // 3D Tilt
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const tiltX = (y - 0.5) * 10;
          const tiltY = (x - 0.5) * -10;

          gsap.to(card, {
            rotateX: tiltX,
            rotateY: tiltY,
            transformPerspective: 800,
            duration: 0.4,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
          });
        });

        // Glow effect
        const glow = document.createElement('div');
        glow.style.cssText = `
          position: absolute; inset: 0; pointer-events: none; opacity: 0;
          background: radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.07) 0%, transparent 55%);
          transition: opacity 0.4s ease;
        `;
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(glow);

        card.addEventListener('mouseenter', () => glow.style.opacity = '1');
        card.addEventListener('mouseleave', () => glow.style.opacity = '0');
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          glow.style.setProperty('--glow-x', x + '%');
          glow.style.setProperty('--glow-y', y + '%');
        });
      });
    }

    // ========== FOOTER REVEAL ==========
    const footer = document.querySelector('.footer');
    if (footer) {
      gsap.fromTo(footer, { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: footer, start: 'top 90%', toggleActions: 'play none none none' } }
      );
    }

  } // end initAnimations

});
