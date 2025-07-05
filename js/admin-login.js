// Admin Login JavaScript
// ======================

class AdminLogin {
    constructor() {
        this.form = document.getElementById('adminLoginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberMeInput = document.getElementById('rememberMe');
        this.loginButton = document.getElementById('loginButton');
        this.errorDiv = document.getElementById('loginError');
        this.successDiv = document.getElementById('loginSuccess');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkExistingSession();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Clear errors on input
        this.usernameInput.addEventListener('input', () => this.clearMessages());
        this.passwordInput.addEventListener('input', () => this.clearMessages());
        
        // Enter key handling
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.passwordInput.focus();
            }
        });
        
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.form.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    checkExistingSession() {
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        if (token) {
            this.validateToken(token);
        }
    }
    
    async validateToken(token) {
        try {
            const response = await fetch(CONFIG.getApiUrl('ADMIN'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'validate_session'
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.redirectToDashboard();
            } else {
                localStorage.removeItem('adminToken');
                sessionStorage.removeItem('adminToken');
            }
        } catch (error) {
            console.error('Token validation failed:', error);
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberMeInput.checked;
        
        // Basic validation
        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }
        
        this.setLoading(true);
        this.clearMessages();
        
        try {
            const response = await fetch(CONFIG.getApiUrl('ADMIN'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'login',
                    username: username,
                    password: password,
                    remember_me: rememberMe
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store token
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('adminToken', data.token);
                storage.setItem('adminUser', JSON.stringify(data.user));
                
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect after a short delay
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1500);
                
            } else {
                this.showError(data.message || 'Login failed. Please try again.');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Connection failed. Please check your internet connection.');
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(loading) {
        if (loading) {
            this.loginButton.classList.add('loading');
            this.loginButton.disabled = true;
        } else {
            this.loginButton.classList.remove('loading');
            this.loginButton.disabled = false;
        }
    }
    
    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
        this.successDiv.style.display = 'none';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.clearMessages();
        }, 5000);
    }
    
    showSuccess(message) {
        this.successDiv.textContent = message;
        this.successDiv.style.display = 'block';
        this.errorDiv.style.display = 'none';
    }
    
    clearMessages() {
        this.errorDiv.style.display = 'none';
        this.successDiv.style.display = 'none';
    }
    
    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }
}

// Demo credentials validation (for development)
const DEMO_USERS = {
    'admin': 'Admin@123',
    'yogesh': 'Yogesh@123'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminLogin();
});

// Utility functions for session management
window.AdminAuth = {
    getToken() {
        return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    },
    
    getUser() {
        const userStr = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
        return userStr ? JSON.parse(userStr) : null;
    },
    
    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    },
    
    isAuthenticated() {
        return !!this.getToken();
    }
};