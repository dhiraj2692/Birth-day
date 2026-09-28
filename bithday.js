/* ===================== EDIT YOUR MEMORY COLLECTION HERE ===================== */
const memories = [
    { image: 'images/WhatsApp Image 2026-09-09 at 11.28.14 PM.jpeg', caption: 'That smile ❤️', alt: 'A joyful portrait' },
    { image: 'images/WhatsApp Image 2026-09-09 at 11.29.16 PM.jpeg', caption: 'My favourite person.', alt: 'A favourite portrait' },
    { image: 'images/WhatsApp Image 2026-09-09 at 11.30.01 PM.jpeg', caption: 'A beautiful memory.', alt: 'A beautiful outdoor memory' },
    { image: 'images/WhatsApp Image 2026-09-09 at 11.35.44 PM.jpeg', caption: 'Just us.', alt: 'A happy memory together' },
    { image: 'images/WhatsApp Image 2026-09-09 at 11.40.59 PM.jpeg', caption: 'Always you.', alt: 'A special moment' },
    { image: 'images/WhatsApp Image 2026-09-09 at 11.42.39 PM.jpeg', caption: 'Still my favourite.', alt: 'A special birthday memory' },
    { image: 'images/WhatsApp Image 2026-09-09 at 11.42.40 PM.jpeg', caption: 'A little happiness.', alt: 'A happy portrait' },
];
/* ========================================================================== */

const gallery = document.querySelector('#gallery-grid');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxCount = document.querySelector('#lightbox-count');
const closeButton = document.querySelector('#lightbox-close');
const previousButton = document.querySelector('#previous-photo');
const nextButton = document.querySelector('#next-photo');
const finalSection = document.querySelector('#finale');
const finalParticles = document.querySelector('.final-particles');
const messageButton = document.querySelector('#message-button');
const finalMessage = document.querySelector('#final-message');
const introScreen = document.querySelector('#intro-screen');
const introButton = document.querySelector('#intro-button');
const previousMemoryButton = document.querySelector('#previous-memory');
const nextMemoryButton = document.querySelector('#next-memory');
const carouselDots = document.querySelector('#carousel-dots');
const relationshipDuration = document.querySelector('#relationship-duration');
const backgroundAudio = document.querySelector('#background-audio');
let activePhoto = 0;
let activeMemory = 0;
let touchStartX = 0;
let carouselTimer;

const playBackgroundMusic = async () => {
    if (!backgroundAudio) return;
    backgroundAudio.volume = 0.35;
    backgroundAudio.muted = false;
    if (!backgroundAudio.src || !backgroundAudio.src.includes('sajani_re_final.mp3')) {
        backgroundAudio.src = 'images/sajani_re_final.mp3';
    }
    try {
        await backgroundAudio.play();
    } catch (error) {
        console.warn('Audio can start only after user interaction in the browser.', error);
    }
};

const unlockAudio = () => {
    if (!backgroundAudio) return;
    backgroundAudio.muted = false;
    playBackgroundMusic();
};

document.addEventListener('pointerdown', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

const openMainPage = () => {
    if (introScreen.classList.contains('fade-out')) return;
    introScreen.classList.add('fade-out');
    playBackgroundMusic();
    window.history.replaceState(null, '', '#home');
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 80);
    window.setTimeout(() => introScreen.remove(), 950);
};

introButton.addEventListener('click', openMainPage);

memories.forEach((memory, index) => {
    const card = document.createElement('button');
    card.className = 'gallery-card';
    card.type = 'button';
    card.setAttribute('aria-label', `Open photo: ${memory.caption}`);
    card.innerHTML = `<img src="${memory.image}" alt="${memory.alt}" loading="lazy"><figcaption>${memory.caption}</figcaption>`;
    card.addEventListener('click', () => openViewer(index));
    gallery.appendChild(card);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Show memory ${index + 1}`);
    dot.addEventListener('click', () => showMemory(index));
    carouselDots.appendChild(dot);
});

const updateCarousel = () => {
    const cards = [...gallery.children];
    const dots = [...carouselDots.children];
    const card = cards[activeMemory];
    if (card) gallery.scrollTo({ left: card.offsetLeft - (gallery.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeMemory);
        dot.setAttribute('aria-selected', String(index === activeMemory));
    });
};

const showMemory = (index) => {
    activeMemory = (index + memories.length) % memories.length;
    updateCarousel();
};

const startCarousel = () => {
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => showMemory(activeMemory + 1), 3500);
};

previousMemoryButton.addEventListener('click', () => showMemory(activeMemory - 1));
nextMemoryButton.addEventListener('click', () => showMemory(activeMemory + 1));
gallery.addEventListener('mouseenter', () => window.clearInterval(carouselTimer));
gallery.addEventListener('mouseleave', startCarousel);
gallery.addEventListener('focusin', () => window.clearInterval(carouselTimer));
gallery.addEventListener('focusout', (event) => {
    if (!gallery.contains(event.relatedTarget)) startCarousel();
});
updateCarousel();
startCarousel();

const relationshipStart = new Date(2019, 4, 7, 16, 0, 0);
const updateRelationshipDuration = () => {
    const today = new Date();
    let years = today.getFullYear() - relationshipStart.getFullYear();
    let anniversary = new Date(relationshipStart);
    anniversary.setFullYear(relationshipStart.getFullYear() + years);
    if (anniversary > today) {
        years -= 1;
        anniversary = new Date(relationshipStart);
        anniversary.setFullYear(relationshipStart.getFullYear() + years);
    }
    let months = today.getMonth() - anniversary.getMonth();
    if (today.getDate() < anniversary.getDate() || (today.getDate() === anniversary.getDate() && today < anniversary)) months -= 1;
    anniversary.setMonth(anniversary.getMonth() + months);
    const remaining = Math.max(0, today - anniversary);
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    relationshipDuration.textContent = `${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds together`;
};

updateRelationshipDuration();
window.setInterval(updateRelationshipDuration, 1000);

const updateViewer = () => {
    const memory = memories[activePhoto];
    lightboxImage.src = memory.image;
    lightboxImage.alt = memory.alt;
    lightboxCaption.textContent = memory.caption;
    lightboxCount.textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(memories.length).padStart(2, '0')}`;
};

const openViewer = (index) => {
    activePhoto = index;
    updateViewer();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');
    closeButton.focus();
};

const closeViewer = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');
};

const showPrevious = () => { activePhoto = (activePhoto - 1 + memories.length) % memories.length; updateViewer(); };
const showNext = () => { activePhoto = (activePhoto + 1) % memories.length; updateViewer(); };

closeButton.addEventListener('click', closeViewer);
previousButton.addEventListener('click', showPrevious);
nextButton.addEventListener('click', showNext);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeViewer(); });
document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft') showPrevious();
    if (event.key === 'ArrowRight') showNext();
});
lightbox.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    if (touch) touchStartX = touch.screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    const distance = touch.screenX - touchStartX;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) showNext();
    else showPrevious();
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .14 });
document.querySelectorAll('.gallery-card').forEach((card) => revealObserver.observe(card));

const celebrateFinale = () => {
    if (finalSection.classList.contains('celebrating')) return;
    finalSection.classList.add('celebrating');
    for (let index = 0; index < 28; index += 1) {
        const particle = document.createElement('i');
        particle.className = 'celebration-particle';
        particle.style.left = `${38 + Math.random() * 28}%`;
        particle.style.top = `${42 + Math.random() * 28}%`;
        particle.style.setProperty('--particle-x', `${(Math.random() - .5) * 280}px`);
        particle.style.setProperty('--particle-y', `${-70 - Math.random() * 180}px`);
        particle.style.setProperty('--particle-delay', `${Math.random() * .75}s`);
        particle.style.setProperty('--particle-duration', `${2.4 + Math.random() * 2}s`);
        finalParticles.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
    }
};

const finalObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) celebrateFinale();
}, { threshold: .3 });
finalObserver.observe(finalSection);

messageButton.addEventListener('click', () => {
    const isOpen = messageButton.getAttribute('aria-expanded') === 'true';
    messageButton.setAttribute('aria-expanded', String(!isOpen));
    messageButton.classList.toggle('open', !isOpen);
    finalMessage.hidden = isOpen;
    messageButton.innerHTML = isOpen ? 'Read my final message <span>❤</span>' : 'Close my message <span>♡</span>';
});
