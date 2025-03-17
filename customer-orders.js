document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    // Update profile name
    document.querySelector(".user-info h3").textContent = user.name || "Customer";

    // Fetch products as orders from server
    async function fetchOrders() {
        try {
            const response = await fetch(`https://revoliq.onrender.com/api/products/orders/${user.uid}`);
            const orders = await response.json();
            populateOrders(orders);
            updateOrderStats(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    // Update order statistics
    function updateOrderStats(orders) {
        const stats = {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
            returns: 0, // Since these are products, we'll set returns to 0
            avgRating: 4.8
        };

        document.querySelector('.overview-cards').innerHTML = `
            <div class="overview-card">
                <div class="card-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="card-info">
                    <h3>Total Orders</h3>
                    <p class="value">${stats.totalOrders}</p>
                    <span class="trend positive">
                        <i class="fas fa-arrow-up"></i> Active customer
                    </span>
                </div>
            </div>

            <div class="overview-card">
                <div class="card-icon">
                    <i class="fas fa-rupee-sign"></i>
                </div>
                <div class="card-info">
                    <h3>Total Spent</h3>
                    <p class="value">₹${stats.totalSpent.toLocaleString()}</p>
                    <span class="trend positive">
                        <i class="fas fa-arrow-up"></i> Regular shopper
                    </span>
                </div>
            </div>

            <div class="overview-card">
                <div class="card-icon">
                    <i class="fas fa-undo"></i>
                </div>
                <div class="card-info">
                    <h3>Returns</h3>
                    <p class="value">${stats.returns}</p>
                    <span class="trend positive">
                        <i class="fas fa-arrow-up"></i> Quality satisfaction
                    </span>
                </div>
            </div>

            <div class="overview-card">
                <div class="card-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div class="card-info">
                    <h3>Avg. Rating</h3>
                    <p class="value">${stats.avgRating}</p>
                    <span class="trend positive">
                        <i class="fas fa-arrow-up"></i> Excellent
                    </span>
                </div>
            </div>
        `;
    }

    // Populate orders table
    function populateOrders(orders) {
        const tableBody = document.querySelector('.table-body');
        if (!tableBody) return;

        tableBody.innerHTML = orders.map(order => `
            <div class="order-row">
                <div class="order-id">${order.orderId}</div>
                <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                <div class="order-items">${order.name}</div>
                <div class="order-total">₹${order.total.toLocaleString()}</div>
                <div class="order-status">
                    <span class="status-${order.status}">${order.status}</span>
                </div>
                <div class="order-actions">
                    <button class="action-btn view-btn" onclick="showOrderDetails('${order.orderId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Show order details modal
    window.showOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`https://revoliq.onrender.com/api/product/detail/${orderId}`);
            const product = await response.json();
            
            const modal = document.getElementById('orderDetailsModal');
            const modalBody = modal.querySelector('.modal-body');

            modalBody.innerHTML = `
                <div class="order-detail-section">
                    <h3>Product Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">Product ID</div>
                            <div class="detail-value">${product._id}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Date Added</div>
                            <div class="detail-value">${new Date(product.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Name</div>
                            <div class="detail-value">${product.name}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Price</div>
                            <div class="detail-value">₹${product.price.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div class="order-detail-section">
                    <h3>Product Details</h3>
                    <div class="items-list">
                        <div class="item-row">
                            <div class="item-image">
                                <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name}">
                            </div>
                            <div class="item-info">
                                <div class="item-name">${product.name}</div>
                                <div class="item-price">₹${product.price.toLocaleString()}</div>
                            </div>
                            <div class="item-quantity">Barcode: ${product.barcode}</div>
                        </div>
                    </div>
                </div>
            `;

            modal.classList.add('show');
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    // Close modal functionality
    const closeModal = document.querySelector('.close-modal');
    const modal = document.getElementById('orderDetailsModal');
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    // Handle filters
    const searchInput = document.querySelector('.search-box input');
    const statusFilter = document.getElementById('statusFilter');
    const timeFilter = document.getElementById('timeFilter');

    async function filterOrders() {
        try {
            const response = await fetch(`https://revoliq.onrender.com/api/products/orders/${user.uid}`);
            let orders = await response.json();
            
            const searchTerm = searchInput.value.toLowerCase();
            const time = timeFilter.value;

            // Apply filters
            if (searchTerm) {
                orders = orders.filter(order => 
                    order.name.toLowerCase().includes(searchTerm) ||
                    order.total.toString().includes(searchTerm)
                );
            }

            if (time !== 'all') {
                const now = new Date();
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

                orders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    if (time === 'month') {
                        return orderDate >= monthAgo;
                    } else if (time === 'year') {
                        return orderDate >= yearAgo;
                    }
                    return true;
                });
            }

            populateOrders(orders);
        } catch (error) {
            console.error('Error filtering orders:', error);
        }
    }

    // Add event listeners for filters
    if (searchInput) searchInput.addEventListener('input', filterOrders);
    if (statusFilter) statusFilter.addEventListener('change', filterOrders);
    if (timeFilter) timeFilter.addEventListener('change', filterOrders);

    // Initial load
    fetchOrders();
});