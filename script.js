// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeB7VzIxJaNYagUPoKd-kN5HXmLbS2-Vw",
  authDomain: "videomanager-23d98.firebaseapp.com",
  databaseURL: "https://videomanager-23d98-default-rtdb.firebaseio.com",
  projectId: "videomanager-23d98",
  storageBucket: "videomanager-23d98.firebasestorage.app",
  messagingSenderId: "847321523576",
  appId: "1:847321523576:web:bda3f5026e3e163603548d",
  measurementId: "G-YBSJ1KMPV4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const realtimeDb = firebase.database();

// Initialize EmailJS
emailjs.init("user_your_emailjs_user_id_here");

// Global variables
let currentUser = null;
let currentProduct = null;
let userInfo = {};
let currentOrderId = null;
let products = [];
let categories = [];
let banners = [];
let wishlist = [];
let recentlyViewed = [];
let currentImageIndex = 0;
let currentZoomLevel = 1;

// Amazon/Flipkart Gallery Variables
let fkCurrentSlide = 0;
let fkIsDragging = false;
let fkStartPos = 0;
let fkCurrentTranslate = 0;
let fkPrevTranslate = 0;
let fkAnimationID = null;
let fkImages = [];

// NEW: Order ID Generation Function
function generateOrderId() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(100000 + Math.random() * 900000); 
    return `ORDER-${yyyy}${mm}${dd}-${randomNum}`;
}

// DOM Elements
const menuIcon = document.getElementById('menuIcon');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');
const authModal = document.getElementById('authModal');
const authClose = document.getElementById('authClose');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const switchToLogin = document.getElementById('switchToLogin');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const backToLogin = document.getElementById('backToLogin');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const openLoginTop = document.getElementById('openLoginTop');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const accountDropdown = document.getElementById('accountDropdown');
const accountEmail = document.getElementById('accountEmail');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileUserProfile = document.getElementById('mobileUserProfile');
const mobileUserName = document.getElementById('mobileUserName');
const openMyOrdersTop = document.getElementById('openMyOrdersTop');
const openContactTop = document.getElementById('openContactTop');
const zoomModal = document.getElementById('zoomModal');
const zoomClose = document.getElementById('zoomClose');
const zoomImage = document.getElementById('zoomImage');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const zoomReset = document.getElementById('zoomReset');

// Amazon/Flipkart Gallery Elements
const fkGalleryMain = document.getElementById('fkGalleryMain');
const fkGalleryTrack = document.getElementById('fkGalleryTrack');
const fkGalleryDots = document.getElementById('fkGalleryDots');
const fkGalleryThumbs = document.getElementById('fkGalleryThumbs');
const fkPrevBtn = document.querySelector('.fk-prev-btn');
const fkNextBtn = document.querySelector('.fk-next-btn');
const fkStickyButtons = document.getElementById('fkStickyButtons');
const fkAddToCart = document.getElementById('fkAddToCart');
const fkBuyNow = document.getElementById('fkBuyNow');
const fkZoomModal = document.getElementById('fkZoomModal');
const fkZoomImage = document.getElementById('fkZoomImage');
const fkZoomClose = document.getElementById('fkZoomClose');

// NEW: Error Display Elements
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initApp();
  setupEventListeners();
  loadProductsFromRealtimeDB();
  loadCategoriesFromRealtimeDB();
  loadBannersFromRealtimeDB();
  setupHeroMessages();
  updateStepPills();
  
  // Check authentication state
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      updateUIForUser(user);
      loadUserData(user);
      loadWishlist(user);
      loadRecentlyViewed(user);
      // Close auth modal if open
      authModal.classList.remove('active');
    } else {
      currentUser = null;
      updateUIForGuest();
    }
  });
});

function initApp() {
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) darkModeToggle.checked = true;
  }
  
  // Show home page by default
  showPage('homePage');
}

function setupEventListeners() {
  // Mobile menu
  menuIcon.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Auth modal
  authClose.addEventListener('click', () => authModal.classList.remove('active'));
  openLoginTop.addEventListener('click', showLoginModal);
  mobileLoginBtn.addEventListener('click', showLoginModal);
  
  // Auth tabs
  loginTab.addEventListener('click', () => switchAuthTab('login'));
  signupTab.addEventListener('click', () => switchAuthTab('signup'));
  switchToLogin.addEventListener('click', () => switchAuthTab('login'));
  
  // Auth forms
  loginBtn.addEventListener('click', handleLogin);
  signupBtn.addEventListener('click', handleSignup);
  googleLoginBtn.addEventListener('click', handleGoogleLogin);
  googleSignupBtn.addEventListener('click', handleGoogleLogin);
  
  // Forgot password
  forgotPasswordLink.addEventListener('click', () => {
    loginForm.classList.remove('active');
    forgotPasswordForm.classList.add('active');
  });
  backToLogin.addEventListener('click', () => {
    forgotPasswordForm.classList.remove('active');
    loginForm.classList.add('active');
  });
  resetPasswordBtn.addEventListener('click', handleResetPassword);
  
  // User profile dropdown
  userProfile.addEventListener('click', toggleAccountDropdown);
  document.addEventListener('click', (e) => {
    if (!userProfile.contains(e.target)) {
      accountDropdown.classList.remove('active');
    }
  });
  
  // Navigation
  openMyOrdersTop.addEventListener('click', () => checkAuthAndShowPage('myOrdersPage'));
  openContactTop.addEventListener('click', () => showPage('contactPage'));
  
  // Image zoom
  zoomClose.addEventListener('click', () => zoomModal.classList.remove('active'));
  zoomIn.addEventListener('click', () => adjustZoom(0.2));
  zoomOut.addEventListener('click', () => adjustZoom(-0.2));
  zoomReset.addEventListener('click', resetZoom);
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const homeSearchInput = document.getElementById('homeSearchInput');
  
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  if (homeSearchInput) {
    homeSearchInput.addEventListener('input', handleHomeSearch);
  }
  
  // Order flow buttons - FIXED: Use event delegation for dynamically created elements
  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'backToProducts') {
      showPage('productsPage');
    } else if (e.target && e.target.id === 'toUserInfo') {
      toUserInfo();
    } else if (e.target && e.target.id === 'editOrder') {
      showPage('orderPage');
    } else if (e.target && e.target.id === 'toPayment') {
      toPayment();
    } else if (e.target && e.target.id === 'payBack') {
      showPage('userPage');
    } else if (e.target && e.target.id === 'confirmOrder') {
      confirmOrder();
    } else if (e.target && e.target.id === 'goHome') {
      showPage('homePage');
    } else if (e.target && e.target.id === 'viewOrders') {
      checkAuthAndShowPage('myOrdersPage');
    } else if (e.target && e.target.id === 'saveUserInfo') {
      saveUserInfo();
    }
  });
  
  // Quantity controls
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('qty-minus')) {
      decreaseQuantity();
    } else if (e.target && e.target.classList.contains('qty-plus')) {
      increaseQuantity();
    }
  });
  
  // Size selection
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('size-option')) {
      document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
      e.target.classList.add('selected');
      const sizeValidationError = document.getElementById('sizeValidationError');
      if (sizeValidationError) sizeValidationError.classList.remove('show');
    }
  });
  
  // Price filter
  const applyPriceFilter = document.getElementById('applyPriceFilter');
  const resetPriceFilter = document.getElementById('resetPriceFilter');
  if (applyPriceFilter) {
    applyPriceFilter.addEventListener('click', applyPriceFilter);
  }
  if (resetPriceFilter) {
    resetPriceFilter.addEventListener('click', resetPriceFilter);
  }
  
  // Newsletter
  const subscribeBtn = document.getElementById('subscribeBtn');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', handleNewsletterSubscription);
  }
  
  // Share buttons
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const platform = this.getAttribute('data-platform');
      shareProduct(platform);
    });
  });
  
  // Copy share link
  const copyShareLink = document.getElementById('copyShareLink');
  if (copyShareLink) {
    copyShareLink.addEventListener('click', copyShareLink);
  }
  
  // Product detail buttons
  const detailOrderBtn = document.getElementById('detailOrderBtn');
  const detailWishlistBtn = document.getElementById('detailWishlistBtn');
  if (detailOrderBtn) {
    detailOrderBtn.addEventListener('click', orderProductFromDetail);
  }
  if (detailWishlistBtn) {
    detailWishlistBtn.addEventListener('click', toggleWishlistFromDetail);
  }
  
  // Account page
  const saveProfile = document.getElementById('saveProfile');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  const saveSettings = document.getElementById('saveSettings');
  
  if (saveProfile) {
    saveProfile.addEventListener('click', saveProfile);
  }
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', changePassword);
  }
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', deleteAccount);
  }
  if (saveSettings) {
    saveSettings.addEventListener('click', saveSettings);
  }
  
  // Address page
  const addNewAddress = document.getElementById('addNewAddress');
  const cancelAddAddress = document.getElementById('cancelAddAddress');
  const saveAddress = document.getElementById('saveAddress');
  
  if (addNewAddress) {
    addNewAddress.addEventListener('click', showNewAddressForm);
  }
  if (cancelAddAddress) {
    cancelAddAddress.addEventListener('click', hideNewAddressForm);
  }
  if (saveAddress) {
    saveAddress.addEventListener('click', saveAddress);
  }
  
  // Dark mode toggle in settings
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
      toggleTheme();
    });
  }

  // Amazon/Flipkart Gallery Event Listeners
  if (fkPrevBtn) fkPrevBtn.addEventListener('click', fkPrevSlide);
  if (fkNextBtn) fkNextBtn.addEventListener('click', fkNextSlide);
  if (fkAddToCart) fkAddToCart.addEventListener('click', fkHandleAddToCart);
  if (fkBuyNow) fkBuyNow.addEventListener('click', fkHandleBuyNow);
  if (fkZoomClose) fkZoomClose.addEventListener('click', () => fkZoomModal.classList.remove('active'));

  // Touch events for swipe
  if (fkGalleryMain) {
    fkGalleryMain.addEventListener('touchstart', fkTouchStart);
    fkGalleryMain.addEventListener('touchmove', fkTouchMove);
    fkGalleryMain.addEventListener('touchend', fkTouchEnd);
  }

  // Show sticky buttons when product detail page is active
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const productDetailPage = document.getElementById('productDetailPage');
        if (productDetailPage && productDetailPage.classList.contains('active')) {
          fkStickyButtons.classList.add('show');
        } else {
          fkStickyButtons.classList.remove('show');
        }
      }
    });
  });

  const productDetailPage = document.getElementById('productDetailPage');
  if (productDetailPage) {
    observer.observe(productDetailPage, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

// NEW: Load products from Realtime Database
function loadProductsFromRealtimeDB() {
  realtimeDb.ref('products').once('value')
    .then(snapshot => {
      const productsData = snapshot.val();
      if (productsData) {
        products = Object.keys(productsData).map(key => {
          return {
            id: key,
            ...productsData[key]
          };
        });
        
        renderProducts(products, 'homeProductGrid');
        renderProducts(products, 'productGrid');
        renderProductSlider(products.slice(0, 10), 'productSlider');
      } else {
        // Fallback to sample products if no data in Realtime DB
        loadSampleProducts();
      }
    })
    .catch(error => {
      console.error('Error loading products from Realtime DB:', error);
      loadSampleProducts();
    });
}

// NEW: Load categories from Realtime Database
function loadCategoriesFromRealtimeDB() {
  realtimeDb.ref('categories').once('value')
    .then(snapshot => {
      const categoriesData = snapshot.val();
      if (categoriesData) {
        categories = Object.keys(categoriesData).map(key => {
          return {
            id: key,
            ...categoriesData[key]
          };
        });
        
        renderCategories();
        renderCategoryCircles();
      } else {
        // Fallback to sample categories
        loadSampleCategories();
      }
    })
    .catch(error => {
      console.error('Error loading categories from Realtime DB:', error);
      loadSampleCategories();
    });
}

// NEW: Load banners from Realtime Database
function loadBannersFromRealtimeDB() {
  realtimeDb.ref('banners').once('value')
    .then(snapshot => {
      const bannersData = snapshot.val();
      if (bannersData) {
        banners = Object.keys(bannersData).map(key => {
          return {
            id: key,
            ...bannersData[key]
          };
        });
        
        renderBannerCarousel();
      } else {
        // Fallback to sample banners
        loadSampleBanners();
      }
    })
    .catch(error => {
      console.error('Error loading banners from Realtime DB:', error);
      loadSampleBanners();
    });
}

// NEW: Save order to Realtime Database
async function saveOrderToRealtimeDB(orderData) {
  try {
    await realtimeDb.ref('orders/' + orderData.orderId).set({
      orderId: orderData.orderId,
      userId: orderData.userId,
      username: orderData.username,
      productName: orderData.productName,
      price: orderData.price,
      orderDate: orderData.orderDate,
      status: orderData.status
    });
    return true;
  } catch (error) {
    console.error('Error saving order to Realtime DB:', error);
    return false;
  }
}

// NEW: Load user orders from Realtime Database
function loadUserOrdersFromRealtimeDB(userId) {
  realtimeDb.ref('orders').orderByChild('userId').equalTo(userId).once('value')
    .then(snapshot => {
      const ordersData = snapshot.val();
      const ordersList = document.getElementById('ordersList');
      const noOrders = document.getElementById('noOrders');
      
      if (!ordersData) {
        if (ordersList) ordersList.style.display = 'none';
        if (noOrders) noOrders.style.display = 'block';
        return;
      }
      
      if (ordersList) ordersList.style.display = 'block';
      if (noOrders) noOrders.style.display = 'none';
      if (ordersList) ordersList.innerHTML = '';
      
      Object.keys(ordersData).forEach(orderId => {
        const order = ordersData[orderId];
        const orderCard = createOrderCard(order);
        if (ordersList) ordersList.appendChild(orderCard);
      });
    })
    .catch(error => {
      console.error('Error loading orders from Realtime DB:', error);
    });
}

// Amazon/Flipkart Gallery Functions
function fkInitGallery(product) {
  if (!product || !fkGalleryTrack || !fkGalleryDots || !fkGalleryThumbs) return;

  // Clear existing gallery
  fkGalleryTrack.innerHTML = '';
  fkGalleryDots.innerHTML = '';
  fkGalleryThumbs.innerHTML = '';

  // Get images from product - Firebase path: /products/{productId}/images[]
  fkImages = product.images && product.images.length > 0 ? product.images : [product.image || 'https://via.placeholder.com/400'];

  // Create slides
  fkImages.forEach((image, index) => {
    // Main slide
    const slide = document.createElement('div');
    slide.className = 'fk-gallery-slide';
    slide.style.backgroundImage = `url('${image}')`;
    slide.addEventListener('click', () => fkOpenZoom(image));
    fkGalleryTrack.appendChild(slide);

    // Dot indicator
    const dot = document.createElement('div');
    dot.className = `fk-gallery-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => fkGoToSlide(index));
    fkGalleryDots.appendChild(dot);

    // Thumbnail
    const thumb = document.createElement('div');
    thumb.className = `fk-gallery-thumb ${index === 0 ? 'active' : ''}`;
    thumb.style.backgroundImage = `url('${image}')`;
    thumb.addEventListener('click', () => fkGoToSlide(index));
    fkGalleryThumbs.appendChild(thumb);
  });

  // Reset to first slide
  fkCurrentSlide = 0;
  fkUpdateGallery();
}

function fkUpdateGallery() {
  if (!fkGalleryTrack) return;
  
  fkGalleryTrack.style.transform = `translateX(-${fkCurrentSlide * 100}%)`;
  
  // Update dots
  document.querySelectorAll('.fk-gallery-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === fkCurrentSlide);
  });
  
  // Update thumbnails
  document.querySelectorAll('.fk-gallery-thumb').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === fkCurrentSlide);
  });
}

function fkPrevSlide() {
  if (fkCurrentSlide > 0) {
    fkCurrentSlide--;
    fkUpdateGallery();
  }
}

function fkNextSlide() {
  if (fkCurrentSlide < fkImages.length - 1) {
    fkCurrentSlide++;
    fkUpdateGallery();
  }
}

function fkGoToSlide(index) {
  fkCurrentSlide = index;
  fkUpdateGallery();
}

function fkOpenZoom(imageUrl) {
  if (!fkZoomModal || !fkZoomImage) return;
  
  fkZoomImage.src = imageUrl;
  fkZoomModal.classList.add('active');
}

// Touch swipe functionality
function fkTouchStart(event) {
  fkIsDragging = true;
  fkStartPos = getPositionX(event);
  fkAnimationID = requestAnimationFrame(fkAnimation);
  if (fkGalleryMain) fkGalleryMain.style.cursor = 'grabbing';
}

function fkTouchMove(event) {
  if (fkIsDragging) {
    const currentPosition = getPositionX(event);
    fkCurrentTranslate = fkPrevTranslate + currentPosition - fkStartPos;
  }
}

function fkTouchEnd() {
  cancelAnimationFrame(fkAnimationID);
  fkIsDragging = false;
  const movedBy = fkCurrentTranslate - fkPrevTranslate;

  if (movedBy < -100 && fkCurrentSlide < fkImages.length - 1) {
    fkCurrentSlide += 1;
  }

  if (movedBy > 100 && fkCurrentSlide > 0) {
    fkCurrentSlide -= 1;
  }

  fkSetPositionByIndex();
  if (fkGalleryMain) fkGalleryMain.style.cursor = 'grab';
}

function fkAnimation() {
  if (!fkGalleryTrack) return;
  
  fkGalleryTrack.style.transform = `translateX(${fkCurrentTranslate}px)`;
  if (fkIsDragging) requestAnimationFrame(fkAnimation);
}

function fkSetPositionByIndex() {
  if (!fkGalleryMain) return;
  
  fkCurrentTranslate = fkCurrentSlide * -fkGalleryMain.offsetWidth;
  fkPrevTranslate = fkCurrentTranslate;
  fkUpdateGallery();
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

// Sticky button handlers
function fkHandleAddToCart() {
  if (!currentProduct) return;
  showToast('Product added to cart!', 'success');
  // Add your cart logic here
}

function fkHandleBuyNow() {
  if (!currentProduct) return;
  orderProductFromDetail();
}

// NEW: Improved Authentication Functions with Error Handling
async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Clear previous errors
  if (loginError) loginError.textContent = '';
  
  if (!email || !password) {
    if (loginError) loginError.textContent = 'Please fill in all fields';
    return;
  }
  
  try {
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<div class="loading-spinner"></div> Logging in...';
    
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    showToast('Login successful!', 'success');
    authModal.classList.remove('active');
    
    // Clear form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
  } catch (err) {
    console.error('Login error:', err);
    // Display error in the form, not as popup
    if (loginError) loginError.textContent = err.message;
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
}

async function handleSignup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  // Clear previous errors
  if (signupError) signupError.textContent = '';
  
  if (!name || !email || !password) {
    if (signupError) signupError.textContent = 'Please fill in all fields';
    return;
  }
  
  if (password.length < 6) {
    if (signupError) signupError.textContent = 'Password should be at least 6 characters';
    return;
  }
  
  try {
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<div class="loading-spinner"></div> Creating account...';
    
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Save user profile
    await db.collection('users').doc(user.uid).set({
      name: name,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    showToast('Account created successfully!', 'success');
    authModal.classList.remove('active');
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
  } catch (err) {
    console.error('Signup error:', err);
    // Display error in the form, not as popup
    if (signupError) signupError.textContent = err.message;
  } finally {
    signupBtn.disabled = false;
    signupBtn.textContent = 'Sign Up';
  }
}

async function handleGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      // Create new user document
      await db.collection('users').doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    
    showToast('Login successful!', 'success');
    authModal.classList.remove('active');
  } catch (err) {
    console.error('Google login error:', err);
    // Display error in appropriate form
    if (loginForm.classList.contains('active')) {
      if (loginError) loginError.textContent = err.message;
    } else {
      if (signupError) signupError.textContent = err.message;
    }
  }
}

async function handleResetPassword() {
  const email = document.getElementById('forgotPasswordEmail').value;
  
  if (!email) {
    showToast('Please enter your email address', 'error');
    return;
  }
  
  try {
    resetPasswordBtn.disabled = true;
    resetPasswordBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
    
    await auth.sendPasswordResetEmail(email);
    showToast('Password reset email sent!', 'success');
    forgotPasswordForm.classList.remove('active');
    loginForm.classList.add('active');
    
    // Clear form
    document.getElementById('forgotPasswordEmail').value = '';
  } catch (err) {
    console.error('Password reset error:', err);
    showToast(err.message, 'error');
  } finally {
    resetPasswordBtn.disabled = false;
    resetPasswordBtn.textContent = 'Reset Password';
  }
}

// NEW: Improved Order Placement with Order ID
async function confirmOrder() {
  if (!currentUser) {
    showLoginModal();
    return;
  }
  
  // Generate Order ID
  const orderId = generateOrderId();
  currentOrderId = orderId;
  
  const paymentMethod = document.querySelector('input[name="pay"]:checked').value;
  const quantity = parseInt(document.getElementById('qtySelect').value);
  const size = document.querySelector('.size-option.selected')?.getAttribute('data-value') || 'Not specified';
  
  const orderData = {
    orderId: orderId,
    userId: currentUser.uid,
    username: userInfo.fullName || 'Customer',
    productId: currentProduct.id,
    productName: currentProduct.name,
    price: parseFloat(currentProduct.price.replace('₹', '')) * quantity,
    quantity: quantity,
    size: size,
    paymentMethod: paymentMethod,
    status: 'confirmed',
    orderDate: Date.now(),
    userInfo: userInfo
  };
  
  try {
    // Save to Firestore
    await db.collection('orders').doc(orderId).set(orderData);
    
    // NEW: Also save to Realtime Database
    const realtimeSaved = await saveOrderToRealtimeDB(orderData);
    
    if (!realtimeSaved) {
      console.warn('Order saved to Firestore but not to Realtime Database');
    }
    
    // Update UI with order ID
    document.getElementById('orderIdDisplay').textContent = orderId;
    
    // Show success page
    showPage('successPage');
    
    // Send confirmation email
    sendOrderConfirmationEmail(orderData);
    
    // Clear user info for next order
    userInfo = {};
    
  } catch (error) {
    console.error('Error placing order:', error);
    showToast('Failed to place order. Please try again.', 'error');
  }
}

// Page navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  const pageElement = document.getElementById(pageId);
  if (pageElement) {
    pageElement.classList.add('active');
  }
  
  // Update step pills based on current page
  updateStepPills();
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Load specific page data
  if (pageId === 'accountPage') {
    loadAccountPage();
  } else if (pageId === 'settingsPage') {
    loadSettings();
  } else if (pageId === 'addressPage') {
    loadAddresses();
  } else if (pageId === 'myOrdersPage') {
    loadUserOrdersFromRealtimeDB(currentUser.uid);
  } else if (pageId === 'wishlistPage') {
    renderWishlist();
  }
}

function checkAuthAndShowPage(pageId) {
  if (!currentUser) {
    showLoginModal();
    return;
  }
  showPage(pageId);
}

function showLoginModal() {
  authModal.classList.add('active');
  switchAuthTab('login');
}

function switchAuthTab(tab) {
  // Reset forms
  loginForm.classList.remove('active');
  signupForm.classList.remove('active');
  forgotPasswordForm.classList.remove('active');
  
  // Reset tabs
  loginTab.classList.remove('active');
  signupTab.classList.remove('active');
  
  // Clear errors
  if (loginError) loginError.textContent = '';
  if (signupError) signupError.textContent = '';
  
  if (tab === 'login') {
    loginTab.classList.add('active');
    loginForm.classList.add('active');
  } else {
    signupTab.classList.add('active');
    signupForm.classList.add('active');
  }
}

function logout() {
  auth.signOut().then(() => {
    showToast('Logged out successfully', 'success');
    showPage('homePage');
  }).catch(error => {
    console.error('Logout error:', error);
    showToast('Error logging out', 'error');
  });
}

// Mobile menu functions
function openMenu() {
  mobileMenu.classList.add('active');
  menuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('active');
  menuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Theme functions
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update toggle in settings if it exists
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.checked = newTheme === 'dark';
  }
}

// Toast notification
function showToast(message, type = 'success') {
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = 'toast ' + type;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// User interface updates
function updateUIForUser(user) {
  if (userProfile) userProfile.style.display = 'flex';
  if (openLoginTop) openLoginTop.style.display = 'none';
  if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
  if (mobileUserProfile) mobileUserProfile.style.display = 'flex';
  
  // Load user data to display
  db.collection('users').doc(user.uid).get().then(doc => {
    if (doc.exists) {
      const userData = doc.data();
      if (userName) userName.textContent = userData.name || 'User';
      if (mobileUserName) mobileUserName.textContent = userData.name || 'User';
      if (accountEmail) accountEmail.textContent = user.email;
      
      // Set avatar initial
      const initial = (userData.name || 'U').charAt(0).toUpperCase();
      if (userAvatar) userAvatar.textContent = initial;
      
      // Update account page if open
      if (document.getElementById('accountPageName')) {
        document.getElementById('accountPageName').textContent = userData.name || 'User';
        document.getElementById('accountPageEmail').textContent = user.email;
        document.getElementById('accountPageAvatar').textContent = initial;
        document.getElementById('profileName').value = userData.name || '';
        document.getElementById('profileEmail').value = user.email;
        document.getElementById('profilePhone').value = userData.phone || '';
      }
    }
  });
}

function updateUIForGuest() {
  if (userProfile) userProfile.style.display = 'none';
  if (openLoginTop) openLoginTop.style.display = 'block';
  if (mobileLoginBtn) mobileLoginBtn.style.display = 'flex';
  if (mobileUserProfile) mobileUserProfile.style.display = 'none';
  if (accountDropdown) accountDropdown.classList.remove('active');
}

function toggleAccountDropdown() {
  if (accountDropdown) {
    accountDropdown.classList.toggle('active');
  }
}

// Data loading functions
function loadUserData(user) {
  db.collection('users').doc(user.uid).get().then(doc => {
    if (doc.exists) {
      const userData = doc.data();
      userInfo = { ...userInfo, ...userData };
    }
  }).catch(error => {
    console.error('Error loading user data:', error);
  });
}

async function loadWishlist(user) {
  try {
    const snapshot = await db.collection('wishlist').where('userId', '==', user.uid).get();
    wishlist = snapshot.docs.map(doc => doc.data().productId);
    
    updateWishlistButtons();
    
    // Render wishlist page if open
    if (document.getElementById('wishlistPage')?.classList.contains('active')) {
      renderWishlist();
    }
  } catch (error) {
    console.error('Error loading wishlist:', error);
  }
}

async function loadRecentlyViewed(user) {
  try {
    const snapshot = await db.collection('recentlyViewed').where('userId', '==', user.uid)
      .orderBy('viewedAt', 'desc')
      .limit(10)
      .get();
    
    recentlyViewed = snapshot.docs.map(doc => doc.data().productId);
    
    // Render recently viewed section if there are items
    if (recentlyViewed.length > 0) {
      renderRecentlyViewed();
    }
  } catch (error) {
    console.error('Error loading recently viewed:', error);
  }
}

// Product rendering functions
function renderProducts(productsToRender, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  productsToRender.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card-image" style="background-image: url('${product.image || 'https://via.placeholder.com/200'}')">
      ${product.badge ? `<div class="product-card-badge">${product.badge}</div>` : ''}
      ${product.professional ? `<div class="professional-badge">PRO</div>` : ''}
    </div>
    <div class="product-card-body">
      <div class="product-card-title">${product.name}</div>
      <div class="product-card-rating">
        <div class="product-card-stars">★★★★★</div>
        <div class="product-card-review-count">(${product.reviews || '0'})</div>
      </div>
      <div class="product-card-price">
        <div class="product-card-current-price">${product.price}</div>
        ${product.originalPrice ? `<div class="product-card-original-price">${product.originalPrice}</div>` : ''}
      </div>
      <div class="product-card-actions">
        <button class="action-btn wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-product-id="${product.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${wishlist.includes(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="action-btn share-btn" data-product-id="${product.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const productImage = card.querySelector('.product-card-image');
  if (productImage) {
    productImage.addEventListener('click', () => showProductDetail(product));
  }
  
  const wishlistBtn = card.querySelector('.wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(product.id);
    });
  }
  
  const shareBtn = card.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      shareProduct('default', product);
    });
  }
  
  return card;
}

function renderProductSlider(productsToRender, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  productsToRender.forEach(product => {
    const sliderItem = document.createElement('div');
    sliderItem.className = 'slider-item';
    sliderItem.innerHTML = `
      <div class="slider-item-img" style="background-image: url('${product.image || 'https://via.placeholder.com/200'}')"></div>
      <div class="slider-item-body">
        <div class="slider-item-title">${product.name}</div>
        <div class="slider-item-price">${product.price}</div>
      </div>
    `;
    
    sliderItem.addEventListener('click', () => showProductDetail(product));
    container.appendChild(sliderItem);
  });
}

function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  categories.forEach(category => {
    const categoryPill = document.createElement('div');
    categoryPill.className = 'category-pill';
    categoryPill.textContent = category.name;
    categoryPill.addEventListener('click', () => filterByCategory(category.id));
    container.appendChild(categoryPill);
  });
}

function renderCategoryCircles() {
  const container = document.getElementById('categoryCirclesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  categories.forEach(category => {
    const circle = document.createElement('div');
    circle.className = 'category-circle';
    circle.innerHTML = `
      <div class="category-circle-image" style="background-image: url('${category.image || 'https://via.placeholder.com/70'}')"></div>
      <div class="category-circle-name">${category.name}</div>
    `;
    
    circle.addEventListener('click', () => filterByCategory(category.id));
    container.appendChild(circle);
  });
}

function renderBannerCarousel() {
  const track = document.getElementById('bannerTrack');
  const controls = document.getElementById('bannerControls');
  
  if (!track || !controls) return;
  
  track.innerHTML = '';
  controls.innerHTML = '';
  
  banners.forEach((banner, index) => {
    const slide = document.createElement('div');
    slide.className = 'banner-slide';
    slide.style.backgroundImage = `url('${banner.image || 'https://via.placeholder.com/800x200'}')`;
    track.appendChild(slide);
    
    const dot = document.createElement('div');
    dot.className = `banner-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => setBannerSlide(index));
    controls.appendChild(dot);
  });
  
  // Auto-rotate banners
  setInterval(() => {
    const activeIndex = banners.findIndex((_, index) => {
      const dot = document.querySelector(`.banner-dot:nth-child(${index + 1})`);
      return dot ? dot.classList.contains('active') : false;
    });
    const nextIndex = (activeIndex + 1) % banners.length;
    setBannerSlide(nextIndex);
  }, 5000);
}

function setBannerSlide(index) {
  const track = document.getElementById('bannerTrack');
  const dots = document.querySelectorAll('.banner-dot');
  
  if (!track || !dots.length) return;
  
  track.style.transform = `translateX(-${index * 100}%)`;
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Product detail functions
function showProductDetail(product) {
  currentProduct = product;
  
  // Update product detail page
  document.getElementById('detailTitle').textContent = product.name;
  document.getElementById('detailPrice').textContent = product.price;
  document.getElementById('detailDesc').textContent = product.description || '';
  document.getElementById('detailFullDesc').textContent = product.fullDescription || product.description || 'No description available.';
  document.getElementById('detailSku').textContent = `SKU: ${product.sku || 'N/A'}`;
  
  // Update stock status
  const stockStatus = document.getElementById('detailStockStatus');
  if (stockStatus) {
    if (product.stock === 'in') {
      stockStatus.textContent = 'In Stock';
      stockStatus.className = 'stock-status in-stock';
    } else if (product.stock === 'low') {
      stockStatus.textContent = 'Low Stock';
      stockStatus.className = 'stock-status low-stock';
    } else {
      stockStatus.textContent = 'Out of Stock';
      stockStatus.className = 'stock-status out-of-stock';
    }
  }
  
  // Initialize Amazon/Flipkart gallery
  fkInitGallery(product);
  
  // Update share link
  const productShareLink = document.getElementById('productShareLink');
  if (productShareLink) {
    productShareLink.value = window.location.origin + window.location.pathname + '?product=' + product.id;
  }
  
  // Update wishlist button
  const wishlistBtn = document.getElementById('detailWishlistBtn');
  if (wishlistBtn) {
    if (wishlist.includes(product.id)) {
      wishlistBtn.textContent = 'Remove from Wishlist';
      wishlistBtn.classList.add('active');
    } else {
      wishlistBtn.textContent = 'Add to Wishlist';
      wishlistBtn.classList.remove('active');
    }
  }
  
  // Load similar products
  loadSimilarProducts(product);
  
  // Add to recently viewed if user is logged in
  if (currentUser) {
    addToRecentlyViewed(product.id);
  }
  
  // Show product detail page
  showPage('productDetailPage');
}

function setDetailImage(imageUrl, index) {
  const detailMainImage = document.getElementById('detailMainImage');
  if (detailMainImage) {
    detailMainImage.style.backgroundImage = `url('${imageUrl}')`;
  }
  
  // Update active thumbnail
  document.querySelectorAll('.product-detail-thumbnail').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
  
  currentImageIndex = index;
}

function loadSimilarProducts(product) {
  // For now, just show random products from the same category if available
  const similarProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 10);
  
  renderProductSlider(similarProducts, 'similarProductsSlider');
}

// Order flow functions
function toUserInfo() {
  // Validate size selection
  const selectedSize = document.querySelector('.size-option.selected');
  if (!selectedSize) {
    const sizeValidationError = document.getElementById('sizeValidationError');
    if (sizeValidationError) sizeValidationError.classList.add('show');
    return;
  }
  
  showPage('userPage');
}

function toPayment() {
  // Validate user info
  const fullname = document.getElementById('fullname');
  const mobile = document.getElementById('mobile');
  const pincode = document.getElementById('pincode');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const house = document.getElementById('house');
  
  if (!fullname || !mobile || !pincode || !city || !state || !house) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  if (!fullname.value || !mobile.value || !pincode.value || !city.value || !state.value || !house.value) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  // Save user info
  userInfo = {
    fullName: fullname.value,
    mobile: mobile.value,
    pincode: pincode.value,
    city: city.value,
    state: state.value,
    house: house.value
  };
  
  // Update summary
  const quantity = parseInt(document.getElementById('qtySelect').value);
  const productPrice = parseFloat(currentProduct.price.replace('₹', ''));
  const total = (productPrice * quantity) + 50; // Adding delivery charge
  
  document.getElementById('sumProduct').textContent = currentProduct.name;
  document.getElementById('sumQty').textContent = quantity;
  document.getElementById('sumPrice').textContent = `₹${productPrice * quantity}`;
  document.getElementById('sumTotal').textContent = `₹${total}`;
  
  showPage('paymentPage');
}

// Wishlist functions
async function toggleWishlist(productId) {
  if (!currentUser) {
    showLoginModal();
    return;
  }
  
  try {
    const wishlistRef = db.collection('wishlist').where('userId', '==', currentUser.uid).where('productId', '==', productId);
    const snapshot = await wishlistRef.get();
    
    if (snapshot.empty) {
      // Add to wishlist
      await db.collection('wishlist').add({
        userId: currentUser.uid,
        productId: productId,
        addedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      wishlist.push(productId);
      showToast('Added to wishlist', 'success');
    } else {
      // Remove from wishlist
      await snapshot.docs[0].ref.delete();
      
      wishlist = wishlist.filter(id => id !== productId);
      showToast('Removed from wishlist', 'success');
    }
    
    updateWishlistButtons();
    
    // Update detail page if open
    if (document.getElementById('productDetailPage')?.classList.contains('active') && 
        currentProduct && currentProduct.id === productId) {
      const wishlistBtn = document.getElementById('detailWishlistBtn');
      if (wishlistBtn) {
        if (wishlist.includes(productId)) {
          wishlistBtn.textContent = 'Remove from Wishlist';
          wishlistBtn.classList.add('active');
        } else {
          wishlistBtn.textContent = 'Add to Wishlist';
          wishlistBtn.classList.remove('active');
        }
      }
    }
    
    // Update wishlist page if open
    if (document.getElementById('wishlistPage')?.classList.contains('active')) {
      renderWishlist();
    }
  } catch (error) {
    console.error('Error updating wishlist:', error);
    showToast('Failed to update wishlist', 'error');
  }
}

function toggleWishlistFromDetail() {
  if (!currentProduct) return;
  toggleWishlist(currentProduct.id);
}

function updateWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const productId = btn.getAttribute('data-product-id');
    if (wishlist.includes(productId)) {
      btn.classList.add('active');
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'currentColor');
    } else {
      btn.classList.remove('active');
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'none');
    }
  });
}

function renderWishlist() {
  const container = document.getElementById('wishlistItems');
  const empty = document.getElementById('emptyWishlist');
  
  if (!container || !empty) return;
  
  const wishlistProducts = products.filter(product => wishlist.includes(product.id));
  
  if (wishlistProducts.length === 0) {
    container.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  
  container.style.display = 'block';
  empty.style.display = 'none';
  container.innerHTML = '';
  
  wishlistProducts.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

// Recently viewed functions
async function addToRecentlyViewed(productId) {
  if (!currentUser) return;
  
  try {
    // Check if already in recently viewed
    const existingRef = db.collection('recentlyViewed')
      .where('userId', '==', currentUser.uid)
      .where('productId', '==', productId);
    
    const snapshot = await existingRef.get();
    
    if (!snapshot.empty) {
      // Update timestamp
      await snapshot.docs[0].ref.update({
        viewedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // Add new entry
      await db.collection('recentlyViewed').add({
        userId: currentUser.uid,
        productId: productId,
        viewedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Reload recently viewed
    loadRecentlyViewed(currentUser);
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
  }
}

function renderRecentlyViewed() {
  const section = document.getElementById('recentlyViewedSection');
  const slider = document.getElementById('recentlyViewedSlider');
  
  if (!section || !slider) return;
  
  const recentlyViewedProducts = products.filter(product => 
    recentlyViewed.includes(product.id)
  ).slice(0, 10);
  
  if (recentlyViewedProducts.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  renderProductSlider(recentlyViewedProducts, 'recentlyViewedSlider');
}

// Search functions
function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const query = searchInput.value.toLowerCase();
  filterProducts(query, 'productGrid');
}

function handleHomeSearch() {
  const homeSearchInput = document.getElementById('homeSearchInput');
  if (!homeSearchInput) return;
  
  const query = homeSearchInput.value.toLowerCase();
  const resultsContainer = document.getElementById('homeSearchResults');
  const homeProductGrid = document.getElementById('homeProductGrid');
  
  if (!resultsContainer || !homeProductGrid) return;
  
  if (query.length === 0) {
    resultsContainer.style.display = 'none';
    homeProductGrid.style.display = 'grid';
    return;
  }
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query) ||
    (product.description && product.description.toLowerCase().includes(query))
  );
  
  if (filteredProducts.length === 0) {
    resultsContainer.innerHTML = '<div class="card-panel center">No products found</div>';
  } else {
    renderProducts(filteredProducts, 'homeSearchResults');
  }
  
  resultsContainer.style.display = 'grid';
  homeProductGrid.style.display = 'none';
}

function filterProducts(query, containerId) {
  const filteredProducts = query ? 
    products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    ) : 
    products;
  
  renderProducts(filteredProducts, containerId);
}

function filterByCategory(categoryId) {
  const filteredProducts = products.filter(product => 
    product.category === categoryId
  );
  
  renderProducts(filteredProducts, 'productGrid');
  
  // Update active category pill
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.classList.remove('active');
  });
  
  document.querySelectorAll('.category-pill').forEach(pill => {
    const category = categories.find(c => c.id === categoryId);
    if (category && pill.textContent === category.name) {
      pill.classList.add('active');
    }
  });
}

// Price filter functions
function applyPriceFilter() {
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  
  if (!minPriceInput || !maxPriceInput) return;
  
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || 5000;
  
  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.price.replace('₹', '').replace(',', ''));
    return price >= minPrice && price <= maxPrice;
  });
  
  renderProducts(filteredProducts, 'productGrid');
}

function resetPriceFilter() {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const minPriceSlider = document.getElementById('minPriceSlider');
  const maxPriceSlider = document.getElementById('maxPriceSlider');
  const minPriceValue = document.getElementById('minPriceValue');
  const maxPriceValue = document.getElementById('maxPriceValue');
  
  if (minPrice) minPrice.value = '';
  if (maxPrice) maxPrice.value = '';
  if (minPriceSlider) minPriceSlider.value = 0;
  if (maxPriceSlider) maxPriceSlider.value = 5000;
  if (minPriceValue) minPriceValue.textContent = '₹0';
  if (maxPriceValue) maxPriceValue.textContent = '₹5000';
  
  renderProducts(products, 'productGrid');
}

// Quantity functions
function decreaseQuantity() {
  const qtyInput = document.getElementById('qtySelect');
  if (!qtyInput) return;
  
  let value = parseInt(qtyInput.value);
  if (value > 1) {
    qtyInput.value = value - 1;
  }
}

function increaseQuantity() {
  const qtyInput = document.getElementById('qtySelect');
  if (!qtyInput) return;
  
  let value = parseInt(qtyInput.value);
  if (value < 10) {
    qtyInput.value = value + 1;
  }
}

// Order from product detail
function orderProductFromDetail() {
  if (!currentProduct) return;
  
  // Set current product for order flow
  currentProduct = currentProduct;
  
  // Update order page
  document.getElementById('spTitle').textContent = currentProduct.name;
  document.getElementById('spPrice').textContent = currentProduct.price;
  document.getElementById('spDesc').textContent = currentProduct.description || '';
  document.getElementById('spFullDesc').textContent = currentProduct.fullDescription || currentProduct.description || '';
  
  // Update gallery
  const galleryMain = document.getElementById('galleryMain');
  if (galleryMain) {
    galleryMain.style.backgroundImage = `url('${currentProduct.image || 'https://via.placeholder.com/400'}')`;
  }
  
  // Show order page
  showPage('orderPage');
}

// Sharing functions
function shareProduct(platform, product = null) {
  const shareProduct = product || currentProduct;
  if (!shareProduct) return;
  
  const shareUrl = window.location.origin + window.location.pathname + '?product=' + shareProduct.id;
  const shareText = `Check out ${shareProduct.name} on Buyzo Cart - ${shareProduct.price}`;
  
  let shareLink = '';
  
  switch (platform) {
    case 'facebook':
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      break;
    case 'twitter':
      shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      break;
    case 'whatsapp':
      shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      break;
    default:
      // Fallback to Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: shareProduct.name,
          text: shareText,
          url: shareUrl
        });
        return;
      }
      break;
  }
  
  if (shareLink) {
    window.open(shareLink, '_blank');
  }
}

function copyShareLink() {
  const shareLink = document.getElementById('productShareLink');
  if (!shareLink) return;
  
  shareLink.select();
  document.execCommand('copy');
  showToast('Link copied to clipboard', 'success');
}

// Image zoom functions
function openImageZoom() {
  if (!currentProduct) return;
  
  const imageUrl = currentProduct.images && currentProduct.images[currentImageIndex] ? 
    currentProduct.images[currentImageIndex] : currentProduct.image;
  
  if (!zoomImage) return;
  
  zoomImage.src = imageUrl;
  zoomModal.classList.add('active');
  resetZoom();
}

function adjustZoom(delta) {
  currentZoomLevel += delta;
  currentZoomLevel = Math.max(0.5, Math.min(3, currentZoomLevel));
  if (zoomImage) {
    zoomImage.style.transform = `scale(${currentZoomLevel})`;
  }
}

function resetZoom() {
  currentZoomLevel = 1;
  if (zoomImage) {
    zoomImage.style.transform = 'scale(1)';
  }
}

// Newsletter subscription
function handleNewsletterSubscription() {
  const newsletterEmail = document.getElementById('newsletterEmail');
  if (!newsletterEmail) return;
  
  const email = newsletterEmail.value;
  
  if (!email) {
    showToast('Please enter your email address', 'error');
    return;
  }
  
  // In a real app, you would save this to your database
  showToast('Thank you for subscribing!', 'success');
  newsletterEmail.value = '';
}

// Account functions
function loadAccountPage() {
  if (!currentUser) return;
  
  db.collection('users').doc(currentUser.uid).get().then(doc => {
    if (doc.exists) {
      const userData = doc.data();
      const accountPageName = document.getElementById('accountPageName');
      const accountPageEmail = document.getElementById('accountPageEmail');
      const accountPageAvatar = document.getElementById('accountPageAvatar');
      const profileName = document.getElementById('profileName');
      const profileEmail = document.getElementById('profileEmail');
      const profilePhone = document.getElementById('profilePhone');
      
      if (accountPageName) accountPageName.textContent = userData.name || 'User';
      if (accountPageEmail) accountPageEmail.textContent = currentUser.email;
      if (accountPageAvatar) accountPageAvatar.textContent = (userData.name || 'U').charAt(0).toUpperCase();
      if (profileName) profileName.value = userData.name || '';
      if (profileEmail) profileEmail.value = currentUser.email;
      if (profilePhone) profilePhone.value = userData.phone || '';
    }
  }).catch(error => {
    console.error('Error loading account page:', error);
  });
}

function saveProfile() {
  const profileName = document.getElementById('profileName');
  const profilePhone = document.getElementById('profilePhone');
  
  if (!currentUser || !profileName || !profilePhone) return;
  
  const name = profileName.value;
  const phone = profilePhone.value;
  
  db.collection('users').doc(currentUser.uid).update({
    name: name,
    phone: phone,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    showToast('Profile updated successfully', 'success');
    // Update UI
    if (userName) userName.textContent = name;
    if (mobileUserName) mobileUserName.textContent = name;
    if (userAvatar) userAvatar.textContent = name.charAt(0).toUpperCase();
  }).catch(error => {
    console.error('Error updating profile:', error);
    showToast('Failed to update profile', 'error');
  });
}

function changePassword() {
  // In a real app, you would show a modal to change password
  showToast('Password change feature coming soon', 'info');
}

function deleteAccount() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // In a real app, you would delete the user account
    showToast('Account deletion feature coming soon', 'info');
  }
}

function loadSettings() {
  if (!currentUser) return;

  db.collection('users').doc(currentUser.uid).get().then(doc => {
    if (doc.exists) {
      const userData = doc.data();
      const settings = userData.settings || {};

      const emailNotifications = document.getElementById('emailNotifications');
      const smsNotifications = document.getElementById('smsNotifications');
      const pushNotifications = document.getElementById('pushNotifications');
      const personalizedRecs = document.getElementById('personalizedRecs');
      const dataSharing = document.getElementById('dataSharing');
      const languageSelect = document.getElementById('languageSelect');
      const currencySelect = document.getElementById('currencySelect');
      const darkModeToggle = document.getElementById('darkModeToggle');

      if (emailNotifications) emailNotifications.checked = settings.emailNotifications || false;
      if (smsNotifications) smsNotifications.checked = settings.smsNotifications || false;
      if (pushNotifications) pushNotifications.checked = settings.pushNotifications || false;
      if (personalizedRecs) personalizedRecs.checked = settings.personalizedRecs || false;
      if (dataSharing) dataSharing.checked = settings.dataSharing || false;
      if (languageSelect) languageSelect.value = settings.language || 'en';
      if (currencySelect) currencySelect.value = settings.currency || 'INR';
      if (darkModeToggle) {
        darkModeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
      }
    }
  }).catch(error => {
    console.error('Error loading settings:', error);
  });
}

function saveSettings() {
  const emailNotifications = document.getElementById('emailNotifications');
  const smsNotifications = document.getElementById('smsNotifications');
  const pushNotifications = document.getElementById('pushNotifications');
  const personalizedRecs = document.getElementById('personalizedRecs');
  const dataSharing = document.getElementById('dataSharing');
  const languageSelect = document.getElementById('languageSelect');
  const currencySelect = document.getElementById('currencySelect');

  if (!currentUser || !emailNotifications || !smsNotifications || !pushNotifications || 
      !personalizedRecs || !dataSharing || !languageSelect || !currencySelect) return;

  const emailNotificationsValue = emailNotifications.checked;
  const smsNotificationsValue = smsNotifications.checked;
  const pushNotificationsValue = pushNotifications.checked;
  const personalizedRecsValue = personalizedRecs.checked;
  const dataSharingValue = dataSharing.checked;
  const languageValue = languageSelect.value;
  const currencyValue = currencySelect.value;

  db.collection('users').doc(currentUser.uid).update({
    settings: {
      emailNotifications: emailNotificationsValue,
      smsNotifications: smsNotificationsValue,
      pushNotifications: pushNotificationsValue,
      personalizedRecs: personalizedRecsValue,
      dataSharing: dataSharingValue,
      language: languageValue,
      currency: currencyValue
    },
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    showToast('Settings saved successfully', 'success');
    
    // Apply language change if Hindi is selected
    if (languageValue === 'hi') {
      applyHindiLanguage();
    }
  }).catch(error => {
    console.error('Error saving settings:', error);
    showToast('Failed to save settings', 'error');
  });
}

// Language functions
function applyHindiLanguage() {
  // This is a simplified example - in a real app, you would have a full translation system
  const elementsToTranslate = {
    'homePage h1': 'बुयज़ो कार्ट में आपका स्वागत है',
    'homePage p': 'साफ, तेज चेकआउट। हाथ से चुने गए उत्पाद। पूरी तरह से उत्तरदायी यूआई।',
    'productsPage h2': 'सभी उत्पाद',
    // Add more translations as needed
  };

  // Apply translations
  for (const selector in elementsToTranslate) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = elementsToTranslate[selector];
    }
  }

  showToast('भाषा हिंदी में बदल गई', 'success');
}

// Address functions
function showNewAddressForm() {
  const newAddressForm = document.getElementById('newAddressForm');
  if (newAddressForm) {
    newAddressForm.style.display = 'block';
  }
}

function hideNewAddressForm() {
  const newAddressForm = document.getElementById('newAddressForm');
  if (newAddressForm) {
    newAddressForm.style.display = 'none';
  }
}

function saveAddress() {
  const addressName = document.getElementById('addressName');
  const addressMobile = document.getElementById('addressMobile');
  const addressPincode = document.getElementById('addressPincode');
  const addressCity = document.getElementById('addressCity');
  const addressState = document.getElementById('addressState');
  const addressType = document.getElementById('addressType');
  const addressStreet = document.getElementById('addressStreet');

  if (!currentUser || !addressName || !addressMobile || !addressPincode || 
      !addressCity || !addressState || !addressType || !addressStreet) return;

  const name = addressName.value;
  const mobile = addressMobile.value;
  const pincode = addressPincode.value;
  const city = addressCity.value;
  const state = addressState.value;
  const type = addressType.value;
  const street = addressStreet.value;

  if (!name || !mobile || !pincode || !city || !state || !street) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  db.collection('addresses').add({
    userId: currentUser.uid,
    name: name,
    mobile: mobile,
    pincode: pincode,
    city: city,
    state: state,
    type: type,
    street: street,
    isDefault: false,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    showToast('Address saved successfully', 'success');
    hideNewAddressForm();
    loadAddresses();
  }).catch(error => {
    console.error('Error saving address:', error);
    showToast('Failed to save address', 'error');
  });
}

function loadAddresses() {
  if (!currentUser) return;

  db.collection('addresses')
    .where('userId', '==', currentUser.uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      const container = document.getElementById('savedAddresses');
      if (!container) return;

      container.innerHTML = '';

      if (snapshot.empty) {
        container.innerHTML = '<p style="color:var(--muted);text-align:center">No addresses saved yet</p>';
        return;
      }

      snapshot.docs.forEach(doc => {
        const address = doc.data();
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        addressCard.innerHTML = `
          <div style="font-weight:600">${address.name}</div>
          <div>${address.street}</div>
          <div>${address.city}, ${address.state} - ${address.pincode}</div>
          <div>Mobile: ${address.mobile}</div>
          <div class="address-actions">
            <button class="btn secondary edit-address" data-id="${doc.id}">Edit</button>
            <button class="btn secondary delete-address" data-id="${doc.id}">Delete</button>
          </div>
        `;
        container.appendChild(addressCard);
      });
    })
    .catch(error => {
      console.error('Error loading addresses:', error);
    });
}

// User info save function
function saveUserInfo() {
  const fullname = document.getElementById('fullname');
  const mobile = document.getElementById('mobile');
  const pincode = document.getElementById('pincode');
  const city = document.getElementById('city');
  const state = document.getElementById('state');
  const house = document.getElementById('house');

  if (!fullname || !mobile || !pincode || !city || !state || !house) return;

  if (!fullname.value || !mobile.value || !pincode.value || !city.value || !state.value || !house.value) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  userInfo = {
    fullName: fullname.value,
    mobile: mobile.value,
    pincode: pincode.value,
    city: city.value,
    state: state.value,
    house: house.value
  };

  showToast('Information saved successfully', 'success');
}

// Step pills update
function updateStepPills() {
  const currentPage = document.querySelector('.page.active');
  if (!currentPage) return;

  const currentPageId = currentPage.id;

  document.querySelectorAll('.step-pill').forEach(pill => {
    pill.classList.remove('disabled');
  });

  switch (currentPageId) {
    case 'homePage':
    case 'productsPage':
      document.getElementById('pill-order').classList.add('disabled');
      document.getElementById('pill-user').classList.add('disabled');
      document.getElementById('pill-pay').classList.add('disabled');
      break;
    case 'orderPage':
      document.getElementById('pill-user').classList.add('disabled');
      document.getElementById('pill-pay').classList.add('disabled');
      break;
    case 'userPage':
      document.getElementById('pill-pay').classList.add('disabled');
      break;
  }
}

// Hero messages rotation
function setupHeroMessages() {
  const messages = document.querySelectorAll('#heroMessages span');
  if (messages.length === 0) return;
  
  let currentIndex = 0;
  
  setInterval(() => {
    messages.forEach(msg => msg.classList.remove('active'));
    currentIndex = (currentIndex + 1) % messages.length;
    messages[currentIndex].classList.add('active');
  }, 3000);
}

// Email sending function
function sendOrderConfirmationEmail(orderData) {
  // This would use EmailJS or your email service in a real app
  console.log('Order confirmation email would be sent for:', orderData);
}

// Sample data fallbacks
function loadSampleProducts() {
  products = [
    {
      id: '1',
      name: 'Wireless Bluetooth Earbuds',
      price: '₹1,299',
      originalPrice: '₹2,499',
      image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWFyYnVkc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      description: 'High-quality wireless earbuds with noise cancellation',
      badge: '30% OFF',
      professional: true,
      reviews: '128',
      stock: 'in'
    },
    {
      id: '2',
      name: 'Smart Fitness Band',
      price: '₹2,499',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zml0bmVzcyUyMGJhbmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Track your fitness activities with this smart band',
      badge: 'NEW',
      reviews: '89',
      stock: 'in'
    },
    {
      id: '3',
      name: 'Wireless Gaming Mouse',
      price: '₹1,799',
      originalPrice: '₹2,999',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nJTIwbW91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Precision gaming mouse with RGB lighting',
      badge: '40% OFF',
      reviews: '203',
      stock: 'low'
    },
    {
      id: '4',
      name: 'Portable Bluetooth Speaker',
      price: '₹3,499',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
      description: 'Powerful sound in a compact design',
      reviews: '156',
      stock: 'in'
    }
  ];
  
  renderProducts(products, 'homeProductGrid');
  renderProducts(products, 'productGrid');
  renderProductSlider(products.slice(0, 10), 'productSlider');
}

function loadSampleCategories() {
  categories = [
    {
      id: '1',
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '2',
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '3',
      name: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '4',
      name: 'Beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXR5JTIwcHJvZHVjdHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '5',
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
    }
  ];
  
  renderCategories();
  renderCategoryCircles();
}

function loadSampleBanners() {
  banners = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmclMjBiYW5uZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      title: 'Summer Sale',
      description: 'Up to 50% off on selected items'
    },
    {
      id: '2', 
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmclMjBiYW5uZXIlMjAyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      title: 'New Arrivals',
      description: 'Check out the latest products'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvcHBpbmclMjBiYW5uZXIlMjAzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      title: 'Free Shipping',
      description: 'On orders above ₹999'
    }
  ];
  
  renderBannerCarousel();
}

// Order card creation
function createOrderCard(order) {
  const orderCard = document.createElement('div');
  orderCard.className = 'order-card';
  orderCard.innerHTML = `
    <div class="order-header">
      <div>
        <div class="order-id">${order.orderId}</div>
        <div class="order-date">${new Date(order.orderDate).toLocaleDateString()}</div>
      </div>
      <div class="order-status status-confirmed">${order.status}</div>
    </div>
    <div class="order-details">
      <div class="order-product-image" style="background-image: url('${products.find(p => p.id === order.productId)?.image || 'https://via.placeholder.com/80'}')"></div>
      <div class="order-product-info">
        <div class="order-product-title">${order.productName}</div>
        <div class="order-product-price">${order.price}</div>
        <div class="order-product-meta">Qty: ${order.quantity} | Size: ${order.size}</div>
      </div>
    </div>
  `;
  
  orderCard.addEventListener('click', () => showOrderDetail(order));
  return orderCard;
}

function showOrderDetail(order) {
  const orderDetailContent = document.getElementById('orderDetailContent');
  if (!orderDetailContent) return;
  
  orderDetailContent.innerHTML = `
    <div class="order-detail-section">
      <div class="order-detail-label">Order ID</div>
      <div class="order-detail-value">${order.orderId}</div>
    </div>
    <div class="order-detail-section">
      <div class="order-detail-label">Order Date</div>
      <div class="order-detail-value">${new Date(order.orderDate).toLocaleDateString()}</div>
    </div>
    <div class="order-detail-section">
      <div class="order-detail-label">Status</div>
      <div class="order-detail-value">
        <span class="order-status status-confirmed">${order.status}</span>
      </div>
    </div>
    <div class="order-detail-section">
      <div class="order-detail-label">Product</div>
      <div class="order-detail-product">
        <div class="order-detail-image" style="background-image: url('${products.find(p => p.id === order.productId)?.image || 'https://via.placeholder.com/120'}')"></div>
        <div class="order-detail-product-info">
          <div class="order-detail-value" style="font-weight:600">${order.productName}</div>
          <div class="order-detail-value">${order.price}</div>
          <div class="order-detail-value">Quantity: ${order.quantity}</div>
          <div class="order-detail-value">Size: ${order.size}</div>
        </div>
      </div>
    </div>
    <div class="order-detail-section">
      <div class="order-detail-label">Delivery Address</div>
      <div class="order-detail-value">
        ${order.userInfo?.fullName || ''}<br>
        ${order.userInfo?.house || ''}<br>
        ${order.userInfo?.city || ''}, ${order.userInfo?.state || ''} - ${order.userInfo?.pincode || ''}<br>
        Mobile: ${order.userInfo?.mobile || ''}
      </div>
    </div>
    <div class="order-detail-section">
      <div class="order-detail-label">Payment Method</div>
      <div class="order-detail-value">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</div>
    </div>
  `;
  
  showPage('orderDetailPage');
}

function showMyOrders() {
  if (currentUser) {
    loadUserOrdersFromRealtimeDB(currentUser.uid);
  }
}

// URL parameter handling for shared product links
function checkUrlForProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  if (productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
      showProductDetail(product);
    }
  }
}

// Call this function after products are loaded
setTimeout(checkUrlForProduct, 1000);