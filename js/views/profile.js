// profile.js - Company Profile Settings (Skipped Document Verification)
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

export const ProfileView = {
  render: async (currentUser) => {
    const name = currentUser.name || '';
    const email = currentUser.email || '';
    const role = currentUser.role || '';
    const phone = currentUser.phone || '';
    const address = currentUser.address || '';
    const pincode = currentUser.pincode || '';
    const gstin = currentUser.gstin || '';
    const website = currentUser.website || '';
    
    return `
      <div class="auth-wrapper" style="padding: 120px 2rem 60px 2rem; min-height: 100vh;">
        <div class="auth-card" style="max-width: 600px;">
          <!-- Loading Spinner Overlay -->
          <div class="auth-loading-overlay" id="profile-loader">
            <div class="spinner"></div>
            <p style="font-family: var(--font-body); font-weight: 600; color: var(--primary);">Updating corporate profile...</p>
          </div>
          
          <div class="auth-header" style="text-align: left; margin-bottom: 2rem;">
            <h2 style="font-size: 2rem; display: flex; align-items: center; gap: 0.75rem;">
              <i class="fas fa-id-card" style="color: var(--primary);"></i> Company Profile
            </h2>
            <p style="margin-top: 0.25rem;">Manage your corporate identity and contact details for circular market transactions.</p>
          </div>

          <form id="profile-settings-form">
            <!-- Basic Details Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label for="prof-name">Company Name</label>
                <div class="input-icon-wrapper">
                  <input type="text" id="prof-name" value="${escapeHtml(name)}" required placeholder="Apex Manufacturing Ltd.">
                  <i class="fas fa-building"></i>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label for="prof-role">Corporate Role</label>
                <div class="input-icon-wrapper">
                  <input type="text" id="prof-role" value="${role.toUpperCase()}" disabled style="background-color: var(--neutral-light); cursor: not-allowed; font-weight: 700; color: var(--primary-dark);">
                  <i class="fas fa-user-shield"></i>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="prof-email">Corporate Email Address (Account Identifier)</label>
              <div class="input-icon-wrapper">
                <input type="email" id="prof-email" value="${escapeHtml(email)}" disabled style="background-color: var(--neutral-light); cursor: not-allowed;">
                <i class="fas fa-envelope"></i>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label for="prof-phone">Contact Phone Number</label>
                <div class="input-icon-wrapper">
                  <input type="tel" id="prof-phone" value="${escapeHtml(phone)}" placeholder="+91 98765 43210" required>
                  <i class="fas fa-phone"></i>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label for="prof-gstin">GSTIN / Tax Number</label>
                <div class="input-icon-wrapper">
                  <input type="text" id="prof-gstin" value="${escapeHtml(gstin)}" placeholder="27AAAAA1111A1Z1" required style="text-transform: uppercase;">
                  <i class="fas fa-percent"></i>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
              <div class="form-group" style="margin-bottom: 0;">
                <label for="prof-address">Corporate Address</label>
                <div class="input-icon-wrapper">
                  <input type="text" id="prof-address" value="${escapeHtml(address)}" placeholder="e.g., Plot No. 12, Industrial Area" required>
                  <i class="fas fa-map-marker-alt"></i>
                </div>
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label for="prof-pincode">Pin Code</label>
                <div class="input-icon-wrapper">
                  <input type="text" id="prof-pincode" value="${escapeHtml(pincode)}" placeholder="400001" pattern="[0-9]{6}" title="6 digit Indian Pin code" required>
                  <i class="fas fa-mail-bulk"></i>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="prof-website">Company Website URL</label>
              <div class="input-icon-wrapper">
                <input type="url" id="prof-website" value="${escapeHtml(website)}" placeholder="https://www.company.com" required>
                <i class="fas fa-globe"></i>
              </div>
            </div>

            <div style="border-top: 1px solid var(--neutral-border); padding-top: 2rem; margin-top: 2.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <a href="#home" class="btn btn-secondary btn-sm" style="padding: 0.75rem 1.5rem;"><i class="fas fa-arrow-left"></i> Home</a>
              <button type="submit" class="btn btn-primary" style="padding: 0.75rem 2rem;">
                Save Changes <i class="fas fa-check-circle"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  init: async (currentUser) => {
    const form = document.getElementById('profile-settings-form');
    const loader = document.getElementById('profile-loader');

    if (!currentUser) {
      window.location.hash = '#login';
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('prof-name').value.trim();
      const phone = document.getElementById('prof-phone').value.trim();
      const address = document.getElementById('prof-address').value.trim();
      const pincode = document.getElementById('prof-pincode').value.trim();
      const gstin = document.getElementById('prof-gstin').value.trim().toUpperCase();
      const website = document.getElementById('prof-website').value.trim();

      if (name.length < 3) {
        showToast("Company name must be at least 3 characters.", "error");
        return;
      }

      if (phone.length < 8) {
        showToast("Please enter a valid phone number.", "error");
        return;
      }

      if (address.length < 5) {
        showToast("Please enter a valid address.", "error");
        return;
      }

      if (!/^[0-9]{6}$/.test(pincode)) {
        showToast("Please enter a valid 6-digit pin code.", "error");
        return;
      }

      if (gstin.length !== 15) {
        showToast("GSTIN number must be exactly 15 characters long.", "error");
        return;
      }

      setLoading(true);

      try {
        const updateData = {
          name,
          phone,
          address,
          pincode,
          gstin,
          website,
          // Backwards compatibility for location
          location: `${address}, Pin - ${pincode}`
        };

        await dbService.updateUserProfile(currentUser.uid, updateData);
        showToast("Company profile updated successfully!", "success");

        // Sync header state
        window.dispatchEvent(new CustomEvent('wb-auth-changed'));

        // Redirect to their active portal
        setTimeout(() => {
          if (currentUser.role === 'industry') {
            window.location.hash = '#industry';
          } else {
            window.location.hash = '#recycler';
          }
        }, 1500);
      } catch (err) {
        setLoading(false);
        showToast(err.message || "Failed to update profile settings.", "error");
      }
    });

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
  }
};

export default ProfileView;
