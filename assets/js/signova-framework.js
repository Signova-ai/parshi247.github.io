/**
 * Signova Framework JavaScript
 * Unified mobile-optimized framework for consistent interactions
 * Version: 1.0.0
 */

class SignovaFramework {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isTouch = 'ontouchstart' in window;
        this.mobileNavOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupMobileNavigation();
        this.setupScrollEffects();
        this.setupFormEnhancements();
        this.setupNotificationSystem();
        this.setupAnimations();
        this.setupTouchOptimizations();
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }
    
    onDOMReady() {
        this.createMobileNavigation();
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.initializeComponents();
    }
    
    setupEventListeners() {
        // Resize handler with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });
        
        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 500);
        });
        
        // Prevent zoom on double tap for iOS
        if (this.isTouch) {
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (e) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Close mobile nav if switching to desktop
        if (wasMobile && !this.isMobile && this.mobileNavOpen) {
            this.closeMobileNav();
        }
        
        // Update mobile navigation visibility
        this.updateMobileNavigation();
    }
    
    createMobileNavigation() {
        if (!this.isMobile) return;
        
        // Create mobile nav toggle if it doesn't exist
        if (!document.querySelector('.mobile-nav-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-nav-toggle';
            toggle.innerHTML = '☰';
            toggle.setAttribute('aria-label', 'Open navigation menu');
            toggle.addEventListener('click', () => this.toggleMobileNav());
            document.body.appendChild(toggle);
        }
        
        // Create mobile nav menu if it doesn't exist
        if (!document.querySelector('.mobile-nav-menu')) {
            this.createMobileNavMenu();
        }
        
        // Create overlay
        if (!document.querySelector('.mobile-nav-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-nav-overlay';
            overlay.addEventListener('click', () => this.closeMobileNav());
            document.body.appendChild(overlay);
        }
    }
    
    createMobileNavMenu() {
        const desktopNav = document.querySelector('.nav-links');
        if (!desktopNav) return;
        
        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-nav-menu';
        
        // Header
        const header = document.createElement('div');
        header.className = 'mobile-nav-header';
        
        const logo = document.createElement('a');
        logo.href = 'index.html';
        logo.className = 'signova-logo';
        logo.textContent = 'Signova';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-nav-close';
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('aria-label', 'Close navigation menu');
        closeBtn.addEventListener('click', () => this.closeMobileNav());
        
        header.appendChild(logo);
        header.appendChild(closeBtn);
        
        // Links
        const linksList = document.createElement('ul');
        linksList.className = 'mobile-nav-links';
        
        // Copy desktop nav links
        const desktopLinks = desktopNav.querySelectorAll('.nav-link');
        desktopLinks.forEach(link => {
            const listItem = document.createElement('li');
            listItem.className = 'mobile-nav-item';
            
            const mobileLink = document.createElement('a');
            mobileLink.href = link.href;
            mobileLink.className = 'mobile-nav-link';
            mobileLink.textContent = link.textContent;
            
            // Add active state
            if (link.classList.contains('active')) {
                mobileLink.classList.add('active');
            }
            
            mobileLink.addEventListener('click', () => {
                this.closeMobileNav();
                // Add loading state
                this.showNotification(`Navigating to ${link.textContent}...`, 'info');
            });
            
            listItem.appendChild(mobileLink);
            linksList.appendChild(listItem);
        });
        
        // Add auth buttons if they exist
        const authButtons = document.querySelector('.nav-auth');
        if (authButtons) {
            const authContainer = document.createElement('div');
            authContainer.className = 'mobile-nav-auth';
            authContainer.style.cssText = `
                margin-top: auto;
                padding-top: var(--space-xl);
                border-top: 1px solid var(--color-border);
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
            `;
            
            const authLinks = authButtons.querySelectorAll('a, button');
            authLinks.forEach(authLink => {
                const mobileAuthLink = authLink.cloneNode(true);
                mobileAuthLink.className = authLink.classList.contains('btn-primary') ? 
                    'btn btn-primary' : 'btn btn-ghost';
                mobileAuthLink.style.width = '100%';
                authContainer.appendChild(mobileAuthLink);
            });
            
            mobileNav.appendChild(header);
            mobileNav.appendChild(linksList);
            mobileNav.appendChild(authContainer);
        } else {
            mobileNav.appendChild(header);
            mobileNav.appendChild(linksList);
        }
        
        document.body.appendChild(mobileNav);
    }
    
    setupMobileNavigation() {
        // Handle mobile nav toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('.mobile-nav-toggle')) {
                this.toggleMobileNav();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileNavOpen) {
                this.closeMobileNav();
            }
        });
    }
    
    toggleMobileNav() {
        if (this.mobileNavOpen) {
            this.closeMobileNav();
        } else {
            this.openMobileNav();
        }
    }
    
    openMobileNav() {
        this.mobileNavOpen = true;
        document.body.style.overflow = 'hidden';
        
        const menu = document.querySelector('.mobile-nav-menu');
        const overlay = document.querySelector('.mobile-nav-overlay');
        
        if (menu) menu.classList.add('active');
        if (overlay) overlay.classList.add('active');
        
        // Focus management
        const firstLink = menu?.querySelector('.mobile-nav-link');
        if (firstLink) firstLink.focus();
    }
    
    closeMobileNav() {
        this.mobileNavOpen = false;
        document.body.style.overflow = '';
        
        const menu = document.querySelector('.mobile-nav-menu');
        const overlay = document.querySelector('.mobile-nav-overlay');
        
        if (menu) menu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }
    
    updateMobileNavigation() {
        const toggle = document.querySelector('.mobile-nav-toggle');
        const menu = document.querySelector('.mobile-nav-menu');
        const overlay = document.querySelector('.mobile-nav-overlay');
        
        if (this.isMobile) {
            if (toggle) toggle.style.display = 'block';
            if (menu) menu.style.display = 'flex';
            if (overlay) overlay.style.display = 'block';
        } else {
            if (toggle) toggle.style.display = 'none';
            if (menu) menu.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
            this.closeMobileNav();
        }
    }
    
    setupScrollEffects() {
        let ticking = false;
        let lastScrollTop = 0;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Navbar scroll effect
                    const navbar = document.querySelector('.signova-navbar');
                    if (navbar) {
                        if (scrollTop > 100) {
                            navbar.classList.add('scrolled');
                        } else {
                            navbar.classList.remove('scrolled');
                        }
                    }
                    
                    // Hide/show mobile nav toggle on scroll (mobile only)
                    if (this.isMobile) {
                        const toggle = document.querySelector('.mobile-nav-toggle');
                        if (toggle) {
                            if (scrollTop > lastScrollTop && scrollTop > 200) {
                                toggle.style.transform = 'translateY(-100px)';
                            } else {
                                toggle.style.transform = 'translateY(0)';
                            }
                        }
                    }
                    
                    lastScrollTop = scrollTop;
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupIntersectionObserver() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animations for grid items
                    if (entry.target.parentElement?.classList.contains('features-grid') ||
                        entry.target.parentElement?.classList.contains('testimonials-grid') ||
                        entry.target.parentElement?.classList.contains('pricing-preview')) {
                        
                        const siblings = Array.from(entry.target.parentElement.children);
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 100}ms`;
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
        
        // Observe cards and other animated elements
        document.querySelectorAll('.card, .feature-card, .testimonial-card, .pricing-card').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
    
    setupFormEnhancements() {
        // Enhanced form handling
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (!form.matches('form')) return;
            
            // Add loading state to submit button
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent || submitBtn.value;
                submitBtn.disabled = true;
                
                if (submitBtn.tagName === 'BUTTON') {
                    submitBtn.innerHTML = '<div class="loading-spinner"></div>' + 'Processing...';
                } else {
                    submitBtn.value = 'Processing...';
                }
                
                // Reset after delay (for demo purposes)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    if (submitBtn.tagName === 'BUTTON') {
                        submitBtn.textContent = originalText;
                    } else {
                        submitBtn.value = originalText;
                    }
                }, 2000);
            }
        });
        
        // Enhanced input focus effects
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('.form-input, .form-select, .form-textarea')) {
                e.target.parentElement?.classList.add('focused');
            }
        });
        
        document.addEventListener('focusout', (e) => {
            if (e.target.matches('.form-input, .form-select, .form-textarea')) {
                e.target.parentElement?.classList.remove('focused');
            }
        });
    }
    
    setupNotificationSystem() {
        // Create notification container
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: var(--space-xl);
                right: var(--space-xl);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }
    
    static showNotification(message, type = 'info', duration = 3000) {
        const container = document.querySelector('.notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--color-surface);
            backdrop-filter: saturate(180%) blur(20px);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: var(--space-lg) var(--space-xl);
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: all var(--transition-smooth);
            pointer-events: all;
            max-width: 300px;
            font-size: 0.9rem;
            font-weight: var(--font-weight-medium);
        `;
        
        // Type-specific styling
        if (type === 'success') {
            notification.style.borderLeftColor = '#10b981';
            notification.innerHTML = `<span style="color: #10b981; margin-right: 8px;">✓</span>${message}`;
        } else if (type === 'error') {
            notification.style.borderLeftColor = '#ef4444';
            notification.innerHTML = `<span style="color: #ef4444; margin-right: 8px;">✕</span>${message}`;
        } else if (type === 'warning') {
            notification.style.borderLeftColor = '#f59e0b';
            notification.innerHTML = `<span style="color: #f59e0b; margin-right: 8px;">⚠</span>${message}`;
        } else {
            notification.style.borderLeftColor = '#2563eb';
            notification.innerHTML = `<span style="color: #2563eb; margin-right: 8px;">ℹ</span>${message}`;
        }
        
        container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    setupAnimations() {
        // Add CSS for loading spinner
        if (!document.querySelector('#signova-animations')) {
            const style = document.createElement('style');
            style.id = 'signova-animations';
            style.textContent = `
                .loading-spinner {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: currentColor;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .animate-in {
                    animation: fadeInUp 0.6s ease forwards;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .pulse {
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                .fade-in {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
                .slide-up {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
                .scale-in {
                    opacity: 0;
                    transform: scale(0.9);
                    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupTouchOptimizations() {
        if (!this.isTouch) return;
        
        // Add touch-friendly classes
        document.body.classList.add('touch-device');
        
        // Optimize touch interactions
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('.btn, .card, .nav-link')) {
                e.target.classList.add('touch-active');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.matches('.btn, .card, .nav-link')) {
                setTimeout(() => {
                    e.target.classList.remove('touch-active');
                }, 150);
            }
        }, { passive: true });
        
        // Add touch-active styles
        if (!document.querySelector('#touch-styles')) {
            const style = document.createElement('style');
            style.id = 'touch-styles';
            style.textContent = `
                .touch-device .touch-active {
                    transform: scale(0.98);
                    opacity: 0.8;
                }
                
                .touch-device .btn.touch-active {
                    transform: scale(0.95);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupLazyLoading() {
        // Lazy load images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    initializeComponents() {
        // Initialize any page-specific components
        this.initializePricingCards();
        this.initializeTestimonials();
        this.initializePortalComponents();
    }
    
    initializePricingCards() {
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.matches('.btn')) return; // Don't interfere with button clicks
                
                // Highlight selected card
                document.querySelectorAll('.pricing-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });
    }
    
    initializeTestimonials() {
        // Auto-rotate testimonials if multiple exist
        const testimonialContainer = document.querySelector('.testimonials-grid');
        if (testimonialContainer && testimonialContainer.children.length > 3) {
            // Implementation for testimonial rotation
        }
    }
    
    initializePortalComponents() {
        // Portal-specific initialization
        if (document.querySelector('.portal-container')) {
            this.initializePortalNavigation();
            this.initializePortalDashboard();
        }
    }
    
    initializePortalNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Show loading notification
                const linkText = item.querySelector('.nav-link').textContent.trim();
                SignovaFramework.showNotification(`Loading ${linkText}...`, 'info');
            });
        });
    }
    
    initializePortalDashboard() {
        // Initialize dashboard interactions
        document.querySelectorAll('.document-item').forEach(item => {
            item.addEventListener('click', () => {
                const docName = item.querySelector('.document-name').textContent;
                SignovaFramework.showNotification(`Opening ${docName}...`, 'info');
            });
        });
        
        // Real-time data updates simulation
        this.startDataUpdates();
    }
    
    startDataUpdates() {
        setInterval(() => {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                if (stat.textContent.includes('%') || stat.textContent.includes('s')) {
                    return; // Don't update percentages or time values
                }
                
                if (!stat.textContent.includes('.')) {
                    const currentCount = parseInt(stat.textContent.replace(/,/g, ''));
                    const newCount = currentCount + Math.floor(Math.random() * 3);
                    stat.textContent = newCount.toLocaleString();
                }
            });
        }, 30000);
    }
    
    // Utility methods
    static debounce(func, wait) {
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
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize framework
const signovaFramework = new SignovaFramework();

// Export for global access
window.SignovaFramework = SignovaFramework;


    // Initialize AI Agents integration
    initializeAIAgents() {
        // Add framework methods for AI agent interactions
        this.aiAgents = {
            showNotification: (message, type = 'info') => {
                this.showNotification(message, type);
            },
            
            optimizeElement: (selector, optimizations) => {
                const element = document.querySelector(selector);
                if (element && optimizations) {
                    Object.assign(element.style, optimizations.styles || {});
                    if (optimizations.attributes) {
                        Object.entries(optimizations.attributes).forEach(([key, value]) => {
                            element.setAttribute(key, value);
                        });
                    }
                }
            },
            
            enhanceUserExperience: () => {
                this.enhanceUserExperience();
            }
        };
        
        console.log('🤖 AI Agents integration initialized');
    }
    
    // Enhanced user experience methods
    enhanceUserExperience() {
        this.addSmartScrolling();
        this.addPredictiveLoading();
        this.addContextualHelp();
    }
    
    addSmartScrolling() {
        let scrollTimeout;
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
                document.body.classList.add('is-scrolling');
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                document.body.classList.remove('is-scrolling');
            }, 150);
        });
    }
    
    addPredictiveLoading() {
        // Preload likely next pages
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"]');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const href = link.getAttribute('href');
                if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
                    const prefetch = document.createElement('link');
                    prefetch.rel = 'prefetch';
                    prefetch.href = href;
                    document.head.appendChild(prefetch);
                }
            });
        });
    }
    
    addContextualHelp() {
        // Add smart tooltips for complex elements
        const complexElements = document.querySelectorAll('[data-help]');
        complexElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.showTooltip(element, element.getAttribute('data-help'));
            });
        });
    }
    
    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'smart-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            max-width: 200px;
        `;
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
        tooltip.style.opacity = '1';
        
        element.addEventListener('mouseleave', () => {
            tooltip.remove();
        }, { once: true });
    }
}

