// app.js - Main Application Bootstrap and Router Configuration
import { Router } from './router.js';
import { dbService } from './db.js';

// Global error reporting to screen
window.addEventListener('error', (event) => {
  const container = document.getElementById('app');
  if (container) {
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; font-family: sans-serif; color: #ef4444; background: #fff; z-index: 10000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h2>Global JavaScript Error</h2>
        <p style="font-weight: 600;">${event.message}</p>
        <p style="font-size: 0.85rem; color: #64748b;">File: ${event.filename} | Line: ${event.lineno}:${event.colno}</p>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const container = document.getElementById('app');
  if (container) {
    container.innerHTML = `
      <div style="padding: 3rem; text-align: center; font-family: sans-serif; color: #ef4444; background: #fff; z-index: 10000; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h2>Unhandled Promise Rejection</h2>
        <p style="font-weight: 600;">${event.reason ? (event.reason.message || event.reason) : 'Unknown Promise Rejection'}</p>
        ${event.reason && event.reason.stack ? `<pre style="text-align: left; background: #f1f5f9; padding: 1rem; border-radius: 4px; font-size: 0.8rem; max-width: 800px; margin: 1rem auto; overflow-x: auto;">${event.reason.stack}</pre>` : ''}
      </div>
    `;
  }
});


// Import Views
import { HomeView } from './views/home.js';
import { LoginView } from './views/login.js';
import { ProfileView } from './views/profile.js';
import { IndustryView } from './views/industry.js';
import { RecyclerView } from './views/recycler.js';
import { AdminView } from './views/admin.js';

// --- AUTH GUARDS FOR SECURE ROUTING ---
const requireLogin = async (currentUser) => {
  if (!currentUser) {
    return { allowed: false, message: "Authentication required. Please sign in.", redirect: "#login" };
  }
  return { allowed: true };
};

const requireApproved = async (currentUser) => {
  const loginCheck = await requireLogin(currentUser);
  if (!loginCheck.allowed) return loginCheck;
  
  if (currentUser.status === 'rejected') {
    return { allowed: false, message: "Your company verification was rejected. Please contact support.", redirect: "#profile" };
  }
  
  return { allowed: true };
};

const requireIndustry = async (currentUser) => {
  const approvalCheck = await requireApproved(currentUser);
  if (!approvalCheck.allowed) return approvalCheck;
  
  if (currentUser.role !== 'industry') {
    return { allowed: false, message: "Access Denied. Industry account required.", redirect: "#home" };
  }
  return { allowed: true };
};

const requireRecycler = async (currentUser) => {
  const approvalCheck = await requireApproved(currentUser);
  if (!approvalCheck.allowed) return approvalCheck;
  
  if (currentUser.role !== 'recycler') {
    return { allowed: false, message: "Access Denied. Recycler account required.", redirect: "#home" };
  }
  return { allowed: true };
};

const requireAdmin = async (currentUser) => {
  const loginCheck = await requireLogin(currentUser);
  if (!loginCheck.allowed) return loginCheck;
  
  if (currentUser.role !== 'admin') {
    return { allowed: false, message: "Access Denied. Admin privileges required.", redirect: "#home" };
  }
  return { allowed: true };
};

// --- ROUTE DEFINITIONS ---
const routes = {
  '#home': {
    render: HomeView.render,
    init: HomeView.init
  },
  '#login': {
    render: LoginView.render,
    init: LoginView.init
  },
  '#register': {
    render: LoginView.render,
    init: LoginView.init
  },
  '#profile': {
    render: ProfileView.render,
    init: ProfileView.init,
    guards: [requireLogin]
  },
  '#industry': {
    render: IndustryView.render,
    init: IndustryView.init,
    guards: [requireIndustry]
  },
  '#recycler': {
    render: RecyclerView.render,
    init: RecyclerView.init,
    guards: [requireRecycler]
  },
  '#admin': {
    render: AdminView.render,
    init: AdminView.init,
    guards: [requireAdmin]
  }
};

// --- APP INITIALIZATION ---
let routerInstance;

const initApp = async () => {
  // Setup Responsive Nav Menu Trigger
  setupNavigationTriggers();

  // Initialize Router
  routerInstance = new Router(routes, 'app');

  // Monitor Authentication and update header elements
  await updateNavbarState();

  // Listen for auth state changes from view components
  window.addEventListener('wb-auth-changed', async () => {
    await updateNavbarState();
  });
};

const setupNavigationTriggers = () => {
  // Mobile Nav Toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      toggleBtn.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Header Scroll Effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
};

export const updateNavbarState = async () => {
  let currentUser = null;
  try {
    currentUser = await dbService.getCurrentUser();
  } catch (e) {
    console.error("App: Failed to fetch user for navbar state:", e);
  }
  const authContainer = document.getElementById('auth-actions');
  const navDashboardLink = document.getElementById('nav-dashboard-link');
  
  if (!authContainer) return;

  if (currentUser) {
    // Determine dashboard path based on role and status
    let dashboardPath = '#profile';
    if (currentUser.role === 'admin') {
      dashboardPath = '#admin';
    } else if (currentUser.role === 'industry') {
      dashboardPath = '#industry';
    } else if (currentUser.role === 'recycler') {
      dashboardPath = '#recycler';
    }

    // Update Nav dashboard link visibility
    if (navDashboardLink) {
      if (currentUser.status === 'rejected') {
        navDashboardLink.style.display = 'none';
      } else {
        navDashboardLink.style.display = 'block';
        navDashboardLink.querySelector('a').setAttribute('href', dashboardPath);
      }
    }

    // Render logged-in state buttons
    const dashboardButtonHtml = (currentUser.status === 'rejected') 
      ? '' 
      : `<a href="${dashboardPath}" class="btn btn-primary btn-sm"><i class="fas fa-chart-line"></i> Dashboard</a>`;

    authContainer.innerHTML = `
      <span style="font-size: 0.9rem; font-weight: 600; color: var(--neutral-dark);"><i class="fas fa-user-circle"></i> ${escapeHtml(currentUser.name)}</span>
      ${dashboardButtonHtml}
      <button class="btn btn-secondary btn-sm" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</button>
    `;

    // Logout Click handler
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await dbService.logoutUser();
      
      if (window.Toastify) {
        window.Toastify({
          text: "Signed out successfully.",
          duration: 2000,
          backgroundColor: "linear-gradient(to right, #15803d, #22c55e)",
          gravity: "top",
          position: "right"
        }).showToast();
      }
      
      await updateNavbarState();
      window.location.hash = '#home';
    });

  } else {
    // User is signed out
    if (navDashboardLink) {
      navDashboardLink.style.display = 'none';
    }

    authContainer.innerHTML = `
      <a href="#login" class="btn btn-secondary btn-sm">Login</a>
      <a href="#register" class="btn btn-primary btn-sm">Register Company</a>
    `;
  }
};

// Helper HTML Escaper
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Start application (bulletproof initialization)
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
