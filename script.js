// Firebase Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMDAW2Gvsh8qJY5gZoFvgiMHxO5qjQl-I",
  authDomain: "videoapp-67c32.firebaseapp.com",
  databaseURL: "https://videoapp-67c32-default-rtdb.firebaseio.com",
  projectId: "videoapp-67c32",
  storageBucket: "videoapp-67c32.firebasestorage.app",
  messagingSenderId: "711675594877",
  appId: "1:711675594877:web:7786ab4a432d60e6f70914"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Demo product dataset (mixed categories) - Added more products
const PRODUCTS = [
  {id:1,title:"Wireless Earbuds Pro",price:1299,desc:"ENC mic, 24h battery",fullDesc:"High-quality wireless earbuds with environmental noise cancellation microphone and 24 hours of battery life. Perfect for calls, music, and podcasts.",images:[
    "https://images.unsplash.com/photo-1598335622921-7c1b84a3c2bf?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1518445691220-6b95fcd0a2df?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1518441902113-c1d0d0f70ed2?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["—","—"], category:"Men's Acc"},
  {id:2,title:"Classic Cotton T‑Shirt",price:499,desc:"100% cotton, regular fit",fullDesc:"Comfortable 100% cotton t-shirt with regular fit. Available in multiple colors. Perfect for everyday wear.",images:[
    "https://images.unsplash.com/photo-1520971282009-2c7e9f7d8dbe?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["S","M","L","XL"], category:"Topwear"},
  {id:3,title:"High‑Waist Denim Jeans",price:999,desc:"Stretch denim, comfy",fullDesc:"Stylish high-waist denim jeans made with stretchable material for maximum comfort. Perfect for casual outings.",images:[
    "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["26","28","30"], category:"Bottomwear"},
  {id:4,title:"Mesh Sneakers",price:1499,desc:"Breathable, light",fullDesc:"Lightweight mesh sneakers with breathable fabric. Perfect for running, gym, or casual wear. Available in multiple sizes.",images:[
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["6","7","8","9","10"], category:"Casual shoes"},
  {id:5,title:"Leather Crossbody Bag",price:1999,desc:"Genuine leather, multiple pockets",fullDesc:"Elegant crossbody bag made from genuine leather with multiple compartments for organized storage. Perfect for everyday use.",images:[
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["—"], category:"Backt"},
  {id:6,title:"Smart Fitness Band",price:2499,desc:"Heart rate monitor, waterproof",fullDesc:"Advanced fitness band with heart rate monitoring, sleep tracking, and waterproof design. Tracks your activity throughout the day.",images:[
    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-158612225000-92e24acc1c32?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["S","M","L"], category:"Watches"},
  {id:7,title:"Stainless Steel Water Bottle",price:799,desc:"Insulated, 1L capacity",fullDesc:"Premium stainless steel water bottle that keeps your drinks hot for 12 hours or cold for 24 hours. Leak-proof design.",images:[
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["—"], category:"Men's Acc"},
  {id:8,title:"Wireless Charging Pad",price:1299,desc:"Fast charging, compatible with all devices",fullDesc:"Universal wireless charging pad that supports fast charging for all Qi-enabled devices. Sleek design with non-slip surface.",images:[
    "https://images.unsplash.com/photo-1609091839311-d5365f2e0c5a?auto=format&fit=crop&w=1000&q=60",
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["—"], category:"Men's Acc"},
  {id:9,title:"Silk Saree",price:2999,desc:"Pure silk, elegant design",fullDesc:"Beautiful pure silk saree with elegant design. Perfect for weddings and special occasions.",images:[
    "https://images.unsplash.com/photo-1585487000160-6ebcfcec0b71?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["Free Size"], category:"Sarees"},
  {id:10,title:"Designer Kurta Set",price:1999,desc:"3-piece set, embroidered",fullDesc:"Elegant 3-piece kurta set with intricate embroidery. Includes kurta, dupatta, and bottoms.",images:[
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["S", "M", "L"], category:"Kurta Sets"},
  {id:11,title:"Winter Jacket",price:3499,desc:"Warm, insulated, waterproof",fullDesc:"High-quality winter jacket with insulation and waterproof exterior. Keeps you warm in extreme conditions.",images:[
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["S", "M", "L", "XL"], category:"Winter Wear"},
  {id:12,title:"Hardcase Trolley Bag",price:4999,desc:"Durable, 4 wheels, 68L",fullDesc:"Durable hardcase trolley bag with 4 spinner wheels and 68L capacity. Perfect for travel.",images:[
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["—"], category:"Trolley Bags"},
  {id:13,title:"Denim Shorts",price:899,desc:"Comfortable, casual",fullDesc:"Comfortable denim shorts for casual wear.",images:[
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=60"
  ],sizes:["28", "30", "32"], category:"Bottor"}
];

// state
let selectedProduct = null;
let orderDraft = {productId:null, size:null, qty:1, fullname:'',mobile:'',pincode:'',city:'',state:'',house:'',payment:'prepaid',timestamp:null};
let currentCategory = 'all';
let currentImageIndex = 0;
let detailImageIndex = 0;
let selectedCancelOrderIndex = null;
let alertModalConfirmCallback = null;
let ordersViewed = false;

// elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const productSlider = document.getElementById('productSlider');
const ordersNotification = document.getElementById('ordersNotification');

// Offline persistence - Load saved state
function loadSavedState() {
  try {
    const savedState = localStorage.getItem('buyzoCartState');
    if (savedState) {
      const state = JSON.parse(savedState);
      
      // Restore search term
      if (state.searchTerm) {
        searchInput.value = state.searchTerm;
        const q = state.searchTerm.trim().toLowerCase();
        if (q) {
          const filtered = PRODUCTS.filter(p=>p.title.toLowerCase().includes(q));
          renderProducts(filtered);
        }
      }
      
      // Restore current category
      if (state.currentCategory) {
        currentCategory = state.currentCategory;
        document.querySelectorAll('.category-pill').forEach(pill => {
          if (pill.getAttribute('data-category') === currentCategory) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });
      }
      
      // Restore order draft if exists
      if (state.orderDraft) {
        orderDraft = state.orderDraft;
      }
      
      // Restore current page if it's not products page
      if (state.currentPage && state.currentPage !== 'productsPage') {
        showPage(state.currentPage);
        
        // If we were on order page and had a product selected, restore it
        if (state.currentPage === 'orderPage' && state.selectedProductId) {
          const product = PRODUCTS.find(p => p.id === state.selectedProductId);
          if (product) {
            selectedProduct = product;
            restoreOrderPage();
          }
        }
        
        // If we were on product detail page, restore it
        if (state.currentPage === 'productDetailPage' && state.selectedProductId) {
          showProductDetail(state.selectedProductId);
        }
      }
    }
  } catch (e) {
    console.error('Error loading saved state:', e);
  }
}

// Save current state to localStorage
function saveState() {
  const state = {
    searchTerm: searchInput.value,
    currentCategory: currentCategory,
    orderDraft: orderDraft,
    currentPage: document.querySelector('.page.active').id,
    selectedProductId: selectedProduct ? selectedProduct.id : null
  };
  
  localStorage.setItem('buyzoCartState', JSON.stringify(state));
}

// Restore order page with selected product
function restoreOrderPage() {
  if (!selectedProduct) return;
  
  // gallery
  const main = document.getElementById('galleryMain');
  main.style.backgroundImage = `url('${selectedProduct.images[0]}')`;
  
  // Setup carousel for order page
  setupCarousel('galleryMain', selectedProduct.images);

  document.getElementById('spTitle').textContent = selectedProduct.title;
  document.getElementById('spPrice').textContent = `₹${selectedProduct.price}`;
  document.getElementById('spDesc').textContent = selectedProduct.desc;
  document.getElementById('spFullDesc').textContent = selectedProduct.fullDesc;

  // size options
  const sizeSelect = document.getElementById('sizeSelect');
  sizeSelect.innerHTML = '<option value="">Select size</option>';
  selectedProduct.sizes.forEach(s=> sizeSelect.insertAdjacentHTML('beforeend', `<option>${s}</option>`));
  
  // Restore selected size if exists
  if (orderDraft.size) {
    sizeSelect.value = orderDraft.size;
  }

  // Setup quantity control
  const qtyInput = document.getElementById('qtySelect');
  qtyInput.value = orderDraft.qty || 1;
  
  // Add event listeners to plus/minus buttons
  document.querySelector('.qty-minus').addEventListener('click', function() {
    let qty = parseInt(qtyInput.value);
    if (qty > 1) {
      qtyInput.value = qty - 1;
      orderDraft.qty = qty - 1;
      saveState();
    }
  });
  
  document.querySelector('.qty-plus').addEventListener('click', function() {
    let qty = parseInt(qtyInput.value);
    qtyInput.value = qty + 1;
    orderDraft.qty = qty + 1;
    saveState();
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Update notification badge
function updateOrdersNotification() {
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  if (orders.length > 0 && !ordersViewed) {
    ordersNotification.style.display = 'flex';
    ordersNotification.textContent = orders.length;
  } else {
    ordersNotification.style.display = 'none';
  }
}

// Show alert modal
function showAlertModal(message, confirmCallback) {
  const alertModal = document.getElementById('alertModal');
  const alertMessage = document.getElementById('alertMessage');
  
  alertMessage.textContent = message;
  alertModal.classList.add('active');
  alertModalConfirmCallback = confirmCallback || null;
}

// Close alert modal
function closeAlertModal() {
  const alertModal = document.getElementById('alertModal');
  alertModal.classList.remove('active');
  alertModalConfirmCallback = null;
}

// render product cards with auto slider
function renderProducts(list=PRODUCTS){
  productGrid.innerHTML = '';
  if(list.length===0){
    productGrid.innerHTML = '<div class="card-panel" style="text-align:center">No products found</div>';
    return;
  }
  
  // Filter by category if not 'all'
  let filteredList = list;
  if (currentCategory !== 'all') {
    filteredList = list.filter(p => p.category === currentCategory);
  }
  
  if(filteredList.length===0){
    productGrid.innerHTML = '<div class="card-panel" style="text-align:center">No products found in this category</div>';
    return;
  }
  
  filteredList.forEach(p=>{
    const card = document.createElement('div'); 
    card.className='card';
    const imgUrl = p.images && p.images.length? p.images[0] : '';
    card.innerHTML = `
      <div class="product-img-slider" data-id="${p.id}" data-images='${JSON.stringify(p.images)}' data-idx="0" style="background-image:url('${imgUrl}')"></div>
      <div class="card-body">
        <div class="title">${p.title}</div>
        <div class="price">₹${p.price} <span style="font-weight:500;color:var(--muted-light);font-size:14px;margin-left:6px;text-decoration:line-through">₹${Math.round(p.price*1.5)}</span></div>
        <div class="badge">${p.desc}</div>
        <div style="margin-top:auto;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn orderBtn" data-id="${p.id}">Order Now</button>
          <button class="btn secondary viewBtn" data-id="${p.id}">View Details</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
  startCardSliders();
  
  // Add click events to product cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking on buttons inside the card
      if (!e.target.classList.contains('btn')) {
        const productId = this.querySelector('.product-img-slider').getAttribute('data-id');
        showProductDetail(productId);
      }
    });
  });
  
  // Add click events to order buttons
  document.querySelectorAll('.orderBtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click event
      const productId = parseInt(this.getAttribute('data-id'));
      startOrder(productId);
    });
  });
  
  // Add click events to view buttons
  document.querySelectorAll('.viewBtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card click event
      const productId = parseInt(this.getAttribute('data-id'));
      showProductDetail(productId);
    });
  });
  
  // Save state after rendering products
  saveState();
}

// Render product slider
function renderProductSlider() {
  productSlider.innerHTML = '';
  
  // Show first 8 products in the slider
  const productsToShow = PRODUCTS.slice(0, 8);
  
  productsToShow.forEach(p => {
    const sliderItem = document.createElement('div');
    sliderItem.className = 'slider-item';
    const imgUrl = p.images && p.images.length ? p.images[0] : '';
    sliderItem.innerHTML = `
      <div class="slider-item-img" style="background-image:url('${imgUrl}')"></div>
      <div class="slider-item-body">
        <div class="slider-item-title">${p.title}</div>
        <div class="slider-item-price">₹${p.price}</div>
      </div>
    `;
    
    sliderItem.addEventListener('click', () => {
      showProductDetail(p.id);
    });
    
    productSlider.appendChild(sliderItem);
  });
  
  // Removed slider navigation as requested
}

// Show product detail page
function showProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  // Update product detail page
  document.getElementById('detailTitle').textContent = product.title;
  document.getElementById('detailPrice').textContent = `₹${product.price}`;
  document.getElementById('detailDesc').textContent = product.desc;
  document.getElementById('detailFullDesc').textContent = product.fullDesc;
  
  // Set up product meta info
  const metaInfo = `
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>Available Sizes:</strong> ${product.sizes.join(', ')}</p>
    <p><strong>Material:</strong> High-quality materials for durability and comfort</p>
    <p><strong>Warranty:</strong> 6 months manufacturer warranty</p>
    <p><strong>Delivery:</strong> Usually delivered in 5-7 business days</p>
  `;
  document.getElementById('detailMeta').innerHTML = metaInfo;
  
  // Set up product images with carousel
  setupDetailCarousel(product.images);
  
  // Set up order button
  document.getElementById('detailOrderBtn').onclick = function() {
    startOrder(productId);
  };
  
  // Render similar products
  renderSimilarProducts(product);
  
  // Show product detail page
  showPage('productDetailPage');
  
  // Save state
  selectedProduct = product;
  saveState();
}

// Render similar products
function renderSimilarProducts(currentProduct) {
  const similarSlider = document.getElementById('similarProductsSlider');
  similarSlider.innerHTML = '';
  
  // Find products in the same category (excluding the current product)
  const similarProducts = PRODUCTS.filter(p => 
    p.category === currentProduct.category && p.id !== currentProduct.id
  ).slice(0, 6); // Show up to 6 similar products
  
  if (similarProducts.length === 0) {
    // If no similar products, hide the section
    document.querySelector('.similar-products').style.display = 'none';
    return;
  }
  
  // Show the section
  document.querySelector('.similar-products').style.display = 'block';
  
  similarProducts.forEach(p => {
    const sliderItem = document.createElement('div');
    sliderItem.className = 'slider-item';
    const imgUrl = p.images && p.images.length ? p.images[0] : '';
    sliderItem.innerHTML = `
      <div class="slider-item-img" style="background-image:url('${imgUrl}')"></div>
      <div class="slider-item-body">
        <div class="slider-item-title">${p.title}</div>
        <div class="slider-item-price">₹${p.price}</div>
      </div>
    `;
    
    sliderItem.addEventListener('click', () => {
      showProductDetail(p.id);
    });
    
    similarSlider.appendChild(sliderItem);
  });
}

// Setup carousel for product detail page
function setupDetailCarousel(images) {
  const mainImage = document.getElementById('detailMainImage');
  const dotsContainer = document.getElementById('detailCarouselDots');
  const prevBtn = mainImage.querySelector('.prev');
  const nextBtn = mainImage.querySelector('.next');
  
  // Clear existing dots
  dotsContainer.innerHTML = '';
  
  // Create dots
  images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'detail-carousel-dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      detailImageIndex = index;
      updateDetailCarousel(images);
    });
    dotsContainer.appendChild(dot);
  });
  
  // Previous button event
  prevBtn.onclick = () => {
    detailImageIndex = (detailImageIndex - 1 + images.length) % images.length;
    updateDetailCarousel(images);
  };
  
  // Next button event
  nextBtn.onclick = () => {
    detailImageIndex = (detailImageIndex + 1) % images.length;
    updateDetailCarousel(images);
  };
  
  // Initialize carousel
  detailImageIndex = 0;
  updateDetailCarousel(images);
}

function updateDetailCarousel(images) {
  const mainImage = document.getElementById('detailMainImage');
  const dotsContainer = document.getElementById('detailCarouselDots');
  
  // Update main image
  mainImage.style.backgroundImage = `url('${images[detailImageIndex]}')`;
  
  // Update dots
  const dots = dotsContainer.querySelectorAll('.detail-carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === detailImageIndex);
  });
  
  // Update thumbnails
  const thumbnailsContainer = document.getElementById('detailThumbnails');
  thumbnailsContainer.innerHTML = '';
  
  images.forEach((img, index) => {
    const thumb = document.createElement('div');
    thumb.className = `product-detail-thumbnail ${index === detailImageIndex ? 'active' : ''}`;
    thumb.style.backgroundImage = `url('${img}')`;
    thumb.addEventListener('click', () => {
      detailImageIndex = index;
      updateDetailCarousel(images);
    });
    thumbnailsContainer.appendChild(thumb);
  });
}

// Show My Orders page
function showMyOrders() {
  ordersViewed = true;
  updateOrdersNotification();
  
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const ordersList = document.getElementById('ordersList');
  const noOrders = document.getElementById('noOrders');
  
  ordersList.innerHTML = '';
  
  if (orders.length === 0) {
    noOrders.style.display = 'block';
    return;
  }
  
  noOrders.style.display = 'none';
  
  // Sort orders by timestamp (newest first)
  orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  orders.forEach((order, index) => {
    const product = PRODUCTS.find(p => p.id === order.productId);
    if (!product) return;
    
    const orderDate = new Date(order.timestamp);
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(orderDate.getDate() + 7); // 7 days from order date
    
    const isCancellable = (Date.now() - orderDate.getTime()) < (24 * 60 * 60 * 1000); // Within 24 hours
    const isShipped = (Date.now() - orderDate.getTime()) > (2 * 24 * 60 * 60 * 1000); // Shipped after 2 days
    const isDelivered = (Date.now() - orderDate.getTime()) > (7 * 24 * 60 * 60 * 1000); // Delivered after 7 days
    
    let status = 'Confirmed';
    let statusClass = 'status-confirmed';
    
    if (isDelivered) {
      status = 'Delivered';
      statusClass = 'status-delivered';
    } else if (isShipped) {
      status = 'Shipped';
      statusClass = 'status-shipped';
    } else if (!isCancellable) {
      status = 'Processing';
      statusClass = 'status-confirmed';
    }
    
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.innerHTML = `
      <div class="order-header">
        <div>
          <div class="order-id">Order #${orders.length - index}</div>
          <div class="order-date">Placed on ${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString()}</div>
          <div class="order-estimated">Estimated delivery: ${estimatedDelivery.toLocaleDateString()}</div>
        </div>
        <span class="order-status ${statusClass}">${status}</span>
      </div>
      
      <div class="order-details">
        <div class="order-product-image" style="background-image:url('${product.images[0]}')"></div>
        <div class="order-product-info">
          <div class="order-product-title">${product.title}</div>
          <div class="order-product-price">₹${product.price} x ${order.qty}</div>
          <div class="order-product-meta">
            Size: ${order.size} | Qty: ${order.qty}
          </div>
        </div>
      </div>
      
      ${isDelivered ? `
        <div class="delivery-congrats">
          <div class="delivery-congrats-icon">🎉</div>
          <div>Congratulations! Your order has been successfully delivered.</div>
        </div>
      ` : ''}
      
      <div class="order-actions">
        ${isCancellable ? `
          <button class="btn error cancel-order" data-index="${index}">Cancel Order</button>
        ` : ''}
        <button class="btn secondary view-order-details" data-index="${index}">View Details</button>
      </div>
    `;
    
    ordersList.appendChild(orderCard);
  });
  
  // Add event listeners to cancel buttons
  document.querySelectorAll('.cancel-order').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      showCancellationModal(index);
    });
  });
  
  // Add event listeners to view details buttons
  document.querySelectorAll('.view-order-details').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      viewOrderDetails(index);
    });
  });
  
  // Save state
  saveState();
}

// Show cancellation modal with reason selection
function showCancellationModal(index) {
  selectedCancelOrderIndex = index;
  const modal = document.getElementById('cancellationModal');
  modal.classList.add('active');
  
  // Clear any previously selected reasons
  document.querySelectorAll('input[name="cancelReason"]').forEach(radio => {
    radio.checked = false;
  });
}

// Close cancellation modal
function closeCancellationModal() {
  const modal = document.getElementById('cancellationModal');
  modal.classList.remove('active');
  selectedCancelOrderIndex = null;
}

// Confirm order cancellation with selected reason
function confirmCancellation() {
  const selectedReason = document.querySelector('input[name="cancelReason"]:checked');
  if (!selectedReason) {
    alert('Please select a reason for cancellation.');
    return;
  }
  
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const order = orders[selectedCancelOrderIndex];
  const product = PRODUCTS.find(p => p.id === order.productId);
  
  // Calculate refund amount with deduction
  const orderAmount = product.price * order.qty;
  const deductionPercentage = 2 + Math.random(); // 2-3% deduction
  const deductionAmount = Math.round(orderAmount * (deductionPercentage / 100));
  const refundAmount = orderAmount - deductionAmount;
  
  // Show confirmation modal with Cancel and Yes buttons
  showAlertModal(
    `Please note that payment gateway charges (approx ${deductionPercentage.toFixed(1)}% of the order value) are non-refundable. For your order of ₹${orderAmount}, the refund amount will be ₹${refundAmount}. This deduction is due to Razorpay's non-refundable transaction fee. Do you want to proceed?`,
    function() {
      // This is the confirmation callback when user clicks "Yes"
      orders.splice(selectedCancelOrderIndex, 1);
      localStorage.setItem('demo_orders', JSON.stringify(orders));
      
      showMyOrders();
      showToast(`Order for ${product.title} has been cancelled. Reason: ${selectedReason.value}`, 'success');
      closeCancellationModal();
    }
  );
}

// View order details
function viewOrderDetails(index) {
  const orders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
  const order = orders[index];
  const product = PRODUCTS.find(p => p.id === order.productId);
  
  if (!product) return;
  
  const orderDate = new Date(order.timestamp);
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(orderDate.getDate() + 7);
  
  // Create a modal or page to show detailed order information
  const orderDetailsHTML = `
    <div class="order-details-page">
      <h2>Order Details</h2>
      
      <div class="order-details-section">
        <div class="order-details-label">Order ID</div>
        <div class="order-details-value">#${orders.length - index}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Order Date</div>
        <div class="order-details-value">${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString()}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Estimated Delivery</div>
        <div class="order-details-value">${estimatedDelivery.toLocaleDateString()}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Product</div>
        <div class="order-details-value">${product.title}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Size</div>
        <div class="order-details-value">${order.size}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Quantity</div>
        <div class="order-details-value">${order.qty}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Price</div>
        <div class="order-details-value">₹${product.price * order.qty}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Delivery Address</div>
        <div class="order-details-value">${order.house}, ${order.city}, ${order.state} - ${order.pincode}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Contact</div>
        <div class="order-details-value">${order.mobile}</div>
      </div>
      
      <div class="order-details-section">
        <div class="order-details-label">Payment Method</div>
        <div class="order-details-value">${order.payment === 'prepaid' ? 'Prepaid (UPI / Card)' : 'Cash on Delivery'}</div>
      </div>
    </div>
  `;
  
  // Create a modal for order details
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';
  
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '24px';
  modalContent.style.borrowRadius = 'var(--radius)';
  modalContent.style.maxWidth = '600px';
  modalContent.style.width = '90%';
  modalContent.style.maxHeight = '80%';
  modalContent.style.overflowY = 'auto';
  modalContent.innerHTML = orderDetailsHTML;
  
  const closeButton = document.createElement('button');
  closeButton.className = 'btn';
  closeButton.textContent = 'Close';
  closeButton.style.marginTop = '20px';
  closeButton.onclick = function() {
    document.body.removeChild(modal);
  };
  
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  
  modal.onclick = function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
  
  document.body.appendChild(modal);
}

// auto sliders for product cards
function startCardSliders(){
  document.querySelectorAll('.product-img-slider').forEach(el=>{
    if(el.dataset.timerId){ clearInterval(Number(el.dataset.timerId)); }
    const images = JSON.parse(el.dataset.images || '[]');
    if(!images.length) return;
    let idx = Number(el.dataset.idx||0);
    const timerId = setInterval(()=>{
      idx = (idx + 1) % images.length;
      el.style.backgroundImage = `url('${images[idx]}')`;
      el.dataset.idx = idx;
    }, 2600 + Math.floor(Math.random()*900));
    el.dataset.timerId = timerId;
  });
}

// search only in product titles
searchInput.addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q){ renderProducts(); return; }
  const filtered = PRODUCTS.filter(p=>p.title.toLowerCase().includes(q));
  renderProducts(filtered);
  saveState();
});

// Enable step navigation
function enableStep(stepNumber) {
  const steps = ['pill-order', 'pill-user', 'pill-pay'];
  if (stepNumber >= 1 && stepNumber <= 3) {
    document.getElementById(steps[stepNumber-1]).classList.remove('disabled');
  }
}

// order button clicks
document.addEventListener('click', function(e){
  if(e.target.matches('.orderBtn')){
    const id = Number(e.target.dataset.id);
    startOrder(id);
  }
});

function startOrder(productId){
  selectedProduct = PRODUCTS.find(p=>p.id===productId);
  // gallery
  const main = document.getElementById('galleryMain');
  main.style.backgroundImage = `url('${selectedProduct.images[0]}')`;
  
  // Setup carousel for order page
  setupCarousel('galleryMain', selectedProduct.images);

  document.getElementById('spTitle').textContent = selectedProduct.title;
  document.getElementById('spPrice').textContent = `₹${selectedProduct.price}`;
  document.getElementById('spDesc').textContent = selectedProduct.desc;
  document.getElementById('spFullDesc').textContent = selectedProduct.fullDesc;

  // size options
  const sizeSelect = document.getElementById('sizeSelect');
  sizeSelect.innerHTML = '<option value="">Select size</option>';
  selectedProduct.sizes.forEach(s=> sizeSelect.insertAdjacentHTML('beforeend', `<option>${s}</option>`));
  
  // Restore selected size if exists
  if (orderDraft.size) {
    sizeSelect.value = orderDraft.size;
  }

  // Setup quantity control
  const qtyInput = document.getElementById('qtySelect');
  qtyInput.value = orderDraft.qty || 1;
  
  // Add event listeners to plus/minus buttons
  document.querySelector('.qty-minus').addEventListener('click', function() {
    let qty = parseInt(qtyInput.value);
    if (qty > 1) {
      qtyInput.value = qty - 1;
      orderDraft.qty = qty - 1;
      saveState();
    }
  });
  
  document.querySelector('.qty-plus').addEventListener('click', function() {
    let qty = parseInt(qtyInput.value);
    qtyInput.value = qty + 1;
    orderDraft.qty = qty + 1;
    saveState();
  });

  // Enable order step
  enableStep(1);
  
  setActiveStep('order');
  showPage('orderPage');
  window.scrollTo(0,0);
  
  // Save state
  saveState();
}

// Setup carousel with arrows and dots
function setupCarousel(containerId, images) {
  const container = document.getElementById(containerId);
  const dotsContainer = container.querySelector('.carousel-dots');
  const prevBtn = container.querySelector('.prev');
  const nextBtn = container.querySelector('.next');
  
  // Clear existing dots
  dotsContainer.innerHTML = '';
  
  // Create dots
  images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      currentImageIndex = index;
      updateCarousel(container, images, dotsContainer);
    });
    dotsContainer.appendChild(dot);
  });
  
  // Previous button event
  prevBtn.onclick = () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateCarousel(container, images, dotsContainer);
  };
  
  // Next button event
  nextBtn.onclick = () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateCarousel(container, images, dotsContainer);
  };
  
  // Initialize carousel
  updateCarousel(container, images, dotsContainer);
}

function updateCarousel(container, images, dotsContainer) {
  // Update main image
  container.style.backgroundImage = `url('${images[currentImageIndex]}')`;
  
  // Update dots
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentImageIndex);
  });
}

// steps click navigation with checks
document.getElementById('pill-products').addEventListener('click', ()=>{ setActiveStep('products'); showPage('productsPage'); });
document.getElementById('pill-order').addEventListener('click', ()=>{ 
  if(!document.getElementById('pill-order').classList.contains('disabled')) {
    if(selectedProduct) { setActiveStep('order'); showPage('orderPage'); } 
  }
});
document.getElementById('pill-user').addEventListener('click', ()=>{ 
  if(!document.getElementById('pill-user').classList.contains('disabled')) {
    setActiveStep('user'); showPage('userPage'); 
  }
});
document.getElementById('pill-pay').addEventListener('click', ()=>{ 
  if(!document.getElementById('pill-pay').classList.contains('disabled')) {
    setActiveStep('pay'); showPage('paymentPage'); 
  }
});

// buttons in order page
document.getElementById('toUserInfo').addEventListener('click', ()=>{
  const size = document.getElementById('sizeSelect').value;
  const qty = Number(document.getElementById('qtySelect').value || 1);
  if(!size){ alert('Please select a size'); return; }
  if(qty < 1){ alert('Quantity must be at least 1'); return; }
  orderDraft.productId = selectedProduct.id;
  orderDraft.size = size;
  orderDraft.qty = qty;
  
  // Enable user info step
  enableStep(2);
  
  setActiveStep('user');
  showPage('userPage');
  window.scrollTo(0,0);
  
  // Save state
  saveState();
});

document.getElementById('backToProducts').addEventListener('click', ()=>{ 
  setActiveStep('products'); 
  showPage('productsPage'); 
  
  // Save state
  saveState();
});

// Edit order -> back to order
document.getElementById('editOrder').addEventListener('click', ()=>{ setActiveStep('order'); showPage('orderPage'); });

// user to payment
document.getElementById('toPayment').addEventListener('click', ()=>{
  const fullname = document.getElementById('fullname').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const pincode = document.getElementById('pincode').value.trim();
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const house = document.getElementById('house').value.trim();

  if(!fullname || !mobile || !pincode || !city || !state || !house){
    alert('Please fill all required address fields.');
    return;
  }
  if(!/^\d{10}$/.test(mobile)){ alert('Enter a valid 10-digit mobile number'); return; }

  orderDraft.fullname = fullname; orderDraft.mobile = mobile; orderDraft.pincode = pincode;
  orderDraft.city = city; orderDraft.state = state; orderDraft.house = house;

  const prod = PRODUCTS.find(p=>p.id===orderDraft.productId);
  const price = prod.price * orderDraft.qty;
  const delivery = 50;
  const total = price + delivery;
  document.getElementById('sumProduct').textContent = prod.title;
  document.getElementById('sumQty').textContent = orderDraft.qty;
  document.getElementById('sumPrice').textContent = `₹${price}`;
  document.getElementById('sumTotal').textContent = `₹${total}`;
  document.getElementById('sumDel').textContent = `₹${delivery}`;

  // Enable payment step
  enableStep(3);
  
  setActiveStep('pay');
  showPage('paymentPage');
  window.scrollTo(0,0);
  
  // Save state
  saveState();
});

// payment - back
document.getElementById('payBack').addEventListener('click', ()=>{ setActiveStep('user'); showPage('userPage'); });

// confirm order
document.getElementById('confirmOrder').addEventListener('click', ()=>{
  const payment = document.querySelector('input[name="pay"]:checked').value;
  orderDraft.payment = payment;
  orderDraft.timestamp = new Date().toISOString();
  saveOrderDemo(orderDraft);
  showSuccess();
});

// success page actions
document.getElementById('goHome').addEventListener('click', ()=>{ 
  // Reset steps
  document.getElementById('pill-order').classList.add('disabled');
  document.getElementById('pill-user').classList.add('disabled');
  document.getElementById('pill-pay').classList.add('disabled');
  
  setActiveStep('products'); 
  showPage('productsPage'); 
  
  // Clear order draft
  orderDraft = {productId:null, size:null, qty:1, fullname:'',mobile:'',pincode:'',city:'',state:'',house:'',payment:'prepaid',timestamp:null};
  
  // Save state
  saveState();
});
document.getElementById('viewOrders').addEventListener('click', ()=>{
  showMyOrders();
  showPage('myOrdersPage');
});

// header buttons
document.getElementById('openContactTop').addEventListener('click', ()=> showPage('contactPage'));
document.getElementById('openMyOrdersTop').addEventListener('click', ()=> {
  showMyOrders();
  showPage('myOrdersPage');
});

// helper: show page by id
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  
  // Save state
  saveState();
}

function setActiveStep(step){
  const map = {products:'pill-products', order:'pill-order', user:'pill-user', pay:'pill-pay'};
  for (const k of Object.keys(map)){
    const el = document.getElementById(map[k]);
    if (step === k) {
      el.style.opacity = 1;
      el.style.fontWeight = '700';
      el.style.borderColor = 'var(--accent)';
      el.style.background = 'var(--accent)';
      el.style.color = '#fff';
    } else {
      el.style.opacity = el.classList.contains('disabled') ? 0.5 : 1;
      el.style.fontWeight = '600';
      el.style.borderColor = 'var(--border)';
      el.style.background = '#fff';
      el.style.color = 'var(--ink-2)';
    }
  }
}

// demo save order
function saveOrderDemo(draft){
  const saved = JSON.parse(localStorage.getItem('demo_orders')||'[]');
  saved.push({...draft});
  localStorage.setItem('demo_orders', JSON.stringify(saved));
  console.log('Order saved (demo):', draft);
  
  // Update notification badge
  updateOrdersNotification();
}

// success display & confetti
function showSuccess(){
  setActiveStep('products');
  showPage('successPage');
  runConfetti();
  
  // Clear order draft
  orderDraft = {productId:null, size:null, qty:1, fullname:'',mobile:'',pincode:'',city:'',state:'',house:'',payment:'prepaid',timestamp:null};
  
  // Save state
  saveState();
}

// enhanced confetti with more celebration
function runConfetti(){
  const container = document.createElement('div');
  container.style.position='fixed'; container.style.left=0; container.style.right=0; container.style.top=0; container.style.bottom=0;
  container.style.pointerEvents='none'; container.style.zIndex=9999;
  document.body.appendChild(container);
  
  // More vibrant colors for celebration
  const colors = ['#2563eb','#60a5fa','#93c5fd','#4cc9f0','#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4', '#ff6b6b', '#4ecdc4', '#ff9f1c'];
  const total = 100; // More particles for a bigger celebration
  
  for(let i=0;i<total;i++){
    const el = document.createElement('div');
    el.style.position='absolute';
    el.style.width = (6 + Math.random()*8)+'px';
    el.style.height = (10 + Math.random()*14)+'px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.left = (Math.random()*100)+'%';
    el.style.top = (-10 - Math.random()*20)+'%';
    el.style.opacity = 0.95;
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.borderRadius = '3px';
    container.appendChild(el);
    
    const dx = (Math.random()*200 - 100);
    const dur = 2000 + Math.random()*1500;
    
    el.animate([
      { transform: `translate3d(0, 0, 0) rotate(${Math.random()*360}deg)`, opacity:1 },
      { transform: `translate3d(${dx}px, 900px, 0) rotate(${Math.random()*720}deg)`, opacity:0.9 }
    ], {duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)'});
  }
  
  // Add some floating thank you message animation
  const thankYou = document.createElement('div');
  thankYou.textContent = 'Thank You!';
  thankYou.style.position = 'fixed';
  thankYou.style.top = '50%';
  thankYou.style.left = '50%';
  thankYou.style.transform = 'translate(-50%, -50%) scale(0)';
  thankYou.style.fontSize = '48px';
  thankYou.style.fontWeight = 'bold';
  thankYou.style.color = 'var(--success)';
  thankYou.style.zIndex = '10000';
  thankYou.style.textShadow = '0 2px 10px rgba(0,0,0,0.2)';
  document.body.appendChild(thankYou);
  
  thankYou.animate([
    { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
    { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 1 },
    { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
  ], { duration: 1000, easing: 'ease-out' });
  
  setTimeout(() => {
    thankYou.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 }
    ], { duration: 500, delay: 1500, easing: 'ease-in' }).onfinish = () => {
      document.body.removeChild(thankYou);
    };
  }, 1000);
  
  setTimeout(()=>{ 
    container.remove(); 
  }, 3500);
}

// Category filtering
function setupCategoryFilter() {
  const categoryPills = document.querySelectorAll('.category-pill');
  
  categoryPills.forEach(pill => {
    pill.addEventListener('click', function() {
      // Update active state
      categoryPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      
      // Set current category
      currentCategory = this.getAttribute('data-category');
      
      // Re-render products
      renderProducts(PRODUCTS);
      
      // Save state
      saveState();
    });
  });
}

// Setup cancellation modal events
function setupCancellationModal() {
  document.getElementById('cancelModalClose').addEventListener('click', closeCancellationModal);
  document.getElementById('cancelModalConfirm').addEventListener('click', confirmCancellation);
  
  // Close modal when clicking outside
  document.getElementById('cancellationModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeCancellationModal();
    }
  });
  
  // Add styling to radio buttons when selected
  document.querySelectorAll('.cancellation-reason input').forEach(radio => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('.cancellation-reason').forEach(label => {
        label.classList.remove('selected');
      });
      
      if (this.checked) {
        this.parentElement.classList.add('selected');
      }
    });
  });
}

// Setup alert modal events
function setupAlertModal() {
  document.getElementById('alertModalCancel').addEventListener('click', closeAlertModal);
  document.getElementById('alertModalConfirm').addEventListener('click', function() {
    if (alertModalConfirmCallback) {
      alertModalConfirmCallback();
    }
    closeAlertModal();
  });
  
  // Close modal when clicking outside
  document.getElementById('alertModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeAlertModal();
    }
  });
}

// initial render
renderProducts();
renderProductSlider();
setupCategoryFilter();
setupCancellationModal();
setupAlertModal();
updateOrdersNotification();

// Load saved state on page load
window.addEventListener('DOMContentLoaded', function() {
  loadSavedState();
});

// Make showPage function available globally for HTML onclick handlers
window.showPage = showPage;