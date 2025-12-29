// Nexora Consulting - Complete JavaScript Functionality
// Updated with Theme Toggle, Formspree Integration, and Scroll-Hide for Floating Buttons

// ===== DOM Elements =====
const preloader = document.querySelector('.preloader');
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const currentYear = document.getElementById('current-year');
const contactForm = document.getElementById('consultation-form');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const counters = document.querySelectorAll('.counter');
const backToTop = document.querySelector('.back-to-top');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// ===== Initialize on DOM Load =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Nexora Consulting - Initializing...');
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Initialize all components
    initializePreloader();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeTabs();
    initializeCounters();
    initializeScrollEffects();
    initializeAnimations();
    initializeBackToTop();
    initializeServiceCards();
    initializeThemeToggle();
    
    // Initialize scroll-hide for floating buttons
    initializeScrollHide();
    
    // Initialize Formspree form handling
    initializeFormspreeForm();
    
    // Set active nav link on page load
    updateActiveNavLink();
    
    // Analytics tracking for CTA clicks
    initializeAnalyticsTracking();
    
    // Check for Formspree success redirect
    checkFormspreeSuccess();
});

// ===== Scroll Hide for Floating Buttons =====
function initializeScrollHide() {
    const floatingButtons = [themeToggle, document.querySelector('.language-translator')];
    let lastScrollY = window.scrollY;
    let isHidden = false;
    let scrollTimeout;
    
    // Only apply on smaller screens
    const isSmallScreen = () => window.innerWidth < 1024;
    
    const hideButtons = () => {
        if (!isSmallScreen()) return;
        
        floatingButtons.forEach(button => {
            if (button) {
                button.classList.add('hidden-on-scroll');
            }
        });
        isHidden = true;
    };
    
    const showButtons = () => {
        floatingButtons.forEach(button => {
            if (button) {
                button.classList.remove('hidden-on-scroll');
            }
        });
        isHidden = false;
    };
    
    const handleScroll = () => {
        if (!isSmallScreen()) {
            // Always show buttons on large screens
            showButtons();
            return;
        }
        
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Clear any pending timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Hide buttons when scrolling down
        if (scrollDelta > 5 && currentScrollY > 100 && !isHidden) {
            hideButtons();
        }
        
        // Show buttons when scrolling up or at top
        if (scrollDelta < -5 || currentScrollY < 100) {
            showButtons();
            
            // Auto-hide after 3 seconds of inactivity
            scrollTimeout = setTimeout(() => {
                if (currentScrollY > 100 && !isUserInteracting()) {
                    hideButtons();
                }
            }, 3000);
        }
        
        lastScrollY = currentScrollY;
    };
    
    // Check if user is interacting with buttons
    const isUserInteracting = () => {
        return floatingButtons.some(button => 
            button && (button.matches(':hover') || button.matches(':focus'))
        );
    };
    
    // Show buttons when hovering near them
    const handleMouseMove = (e) => {
        if (!isSmallScreen() || !isHidden) return;
        
        // Show buttons if mouse is near right edge of screen
        if (window.innerWidth - e.clientX < 100 && e.clientY > window.innerHeight - 150) {
            showButtons();
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                if (!isUserInteracting() && window.scrollY > 100) {
                    hideButtons();
                }
            }, 3000);
        }
    };
    
    // Show buttons when touching near bottom-right corner on mobile
    const handleTouchStart = (e) => {
        if (!isSmallScreen() || !isHidden) return;
        
        const touch = e.touches[0];
        if (window.innerWidth - touch.clientX < 100 && touch.clientY > window.innerHeight - 150) {
            showButtons();
        }
    };
    
    // Initialize scroll hide
    window.addEventListener('scroll', debounce(handleScroll, 100));
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);
    
    // Show buttons when any floating button is clicked or focused
    floatingButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', () => {
                showButtons();
                // Keep visible for 5 seconds after interaction
                setTimeout(() => {
                    if (!isUserInteracting() && window.scrollY > 100) {
                        hideButtons();
                    }
                }, 5000);
            });
            
            button.addEventListener('focus', () => {
                showButtons();
            });
        }
    });
    
    // Initial check
    handleScroll();
}

// ===== Theme Toggle Functionality =====
function initializeThemeToggle() {
    if (!themeToggle || !themeIcon) return;
    
    // Add styles for theme toggle button
    const style = document.createElement('style');
    style.textContent = `
        .theme-toggle {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: var(--navy);
            color: var(--white);
            border-radius: var(--radius-full);
            border: 2px solid var(--cyan);
            cursor: pointer;
            z-index: var(--z-tooltip);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: var(--transition-base);
            box-shadow: var(--shadow-md);
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
            animation-delay: 1s;
        }
        
        .theme-toggle:hover {
            background-color: var(--cyan);
            color: var(--navy);
            transform: translateY(-3px) scale(1.1);
            box-shadow: var(--shadow-lg);
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        body.dark-mode .theme-toggle {
            background-color: var(--cyan);
            color: var(--navy);
        }
        
        body.dark-mode .theme-toggle:hover {
            background-color: var(--navy);
            color: var(--cyan);
        }
        
        /* Scroll hide animation */
        .theme-toggle.hidden-on-scroll {
            transform: translateY(100px);
            opacity: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Check for saved theme preference or prefer-color-scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    };
    
    if (savedTheme === 'dark') {
        setTheme(true);
    } else if (savedTheme === 'light') {
        setTheme(false);
    } else if (prefersDarkScheme.matches) {
        // No saved preference, use system preference
        setTheme(true);
        localStorage.setItem('theme', 'dark');
    } else {
        // Default to light mode
        setTheme(false);
        localStorage.setItem('theme', 'light');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            // Switch to light mode
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
            trackEvent('Theme', 'switch', 'light');
        } else {
            // Switch to dark mode
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
            trackEvent('Theme', 'switch', 'dark');
        }
        
        // Add animation effect
        themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 300);
    });
    
    // Listen for system theme changes (only if user hasn't made a choice)
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        }
    });
}

// ===== Preloader =====
function initializePreloader() {
    if (!preloader) return;
    
    // Ensure preloader shows for at least 1 second
    const startTime = Date.now();
    const minDisplayTime = 1000;
    
    window.addEventListener('load', () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minDisplayTime - elapsed);
        
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 500);
        }, remaining);
    });
    
    // Fallback in case load event doesn't fire
    setTimeout(() => {
        if (preloader.style.display !== 'none') {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 500);
        }
    }, 3000);
}

// ===== Mobile Menu =====
function initializeMobileMenu() {
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
        mobileMenuBtn.innerHTML = isActive 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        
        // Toggle body scroll
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

function closeMobileMenu() {
    if (navMenu && mobileMenuBtn) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', false);
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    }
}

// ===== Smooth Scrolling =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || href === '#!' || href.startsWith('http')) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = header?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== Formspree Form Handling =====
function initializeFormspreeForm() {
    if (!contactForm) return;
    
    // Clear any existing error states
    clearFormErrors();
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => validateField(input));
        
        // Clear errors on input
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('error')) {
                clearFieldError(input);
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        // Prevent default form submission initially
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Please fill all required fields correctly.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Get Formspree endpoint from form action
            const formAction = contactForm.getAttribute('action');
            
            if (!formAction || !formAction.includes('formspree.io')) {
                throw new Error('Formspree endpoint not configured properly');
            }
            
            // Send data to Formspree
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Formspree success
                showFormSuccess();
                trackEvent('Contact', 'form_submission', 'Success');
                
                // Clear form after successful submission
                contactForm.reset();
                
                // Redirect to success page (optional)
                // window.location.href = '/thank-you.html';
                
            } else {
                // Formspree error
                const errorData = await response.json();
                throw new Error(errorData.error || 'Form submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            let errorMessage = 'There was an error sending your message. ';
            if (error.message.includes('network')) {
                errorMessage += 'Please check your internet connection.';
            } else if (error.message.includes('spam')) {
                errorMessage += 'Your submission was flagged as spam.';
            } else {
                errorMessage += 'Please try again later or contact us directly.';
            }
            
            showNotification(errorMessage, 'error');
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message');
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.parentElement.classList.add('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.parentElement.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-group.error');
    errorElements.forEach(element => {
        element.classList.remove('error');
        const errorMessage = element.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    });
}

function showFormSuccess() {
    // Show success message
    showNotification('Thank you! Your message has been sent successfully. We\'ll contact you within 24 hours.', 'success');
    
    // Show success element on page
    const successElement = document.getElementById('form-success');
    const formElement = document.getElementById('consultation-form');
    
    if (successElement && formElement) {
        successElement.style.display = 'block';
        formElement.style.display = 'none';
        
        // Scroll to success message
        setTimeout(() => {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // Reset form
    if (contactForm) {
        contactForm.reset();
        
        // Re-enable submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
        }
    }
}

// ===== Check for Formspree Success Redirect =====
function checkFormspreeSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Formspree redirects to this URL on success
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        
        // Clear the URL parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// ===== Tabs Functionality =====
function initializeTabs() {
    if (!tabBtns.length || !tabPanes.length) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                p.style.display = 'none';
            });
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const activePane = document.getElementById(tabId);
            if (activePane) {
                activePane.style.display = 'block';
                setTimeout(() => {
                    activePane.classList.add('active');
                }, 10);
            }
            
            // Track tab change
            trackEvent('Solutions', 'tab_switch', tabId);
        });
    });
    
    // Initialize first tab
    if (tabBtns[0]) {
        tabBtns[0].click();
    }
}

// ===== Counter Animations =====
function initializeCounters() {
    if (!counters.length) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const suffix = counter.textContent.replace(/[0-9.]/g, '');
                const isDecimal = counter.textContent.includes('.');
                
                animateCounter(counter, target, suffix, isDecimal);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, suffix, isDecimal) {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const increment = target / totalFrames;
    
    let currentFrame = 0;
    let currentValue = 0;
    
    const updateCounter = () => {
        currentFrame++;
        currentValue += increment;
        
        if (currentFrame < totalFrames) {
            const displayValue = isDecimal 
                ? currentValue.toFixed(1)
                : Math.floor(currentValue);
            element.textContent = displayValue + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            const finalValue = isDecimal ? target.toFixed(1) : target;
            element.textContent = finalValue + suffix;
        }
    };
    
    updateCounter();
}

// ===== Scroll Effects =====
function initializeScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Initial check
    handleScroll();
}

function handleScroll() {
    // Header scroll effect
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Update active nav link
    updateActiveNavLink();
    
    // Back to top button
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
            backToTop.style.transform = 'translateY(10px)';
        }
    }
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSection}` || (currentSection === 'home' && href === '#')) {
            link.classList.add('active');
        }
    });
}

// ===== Back to Top =====
function initializeBackToTop() {
    if (!backToTop) return;
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update URL
        history.pushState(null, null, '#home');
        
        // Track back to top click
        trackEvent('Navigation', 'back_to_top', 'click');
    });
}

// ===== Animations =====
function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.service-card, .case-study, .testimonial-card, .stat-box');
    
    animatedElements.forEach((el, index) => {
        el.style.setProperty('--animation-delay', `${index * 100}ms`);
    });
    
    // Intersection Observer for animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// ===== Service Cards Hover Effects =====
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.1)';
            }
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
        
        // Touch device support
        card.addEventListener('touchstart', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.1)';
            }
        }, { passive: true });
        
        card.addEventListener('touchend', function() {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = '';
            }
        }, { passive: true });
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}" aria-hidden="true"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Force reflow for animation
    notification.offsetHeight;
    
    // Add active class for animation
    notification.classList.add('active');
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Pause auto-close on hover/focus
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoCloseTimer);
    });
    
    notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    });
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                z-index: 9999;
                max-width: 400px;
                min-width: 300px;
                transform: translateX(100%);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .notification.active {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-success {
                background: #4CAF50;
            }
            
            .notification-error {
                background: #F44336;
            }
            
            .notification-info {
                background: #2196F3;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1rem;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.2s;
                border-radius: 4px;
            }
            
            .notification-close:hover,
            .notification-close:focus {
                opacity: 0.8;
                outline: 2px solid rgba(255,255,255,0.3);
            }
            
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function closeNotification(notification) {
    notification.classList.remove('active');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// ===== Analytics Tracking =====
function initializeAnalyticsTracking() {
    // Track CTA button clicks
    document.querySelectorAll('.btn, .service-link, .case-link').forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.trim() || this.getAttribute('aria-label') || 'Button';
            trackEvent('CTA', 'click', text);
        });
    });
    
    // Track phone link clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Contact', 'phone_click', this.href);
        });
    });
    
    // Track email link clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Contact', 'email_click', this.href);
        });
    });
    
    // Track theme toggle clicks
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            trackEvent('Theme', 'toggle', isDarkMode ? 'dark' : 'light');
        });
    }
}

function trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    
    // Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Custom event dispatch
    const event = new CustomEvent('analyticsEvent', {
        detail: { category, action, label }
    });
    window.dispatchEvent(event);
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== Export for module usage =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializePreloader,
        initializeMobileMenu,
        initializeFormspreeForm,
        initializeThemeToggle,
        initializeScrollHide,
        showNotification,
        trackEvent,
        debounce
    };
}