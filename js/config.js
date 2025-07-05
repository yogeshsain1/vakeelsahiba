// Configuration for different environments
// Update the API_BASE_URL when you deploy to a hosting service

const CONFIG = {
    // Production URL - Update this with your actual hosted domain
    // Common formats for hosting services:
    // 'https://yourdomain.com/' or 'https://yoursubdomain.hostingprovider.com/'
    
    // For now, using a placeholder - you'll need to update this with your actual domain
    API_BASE_URL: 'https://vakeelsahiba.com/', // Replace with your actual hosted domain
    
    // Fallback to local if testing locally
    // API_BASE_URL: window.location.origin + '/',
    
    // API endpoints
    ENDPOINTS: {
        CONTACT: 'api/contact.php',
        ADMIN: 'api/admin.php'
    },
    
    // Get full API URL
    getApiUrl(endpoint) {
        return this.API_BASE_URL + this.ENDPOINTS[endpoint];
    }
};

// Export for use in other files
window.CONFIG = CONFIG;