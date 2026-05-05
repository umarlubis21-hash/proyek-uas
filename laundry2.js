document.addEventListener('DOMContentLoaded', () => {

  const bubblesContainer = document.createElement('div');
  bubblesContainer.className = 'bubbles';
  document.body.prepend(bubblesContainer);

  const bubbleSizes = [18, 28, 38, 50, 65, 80, 100, 120];

  function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const size = bubbleSizes[Math.floor(Math.random() * bubbleSizes.length)];
    const left = Math.random() * 100;
    const duration = 10 + Math.random() * 18;
    const delay = Math.random() * 10;

    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    bubblesContainer.appendChild(bubble);

    setTimeout(() => bubble.remove(), (duration + delay) * 1000);
  }

  for (let i = 0; i < 14; i++) createBubble();

  setInterval(createBubble, 1800);

  const serviceItems = document.querySelectorAll('.container > ul:first-of-type li');

  serviceItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';

    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 400 + i * 150);
  });

  const revealEls = document.querySelectorAll('h2, .container > p, .container > ul:last-of-type li');

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  serviceItems.forEach(item => {
    item.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = item.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(58, 124, 191, 0.15);
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;

      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(1); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const contactItems = document.querySelectorAll('.container > ul:last-of-type li');

  contactItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.title = 'Klik untuk menyalin';

    item.addEventListener('click', () => {
      const text = item.textContent.trim().replace(/^[✉☎]\s*/, '');
      const value = text.includes(':') ? text.split(':').slice(1).join(':').trim() : text;

      navigator.clipboard.writeText(value).then(() => {
        const original = item.innerHTML;
        item.innerHTML = '✓ Tersalin!';
        item.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

        setTimeout(() => {
          item.innerHTML = original;
          item.style.background = '';
        }, 1800);
      }).catch(() => {
        showToast('Salin: ' + value);
      });
    });
  });

  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #1f5f9e;
      color: white;
      padding: 12px 28px;
      border-radius: 50px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      box-shadow: 0 8px 24px rgba(31,95,158,0.35);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 350);
    }, 2500);
  }

  const h1 = document.querySelector('h1');
  if (h1) {
    h1.style.cursor = 'default';
    h1.addEventListener('mouseenter', () => {
      h1.classList.add('washing');
      if (!document.getElementById('washing-style')) {
        const style = document.createElement('style');
        style.id = 'washing-style';
        style.textContent = `
          h1.washing::before {
            animation: spin 0.6s linear infinite !important;
            color: #3a7cbf !important;
          }
        `;
        document.head.appendChild(style);
      }
    });
    h1.addEventListener('mouseleave', () => {
      h1.classList.remove('washing');
    });
  }

});