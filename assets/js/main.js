/* ============================
   BYTESITE Interactions (vanilla JS)
   What this file does:
   - Smooth scroll for section links
   - Navbar link highlighting while scrolling
   - Back-to-top button behavior
   - Simple application form handling (mock)
   ============================ */

   document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for in-page links (e.g., #programs, #contact)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', href); // update URL hash
          }
        }
      });
    });
  
    // Back to Top button
    const backToTop = document.getElementById('backToTop');
    const showBackToTop = () => {
      if (window.scrollY > 400) {
        backToTop?.classList.add('show');
      } else {
        backToTop?.classList.remove('show');
      }
    };
    window.addEventListener('scroll', showBackToTop);
    backToTop?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    showBackToTop();

    // Theme toggle with persistence
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const themeToggle = document.getElementById('themeToggle');
    const applyTheme = (mode) => {
      const isLight = mode === 'light';
      body.classList.toggle('light-theme', isLight);
      // Navbar variant switch
      if (navbar) {
        navbar.classList.toggle('navbar-light', isLight);
        navbar.classList.toggle('navbar-dark', !isLight);
      }
      // Toggle icon
      if (themeToggle) {
        themeToggle.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      }
      localStorage.setItem('theme', mode);
    };

    // Initialize theme from storage or default to dark
    const storedTheme = localStorage.getItem('theme');
    applyTheme(storedTheme ? storedTheme : 'dark');

    themeToggle?.addEventListener('click', () => {
      const current = body.classList.contains('light-theme') ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });

    // Scroll-driven background motion (updates CSS var --bg-shift)
    const updateBgShift = () => {
      const maxShift = 80; // px, more intensity
      const y = Math.min(window.scrollY / 8, maxShift);
      body.style.setProperty('--bg-shift', `${y}px`);
    };
    window.addEventListener('scroll', updateBgShift, { passive: true });
    updateBgShift();

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');

    const updateActiveLink = () => {
      let currentId = '';
      const offset = 100; // adjust for fixed navbar
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top + window.scrollY - offset;
        if (window.scrollY >= top) currentId = sec.id;
      });
      navLinks.forEach(link => {
        if (currentId && link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // Scroll Reveal Animations using IntersectionObserver
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

      const addReveal = (selector, stagger = 0) => {
        const items = document.querySelectorAll(selector);
        items.forEach((el, idx) => {
          el.classList.add('reveal');
          if (stagger > 0) el.style.transitionDelay = `${Math.min(idx * stagger, 400)}ms`;
          observer.observe(el);
        });
      };

      // Apply reveals to key blocks
      addReveal('.hero-content', 0);
      addReveal('.hero-visual', 0);
      addReveal('.pillar-card', 60);
      addReveal('.outcome-item', 60);
      addReveal('.program-card', 80);
      addReveal('.step-item', 50);
      addReveal('.pricing-card', 80);
      addReveal('.promise-card', 0);
      addReveal('.accordion-item', 40);
    }

    // Subtle hero parallax (mouse-based)
    const hero = document.querySelector('.hero-section');
    if (hero && !prefersReduced) {
      const visual = hero.querySelector('.hero-visual');
      const onMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        visual && (visual.style.transform = `translate3d(${x * 12}px, ${y * 12}px, 0)`);
      };
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', () => { if (visual) visual.style.transform = ''; });
    }

    // Place the mast note exactly between navbar end and hero content start
    const mast = document.querySelector('.mast-note');
    if (mast) {
      const placeMast = () => {
        const nav = document.querySelector('.navbar');
        const heroContainer = document.querySelector('.hero-section .container');
        if (!nav || !heroContainer) return;
        const navRect = nav.getBoundingClientRect();
        const heroRect = heroContainer.getBoundingClientRect();
        const pageY = window.scrollY || window.pageYOffset;
        const navBottom = navRect.bottom + pageY;
        const heroTop = heroRect.top + pageY;
        const midY = navBottom + (heroTop - navBottom) / 2;
        mast.style.top = `${midY}px`;
      };
      placeMast();
      window.addEventListener('resize', placeMast);
      window.addEventListener('scroll', placeMast, { passive: true });
    }

    // Typewriter animation for hero headline (character-by-character), run once on load
    const headline = document.querySelector('.letter-animate[data-letters]');
    if (headline) {
      if (!prefersReduced) {
        // Reserve current height to prevent layout shift while typing
        const initialHeight = headline.getBoundingClientRect().height;
        headline.style.minHeight = initialHeight + 'px';
        // Flatten original DOM into a list of { ch, classes[] }
        const chars = [];
        const collect = (node, activeClasses = []) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            for (let i = 0; i < text.length; i++) {
              chars.push({ ch: text[i], classes: activeClasses });
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const next = [...activeClasses];
            if (node.classList && node.classList.length) {
              // Only pass through classes we care about for styling (keep it simple)
              if (node.classList.contains('text-gradient-orange')) next.push('text-gradient-orange');
            }
            node.childNodes.forEach((child) => collect(child, next));
          }
        };
        headline.childNodes.forEach((n) => collect(n, []));

        // Build type container
        const container = document.createElement('span');
        container.className = 'typewriter';
        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        headline.innerHTML = '';
        headline.appendChild(container);
        headline.appendChild(cursor);

        const speed = 45; // ms per character (a bit faster)
        container.innerHTML = '';
        let i = 0;
        const tick = () => {
          if (i < chars.length) {
            const { ch, classes } = chars[i];
            if (classes && classes.includes('text-gradient-orange')) {
              const wrap = document.createElement('span');
              wrap.className = 'text-gradient-orange';
              wrap.textContent = ch;
              container.appendChild(wrap);
            } else {
              container.appendChild(document.createTextNode(ch));
            }
            i++;
            setTimeout(tick, speed);
          } else {
            // Done. Keep final text and gently fade out cursor
            cursor.classList.add('hide');
          }
        };
        tick();
      }
    }

    // Simple application form handling (no backend yet)
    const form = document.getElementById('applicationForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // Browser validation first
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
  
      // Build a friendly message (you can later send this to your backend)
      const data = {
        name: document.getElementById('name')?.value?.trim(),
        email: document.getElementById('email')?.value?.trim(),
        phone: document.getElementById('phone')?.value?.trim(),
        college: document.getElementById('college')?.value?.trim(),
        domain: document.getElementById('domain')?.value,
        duration: document.getElementById('duration')?.value,
        motivation: document.getElementById('motivation')?.value?.trim(),
        scholarship: document.getElementById('scholarship')?.checked || false
      };
  
      // Mock submit: show a success alert and reset the form
      showAlert('Thanks! Your application has been received. We will reach out over email.', 'success');
      form.reset();
  
      // Optional: scroll to alert
      document.querySelector('.contact-section')?.scrollIntoView({ behavior: 'smooth' });
  
      // TODO: Replace this with a real request to your server (fetch/POST)
      // fetch('/api/apply', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    });
  
    // Create and show a temporary Bootstrap-like alert
    function showAlert(message, type = 'success') {
      const container = document.querySelector('.contact-card');
      if (!container) return;
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} mt-3`;
      alert.style.background = type === 'success' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)';
      alert.style.border = '1px solid rgba(255,255,255,.12)';
      alert.style.color = '#e6edf3';
      alert.role = 'alert';
      alert.textContent = message;
      container.prepend(alert);
      setTimeout(() => alert.remove(), 6000);
    }
  });