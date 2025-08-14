/**
 * Enhanced Portfolio JavaScript - Premium Interactions & Performance
 * Features: GSAP animations, modal system, form handling, theme management,
 * scroll effects, lazy loading, accessibility improvements
 */

// Performance optimization: Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Enhanced theme management with system preference detection
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('portfolio-theme');
    this.systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.init();
  }

  init() {
    // Set initial theme
    if (!this.theme) {
      this.theme = this.systemPrefersDark.matches ? 'dark' : 'light';
    }
    
    this.applyTheme(this.theme);
    this.setupToggleButtons();
    
    // Listen for system theme changes
    this.systemPrefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme-manual')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    
    // Update toggle buttons
    const toggleIcons = document.querySelectorAll('.toggle-icon');
    toggleIcons.forEach(icon => {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    
    // Update meta theme-color for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = theme === 'dark' ? '#0b0c10' : '#ffffff';
    }
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('portfolio-theme', theme);
    localStorage.setItem('portfolio-theme-manual', 'true');
    this.applyTheme(theme);
    
    // Announce theme change for screen readers
    this.announceThemeChange(theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  announceThemeChange(theme) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${theme} mode`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  setupToggleButtons() {
    const toggleButtons = document.querySelectorAll('#theme-toggle, #splash-theme-toggle');
    toggleButtons.forEach(button => {
      button.addEventListener('click', () => this.toggleTheme());
      
      // Enhanced keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    });
  }
}

// Enhanced scroll effects manager
class ScrollManager {
  constructor() {
    this.scrollProgress = document.querySelector('.scroll-progress');
    this.scrollToTopBtn = document.getElementById('scroll-to-top');
    this.navbar = document.querySelector('.navbar');
    this.init();
  }

  init() {
    this.setupScrollProgress();
    this.setupScrollToTop();
    this.setupSmoothScroll();
    this.setupNavbarEffects();
    this.observeIntersections();
  }

  setupScrollProgress() {
    const updateProgress = throttle(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      if (this.scrollProgress) {
        this.scrollProgress.style.width = scrolled + '%';
      }
    }, 10);

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
  }

  setupScrollToTop() {
    if (!this.scrollToTopBtn) return;

    const toggleVisibility = throttle(() => {
      if (window.pageYOffset > 300) {
        this.scrollToTopBtn.style.display = 'flex';
        // Smooth fade in with GSAP if available
        if (window.gsap) {
          gsap.to(this.scrollToTopBtn, { opacity: 1, scale: 1, duration: 0.3 });
        }
      } else {
        // Smooth fade out with GSAP if available
        if (window.gsap) {
          gsap.to(this.scrollToTopBtn, { 
            opacity: 0, 
            scale: 0.8, 
            duration: 0.3,
            onComplete: () => {
              this.scrollToTopBtn.style.display = 'none';
            }
          });
        } else {
          this.scrollToTopBtn.style.display = 'none';
        }
      }
    }, 100);

    window.addEventListener('scroll', toggleVisibility);

    this.scrollToTopBtn.addEventListener('click', () => {
      this.scrollToTop();
    });

    // Keyboard support
    this.scrollToTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  setupSmoothScroll() {
    // Enhanced smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const offsetTop = target.offsetTop - 100; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Update focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
          
          // Remove tabindex after focus
          target.addEventListener('blur', () => {
            target.removeAttribute('tabindex');
          }, { once: true });
        }
      });
    });
  }

  setupNavbarEffects() {
    if (!this.navbar) return;

    let lastScrollY = window.pageYOffset;
    
    const handleScroll = throttle(() => {
      const currentScrollY = window.pageYOffset;
      
      // Add glass effect when scrolled
      if (currentScrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
      
      // Hide/show navbar on scroll direction (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        this.navbar.style.transform = 'translateY(-100%)';
      } else {
        this.navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, 10);

    window.addEventListener('scroll', handleScroll);
  }

  observeIntersections() {
    // Enhanced intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger GSAP animation if available
          if (window.gsap && !entry.target.dataset.animated) {
            this.animateSection(entry.target);
            entry.target.dataset.animated = 'true';
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animated-section').forEach(section => {
      observer.observe(section);
    });
  }

  animateSection(section) {
    if (!window.gsap) return;

    gsap.fromTo(section, 
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );

    // Animate child elements with stagger
    const children = section.querySelectorAll('.project-card, .cert-card-v2, .testimonial-card, .blog-card, .edu-item, .skill-category');
    if (children.length > 0) {
      gsap.fromTo(children,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out"
        }
      );
    }
  }
}

// Enhanced modal system for projects and certificates
class ModalManager {
  constructor() {
    this.modal = document.getElementById('modal');
    this.modalBody = document.getElementById('modal-body');
    this.closeBtn = document.querySelector('.modal-close');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  setupEventListeners() {
    // Close modal events
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // Project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const projectId = card.dataset.project;
        this.showProject(projectId);
      });
      
      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const projectId = card.dataset.project;
          this.showProject(projectId);
        }
      });
    });

    // Certificate cards
    document.querySelectorAll('.cert-card-v2').forEach(card => {
      card.addEventListener('click', () => {
        const certId = card.dataset.cert;
        this.showCertificate(certId);
      });
      
      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const certId = card.dataset.cert;
          this.showCertificate(certId);
        }
      });
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  showProject(projectId) {
    const projectData = this.getProjectData(projectId);
    if (projectData) {
      this.modalBody.innerHTML = this.generateProjectModal(projectData);
      this.open();
    }
  }

  showCertificate(certId) {
    const certData = this.getCertificateData(certId);
    if (certData) {
      this.modalBody.innerHTML = this.generateCertificateModal(certData);
      this.open();
    }
  }

  open() {
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.closeBtn.focus();
    
    // Animate with GSAP if available
    if (window.gsap) {
      gsap.fromTo(this.modal, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(this.modal.querySelector('.modal-content'),
        { scale: 0.8, y: 20 },
        { scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }

  close() {
    // Animate out with GSAP if available
    if (window.gsap) {
      gsap.to(this.modal, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          this.modal.classList.remove('active');
          this.modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    } else {
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  getProjectData(projectId) {
    const projects = {
      'portfolio': {
        title: 'Modern Portfolio Website',
        description: 'A responsive, accessible portfolio site inspired by Apple\'s design language. Built with modern web technologies and optimized for performance.',
        image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Responsive Design'],
        features: [
          'Apple-inspired design with glassmorphism effects',
          'Dark/light theme toggle with system preference detection',
          'Smooth animations powered by GSAP',
          'Full accessibility support (WCAG 2.1 compliant)',
          'Progressive Web App capabilities',
          'Optimized performance with lazy loading'
        ],
        github: 'https://github.com/NishadSharma/portfolio',
        demo: 'https://nishad-portfolio.vercel.app',
        status: 'Completed'
      },
      'password-checker': {
        title: 'Advanced Password Strength Checker',
        description: 'A comprehensive security tool that analyzes password strength, checks against known breaches, and provides detailed security recommendations.',
        image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
        technologies: ['Python', 'Flask', 'API Integration', 'Security Analysis', 'UI/UX'],
        features: [
          'Real-time password strength analysis',
          'Breach database checking via HaveIBeenPwned API',
          'Detailed security recommendations',
          'Password generation with custom parameters',
          'Entropy calculation and pattern detection',
          'Clean, intuitive user interface'
        ],
        github: 'https://github.com/NishadSharma/password-checker',
        demo: 'https://password-checker-demo.herokuapp.com',
        status: 'In Progress'
      },
      'api-dashboard': {
        title: 'Interactive API Analytics Dashboard',
        description: 'A comprehensive dashboard for visualizing and analyzing real-time API data with advanced filtering, export options, and performance monitoring.',
        image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
        technologies: ['React', 'Node.js', 'Express', 'Chart.js', 'MongoDB', 'Socket.io'],
        features: [
          'Real-time data visualization with interactive charts',
          'Advanced filtering and search capabilities',
          'Export functionality (PDF, CSV, Excel)',
          'Performance monitoring and alerts',
          'Responsive design for all devices',
          'Role-based access control'
        ],
        github: 'https://github.com/NishadSharma/api-dashboard',
        demo: 'https://api-dashboard-demo.netlify.app',
        status: 'Planning'
      }
    };
    
    return projects[projectId];
  }

  getCertificateData(certId) {
    const certificates = {
      'pre-security': {
        title: 'Pre Security',
        issuer: 'TryHackMe',
        date: 'October 2024',
        image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Comprehensive introduction to cybersecurity fundamentals covering network security, web application security, and general security principles.',
        skills: [
          'Network Security Fundamentals',
          'Web Application Security',
          'Operating System Security',
          'Security Principles & Best Practices'
        ],
        verifyUrl: 'https://tryhackme.com/certificate/THM-ZMT4DZZXPA',
        credentialId: 'THM-ZMT4DZZXPA'
      },
      'cloud-computing': {
        title: 'Cloud Computing',
        issuer: 'NPTEL - IIT Kharagpur',
        date: 'October 2024',
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Advanced course covering cloud computing concepts, architectures, and practical implementations across major cloud platforms.',
        skills: [
          'Cloud Architecture & Design',
          'Virtualization Technologies',
          'Cloud Security & Compliance',
          'Service Models (IaaS, PaaS, SaaS)',
          'Cloud Migration Strategies'
        ],
        verifyUrl: 'https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL24CS118S167020178804431793',
        credentialId: 'NPTEL24CS118S167020178804431793'
      },
      'java-programming': {
        title: 'Master Java Programming',
        issuer: 'GeeksForGeeks',
        date: 'April 2024',
        image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Comprehensive Java programming course covering core concepts, advanced topics, and practical application development.',
        skills: [
          'Core Java Programming',
          'Object-Oriented Programming',
          'Data Structures & Algorithms',
          'Exception Handling',
          'Multithreading & Concurrency',
          'Java Collections Framework'
        ],
        verifyUrl: 'https://media.geeksforgeeks.org/courses/certificates/3355023c5944e1621ba0e3dbd5433601.pdf',
        credentialId: '3355023c5944e1621ba0e3dbd5433601'
      },
      'data-structures': {
        title: 'Mastering Data Structures using C & C++',
        issuer: 'Udemy',
        date: 'December 2023',
        image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'In-depth course on data structures and algorithms implementation using C and C++ programming languages.',
        skills: [
          'Linear Data Structures (Arrays, Linked Lists)',
          'Non-linear Data Structures (Trees, Graphs)',
          'Advanced Algorithms',
          'Time & Space Complexity Analysis',
          'Problem Solving Techniques',
          'C/C++ Programming'
        ],
        verifyUrl: 'https://www.udemy.com/certificate/UC-ee3f747b-855f-4264-bb68-fb169ce7f888/',
        credentialId: 'UC-ee3f747b-855f-4264-bb68-fb169ce7f888'
      }
    };
    
    return certificates[certId];
  }

  generateProjectModal(project) {
    return `
      <div class="modal-header">
        <h2>${project.title}</h2>
        <div class="project-status status-${project.status.toLowerCase().replace(' ', '-')}">
          ${project.status}
        </div>
      </div>
      <div class="modal-project-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
      </div>
      <div class="modal-content-body">
        <p class="project-description">${project.description}</p>
        
        <div class="project-section">
          <h3>Technologies Used</h3>
          <div class="tech-tags">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>
        
        <div class="project-section">
          <h3>Key Features</h3>
          <ul class="feature-list">
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View Code
          </a>` : ''}
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn-primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live Demo
          </a>` : ''}
        </div>
      </div>
    `;
  }

  generateCertificateModal(cert) {
    return `
      <div class="modal-header">
        <h2>${cert.title}</h2>
        <div class="cert-issuer">${cert.issuer}</div>
      </div>
      <div class="modal-cert-image">
        <img src="${cert.image}" alt="${cert.title} Certificate" loading="lazy" />
      </div>
      <div class="modal-content-body">
        <div class="cert-info-grid">
          <div class="cert-detail">
            <strong>Issue Date:</strong>
            <span>${cert.date}</span>
          </div>
          <div class="cert-detail">
            <strong>Credential ID:</strong>
            <span>${cert.credentialId}</span>
          </div>
        </div>
        
        <p class="cert-description">${cert.description}</p>
        
        <div class="cert-section">
          <h3>Skills Acquired</h3>
          <div class="skills-grid">
            ${cert.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
          </div>
        </div>
        
        <div class="cert-actions">
          <a href="${cert.verifyUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.35 0 4.5.9 6.13 2.38"/>
            </svg>
            Verify Certificate
          </a>
        </div>
      </div>
    `;
  }
}

// Enhanced form manager with validation and submission
class FormManager {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.submitBtn = this.form?.querySelector('.submit-btn');
    this.message = document.getElementById('formMessage');
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.setupFormValidation();
    this.setupFormSubmission();
  }

  setupFormValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', debounce(() => this.clearErrors(input), 300));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    this.clearErrors(field);

    // Validation rules
    switch (fieldName) {
      case 'name':
        if (!value) {
          errorMessage = 'Name is required';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters';
          isValid = false;
        }
        break;
        
      case 'email':
        if (!value) {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!this.isValidEmail(value)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;
        
      case 'message':
        if (!value) {
          errorMessage = 'Message is required';
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = 'Message must be at least 10 characters';
          isValid = false;
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute('aria-live', 'polite');
    }
  }

  clearErrors(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmission();
    });
  }

  async handleSubmission() {
    // Validate all fields
    const inputs = this.form.querySelectorAll('input, textarea');
    let isFormValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showMessage('Please fix the errors above', 'error');
      return;
    }

    // Show loading state
    this.setSubmitLoading(true);

    try {
      // Simulate form submission (replace with actual endpoint)
      await this.submitForm();
      this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
      this.form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      this.setSubmitLoading(false);
    }
  }

  async submitForm() {
    // Simulate API call - replace with actual form submission
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Submission failed'));
        }
      }, 2000);
    });
  }

  setSubmitLoading(isLoading) {
    const btnText = this.submitBtn.querySelector('.btn-text');
    const btnLoader = this.submitBtn.querySelector('.btn-loader');
    
    if (isLoading) {
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';
      this.submitBtn.disabled = true;
    } else {
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
      this.submitBtn.disabled = false;
    }
  }

  showMessage(text, type) {
    this.message.textContent = text;
    this.message.className = `form-message ${type}`;
    this.message.setAttribute('role', type === 'error' ? 'alert' : 'status');
    
    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        this.message.textContent = '';
        this.message.className = 'form-message';
      }, 5000);
    }
  }
}

// Enhanced GSAP animations manager
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    // Wait for GSAP to load
    if (typeof gsap !== 'undefined') {
      this.setupGSAPAnimations();
    } else {
      // Fallback if GSAP doesn't load
      console.warn('GSAP not loaded, using CSS animations only');
    }
  }

  setupGSAPAnimations() {
    // Register ScrollTrigger plugin if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    this.animateHeroElements();
    this.animateCards();
    this.animateIcons();
    this.setupScrollTriggerAnimations();
  }

  animateHeroElements() {
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo('.hero-text h1', 
      { opacity: 0, y: 60, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo('.subtitle', 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, "-=0.5"
    )
    .fromTo('.hero-intro', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3"
    )
    .fromTo('.hero-actions .btn-primary', 
      { opacity: 0, scale: 0.8, rotation: -5 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.2"
    )
    .fromTo('.hero-actions .btn-secondary', 
      { opacity: 0, scale: 0.8, rotation: 5 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4"
    )
    .fromTo('.hero-socials .social-link', 
      { opacity: 0, scale: 0, rotation: 180 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2)" }, "-=0.2"
    )
    .fromTo('.hero-profile-img', 
      { opacity: 0, scale: 0.5, rotation: -20 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" }, "-=1"
    );
  }

  animateCards() {
    // Animate cards on hover
    document.querySelectorAll('.project-card, .cert-card-v2, .testimonial-card, .blog-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0, 113, 227, 0.15)",
          duration: 0.3,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 4px 16px rgba(30, 40, 90, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  animateIcons() {
    // Animate icons on hover
    document.querySelectorAll('.section-icon, .nav-svg-icon, .btn-icon, .card-icon').forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.2,
          rotation: 360,
          duration: 0.5,
          ease: "power2.out"
        });
      });

      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  setupScrollTriggerAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Animate sections as they come into view
    gsap.utils.toArray('.animated-section').forEach(section => {
      gsap.fromTo(section, {
        opacity: 0,
        y: 80,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Parallax effect for hero background
    gsap.to('.hero::before', {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }
}

// Lazy loading manager for better performance
class LazyLoadManager {
  constructor() {
    this.init();
  }

  init() {
    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      this.setupLazyLoading();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"], .project-img, .cert-img, .blog-img').forEach(img => {
      imageObserver.observe(img);
    });
  }

  loadImage(element) {
    if (element.tagName === 'IMG') {
      element.addEventListener('load', () => {
        element.classList.add('loaded');
      });
      
      if (element.dataset.src) {
        element.src = element.dataset.src;
        element.removeAttribute('data-src');
      }
    } else if (element.style.backgroundImage.includes('url')) {
      element.classList.add('loaded');
    }
  }

  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    });
  }
}

// Enhanced splash screen manager
class SplashManager {
  constructor() {
    this.splash = document.getElementById('splash');
    this.mainContent = document.getElementById('main-content');
    this.enterBtn = document.getElementById('enter-portfolio');
    this.init();
  }

  init() {
    if (!this.splash) return;

    this.setupSplashAnimations();
    this.setupEnterButton();
    
    // Auto-hide splash after delay (optional)
    // setTimeout(() => this.hideSplash(), 3000);
  }

  setupSplashAnimations() {
    if (typeof gsap !== 'undefined') {
      // Animate splash elements
      gsap.fromTo('#lock-shackle', 
        { opacity: 0, y: -20, rotation: -10 },
        { opacity: 1, y: 0, rotation: 0, duration: 1.2, ease: "bounce.out", delay: 0.5 }
      );
      
      gsap.fromTo('#logo-n', 
        { opacity: 0, scale: 0, rotation: 180 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)", delay: 1.2 }
      );
      
      gsap.fromTo('.splash-content h1', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.5 }
      );
      
      gsap.fromTo('.splash-tagline', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 1.8 }
      );
      
      gsap.fromTo('.splash-btn', 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 2.1 }
      );
    }
  }

  setupEnterButton() {
    if (this.enterBtn) {
      this.enterBtn.addEventListener('click', () => this.hideSplash());
      
      // Keyboard support
      this.enterBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.hideSplash();
        }
      });
    }
  }

  hideSplash() {
    if (typeof gsap !== 'undefined') {
      gsap.to(this.splash, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          this.splash.style.display = 'none';
          this.mainContent.style.display = 'block';
          
          // Trigger main content animations
          if (window.animationManager) {
            window.animationManager.animateHeroElements();
          }
        }
      });
    } else {
      this.splash.style.display = 'none';
      this.mainContent.style.display = 'block';
    }
  }
}

// Performance monitor for optimization
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Monitor Core Web Vitals if supported
    if ('PerformanceObserver' in window) {
      this.observePerformance();
    }
    
    // Log performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => this.logMetrics(), 0);
    });
  }

  observePerformance() {
    try {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsScore = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        console.log('CLS:', clsScore);
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  logMetrics() {
    if (!window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      console.log('Performance Metrics:', {
        'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
        'TCP Connection': navigation.connectEnd - navigation.connectStart,
        'First Byte': navigation.responseStart - navigation.requestStart,
        'DOM Loading': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        'Page Load': navigation.loadEventEnd - navigation.loadEventStart,
        'Total Load Time': navigation.loadEventEnd - navigation.fetchStart
      });
    }
  }
}

// Initialize all managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  window.themeManager = new ThemeManager();
  window.scrollManager = new ScrollManager();
  window.modalManager = new ModalManager();
  window.formManager = new FormManager();
  window.lazyLoadManager = new LazyLoadManager();
  window.splashManager = new SplashManager();
  window.performanceMonitor = new PerformanceMonitor();
  
  // Initialize animations after GSAP loads
  if (typeof gsap !== 'undefined') {
    window.animationManager = new AnimationManager();
  } else {
    // Wait for GSAP to load
    const checkGSAP = setInterval(() => {
      if (typeof gsap !== 'undefined') {
        window.animationManager = new AnimationManager();
        clearInterval(checkGSAP);
      }
    }, 100);
  }
  
  // Set current year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Announce page load for screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = 'Portfolio loaded successfully';
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
});

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
  
  // Show user-friendly error message if needed
  if (event.error.name === 'ChunkLoadError') {
    // Handle dynamic import failures
    location.reload();
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent default browser error handling
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ThemeManager,
    ScrollManager,
    ModalManager,
    FormManager,
    AnimationManager,
    LazyLoadManager,
    SplashManager,
    PerformanceMonitor
  };
}