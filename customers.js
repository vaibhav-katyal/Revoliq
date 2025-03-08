// API Base URL
const API_URL = 'http://localhost:5000';

// Fetch and display customers
async function fetchCustomers() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const customers = generateCustomers(products);
        displayCustomers(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

// Generate mock customer data based on products
function generateCustomers(products) {
    const customers = [];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
    
    products.forEach((product, index) => {
        if (!customers.find(c => c.name === names[index % names.length])) {
            customers.push({
                id: `CUST-${index + 1}`,
                name: names[index % names.length],
                email: `${names[index % names.length].toLowerCase().replace(' ', '.')}@example.com`,
                orders: Math.floor(Math.random() * 20) + 1,
                totalSpent: product.price * (Math.floor(Math.random() * 5) + 1),
                lastOrder: product.scannedAt,
                avatar: `https://i.pravatar.cc/150?img=${index + 1}`
            });
        }
    });
    
    return customers;
}

// Display customers
function displayCustomers(customers) {
    const customersGrid = document.getElementById('customersGrid');
    customersGrid.innerHTML = customers.map(customer => `
        <div class="customer-card" onclick="showCustomerDetails('${customer.id}')">
            <div class="customer-header">
                <img src="${customer.avatar}" alt="${customer.name}" class="customer-avatar">
                <div class="customer-info">
                    <h3>${customer.name}</h3>
                    <p class="customer-email">${customer.email}</p>
                </div>
            </div>
            <div class="customer-stats">
                <div class="stat">
                    <div class="stat-label">Orders</div>
                    <div class="stat-value">${customer.orders}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Total Spent</div>
                    <div class="stat-value">₹${customer.totalSpent.toFixed(2)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show customer details in modal
function showCustomerDetails(customerId) {
    const customer = {
        id: customerId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        address: '123 Main St, Mumbai, India',
        orders: 15,
        totalSpent: 25000,
        lastOrder: new Date().toISOString(),
        avatar: 'https://i.pravatar.cc/150?img=1'
    };
    
    const modal = document.getElementById('customerModal');
    const modalContent = modal.querySelector('.customer-details');
    
    modalContent.innerHTML = `
        <div class="customer-profile">
            <img src="${customer.avatar}" alt="${customer.name}" class="customer-avatar">
            <h2>${customer.name}</h2>
            <p>${customer.email}</p>
            <p>${customer.phone}</p>
            <p>${customer.address}</p>
        </div>
        <div class="customer-stats-detailed">
            <div class="stat">
                <h3>Total Orders</h3>
                <p>${customer.orders}</p>
            </div>
            <div class="stat">
                <h3>Total Spent</h3>
                <p>₹${customer.totalSpent.toFixed(2)}</p>
            </div>
            <div class="stat">
                <h3>Last Order</h3>
                <p>${new Date(customer.lastOrder).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="customer-actions">
            <button class="edit-btn">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="contact-btn">
                <i class="fas fa-envelope"></i> Contact
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Search customers
document.getElementById('searchCustomers').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const customers = document.querySelectorAll('.customer-card');
    
    customers.forEach(customer => {
        const name = customer.querySelector('h3').textContent.toLowerCase();
        const email = customer.querySelector('.customer-email').textContent.toLowerCase();
        customer.style.display = (name.includes(searchTerm) || email.includes(searchTerm)) ? 'block' : 'none';
    });
});

// Close modal
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('customerModal').style.display = 'none';
});

// Initialize
fetchCustomers();
// Refresh data every 30 seconds
setInterval(fetchCustomers, 30000);