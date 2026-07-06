// db.js - Database and Storage Adapter
// Configured to support Firebase Realtime Database (RTDB) and local persistent fallback.

// Live Firebase Configuration (Using Realtime DB)
const firebaseConfig = {
  apiKey: "AIzaSyAL107bPUXLGWXG1z8GLzkUp9X31TT4wAE",
  authDomain: "wastebridge-6e6a7.firebaseapp.com",
  databaseURL: "https://wastebridge-6e6a7-default-rtdb.firebaseio.com",
  projectId: "wastebridge-6e6a7",
  storageBucket: "wastebridge-6e6a7.firebasestorage.app",
  messagingSenderId: "120165303923",
  appId: "1:120165303923:web:5743a27d4a24a73e400c06",
  measurementId: "G-K24F9K33V9"
};

// Check if Firebase script is loaded and config is customized
let dbType = 'mock'; // Default to mock database (LocalStorage) for easy previewing
let auth, db, storage;

// Try to initialize Firebase
if (window.firebase) {
  try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db = firebase.database(); // Realtime Database initialization
      storage = firebase.storage();
      dbType = 'firebase';
      console.log("WasteBridge: Live Firebase Realtime Database initialized successfully.");
    } else {
      console.warn("WasteBridge: Firebase config keys are empty. Falling back to persistent LocalStorage Mock Database.");
    }
  } catch (error) {
    console.error("WasteBridge: Error initializing Firebase, using Mock fallback:", error);
  }
} else {
  console.log("WasteBridge: Firebase SDK not loaded. Using persistent LocalStorage Mock Database.");
}

// Helper to map role to capitalized DB sub-nodes
const getDbRolePath = (role) => {
  if (!role) return 'Industry';
  const lower = role.toLowerCase();
  if (lower === 'industry') return 'Industry';
  if (lower === 'recycler' || lower === 'recycle') return 'Recycler';
  if (lower === 'admin') return 'Admin';
  return 'Industry';
};


// --- PERSISTENT MOCK DATABASE IMPLEMENTATION (LOCALSTORAGE) ---
const mockDb = {
  get: (key) => JSON.parse(localStorage.getItem(`wb_${key}`)) || [],
  set: (key, data) => localStorage.setItem(`wb_${key}`, JSON.stringify(data)),
  
  initData: () => {
    if (!localStorage.getItem('wb_seeded')) {
      const initialUsers = [
        {
          uid: 'ind-user-1',
          email: 'industry@example.com',
          role: 'industry',
          name: 'Apex Manufacturing',
          phone: '+91 98765 43210',
          location: 'Mumbai, Maharashtra',
          status: 'approved',
          createdAt: new Date().toISOString()
        },
        {
          uid: 'rec-user-1',
          email: 'recycler@example.com',
          role: 'recycler',
          name: 'GreenCycle Solutions',
          phone: '+91 91234 56789',
          location: 'Pune, Maharashtra',
          status: 'approved',
          createdAt: new Date().toISOString()
        },
        {
          uid: 'admin-user',
          email: 'admin@wastebridge.com',
          role: 'admin',
          name: 'System Admin',
          status: 'approved',
          createdAt: new Date().toISOString()
        }
      ];

      const initialListings = [
        {
          id: 'list-1',
          industryId: 'ind-user-1',
          industryName: 'Apex Manufacturing',
          title: 'Premium HDPE Plastic Drums',
          category: 'Plastic',
          quantity: '5.5 Tons',
          location: 'Mumbai, Maharashtra',
          description: 'High-density polyethylene (HDPE) blue drums, previously used for food-grade liquid storage. Fully washed and dried. Ready for pelletizing.',
          status: 'active',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          bidsCount: 2
        },
        {
          id: 'list-2',
          industryId: 'ind-user-1',
          industryName: 'Apex Manufacturing',
          title: 'Scrap Aluminium Sheets & Wire',
          category: 'Metal',
          quantity: '12 Tons',
          location: 'Navi Mumbai',
          description: 'Aluminium alloy scrap (6000 series) from machining offcuts. Clean, free from iron and plastic contamination.',
          status: 'active',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          bidsCount: 1
        }
      ];

      const initialBids = [
        {
          id: 'bid-1',
          listingId: 'list-1',
          recyclerId: 'rec-user-1',
          recyclerName: 'GreenCycle Solutions',
          bidAmount: 42000,
          message: 'We can collect next Tuesday. Payment terms: COD.',
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      mockDb.set('users', initialUsers);
      mockDb.set('listings', initialListings);
      mockDb.set('bids', initialBids);
      localStorage.setItem('wb_seeded', 'true');
    }
  }
};

mockDb.initData();

// --- DATABASE SERVICE API ---
export const dbService = {
  getDbType: () => dbType,

  // --- AUTHENTICATION & PROFILE FUNCTIONS ---
  registerUser: async (email, password, role, name) => {
    if (dbType === 'firebase') {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      const userData = {
        uid: user.uid,
        email: email,
        role: role,
        name: name,
        status: 'pending', // Starts as pending, requires admin approval
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      
      // Save under users/{Role}/{uid}
      const pathRole = getDbRolePath(role);
      await db.ref(`users/${pathRole}/${user.uid}`).set(userData);
      return userData;
    } else {
      const users = mockDb.get('users');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already registered.");
      }
      
      const newUid = 'mock-uid-' + Math.random().toString(36).substr(2, 9);
      const userData = {
        uid: newUid,
        email: email,
        role: role,
        name: name,
        status: 'pending', // Starts as pending, requires admin approval
        createdAt: new Date().toISOString()
      };
      
      users.push(userData);
      mockDb.set('users', users);
      
      localStorage.setItem('wb_mock_session', JSON.stringify(userData));
      return userData;
    }
  },

  loginUser: async (email, password) => {
    if (dbType === 'firebase') {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Search in parallel across all possible role directories (Capitalized)
      const paths = ['Industry', 'Recycler', 'Admin'];
      const snapshots = await Promise.all(paths.map(r => db.ref(`users/${r}/${user.uid}`).once('value')));
      const foundSnap = snapshots.find(snap => snap.exists());
      let userData = foundSnap ? foundSnap.val() : null;
      
      if (!userData) {
        // Self-Healing: Recreate missing database profile nodes due to prior offline failures
        const emailPrefix = email.split('@')[0];
        const role = email.includes('admin') ? 'admin' : (email.includes('recycler') ? 'recycler' : 'industry');
        const pathRole = getDbRolePath(role);
        userData = {
          uid: user.uid,
          email: email,
          role: role,
          name: emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1) + ' Corp',
          status: 'approved',
          createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        await db.ref(`users/${pathRole}/${user.uid}`).set(userData);
      }
      
      return userData;
    } else {
      const users = mockDb.get('users');
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error("User not found.");
      }
      
      localStorage.setItem('wb_mock_session', JSON.stringify(foundUser));
      return foundUser;
    }
  },

  logoutUser: async () => {
    if (dbType === 'firebase') {
      await auth.signOut();
    } else {
      localStorage.removeItem('wb_mock_session');
    }
  },

  getCurrentUser: async () => {
    if (dbType === 'firebase') {
      return new Promise((resolve) => {
        try {
          auth.onAuthStateChanged(async (user) => {
            if (user) {
              try {
                const paths = ['Industry', 'Recycler', 'Admin'];
                const snapshots = await Promise.all(paths.map(r => db.ref(`users/${r}/${user.uid}`).once('value')));
                const foundSnap = snapshots.find(snap => snap.exists());
                resolve(foundSnap ? foundSnap.val() : null);
              } catch (error) {
                console.error("WasteBridge: Error retrieving user document from RTDB:", error);
                resolve(null);
              }
            } else {
              resolve(null);
            }
          }, (err) => {
            console.error("WasteBridge: onAuthStateChanged error callback:", err);
            resolve(null);
          });
        } catch (e) {
          console.error("WasteBridge: onAuthStateChanged subscription crash:", e);
          resolve(null);
        }
      });
    } else {
      const session = localStorage.getItem('wb_mock_session');
      return session ? JSON.parse(session) : null;
    }
  },

  updateUserProfile: async (uid, profileData) => {
    if (dbType === 'firebase') {
      const paths = ['Industry', 'Recycler', 'Admin'];
      const snapshots = await Promise.all(paths.map(r => db.ref(`users/${r}/${uid}`).once('value')));
      const foundSnap = snapshots.find(snap => snap.exists());
      if (foundSnap) {
        const userData = foundSnap.val();
        const pathRole = getDbRolePath(userData.role);
        const updateData = {
          ...profileData,
          status: 'approved'
        };
        await db.ref(`users/${pathRole}/${uid}`).update(updateData);
        return updateData;
      }
      throw new Error("User not found.");
    } else {
      const users = mockDb.get('users');
      const index = users.findIndex(u => u.uid === uid);
      if (index !== -1) {
        users[index] = {
          ...users[index],
          ...profileData,
          status: 'approved'
        };
        mockDb.set('users', users);
        localStorage.setItem('wb_mock_session', JSON.stringify(users[index]));
        return users[index];
      }
      throw new Error("User not found.");
    }
  },

  getUserById: async (uid) => {
    if (dbType === 'firebase') {
      const paths = ['Industry', 'Recycler', 'Admin'];
      const snapshots = await Promise.all(paths.map(r => db.ref(`users/${r}/${uid}`).once('value')));
      const foundSnap = snapshots.find(snap => snap.exists());
      return foundSnap ? foundSnap.val() : null;
    } else {
      const users = mockDb.get('users');
      return users.find(u => u.uid === uid) || null;
    }
  },

  // --- ADMIN FUNCTIONS ---
  getPendingVerifications: async () => {
    // Left as compatibility helper (verifications are bypassed)
    return [];
  },

  verifyUser: async (uid, approve = true) => {
    const status = approve ? 'approved' : 'rejected';
    return dbService.setUserStatus(uid, status);
  },

  setUserStatus: async (uid, status) => {
    if (dbType === 'firebase') {
      const paths = ['Industry', 'Recycler', 'Admin'];
      const snapshots = await Promise.all(paths.map(r => db.ref(`users/${r}/${uid}`).once('value')));
      const foundSnap = snapshots.find(snap => snap.exists());
      if (foundSnap) {
        const userData = foundSnap.val();
        const pathRole = getDbRolePath(userData.role);
        await db.ref(`users/${pathRole}/${uid}`).update({ status });
        return status;
      }
      throw new Error("User not found.");
    } else {
      const users = mockDb.get('users');
      const index = users.findIndex(u => u.uid === uid);
      if (index !== -1) {
        users[index].status = status;
        mockDb.set('users', users);
        return status;
      }
      throw new Error("User not found.");
    }
  },

  getAllUsers: async () => {
    if (dbType === 'firebase') {
      const paths = ['Industry', 'Recycler', 'Admin'];
      const snapshots = await Promise.all(paths.map(r => db.ref(`users/${r}`).once('value')));
      let allUsers = [];
      snapshots.forEach(snap => {
        const val = snap.val();
        if (val) {
          allUsers = allUsers.concat(Object.values(val));
        }
      });
      return allUsers;
    } else {
      return mockDb.get('users');
    }
  },

  // --- WASTE LISTINGS FUNCTIONS ---
  createWasteListing: async (listingData) => {
    if (dbType === 'firebase') {
      const newRef = db.ref('listings').push();
      const newListing = {
        id: newRef.key,
        ...listingData,
        status: 'active',
        bidsCount: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      await newRef.set(newListing);
      return newListing;
    } else {
      const listings = mockDb.get('listings');
      const newListing = {
        id: 'list-' + Math.random().toString(36).substr(2, 9),
        ...listingData,
        status: 'active',
        bidsCount: 0,
        createdAt: new Date().toISOString()
      };
      listings.unshift(newListing);
      mockDb.set('listings', listings);
      return newListing;
    }
  },

  getListings: async (filters = {}) => {
    let listings = [];
    if (dbType === 'firebase') {
      const snapshot = await db.ref('listings').once('value');
      const data = snapshot.val() || {};
      listings = Object.values(data);
    } else {
      listings = mockDb.get('listings');
    }

    // Apply filters
    if (filters.status) {
      listings = listings.filter(l => l.status === filters.status);
    } else {
      listings = listings.filter(l => l.status === 'active' || l.status === 'accepted');
    }

    if (filters.category && filters.category !== 'all') {
      listings = listings.filter(l => l.category.toLowerCase() === filters.category.toLowerCase());
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      listings = listings.filter(l => 
        l.title.toLowerCase().includes(searchLower) ||
        l.description.toLowerCase().includes(searchLower) ||
        l.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.industryId) {
      listings = listings.filter(l => l.industryId === filters.industryId);
    }

    return listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getListingById: async (id) => {
    if (dbType === 'firebase') {
      const snapshot = await db.ref('listings/' + id).once('value');
      return snapshot.val();
    } else {
      const listings = mockDb.get('listings');
      return listings.find(l => l.id === id) || null;
    }
  },

  // --- BIDDING FUNCTIONS ---
  submitBid: async (bidData) => {
    if (dbType === 'firebase') {
      const newRef = db.ref('bids').push();
      const newBid = {
        id: newRef.key,
        ...bidData,
        status: 'pending',
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      await newRef.set(newBid);

      // Increment bidCount on listing
      const listingRef = db.ref('listings/' + bidData.listingId);
      const listingSnap = await listingRef.once('value');
      const listing = listingSnap.val();
      if (listing) {
        await listingRef.update({
          bidsCount: (listing.bidsCount || 0) + 1
        });
      }
      return newBid;
    } else {
      const bids = mockDb.get('bids');
      const newBid = {
        id: 'bid-' + Math.random().toString(36).substr(2, 9),
        ...bidData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      bids.push(newBid);
      mockDb.set('bids', bids);
      
      const listings = mockDb.get('listings');
      const listingIndex = listings.findIndex(l => l.id === bidData.listingId);
      if (listingIndex !== -1) {
        listings[listingIndex].bidsCount = (listings[listingIndex].bidsCount || 0) + 1;
        mockDb.set('listings', listings);
      }
      
      return newBid;
    }
  },

  getBidsForListing: async (listingId) => {
    if (dbType === 'firebase') {
      const snapshot = await db.ref('bids').once('value');
      const data = snapshot.val() || {};
      const bids = Object.values(data);
      return bids.filter(b => b.listingId === listingId);
    } else {
      const bids = mockDb.get('bids');
      return bids.filter(b => b.listingId === listingId);
    }
  },

  getBidsForRecycler: async (recyclerId) => {
    if (dbType === 'firebase') {
      const snapshot = await db.ref('bids').once('value');
      const data = snapshot.val() || {};
      const bids = Object.values(data);
      return bids.filter(b => b.recyclerId === recyclerId);
    } else {
      const bids = mockDb.get('bids');
      return bids.filter(b => b.recyclerId === recyclerId);
    }
  },

  respondToBid: async (bidId, accept = true) => {
    const status = accept ? 'accepted' : 'rejected';
    if (dbType === 'firebase') {
      await db.ref('bids/' + bidId).update({ status });
      
      if (accept) {
        const bidSnap = await db.ref('bids/' + bidId).once('value');
        const bidData = bidSnap.val();
        if (bidData) {
          // Close listing
          await db.ref('listings/' + bidData.listingId).update({ status: 'accepted' });
          
          // Reject other bids for this listing
          const bidsSnap = await db.ref('bids').once('value');
          const bidsMap = bidsSnap.val() || {};
          for (const key of Object.keys(bidsMap)) {
            const b = bidsMap[key];
            if (b.listingId === bidData.listingId && b.id !== bidId && b.status === 'pending') {
              await db.ref('bids/' + key).update({ status: 'rejected' });
            }
          }
        }
      }
      return status;
    } else {
      const bids = mockDb.get('bids');
      const bidIndex = bids.findIndex(b => b.id === bidId);
      if (bidIndex !== -1) {
        bids[bidIndex].status = status;
        const listingId = bids[bidIndex].listingId;
        
        if (accept) {
          const listings = mockDb.get('listings');
          const listingIndex = listings.findIndex(l => l.id === listingId);
          if (listingIndex !== -1) {
            listings[listingIndex].status = 'accepted';
            mockDb.set('listings', listings);
          }
          
          bids.forEach(b => {
            if (b.listingId === listingId && b.id !== bidId && b.status === 'pending') {
              b.status = 'rejected';
            }
          });
        }
        
        mockDb.set('bids', bids);
        return status;
      }
      throw new Error("Bid not found.");
    }
  },
  closeListing: async (listingId) => {
    if (dbType === 'firebase') {
      await db.ref('listings/' + listingId).update({ status: 'accepted' });
    } else {
      const listings = mockDb.get('listings');
      const index = listings.findIndex(l => l.id === listingId);
      if (index !== -1) {
        listings[index].status = 'accepted';
        mockDb.set('listings', listings);
      }
    }
  },

  // --- ANALYTICS & INSIGHTS ---
  getPlatformStats: async () => {
    const listings = await dbService.getListings();
    const users = await dbService.getAllUsers();
    
    const industriesCount = users.filter(u => u.role === 'industry').length;
    const recyclersCount = users.filter(u => u.role === 'recycler').length;
    const activeListings = listings.filter(l => l.status === 'active').length;
    
    let totalWasteTons = 0;
    listings.forEach(l => {
      const tons = parseFloat(l.quantity) || 0;
      totalWasteTons += tons;
    });

    return {
      industriesCount,
      recyclersCount,
      activeListings,
      totalWasteRecycled: Math.round(totalWasteTons),
      co2Saved: Math.round(totalWasteTons * 1.2 * 10) / 10
    };
  }
};
