// Get cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartItems = document.getElementById('cartItems');
const cartSummary = document.getElementById('cartSummary');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkoutBtn');

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 3rem;">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--primary); opacity: 0.3;"></i>
                <h2 style="margin: 1rem 0; color: var(--primary);">Your cart is empty</h2>
                <p style="color: var(--text); margin-bottom: 2rem;">Add some products to your cart and come back!</p>
                <a href="/" class="add-to-cart" style="text-decoration: none; display: inline-block;">
                    Continue Shopping
                </a>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const discountedPrice = item.price * (1 - item.discount / 100);
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">$${discountedPrice.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <span class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </span>
            </div>
        `;
    }).join('');

    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - item.discount / 100);
        return sum + (discountedPrice * item.quantity);
    }, 0);

    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    cartSummary.innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (10%):</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row total-row">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

// Update quantity
window.updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        updateCartCount();
    }
};

// Remove from cart
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    updateCartCount();
};

// Checkout button click
checkoutBtn.addEventListener('click', () => {
    alert('Checkout functionality will be implemented soon!');
});

// Initialize
updateCart();
updateCartCount();