// router.js - Client-side Router with Auth & Role guards
import { dbService } from './db.js';

class Router {
  constructor(routes, containerId) {
    this.routes = routes;
    this.container = document.getElementById(containerId);
    this.currentPath = null;
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Run route handling immediately since DOM is already loaded
    this.handleRoute();
  }

  async handleRoute() {
    let hash = window.location.hash || '#home';
    
    // Extract base hash (e.g., #login?bid=list-1 -> #login)
    let baseHash = hash.split('?')[0] || '#home';
    
    // Check if the hash is a section anchor on the home page
    const homeAnchors = ['#about', '#features', '#contact', '#listings-anchor'];
    const isAnchor = homeAnchors.includes(baseHash);
    
    // Map section anchors to render the Home page route
    const targetRouteKey = isAnchor ? '#home' : baseHash;
    let route = this.routes[targetRouteKey];
    
    // Default fallback to home
    if (!route) {
      console.warn(`Route ${hash} not found, redirecting to #home`);
      window.location.hash = '#home';
      return;
    }

    // Auth and Role Checks
    let currentUser = null;
    try {
      currentUser = await dbService.getCurrentUser();
    } catch (e) {
      console.error("Router: Failed to fetch current user context:", e);
    }
    
    // Guard checking
    if (route.guards) {
      for (const guard of route.guards) {
        const check = await guard(currentUser);
        if (!check.allowed) {
          // If guard fails, show notification and redirect
          if (window.Toastify && check.message) {
            window.Toastify({
              text: check.message,
              duration: 3000,
              backgroundColor: "linear-gradient(to right, #ef4444, #dc2626)",
              gravity: "top",
              position: "right"
            }).showToast();
          }
          window.location.hash = check.redirect;
          return;
        }
      }
    }

    // Perform the rendering
    try {
      const pageChanged = this.currentPath !== targetRouteKey;
      this.currentPath = targetRouteKey;
      
      // Update global navbar active status
      this.updateActiveNavLinks(hash);
      
      if (pageChanged) {
        // Clear container and append/render view
        this.container.innerHTML = '';
        
        // Load view script template and controller
        const viewHtml = await route.render(currentUser);
        this.container.innerHTML = viewHtml;
        
        if (route.init) {
          await route.init(currentUser);
        }
      }
      
      // Handle scrolling to anchors
      if (isAnchor) {
        const targetId = baseHash.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else if (pageChanged) {
        // Scroll to top on normal page navigation
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error(`Error loading view ${hash}:`, error);
      this.container.innerHTML = `
        <div class="container" style="padding: 100px 0; text-align: center;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
          <h2>Failed to load page</h2>
          <p>${error.message}</p>
          <a href="#home" class="btn btn-primary" style="margin-top: 20px;">Back to Safety</a>
        </div>
      `;
    }
  }

  updateActiveNavLinks(hash) {
    const baseHash = hash.split('?')[0];
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === baseHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  navigate(hash) {
    window.location.hash = hash;
  }
}

export default Router;
export { Router };
