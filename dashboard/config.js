/**
 * PainPointRadar Frontend Configuration
 * 
 * This file contains configuration for API endpoints.
 * Update BACKEND_URL when deploying to production.
 */

const CONFIG = {
    // Backend API URL
    // Local development: 'http://localhost:8000'
    // Production: 'https://painpointradar.onrender.com'
    BACKEND_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000'
        : 'https://painpointradar.onrender.com',
    
    // API Endpoints
    ENDPOINTS: {
        HEALTH: '/health',
        ANALYZE: '/api/analyze',
        DEMO: '/api/demo',
        CATEGORIES: '/api/categories',
    },
    
    // Get full URL for an endpoint
    getUrl(endpoint) {
        return `${this.BACKEND_URL}${endpoint}`;
    }
};

// Freeze to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.ENDPOINTS);
