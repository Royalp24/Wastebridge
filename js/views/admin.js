// admin.js - Admin Dashboard View
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

export const AdminView = {
  render: async (currentUser) => {
    return `
      <div class="db-layout">
        <!-- Sidebar Navigation -->
        <aside class="db-sidebar">
          <div class="db-sidebar-header">
            <h3>${escapeHtml(currentUser.name)}</h3>
            <span>Administrator</span>
          </div>
          <ul class="db-sidebar-menu">
            <li class="db-menu-item active" data-target="db-overview">
              <a><i class="fas fa-chart-pie"></i> Overview</a>
            </li>
            <li class="db-menu-item" data-target="db-ind-verification">
              <a><i class="fas fa-industry"></i> Industry Verification</a>
            </li>
            <li class="db-menu-item" data-target="db-rec-verification">
              <a><i class="fas fa-recycle"></i> Recycler Verification</a>
            </li>
            <li class="db-menu-item" data-target="db-listings">
              <a><i class="fas fa-clipboard-list"></i> Waste Listings</a>
            </li>
            <li class="db-menu-item" data-target="db-bids">
              <a><i class="fas fa-gavel"></i> Bid Management</a>
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
          <!-- Loading Overlay -->
          <div class="auth-loading-overlay" id="admin-loader">
            <div class="spinner"></div>
            <p style="font-family: var(--font-body); font-weight: 600; color: var(--primary);">Processing administrative action...</p>
          </div>

          <!-- SUB-VIEW: OVERVIEW -->
          <div id="db-overview" class="db-content-view active">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Admin Portal / <span>Overview</span></div>
                <h2>Global System Overview</h2>
              </div>
            </div>

            <!-- KPI Cards Grid -->
            <div class="db-kpi-grid">
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-total-users">0</div>
                  <div class="kpi-label">Total Corporate Users</div>
                </div>
                <div class="kpi-icon-box green"><i class="fas fa-users"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-total-listings">0</div>
                  <div class="kpi-label">Market Listings</div>
                </div>
                <div class="kpi-icon-box orange"><i class="fas fa-box"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-total-bids">0</div>
                  <div class="kpi-label">Total Bids Placed</div>
                </div>
                <div class="kpi-icon-box blue"><i class="fas fa-gavel"></i></div>
              </div>
              <div class="kpi-card">
                <div class="kpi-details">
                  <div class="kpi-num" id="kpi-total-recycled">0 Tons</div>
                  <div class="kpi-label">Tonnage Diverted</div>
                </div>
                <div class="kpi-icon-box gold"><i class="fas fa-recycle"></i></div>
              </div>
            </div>

            <!-- Pending Verifications table quick look -->
            <div class="db-card">
              <div class="db-card-header">
                <h3>Users Pending verification</h3>
                <span style="font-size: 0.85rem; color: var(--neutral-body); font-weight: 600;">Immediate action required</span>
              </div>
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="overview-pending-users-table">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Corporate Email</th>
                        <th>Role Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="5" style="text-align: center; padding: 2.5rem;">No users pending verification.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: INDUSTRY VERIFICATION -->
          <div id="db-ind-verification" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Admin Portal / <span>Industry Verification</span></div>
                <h2>Moderate Waste Generating Industries</h2>
              </div>
            </div>

            <div class="db-card">
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="industries-moderation-table">
                    <thead>
                      <tr>
                        <th>Company Details (GSTIN)</th>
                        <th>Contact Info (Website)</th>
                        <th>Plant Address</th>
                        <th>Status</th>
                        <th>Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="6" style="text-align: center; padding: 3rem;">Loading industries...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: RECYCLER VERIFICATION -->
          <div id="db-rec-verification" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Admin Portal / <span>Recycler Verification</span></div>
                <h2>Moderate B2B Recycling Agencies</h2>
              </div>
            </div>

            <div class="db-card">
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="recyclers-moderation-table">
                    <thead>
                      <tr>
                        <th>Company Details (GSTIN)</th>
                        <th>Contact Info (Website)</th>
                        <th>Plant Address</th>
                        <th>Status</th>
                        <th>Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="6" style="text-align: center; padding: 3rem;">Loading recycling agencies...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: WASTE LISTINGS -->
          <div id="db-listings" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Admin Portal / <span>Waste Listings</span></div>
                <h2>Manage Platform Waste Listings</h2>
              </div>
            </div>

            <div class="db-card">
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="admin-listings-table">
                    <thead>
                      <tr>
                        <th>Material Listing</th>
                        <th>Generating Industry</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Created Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="7" style="text-align: center; padding: 3rem;">Loading listings logs...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: BID MANAGEMENT -->
          <div id="db-bids" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Admin Portal / <span>Bid Management</span></div>
                <h2>Monitor Bidding Activity logs</h2>
              </div>
            </div>

            <div class="db-card">
              <div class="db-card-body" style="padding: 0;">
                <div class="table-wrapper">
                  <table class="db-table" id="admin-bids-table">
                    <thead>
                      <tr>
                        <th>Bidding ID</th>
                        <th>Listing Context</th>
                        <th>Recycling Bidder</th>
                        <th>Quote Price</th>
                        <th>Message Notes</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="6" style="text-align: center; padding: 3rem;">Loading bids history logs...</td>
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
                <div class="db-breadcrumbs">Admin Portal / <span>Analytics</span></div>
                <h2>Global Platform Metrics & ESG Insights</h2>
              </div>
            </div>

            <div class="db-chart-grid">
              <div class="db-chart-box">
                <h3>User Base Ratios (Industries vs Recyclers)</h3>
                <div class="db-chart-container">
                  <canvas id="adminUsersChart"></canvas>
                </div>
              </div>
              
              <div class="db-chart-box">
                <h3>Total Listings Tonnages by Material Category</h3>
                <div class="db-chart-container">
                  <canvas id="adminCategoryChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- SUB-VIEW: SETTINGS -->
          <div id="db-settings" class="db-content-view">
            <div class="db-header-row">
              <div>
                <div class="db-breadcrumbs">Admin Portal / <span>Settings</span></div>
                <h2>System Settings</h2>
              </div>
            </div>

            <div class="db-card" style="max-width: 500px;">
              <div class="db-card-body">
                <p style="margin-bottom: 1.5rem; font-size: 0.95rem; color: var(--neutral-body);">Administrative credentials and session tokens.</p>
                <div class="form-group">
                  <label>Role Privilege</label>
                  <input type="text" value="System Administrator" disabled style="width:100%; padding:0.8rem; background-color: var(--neutral-light); border: 1px solid var(--neutral-border); border-radius: var(--radius-sm); cursor: not-allowed; font-weight: 700; color: var(--accent);">
                </div>
                <div class="form-group">
                  <label>Authorized Login Email</label>
                  <input type="text" value="${escapeHtml(currentUser.email)}" disabled style="width:100%; padding:0.8rem; background-color: var(--neutral-light); border: 1px solid var(--neutral-border); border-radius: var(--radius-sm); cursor: not-allowed;">
                </div>
                <button class="btn btn-secondary btn-full admin-logout-btn" style="margin-top: 1.5rem;"><i class="fas fa-sign-out-alt"></i> Logout from Dashboard</button>
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

    // Chart instances
    let usersChartInstance = null;
    let categoryChartInstance = null;

    // Loader overlay helper
    const setLoading = (isLoading) => {
      const loader = document.getElementById('admin-loader');
      if (loader) {
        if (isLoading) loader.classList.add('active');
        else loader.classList.remove('active');
      }
    };

    // Sidebar navigation
    const menuItems = document.querySelectorAll('.db-menu-item');
    const contentViews = document.querySelectorAll('.db-content-view');
    const breadcrumbsLabel = document.querySelector('.db-breadcrumbs span');

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        
        menuItems.forEach(mi => mi.classList.remove('active'));
        item.classList.add('active');
        
        if (breadcrumbsLabel) {
          breadcrumbsLabel.textContent = item.textContent.trim();
        }

        contentViews.forEach(cv => {
          if (cv.id === targetId) cv.classList.add('active');
          else cv.classList.remove('active');
        });

        // Load tab statistics
        if (targetId === 'db-overview') {
          loadOverviewData();
        } else if (targetId === 'db-ind-verification') {
          loadUserModeration('industry', 'industries-moderation-table');
        } else if (targetId === 'db-rec-verification') {
          loadUserModeration('recycler', 'recyclers-moderation-table');
        } else if (targetId === 'db-listings') {
          loadListingsLogs();
        } else if (targetId === 'db-bids') {
          loadBidsLogs();
        } else if (targetId === 'db-analytics') {
          loadAnalyticsCharts();
        }
      });
    });

    // Logout trigger
    const logoutBtn = document.querySelector('.admin-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await dbService.logoutUser();
        window.dispatchEvent(new CustomEvent('wb-auth-changed'));
        window.location.hash = '#home';
      });
    }

    // --- TAB LOADERS IMPLEMENTATIONS ---

    async function loadOverviewData() {
      try {
        const users = await dbService.getAllUsers();
        const listings = await dbService.getListings();
        
        // Sum total bids
        const allBids = [];
        await Promise.all(listings.map(async (l) => {
          const bids = await dbService.getBidsForListing(l.id);
          bids.forEach(b => allBids.push(b));
        }));

        const totalUsers = users.length;
        const totalListings = listings.length;
        const totalBids = allBids.length;

        // Sum tonnages
        let totalTons = 0;
        listings.forEach(l => {
          totalTons += parseFloat(l.quantity) || 0;
        });

        // Bind KPIs
        document.getElementById('kpi-total-users').textContent = totalUsers;
        document.getElementById('kpi-total-listings').textContent = totalListings;
        document.getElementById('kpi-total-bids').textContent = totalBids;
        document.getElementById('kpi-total-recycled').textContent = `${Math.round(totalTons)} Tons`;

        // Load users pending verification
        const tableBody = document.querySelector('#overview-pending-users-table tbody');
        if (!tableBody) return;

        const pendingUsers = users.filter(u => u.status === 'pending_verification' || u.status === 'pending');

        if (pendingUsers.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align: center; padding: 2.5rem;">All registered corporate users have approved status.</td>
            </tr>
          `;
          return;
        }

        tableBody.innerHTML = pendingUsers.map(u => {
          const roleLabel = u.role === 'industry' ? 'Industry Generator' : 'Recycling Agency';
          return `
            <tr>
              <td><strong>${escapeHtml(u.name)}</strong></td>
              <td>${escapeHtml(u.email)}</td>
              <td><span class="listing-tag" style="background-color: var(--primary-light); color: var(--primary); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.725rem; font-weight:700;">${roleLabel}</span></td>
              <td><span class="badge badge-pending">${u.status}</span></td>
              <td>
                <div style="display: flex; gap: 0.4rem;">
                  <button class="btn btn-primary btn-sm quick-approve-user-btn" data-id="${u.uid}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;"><i class="fas fa-check"></i></button>
                  <button class="btn btn-secondary btn-sm quick-reject-user-btn" data-id="${u.uid}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; border-color:#ef4444; color:#ef4444;"><i class="fas fa-times"></i></button>
                </div>
              </td>
            </tr>
          `;
        }).join('');

        // Attach Quick approval listeners
        tableBody.querySelectorAll('.quick-approve-user-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const uid = btn.getAttribute('data-id');
            await handleVerifyUser(uid, true);
            await loadOverviewData();
          });
        });

        tableBody.querySelectorAll('.quick-reject-user-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const uid = btn.getAttribute('data-id');
            await handleVerifyUser(uid, false);
            await loadOverviewData();
          });
        });

      } catch (err) {
        console.error("Error loading admin overview metrics:", err);
      }
    }

    async function loadUserModeration(roleType, tableId) {
      const tableBody = document.querySelector(`#${tableId} tbody`);
      if (!tableBody) return;

      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem;">Refreshing user list...</td>
        </tr>
      `;

      try {
        const users = await dbService.getAllUsers();
        const filteredUsers = users.filter(u => u.role === roleType);

        if (filteredUsers.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 3rem;">No registered corporate accounts of this type.</td>
            </tr>
          `;
          return;
        }

        tableBody.innerHTML = filteredUsers.map(u => {
          let statusClass = 'badge-pending';
          if (u.status === 'approved') statusClass = 'badge-accepted';
          else if (u.status === 'rejected') statusClass = 'badge-rejected';
          else if (u.status === 'paused' || u.status === 'suspended') statusClass = 'badge-pending';
          
          let actionsHtml = '';
          if (u.status === 'pending' || u.status === 'pending_verification') {
            actionsHtml = `
              <button class="btn btn-primary btn-sm status-action-btn" data-id="${u.uid}" data-status="approved" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: var(--primary);"><i class="fas fa-check"></i> Approve</button>
              <button class="btn btn-secondary btn-sm status-action-btn" data-id="${u.uid}" data-status="rejected" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-color:#ef4444; color:#ef4444; background:transparent;"><i class="fas fa-times"></i> Reject</button>
            `;
          } else if (u.status === 'approved') {
            actionsHtml = `
              <button class="btn btn-secondary btn-sm status-action-btn" data-id="${u.uid}" data-status="paused" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-color: #f59e0b; color: #f59e0b; background: transparent;"><i class="fas fa-pause"></i> Pause</button>
            `;
          } else if (u.status === 'paused' || u.status === 'suspended') {
            actionsHtml = `
              <button class="btn btn-primary btn-sm status-action-btn" data-id="${u.uid}" data-status="approved" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: var(--primary);"><i class="fas fa-play"></i> Resume</button>
            `;
          } else {
            actionsHtml = `
              <button class="btn btn-primary btn-sm status-action-btn" data-id="${u.uid}" data-status="approved" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: var(--primary);"><i class="fas fa-check"></i> Restore & Approve</button>
            `;
          }

          const displayStatus = u.status === 'paused' ? 'paused' : u.status;

          return `
            <tr>
              <td>
                <strong style="font-size: 1.05rem; color: var(--neutral-dark);">${escapeHtml(u.name)}</strong>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.15rem; font-weight: 600;">GSTIN: ${escapeHtml(u.gstin || 'Not Configured')}</div>
              </td>
              <td>
                <div>Email: ${escapeHtml(u.email)}</div>
                <div style="margin-top: 0.15rem;">Phone: ${escapeHtml(u.phone || 'N/A')}</div>
                ${u.website ? `<div style="margin-top: 0.25rem;"><a href="${escapeHtml(u.website)}" target="_blank" style="color: var(--primary); text-decoration: none; font-size: 0.85rem; font-weight: 700;"><i class="fas fa-globe"></i> Visit Website</a></div>` : ''}
              </td>
              <td>
                <div>${escapeHtml(u.address || 'N/A')}</div>
                <div style="font-size: 0.8rem; color: #64748b; margin-top: 0.15rem;">PIN: ${escapeHtml(u.pincode || 'N/A')}</div>
              </td>
              <td><span class="badge ${statusClass}">${displayStatus}</span></td>
              <td>
                <div style="display: flex; gap: 0.5rem;">
                  ${actionsHtml}
                </div>
              </td>
            </tr>
          `;
        }).join('');

        // Attach Click handlers
        tableBody.querySelectorAll('.status-action-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const uid = btn.getAttribute('data-id');
            const targetStatus = btn.getAttribute('data-status');
            await handleUpdateUserStatus(uid, targetStatus);
            await loadUserModeration(roleType, tableId);
          });
        });

      } catch (err) {
        console.error("Error loading user moderation tables:", err);
      }
    }

    async function handleUpdateUserStatus(uid, status) {
      setLoading(true);
      try {
        await dbService.setUserStatus(uid, status);
        let msg = "User account status updated.";
        if (status === 'approved') msg = "User account approved/resumed successfully.";
        else if (status === 'paused') msg = "User account paused/suspended successfully.";
        else if (status === 'rejected') msg = "User account registration rejected.";
        showToast(msg, "success");
      } catch (err) {
        showToast(err.message || "Failed to update user status.", "error");
      } finally {
        setLoading(false);
      }
    }

    async function handleVerifyUser(uid, approve) {
      setLoading(true);
      try {
        await dbService.verifyUser(uid, approve);
        showToast(approve ? "Company account approved successfully." : "Company account verification rejected.", "success");
      } catch (err) {
        showToast(err.message || "Failed to process user verification.", "error");
      } finally {
        setLoading(false);
      }
    }

    async function loadListingsLogs() {
      const tableBody = document.querySelector('#admin-listings-table tbody');
      if (!tableBody) return;

      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem;">Refreshing listings logs...</td>
        </tr>
      `;

      try {
        const listings = await dbService.getListings();

        if (listings.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 3rem;">No industrial listings found.</td>
            </tr>
          `;
          return;
        }

        tableBody.innerHTML = listings.map(l => {
          const date = new Date(l.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          const statusClass = l.status === 'accepted' ? 'badge-accepted' : 'badge-active';
          const statusLabel = l.status === 'accepted' ? 'Closed' : 'Active';

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
              <td>${escapeHtml(l.industryName)}</td>
              <td><span class="listing-tag" style="background-color: var(--primary-light); color: var(--primary); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.725rem; font-weight:700;">${l.category}</span></td>
              <td>${escapeHtml(l.quantity)}</td>
              <td>${date}</td>
              <td><span class="badge ${statusClass}">${statusLabel}</span></td>
              <td>
                ${
                  l.status === 'active'
                  ? `<button class="btn btn-secondary btn-sm close-listing-btn" data-id="${l.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-color: #ea580c; color:#ea580c;"><i class="fas fa-times-circle"></i> Close</button>`
                  : `<span style="font-size: 0.8rem; color:#94a3b8; font-style:italic;">No Actions</span>`
                }
              </td>
            </tr>
          `;
        }).join('');

        // Attach close listing listeners
        tableBody.querySelectorAll('.close-listing-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            setLoading(true);
            try {
              await dbService.closeListing(id);
              showToast("Waste listing closed/accepted successfully.", "success");
              await loadListingsLogs();
            } catch (err) {
              showToast(err.message || "Failed to close listing.", "error");
            } finally {
              setLoading(false);
            }
          });
        });

      } catch (err) {
        console.error("Error loading listings log table:", err);
      }
    }

    async function loadBidsLogs() {
      const tableBody = document.querySelector('#admin-bids-table tbody');
      if (!tableBody) return;

      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem;">Refreshing bids log table...</td>
        </tr>
      `;

      try {
        const listings = await dbService.getListings();
        const allBids = [];

        await Promise.all(listings.map(async (l) => {
          const bids = await dbService.getBidsForListing(l.id);
          bids.forEach(b => {
            allBids.push({ ...b, listingTitle: l.title });
          });
        }));

        if (allBids.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 3rem;">No bids placed on any listings.</td>
            </tr>
          `;
          return;
        }

        const sortedBids = allBids.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        tableBody.innerHTML = sortedBids.map(b => {
          const statusClass = b.status === 'accepted' ? 'badge-accepted' : b.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
          
          return `
            <tr>
              <td><span style="font-size: 0.8rem; color:#94a3b8; font-weight:700;">${b.id}</span></td>
              <td><strong>${escapeHtml(b.listingTitle)}</strong></td>
              <td>${escapeHtml(b.recyclerName)}</td>
              <td><strong style="color: var(--primary);">₹${b.bidAmount.toLocaleString()}</strong></td>
              <td><div style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(b.message)}">${escapeHtml(b.message)}</div></td>
              <td><span class="badge ${statusClass}">${b.status}</span></td>
            </tr>
          `;
        }).join('');

      } catch (err) {
        console.error("Error loading bids logs:", err);
      }
    }

    async function loadAnalyticsCharts() {
      try {
        const users = await dbService.getAllUsers();
        const listings = await dbService.getListings();

        // 1. Group users by Role
        const industries = users.filter(u => u.role === 'industry').length;
        const recyclers = users.filter(u => u.role === 'recycler').length;

        const usersCanvas = document.getElementById('adminUsersChart');
        if (usersCanvas) {
          const ctx = usersCanvas.getContext('2d');
          if (usersChartInstance) usersChartInstance.destroy();

          if (users.length === 0) {
            ctx.clearRect(0,0, usersCanvas.width, usersCanvas.height);
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("No user ratios data available.", usersCanvas.width/2, usersCanvas.height/2);
          } else {
            usersChartInstance = new window.Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: ['Industries', 'Recycling Agencies'],
                datasets: [{
                  data: [industries, recyclers],
                  backgroundColor: ['#15803d', '#ea580c'],
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

        // 2. Aggregate quantity in tons listed per Category
        const categoryTons = {};
        listings.forEach(l => {
          const tons = parseFloat(l.quantity) || 0;
          categoryTons[l.category] = (categoryTons[l.category] || 0) + tons;
        });

        const categories = Object.keys(categoryTons);
        const values = Object.values(categoryTons).map(v => Math.round(v * 10) / 10);

        const catCanvas = document.getElementById('adminCategoryChart');
        if (catCanvas) {
          const ctx = catCanvas.getContext('2d');
          if (categoryChartInstance) categoryChartInstance.destroy();

          if (categories.length === 0) {
            ctx.clearRect(0,0, catCanvas.width, catCanvas.height);
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("No listings to plot volume distribution.", catCanvas.width/2, catCanvas.height/2);
          } else {
            categoryChartInstance = new window.Chart(ctx, {
              type: 'bar',
              data: {
                labels: categories,
                datasets: [{
                  label: 'Listed Tonnages (Tons)',
                  data: values,
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
        console.error("Error drawing admin charts:", err);
      }
    }

    // Toast notifications helper
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

    // Initial load
    await loadOverviewData();
  }
};

export default AdminView;
