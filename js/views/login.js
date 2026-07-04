// login.js - Authentication View (Combined Login/Register)
import { dbService } from '../db.js';

export const LoginView = {
  render: async (currentUser) => {
    // Determine which view to make active based on the current hash
    const isRegister = window.location.hash === '#register';
    
    return `
      <div class="auth-wrapper">
        <div class="auth-card">
          <!-- Loading Spinner Overlay -->
          <div class="auth-loading-overlay" id="auth-loader">
            <div class="spinner"></div>
            <p style="font-family: var(--font-body); font-weight: 600; color: var(--primary);">Authenticating company...</p>
          </div>
          
          <div class="auth-header">
            <a href="#home" class="logo">
              <i class="fas fa-recycle" style="color: var(--primary);"></i>
              <div>
                WasteBridge
                <span class="logo-subtext">Connecting Waste to Value</span>
              </div>
            </a>
            <h2 id="auth-title">${isRegister ? 'Register Company' : 'Sign In'}</h2>
            <p id="auth-subtitle">${isRegister ? 'Join the green circular ecosystem' : 'Access your professional dashboard'}</p>
          </div>

          <div class="auth-forms-container">
            
            <!-- LOGIN FORM -->
            <form id="login-form" class="auth-form-view ${!isRegister ? 'active' : ''}">
              <div class="form-group">
                <label for="login-email">Corporate Email Address</label>
                <div class="input-icon-wrapper">
                  <input type="email" id="login-email" placeholder="name@company.com" required autocomplete="email">
                  <i class="fas fa-envelope"></i>
                </div>
              </div>
              
              <div class="form-group">
                <label for="login-password">Password</label>
                <div class="input-icon-wrapper">
                  <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password">
                  <i class="fas fa-lock"></i>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary btn-full" style="margin-top: 1.5rem;">
                Sign In <i class="fas fa-sign-in-alt"></i>
              </button>
              
              <div class="form-footer-helper">
                Don't have a company account? <a href="#register">Register Company</a>
              </div>
            </form>

            <!-- REGISTRATION FORM -->
            <form id="register-form" class="auth-form-view ${isRegister ? 'active' : ''}">
              <div class="form-group">
                <label for="reg-name">Company Name</label>
                <div class="input-icon-wrapper">
                  <input type="text" id="reg-name" placeholder="Apex Manufacturing Ltd." required autocomplete="organization">
                  <i class="fas fa-building"></i>
                </div>
              </div>

              <div class="form-group">
                <label for="reg-email">Corporate Email Address</label>
                <div class="input-icon-wrapper">
                  <input type="email" id="reg-email" placeholder="admin@company.com" required autocomplete="email">
                  <i class="fas fa-envelope"></i>
                </div>
              </div>

              <!-- Role Selector Radio Grid -->
              <div class="form-group">
                <label>Register As</label>
                <div class="role-selection-grid">
                  <label class="role-radio-label">
                    <input type="radio" name="reg-role" value="industry" checked>
                    <div class="role-radio-card">
                      <i class="fas fa-industry"></i>
                      <h4>Industry</h4>
                      <span>Generates Waste</span>
                    </div>
                  </label>
                  
                  <label class="role-radio-label">
                    <input type="radio" name="reg-role" value="recycler">
                    <div class="role-radio-card">
                      <i class="fas fa-recycle"></i>
                      <h4>Recycler</h4>
                      <span>Processes Waste</span>
                    </div>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label for="reg-password">Password</label>
                <div class="input-icon-wrapper">
                  <input type="password" id="reg-password" placeholder="Min. 6 characters" required autocomplete="new-password">
                  <i class="fas fa-lock"></i>
                </div>
              </div>

              <div class="form-group">
                <label for="reg-confirm-password">Confirm Password</label>
                <div class="input-icon-wrapper">
                  <input type="password" id="reg-confirm-password" placeholder="Confirm password" required autocomplete="new-password">
                  <i class="fas fa-shield-alt"></i>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-full" style="margin-top: 1.5rem;">
                Create Account <i class="fas fa-user-plus"></i>
              </button>
              
              <div class="form-footer-helper">
                Already have an account? <a href="#login">Sign In</a>
              </div>
            </form>

          </div>
        </div>
      </div>
    `;
  },

  init: async (currentUser) => {
    // Select Elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loader = document.getElementById('auth-loader');
    const titleEl = document.getElementById('auth-title');
    const subtitleEl = document.getElementById('auth-subtitle');

    if (currentUser) {
      // User is already logged in, redirect them out of here
      redirectUser(currentUser);
      return;
    }


    // --- FORM SUBMISSIONS ---
    
    // Login Submission Handler
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!validateEmail(email)) {
        showToast("Please enter a valid corporate email.", "error");
        return;
      }

      setLoading(true);

      try {
        const user = await dbService.loginUser(email, password);
        if (!user) {
          throw new Error("Unable to retrieve your company profile. Please try registering again.");
        }
        showToast(`Welcome back, ${user.name || 'User'}!`, "success");
        
        // Notify app to sync navbar state
        window.dispatchEvent(new CustomEvent('wb-auth-changed'));
        
        // Redirect based on role/status
        redirectUser(user);
      } catch (err) {
        setLoading(false);
        showToast(err.message || "Failed to sign in. Please check credentials.", "error");
      }
    });

    // Registration Submission Handler
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirmPassword = document.getElementById('reg-confirm-password').value;
      const role = document.querySelector('input[name="reg-role"]:checked').value;

      // Validation check
      if (name.length < 3) {
        showToast("Company name must be at least 3 characters.", "error");
        return;
      }

      if (!validateEmail(email)) {
        showToast("Please enter a valid corporate email.", "error");
        return;
      }

      if (password.length < 6) {
        showToast("Password must be at least 6 characters.", "error");
        return;
      }

      if (password !== confirmPassword) {
        showToast("Passwords do not match.", "error");
        return;
      }

      setLoading(true);

      try {
        const newUser = await dbService.registerUser(email, password, role, name);
        showToast("Registration successful! Welcome to WasteBridge.", "success");
        
        // Notify app to sync navbar state
        window.dispatchEvent(new CustomEvent('wb-auth-changed'));
        
        // Redirect to dashboard immediately based on role
        if (role === 'industry') {
          window.location.hash = '#industry';
        } else {
          window.location.hash = '#recycler';
        }
      } catch (err) {
        setLoading(false);
        showToast(err.message || "Failed to register company.", "error");
      }
    });

    // Helper functions
    function setLoading(isLoading) {
      if (loader) {
        if (isLoading) {
          loader.classList.add('active');
        } else {
          loader.classList.remove('active');
        }
      }
    }

    function showToast(text, type = "success") {
      if (window.Toastify) {
        const background = type === "success" 
          ? "linear-gradient(to right, #15803d, #22c55e)" 
          : "linear-gradient(to right, #ef4444, #dc2626)";
          
        window.Toastify({
          text,
          duration: 3000,
          backgroundColor: background,
          gravity: "top",
          position: "right"
        }).showToast();
      }
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function redirectUser(user) {
      if (!user) {
        window.location.hash = '#login';
        return;
      }
      
      if (user.role === 'admin') {
        window.location.hash = '#admin';
      } else if (user.role === 'industry') {
        window.location.hash = '#industry';
      } else if (user.role === 'recycler') {
        window.location.hash = '#recycler';
      } else {
        window.location.hash = '#profile';
      }
    }
  }
};

export default LoginView;
