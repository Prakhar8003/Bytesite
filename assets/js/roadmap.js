document.addEventListener('DOMContentLoaded', () => {
  const sections = {
    devops: document.getElementById('rm-devops'),
    cloud: document.getElementById('rm-cloud'),
    ai: document.getElementById('rm-ai'),
    data: document.getElementById('rm-data')
  };
  const empty = document.getElementById('roadmapEmpty');
  const selectorLinks = Array.from(document.querySelectorAll('a[href^="roadmap.html?domain="]'));

  const scrollToContent = () => {
    const y = (empty?.offsetTop || 0) - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const highlightCard = (key) => {
    // Remove any previous temp highlight
    selectorLinks.forEach(a => a.querySelector('.program-card')?.classList.remove('border-orange'));
    const active = document.querySelector(`a[href*="?domain=${key}"] .program-card`);
    active?.classList.add('border-orange');
  };

  const showDomain = (key) => {
    // Hide all
    Object.values(sections).forEach(sec => sec?.classList.add('d-none'));
    empty?.classList.add('d-none');

    const target = sections[key];
    if (target) {
      target.classList.remove('d-none');
      highlightCard(key);
      // Update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('domain', key);
      history.replaceState({}, '', url);
      scrollToContent();
    } else {
      empty?.classList.remove('d-none');
    }
  };

  // Hook selector links to avoid full page reload
  selectorLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const url = new URL(a.href);
      const key = url.searchParams.get('domain');
      if (key) showDomain(key);
    });
  });

  // Init from URL
  const initial = new URL(window.location.href).searchParams.get('domain');
  if (initial && sections[initial]) {
    showDomain(initial);
  }
});
