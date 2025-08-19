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