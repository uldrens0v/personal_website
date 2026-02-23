/* ============================================================
   script.js — Andrés Carrero Fraile Personal Website
============================================================ */

// ── Theme toggle ──────────────────────────────────────────────
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ── Navbar scroll ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ── Hamburger menu ────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Back to top ───────────────────────────────────────────────
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Typing effect ─────────────────────────────────────────────
const phrases = [
    'Full-Stack Developer',
    'PHP Enthusiast ☕',
    'Java & Spring Boot',
    'Docker & AWS Explorer',
    'Bug Hunter Profesional',
    'C# cuando toca ser serio'
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
    if (!typedEl) return;
    const phrase = phrases[phraseIndex];
    if (!deleting) {
        typedEl.textContent = phrase.substring(0, ++charIndex);
        if (charIndex === phrase.length) {
            setTimeout(() => { deleting = true; typeLoop(); }, 1800);
            return;
        }
    } else {
        typedEl.textContent = phrase.substring(0, --charIndex);
        if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }
    setTimeout(typeLoop, deleting ? 45 : 85);
}
typeLoop();

// ── Scroll reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // stagger siblings inside same parent
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
            const index = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Skill bars ────────────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach(fill => {
                const w = fill.getAttribute('data-width');
                fill.style.width = w + '%';
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-col').forEach(col => skillObserver.observe(col));

// ── Counter animation ─────────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 30));
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = current + (target > 10 ? '+' : '');
                    if (current >= target) clearInterval(timer);
                }, 45);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ── Particle canvas ───────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let W, H;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function Particle() {
        this.reset();
    }
    Particle.prototype.reset = function () {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.8 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.5 + 0.1;
    };
    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    };

    const COUNT = 80;
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const isDark = html.getAttribute('data-theme') !== 'light';
        const particleColor = isDark ? '102, 126, 234' : '102, 126, 234';

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${particleColor}, ${0.12 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach(p => {
            p.update();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }
    draw();
})();
