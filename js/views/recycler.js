// recycler.js - Recycler Dashboard View
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

export const RecyclerView = {
  render: async (currentUser) => {
    return `
      <div class="db-layout">
        <!-- Sidebar Navigation -->
        <aside class="db-sidebar">
          <div class="db-sidebar-header">
            <h3>${escapeHtml(currentUser.name)}</h3>
            <span>Recycler Portal</span>
          </div>
          <ul class="db-sidebar-menu">
            <li class="db-menu-item active" data-target="db-overview">
              <a><i class="fas fa-chart-pie"></i> Overview</a>
            </li>
            <li class="db-menu-item" data-target="db-browse-waste">
              <a><i class="fas fa-search"></i> Browse Waste</a>
            </li>
            <li class="db-menu-item" data-target="db-my-bids">
              <a><i class="fas fa-gavel"></i> My Bids</a>
            </li>
            <li class="db-menu-item" data-target="db-profile">
              <a><i class="fas fa-user-edit"></i> Complete Profile</a>
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
                <div class="db-breadcrumbs">Recycler Portal / <span>Overview</span></div>
                <h2>Dashboard Overview</h2>
              </div>
              <button class="btn btn-primary btn-sm btn-quick-browse"><i class="fas fa-search"></i> Browse Materials</button>
            </div>

            <!-- KPI Cards Grid -->
            <div class="db-kpi-grid">
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-available-waste">0</div>
                  <div class="kpi-label">Market Listings</div>
                </div>
                <div class="kpi-icon-box green"><i class="fas fa-store"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-bids-submitted">0</div>
                  <div class="kpi-label">Bids Placed</div>
                </div>
                <div class="kpi-icon-box orange"><i class="fas fa-gavel"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-bids-accepted">0</div>
                  <div class="kpi-label">Acquired Deals</div>
                </div>
                <div class="kpi-icon-box blue"><i class="fas fa-handshake"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-total-expenditure">₹0</div>
                  <div class="kpi-label">Total Volume Val</div>
                </div>
                <div class="kpi-icon-box gold"><i class="fas fa-wallet"></i></div>
              </div>
            </div>

            <!-- Recent Bids Table -->
            <div class="db-card">
              <div class="db-card-header">
                <h3>My Recent Bidding Activities</h3>
                <span style="font-size: 0.85rem; color: var(--neutral-body); font-weight: 500;">Status updates</span>
              </div>
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="overview-recent-bids-table">
                    <thead>
                      <tr>
                        <th>Material Listing</th>
                        <th>Generating Industry</th>
                        <th>My Bid Amount</th>
                        <th>Submitted Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="5" style="text-align: center; padding: 3rem;">
                          <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
                          <p style="margin-top: 10px;">Loading bidding history...</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: BROWSE WASTE -->
          <div id="db-browse-waste" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Recycler Portal / <span>Browse Waste</span></div>
                <h2>Browse Available Industrial Waste</h2>
              </div>
            </div>

            <!-- Verification Warning Banner -->
            <div id="recycler-warning-block" class="warning-banner" style="display: none;">
              <i class="fas fa-exclamation-triangle"></i>
              <div>
                <h3>Verification Approval Required</h3>
                <p>Your recycling agency profile is in **Pending** status. Under environmental compliance standards, you cannot place quotes or bid on industrial listings until your credentials are verified by administrators.</p>
              </div>
            </div>

            <!-- Filter Controls -->
            <div class="db-card" style="margin-bottom: 2rem; padding: 1.5rem 2rem;">
              <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center;">
                <div style="flex-grow: 1; min-width: 250px;">
                  <div class="input-icon-wrapper">
                    <input type="text" id="r-search-input" placeholder="Search by name, description, or city..." style="margin-bottom: 0;">
                    <i class="fas fa-search"></i>
                  </div>
                </div>
                
                <div style="width: 200px;">
                  <select id="r-category-filter" style="width:100%; padding:0.8rem; border: 1.5px solid var(--neutral-border); border-radius: var(--radius-md); font-family: var(--font-body);">
                    <option value="all">All Categories</option>
                    <option value="Metal">Metal</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                    <option value="Rubber">Rubber</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Textile">Textile</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Organic">Organic</option>
                    <option value="Wood">Wood</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Materials Grid -->
            <div id="recycler-listings-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
              <div style="grid-column: span 3; text-align: center; padding: 3rem;">
                <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
                <p style="margin-top: 10px;">Loading marketplace items...</p>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: MY BIDS -->
          <div id="db-my-bids" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Recycler Portal / <span>My Bids</span></div>
                <h2>Manage Submitted Bids</h2>
              </div>
            </div>

            <div class="db-card">
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="my-bids-table">
                    <thead>
                      <tr>
                        <th>Material Listing</th>
                        <th>Generating Industry</th>
                        <th>Tonnage/Quantity</th>
                        <th>My Bid Quote</th>
                        <th>Bidding Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="6" style="text-align: center; padding: 3rem;">
                          <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
                          <p style="margin-top: 10px;">Fetching bids history...</p>
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
                <div class="db-breadcrumbs">Recycler Portal / <span>Profile</span></div>
                <h2>Recycling Agency Profile</h2>
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

          <!-- SUB-VIEW: ANALYTICS -->
          <div id="db-analytics" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Recycler Portal / <span>Analytics</span></div>
                <h2>Bidding Analytics & Volumes</h2>
              </div>
            </div>

            <div class="db-chart-grid">
              <div class="db-chart-box">
                <h3>Bids Decision Outcomes</h3>
                <div class="db-chart-container">
                  <canvas id="recyclerBidsStatusChart"></canvas>
                </div>
              </div>
              
              <div class="db-chart-box">
                <h3>Average Bid Quotes per Category</h3>
                <div class="db-chart-container">
                  <canvas id="recyclerBidsValuesChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: SETTINGS -->
          <div id="db-settings" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Recycler Portal / <span>Settings</span></div>
                <h2>Account Settings</h2>
              </div>
            </div>

            <div class="db-card" style="max-width: 500px;">
              <div class="db-card-body">
                <p style="margin-bottom: 1.5rem; font-size: 0.95rem; color: var(--neutral-body);">Manage account access credentials and sessions.</p>
                <div class="form-group">
                  <label>Account Role</label>
                  <input type="text" value="Verified Recycling Agency" disabled style="width:100%; padding:0.8rem; background-color: var(--neutral-light); border: 1px solid var(--neutral-border); border-radius: var(--radius-sm); cursor: not-allowed; font-weight: 600;">
                </div>
                <div class="form-group">
                  <label>Authorized Email</label>
                  <input type="text" value="${escapeHtml(currentUser.email)}" disabled style="width:100%; padding:0.8rem; background-color: var(--neutral-light); border: 1px solid var(--neutral-border); border-radius: var(--radius-sm); cursor: not-allowed;">
                </div>
                <button class="btn btn-secondary btn-full r-logout-shortcut" style="margin-top: 1.5rem;"><i class="fas fa-sign-out-alt"></i> Logout from System</button>
              </div>
            </div>
          </div>

        </main>
      </div>

      <!-- BID MODAL DIALOG -->
      <div id="place-bid-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); z-index: 10000; overflow-y: auto; align-items: flex-start; justify-content: center; padding: 2rem 1rem;">
        <div class="db-card" style="width: 100%; max-width: 500px; margin: auto; border: 1.5px solid var(--neutral-border); box-shadow: var(--shadow-xl); position: relative; animation: fadeIn 0.25s ease-out;">
          <div class="auth-loading-overlay" id="bid-submit-loader">
            <div class="spinner"></div>
            <p style="font-family: var(--font-body); font-weight: 600; color: var(--primary);">Submitting bid quote...</p>
          </div>
          
          <div class="db-card-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--neutral-border);">
            <h3 id="modal-material-title" style="margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--neutral-dark);">Place Bid on Waste Stream</h3>
            <button id="close-bid-modal-btn" type="button" style="background: none; border: none; font-size: 1.25rem; color: var(--neutral-body); cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--neutral-body)'"><i class="fas fa-times"></i></button>
          </div>
          <div class="db-card-body" style="padding: 1.5rem;">
            <form id="submit-bid-form">
              <input type="hidden" id="modal-listing-id">
              
              <div class="form-group">
                <label>Generating Industry</label>
                <input type="text" id="modal-industry-name" disabled style="width: 100%; padding: 0.8rem; background-color: var(--neutral-light); border: 1px solid var(--neutral-border); border-radius: var(--radius-sm); cursor: not-allowed; font-weight: 600; color: var(--neutral-dark);">
              </div>

              <div class="form-group">
                <label for="bid-amount-input">Bidding Amount Quote (₹)</label>
                <div class="input-icon-wrapper">
                  <input type="number" id="bid-amount-input" placeholder="e.g., 45000" min="1" required style="margin-bottom: 0;">
                  <i class="fas fa-rupee-sign"></i>
                </div>
                <span style="font-size: 0.75rem; color: var(--neutral-body); display: block; margin-top: 0.35rem;">Enter the total offer price for the listed quantity.</span>
              </div>

              <div class="form-group">
                <label for="bid-message-input">Message / Collection Proposal</label>
                <textarea id="bid-message-input" placeholder="Include logistics timeline, payment terms (COD, Net 30), etc." required style="width:100%; min-height: 100px; padding: 0.75rem; border: 1.5px solid var(--neutral-border); border-radius: var(--radius-md); font-family: var(--font-body); font-size: 0.925rem; outline: none;"></textarea>
              </div>

              <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button type="button" class="btn btn-secondary" id="cancel-bid-btn" style="flex: 1; padding: 0.8rem; border-color: var(--neutral-border); color: var(--neutral-dark);">
                  <i class="fas fa-arrow-left"></i> Go Back
                </button>
                <button type="submit" class="btn btn-primary" style="flex: 2; padding: 0.8rem; background-color: var(--primary);">
                  Submit Bidding Quote <i class="fas fa-gavel"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  init: async (currentUser) => {
    if (!currentUser) {
      window.location.hash = '#login';
      return;
    }

    // Chart references
    let statusChartInstance = null;
    let valuesChartInstance = null;

    // Filter state for material directory
    const filterState = {
      search: '',
      category: 'all'
    };

    // Sidebar navigation logic
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
          breadcrumbsLabel.textContent = item.textContent.trim();
        }

        // Show target views
        contentViews.forEach(cv => {
          if (cv.id === targetId) {
            cv.classList.add('active');
          } else {
            cv.classList.remove('active');
          }
        });

        // Load content dynamically
        if (targetId === 'db-overview') {
          loadOverviewData();
        } else if (targetId === 'db-browse-waste') {
          loadBrowseWaste();
        } else if (targetId === 'db-my-bids') {
          loadMyBids();
        } else if (targetId === 'db-analytics') {
          loadAnalyticsCharts();
        }
      });
    });

    // Overview Quick browse button shortcut
    const quickBrowseBtn = document.querySelector('.btn-quick-browse');
    if (quickBrowseBtn) {
      quickBrowseBtn.addEventListener('click', () => {
        const browseItem = document.querySelector('.db-menu-item[data-target="db-browse-waste"]');
        if (browseItem) browseItem.click();
      });
    }

    // Logout button handler
    const logoutBtn = document.querySelector('.r-logout-shortcut');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await dbService.logoutUser();
        window.dispatchEvent(new CustomEvent('wb-auth-changed'));
        window.location.hash = '#home';
      });
    }

    // --- CHECK USER STATUS (PENDING AND BLOCKED BIDDING) ---
    const isPending = currentUser.status === 'pending_verification' || currentUser.status === 'pending';
    const isPaused = currentUser.status === 'paused' || currentUser.status === 'suspended';
    
    const checkVerificationState = () => {
      const warningBlock = document.getElementById('recycler-warning-block');
      if ((isPending || isPaused) && warningBlock) {
        warningBlock.style.display = 'flex';
        if (isPaused) {
          warningBlock.querySelector('h3').textContent = "Account Temporarily Paused";
          warningBlock.querySelector('p').textContent = "Your recycling agency account has been paused by administrators. You cannot place quotes or bid on industrial listings until your status is restored.";
        }
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

        // Overlay loader trigger (reuse bid submit overlay styling locally on profile form if desired)
        const loader = document.getElementById('bid-submit-loader');
        if (loader) {
          loader.classList.add('active');
          loader.querySelector('p').textContent = 'Updating profile...';
        }

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
          
          showToast("Profile settings updated successfully!", "success");
          Object.assign(currentUser, updateData);

          const sidebarTitle = document.querySelector('.db-sidebar-header h3');
          if (sidebarTitle) sidebarTitle.textContent = newName;

          window.dispatchEvent(new CustomEvent('wb-auth-changed'));
        } catch (err) {
          showToast(err.message || "Failed to update profile details", "error");
        } finally {
          if (loader) {
            loader.classList.remove('active');
            loader.querySelector('p').textContent = 'Submitting bid quote...';
          }
        }
      });
    }

    // --- SUBMIT BID MODAL HANDLERS ---
    const modal = document.getElementById('place-bid-modal');
    const closeBtn = document.getElementById('close-bid-modal-btn');
    const bidForm = document.getElementById('submit-bid-form');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
        bidForm.reset();
      });
    }

    const cancelBtn = document.getElementById('cancel-bid-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
        bidForm.reset();
      });
    }

    if (bidForm) {
      bidForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isPending || isPaused) {
          showToast(isPaused ? "Bidding is blocked. Account paused." : "Bidding is blocked. Verification Approval required.", "error");
          return;
        }

        const listingId = document.getElementById('modal-listing-id').value;
        const industryName = document.getElementById('modal-industry-name').value;
        const bidAmount = parseInt(document.getElementById('bid-amount-input').value.trim());
        const message = document.getElementById('bid-message-input').value.trim();

        const submitLoader = document.getElementById('bid-submit-loader');
        if (submitLoader) submitLoader.classList.add('active');

        try {
          const bidData = {
            listingId,
            recyclerId: currentUser.uid,
            recyclerName: currentUser.name,
            bidAmount,
            message
          };

          await dbService.submitBid(bidData);
          showToast("Bidding quote submitted successfully!", "success");
          
          if (modal) modal.style.display = 'none';
          bidForm.reset();

          // Refresh current lists
          loadBrowseWaste();
        } catch (err) {
          showToast(err.message || "Failed to submit bidding quote.", "error");
        } finally {
          if (submitLoader) submitLoader.classList.remove('active');
        }
      });
    }

    // --- DYNAMIC DATA LOADERS ---

    async function loadOverviewData() {
      try {
        const listings = await dbService.getListings();
        const myBids = await dbService.getBidsForRecycler(currentUser.uid);

        const activeListingsCount = listings.filter(l => l.status === 'active').length;
        const acceptedBids = myBids.filter(b => b.status === 'accepted');
        
        let totalVal = 0;
        acceptedBids.forEach(b => {
          totalVal += (b.bidAmount || 0);
        });

        // Set KPI Numbers
        document.getElementById('kpi-available-waste').textContent = activeListingsCount;
        document.getElementById('kpi-bids-submitted').textContent = myBids.length;
        document.getElementById('kpi-bids-accepted').textContent = acceptedBids.length;
        document.getElementById('kpi-total-expenditure').textContent = `₹${totalVal.toLocaleString()}`;

        // Render Recent 5 Bids
        const tableBody = document.querySelector('#overview-recent-bids-table tbody');
        if (!tableBody) return;

        const recentBids = myBids
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        if (recentBids.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; padding: 2.5rem;">You haven't placed any bids yet. Head to "Browse Waste" to check active materials.</td>
            </tr>
          `;
          return;
        }

        // Fetch corresponding listings to get industry details
        const renderedRows = await Promise.all(recentBids.map(async (b) => {
          const listing = await dbService.getListingById(b.listingId);
          const formattedDate = new Date(b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          const statusClass = b.status === 'accepted' ? 'badge-accepted' : b.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
          
          return `
            <tr>
              <td><strong>${escapeHtml(listing ? listing.title : 'Material Stream')}</strong></td>
              <td>${escapeHtml(listing ? listing.industryName : 'Industry')}</td>
              <td><strong>₹${b.bidAmount.toLocaleString()}</strong></td>
              <td>${formattedDate}</td>
              <td><span class="badge ${statusClass}">${b.status}</span></td>
            </tr>
          `;
        }));

        tableBody.innerHTML = renderedRows.join('');

      } catch (err) {
        console.error("Error loading overview values:", err);
      }
    }

    async function loadBrowseWaste() {
      const container = document.getElementById('recycler-listings-container');
      if (!container) return;

      container.innerHTML = `
        <div style="grid-column: span 3; text-align: center; padding: 3rem;">
          <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
          <p style="margin-top: 10px;">Filtering listings...</p>
        </div>
      `;

      try {
        let listings = await dbService.getListings();

        // Filter out accepted (closed) listings and apply category/search filters
        listings = listings.filter(l => l.status === 'active');

        if (filterState.category && filterState.category !== 'all') {
          listings = listings.filter(l => l.category.toLowerCase() === filterState.category.toLowerCase());
        }

        if (filterState.search) {
          const searchLower = filterState.search.toLowerCase();
          listings = listings.filter(l => 
            l.title.toLowerCase().includes(searchLower) ||
            l.description.toLowerCase().includes(searchLower) ||
            l.location.toLowerCase().includes(searchLower)
          );
        }

        if (listings.length === 0) {
          container.innerHTML = `
            <div style="grid-column: span 3; text-align: center; padding: 4rem; background: var(--white); border-radius: var(--radius-lg); border: 1px solid var(--neutral-border);">
              <i class="fas fa-box-open" style="font-size: 3rem; color: var(--neutral-border); margin-bottom: 1.5rem;"></i>
              <h3>No Material Listings Found</h3>
              <p style="color: var(--neutral-body); margin-top: 0.5rem;">There are no active industrial waste streams matching your filter parameters.</p>
            </div>
          `;
          return;
        }

        container.innerHTML = listings.map(l => {
          const formattedDate = new Date(l.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return `
            <div class="db-card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between; border-color: var(--neutral-border);">
              ${
                l.imageUrl 
                ? `<div class="view-card-details" data-id="${l.id}" style="background-image: url('${escapeHtml(l.imageUrl)}'); height: 160px; background-size: cover; background-position: center; border-top-left-radius: var(--radius-md); border-top-right-radius: var(--radius-md); cursor: pointer;"></div>`
                : ''
              }
              <div class="db-card-body" style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <span class="listing-tag" style="background-color: var(--primary-light); color: var(--primary); padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.725rem; font-weight:700; text-transform: uppercase;">${l.category}</span>
                  <span style="font-size: 0.8rem; color: var(--neutral-body); font-weight: 500;"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                </div>
                <h3 class="view-card-details" data-id="${l.id}" style="font-size: 1.15rem; font-family: var(--font-heading); margin-bottom: 0.5rem; color: var(--neutral-dark); line-height: 1.3; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--neutral-dark)'">${escapeHtml(l.title)}</h3>
                <p style="font-size: 0.85rem; color: var(--neutral-body); margin-bottom: 1.25rem; line-height: 1.5; height: 60px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${escapeHtml(l.description)}</p>
                
                <div style="border-top: 1px solid var(--neutral-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--neutral-body);">
                    <span>Quantity: <strong style="color: var(--neutral-dark);">${escapeHtml(l.quantity)}</strong></span>
                    <span>Bids: <strong style="color: var(--primary);">${l.bidsCount || 0}</strong></span>
                  </div>
                  <div style="font-size: 0.85rem; color: var(--neutral-body);">
                    <i class="fas fa-map-marker-alt" style="color: var(--primary-light);"></i> <strong>${escapeHtml(l.location)}</strong>
                  </div>
                  <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem;">
                    Generator: <strong>${escapeHtml(l.industryName)}</strong>
                  </div>
                </div>
              </div>
              <div class="db-card-header" style="background: var(--neutral-light); padding: 1rem; border-top: 1px solid var(--neutral-border); justify-content: center; gap: 0.5rem;">
                ${
                  (isPending || isPaused)
                  ? `<div style="display: flex; gap: 0.5rem; width: 100%;">
                       <button class="btn btn-secondary btn-sm view-details-btn" data-id="${l.id}" style="flex: 1; padding: 0.6rem;"><i class="fas fa-info-circle"></i> Details</button>
                       <button class="btn btn-primary btn-sm" disabled style="flex: 1.5; padding: 0.6rem; opacity: 0.5; cursor: not-allowed;"><i class="fas fa-lock"></i> Locked</button>
                     </div>`
                  : `<div style="display: flex; gap: 0.5rem; width: 100%;">
                       <button class="btn btn-secondary btn-sm view-details-btn" data-id="${l.id}" style="flex: 1; padding: 0.6rem; border-color: var(--neutral-border); color: var(--neutral-body);"><i class="fas fa-info-circle"></i> Details</button>
                       <button class="btn btn-primary btn-sm place-bid-trigger-btn" data-id="${l.id}" data-title="${escapeHtml(l.title)}" data-industry="${escapeHtml(l.industryName)}" style="flex: 1.5; padding: 0.6rem;"><i class="fas fa-gavel"></i> Place Bid</button>
                     </div>`
                }
              </div>
            </div>
          `;
        }).join('');

        // Attach Place Bid Trigger Button Handlers
        const triggerBtns = container.querySelectorAll('.place-bid-trigger-btn');
        triggerBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const listingId = btn.getAttribute('data-id');
            const title = btn.getAttribute('data-title');
            const industry = btn.getAttribute('data-industry');

            openPlaceBidModal(listingId, title, industry);
          });
        });

        // Attach Details Button/Card Handlers
        const detailsTriggers = container.querySelectorAll('.view-card-details, .view-details-btn');
        detailsTriggers.forEach(trigger => {
          trigger.addEventListener('click', () => {
            const listingId = trigger.getAttribute('data-id');
            const selectedListing = listings.find(l => l.id === listingId);
            if (selectedListing) {
              openDetailsModal(selectedListing, currentUser, (lId, lTitle, lInd) => {
                openPlaceBidModal(lId, lTitle, lInd);
              });
            }
          });
        });

      } catch (err) {
        console.error("Error loading browse waste grid:", err);
      }
    }

    function openPlaceBidModal(listingId, title, industry) {
      // Open Modal and populate hidden inputs
      document.getElementById('modal-listing-id').value = listingId;
      document.getElementById('modal-industry-name').value = industry;
      document.getElementById('modal-material-title').textContent = `Quote for: ${title}`;
      
      if (modal) modal.style.display = 'flex';
    }

      } catch (err) {
        console.error("Error loading browse waste grid:", err);
      }
    }

    async function loadMyBids() {
      const tableBody = document.querySelector('#my-bids-table tbody');
      if (!tableBody) return;

      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
            <p style="margin-top: 10px;">Refreshing bids table...</p>
          </td>
        </tr>
      `;

      try {
        const myBids = await dbService.getBidsForRecycler(currentUser.uid);

        if (myBids.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 3rem;">You haven't submitted any bids yet. Go to "Browse Waste" to submit quotes.</td>
            </tr>
          `;
          return;
        }

        const sortedBids = myBids.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const renderedRows = await Promise.all(sortedBids.map(async (b) => {
          const listing = await dbService.getListingById(b.listingId);
          const formattedDate = new Date(b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          const statusClass = b.status === 'accepted' ? 'badge-accepted' : b.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
          
          return `
            <tr>
              <td>
                <strong>${escapeHtml(listing ? listing.title : 'Material Stream')}</strong>
                <div style="font-size: 0.75rem; color:#94a3b8; margin-top: 0.15rem;">ID: ${b.listingId}</div>
              </td>
              <td>${escapeHtml(listing ? listing.industryName : 'Industry Generator')}</td>
              <td>${escapeHtml(listing ? listing.quantity : 'N/A')}</td>
              <td><strong style="color: var(--primary); font-size: 1rem;">₹${b.bidAmount.toLocaleString()}</strong></td>
              <td>${formattedDate}</td>
              <td><span class="badge ${statusClass}">${b.status}</span></td>
            </tr>
          `;
        }));

        tableBody.innerHTML = renderedRows.join('');

      } catch (err) {
        console.error("Error loading bids table:", err);
      }
    }

    async function loadAnalyticsCharts() {
      try {
        const myBids = await dbService.getBidsForRecycler(currentUser.uid);

        // 1. Group bids by status
        const statusCounts = { pending: 0, accepted: 0, rejected: 0 };
        myBids.forEach(b => {
          if (statusCounts[b.status] !== undefined) {
            statusCounts[b.status]++;
          }
        });

        // Draw Pie Chart
        const statusCanvas = document.getElementById('recyclerBidsStatusChart');
        if (statusCanvas) {
          const ctx = statusCanvas.getContext('2d');
          if (statusChartInstance) statusChartInstance.destroy();

          if (myBids.length === 0) {
            ctx.clearRect(0,0, statusCanvas.width, statusCanvas.height);
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("No bidding outcomes to chart.", statusCanvas.width/2, statusCanvas.height/2);
          } else {
            statusChartInstance = new window.Chart(ctx, {
              type: 'pie',
              data: {
                labels: ['Pending Review', 'Accepted Deals', 'Rejected/Closed'],
                datasets: [{
                  data: [statusCounts.pending, statusCounts.accepted, statusCounts.rejected],
                  backgroundColor: ['#eab308', '#22c55e', '#ef4444'],
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

        // 2. Fetch Average quotes per material category
        const categorySum = {};
        const categoryCount = {};

        // Resolve listing details for category groupings
        await Promise.all(myBids.map(async (b) => {
          const listing = await dbService.getListingById(b.listingId);
          if (listing) {
            const cat = listing.category;
            categorySum[cat] = (categorySum[cat] || 0) + b.bidAmount;
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          }
        }));

        const categories = Object.keys(categorySum);
        const averages = categories.map(cat => Math.round(categorySum[cat] / categoryCount[cat]));

        // Draw Bar Chart
        const valCanvas = document.getElementById('recyclerBidsValuesChart');
        if (valCanvas) {
          const ctx = valCanvas.getContext('2d');
          if (valuesChartInstance) valuesChartInstance.destroy();

          if (categories.length === 0) {
            ctx.clearRect(0,0, valCanvas.width, valCanvas.height);
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("No quotes data to aggregate.", valCanvas.width/2, valCanvas.height/2);
          } else {
            valuesChartInstance = new window.Chart(ctx, {
              type: 'bar',
              data: {
                labels: categories,
                datasets: [{
                  label: 'Average Bid Quote (₹)',
                  data: averages,
                  backgroundColor: 'rgba(234, 88, 12, 0.75)',
                  borderColor: '#ea580c',
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
                    ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 9 } },
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
        console.error("Error drawing analytics:", err);
      }
    }

    // Attach search and category filter event listeners inside Browse Waste view
    const rSearch = document.getElementById('r-search-input');
    const rCategory = document.getElementById('r-category-filter');

    if (rSearch) {
      rSearch.addEventListener('input', (e) => {
        filterState.search = e.target.value;
        loadBrowseWaste();
      });
    }

    if (rCategory) {
      rCategory.addEventListener('change', (e) => {
        filterState.category = e.target.value;
        loadBrowseWaste();
      });
    }

    // Toast and UI Helpers
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

// --- POPUP DETAILS MODAL RENDERER ---
function openDetailsModal(listing, currentUser, onPlaceBid) {
  const backdrop = document.createElement('div');
  backdrop.className = 'wb-modal-backdrop';
  backdrop.id = 'listing-details-modal-container';

  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  let categoryIcon = 'fa-recycle';
  if (listing.category === 'Metal') categoryIcon = 'fa-cog';
  else if (listing.category === 'Plastic') categoryIcon = 'fa-prescription-bottle';
  else if (listing.category === 'Paper') categoryIcon = 'fa-file-alt';
  else if (listing.category === 'Glass') categoryIcon = 'fa-wine-bottle';
  else if (listing.category === 'Rubber') categoryIcon = 'fa-compact-disc';
  else if (listing.category === 'Electronic') categoryIcon = 'fa-laptop';
  else if (listing.category === 'Textile') categoryIcon = 'fa-tshirt';
  else if (listing.category === 'Chemical') categoryIcon = 'fa-flask';
  else if (listing.category === 'Organic') categoryIcon = 'fa-leaf';
  else if (listing.category === 'Wood') categoryIcon = 'fa-tree';

  const isPending = currentUser.status === 'pending_verification' || currentUser.status === 'pending';
  const isPaused = currentUser.status === 'paused' || currentUser.status === 'suspended';

  backdrop.innerHTML = `
    <div class="wb-modal-card" style="max-width: 600px; width: 95%; max-height: 90vh; border-radius: var(--radius-lg); background: var(--white); overflow-y: auto; box-shadow: var(--shadow-xl); position: relative; animation: modalSlideUp 0.3s ease-out; margin: 2rem auto; display: flex; flex-direction: column;">
      <!-- Large Header Image -->
      ${
        listing.imageUrl
        ? `<div style="background-image: url('${escapeHtml(listing.imageUrl)}'); height: 260px; background-size: cover; background-position: center; border-bottom: 1px solid var(--neutral-border); position: relative; flex-shrink: 0;"></div>`
        : `<div style="height: 180px; background: linear-gradient(135deg, var(--primary-light) 0%, #bbf7d0 100%); display: flex; align-items: center; justify-content: center; font-size: 5rem; color: var(--primary); flex-shrink: 0;"><i class="fas ${categoryIcon}"></i></div>`
      }
      
      <!-- Modal Close Icon -->
      <button id="close-details-modal-icon" style="position: absolute; top: 1rem; right: 1rem; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; transition: var(--transition-smooth); border: none; z-index: 100; cursor: pointer;">
        <i class="fas fa-times"></i>
      </button>
      
      <!-- Content Body -->
      <div style="padding: 2rem; flex-grow: 1; display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span class="listing-tag" style="background-color: var(--primary-light); color: var(--primary); padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.725rem; font-weight:700; text-transform: uppercase;">${listing.category}</span>
          <span style="font-size: 0.8rem; color: var(--neutral-body); font-weight: 500;"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
        </div>
        
        <h2 style="font-size: 1.6rem; color: var(--neutral-dark); line-height: 1.25; margin: 0;">${escapeHtml(listing.title)}</h2>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; background: var(--neutral-light); padding: 1rem; border-radius: var(--radius-md); font-size: 0.85rem;">
          <div>
            <span style="color: var(--neutral-body); display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">Quantity</span>
            <strong style="color: var(--neutral-dark); font-size: 1rem;">${escapeHtml(listing.quantity)}</strong>
          </div>
          <div>
            <span style="color: var(--neutral-body); display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">Bids Submitted</span>
            <strong style="color: var(--primary); font-size: 1rem;">${listing.bidsCount || 0} bids</strong>
          </div>
          <div>
            <span style="color: var(--neutral-body); display: block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">Industry</span>
            <strong style="color: var(--neutral-dark); font-size: 0.85rem; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(listing.industryName)}</strong>
          </div>
        </div>
        
        <!-- Detailed Description Section -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--neutral-dark); margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 0.05em;">Material Description</h4>
          <p style="font-size: 0.925rem; color: var(--neutral-body); line-height: 1.6; background: var(--neutral-light); padding: 1rem; border-radius: var(--radius-md); border-left: 3.5px solid var(--primary); margin: 0; white-space: pre-wrap; max-height: 180px; overflow-y: auto;">
            ${escapeHtml(listing.description)}
          </p>
        </div>

        <!-- Footer / Location / Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--neutral-border); padding-top: 1.25rem; margin-top: auto; gap: 1rem; flex-wrap: wrap;">
          <span style="font-size: 0.85rem; color: var(--neutral-body); display: flex; align-items: center; gap: 0.35rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">
            <i class="fas fa-map-marker-alt" style="color: var(--primary);"></i> ${escapeHtml(listing.location)}
          </span>
          <div style="display: flex; gap: 0.5rem;">
            <button id="modal-close-btn" class="btn btn-secondary btn-sm" style="padding: 0.5rem 1rem;">Close</button>
            ${
              listing.status === 'accepted' 
              ? `<span class="badge badge-accepted" style="padding: 0.5rem 1rem;"><i class="fas fa-check-circle"></i> Closed</span>` 
              : (isPending || isPaused)
                ? `<button class="btn btn-primary btn-sm" disabled style="padding: 0.5rem 1rem; opacity: 0.5; cursor: not-allowed;"><i class="fas fa-lock"></i> Locked</button>`
                : `<button id="modal-bid-action" class="btn btn-primary btn-sm" style="padding: 0.5rem 1rem;"><i class="fas fa-gavel"></i> Place Bid</button>`
            }
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  // Close helper
  const closeModal = () => {
    backdrop.style.opacity = '0';
    backdrop.style.transition = 'opacity 0.2s ease-out';
    setTimeout(() => {
      backdrop.remove();
    }, 200);
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  const closeIcon = backdrop.querySelector('#close-details-modal-icon');
  const closeBtn = backdrop.querySelector('#modal-close-btn');
  if (closeIcon) closeIcon.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Modal action Place Bid trigger
  const bidBtn = backdrop.querySelector('#modal-bid-action');
  if (bidBtn) {
    bidBtn.addEventListener('click', () => {
      closeModal();
      if (onPlaceBid) {
        onPlaceBid(listing.id, listing.title, listing.industryName);
      }
    });
  }
}

export default RecyclerView;
