// Main JavaScript file for Vakeelsahiba website

// Enhanced services data with categories
const servicesData = [
    {
        id: 1,
        title: "Civil Disputes",
        icon: "fas fa-gavel",
        category: "litigation",
        description: "Expert handling of civil litigation, property disputes, contract disputes, and other civil matters with comprehensive legal support.",
        link: "services.html#civil-disputes"
    },
    {
        id: 2,
        title: "Criminal Cases",
        icon: "fas fa-shield-alt",
        category: "litigation",
        description: "Experienced criminal defense representation for all types of criminal cases with dedicated advocacy and protection of rights.",
        link: "services.html#criminal-cases"
    },
    {
        id: 3,
        title: "Corporate Matters",
        icon: "fas fa-building",
        category: "corporate",
        description: "Complete corporate legal services including company formation, compliance, mergers, acquisitions, and corporate governance.",
        link: "services.html#corporate-matters"
    },
    {
        id: 4,
        title: "Matrimonial Disputes",
        icon: "fas fa-heart-broken",
        category: "family",
        description: "Sensitive handling of family law matters including divorce, custody, maintenance, and matrimonial dispute resolution.",
        link: "services.html#matrimonial-disputes"
    },
    {
        id: 5,
        title: "SARFAESI & Bank Matters",
        icon: "fas fa-university",
        category: "corporate",
        description: "Specialized expertise in SARFAESI Act matters, loan recovery, debt restructuring, and banking law disputes.",
        link: "services.html#sarfaesi-bank"
    },
    {
        id: 6,
        title: "Arbitration",
        icon: "fas fa-handshake",
        category: "litigation",
        description: "Alternative dispute resolution through arbitration, mediation, and negotiation for efficient conflict resolution.",
        link: "services.html#arbitration"
    }
];

const featuresData = [
    {
        id: 1,
        title: "24+ Years Experience",
        icon: "fas fa-calendar-alt",
        description: "More than two decades of legal expertise serving clients with dedication and achieving successful outcomes."
    },
    {
        id: 2,
        title: "Expert Legal Team",
        icon: "fas fa-users",
        description: "Highly qualified and experienced legal professionals specializing in various areas of law for comprehensive support."
    },
    {
        id: 3,
        title: "Client-Centered Approach",
        icon: "fas fa-heart",
        description: "Personalized legal services with focus on understanding client needs and delivering tailored solutions."
    },
    {
        id: 4,
        title: "High Success Rate",
        icon: "fas fa-trophy",
        description: "Proven track record of successful case outcomes with 95% client satisfaction and favorable judgments."
    },
    {
        id: 5,
        title: "Transparent Process",
        icon: "fas fa-eye",
        description: "Clear communication, transparent fee structure, and regular updates throughout the legal process."
    },
    {
        id: 6,
        title: "24/7 Support",
        icon: "fas fa-clock",
        description: "Round-the-clock availability for urgent legal matters and continuous client support when needed."
    }
];

const blogsData = [
    {
        id: 1,
        title: "Privacy is a Fundamental Right but is Subjected to...",
        date: "2025-06-20",
        excerpt: "Understanding the balance between privacy rights and legal obligations in the modern digital age.",
        image: "fas fa-shield-alt"
    },
    {
        id: 2,
        title: "BNSS vs CrPC: How the New Criminal Law Will Affect...",
        date: "2025-04-09",
        excerpt: "Comprehensive analysis of the new Bharatiya Nagarik Suraksha Sanhita and its impact on criminal proceedings.",
        image: "fas fa-balance-scale"
    },
    {
        id: 3,
        title: "The Patna High Court Directed Re-evaluation of Ans...",
        date: "2025-03-06",
        excerpt: "Recent landmark judgment from Patna High Court and its implications for legal practice.",
        image: "fas fa-university"
    },
    {
        id: 4,
        title: "SC Rules NCDRC Penalties Unaffected by IBC Morator...",
        date: "2025-02-16",
        excerpt: "Supreme Court's ruling on National Consumer Disputes Redressal Commission penalties under IBC.",
        image: "fas fa-gavel"
    },
    {
        id: 5,
        title: "The Art of Cross-Examination",
        date: "2025-02-16",
        excerpt: "Mastering the techniques and strategies of effective cross-examination in legal proceedings.",
        image: "fas fa-comments"
    },
    {
        id: 6,
        title: "Delhi High Court Upholds Corporate Governance Auto...",
        date: "2025-02-16",
        excerpt: "Recent developments in corporate governance and regulatory compliance requirements.",
        image: "fas fa-building"
    }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize navbar scroll effect
    initializeNavbarScroll();
    
    // Load dynamic content
    loadServices();
    loadFeatures();
    loadLatestBlogs();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Initialize number animations
    initializeNumberAnimations();
    
    // Initialize parallax effects
    initializeParallaxEffects();
    
    // Add smooth scrolling to anchor links
    initializeSmoothScrolling();
    
    console.log('🎉 Vakeelsahiba website initialized successfully!');
}

function initializeScrollAnimations() {
    // Create enhanced intersection observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for elements in the same container
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Add special animations for specific elements
                    if (entry.target.hasAttribute('data-animate-number')) {
                        const targetNumber = entry.target.textContent.replace(/\D/g, '');
                        const suffix = entry.target.textContent.replace(/\d/g, '');
                        entry.target.dataset.suffix = suffix;
                        animateNumber(entry.target, 0, targetNumber);
                    }
                    
                    // Add bounce effect for feature icons
                    if (entry.target.classList.contains('feature-icon')) {
                        entry.target.classList.add('animate-bounce');
                    }
                    
                    // Add pulse effect for step numbers
                    if (entry.target.classList.contains('step-number')) {
                        entry.target.classList.add('animate-pulse');
                    }
                }, delay);
                
                // Unobserve after animation unless it should repeat
                if (!entry.target.hasAttribute('data-repeat-animation')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animation elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .slide-up, .flip-in');
    animatedElements.forEach((el, index) => {
        // Add stagger classes for better timing
        el.classList.add(`stagger-${(index % 6) + 1}`);
        observer.observe(el);
    });
    
    // Add intersection observer for cards with special effects
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                entry.target.classList.add('animate-slideInUp');
            }
        });
    }, { threshold: 0.2 });
    
    // Observe cards
    const cards = document.querySelectorAll('.card, .service-card, .blog-card, .feature-item');
    cards.forEach(card => cardObserver.observe(card));
}

function initializeNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

function loadServices() {
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    const servicesHTML = servicesData.map((service, index) => `
        <div class="service-card fade-in" data-category="${service.category}" style="animation-delay: ${index * 0.1}s">
            <div class="service-card-header">
                <i class="${service.icon} service-card-icon"></i>
                <h3 class="service-card-title">${service.title}</h3>
            </div>
            <div class="service-card-body">
                <p class="service-card-text">${service.description}</p>
                <a href="${service.link}" class="service-card-link">
                    Learn More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
    
    servicesContainer.innerHTML = servicesHTML;
    
    // Initialize service filtering
    initializeServiceFiltering();
    
    // Re-initialize animations for new elements
    const serviceCards = servicesContainer.querySelectorAll('.fade-in');
    const observer = createIntersectionObserver();
    serviceCards.forEach(card => observer.observe(card));
}

function loadFeatures() {
    const featuresContainer = document.getElementById('features-container');
    if (!featuresContainer) return;
    
    const featuresHTML = featuresData.map((feature, index) => `
        <div class="feature-item fade-in" style="animation-delay: ${index * 0.15}s">
            <div class="feature-icon">
                <i class="${feature.icon}"></i>
            </div>
            <h4>${feature.title}</h4>
            <p>${feature.description}</p>
        </div>
    `).join('');
    
    featuresContainer.innerHTML = featuresHTML;
    
    // Re-initialize animations for new elements
    const featureItems = featuresContainer.querySelectorAll('.fade-in');
    const observer = createIntersectionObserver();
    featureItems.forEach(item => observer.observe(item));
}

function loadLatestBlogs() {
    const blogsContainer = document.getElementById('latest-blogs-container');
    if (!blogsContainer) return;
    
    const blogsHTML = blogsData.slice(0, 3).map(blog => `
        <div class="col-4">
            <div class="blog-card fade-in">
                <div class="blog-card-image">
                    <i class="${blog.image}"></i>
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-date">${formatDate(blog.date)}</div>
                    <h3 class="blog-card-title">${blog.title}</h3>
                    <p class="blog-card-excerpt">${blog.excerpt}</p>
                    <a href="blog/post.html?id=${blog.id}" class="blog-card-link">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    blogsContainer.innerHTML = blogsHTML;
    
    // Re-initialize animations for new elements
    const blogCards = blogsContainer.querySelectorAll('.fade-in');
    const observer = createIntersectionObserver();
    blogCards.forEach(card => observer.observe(card));
}

function initializeServiceFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter services with animation
            serviceCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('animate-fadeInUp');
                    setTimeout(() => {
                        card.classList.remove('animate-fadeInUp');
                    }, 800);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Enhanced intersection observer for better animations
function createIntersectionObserver(options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observerOptions = { ...defaultOptions, ...options };
    
    return new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = index * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('service-card')) {
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.style.opacity = '1';
                    }
                    
                    if (entry.target.classList.contains('feature-item')) {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }
                    
                    if (entry.target.classList.contains('stat-card')) {
                        entry.target.classList.add('animate-slideInUp');
                    }
                    
                    // Animate numbers
                    if (entry.target.hasAttribute('data-animate-number')) {
                        const targetNumber = entry.target.textContent.replace(/\D/g, '');
                        const suffix = entry.target.textContent.replace(/\d/g, '');
                        entry.target.dataset.suffix = suffix;
                        animateNumber(entry.target, 0, targetNumber);
                    }
                }, delay);
                
                // Unobserve after animation unless it should repeat
                if (!entry.target.hasAttribute('data-repeat-animation')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
}

// Enhanced number animation
function animateNumber(element, start, end) {
    const duration = 2000;
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOutCubic);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Enhanced mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    if (mobileMenu) {
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            mobileMenu.classList.remove('active');
            body.style.overflow = 'auto';
        } else {
            mobileMenu.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }
}

function closeMobileMenuOnOutsideClick(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            toggleMobileMenu();
        }
    }
}

// Enhanced component initialization
function initializeComponents() {
    // Wait for components to load before initializing
    const checkComponents = () => {
        const navbar = document.getElementById('navbar');
        const footer = document.querySelector('.footer');
        
        if (navbar && footer) {
            // Components loaded, initialize functionality
            initializeNavigation();
            initializeAnimations();
            console.log('✅ Components initialized successfully');
        } else {
            // Components not ready, check again
            setTimeout(checkComponents, 100);
        }
    };
    
    checkComponents();
}

function initializeNavigation() {
    // Set active navigation based on current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const page = link.getAttribute('data-page');
        
        if (page === 'home' && (currentPage === 'index' || currentPage === '')) {
            link.classList.add('active');
        } else if (page === currentPage || link.getAttribute('href').includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

function initializeAnimations() {
    // Enhanced scroll animations with better performance
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animations for children
                const children = entry.target.querySelectorAll('.fade-in:not(.visible)');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all animation elements
    const elementsToAnimate = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    elementsToAnimate.forEach(el => animationObserver.observe(el));
}

// Initialize components when page loads
document.addEventListener('DOMContentLoaded', initializeComponents);

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`🚀 Page loaded in ${loadTime}ms`);
        });
    }
}

monitorPerformance();

// Enhanced contact form handling
function handleContactForm() {
    const contactForms = document.querySelectorAll('form[data-contact="true"]');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const resetLoading = addLoadingState(submitButton, 'Sending...');
            
            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
            } catch (error) {
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                resetLoading();
            }
        });
    });
}

// Enhanced search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"]');
    
    searchInputs.forEach(input => {
        const handleSearch = debounce((query) => {
            if (query.length > 2) {
                // Implement search logic here
                console.log('Searching for:', query);
            }
        }, 300);
        
        input.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    });
}

// Enhanced scroll-to-top button with better animations
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 55px;
        height: 55px;
        border: none;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: white;
        font-size: 1.3rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transform: translateY(100px) scale(0.8);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(scrollButton);
    
    // Enhanced show/hide with animation
    const toggleScrollButton = throttle(() => {
        if (window.pageYOffset > 400) {
            scrollButton.style.transform = 'translateY(0) scale(1)';
            scrollButton.style.opacity = '1';
        } else {
            scrollButton.style.transform = 'translateY(100px) scale(0.8)';
            scrollButton.style.opacity = '0';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleScrollButton);
    
    // Enhanced click animation
    scrollButton.addEventListener('click', () => {
        scrollButton.classList.add('animate-rubberBand');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(() => {
            scrollButton.classList.remove('animate-rubberBand');
        }, 1000);
    });
    
    // Hover effects
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.transform += ' scale(1.1)';
        scrollButton.style.background = 'var(--gradient-accent)';
    });
    
    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.transform = scrollButton.style.transform.replace(' scale(1.1)', '');
        scrollButton.style.background = 'var(--gradient-primary)';
    });
}

// Initialize additional features
setTimeout(() => {
    handleContactForm();
    initializeSearch();
    addScrollToTopButton();
}, 1000);

// Comprehensive mobile-specific JavaScript functionality including touch gestures, viewport handling, and mobile menu enhancements
function initializeInteractiveElements() {
    // Mobile-optimized interactive elements
    initializeTouchInteractions();
    initializeMobileGestures();
    initializeViewportHandling();
    initializeMobileOptimizations();
}

function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuToggle && mobileMenu) {
        // Enhanced mobile menu toggle
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', closeMobileMenuOnOutsideClick);
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }, 100);
        });
    }
}

function initializeTouchInteractions() {
    // Enhanced touch interactions for mobile devices
    const touchElements = document.querySelectorAll('.btn, .card, .service-card, .blog-card');
    
    touchElements.forEach(element => {
        // Add touch feedback
        element.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
        
        element.addEventListener('touchcancel', function(e) {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Add CSS for touch feedback
    if (!document.getElementById('touch-feedback-styles')) {
        const style = document.createElement('style');
        style.id = 'touch-feedback-styles';
        style.textContent = `
            .touch-active {
                transform: scale(0.98) !important;
                opacity: 0.8 !important;
                transition: all 0.1s ease !important;
            }
            
            @media (hover: none) and (pointer: coarse) {
                .btn:hover, .card:hover, .service-card:hover, .blog-card:hover {
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeMobileGestures() {
    // Swipe gestures for mobile navigation
    let startX, startY, distX, distY;
    const threshold = 100; // Minimum distance for swipe
    const restraint = 150; // Maximum distance perpendicular to swipe direction
    
    document.addEventListener('touchstart', function(e) {
        const touchObj = e.changedTouches[0];
        startX = touchObj.pageX;
        startY = touchObj.pageY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX;
        distY = touchObj.pageY - startY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
            const mobileMenu = document.getElementById('mobileMenu');
            
            // Swipe right to open menu
            if (distX > 0 && !mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            // Swipe left to close menu
            else if (distX < 0 && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    }, { passive: true });
}

function initializeViewportHandling() {
    // Handle viewport changes and iOS Safari address bar
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Set initial viewport height
    setVH();
    
    // Update on resize and orientation change
    window.addEventListener('resize', debounce(setVH, 100));
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
    
    // Prevent zoom on iOS when focusing inputs
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
    }
}

function initializeMobileOptimizations() {
    // Optimize performance for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Reduce animation complexity on mobile
        document.documentElement.classList.add('mobile-device');
        
        // Disable hover effects on touch devices
        if ('ontouchstart' in window) {
            document.documentElement.classList.add('touch-device');
        }
        
        // Optimize scroll performance
        let ticking = false;
        function updateScrollPosition() {
            // Throttled scroll updates
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Update scroll-dependent elements
                    const scrollTop = window.pageYOffset;
                    document.documentElement.style.setProperty('--scroll-y', scrollTop + 'px');
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', updateScrollPosition, { passive: true });
        
        // Optimize touch scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Add mobile-specific CSS
        if (!document.getElementById('mobile-optimizations')) {
            const style = document.createElement('style');
            style.id = 'mobile-optimizations';
            style.textContent = `
                .mobile-device * {
                    -webkit-tap-highlight-color: transparent;
                }
                
                .mobile-device .parallax {
                    background-attachment: scroll !important;
                }
                
                .touch-device .hover-lift:hover,
                .touch-device .hover-scale:hover,
                .touch-device .hover-rotate:hover {
                    transform: none !important;
                }
                
                @media (max-width: 768px) {
                    .section {
                        overflow-x: hidden;
                    }
                    
                    .container {
                        overflow-x: hidden;
                    }
                    
                    body {
                        overflow-x: hidden;
                    }
                    
                    html {
                        overflow-x: hidden;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function lazyLoadImages() {
    // Enhanced lazy loading for better mobile performance
    const images = document.querySelectorAll('img[data-src], [data-bg]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        // Handle regular images
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.bg) {
                        // Handle background images
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.classList.add('loaded');
                        img.removeAttribute('data-bg');
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            if (img.dataset.bg) {
                img.style.backgroundImage = `url(${img.dataset.bg})`;
                img.removeAttribute('data-bg');
            }
        });
    }
}

function initializeNumberAnimations() {
    // Enhanced number animations with mobile optimization
    const numberElements = document.querySelectorAll('[data-animate-number]');
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalNumber = parseInt(element.textContent);
                const duration = window.innerWidth <= 768 ? 1500 : 2000; // Faster on mobile
                
                animateNumber(element, 0, finalNumber, duration);
                numberObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });
    
    numberElements.forEach(el => numberObserver.observe(el));
}

function initializeParallaxEffects() {
    // Disable parallax on mobile for better performance
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(el => {
            el.style.backgroundAttachment = 'scroll';
        });
        return;
    }
    
    // Desktop parallax effects
    const parallaxElements = document.querySelectorAll('.parallax');
    
    const updateParallax = throttle(() => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrollTop * -0.5;
            element.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }, 10);
    
    window.addEventListener('scroll', updateParallax, { passive: true });
}

function initializeSmoothScrolling() {
    // Enhanced smooth scrolling with mobile optimization
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            // Use different scroll behavior based on device
            const scrollBehavior = window.innerWidth <= 768 ? 'auto' : 'smooth';
            
            window.scrollTo({
                top: offsetPosition,
                behavior: scrollBehavior
            });
            
            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, href);
            }
        });
    });
}

// Enhanced utility functions for mobile
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function addLoadingState(button, text = 'Loading...') {
    const originalText = button.innerHTML;
    const originalDisabled = button.disabled;
    
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.disabled = true;
    
    return function resetLoading() {
        button.innerHTML = originalText;
        button.disabled = originalDisabled;
    };
}

function showNotification(message, type = 'info', duration = 5000) {
    // Create notification element optimized for mobile
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add mobile-optimized styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        left: 20px;
        max-width: calc(100% - 40px);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateY(-100px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
    `;
    
    // Add type-specific styles
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });
    
    // Handle close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    function removeNotification(element) {
        element.style.transform = 'translateY(-100px)';
        element.style.opacity = '0';
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
}

// Enhanced format date function
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Enhanced mobile-specific number animation
function animateNumber(element, start, end, duration = 2000) {
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Enhanced easing for mobile
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * easeOutQuart);
        
        element.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Add completion animation
            element.classList.add('animate-pulse');
            setTimeout(() => {
                element.classList.remove('animate-pulse');
            }, 1000);
        }
    }
    
    requestAnimationFrame(updateNumber);
}