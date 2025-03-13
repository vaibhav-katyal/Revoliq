// API Base URL
const API_URL = 'http://localhost:5000';

// Fetch and display carts
async function fetchCarts() {
    try {
        const response = await fetch(`${API_URL}/carts`);
        const carts = await response.json();
        displayCarts(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
    }
}

// Display carts in grid
function displayCarts(carts) {
    const cartsGrid = document.getElementById('cartsGrid');
    cartsGrid.innerHTML = carts.map(cart => {
        return `
            <div class="cart-card" data-cart-id="${cart.cartId}">
                <span class="cart-status ${cart.active ? 'status-active' : 'status-inactive'}">
                    ${cart.active ? 'Active' : 'Inactive'}
                </span>
                <div class="cart-header">
                    <div>
                        <h3 class="cart-id">Cart #${cart.cartId}</h3>
                        <p class="cart-retailer">Retailer: ${cart.retailerId}</p>
                    </div>
                </div>
                
                <div class="qr-container">
                    <img src="${cart.qrCode}" alt="Cart QR Code" class="qr-code">
                </div>

                <div class="cart-stats">
                    <div class="stat-item">
                        <div class="stat-label">Total Products</div>
                        <div class="stat-value">${cart.products ? cart.products.length : 0}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Last Active</div>
                        <div class="stat-value">${new Date(cart.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>

                <div class="cart-actions">
                    <button class="cart-btn download-btn" onclick="downloadQR('${cart.cartId}')">
                        <i class="fas fa-download"></i> Download QR
                    </button>
                    <button class="cart-btn print-btn" onclick="printQR('${cart.cartId}')">
                        <i class="fas fa-print"></i> Print QR
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Download QR code
function downloadQR(cartId) {
    const qrImage = document.querySelector(`[data-cart-id="${cartId}"] .qr-code`);
    const link = document.createElement('a');
    link.download = `cart-${cartId}-qr.png`;
    link.href = qrImage.src;
    link.click();
}

// Print QR code
function printQR(cartId) {
    const qrImage = document.querySelector(`[data-cart-id="${cartId}"] .qr-code`);
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print QR Code - Cart #${cartId}</title>
                <style>
                    body { 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        height: 100vh;
                        margin: 0;
                        padding: 20px;
                    }
                    img { 
                        max-width: 300px;
                        width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                <img src="${qrImage.src}" onload="window.print();window.close()">
            </body>
        </html>
    `);
}

// Search carts
document.getElementById('searchCarts').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const carts = document.querySelectorAll('.cart-card');
    
    carts.forEach(cart => {
        const cartId = cart.querySelector('.cart-id').textContent.toLowerCase();
        const retailerId = cart.querySelector('.cart-retailer').textContent.toLowerCase();
        cart.style.display = 
            cartId.includes(searchTerm) || retailerId.includes(searchTerm) 
            ? 'block' 
            : 'none';
    });
});

// Initialize
fetchCarts();
// Refresh data every 30 seconds
setInterval(fetchCarts, 30000);