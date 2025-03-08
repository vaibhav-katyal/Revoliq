// Mock products data
const products = [
    {
        id: 1,
        name: "Smart Watch Pro",
        price: 199.99,
        discount: 15,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
        description: "Latest generation smartwatch with health tracking, notifications, and 5-day battery life. Water resistant up to 50m.",
        features: ["Heart Rate Monitor", "Sleep Tracking", "GPS", "Water Resistant"]
    },
    {
        id: 2,
        name: "Wireless Earbuds",
        price: 149.99,
        discount: 20,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
        description: "Premium wireless earbuds with active noise cancellation and crystal-clear sound quality.",
        features: ["Active Noise Cancellation", "30hr Battery", "Touch Controls", "Water Resistant"]
    },
    {
        id: 3,
        name: "4K Action Camera",
        price: 299.99,
        discount: 10,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
        description: "Capture your adventures in stunning 4K resolution. Includes stabilization and underwater housing.",
        features: ["4K 60fps", "Stabilization", "Waterproof", "WiFi Connected"]
    },
    {
        id: 4,
        name: "Gaming Keyboard",
        price: 129.99,
        discount: 25,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
        description: "Mechanical gaming keyboard with RGB backlight and programmable keys for the ultimate gaming experience.",
        features: ["Mechanical Switches", "RGB Lighting", "Macro Keys", "Anti-ghosting"]
    }
];

// Get cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const productModal = document.getElementById('productModal');
const cartCount = document.querySelector('.cart-count');

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target === productModal) {
        closeModal();
    }
};

// Close buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = closeModal;
});

// Close modal with animation
function closeModal() {
    productModal.classList.remove('show');
    setTimeout(() => {
        productModal.style.display = "none";
    }, 300);
}

// Render products
function renderProducts() {
    productsContainer.innerHTML = products.map(product => {
        const discountedPrice = product.price * (1 - product.discount / 100);
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class=" product-name">${product.name}</h3>
                    <p class="product-price">
                        <span style="text-decoration: line-through; color: #666; font-size: 0.9em;">$${product.price.toFixed(2)}</span>
                        $${discountedPrice.toFixed(2)}
                    </p>
                    <p class="product-discount">${product.discount}% OFF</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Add to Cart
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Add click event to show product details
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.onclick = (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                showProductDetails(products[index]);
            }
        };
    });
}

// Show product details
function showProductDetails(product) {
    const discountedPrice = product.price * (1 - product.discount / 100);
    document.getElementById('modalContent').innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${product.name}" class="detail-image">
            <div class="detail-info">
                <h2 class="detail-name">${product.name}</h2>
                <p class="detail-price">
                    <span style="text-decoration: line-through; color: #666;">$${product.price.toFixed(2)}</span>
                    $${discountedPrice.toFixed(2)}
                </p>
                <p class="product-discount">${product.discount}% OFF</p>
                <p class="detail-description">${product.description}</p>
                <div class="feature-list">
                    ${product.features.map(feature => `
                        <div class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            ${feature}
                        </div>
                    `).join('')}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
    `;
    productModal.style.display = "block";
    setTimeout(() => {
        productModal.classList.add('show');
    }, 10);
}

// Add to cart
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddedToCartNotification();
};

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show added to cart notification
function showAddedToCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'toast';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Added to cart!
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize
renderProducts();
updateCartCount();