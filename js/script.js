/*
================================================================================
PAN LOGISTICS - Premium Enterprise JavaScript
================================================================================
Version: 1.0
Description: All JavaScript functionality for the logistics website
================================================================================
*/

(function() {
    'use strict';

    // API Base URL - Configurable for different environments
    const API_URL = (window.API_URL || 'http://localhost:3000/api');

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const backToTop = document.querySelector('.back-to-top');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================

    /**
     * Show error message
     */
    function showError(formGroup, message) {
        const errorMessage = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    /**
     * Clear error message
     */
    function clearError(formGroup) {
        formGroup.classList.remove('error');
    }

    /**
     * Get status color class
     */
    function getStatusClass(status) {
        const statusMap = {
            'Booked': 'status-booked',
            'In Transit': 'status-transit',
            'At Warehouse': 'status-warehouse',
            'Out for Delivery': 'status-delivery',
            'Delivered': 'status-delivered'
        };
        return statusMap[status] || 'status-default';
    }

    /**
     * Show notification
     */
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Format date for display
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // ==========================================================================
    // API FUNCTIONS
    // ==========================================================================

    /**
     * Make API request
     */
    async function apiRequest(endpoint, options = {}) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    }

    /**
     * Track shipment
     */
    async function trackShipment(trackingNumber) {
        return await apiRequest(`/tracking/${trackingNumber}`);
    }

    /**
     * Create booking
     */
    async function createBooking(bookingData) {
        return await apiRequest('/bookings/create', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    /**
     * Submit contact form
     */
    async function submitContact(contactData) {
        return await apiRequest('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }

    // ==========================================================================
    // HEADER FUNCTIONALITY
    // ==========================================================================

    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }
    }

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================

    function toggleMobileNav() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    function closeMobileNav() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // ==========================================================================
    // SCROLL ANIMATIONS
    // ==========================================================================

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ==========================================================================
    // STATISTICS COUNTER ANIMATION
    // ==========================================================================

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });

            observer.observe(counter);
        });
    }

    // ==========================================================================
    // TESTIMONIALS SLIDER
    // ==========================================================================

    function initTestimonialsSlider() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.testimonial-dot');
        let currentIndex = 0;
        let autoplayInterval;

        function showTestimonial(index) {
            testimonials.forEach((t, i) => {
                t.classList.toggle('active', i === index);
            });
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        function nextTestimonial() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextTestimonial, 5000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showTestimonial(currentIndex);
                stopAutoplay();
                startAutoplay();
            });
        });

        startAutoplay();
    }

    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================

    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ==========================================================================
    // BOOKING FORM HANDLING
    // ==========================================================================

    function initBookingForm() {
        const form = document.getElementById('bookingForm');
        
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Processing...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(form);
                const bookingData = Object.fromEntries(formData.entries());
                
                const result = await createBooking(bookingData);
                
                // Show success
                form.style.display = 'none';
                const success = document.querySelector('.booking-success');
                success.classList.add('show');
                
                const trackingId = result.data.tracking_id || result.data.tracking_number;
                const trackingResult = document.querySelector('.tracking-result');
                trackingResult.innerHTML = `
                    <h4>Booking Confirmed!</h4>
                    <p><strong>Tracking ID:</strong> ${trackingId}</p>
                    <p><strong>Estimated Delivery:</strong> ${result.data.estimated_delivery || '7-10 business days'}</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem;">Please save your tracking ID for future reference.</p>
                `;
                
            } catch (error) {
                showNotification(error.message, 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================================================
    // TRACKING FUNCTIONALITY
    // ==========================================================================

    function initTrackingForm() {
        const form = document.getElementById('trackingForm');
        
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const trackingInput = document.getElementById('trackingInput');
            const trackingID = trackingInput.value.trim().toUpperCase();
            const submitBtn = form.querySelector('button[type="submit"]');
            
            if (!trackingID) {
                showNotification('Please enter a tracking ID', 'error');
                return;
            }

            submitBtn.innerHTML = 'Tracking...';
            submitBtn.disabled = true;

            try {
                const result = await trackShipment(trackingID);
                displayTrackingResult(result.data);
            } catch (error) {
                document.querySelector('.tracking-result-card').classList.remove('show');
                document.querySelector('.tracking-not-found').style.display = 'block';
            } finally {
                submitBtn.innerHTML = `
                    <svg class="icon" viewBox="0 0 24 24" style="width: 20px; height: 20px;"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    Track Now
                `;
                submitBtn.disabled = false;
            }
        });
    }

    function displayTrackingResult(data) {
        const resultCard = document.querySelector('.tracking-result-card');
        const notFound = document.querySelector('.tracking-not-found');
        const trackingHeader = document.querySelector('.tracking-header');
        const trackingBody = document.querySelector('.tracking-body');
        
        notFound.style.display = 'none';
        resultCard.classList.add('show');

        // Update header
        trackingHeader.innerHTML = `
            <div class="tracking-id">${data.tracking_number}</div>
            <div class="tracking-status">
                <span class="status-badge ${getStatusClass(data.status)}">${data.status}</span>
            </div>
        `;

        // Calculate progress
        const progressMap = {
            'Booked': 20,
            'In Transit': 50,
            'At Warehouse': 70,
            'Out for Delivery': 90,
            'Delivered': 100
        };
        const progress = progressMap[data.status] || 0;

        // Update body
        trackingBody.innerHTML = `
            <div class="tracking-info">
                <div class="tracking-info-item">
                    <h5>Shipment Type</h5>
                    <p>${data.shipment_details?.type || 'Not specified'}</p>
                </div>
                <div class="tracking-info-item">
                    <h5>Cargo Type</h5>
                    <p>${data.shipment_details?.cargo_type || 'Not specified'}</p>
                </div>
                <div class="tracking-info-item">
                    <h5>Weight</h5>
                    <p>${data.shipment_details?.weight || 'Not specified'}</p>
                </div>
                <div class="tracking-info-item">
                    <h5>Estimated Delivery</h5>
                    <p>${data.dates?.estimated_delivery || 'Calculating...'}</p>
                </div>
            </div>

            <div class="progress-section">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>

            <h4 style="margin-bottom: var(--spacing-lg);">Shipment Timeline</h4>
            <div class="timeline-tracker">
                ${data.timeline.map((event, index) => `
                    <div class="timeline-event ${event.completed ? 'completed' : ''} ${event.completed && index === data.timeline.findIndex(e => !e.completed) - 1 ? 'current' : ''}">
                        <h5>${event.title}</h5>
                        <p>${event.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ==========================================================================
    // CONTACT FORM HANDLING
    // ==========================================================================

    function initContactForm() {
        const form = document.getElementById('contactForm');
        
        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(form);
                const contactData = Object.fromEntries(formData.entries());
                
                await submitContact(contactData);
                
                showNotification('Message sent successfully!');
                form.reset();
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================================================
    // FORM INPUT VALIDATION (Real-time)
    // ==========================================================================

    function initFormValidation() {
        const inputs = document.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                const formGroup = this.closest('.form-group');
                if (!formGroup) return;

                if (this.hasAttribute('required') && !this.value.trim()) {
                    showError(formGroup, 'This field is required');
                } else {
                    clearError(formGroup);
                }
            });

            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    clearError(formGroup);
                }
            });
        });
    }

    // ==========================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    closeMobileNav();
                }
            });
        });
    }

    // ==========================================================================
    // BACK TO TOP FUNCTIONALITY
    // ==========================================================================

    function initBackToTop() {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // ACTIVE NAV LINK ON SCROLL
    // ==========================================================================

    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ==========================================================================
    // INITIALIZE ALL FUNCTIONS ON DOM READY
    // ==========================================================================

    function init() {
        // Event listeners
        window.addEventListener('scroll', handleScroll);
        
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileNav);
        }

        // Initialize components
        initScrollAnimations();
        animateCounters();
        initTestimonialsSlider();
        initFaqAccordion();
        initBookingForm();
        initTrackingForm();
        initContactForm();
        initFormValidation();
        initSmoothScroll();
        initBackToTop();
        initActiveNavLink();

        // Hide scroll indicator on scroll
        if (scrollIndicator) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.visibility = 'hidden';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.visibility = 'visible';
                }
            });
        }

        console.log('Pan Logistics website initialized!');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ==========================================================================
// LANGUAGE TOGGLE FUNCTIONALITY
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    if (langButtons.length === 0) return;
    
    // Get saved language or default to English
    let currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Set initial active state
    updateLanguageButtons(currentLang);
    
    // Add click handlers
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang === currentLang) return;
            
            currentLang = lang;
            localStorage.setItem('preferredLanguage', lang);
            updateLanguageButtons(lang);
            
            // Apply translations
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
            
            // Dispatch custom event for other scripts to listen
            window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
            
            // Show notification
            showLanguageNotification(lang);
        });
    });
    
    function updateLanguageButtons(activeLang) {
        langButtons.forEach(btn => {
            if (btn.dataset.lang === activeLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    function showLanguageNotification(lang) {
        const langNames = { en: 'English', fr: 'Français' };
        const langFlags = { en: '🇬🇧', fr: '🇫🇷' };
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color, #0056b3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        notification.innerHTML = `
            <span style="font-size: 1.5rem;">${langFlags[lang]}</span>
            <span>Langue changée en ${langNames[lang]}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Listen for language changes from other scripts
    window.addEventListener('languageChange', function(e) {
        console.log('Language changed to:', e.detail.language);
        // Add any additional language change handling here
    });
});
