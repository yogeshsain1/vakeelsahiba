/**
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitButton = null;
        this.originalButtonText = '';
        this.isMobile = window.innerWidth <= 768;
        this.touchStartY = 0;
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton ? this.submitButton.innerHTML : '';
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupValidation();
        this.setupMobileOptimizations();
        this.setupTouchInteractions();
        this.setupAccessibility();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearErrors.bind(this));
            
            // Mobile-specific input handling
            if (this.isMobile) {
                // Prevent zoom on iOS
                if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
                
                // Enhanced focus handling for mobile
                input.addEventListener('focus', this.handleMobileFocus.bind(this));
                input.addEventListener('blur', this.handleMobileBlur.bind(this));
            }
        });
    }

    setupMobileOptimizations() {
        if (!this.isMobile) return;
        
        // Handle virtual keyboard
        this.setupVirtualKeyboardHandling();
        
        // Optimize form layout for mobile
        this.form.classList.add('mobile-optimized');
        
        // Add mobile-specific styles
        if (!document.getElementById('mobile-form-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-form-styles';
            style.textContent = `
                @media (max-width: 768px) {
                    .mobile-optimized .form-group {
                        margin-bottom: 1.5rem;
                    }
                    
                    .mobile-optimized input,
                    .mobile-optimized textarea,
                    .mobile-optimized select {
                        padding: 12px 16px;
                        font-size: 16px;
                        border-radius: 8px;
                        transition: all 0.3s ease;
                    }
                    
                    .mobile-optimized input:focus,
                    .mobile-optimized textarea:focus,
                    .mobile-optimized select:focus {
                        transform: scale(1.02);
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    }
                    
                    .mobile-optimized .btn-primary {
                        padding: 14px 24px;
                        font-size: 16px;
                        min-height: 48px;
                        border-radius: 8px;
                        touch-action: manipulation;
                    }
                    
                    .mobile-optimized .error-message {
                        font-size: 14px;
                        margin-top: 6px;
                        padding: 8px 12px;
                        border-radius: 6px;
                        background: rgba(239, 68, 68, 0.1);
                        border-left: 3px solid #ef4444;
                    }
                    
                    .form-floating-keyboard {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: white;
                        padding: 16px;
                        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
                        transform: translateY(100%);
                        transition: transform 0.3s ease;
                        z-index: 1000;
                    }
                    
                    .form-floating-keyboard.active {
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupTouchInteractions() {
        // Enhanced touch feedback for form elements
        const touchElements = this.form.querySelectorAll('input, textarea, select, button');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
            element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: true });
        });
        
        // Swipe to dismiss keyboard on mobile
        if (this.isMobile) {
            this.form.addEventListener('touchstart', (e) => {
                this.touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            this.form.addEventListener('touchmove', (e) => {
                if (document.activeElement && document.activeElement.tagName.match(/INPUT|TEXTAREA/)) {
                    const touchY = e.touches[0].clientY;
                    const deltaY = this.touchStartY - touchY;
                    
                    // If swiping down significantly, blur the active input
                    if (deltaY < -50) {
                        document.activeElement.blur();
                    }
                }
            }, { passive: true });
        }
    }

    setupAccessibility() {
        // Enhanced accessibility for mobile screen readers
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add aria-describedby for error messages
            const errorId = `${input.id || input.name}-error`;
            input.setAttribute('aria-describedby', errorId);
            
            // Add touch-friendly labels
            const label = this.form.querySelector(`label[for="${input.id}"]`);
            if (label && this.isMobile) {
                label.style.cursor = 'pointer';
                label.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    input.focus();
                });
            }
        });
    }

    setupVirtualKeyboardHandling() {
        // Handle virtual keyboard showing/hiding
        let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        
        const handleViewportChange = () => {
            if (window.visualViewport) {
                const currentHeight = window.visualViewport.height;
                const heightDifference = initialViewportHeight - currentHeight;
                
                if (heightDifference > 150) {
                    // Keyboard is likely open
                    document.body.classList.add('keyboard-open');
                    this.scrollToActiveField();
                } else {
                    // Keyboard is likely closed
                    document.body.classList.remove('keyboard-open');
                }
            }
        };
        
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
        } else {
            // Fallback for older browsers
            window.addEventListener('resize', handleViewportChange);
        }
        
        // Add keyboard-specific styles
        if (!document.getElementById('keyboard-styles')) {
            const style = document.createElement('style');
            style.id = 'keyboard-styles';
            style.textContent = `
                @media (max-width: 768px) {
                    .keyboard-open {
                        position: fixed;
                        width: 100%;
                    }
                    
                    .keyboard-open .contact-section {
                        min-height: auto;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleMobileFocus(e) {
        const input = e.target;
        
        // Add focused state
        input.parentElement.classList.add('field-focused');
        
        // Scroll to field with offset for mobile keyboard
        setTimeout(() => {
            this.scrollToActiveField(input);
        }, 300);
    }

    handleMobileBlur(e) {
        const input = e.target;
        
        // Remove focused state
        input.parentElement.classList.remove('field-focused');
    }

    scrollToActiveField(field = null) {
        const activeField = field || document.activeElement;
        if (!activeField || !activeField.tagName.match(/INPUT|TEXTAREA|SELECT/)) return;
        
        const rect = activeField.getBoundingClientRect();
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const offset = viewportHeight * 0.3; // Show field in top 30% of visible area
        
        if (rect.top < offset || rect.bottom > viewportHeight - 50) {
            const scrollTop = window.pageYOffset + rect.top - offset;
            
            window.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: 'smooth'
            });
        }
    }

    handleTouchStart(e) {
        e.target.classList.add('touch-active');
    }

    handleTouchEnd(e) {
        setTimeout(() => {
            e.target.classList.remove('touch-active');
        }, 150);
    }

    handleTouchCancel(e) {
        e.target.classList.remove('touch-active');
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styles
        field.classList.remove('error');
        this.removeErrorMessage(field);
        
        // Validate required fields
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Validate email with enhanced mobile-friendly messages
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Validate phone numbers (mobile-specific)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Validate message length
        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            this.showFieldError(field, 'Please provide more details (at least 10 characters)');
            return false;
        }
        
        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Prevent double submission
        if (this.submitButton.disabled) return;
        
        // Hide mobile keyboard
        if (document.activeElement) {
            document.activeElement.blur();
        }
        
        // Validate all fields
        const isValid = this.validateForm();
        if (!isValid) {
            this.showMobileErrorSummary();
            return;
        }
        
        // Show loading state with mobile-optimized feedback
        this.setLoadingState(true);
        
        try {
            const formData = new FormData(this.form);
            const response = await fetch(CONFIG.getApiUrl('CONTACT'), {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMobileSuccess('Thank you! Your message has been sent successfully.');
                this.form.reset();
            } else {
                this.showMobileError(result.message || 'There was an error sending your message. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            this.showMobileError('Network error. Please check your connection and try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    showMobileErrorSummary() {
        const errors = this.form.querySelectorAll('.error-message');
        if (errors.length === 0) return;
        
        // Create mobile-friendly error summary
        const summary = document.createElement('div');
        summary.className = 'mobile-error-summary';
        summary.innerHTML = `
            <div class="error-summary-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Please fix the following errors:</h4>
                <ul>
                    ${Array.from(errors).map(error => `<li>${error.textContent}</li>`).join('')}
                </ul>
            </div>
        `;
        
        // Style the summary
        summary.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 16px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateY(-100px);
            transition: all 0.3s ease;
            opacity: 0;
        `;
        
        document.body.appendChild(summary);
        
        // Animate in
        requestAnimationFrame(() => {
            summary.style.transform = 'translateY(0)';
            summary.style.opacity = '1';
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            summary.style.transform = 'translateY(-100px)';
            summary.style.opacity = '0';
            setTimeout(() => {
                if (summary.parentNode) {
                    summary.parentNode.removeChild(summary);
                }
            }, 300);
        }, 5000);
        
        // Scroll to first error
        const firstError = this.form.querySelector('.error');
        if (firstError) {
            this.scrollToActiveField(firstError);
        }
    }

    showMobileSuccess(message) {
        this.showMobileNotification(message, 'success');
    }

    showMobileError(message) {
        this.showMobileNotification(message, 'error');
    }

    showMobileNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-notification mobile-notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Style the notification
        const colors = {
            success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
            error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
            info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: ${color.bg};
            border: 1px solid ${color.border};
            border-radius: 12px;
            padding: 16px;
            z-index: 1001;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            transform: translateY(-100px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            color: ${color.text};
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        });
        
        // Handle close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, type === 'success' ? 3000 : 5000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateY(-100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    setLoadingState(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>Sending...</span>
            `;
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = this.originalButtonText;
            this.submitButton.classList.remove('loading');
        }
    }
}

// Initialize contact form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced initialization with mobile detection
    const contactForm = new ContactFormHandler();
    
    // Add mobile-specific enhancements
    if (window.innerWidth <= 768) {
        // Prevent zoom on iOS when focusing inputs
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Add touch-friendly styles
        document.body.classList.add('mobile-form-enhanced');
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Refresh mobile optimizations
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.style.fontSize && parseFloat(input.style.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }, 100);
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormHandler;
}