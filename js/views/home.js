// home.js - Home View (Public Landing Page)
import { dbService } from '../db.js';

// Helper HTML Escaper (File Scope)
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

export const HomeView = {
  render: async (currentUser) => {
    return `
      <!-- HERO SECTION -->
      <section class="hero" id="home-hero">
        <div class="container hero-grid">
          <div class="hero-content">
            <h1>Connect Industries with <span>Verified Recyclers</span></h1>
            <p>Reduce industrial waste, increase recycling rates, and build trusted B2B circular partnerships through one transparent, secure, and compliant bidding platform.</p>
            <div class="hero-buttons">
              <a href="#register" class="btn btn-primary"><i class="fas fa-user-plus"></i> Register Company</a>
              <a href="#login" class="btn btn-secondary"><i class="fas fa-sign-in-alt"></i> Login</a>
            </div>
            <div class="hero-benefits">
              <div class="benefit-item">
                <i class="fas fa-check-circle"></i>
                <div>Verified Businesses</div>
              </div>
              <div class="benefit-item">
                <i class="fas fa-shield-alt"></i>
                <div>Secure Platform</div>
              </div>
              <div class="benefit-item">
                <i class="fas fa-seedling"></i>
                <div>Sustainable Future</div>
              </div>
            </div>
          </div>
          <div class="hero-image-container">
            <img src="./assets/hero_illustration.png" alt="WasteBridge Eco Factory" class="hero-image">
          </div>
        </div>
      </section>

      <!-- STATS STRIP -->
      <section class="stats-strip">
        <div class="container stats-grid">
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-industry"></i></div>
            <div>
              <div class="stat-number" id="stat-industries">120+</div>
              <div class="stat-label">Industries</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-recycle"></i></div>
            <div>
              <div class="stat-number" id="stat-recyclers">95</div>
              <div class="stat-label">Recyclers</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-weight-hanging"></i></div>
            <div>
              <div class="stat-number" id="stat-waste">15K+ Tons</div>
              <div class="stat-label">Waste Recycled</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-cloud-sun"></i></div>
            <div>
              <div class="stat-number" id="stat-co2">480+ Tons</div>
              <div class="stat-label">CO2 Saved</div>
            </div>
          </div>
        </div>
      </section>


      <!-- HOW IT WORKS -->
      <section class="how-it-works" id="about">
        <div class="container">
          <div class="section-header">
            <span class="tag">Process</span>
            <h2>How WasteBridge Works</h2>
            <p>A simple, compliant, and transparent workflow designed for industrial-scale waste transactions.</p>
          </div>
          
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">01</div>
              <div class="step-icon"><i class="fas fa-user-shield"></i></div>
              <h3>Create Verified Account</h3>
              <p>Register your company and upload your business licenses and environmental permits. Our compliance team verifies your business credentials within 24 hours.</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">02</div>
              <div class="step-icon"><i class="fas fa-clipboard-list"></i></div>
              <h3>List Industrial Waste</h3>
              <p>Post your recyclable waste with quantities, types, pictures, purity details, packaging specifications, and pickup location coordinates.</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">03</div>
              <div class="step-icon"><i class="fas fa-handshake"></i></div>
              <h3>Connect & Transact</h3>
              <p>Browse listings or receive competitive bids from verified recyclers. Accept the best offer, sign contracts, and securely coordinate pickup schedules.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CATEGORIES -->
      <section class="categories" id="features">
        <div class="container">
          <div class="section-header">
            <span class="tag">Categories</span>
            <h2>Explore Waste Categories</h2>
            <p>Click on any waste category to instantly filter the public listings below.</p>
          </div>
          
          <div class="categories-grid">
            <div class="category-card" data-category="Metal">
              <div class="category-icon"><i class="fas fa-cog"></i></div>
              <h3>Metal</h3>
              <span>220+ Listings</span>
            </div>
            <div class="category-card" data-category="Plastic">
              <div class="category-icon"><i class="fas fa-prescription-bottle"></i></div>
              <h3>Plastic</h3>
              <span>450+ Listings</span>
            </div>
            <div class="category-card" data-category="Paper">
              <div class="category-icon"><i class="fas fa-file-alt"></i></div>
              <h3>Paper</h3>
              <span>290+ Listings</span>
            </div>
            <div class="category-card" data-category="Glass">
              <div class="category-icon"><i class="fas fa-wine-bottle"></i></div>
              <h3>Glass</h3>
              <span>190+ Listings</span>
            </div>
            <div class="category-card" data-category="Rubber">
              <div class="category-icon"><i class="fas fa-compact-disc"></i></div>
              <h3>Rubber</h3>
              <span>120+ Listings</span>
            </div>
            <div class="category-card" data-category="Electronic Waste">
              <div class="category-icon"><i class="fas fa-laptop"></i></div>
              <h3>Electronic</h3>
              <span>210+ Listings</span>
            </div>
            <div class="category-card" data-category="Textile">
              <div class="category-icon"><i class="fas fa-tshirt"></i></div>
              <h3>Textile</h3>
              <span>180+ Listings</span>
            </div>
            <div class="category-card" data-category="Chemical">
              <div class="category-icon"><i class="fas fa-flask"></i></div>
              <h3>Chemical</h3>
              <span>130+ Listings</span>
            </div>
            <div class="category-card" data-category="Organic">
              <div class="category-icon"><i class="fas fa-leaf"></i></div>
              <h3>Organic</h3>
              <span>160+ Listings</span>
            </div>
            <div class="category-card" data-category="Wood">
              <div class="category-icon"><i class="fas fa-tree"></i></div>
              <h3>Wood</h3>
              <span>110+ Listings</span>
            </div>
          </div>
        </div>
      </section>

      <!-- WHY CHOOSE US -->
      <section class="why-choose">
        <div class="container">
          <div class="section-header">
            <span class="tag">Benefits</span>
            <h2>Why Choose WasteBridge?</h2>
            <p>Designed explicitly for professional industrial B2B waste sourcing and transactions.</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-user-check"></i></div>
              <h3>Verified Companies</h3>
              <p>Zero spam. We vet and verify all legal business entities, environmental permits, and tax compliance registrations before granting platform access.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-bolt"></i></div>
              <h3>Real-time Bidding</h3>
              <p>Receive notifications immediately when a recycler bids on your waste, allowing quick decision-making and seamless negotiations.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
              <h3>Secure Platform</h3>
              <p>All sensitive documents, contract templates, and company profiles are guarded with robust role-based access permissions.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
              <h3>Analytics Dashboard</h3>
              <p>Detailed dashboards displaying average bid amounts, recycling volume stats, landfill diversion rates, and history trackers.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-seedling"></i></div>
              <h3>Environmental Tracking</h3>
              <p>Generate downloadable ESG reports showing carbon emission reductions and environmental resource conservation indices.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-tasks"></i></div>
              <h3>Easy Waste Management</h3>
              <p>List multiple streams of waste material, manage bid structures, and log final settlements easily through a clean workspace.</p>
            </div>
          </div>
        </div>
      </section>



      <!-- GREENER TOMORROW STRIP -->
      <section class="greener-tomorrow">
        <div class="container greener-grid">
          <div class="greener-header">
            <h3>Building a Greener Tomorrow</h3>
            <h2>Every ton recycled saves</h2>
          </div>
          <div class="greener-features">
            <div class="greener-item">
              <i class="fas fa-dumpster greener-icon"></i>
              <div>
                <h4>Landfill Space</h4>
                <p>Reduces industrial solid waste accummulation in local municipal landfills.</p>
              </div>
            </div>
            <div class="greener-item">
              <i class="fas fa-charging-station greener-icon"></i>
              <div>
                <h4>Energy Savings</h4>
                <p>Saves processing energy compared to extracting raw materials from nature.</p>
              </div>
            </div>
            <div class="greener-item">
              <i class="fas fa-wind greener-icon"></i>
              <div>
                <h4>Carbon Emissions</h4>
                <p>Significantly lowers manufacturing greenhouse gas carbon emissions.</p>
              </div>
            </div>
            <div class="greener-item">
              <i class="fas fa-water greener-icon"></i>
              <div>
                <h4>Natural Resources</h4>
                <p>Conserves vital water bodies, minerals, forests, and petroleum products.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- BROWSE WASTE (PUBLIC LISTINGS) -->
      <section class="browse-waste" id="listings-anchor">
        <div class="container">
          <div class="section-header">
            <span class="tag">Live Market</span>
            <h2>Browse Public Waste Listings</h2>
            <p>Review real-time waste listings from validated industries. Bidding is restricted to approved recyclers.</p>
          </div>

          <div class="listings-filter-container">
            <div class="search-bar">
              <i class="fas fa-search"></i>
              <input type="text" id="search-input" placeholder="Search by title, location, description...">
            </div>
            <div class="filter-group">
              <select id="category-filter" class="filter-select">
                <option value="all">All Categories</option>
                <option value="metal">Metal</option>
                <option value="plastic">Plastic</option>
                <option value="paper">Paper</option>
                <option value="glass">Glass</option>
                <option value="rubber">Rubber</option>
                <option value="electronic">Electronic Waste</option>
                <option value="textile">Textile</option>
                <option value="chemical">Chemical</option>
                <option value="organic">Organic</option>
                <option value="wood">Wood</option>
              </select>
              
              <select id="status-filter" class="filter-select">
                <option value="active">Active Listings</option>
                <option value="accepted">Accepted Bids (Closed)</option>
              </select>
            </div>
          </div>

          <div class="listings-grid" id="listings-container">
            <!-- Listings injected here dynamically -->
            <div class="listings-empty">
              <i class="fas fa-spinner fa-spin"></i>
              <p>Fetching active waste listings...</p>
            </div>
          </div>
        </div>
      </section>


      <!-- CTA BANNER -->
      <section class="cta-banner">
        <div class="container">
          <div class="cta-box">
            <div class="cta-content">
              <div class="cta-logo">
                <i class="fas fa-recycle"></i> WasteBridge
              </div>
              <h2>Ready to Transform Industrial Waste?</h2>
              <p>Join WasteBridge today and be part of the sustainable industrial future. Free verification for early adopters.</p>
            </div>
            <div class="cta-action">
              <a href="#register" class="btn btn-outline-white">Register Your Company <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer id="contact">
        <div class="container footer-grid">
          <div class="footer-brand">
            <a href="#home" class="logo">
              <i class="fas fa-recycle" style="color: var(--accent);"></i>
              <div>
                WasteBridge
                <span class="logo-subtext">Connecting Waste to Value</span>
              </div>
            </a>
            <p>WasteBridge is a professional B2B compliance-driven platform connecting waste-generating manufacturing plants with licensed, verified recycling companies for a transparent circular economy.</p>
            <div class="social-links">
              <a href="#"><i class="fab fa-facebook-f"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-linkedin-in"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
          
          <div class="footer-column">
            <h3>Quick Links</h3>
            <ul class="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#listings-anchor">Browse Waste</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h3>Support</h3>
            <div class="footer-contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>support@wastebridge.com</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>+91 98765 43210</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
          
          <div class="footer-column footer-newsletter">
            <h3>Newsletter</h3>
            <p>Stay updated with our latest sustainability indices and waste recycling market insights.</p>
            <form class="newsletter-form" id="newsletter-form">
              <input type="email" placeholder="Enter your email" required>
              <button type="submit"><i class="fas fa-paper-plane"></i></button>
            </form>
          </div>
        </div>
        
        <div class="container footer-bottom">
          <div>&copy; 2026 WasteBridge. All rights reserved.</div>
          <div class="footer-bottom-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>
    `;
  },

  init: async (currentUser) => {
    // Dynamic Filter State
    const filterState = {
      search: '',
      category: 'all',
      status: 'active'
    };

    // Update Platform Statistics Strip from Database
    try {
      const stats = await dbService.getPlatformStats();
      const industriesEl = document.getElementById('stat-industries');
      const recyclersEl = document.getElementById('stat-recyclers');
      const wasteEl = document.getElementById('stat-waste');
      const co2El = document.getElementById('stat-co2');
      
      if (industriesEl) industriesEl.textContent = `${stats.industriesCount}+`;
      if (recyclersEl) recyclersEl.textContent = `${stats.recyclersCount}`;
      if (wasteEl) wasteEl.textContent = `${stats.totalWasteRecycled.toLocaleString()}+ Tons`;
      if (co2El) co2El.textContent = `${stats.co2Saved.toLocaleString()}+ Tons`;
    } catch (e) {
      console.error("Error loading stats:", e);
    }

    // Function to render Listings
    const renderListings = async () => {
      const container = document.getElementById('listings-container');
      if (!container) return;

      container.innerHTML = `
        <div class="listings-empty" style="grid-column: span 3;">
          <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
          <p style="margin-top: 10px;">Filtering listings...</p>
        </div>
      `;

      try {
        const listings = await dbService.getListings(filterState);

        if (listings.length === 0) {
          container.innerHTML = `
            <div class="listings-empty" style="grid-column: span 3;">
              <i class="fas fa-box-open" style="font-size: 3rem; color: var(--neutral-border); margin-bottom: 1rem;"></i>
              <h3>No Listings Found</h3>
              <p>We couldn't find any waste listings matching your filters.</p>
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

          // Determine material icons
          let categoryIcon = 'fa-recycle';
          if (l.category === 'Metal') categoryIcon = 'fa-cog';
          else if (l.category === 'Plastic') categoryIcon = 'fa-prescription-bottle';
          else if (l.category === 'Paper') categoryIcon = 'fa-file-alt';
          else if (l.category === 'Glass') categoryIcon = 'fa-wine-bottle';
          else if (l.category === 'Rubber') categoryIcon = 'fa-compact-disc';
          else if (l.category === 'Electronic') categoryIcon = 'fa-laptop';
          else if (l.category === 'Textile') categoryIcon = 'fa-tshirt';
          else if (l.category === 'Chemical') categoryIcon = 'fa-flask';
          else if (l.category === 'Organic') categoryIcon = 'fa-leaf';
          else if (l.category === 'Wood') categoryIcon = 'fa-tree';

          return `
            <div class="listing-card" style="position: relative;">
              ${
                l.imageUrl 
                ? `<div class="listing-image view-card-details" data-id="${l.id}" style="background-image: url('${escapeHtml(l.imageUrl)}'); height: 180px; background-size: cover; background-position: center; border-top-left-radius: var(--radius-md); border-top-right-radius: var(--radius-md); position: relative; cursor: pointer;"></div>`
                : `<div class="listing-image-placeholder view-card-details" data-id="${l.id}" style="cursor: pointer;"><i class="fas ${categoryIcon}"></i></div>`
              }
              <div class="listing-content">
                <div class="listing-header">
                  <span class="listing-tag">${l.category}</span>
                  <span class="listing-date">${formattedDate}</span>
                </div>
                <h3 class="view-card-details" data-id="${l.id}" style="cursor: pointer; margin-bottom: 0.5rem; transition: color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--neutral-dark)'">${escapeHtml(l.title)}</h3>
                <p style="font-size: 0.9rem; color: var(--neutral-body); margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${escapeHtml(l.description)}
                </p>
                <div class="listing-meta">
                  <div class="meta-item">
                    <i class="fas fa-weight"></i>
                    <span><strong>Qty:</strong> ${escapeHtml(l.quantity)}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-gavel"></i>
                    <span><strong>Bids:</strong> ${l.bidsCount || 0}</span>
                  </div>
                </div>
                <div class="listing-footer" style="gap: 0.5rem; flex-wrap: wrap;">
                  <span class="listing-location" style="font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;">
                    <i class="fas fa-map-marker-alt"></i> ${escapeHtml(l.location)}
                  </span>
                  <div style="display: flex; gap: 0.35rem;">
                    <button class="btn btn-secondary btn-sm view-details-btn" data-id="${l.id}" style="padding: 0.4rem 0.65rem; border-color: var(--neutral-border); color: var(--neutral-body); font-size: 0.8rem;"><i class="fas fa-info-circle"></i> Details</button>
                    ${
                      l.status === 'accepted' 
                      ? `<span class="badge badge-accepted" style="padding: 0.4rem 0.65rem; font-size: 0.725rem;"><i class="fas fa-check-circle"></i> Closed</span>` 
                      : `<button class="btn btn-primary btn-sm apply-bid-btn" data-id="${l.id}" style="padding: 0.4rem 0.65rem; font-size: 0.8rem;">Apply Bid</button>`
                    }
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Attach event listeners to Bid buttons
        const bidBtns = container.querySelectorAll('.apply-bid-btn');
        bidBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const listingId = e.target.getAttribute('data-id');
            handleBidClick(listingId, currentUser);
          });
        });

        // Attach event listeners to Details triggers
        const detailsTriggers = container.querySelectorAll('.view-card-details, .view-details-btn');
        detailsTriggers.forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const listingId = trigger.getAttribute('data-id');
            const selectedListing = listings.find(l => l.id === listingId);
            if (selectedListing) {
              openDetailsModal(selectedListing, currentUser);
            }
          });
        });

      } catch (err) {
        console.error("Error fetching listings:", err);
        container.innerHTML = `
          <div class="listings-empty" style="grid-column: span 3;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444;"></i>
            <p style="margin-top: 10px;">Failed to load listings. Please check connection.</p>
          </div>
        `;
      }
    };

    // Bid action handler
    const handleBidClick = (listingId, user) => {
      if (!user) {
        if (window.Toastify) {
          window.Toastify({
            text: "Please sign in to place a bid on this listing.",
            duration: 2500,
            backgroundColor: "linear-gradient(to right, #f59e0b, #d97706)",
            gravity: "top",
            position: "right"
          }).showToast();
        }
        setTimeout(() => {
          window.location.hash = '#login';
        }, 1500);
      } else if (user.role !== 'recycler') {
        if (window.Toastify) {
          window.Toastify({
            text: "Only verified Recyclers can bid on listings.",
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #ef4444, #dc2626)",
            gravity: "top",
            position: "right"
          }).showToast();
        }
      } else if (user.status !== 'approved') {
        if (window.Toastify) {
          window.Toastify({
            text: "Your account is pending verification. Please wait for admin approval.",
            duration: 3500,
            backgroundColor: "linear-gradient(to right, #ef4444, #dc2626)",
            gravity: "top",
            position: "right"
          }).showToast();
        }
      } else {
        // Redirect to recycler view to handle bidding
        window.location.hash = `#recycler?bid=${listingId}`;
      }
    };

    // Set up Input Event Listeners
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterState.search = e.target.value;
        renderListings();
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        filterState.category = e.target.value;
        renderListings();
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        filterState.status = e.target.value;
        renderListings();
      });
    }

    // Category Card Clicks (Filter Bindings)
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        filterState.category = cat;
        if (categoryFilter) categoryFilter.value = cat.toLowerCase();
        
        // Scroll to listings section
        const anchor = document.getElementById('listings-anchor');
        if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
        
        renderListings();
      });
    });


    // Newsletter Submission Handler
    const newsletter = document.getElementById('newsletter-form');
    if (newsletter) {
      newsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletter.querySelector('input').value;
        if (window.Toastify) {
          window.Toastify({
            text: `Successfully subscribed: ${email}`,
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #15803d, #22c55e)",
            gravity: "top",
            position: "right"
          }).showToast();
        }
        newsletter.reset();
      });
    }

    // Initial listings render
    await renderListings();
  }
};

// --- POPUP DETAILS MODAL RENDERER ---
function openDetailsModal(listing, currentUser) {
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
              : `<button id="modal-bid-action" class="btn btn-primary btn-sm" style="padding: 0.5rem 1rem;">Apply Bid</button>`
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

  // Modal action Apply Bid trigger
  const bidBtn = backdrop.querySelector('#modal-bid-action');
  if (bidBtn) {
    bidBtn.addEventListener('click', () => {
      closeModal();
      // Delegate to global click handler
      if (!currentUser) {
        if (window.Toastify) {
          window.Toastify({
            text: "Please sign in to place a bid on this listing.",
            duration: 2500,
            backgroundColor: "linear-gradient(to right, #f59e0b, #d97706)",
            gravity: "top",
            position: "right"
          }).showToast();
        }
        setTimeout(() => {
          window.location.hash = '#login';
        }, 1500);
      } else if (currentUser.role !== 'recycler') {
        if (window.Toastify) {
          window.Toastify({
            text: "Only verified Recyclers can bid on listings.",
            duration: 3000,
            backgroundColor: "linear-gradient(to right, #ef4444, #dc2626)",
            gravity: "top",
            position: "right"
          }).showToast();
        }
      } else if (currentUser.status !== 'approved') {
        if (window.Toastify) {
          window.Toastify({
            text: "Your account is pending verification. Please wait for admin approval.",
            duration: 3500,
            backgroundColor: "linear-gradient(to right, #ef4444, #dc2626)",
            gravity: "top",
            position: "right"
          }).showToast();
        }
      } else {
        window.location.hash = `#recycler?bid=${listing.id}`;
      }
    });
  }
}

export default HomeView;
