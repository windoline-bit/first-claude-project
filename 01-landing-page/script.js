// ===== Header scroll effect =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile menu =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
});

// Close menu on link click
nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('open');
    });
});

// ===== Menu tabs =====
const tabs = document.querySelectorAll('.menu__tab');
const cards = document.querySelectorAll('.menu__card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        cards.forEach(card => {
            if (card.dataset.category === category) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeUp 0.4s ease forwards';
            } else {
                card.classList.add('hidden');
                card.style.animation = '';
            }
        });
    });
});

// ===== Reviews slider =====
const track = document.getElementById('reviews-track');
const dotsContainer = document.getElementById('reviews-dots');
const prevBtn = document.getElementById('prev-review');
const nextBtn = document.getElementById('next-review');
const reviewCards = track.querySelectorAll('.reviews__card');
let currentSlide = 0;
const totalSlides = reviewCards.length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('reviews__dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dotsContainer.querySelectorAll('.reviews__dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
});

nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
});

// Auto-slide every 5 seconds
let autoSlide = setInterval(() => {
    goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
}, 5000);

// Pause auto-slide on hover
const slider = document.getElementById('reviews-slider');
slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
        goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
    }, 5000);
});

// ===== Stats counter animation =====
const statsNumbers = document.querySelectorAll('.stats__number');
let statsAnimated = false;

function animateStats() {
    statsNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString('uk-UA');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('uk-UA');
            }
        }

        requestAnimationFrame(update);
    });
}

// ===== Scroll animations (IntersectionObserver) =====
const observerOptions = { threshold: 0.2 };

// Animate sections on scroll
const fadeElements = document.querySelectorAll(
    '.about__inner, .menu__tabs, .menu__grid, .gallery__grid, .reviews__slider, .contact__inner'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// Stats observer
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

// ===== Booking form =====
const bookingForm = document.getElementById('booking-form');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Дякуємо! Ми зв\u2019яжемося з вами для підтвердження.');
    bookingForm.reset();
});

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
