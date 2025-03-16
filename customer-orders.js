document.addEventListener('DOMContentLoaded', () => {
    // Sample orders data
    const orders = [
        {
            id: 'ORD123456',
            date: '2024-02-20',
            items: 5,
            total: '₹2,450',
            status: 'completed',
            details: {
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+91 98765 43210'
                },
                shipping: {
                    address: '123 Main St, Mumbai',
                    method: 'Express Delivery',
                    tracking: 'TRK789012'
                },
                items: [
                    {
                        name: 'Organic Bananas',
                        price: '₹40',
                        quantity: '1 bunch',
                        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200'
                    },
                    {
                        name: 'Whole Wheat Bread',
                        price: '₹35',
                        quantity: '2 loaves',
                        image: 'https://images.unsplash.com/photo-1598373182133-52452b9a1624?w=200'
                    }
                ]
            }
        },
        {
            id: 'ORD123455',
            date: '2024-02-19',
            items: 3,
            total: '₹1,850',
            status: 'processing',
            details: {
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+91 98765 43210'
                },
                shipping: {
                    address: '123 Main St, Mumbai',
                    method: 'Standard Delivery',
                    tracking: 'TRK789011'
                },
                items: [
                    {
                        name: 'Fresh Milk',
                        price: '₹60',
                        quantity: '2 liters',
                        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200'
                    }
                ]
            }
        },
        {
            id: 'ORD123454',
            date: '2024-02-18',
            items: 4,
            total: '₹950',
            status: 'cancelled',
            details: {
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+91 98765 43210'
                },
                shipping: {
                    address: '123 Main St, Mumbai',
                    method: 'Express Delivery',
                    tracking: 'TRK789010'
                },
                items: [
                    {
                        name: 'Fresh Eggs',
                        price: '₹75',
                        quantity: '1 dozen',
                        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200'
                    }
                ]
            }
        }
    ];

    // Populate orders table
    function populateOrders(filteredOrders = orders) {
        const tableBody = document.querySelector('.table-body');
        if (!tableBody) return;

        tableBody.innerHTML = filteredOrders.map(order => `
            <div class="order-row">
                <div class="order-id">${order.id}</div>
                <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                <div class="order-items">${order.items} items</div>
                <div class="order-total">${order.total}</div>
                <div class="order-status">
                    <span class="status-${order.status}">${order.status}</span>
                </div>
                <div class="order-actions">
                    <button class="action-btn view-btn" onclick="showOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Show order details modal
    window.showOrderDetails = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('orderDetailsModal');
        const modalBody = modal.querySelector('.modal-body');

        modalBody.innerHTML = `
            <div class="order-detail-section">
                <h3>Order Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Order ID</div>
                        <div class="detail-value">${order.id}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date</div>
                        <div class="detail-value">${new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status</div>
                        <div class="detail-value status-${order.status}">${order.status}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Total</div>
                        <div class="detail-value">${order.total}</div>
                    </div>
                </div>
            </div>

            <div class="order-detail-section">
                <h3>Customer Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Name</div>
                        <div class="detail-value">${order.details.customer.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Email</div>
                        <div class="detail-value">${order.details.customer.email}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Phone</div>
                        <div class="detail-value">${order.details.customer.phone}</div>
                    </div>
                </div>
            </div>

            <div class="order-detail-section">
                <h3>Shipping Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <div class="detail-label">Address</div>
                        <div class="detail-value">${order.details.shipping.address}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Method</div>
                        <div class="detail-value">${order.details.shipping.method}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Tracking</div>
                        <div class="detail-value">${order.details.shipping.tracking}</div>
                    </div>
                </div>
            </div>

            <div class="order-detail-section">
                <h3>Items</h3>
                <div class="items-list">
                    ${order.details.items.map(item => `
                        <div class="item-row">
                            <div class="item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="item-info">
                                <div class="item-name">${item.name}</div>
                                <div class="item-price">${item.price}</div>
                            </div>
                            <div class="item-quantity">${item.quantity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        modal.classList.add('show');
    };

    // Close modal
    const closeModal = document.querySelector('.close-modal');
    const modal = document.getElementById('orderDetailsModal');
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        // Close modal when clicking outside
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

    function filterOrders() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;
        const time = timeFilter.value;

        let filtered = orders;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.id.toLowerCase().includes(searchTerm) ||
                order.total.toLowerCase().includes(searchTerm)
            );
        }

        // Apply status filter
        if (status !== 'all') {
            filtered = filtered.filter(order => order.status === status);
        }

        // Apply time filter
        if (time !== 'all') {
            const now = new Date();
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.date);
                if (time === 'month') {
                    return orderDate >= monthAgo;
                } else if (time === 'year') {
                    return orderDate >= yearAgo;
                }
                return true;
            });
        }

        populateOrders(filtered);
    }

    // Add event listeners for filters
    if (searchInput) {
        searchInput.addEventListener('input', filterOrders);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }
    if (timeFilter) {
        timeFilter.addEventListener('change', filterOrders);
    }

    // Initialize orders table
    populateOrders();
});


document.addEventListener("DOMContentLoaded", () => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("No user found! Redirecting to login...");
        window.location.href = "/Revoliq/login.html";
        return;
    }

    console.log("User data loaded:", user);

    // Update sidebar profile name
    document.querySelector(".user-info h3").textContent = user.name || "Customer"; 

    // Update welcome message
    document.querySelector(".welcome-section h1").textContent = `Welcome back, ${user.name.split(' ')[0]}! 👋`;

    // Prefill other details if necessary
});
