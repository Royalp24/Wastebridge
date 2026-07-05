// industry.js - Industry Dashboard View
import { dbService } from '../db.js';

// Helper HTML Escaper (Module Scope)
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- CLOUDINARY CONFIGURATION FOR WASTE IMAGE UPLOADS ---
// Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET (unsigned) to enable CDN hosting.
// Leaves empty to auto-fallback to local Base64 database strings.
const CLOUDINARY_CLOUD_NAME = "hl12nfti"; 
const CLOUDINARY_UPLOAD_PRESET = "wastebridge_preset"; 

async function uploadToCloudinary(file) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    console.warn("WasteBridge: Cloudinary credentials not set. Falling back to client-side Base64 data encoding.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errText || response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
}

export const IndustryView = {
  render: async (currentUser) => {
    return `
      <div class="db-layout">
        <!-- Sidebar Navigation -->
        <aside class="db-sidebar">
          <div class="db-sidebar-header">
            <h3>${escapeHtml(currentUser.name)}</h3>
            <span>Industry Portal</span>
          </div>
          <ul class="db-sidebar-menu">
            <li class="db-menu-item active" data-target="db-overview">
              <a><i class="fas fa-chart-pie"></i> Overview</a>
            </li>
            <li class="db-menu-item" data-target="db-profile">
              <a><i class="fas fa-user-edit"></i> Complete Profile</a>
            </li>
            <li class="db-menu-item" data-target="db-list-waste">
              <a><i class="fas fa-plus-circle"></i> List New Waste</a>
            </li>
            <li class="db-menu-item" data-target="db-my-listings">
              <a><i class="fas fa-list"></i> My Listings</a>
            </li>
            <li class="db-menu-item" data-target="db-bids">
              <a><i class="fas fa-gavel"></i> Recycler Bids</a>
            </li>
            <li class="db-menu-item" data-target="db-analytics">
              <a><i class="fas fa-chart-line"></i> Analytics</a>
            </li>
            <li class="db-menu-item" data-target="db-settings">
              <a><i class="fas fa-cog"></i> Settings</a>
            </li>
          </ul>
        </aside>

        <!-- Main Content Area -->
        <main class="db-main-content" id="db-content-area">
          
          <!-- SUB-VIEW: OVERVIEW -->
          <div id="db-overview" class="db-content-view active">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Industry Portal / <span>Overview</span></div>
                <h2>Dashboard Overview</h2>
              </div>
              <button class="btn btn-primary btn-sm btn-quick-list"><i class="fas fa-plus"></i> List Waste</button>
            </div>

            <!-- KPI Cards Grid -->
            <div class="db-kpi-grid">
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-active-listings">0</div>
                  <div class="kpi-label">Active Listings</div>
                </div>
                <div class="kpi-icon-box green"><i class="fas fa-clipboard-list"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-bids-received">0</div>
                  <div class="kpi-label">Bids Received</div>
                </div>
                <div class="kpi-icon-box orange"><i class="fas fa-gavel"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-waste-listed">0 Tons</div>
                  <div class="kpi-label">Total Listed Waste</div>
                </div>
                <div class="kpi-icon-box blue"><i class="fas fa-weight-hanging"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-closed-listings">0</div>
                  <div class="kpi-label">Accepted Deals</div>
                </div>
                <div class="kpi-icon-box gold"><i class="fas fa-handshake"></i></div>
              </div>
            </div>

            <!-- Recent Bids Table -->
            <div class="db-card">
              <div class="db-card-header">
                <h3>Recent Bids from Recyclers</h3>
                <span style="font-size: 0.85rem; color: var(--neutral-body); font-weight: 500;">Real-time offers</span>
              </div>
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="overview-bids-table">
                    <thead>
                      <tr>
                        <th>Material Listing</th>
                        <th>Recycling Company</th>
                        <th>Bid Amount</th>
                        <th>Bid Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="5" style="text-align: center; padding: 3rem;">
                          <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
                          <p style="margin-top: 10px;">Fetching latest bids...</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: COMPLETE PROFILE -->
          <div id="db-profile" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Industry Portal / <span>Profile</span></div>
                <h2>Company Profile Settings</h2>
              </div>
            </div>
            
            <div class="db-card" style="max-width: 700px;">
              <div class="db-card-body">
                <form id="db-profile-form">
                  <div class="form-group">
                    <label for="db-prof-name">Company Name</label>
                    <div class="input-icon-wrapper">
                      <input type="text" id="db-prof-name" value="${escapeHtml(currentUser.name || '')}" required>
                      <i class="fas fa-building"></i>
                    </div>
                  </div>
                  <div class="grid-2-col" style="margin-bottom: 1.5rem;">
                    <div class="form-group" style="margin-bottom: 0;">
                      <label for="db-prof-phone">Contact Phone Number</label>
                      <div class="input-icon-wrapper">
                        <input type="tel" id="db-prof-phone" value="${escapeHtml(currentUser.phone || '')}" placeholder="+91 98765 43210" required>
                        <i class="fas fa-phone"></i>
                      </div>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                      <label for="db-prof-gstin">GSTIN / Tax Number</label>
                      <div class="input-icon-wrapper">
                        <input type="text" id="db-prof-gstin" value="${escapeHtml(currentUser.gstin || '')}" placeholder="27AAAAA1111A1Z1" required style="text-transform: uppercase;">
                        <i class="fas fa-percent"></i>
                      </div>
                    </div>
                  </div>
                  <div class="grid-3-1-col" style="margin-bottom: 1.5rem;">
                    <div class="form-group" style="margin-bottom: 0;">
                      <label for="db-prof-address">Corporate Address</label>
                      <div class="input-icon-wrapper">
                        <input type="text" id="db-prof-address" value="${escapeHtml(currentUser.address || '')}" placeholder="e.g., Plot No. 12, Industrial Area" required>
                        <i class="fas fa-map-marker-alt"></i>
                      </div>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                      <label for="db-prof-pincode">Pin Code</label>
                      <div class="input-icon-wrapper">
                        <input type="text" id="db-prof-pincode" value="${escapeHtml(currentUser.pincode || '')}" placeholder="400001" pattern="[0-9]{6}" required>
                        <i class="fas fa-mail-bulk"></i>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="db-prof-website">Company Website URL</label>
                    <div class="input-icon-wrapper">
                      <input type="url" id="db-prof-website" value="${escapeHtml(currentUser.website || '')}" placeholder="https://www.company.com" required>
                      <i class="fas fa-globe"></i>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">
                    Save Profile Changes <i class="fas fa-check-circle"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: LIST NEW WASTE -->
          <div id="db-list-waste" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Industry Portal / <span>List Waste</span></div>
                <h2>Post New Waste Stream</h2>
              </div>
            </div>

            <!-- Verification Pending Message Block -->
            <div id="verification-warning-block" class="warning-banner" style="display: none;">
              <i class="fas fa-exclamation-triangle"></i>
              <div>
                <h3>Verification Approval Required</h3>
                <p>Your company profile is currently in **Pending** status. Under compliance guidelines, you cannot publish new industrial waste listings to the marketplace until your status is approved by the system administration.</p>
              </div>
            </div>

            <div class="db-card" style="max-width: 800px;">
              <div class="db-card-body">
                <form id="create-listing-form">
                  <div class="form-group">
                    <label for="list-title">Listing Title / Material Name</label>
                    <div class="input-icon-wrapper">
                      <input type="text" id="list-title" placeholder="e.g., Post-Industrial Mixed Colour HDPE Drums" required>
                      <i class="fas fa-clipboard-list"></i>
                    </div>
                  </div>

                  <div class="grid-2-col">
                    <div class="form-group">
                      <label for="list-category">Material Category</label>
                      <div class="input-icon-wrapper">
                        <select id="list-category" required>
                          <option value="" disabled selected>Select Category</option>
                          <option value="Metal">Metal</option>
                          <option value="Plastic">Plastic</option>
                          <option value="Paper">Paper</option>
                          <option value="Glass">Glass</option>
                          <option value="Rubber">Rubber</option>
                          <option value="Electronic">Electronic Waste</option>
                          <option value="Textile">Textile</option>
                          <option value="Chemical">Chemical</option>
                          <option value="Organic">Organic</option>
                          <option value="Wood">Wood</option>
                        </select>
                        <i class="fas fa-recycle" style="z-index: 5;"></i>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="list-quantity">Quantity (e.g., Tons, Kgs)</label>
                      <div class="input-icon-wrapper">
                        <input type="text" id="list-quantity" placeholder="e.g., 5.5 Tons" required>
                        <i class="fas fa-weight-hanging"></i>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="list-location">Pickup Location Coordinates / City</label>
                    <div class="input-icon-wrapper">
                      <input type="text" id="list-location" placeholder="e.g., Navi Mumbai Plant, Maharashtra" required>
                      <i class="fas fa-map-marker-alt"></i>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="list-description">Detailed Description (Include purity, packaging, and loading specifics)</label>
                    <textarea id="list-description" style="width:100%; min-height: 140px; padding: 1rem; border: 1.5px solid var(--neutral-border); border-radius: var(--radius-md); font-family: var(--font-body); font-size: 0.95rem; outline: none; transition: var(--transition-smooth);" placeholder="Provide a detailed breakdown of the waste stream..." required></textarea>
                  </div>

                  <div class="form-group" style="margin-top: 1.5rem; margin-bottom: 1.5rem;">
                    <label for="list-image">Waste Stream Visual Images</label>
                    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                      <div class="input-icon-wrapper" style="flex: 1; min-width: 250px; margin-bottom: 0;">
                        <input type="file" id="list-image" accept="image/*" style="padding: 0.6rem 0.6rem 0.6rem 2.8rem; height: auto;">
                        <i class="fas fa-image" style="z-index: 5;"></i>
                      </div>
                      <div id="image-preview-container" style="width: 80px; height: 80px; border-radius: var(--radius-md); border: 1.5px dashed var(--neutral-border); display: flex; align-items: center; justify-content: center; background: var(--neutral-light); overflow: hidden; position: relative; flex-shrink: 0;">
                        <span style="font-size: 0.75rem; color: var(--neutral-body); text-align: center; padding: 0.25rem;">No Image</span>
                      </div>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--neutral-body); display: block; margin-top: 0.35rem;">Upload real photos of the material to get more accurate bids from recyclers.</span>
                  </div>

                  <button type="submit" class="btn btn-primary btn-submit-listing" style="margin-top: 1rem; width: 220px;">
                    Publish Listing <i class="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: MY LISTINGS -->
          <div id="db-my-listings" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Industry Portal / <span>My Listings</span></div>
                <h2>Manage Waste Listings</h2>
              </div>
            </div>

            <div class="db-card">
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="my-listings-table">
                    <thead>
                      <tr>
                        <th>Material Listing</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Created Date</th>
                        <th>Bids Recv</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="6" style="text-align: center; padding: 3rem;">
                          <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
                          <p style="margin-top: 10px;">Fetching your listings...</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: RECYCLER BIDS -->
          <div id="db-bids" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Industry Portal / <span>Recycler Bids</span></div>
                <h2>Manage Recycler Offers</h2>
              </div>
            </div>

            <div class="db-card">
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="bids-management-table">
                    <thead>
                      <tr>
                        <th>Material Listing</th>
                        <th>Recycling Agency</th>
                        <th>Offer Price</th>
                        <th>Message</th>
                        <th>Bid Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="6" style="text-align: center; padding: 3rem;">
                          <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
                          <p style="margin-top: 10px;">Loading bids and offers...</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: ANALYTICS -->
          <div id="db-analytics" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Industry Portal / <span>Analytics</span></div>
                <h2>Material Analytics & ESG</h2>
              </div>
            </div>

            <div class="db-chart-grid">
              <div class="db-chart-box">
                <h3>Listings Distribution by Category</h3>
                <div class="db-chart-container">
                  <canvas id="categoryChart"></canvas>
                </div>
              </div>
              
              <div class="db-chart-box">
                <h3>Bid Activities & Offer Value</h3>
                <div class="db-chart-container">
                  <canvas id="bidsChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: SETTINGS -->
          <div id="db-settings" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Industry Portal / <span>Settings</span></div>
                <h2>Account Settings</h2>
              </div>
            </div>

            <div class="db-card" style="max-width: 500px;">
              <div class="db-card-body">
                <p style="margin-bottom: 1.5rem; font-size: 0.95rem; color: var(--neutral-body);">Manage account access credentials and notifications.</p>
                <div class="form-group">
                  <label>Account Role</label>
                  <input type="text" value="Waste Generating Industry" disabled style="width:100%; padding:0.8rem; background-color: var(--neutral-light); border: 1px solid var(--neutral-border); border-radius: var(--radius-sm); cursor: not-allowed; font-weight: 600;">
                </div>
                <div class="form-group">
                  <label>Authorized Email</label>
                  <input type="text" value="${escapeHtml(currentUser.email)}" disabled style="width:100%; padding:0.8rem; background-color: var(--neutral-light); border: 1px solid var(--neutral-border); border-radius: var(--radius-sm); cursor: not-allowed;">
                </div>
                <button class="btn btn-secondary btn-full id-logout-shortcut" style="margin-top: 1.5rem;"><i class="fas fa-sign-out-alt"></i> Logout from System</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    `;
  },

  init: async (currentUser) => {
    if (!currentUser) {
      window.location.hash = '#login';
      return;
    }

    // Chart references to prevent duplication errors on re-renders
    let categoryChartInstance = null;
    let bidsChartInstance = null;

    // Sidebar view switching logic
    const menuItems = document.querySelectorAll('.db-menu-item');
    const contentViews = document.querySelectorAll('.db-content-view');
    const breadcrumbsLabel = document.querySelector('.db-breadcrumbs span');

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        
        // Update active class
        menuItems.forEach(mi => mi.classList.remove('active'));
        item.classList.add('active');
        
        // Update breadcrumb
        if (breadcrumbsLabel) {
          const label = item.textContent.trim();
          breadcrumbsLabel.textContent = label;
        }

        // Show/hide sub-views
        contentViews.forEach(cv => {
          if (cv.id === targetId) {
            cv.classList.add('active');
          } else {
            cv.classList.remove('active');
          }
        });

        // Initialize sub-view specific data
        if (targetId === 'db-overview') {
          loadOverviewData();
        } else if (targetId === 'db-my-listings') {
          loadMyListings();
        } else if (targetId === 'db-bids') {
          loadBidsManagement();
        } else if (targetId === 'db-analytics') {
          loadAnalyticsCharts();
        }
      });
    });

    // Overview Quick Listing Button Shortcut
    const quickListBtn = document.querySelector('.btn-quick-list');
    if (quickListBtn) {
      quickListBtn.addEventListener('click', () => {
        const listWasteItem = document.querySelector('.db-menu-item[data-target="db-list-waste"]');
        if (listWasteItem) listWasteItem.click();
      });
    }

    // Logout button inside settings view
    const logoutBtn = document.querySelector('.id-logout-shortcut');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await dbService.logoutUser();
        window.dispatchEvent(new CustomEvent('wb-auth-changed'));
        window.location.hash = '#home';
      });
    }

    // --- CHECK USER STATUS (PENDING AND BLOCKED LISTINGS) ---
    const checkVerificationState = () => {
      const isPending = currentUser.status === 'pending_verification' || currentUser.status === 'pending';
      const isPaused = currentUser.status === 'paused' || currentUser.status === 'suspended';
      const warningBlock = document.getElementById('verification-warning-block');
      const submitBtn = document.querySelector('.btn-submit-listing');
      const formFields = document.querySelectorAll('#create-listing-form input, #create-listing-form select, #create-listing-form textarea');
      
      if (isPending || isPaused) {
        if (warningBlock) {
          warningBlock.style.display = 'flex';
          if (isPaused) {
            warningBlock.querySelector('h3').textContent = "Account Temporarily Paused";
            warningBlock.querySelector('p').textContent = "Your industrial account has been paused by administrators. You cannot publish new industrial waste listings until your status is restored.";
          }
        }
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.5';
          submitBtn.style.cursor = 'not-allowed';
        }
        formFields.forEach(field => {
          field.disabled = true;
          field.style.backgroundColor = 'var(--neutral-light)';
          field.style.cursor = 'not-allowed';
        });
      }
    };
    
    checkVerificationState();

    // --- PROFILE UPDATE HANDLER ---
    const profileForm = document.getElementById('db-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('db-prof-name').value.trim();
        const newPhone = document.getElementById('db-prof-phone').value.trim();
        const newAddress = document.getElementById('db-prof-address').value.trim();
        const newPincode = document.getElementById('db-prof-pincode').value.trim();
        const newGstin = document.getElementById('db-prof-gstin').value.trim().toUpperCase();
        const newWebsite = document.getElementById('db-prof-website').value.trim();

        if (newName.length < 3) {
          showToast("Company name must be at least 3 characters.", "error");
          return;
        }
        if (newPhone.length < 8) {
          showToast("Please enter a valid phone number.", "error");
          return;
        }
        if (newAddress.length < 5) {
          showToast("Please enter a valid address.", "error");
          return;
        }
        if (!/^[0-9]{6}$/.test(newPincode)) {
          showToast("Please enter a valid 6-digit pin code.", "error");
          return;
        }
        if (newGstin.length !== 15) {
          showToast("GSTIN number must be exactly 15 characters long.", "error");
          return;
        }

        const profileLoader = document.getElementById('profile-loader');
        if (profileLoader) profileLoader.classList.add('active');

        try {
          const updateData = {
            name: newName,
            phone: newPhone,
            address: newAddress,
            pincode: newPincode,
            gstin: newGstin,
            website: newWebsite,
            location: `${newAddress}, Pin - ${newPincode}`
          };

          await dbService.updateUserProfile(currentUser.uid, updateData);
          
          showToast("Company profile updated successfully!", "success");
          Object.assign(currentUser, updateData);
          
          // Update sidebar title immediately
          const sidebarTitle = document.querySelector('.db-sidebar-header h3');
          if (sidebarTitle) sidebarTitle.textContent = newName;

          window.dispatchEvent(new CustomEvent('wb-auth-changed'));
        } catch (err) {
          showToast(err.message || "Failed to update profile", "error");
        } finally {
          if (profileLoader) profileLoader.classList.remove('active');
        }
      });
    }

    // --- LIVE PREVIEW FOR UPLOADED WASTE IMAGE ---
    const fileInput = document.getElementById('list-image');
    const previewContainer = document.getElementById('image-preview-container');
    if (fileInput && previewContainer) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewContainer.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
          };
          reader.readAsDataURL(file);
        } else {
          previewContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--neutral-body); text-align: center; padding: 0.25rem;">No Image</span>`;
        }
      });
    }

    // --- CREATE LISTING FORM HANDLER ---
    const listingForm = document.getElementById('create-listing-form');
    if (listingForm) {
      listingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Extra guard
        const isPending = currentUser.status === 'pending_verification' || currentUser.status === 'pending';
        const isPaused = currentUser.status === 'paused' || currentUser.status === 'suspended';
        if (isPending || isPaused) {
          showToast(isPaused ? "Account paused. You cannot publish waste listings." : "Verification Pending. You cannot publish waste listings.", "error");
          return;
        }

        const title = document.getElementById('list-title').value.trim();
        const category = document.getElementById('list-category').value;
        const quantity = document.getElementById('list-quantity').value.trim();
        const location = document.getElementById('list-location').value.trim();
        const description = document.getElementById('list-description').value.trim();

        const file = fileInput && fileInput.files ? fileInput.files[0] : null;
        let imageUrl = '';

        const overviewLoader = document.getElementById('profile-loader'); // Reuse overlay if needed
        if (overviewLoader) {
          overviewLoader.classList.add('active');
          overviewLoader.querySelector('p').textContent = 'Uploading waste images...';
        }

        try {
          if (file) {
            try {
              imageUrl = await uploadToCloudinary(file);
            } catch (uploadError) {
              console.error("Cloudinary upload failed, falling back to local Base64 URL:", uploadError);
              // Safe Base64 fallback inside uploadToCloudinary will have already occurred if config is empty, 
              // but if fetch itself failed (e.g. network/CORS error), we can fall back to local Base64 here!
              imageUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target.result);
                reader.readAsDataURL(file);
              });
            }
          }

          const listingData = {
            industryId: currentUser.uid,
            industryName: currentUser.name,
            title,
            category,
            quantity,
            location,
            description,
            imageUrl
          };

          await dbService.createWasteListing(listingData);
          showToast("Waste listing published successfully!", "success");
          listingForm.reset();
          if (previewContainer) {
            previewContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--neutral-body); text-align: center; padding: 0.25rem;">No Image</span>`;
          }
          
          // Switch to My Listings View
          const myListingsMenu = document.querySelector('.db-menu-item[data-target="db-my-listings"]');
          if (myListingsMenu) myListingsMenu.click();
        } catch (err) {
          showToast(err.message || "Failed to create listing", "error");
        } finally {
          if (overviewLoader) {
            overviewLoader.classList.remove('active');
            overviewLoader.querySelector('p').textContent = 'Processing...';
          }
        }
      });
    }

    // --- LOAD VIEW DATA IMPLEMENTATIONS ---

    async function loadOverviewData() {
      try {
        const listings = await dbService.getListings({ industryId: currentUser.uid });
        const allBids = [];

        // Fetch bids for all listings in parallel
        await Promise.all(listings.map(async (l) => {
          const bids = await dbService.getBidsForListing(l.id);
          bids.forEach(b => {
            allBids.push({ ...b, listingTitle: l.title });
          });
        }));

        // Calculate KPI values
        const activeListingsCount = listings.filter(l => l.status === 'active').length;
        const closedListingsCount = listings.filter(l => l.status === 'accepted').length;
        
        let totalTons = 0;
        listings.forEach(l => {
          const tons = parseFloat(l.quantity) || 0;
          totalTons += tons;
        });

        // Update KPI card text
        document.getElementById('kpi-active-listings').textContent = activeListingsCount;
        document.getElementById('kpi-bids-received').textContent = allBids.length;
        document.getElementById('kpi-waste-listed').textContent = `${Math.round(totalTons * 10) / 10} Tons`;
        document.getElementById('kpi-closed-listings').textContent = closedListingsCount;

        // Render Recent 5 Bids
        const bidsTableBody = document.querySelector('#overview-bids-table tbody');
        if (!bidsTableBody) return;

        // Sort bids by date descending
        const recentBids = allBids
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        if (recentBids.length === 0) {
          bidsTableBody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; padding: 2rem;">No bids received yet. Active listings appear on recycler portals.</td>
            </tr>
          `;
          return;
        }

        bidsTableBody.innerHTML = recentBids.map(b => {
          const formattedDate = new Date(b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          const statusClass = b.status === 'accepted' ? 'badge-accepted' : b.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
          
          return `
            <tr>
              <td><strong>${escapeHtml(b.listingTitle)}</strong></td>
              <td>${escapeHtml(b.recyclerName)}</td>
              <td><strong>₹${b.bidAmount.toLocaleString()}</strong></td>
              <td>${formattedDate}</td>
              <td><span class="badge ${statusClass}">${b.status}</span></td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        console.error("Error loading overview metrics:", err);
      }
    }

    async function loadMyListings() {
      const tableBody = document.querySelector('#my-listings-table tbody');
      if (!tableBody) return;

      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
            <p style="margin-top: 10px;">Refreshing listings table...</p>
          </td>
        </tr>
      `;

      try {
        const listings = await dbService.getListings({ industryId: currentUser.uid });

        if (listings.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 3rem;">You haven't listed any waste stream yet. Click "List New Waste" to publish one.</td>
            </tr>
          `;
          return;
        }

        tableBody.innerHTML = listings.map(l => {
          const formattedDate = new Date(l.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          const statusClass = l.status === 'accepted' ? 'badge-accepted' : 'badge-active';
          const statusLabel = l.status === 'accepted' ? 'Closed (Dealt)' : 'Active';

          return `
            <tr>
              <td style="display: flex; align-items: center; gap: 0.75rem;">
                ${
                  l.imageUrl 
                  ? `<img src="${escapeHtml(l.imageUrl)}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid var(--neutral-border);">`
                  : `<div style="width: 40px; height: 40px; border-radius: 4px; border: 1px solid var(--neutral-border); background: var(--neutral-light); display: flex; align-items: center; justify-content: center; color: var(--neutral-body);"><i class="fas fa-image" style="font-size: 0.9rem;"></i></div>`
                }
                <strong>${escapeHtml(l.title)}</strong>
              </td>
              <td><span class="listing-tag" style="background-color: var(--primary-light); color: var(--primary); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight:700;">${l.category}</span></td>
              <td>${escapeHtml(l.quantity)}</td>
              <td>${formattedDate}</td>
              <td><strong style="color: var(--primary-dark); font-size: 1rem;">${l.bidsCount || 0}</strong></td>
              <td><span class="badge ${statusClass}">${statusLabel}</span></td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        console.error("Error loading listings table:", err);
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: #ef4444; padding: 2rem;">Failed to fetch active listings.</td>
          </tr>
        `;
      }
    }

    async function loadBidsManagement() {
      const tableBody = document.querySelector('#bids-management-table tbody');
      if (!tableBody) return;

      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
            <p style="margin-top: 10px;">Refreshing recycler bids...</p>
          </td>
        </tr>
      `;

      try {
        const listings = await dbService.getListings({ industryId: currentUser.uid });
        const allBids = [];

        await Promise.all(listings.map(async (l) => {
          const bids = await dbService.getBidsForListing(l.id);
          bids.forEach(b => {
            allBids.push({ ...b, listingTitle: l.title, listingStatus: l.status });
          });
        }));

        if (allBids.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 3rem;">No recycler bids received yet. active listings appear on recycler maps.</td>
            </tr>
          `;
          return;
        }

        // Sort bids: Pending first, then by date descending
        const sortedBids = allBids.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        tableBody.innerHTML = sortedBids.map(b => {
          const formattedDate = new Date(b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          // Action column output based on Bid/Listing statuses
          let actionsHtml = '';
          if (b.status === 'pending') {
            if (b.listingStatus === 'accepted') {
              // Listing already dealt to someone else
              actionsHtml = `<span style="font-size: 0.8rem; color: #94a3b8; font-style: italic;">Listing closed</span>`;
            } else {
              actionsHtml = `
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-primary btn-sm accept-bid-btn" data-id="${b.id}" style="padding: 0.4rem 0.8rem; background-color: var(--primary);"><i class="fas fa-check"></i> Accept</button>
                  <button class="btn btn-secondary btn-sm reject-bid-btn" data-id="${b.id}" style="padding: 0.4rem 0.8rem; border-color:#ef4444; color:#ef4444;"><i class="fas fa-times"></i> Reject</button>
                </div>
              `;
            }
          } else {
            const statusClass = b.status === 'accepted' ? 'badge-accepted' : 'badge-rejected';
            actionsHtml = `<span class="badge ${statusClass}">${b.status}</span>`;
          }

          return `
            <tr>
              <td>
                <strong>${escapeHtml(b.listingTitle)}</strong>
                <div style="font-size: 0.75rem; color:#94a3b8; margin-top: 0.15rem;">ID: ${b.listingId}</div>
              </td>
              <td>${escapeHtml(b.recyclerName)}</td>
              <td><strong style="color: var(--primary); font-size: 1rem;">₹${b.bidAmount.toLocaleString()}</strong></td>
              <td><div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(b.message)}">${escapeHtml(b.message)}</div></td>
              <td>${formattedDate}</td>
              <td style="vertical-align: middle;">${actionsHtml}</td>
            </tr>
          `;
        }).join('');

        // Attach listeners for Accept/Reject buttons
        const acceptBtns = tableBody.querySelectorAll('.accept-bid-btn');
        const rejectBtns = tableBody.querySelectorAll('.reject-bid-btn');

        acceptBtns.forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const bidId = btn.getAttribute('data-id');
            await handleRespondToBid(bidId, true);
          });
        });

        rejectBtns.forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const bidId = btn.getAttribute('data-id');
            await handleRespondToBid(bidId, false);
          });
        });

      } catch (err) {
        console.error("Error loading bids portal:", err);
      }
    }

    async function handleRespondToBid(bidId, accept) {
      const overlay = document.getElementById('profile-loader');
      if (overlay) overlay.classList.add('active');

      try {
        await dbService.respondToBid(bidId, accept);
        showToast(accept ? "Bid accepted! Waste listing is closed, contact details are unlocked." : "Bid rejected successfully.", "success");
        await loadBidsManagement();
      } catch (err) {
        showToast(err.message || "Failed to process request.", "error");
      } finally {
        if (overlay) overlay.classList.remove('active');
      }
    }

    async function loadAnalyticsCharts() {
      try {
        const listings = await dbService.getListings({ industryId: currentUser.uid });
        const allBids = [];

        await Promise.all(listings.map(async (l) => {
          const bids = await dbService.getBidsForListing(l.id);
          bids.forEach(b => {
            allBids.push(b);
          });
        }));

        // 1. Group listings by Category
        const categoryCounts = {};
        listings.forEach(l => {
          categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
        });

        const categoryLabels = Object.keys(categoryCounts);
        const categoryData = Object.values(categoryCounts);

        // Render Category Doughnut Chart
        const catCanvas = document.getElementById('categoryChart');
        if (catCanvas) {
          const ctx = catCanvas.getContext('2d');
          if (categoryChartInstance) categoryChartInstance.destroy();

          if (categoryLabels.length === 0) {
            ctx.clearRect(0,0, catCanvas.width, catCanvas.height);
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("No listings data to chart. Add waste streams first.", catCanvas.width/2, catCanvas.height/2);
          } else {
            categoryChartInstance = new window.Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: categoryLabels,
                datasets: [{
                  data: categoryData,
                  backgroundColor: [
                    '#15803d', '#22c55e', '#3b82f6', '#ca8a04',
                    '#a855f7', '#ec4899', '#f97316', '#64748b'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 10 } }
                  }
                }
              }
            });
          }
        }

        // 2. Map Listings for Bids bar chart
        const listingBidsData = listings.slice(0, 7); // Show top 7 listings
        const listingTitles = listingBidsData.map(l => l.title.substring(0, 18) + '...');
        const listingBidsCounts = listingBidsData.map(l => l.bidsCount || 0);

        // Render Bids Bar Chart
        const bidsCanvas = document.getElementById('bidsChart');
        if (bidsCanvas) {
          const ctx = bidsCanvas.getContext('2d');
          if (bidsChartInstance) bidsChartInstance.destroy();

          if (listingTitles.length === 0) {
            ctx.clearRect(0,0, bidsCanvas.width, bidsCanvas.height);
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("No bid activities to plot.", bidsCanvas.width/2, bidsCanvas.height/2);
          } else {
            bidsChartInstance = new window.Chart(ctx, {
              type: 'bar',
              data: {
                labels: listingTitles,
                datasets: [{
                  label: 'Number of Bids Received',
                  data: listingBidsCounts,
                  backgroundColor: 'rgba(21, 128, 61, 0.75)',
                  borderColor: '#15803d',
                  borderWidth: 1.5,
                  borderRadius: 4
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 9 } },
                    grid: { borderDash: [4, 4] }
                  },
                  x: {
                    ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 9 } }
                  }
                }
              }
            });
          }
        }

      } catch (err) {
        console.error("Error drawing charts:", err);
      }
    }

    // Helpers
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

    // Initial Overview Data Load
    await loadOverviewData();
  }
};

export default IndustryView;
