// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for nav links
document.querySelectorAll('.navbar nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-toggle-icon');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

function setTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  themeIcon.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  setTheme(true);
} else {
  setTheme(false);
}

themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark-mode'));
});

// Contact form handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
    .then(function() {
      document.getElementById('formMessage').textContent = "Thank you for reaching out!";
    }, function(error) {
      document.getElementById('formMessage').textContent = "Oops! Something went wrong.";
    });
  this.reset();
});

// Animate sections on scroll
function animateOnScroll() {
  const animatedSections = document.querySelectorAll('.animated-section');
  const triggerBottom = window.innerHeight * 0.92;
  animatedSections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Add .animated-section class to main sections
document.querySelectorAll(
  '.hero, .about-section, .projects-section, .certifications-section, .contact-section'
).forEach(section => section.classList.add('animated-section'));

document.querySelectorAll('.animated-section').forEach(section => {
  section.classList.add('visible');
});

// Animate sections on scroll
document.querySelectorAll('.animated-section').forEach(section => {
  const reveal = () => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      section.classList.add('visible');
      window.removeEventListener('scroll', reveal);
    }
  };
  window.addEventListener('scroll', reveal);
  reveal();
});

// Fade-in images when loaded
document.querySelectorAll('img, .cert-img, .project-img').forEach(img => {
  img.addEventListener('load', () => img.classList.add('loaded'));
  if (img.complete) img.classList.add('loaded');
});

// To use EmailJS, include the script in your HTML file, not here.
// Then, initialize EmailJS in your JS file like this (after the script is loaded):
// emailjs.init("YOUR_USER_ID");