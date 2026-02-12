/* =============================================
   PORTFOLIO - VANILLA JAVASCRIPT
   Handles theme toggle, smooth scrolling, form validation, etc.
   ============================================= */

// ===== THEME TOGGLE =====
// Manages dark/light theme switching
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const THEME_KEY = 'portfolioTheme';

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(theme);
}

// Set theme and update icon
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update icon
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// ===== MOBILE MENU =====
// Handle hamburger menu for mobile devices
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL NAVIGATION =====
// Add smooth scrolling and active link highlighting
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active link styling
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-nav') === current) {
            link.classList.add('active');
        }
    });
}

// Listen to scroll events
window.addEventListener('scroll', updateActiveLink);

// ===== TYPING EFFECT =====
// Create typing animation in hero section
const typingText = document.querySelector('.typing-text');
const cursor = document.querySelector('.cursor');

// Array of texts to type
const texts = [
    'I build amazing web experiences',
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'JavaScript Expert'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let deletingSpeed = 50;

function typeEffect() {
    const currentText = texts[textIndex];
    
    if (!isDeleting && charIndex < currentText.length) {
        // Typing forward
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = deletingSpeed;
    } else if (!isDeleting && charIndex === currentText.length) {
        // Finished typing, start deleting after pause
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next text
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect when page loads
if (typingText) {
    typeEffect();
}

// ===== FORM HANDLING =====
// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
const formInputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
};
const errorMessages = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    message: document.getElementById('messageError')
};
const statusMessage = document.getElementById('statusMessage');

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show error message
function showError(field, message) {
    errorMessages[field].textContent = message;
    errorMessages[field].classList.add('show');
    formInputs[field].style.borderColor = 'var(--danger-color)';
}

// Clear error message
function clearError(field) {
    errorMessages[field].textContent = '';
    errorMessages[field].classList.remove('show');
    formInputs[field].style.borderColor = '';
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Validate name
    if (formInputs.name.value.trim().length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    } else {
        clearError('name');
    }
    
    // Validate email
    if (!validateEmail(formInputs.email.value.trim())) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError('email');
    }
    
    // Validate message
    if (formInputs.message.value.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    } else {
        clearError('message');
    }
    
    return isValid;
}

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    // Clear previous status
    statusMessage.textContent = '';
    statusMessage.className = '';
    
    // Validate form
    if (!validateForm()) {
        e.preventDefault(); // Only prevent submission if validation fails
        statusMessage.textContent = 'Please fix the errors above';
        statusMessage.className = 'error';
        return;
    }
    
    // Validation passed - show loading state and let form submit naturally to Netlify
    statusMessage.textContent = 'Sending message...';
    statusMessage.className = '';
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Form will now submit naturally to Netlify Forms (no preventDefault, no fetch)
    // Netlify will handle the submission and redirect to a success page
});

// Clear error on input focus
Object.keys(formInputs).forEach(field => {
    formInputs[field].addEventListener('focus', () => {
        clearError(field);
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
// Trigger animations when elements come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill items for fade-in animation
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
});

// Observe project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// ===== SMOOTH SCROLL BEHAVIOR =====
// Add smooth scroll behavior for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== INITIALIZATION =====
// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    updateActiveLink();
});

// Update active link on page load
window.addEventListener('load', updateActiveLink);
