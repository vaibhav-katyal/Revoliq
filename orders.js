// API Base URL
const API_URL = 'https://revoliq.onrender.com';

// Fetch and display orders
async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        displayOrders(products);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Display orders
function displayOrders(products) {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = products.map(product => `
        <div class="order-item" onclick="showOrderDetails('${product._id}')">
            <div class="order-info">
                <div class="order-id">#ORD-${product._id.slice(0, 8)}</div>
                <div class="order-date">${new Date(product.scannedAt).toLocaleDateString()}</div>
                <div class="order-customer">Customer ${Math.floor(Math.random() * 100)}</div>
            </div>
            <div class="order-products">
                <span>${product.name}</span>
                <span>×${product.quantity}</span>
            </div>
            <div class="order-total">₹${product.price.toFixed(2)}</div>
            <div class="order-status ${getRandomStatus()}">${getRandomStatus()}</div>
        </div>
    `).join('');
}

// Show order details in modal
async function showOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_URL}/products/${orderId}`);
        const product = await response.json();
        
        const modal = document.getElementById('orderModal');
        const modalContent = modal.querySelector('.order-details');
        
        modalContent.innerHTML = `
            <h2>Order #ORD-${product._id.slice(0, 8)}</h2>
            <div class="order-details-info">
                <p><strong>Date:</strong> ${new Date(product.scannedAt).toLocaleDateString()}</p>
                <p><strong>Customer:</strong> Customer ${Math.floor(Math.random() * 100)}</p>
                <p><strong>Status:</strong> <span class="order-status ${getRandomStatus()}">${getRandomStatus()}</span></p>
                <h3>Products</h3>
                <div class="order-products-list">
                    <div class="order-product-item">
                        <img src="${product.image || 'https://via.placeholder.com/100'}" alt="${product.name}">
                        <div class="product-details">
                            <h4>${product.name}</h4>
                            <p>Quantity: ${product.quantity}</p>
                            <p>Price: ₹${(product.price / product.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div class="order-total">
                    <h3>Total: ₹${product.price.toFixed(2)}</h3>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

// Helper function to get random status
function getRandomStatus() {
    const statuses = ['completed', 'pending', 'cancelled'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Filter orders by status
document.getElementById('orderStatus').addEventListener('change', (e) => {
    const status = e.target.value;
    const orders = document.querySelectorAll('.order-item');
    
    orders.forEach(order => {
        const orderStatus = order.querySelector('.order-status').textContent;
        order.style.display = (status === 'all' || orderStatus === status) ? 'flex' : 'none';
    });
});

// Search orders
document.getElementById('searchOrders').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const orders = document.querySelectorAll('.order-item');
    
    orders.forEach(order => {
        const orderId = order.querySelector('.order-id').textContent.toLowerCase();
        const customerName = order.querySelector('.order-customer').textContent.toLowerCase();
        order.style.display = (orderId.includes(searchTerm) || customerName.includes(searchTerm)) ? 'flex' : 'none';
    });
});

// Close modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('orderModal').style.display = 'none';
});

// Initialize
fetchOrders();
// Refresh data every 30 seconds
setInterval(fetchOrders, 30000);