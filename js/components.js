// Component loader utility for header and footer
class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading component:', error);
            return false;
        }
    }

    static async loadAllComponents() {
        const components = [
            { id: 'header-placeholder', path: 'components/header.html' },
            { id: 'footer-placeholder', path: 'components/footer.html' }
        ];

        const loadPromises = components.map(component => 
            ComponentLoader.loadComponent(component.id, component.path)
        );

        try {
            await Promise.all(loadPromises);
            ComponentLoader.setActiveNavigation();
            ComponentLoader.updateCurrentYear();
            return true;
        } catch (error) {
            console.error('Error loading components:', error);
            return false;
        }
    }

    static setActiveNavigation() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const page = link.getAttribute('data-page');
            const href = link.getAttribute('href');
            
            // Handle home page
            if (page === 'home' && (currentPage === 'index' || currentPage === '')) {
                link.classList.add('active');
                return;
            }
            
            // Handle blog pages specifically
            if (page === 'blog') {
                if (currentPath.includes('/blog/') || currentPage === 'blog') {
                    link.classList.add('active');
                }
                return;
            }
            
            // Handle other pages with exact matching
            if (page === currentPage) {
                link.classList.add('active');
                return;
            }
            
            // Handle special cases for services and practices
            if ((page === 'services' || page === 'practices') && 
                (currentPage === 'services' || currentPage === 'practices')) {
                link.classList.add('active');
                return;
            }
            
            // Handle attorneys section
            if (page === 'attorneys' && currentPage === 'about' && window.location.hash === '#attorneys') {
                link.classList.add('active');
                return;
            }
        });
    }

    static updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
}

// Auto-load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ComponentLoader.loadAllComponents);
} else {
    ComponentLoader.loadAllComponents();
}