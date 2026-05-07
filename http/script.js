// ===== NAVIGATION SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('navLinks').classList.remove('open');
}

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in, .timeline-item').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
const counterData = [
  { id: 'countCountries', target: 12 },
  { id: 'countCities', target: 28 },
  { id: 'countPhotos', target: 2460 },
  { id: 'countStories', target: 15 },
];

let counterStarted = false;
function animateCounters() {
  if (counterStarted) return;
  counterStarted = true;
  counterData.forEach(({ id, target }) => {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current.toLocaleString();
    }, 30);
  });
}

const mapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) animateCounters(); });
}, { threshold: 0.3 });
const mapEl = document.querySelector('.map-stats');
if (mapEl) mapObserver.observe(mapEl);

// ===== MAP TOOLTIP =====
document.querySelectorAll('.world-map svg path.visited').forEach(path => {
  const tooltip = document.getElementById('mapTooltip');
  path.addEventListener('mouseenter', (e) => {
    tooltip.textContent = path.dataset.tooltip || '';
    tooltip.style.display = 'block';
  });
  path.addEventListener('mousemove', (e) => {
    const rect = document.querySelector('.world-map').getBoundingClientRect();
    tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
    tooltip.style.top = (e.clientY - rect.top - 40) + 'px';
  });
  path.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
});

// ===== DESTINATION FILTERS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.dest-card').forEach(card => {
      if (filter === 'all' || card.dataset.region === filter) {
        card.style.display = '';
        card.style.animation = 'fadeUp 0.6s ease-out forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ===== GALLERY TABS =====
document.querySelectorAll('.gallery-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // In a real site, this would switch between photos and vlogs
  });
});

// ===== LIGHTBOX =====
const galleryImages = [
  { src: 'images/hero_iceland.png', caption: '冰岛 · 杰古沙龙冰河湖' },
  { src: 'images/dest_kyoto.png', caption: '京都 · 清水寺秋色' },
  { src: 'images/dest_tokyo.png', caption: '东京 · 涩谷雨夜' },
  { src: 'images/dest_santorini.png', caption: '圣托里尼 · 伊亚日落' },
  { src: 'images/dest_patagonia.png', caption: '巴塔哥尼亚 · 百内三塔' },
  { src: 'images/dest_morocco.png', caption: '马拉喀什 · 香料市场' },
  { src: 'images/dest_norway.png', caption: '挪威 · 盖朗厄尔峡湾' },
  { src: 'images/dest_bali.png', caption: '巴厘岛 · 德格拉朗梯田' },
];
let currentLightboxIndex = 0;

function openLightbox(index) {
  currentLightboxIndex = index;
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = galleryImages[index].src;
  document.getElementById('lightboxCaption').textContent = galleryImages[index].caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  document.getElementById('lightboxImg').src = galleryImages[currentLightboxIndex].src;
  document.getElementById('lightboxCaption').textContent = galleryImages[currentLightboxIndex].caption;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Click overlay to close
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});

// ===== DETAIL PAGE (SPA-style modal, simplified) =====
function openDetail(dest) {
  // In a full implementation, this would navigate to a detail page
  // For now, we'll open the lightbox with the corresponding image
  const destMap = {
    kyoto: 1, santorini: 3, patagonia: 4,
    tokyo: 2, morocco: 5, norway: 6, bali: 7, iceland: 0
  };
  if (destMap[dest] !== undefined) openLightbox(destMap[dest]);
}

// ===== SMOOTH REVEAL ON LOAD =====
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
