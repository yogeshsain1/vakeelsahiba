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
    
    // GSAP animation for services section
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.set('.service-card', {opacity: 0, y: 60, scale: 0.96});
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: i * 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            });
        });
        // Animate icons with a subtle scale/rotate
        gsap.utils.toArray('.service-card-icon').forEach((icon, i) => {
            gsap.fromTo(icon, {
                scale: 0.7,
                rotate: -10
            }, {
                scale: 1,
                rotate: 0,
                duration: 0.7,
                delay: 0.2 + i * 0.08,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: icon,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                }
            });
        });
    }
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
    
    const blogsHTML = blogsData.slice(0, 3).map((blog, index) => `
        <div class="col-4">
            <div class="blog-card fade-in" data-index="${index}">
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
    
    // Enhanced intersection observer for blog cards with optimized animations
    const blogObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const blogCard = entry.target;
                const index = parseInt(blogCard.dataset.index) || 0;
                
                // Smooth, staggered animation with better timing
                setTimeout(() => {
                    blogCard.classList.add('visible');
                    
                    // Add enhanced pulse effect to icon with proper animation
                    const icon = blogCard.querySelector('.blog-card-image i');
                    if (icon) {
                        setTimeout(() => {
                            icon.classList.add('animate-icon-pulse');
                        }, 300 + (index * 100));
                    }
                    
                    // Add floating animation to the card after main animation
                    setTimeout(() => {
                        blogCard.classList.add('animate-float-subtle');
                    }, 600 + (index * 100));
                    
                }, index * 200); // Optimized stagger timing
                
                // Unobserve after animation to improve performance
                blogObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1, // Earlier trigger for smoother experience
        rootMargin: '0px 0px -30px 0px' // Optimized trigger area
    });
    
    // Observe all blog cards with enhanced hover effects
    const blogCards = blogsContainer.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        blogObserver.observe(card);
        
        // Enhanced hover effects with smooth transitions
        card.addEventListener('mouseenter', () => {
            if (card.classList.contains('visible')) {
                card.style.transform = 'translateY(-10px) scale(1.03)';
                card.style.boxShadow = '0 15px 50px rgba(245,158,11,0.2), 0 5px 20px rgba(30,40,80,0.1)';
                card.style.zIndex = '10';
                
                // Enhance icon on hover
                const icon = card.querySelector('.blog-card-image i');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.color = 'var(--accent-color)';
                }
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('visible')) {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 8px 30px rgba(30,40,80,0.08)';
                card.style.zIndex = '1';
                
                // Reset icon
                const icon = card.querySelector('.blog-card-image i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.color = '';
                }
            }
        });
        
        // Add touch feedback for mobile
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                if (card.classList.contains('visible')) {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            }, 150);
        }, { passive: true });
    });
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
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    
    if (mobileMenu && mobileMenuOverlay && toggleButton) {
        const isOpen = mobileMenu.classList.contains('show');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.remove('show');
            mobileMenuOverlay.classList.remove('show');
            toggleButton.classList.remove('active');
            body.classList.remove('mobile-menu-open');
            
            // Change hamburger icon back to bars
            const icon = toggleButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
            
            // Remove active states from menu items
            document.querySelectorAll('.mobile-menu-nav .nav-link').forEach(link => {
                link.classList.remove('active');
            });
        } else {
            // Open menu
            mobileMenu.classList.add('show');
            mobileMenuOverlay.classList.add('show');
            toggleButton.classList.add('active');
            body.classList.add('mobile-menu-open');
            
            // Change hamburger icon to X
            const icon = toggleButton.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-times';
            }
            
            // Set active page
            setActiveMobileMenuItem();
        }
    }
}

function initializeMobileMenu() {
    // Set initial active menu item
    setActiveMobileMenuItem();
    
    // Close mobile menu when clicking on menu links
    document.querySelectorAll('.mobile-menu-nav a').forEach(link => {
        link.addEventListener('click', () => {
            // Add small delay for better UX
            setTimeout(() => {
                toggleMobileMenu();
            }, 150);
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Close mobile menu on window resize (if switching to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        }
    });
}

// Set active menu item based on current page
function setActiveMobileMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.mobile-menu-nav .nav-link');
    
    menuLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Smart Navbar Hide/Show on Scroll
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (currentScrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar based on scroll direction (only on mobile)
    if (window.innerWidth <= 768) {
        if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
            // Scrolling down - hide navbar
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('navbar-hidden');
        }
    }
    
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

// Throttled scroll handler for better performance
function throttledScrollHandler() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleNavbarScroll, 10);
}

// Touch gesture support for mobile menu
function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (!touchStartY) return;
    
    touchEndY = e.touches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    // Prevent pull-to-refresh when menu is open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && mobileMenu.classList.contains('show')) {
        if (mobileMenu.scrollTop === 0 && diff < 0) {
            e.preventDefault();
        }
    }
}

function handleTouchEnd() {
    if (!touchStartY || !touchEndY) return;
    
    const diff = touchStartY - touchEndY;
    const navbar = document.getElementById('navbar');
    
    // Show navbar on upward swipe
    if (diff < -50 && window.innerWidth <= 768) {
        if (navbar) {
            navbar.classList.remove('navbar-hidden');
        }
    }
    
    touchStartY = 0;
    touchEndY = 0;
}

// Close mobile menu when clicking outside
function handleOutsideClick(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileMenu.classList.contains('show')) {
        if (!mobileMenu.contains(e.target) && !toggleButton.contains(e.target)) {
            toggleMobileMenu();
        }
    }
}

// Close mobile menu on escape key
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('show')) {
            toggleMobileMenu();
        }
    }
}

// Enhanced mobile menu item click handler
function handleMobileMenuClick(e) {
    const target = e.target.closest('a');
    if (target && target.href) {
        // Add touch feedback
        target.classList.add('touch-active');
        setTimeout(() => {
            target.classList.remove('touch-active');
        }, 150);
        
        // Close menu after a short delay for better UX
        setTimeout(() => {
            toggleMobileMenu();
        }, 200);
    }
}

// Smooth scroll to sections with mobile navbar offset
function smoothScrollToSection(targetId) {
    const target = document.getElementById(targetId);
    const navbar = document.getElementById('navbar');
    
    if (target && navbar) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle viewport height changes (mobile browsers)
function handleViewportChange() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize mobile navbar functionality
function initMobileNavbar() {
    // Set initial active menu item
    setActiveMobileMenuItem();
    
    // Add scroll listener
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Add touch listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Add click outside listener
    document.addEventListener('click', handleOutsideClick);
    
    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
    
    // Add mobile menu click handler
    const mobileMenuNav = document.querySelector('.mobile-menu-nav');
    if (mobileMenuNav) {
        mobileMenuNav.addEventListener('click', handleMobileMenuClick);
    }
    
    // Handle viewport changes
    handleViewportChange();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', () => {
        setTimeout(handleViewportChange, 100);
    });
    
    // Close mobile menu on window resize (if switching to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const mobileMenu = document.getElementById('mobileMenu');
            const toggleButton = document.querySelector('.mobile-menu-toggle');
            const body = document.body;
            
            if (mobileMenu && mobileMenu.classList.contains('show')) {
                mobileMenu.classList.remove('show');
                if (toggleButton) toggleButton.classList.remove('active');
                body.classList.remove('mobile-menu-open');
            }
        }
    });
    
    // Handle hash links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                smoothScrollToSection(targetId);
            }
        });
    });
}

// Touch feedback for all interactive elements
function addTouchFeedback() {
    const touchElements = document.querySelectorAll('button, .btn, a[class*="btn"], .card, .service-card');
    
    touchElements.forEach(element => {
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
}

// Performance optimization for mobile
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
        }
        
        // Optimize images loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
        
        // Add GPU acceleration to key elements
        const gpuElements = document.querySelectorAll('.navbar, .mobile-menu, .service-card, .hero-section');
        gpuElements.forEach(element => {
            element.classList.add('gpu-accelerated');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileNavbar();
    addTouchFeedback();
    optimizeForMobile();
    
    // Set active navigation state
    setActiveNavigation();
});

// Export functions for global access
window.toggleMobileMenu = toggleMobileMenu;
window.smoothScrollToSection = smoothScrollToSection;

// Hero Image Slider
(function() {
  const slides = document.querySelectorAll('.hero-image-slider .hero-slide');
  let current = 0;
  const interval = 4000;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  setInterval(nextSlide, interval);
})();

// Hero Image Slider with Buttons, Dots, and 5s Interval
(function() {
  const slider = document.querySelector('.hero-image-slider.pro-slider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.hero-slide');
  const btnLeft = slider.querySelector('.slider-btn-left');
  const btnRight = slider.querySelector('.slider-btn-right');
  const dots = slider.querySelectorAll('.slider-dot');
  let current = 0;
  let timer = null;
  const interval = 5000;

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  }

  function goToSlide(idx) {
    current = idx;
    showSlide(current);
    resetTimer();
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(nextSlide, interval);
  }

  btnLeft.addEventListener('click', () => {
    prevSlide();
    resetTimer();
  });
  btnRight.addEventListener('click', () => {
    nextSlide();
    resetTimer();
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Start auto-slide
  timer = setInterval(nextSlide, interval);
  showSlide(current);
})();