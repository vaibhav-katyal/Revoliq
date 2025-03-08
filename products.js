// API Base URL
const API_URL = 'http://localhost:5000';

// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products in grid
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetails('${product._id}')">
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${(product.price / product.quantity).toFixed(2)}</p>
                <div class="product-stats">
                    <div class="stat">
                        <div class="stat-label">Stock</div>
                        <div class="stat-value">${product.quantity}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Orders</div>
                        <div class="stat-value">${Math.floor(Math.random() * 50)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Revenue</div>
                        <div class="stat-value">₹${product.price.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show product details in modal
async function showProductDetails(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();
        
        const modal = document.getElementById('productModal');
        const modalContent = modal.querySelector('.product-details');
        
        modalContent.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" style="max-width: 200px;">
            <div class="product-details-info">
                <p><strong>Price:</strong> ₹${(product.price / product.quantity).toFixed(2)}</p>
                <p><strong>Stock:</strong> ${product.quantity}</p>
                <p><strong>Total Revenue:</strong> ₹${product.price.toFixed(2)}</p>
                <p><strong>Last Updated:</strong> ${new Date(product.scannedAt).toLocaleDateString()}</p>
            </div>
            <div class="product-actions">
                <button onclick="updateProduct('${product._id}')" class="edit-btn">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteProduct('${product._id}')" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Search products
document.getElementById('searchProducts').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        product.style.display = name.includes(searchTerm) ? 'block' : 'none';
    });
});

// Close modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
});

// Initialize
fetchProducts();
// Refresh data every 30 seconds
setInterval(fetchProducts, 30000);