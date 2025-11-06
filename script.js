// Firebase configuration
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
      loadProducts();
      loadCategories();
      loadBanners();
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
        document.getElementById('darkModeToggle').checked = true;
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
      
      // Order flow buttons
      document.getElementById('backToProducts')?.addEventListener('click', () => showPage('productsPage'));
      document.getElementById('toUserInfo')?.addEventListener('click', toUserInfo);
      document.getElementById('editOrder')?.addEventListener('click', () => showPage('orderPage'));
      document.getElementById('toPayment')?.addEventListener('click', toPayment);
      document.getElementById('payBack')?.addEventListener('click', () => showPage('userPage'));
      document.getElementById('confirmOrder')?.addEventListener('click', confirmOrder);
      document.getElementById('goHome')?.addEventListener('click', () => showPage('homePage'));
      document.getElementById('viewOrders')?.addEventListener('click', () => checkAuthAndShowPage('myOrdersPage'));
      
      // Quantity controls
      document.querySelector('.qty-minus')?.addEventListener('click', decreaseQuantity);
      document.querySelector('.qty-plus')?.addEventListener('click', increaseQuantity);
      
      // Size selection
      document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
          document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
          this.classList.add('selected');
          document.getElementById('sizeValidationError').classList.remove('show');
        });
      });
      
      // Price filter
      document.getElementById('applyPriceFilter')?.addEventListener('click', applyPriceFilter);
      document.getElementById('resetPriceFilter')?.addEventListener('click', resetPriceFilter);
      
      // Newsletter
      document.getElementById('subscribeBtn')?.addEventListener('click', handleNewsletterSubscription);
      
      // Share buttons
      document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const platform = this.getAttribute('data-platform');
          shareProduct(platform);
        });
      });
      
      // Copy share link
      document.getElementById('copyShareLink')?.addEventListener('click', copyShareLink);
      
      // Product detail buttons
      document.getElementById('detailOrderBtn')?.addEventListener('click', orderProductFromDetail);
      document.getElementById('detailWishlistBtn')?.addEventListener('click', toggleWishlistFromDetail);
      
      // Account page
      document.getElementById('saveProfile')?.addEventListener('click', saveProfile);
      document.getElementById('changePasswordBtn')?.addEventListener('click', changePassword);
      document.getElementById('deleteAccountBtn')?.addEventListener('click', deleteAccount);
      document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
      
      // Address page
      document.getElementById('addNewAddress')?.addEventListener('click', showNewAddressForm);
      document.getElementById('cancelAddAddress')?.addEventListener('click', hideNewAddressForm);
      document.getElementById('saveAddress')?.addEventListener('click', saveAddress);
      
      // Dark mode toggle in settings
      document.getElementById('darkModeToggle')?.addEventListener('change', function() {
        toggleTheme();
      });

      // Amazon/Flipkart Gallery Event Listeners
      fkPrevBtn?.addEventListener('click', fkPrevSlide);
      fkNextBtn?.addEventListener('click', fkNextSlide);
      fkAddToCart?.addEventListener('click', fkHandleAddToCart);
      fkBuyNow?.addEventListener('click', fkHandleBuyNow);
      fkZoomClose?.addEventListener('click', () => fkZoomModal.classList.remove('active'));

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
            if (document.getElementById('productDetailPage').classList.contains('active')) {
              fkStickyButtons.classList.add('show');
            } else {
              fkStickyButtons.classList.remove('show');
            }
          }
        });
      });

      observer.observe(document.getElementById('productDetailPage'), {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Amazon/Flipkart Gallery Functions
    function fkInitGallery(product) {
      if (!product) return;

      // Clear existing gallery
      fkGalleryTrack.innerHTML = '';
      fkGalleryDots.innerHTML = '';
      fkGalleryThumbs.innerHTML = '';

      // Get images from product - Firebase path: /products/{productId}/images[]
      fkImages = product.images && product.images.length > 0 ? product.images : [product.image];

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
      fkZoomImage.src = imageUrl;
      fkZoomModal.classList.add('active');
    }

    // Touch swipe functionality
    function fkTouchStart(event) {
      fkIsDragging = true;
      fkStartPos = getPositionX(event);
      fkAnimationID = requestAnimationFrame(fkAnimation);
      fkGalleryTrack.style.cursor = 'grabbing';
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
      fkGalleryTrack.style.cursor = 'grab';
    }

    function fkAnimation() {
      fkGalleryTrack.style.transform = `translateX(${fkCurrentTranslate}px)`;
      if (fkIsDragging) requestAnimationFrame(fkAnimation);
    }

    function fkSetPositionByIndex() {
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
      loginError.textContent = '';
      
      if (!email || !password) {
        loginError.textContent = 'Please fill in all fields';
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
        loginError.textContent = err.message;
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
      signupError.textContent = '';
      
      if (!name || !email || !password) {
        signupError.textContent = 'Please fill in all fields';
        return;
      }
      
      if (password.length < 6) {
        signupError.textContent = 'Password should be at least 6 characters';
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
        signupError.textContent = err.message;
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
          loginError.textContent = err.message;
        } else {
          signupError.textContent = err.message;
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
        
        // NEW: Also save to Realtime Database as required
        const realtimeOrderData = {
          orderId: orderId,
          userId: currentUser.uid,
          username: userInfo.fullName || 'Customer',
          productName: currentProduct.name,
          price: parseFloat(currentProduct.price.replace('₹', '')) * quantity,
          orderDate: Date.now()
        };
        
        await realtimeDb.ref('orders/' + orderId).set(realtimeOrderData);
        
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
      document.getElementById(pageId).classList.add('active');
      
      // Update step pills based on current page
      updateStepPills();
      
      // Scroll to top
      window.scrollTo(0, 0);
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
      loginError.textContent = '';
      signupError.textContent = '';
      
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
      toast.textContent = message;
      toast.className = 'toast ' + type;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // User interface updates
    function updateUIForUser(user) {
      userProfile.style.display = 'flex';
      openLoginTop.style.display = 'none';
      mobileLoginBtn.style.display = 'none';
      mobileUserProfile.style.display = 'flex';
      
      // Load user data to display
      db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists) {
          const userData = doc.data();
          userName.textContent = userData.name || 'User';
          mobileUserName.textContent = userData.name || 'User';
          accountEmail.textContent = user.email;
          
          // Set avatar initial
          const initial = (userData.name || 'U').charAt(0).toUpperCase();
          userAvatar.textContent = initial;
          
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
      userProfile.style.display = 'none';
      openLoginTop.style.display = 'block';
      mobileLoginBtn.style.display = 'flex';
      mobileUserProfile.style.display = 'none';
      accountDropdown.classList.remove('active');
    }

    function toggleAccountDropdown() {
      accountDropdown.classList.toggle('active');
    }

    // Data loading functions
    async function loadProducts() {
      try {
        const snapshot = await db.collection('products').get();
        products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        renderProducts(products, 'homeProductGrid');
        renderProducts(products, 'productGrid');
        renderProductSlider(products.slice(0, 10), 'productSlider');
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample products if Firebase fails
        loadSampleProducts();
      }
    }

    async function loadCategories() {
      try {
        const snapshot = await db.collection('categories').get();
        categories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        renderCategories();
        renderCategoryCircles();
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to sample categories
        loadSampleCategories();
      }
    }

    async function loadBanners() {
      try {
        const snapshot = await db.collection('banners').get();
        banners = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        renderBannerCarousel();
      } catch (error) {
        console.error('Error loading banners:', error);
        // Fallback to sample banners
        loadSampleBanners();
      }
    }

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
        if (document.getElementById('wishlistPage').classList.contains('active')) {
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
        <div class="product-card-image" style="background-image: url('${product.image}')">
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
      card.querySelector('.product-card-image').addEventListener('click', () => showProductDetail(product));
      card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(product.id);
      });
      card.querySelector('.share-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        shareProduct('default', product);
      });
      
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
          <div class="slider-item-img" style="background-image: url('${product.image}')"></div>
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
          <div class="category-circle-image" style="background-image: url('${category.image}')"></div>
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
        slide.style.backgroundImage = `url('${banner.image}')`;
        track.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.className = `banner-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => setBannerSlide(index));
        controls.appendChild(dot);
      });
      
      // Auto-rotate banners
      setInterval(() => {
        const activeIndex = banners.findIndex((_, index) => 
          document.querySelector(`.banner-dot:nth-child(${index + 1})`).classList.contains('active')
        );
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
      
      // Initialize Amazon/Flipkart gallery
      fkInitGallery(product);
      
      // Update share link
      document.getElementById('productShareLink').value = window.location.origin + window.location.pathname + '?product=' + product.id;
      
      // Update wishlist button
      const wishlistBtn = document.getElementById('detailWishlistBtn');
      if (wishlist.includes(product.id)) {
        wishlistBtn.textContent = 'Remove from Wishlist';
        wishlistBtn.classList.add('active');
      } else {
        wishlistBtn.textContent = 'Add to Wishlist';
        wishlistBtn.classList.remove('active');
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
      document.getElementById('detailMainImage').style.backgroundImage = `url('${imageUrl}')`;
      
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
        document.getElementById('sizeValidationError').classList.add('show');
        return;
      }
      
      showPage('userPage');
    }

    function toPayment() {
      // Validate user info
      const fullname = document.getElementById('fullname').value;
      const mobile = document.getElementById('mobile').value;
      const pincode = document.getElementById('pincode').value;
      const city = document.getElementById('city').value;
      const state = document.getElementById('state').value;
      const house = document.getElementById('house').value;
      
      if (!fullname || !mobile || !pincode || !city || !state || !house) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      // Save user info
      userInfo = {
        fullName: fullname,
        mobile: mobile,
        pincode: pincode,
        city: city,
        state: state,
        house: house
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
        if (document.getElementById('productDetailPage').classList.contains('active') && 
            currentProduct && currentProduct.id === productId) {
          const wishlistBtn = document.getElementById('detailWishlistBtn');
          if (wishlist.includes(productId)) {
            wishlistBtn.textContent = 'Remove from Wishlist';
            wishlistBtn.classList.add('active');
          } else {
            wishlistBtn.textContent = 'Add to Wishlist';
            wishlistBtn.classList.remove('active');
          }
        }
        
        // Update wishlist page if open
        if (document.getElementById('wishlistPage').classList.contains('active')) {
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
          btn.querySelector('svg').setAttribute('fill', 'currentColor');
        } else {
          btn.classList.remove('active');
          btn.querySelector('svg').setAttribute('fill', 'none');
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
      const query = document.getElementById('searchInput').value.toLowerCase();
      filterProducts(query, 'productGrid');
    }

    function handleHomeSearch() {
      const query = document.getElementById('homeSearchInput').value.toLowerCase();
      const resultsContainer = document.getElementById('homeSearchResults');
      
      if (query.length === 0) {
        resultsContainer.style.display = 'none';
        document.getElementById('homeProductGrid').style.display = 'grid';
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
      document.getElementById('homeProductGrid').style.display = 'none';
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
        if (pill.textContent === categories.find(c => c.id === categoryId)?.name) {
          pill.classList.add('active');
        }
      });
    }

    // Price filter functions
    function applyPriceFilter() {
      const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
      const maxPrice = parseFloat(document.getElementById('maxPrice').value) || 5000;
      
      const filteredProducts = products.filter(product => {
        const price = parseFloat(product.price.replace('₹', ''));
        return price >= minPrice && price <= maxPrice;
      });
      
      renderProducts(filteredProducts, 'productGrid');
    }

    function resetPriceFilter() {
      document.getElementById('minPrice').value = '';
      document.getElementById('maxPrice').value = '';
      document.getElementById('minPriceSlider').value = 0;
      document.getElementById('maxPriceSlider').value = 5000;
      document.getElementById('minPriceValue').textContent = '₹0';
      document.getElementById('maxPriceValue').textContent = '₹5000';
      
      renderProducts(products, 'productGrid');
    }

    // Quantity functions
    function decreaseQuantity() {
      const qtyInput = document.getElementById('qtySelect');
      let value = parseInt(qtyInput.value);
      if (value > 1) {
        qtyInput.value = value - 1;
      }
    }

    function increaseQuantity() {
      const qtyInput = document.getElementById('qtySelect');
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
      galleryMain.style.backgroundImage = `url('${currentProduct.image}')`;
      
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
      shareLink.select();
      document.execCommand('copy');
      showToast('Link copied to clipboard', 'success');
    }

    // Image zoom functions
    function openImageZoom() {
      if (!currentProduct) return;
      
      const imageUrl = currentProduct.images && currentProduct.images[currentImageIndex] ? 
        currentProduct.images[currentImageIndex] : currentProduct.image;
      
      zoomImage.src = imageUrl;
      zoomModal.classList.add('active');
      resetZoom();
    }

    function adjustZoom(delta) {
      currentZoomLevel += delta;
      currentZoomLevel = Math.max(0.5, Math.min(3, currentZoomLevel));
      zoomImage.style.transform = `scale(${currentZoomLevel})`;
    }

    function resetZoom() {
      currentZoomLevel = 1;
      zoomImage.style.transform = 'scale(1)';
    }

    // Newsletter subscription
    function handleNewsletterSubscription() {
      const email = document.getElementById('newsletterEmail').value;
      
      if (!email) {
        showToast('Please enter your email address', 'error');
        return;
      }
      
      // In a real app, you would save this to your database
      showToast('Thank you for subscribing!', 'success');
      document.getElementById('newsletterEmail').value = '';
    }

    // Account functions
    function saveProfile() {
      const name = document.getElementById('profileName').value;
      const phone = document.getElementById('profilePhone').value;
      
      if (!currentUser) return;
      
      db.collection('users').doc(currentUser.uid).update({
        name: name,
        phone: phone,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        showToast('Profile updated successfully', 'success');
        // Update UI
        userName.textContent = name;
        mobileUserName.textContent = name;
        userAvatar.textContent = name.charAt(0).toUpperCase();
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

    function saveSettings() {
      const emailNotifications = document.getElementById('emailNotifications').checked;
      const smsNotifications = document.getElementById('smsNotifications').checked;
      const pushNotifications = document.getElementById('pushNotifications').checked;
      const personalizedRecs = document.getElementById('personalizedRecs').checked;
      const dataSharing = document.getElementById('dataSharing').checked;
      const language = document.getElementById('languageSelect').value;
      const currency = document.getElementById('currencySelect').value;
      
      if (!currentUser) return;
      
      db.collection('users').doc(currentUser.uid).update({
        settings: {
          emailNotifications,
          smsNotifications,
          pushNotifications,
          personalizedRecs,
          dataSharing,
          language,
          currency
        },
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        showToast('Settings saved successfully', 'success');
      }).catch(error => {
        console.error('Error saving settings:', error);
        showToast('Failed to save settings', 'error');
      });
    }

    // Address functions
    function showNewAddressForm() {
      document.getElementById('newAddressForm').style.display = 'block';
    }

    function hideNewAddressForm() {
      document.getElementById('newAddressForm').style.display = 'none';
    }

    function saveAddress() {
      const name = document.getElementById('addressName').value;
      const mobile = document.getElementById('addressMobile').value;
      const pincode = document.getElementById('addressPincode').value;
      const city = document.getElementById('addressCity').value;
      const state = document.getElementById('addressState').value;
      const type = document.getElementById('addressType').value;
      const street = document.getElementById('addressStreet').value;
      
      if (!name || !mobile || !pincode || !city || !state || !street) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      if (!currentUser) return;
      
      db.collection('addresses').add({
        userId: currentUser.uid,
        name: name,
        mobile: mobile,
        pincode: pincode,
        city: city,
        state: state,
        type: type,
        street: street,
        isDefault: false, // You might want to implement logic for default address
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

    // Step pills update
    function updateStepPills() {
      const currentPage = document.querySelector('.page.active').id;
      
      document.querySelectorAll('.step-pill').forEach(pill => {
        pill.classList.remove('disabled');
      });
      
      switch (currentPage) {
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
          badge: '50% OFF',
          reviews: '124'
        },
        {
          id: '2',
          name: 'Smart Fitness Band',
          price: '₹1,999',
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZpdG5lc3MlMjBiYW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
          description: 'Track your fitness goals with this smart band',
          badge: 'NEW',
          reviews: '89'
        },
        {
          id: '3',
          name: 'Classic White Sneakers',
          price: '₹2,499',
          originalPrice: '₹3,999',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
          description: 'Comfortable and stylish white sneakers',
          badge: '37% OFF',
          reviews: '256'
        },
        {
          id: '4',
          name: 'Casual Summer T-Shirt',
          price: '₹499',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
          description: 'Soft and comfortable cotton t-shirt',
          reviews: '167'
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
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVsZWN0cm9uaWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: '2',
          name: 'Fashion',
          image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGZhc2hpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: '3',
          name: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBraXRjaGVufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: '4',
          name: 'Beauty',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
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
          image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
          title: 'Summer Sale',
          subtitle: 'Up to 50% off on selected items'
        },
        {
          id: '2',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
          title: 'New Arrivals',
          subtitle: 'Check out the latest trends'
        },
        {
          id: '3',
          image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
          title: 'Free Shipping',
          subtitle: 'On orders above ₹999'
        }
      ];
      
      renderBannerCarousel();
    }

    // Show my orders
    function showMyOrders() {
      if (!currentUser) {
        showLoginModal();
        return;
      }
      
      db.collection('orders')
        .where('userId', '==', currentUser.uid)
        .orderBy('orderDate', 'desc')
        .get()
        .then(snapshot => {
          const ordersList = document.getElementById('ordersList');
          const noOrders = document.getElementById('noOrders');
          
          if (snapshot.empty) {
            ordersList.style.display = 'none';
            noOrders.style.display = 'block';
            return;
          }
          
          ordersList.style.display = 'block';
          noOrders.style.display = 'none';
          ordersList.innerHTML = '';
          
          snapshot.docs.forEach(doc => {
            const order = doc.data();
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
                <div class="order-product-image" style="background-image: url('${products.find(p => p.id === order.productId)?.image || ''}')"></div>
                <div class="order-product-info">
                  <div class="order-product-title">${order.productName}</div>
                  <div class="order-product-price">${order.price}</div>
                  <div class="order-product-meta">Qty: ${order.quantity} | Size: ${order.size}</div>
                </div>
              </div>
              <div class="order-actions">
                <button class="btn secondary view-order-detail" data-order-id="${order.orderId}">View Details</button>
              </div>
            `;
            
            orderCard.querySelector('.view-order-detail').addEventListener('click', () => {
              showOrderDetail(order.orderId);
            });
            
            ordersList.appendChild(orderCard);
          });
        })
        .catch(error => {
          console.error('Error loading orders:', error);
          showToast('Failed to load orders', 'error');
        });
    }

    function showOrderDetail(orderId) {
      db.collection('orders').doc(orderId).get()
        .then(doc => {
          if (!doc.exists) {
            showToast('Order not found', 'error');
            return;
          }
          
          const order = doc.data();
          const container = document.getElementById('orderDetailContent');
          
          container.innerHTML = `
            <div class="order-detail-section">
              <div class="order-detail-label">Order ID</div>
              <div class="order-detail-value">${order.orderId}</div>
            </div>
            
            <div class="order-detail-section">
              <div class="order-detail-label">Order Date</div>
              <div class="order-detail-value">${new Date(order.orderDate).toLocaleString()}</div>
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
                <div class="order-detail-image" style="background-image: url('${products.find(p => p.id === order.productId)?.image || ''}')"></div>
                <div class="order-detail-product-info">
                  <div style="font-weight:600;margin-bottom:8px">${order.productName}</div>
                  <div style="color:var(--accent);font-weight:700;margin-bottom:8px">${order.price}</div>
                  <div style="color:var(--muted)">Qty: ${order.quantity} | Size: ${order.size}</div>
                </div>
              </div>
            </div>
            
            <div class="order-detail-section">
              <div class="order-detail-label">Delivery Address</div>
              <div class="order-detail-value">
                <div>${order.userInfo?.fullName || 'N/A'}</div>
                <div>${order.userInfo?.house || 'N/A'}</div>
                <div>${order.userInfo?.city || 'N/A'}, ${order.userInfo?.state || 'N/A'} - ${order.userInfo?.pincode || 'N/A'}</div>
                <div>Mobile: ${order.userInfo?.mobile || 'N/A'}</div>
              </div>
            </div>
            
            <div class="order-detail-section">
              <div class="order-detail-label">Payment Method</div>
              <div class="order-detail-value">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</div>
            </div>
          `;
          
          showPage('orderDetailPage');
        })
        .catch(error => {
          console.error('Error loading order details:', error);
          showToast('Failed to load order details', 'error');
        });
    }

    // Initialize the app when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }