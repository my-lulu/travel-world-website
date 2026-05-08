// ===== DYNAMIC VISITED COUNTRIES CONFIGURATION =====
// 修改这个数组即可动态点亮新国家！支持 ISO 3位国家代码: CHN, JPN, ISL, GRC, ARG, MAR, NOR, IDN, USA, AUS
const visitedCountries = ['CHN', 'JPN', 'ISL', 'GRC', 'ARG', 'MAR', 'NOR', 'IDN'];

// 各个国家在 SVG 世界地图中的中心发光点坐标
const countryCoords = {
  CHN: { cx: 650, cy: 120 },
  JPN: { cx: 755, cy: 115 },
  ISL: { cx: 405, cy: 55 },
  NOR: { cx: 490, cy: 45 },
  GRC: { cx: 495, cy: 100 },
  MAR: { cx: 450, cy: 180 },
  ARG: { cx: 250, cy: 300 },
  IDN: { cx: 720, cy: 230 },
  USA: { cx: 200, cy: 100 },
  AUS: { cx: 800, cy: 330 }
};

// ===== INITIALIZE INTERACTIVE WORLD MAP =====
function initWorldMap() {
  const glowContainer = document.getElementById('mapGlowDots');
  if (!glowContainer) return;

  // 清空之前的手动发光点
  glowContainer.innerHTML = '';

  // 遍历所有国家路径
  document.querySelectorAll('.world-map svg g.countries path').forEach(path => {
    const countryId = path.id;
    if (visitedCountries.includes(countryId)) {
      // 1. 点亮国家颜色
      path.classList.add('visited');

      // 2. 动态加入 pulsating 呼吸光圈
      const coord = countryCoords[countryId];
      if (coord) {
        const pulseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pulseGroup.innerHTML = `
          <circle cx="${coord.cx}" cy="${coord.cy}" r="4" fill="#c9a96e" opacity="0.8">
            <animate attributeName="r" values="3;7;3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="${coord.cx}" cy="${coord.cy}" r="8" fill="none" stroke="#c9a96e" stroke-width="1" opacity="0.5">
            <animate attributeName="r" values="4;15;4" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
        `;
        glowContainer.appendChild(pulseGroup);
      }
    }
  });

  // ===== MAP TOOLTIP & INTERACTION =====
  const tooltip = document.getElementById('mapTooltip');
  document.querySelectorAll('.world-map svg g.countries path').forEach(path => {
    path.addEventListener('mouseenter', (e) => {
      const countryName = path.getAttribute('data-name') || '';
      const isVisited = visitedCountries.includes(path.id);
      tooltip.innerHTML = `<strong>${countryName}</strong>${isVisited ? '<br><span style="color:#c9a96e; font-size:0.75rem;">★ 已探索</span>' : ''}`;
      tooltip.style.display = 'block';
    });
    path.addEventListener('mousemove', (e) => {
      const rect = document.querySelector('.world-map').getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 45) + 'px';
    });
    path.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

// ===== NAVIGATION SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
function toggleMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}
function closeMobileMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.remove('open');
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
  { id: 'countCountries', target: visitedCountries.length },
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

// ===== DESTINATION REGION FILTERS =====
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

// ===== GALLERY COUNTRY/REGION FILTERS =====
document.querySelectorAll('.gallery-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const selectedCategory = tab.dataset.tab;
    document.querySelectorAll('.masonry-item').forEach(item => {
      if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
        item.style.display = 'block';
        item.style.animation = 'fadeUp 0.5s ease-out forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== LIGHTBOX SYSTEM =====
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
  if (!lb) return;
  document.getElementById('lightboxImg').src = galleryImages[index].src;
  document.getElementById('lightboxCaption').textContent = galleryImages[index].caption;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('active');
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
  if (!lb || !lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Click overlay to close
const lbElement = document.getElementById('lightbox');
if (lbElement) {
  lbElement.addEventListener('click', (e) => {
    if (e.target === lbElement) closeLightbox();
  });
}

// ===== SPA-style openDetail redirect helper =====
function openDetail(dest) {
  const destMap = {
    kyoto: './kyoto.html',
    santorini: '#gallery',
    patagonia: '#gallery',
    tokyo: '#gallery',
    morocco: '#gallery',
    norway: '#gallery',
    bali: '#gallery',
    iceland: '#gallery'
  };
  if (destMap[dest] !== undefined) {
    window.location.href = destMap[dest];
  }
}

// ===== INITIALIZE ALL MODULES ON LOAD =====
window.addEventListener('DOMContentLoaded', () => {
  initWorldMap();
  document.body.style.opacity = '1';
});

