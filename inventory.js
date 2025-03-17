// API Base URL
const API_URL = 'https://revoliq.onrender.com';

// Fetch and display inventory
async function fetchInventory() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        updateInventoryStats(products);
        displayInventory(products);
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

// Update inventory statistics
function updateInventoryStats(products) {
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const lowStockCount = products.filter(p => p.quantity < 10).length;
    const stockTurnover = calculateStockTurnover(products);
    
    document.getElementById('totalStockValue').textContent = `₹${totalValue.toFixed(2)}`;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    document.getElementById('stockTurnover').textContent = stockTurnover.toFixed(2);
}

// Display inventory
function displayInventory(products) {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    <img src="${product.image || 'https://via.placeholder.com/40'}" alt="${product.name}">
                    <span>${product.name}</span>
                </div>
            </td>
            <td>${product.quantity}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>
                <span class="stock-status ${product.quantity < 10 ? 'stock-low' : 'stock-normal'}">
                    ${product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                </span>
            </td>
            <td>${new Date(product.scannedAt).toLocaleDateString()}</td>
            <td>
                <button class="action-btn" onclick="updateStock('${product._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="viewHistory('${product._id}')">
                    <i class="fas fa-history"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Calculate stock turnover
function calculateStockTurnover(products) {
    const totalSold = products.reduce((sum, p) => sum + Math.floor(Math.random() * 50), 0);
    const averageInventory = products.reduce((sum, p) => sum + p.quantity, 0) / products.length;
    return totalSold / averageInventory;
}

// Update stock
async function updateStock(productId) {
    const newQuantity = prompt('Enter new stock quantity:');
    if (newQuantity && !isNaN(newQuantity)) {
        try {
            const response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity: parseInt(newQuantity)
                })
            });
            
            if (response.ok) {
                fetchInventory();
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    }
}

// View stock history
function viewHistory(productId) {
    alert('Stock history feature coming soon!');
}

// Export inventory report
document.querySelector('.export-btn').addEventListener('click', () => {
    const table = document.querySelector('.inventory-table table');
    const rows = Array.from(table.querySelectorAll('tr'));
    
    let csv = 'Product,Stock Level,Value,Status,Last Updated\n';
    
    rows.slice(1).forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const productName = cells[0].querySelector('span').textContent;
        const stockLevel = cells[1].textContent;
        const value = cells[2].textContent;
        const status = cells[3].textContent.trim();
        const lastUpdated = cells[4].textContent;
        
        csv += `"${productName}",${stockLevel},${value},"${status}","${lastUpdated}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
});

// Search inventory
document.getElementById('searchInventory').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#inventoryList tr');
    
    rows.forEach(row => {
        const productName = row.querySelector('.product-cell span').textContent.toLowerCase();
        row.style.display = productName.includes(searchTerm) ? '' : 'none';
    });
});

// Initialize
fetchInventory();
// Refresh data every 30 seconds
setInterval(fetchInventory, 30000);