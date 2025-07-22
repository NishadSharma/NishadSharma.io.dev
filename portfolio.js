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
document.querySelectorAll('.animated-section').forEach(section => {
  section.style.opacity = 0;
  section.style.transform = 'translateY(40px)';
});

function animateSections() {
  document.querySelectorAll('.animated-section').forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      section.style.transition = 'opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)';
      section.style.opacity = 1;
      section.style.transform = 'translateY(0)';
    }
  });
}
window.addEventListener('scroll', animateSections);
window.addEventListener('load', animateSections);

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

// GSAP animations for sections
document.querySelectorAll('.animated-section').forEach((section, i) => {
  gsap.fromTo(section, 
    { opacity: 0, y: 60 }, 
    { opacity: 1, y: 0, duration: 0.8, delay: i * 0.15, ease: "power2.out", scrollTrigger: section }
  );
});

// Scroll to top button
const btn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});
btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});