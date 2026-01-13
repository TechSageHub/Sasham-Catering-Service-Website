// Hero Slideshow
const heroImages = [
    'images/gallery-1.jpg',
    'images/gallery-2.jpg',
    'images/gallery-3.jpg',
    'images/coleslaw.png',
];

const heroBg = document.querySelector('.hero-bg');
let currentSlideIndex = 0;
let slides = [];

// Initialize Slides
function initSlideshow() {
    heroBg.innerHTML = ''; // Clear existing content

    heroImages.forEach((imgSrc, index) => {
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
    const nextSlideIndex = (currentSlideIndex + 1) % slides.length;

    const currentSlide = slides[currentSlideIndex];
    const nextSlide = slides[nextSlideIndex];

    // Reset all slides to default state (right) except current and next
    // This ensures slides coming back from the left are moved to the right first
    slides.forEach((slide, index) => {
        if (index !== currentSlideIndex && index !== nextSlideIndex) {
            slide.classList.remove('active', 'prev');
            // Force reflow to ensure the transform jump happens without animation if it was previously 'prev'
            // However, simply removing classes should revert it to transform: translateX(100%) defined in CSS
        }
    });

    // Move current to left
    currentSlide.classList.add('prev');
    currentSlide.classList.remove('active');

    // Move next to center
    nextSlide.classList.add('active');
    nextSlide.classList.remove('prev');

    currentSlideIndex = nextSlideIndex;
}

// Initial call
initSlideshow();

// Auto change every 5 seconds
setInterval(changeHeroImage, 5000);

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Contact Form - WhatsApp Integration
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    const eventType = document.getElementById('eventType').value;
    const message = document.getElementById('userMessage').value;

    const phoneNumber = "2347038096929"; // International format without +

    const whatsappMessage = `*New Inquiry from Website*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A*Event Type:* ${eventType}%0A*Message:* ${message}`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;



    window.open(whatsappURL, '_blank');
});

// Scroll Animation Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Animate only once
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
