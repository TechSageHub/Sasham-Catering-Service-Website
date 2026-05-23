// Hero Slideshow
const heroImages = [
    'images/hero-1.jpg',
    'images/hero-2.jpg',
    'images/gallery-1.jpg',
    'images/gallery-2.jpg',
    'images/gallery-3.jpg',
];

const heroBg = document.querySelector('.hero-bg');
let currentSlideIndex = 0;
let slides = [];

// Initialize Slides
function initSlideshow() {
    if (!heroBg) return;
    heroBg.innerHTML = '';
    slides = [];

    heroImages.forEach((imgSrc, index) => {
        const preload = new Image();
        preload.src = imgSrc;

        const slide = document.createElement('div');
        slide.classList.add('hero-slide');
        slide.style.backgroundImage = `url('${imgSrc}')`;

        if (index === 0) {
            slide.classList.add('active');
        }

        heroBg.appendChild(slide);
        slides.push(slide);
    });
}


function changeHeroImage() {
    if (!slides.length) return;
    const nextSlideIndex = (currentSlideIndex + 1) % slides.length;

    const currentSlide = slides[currentSlideIndex];
    const nextSlide = slides[nextSlideIndex];

    slides.forEach((slide, index) => {
        if (index !== currentSlideIndex && index !== nextSlideIndex) {
            slide.classList.remove('active', 'prev');
        }
    });

    currentSlide.classList.add('prev');
    currentSlide.classList.remove('active');

    nextSlide.classList.add('active');
    nextSlide.classList.remove('prev');

    currentSlideIndex = nextSlideIndex;
}

// Initial call
initSlideshow();

// Auto change every 5 seconds
if (heroBg) {
    setInterval(changeHeroImage, 6200);
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

function updateScrollEffects() {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 24);
    }

    const activeSlide = document.querySelector('.hero-slide.active');
    if (activeSlide && window.innerWidth > 768) {
        activeSlide.style.backgroundPosition = `center calc(50% + ${window.scrollY * 0.08}px)`;
    }
}

window.addEventListener('scroll', updateScrollEffects, { passive: true });
updateScrollEffects();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);

    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }
}

let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch (error) {
    // Ignore storage errors in restricted/private browsing modes.
}
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(nextTheme);
        try {
            localStorage.setItem('theme', nextTheme);
        } catch (error) {
            // Ignore storage errors in restricted/private browsing modes.
        }
    });
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            hamburger.click();
        }
    });
}

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}));

// Contact Form - WhatsApp Integration
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const phone = document.getElementById('userPhone').value;
        const eventType = document.getElementById('eventType').value;
        const message = document.getElementById('userMessage').value;

        const phoneNumber = "2347038096929";

        const whatsappMessage = [
            '*New Inquiry from Website*',
            '',
            `*Name:* ${name}`,
            `*Phone:* ${phone}`,
            `*Email:* ${email}`,
            `*Event Type:* ${eventType}`,
            `*Message:* ${message}`,
        ].join('\n');

        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    });
}

// Scroll Animation Observer
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
} else {
    document.querySelectorAll('.hidden').forEach((el) => el.classList.add('show'));
}
