document.addEventListener('DOMContentLoaded', () => {
    // Sample data for active cart items
    const activeCartItems = [
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
        },
        {
            name: 'Fresh Milk',
            price: '₹60',
            quantity: '1 liter',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200'
        }
    ];

    // Sample data for cart history
    const cartHistory = [
        {
            id: 'CART#11234',
            date: '2024-02-20',
            store: 'Mumbai Central',
            items: 8,
            total: '₹1,850',
            duration: '45 mins'
        },
        {
            id: 'CART#11233',
            date: '2024-02-18',
            store: 'Andheri West',
            items: 12,
            total: '₹2,450',
            duration: '35 mins'
        },
        {
            id: 'CART#11232',
            date: '2024-02-15',
            store: 'Bandra East',
            items: 5,
            total: '₹950',
            duration: '20 mins'
        }
    ];

    // Sample data for store statistics
    const storeStats = [
        { name: 'Mumbai Central', visits: 24, percentage: 40 },
        { name: 'Andheri West', visits: 18, percentage: 30 },
        { name: 'Bandra East', visits: 12, percentage: 20 },
        { name: 'Dadar West', visits: 6, percentage: 10 }
    ];

    // Toggle cart items view
    const viewItemsBtn = document.querySelector('.view-items-btn');
    const cartItemsList = document.querySelector('.cart-items-list');
    
    if (viewItemsBtn && cartItemsList) {
        viewItemsBtn.addEventListener('click', () => {
            cartItemsList.classList.toggle('hidden');
            viewItemsBtn.innerHTML = cartItemsList.classList.contains('hidden')
                ? '<i class="fas fa-eye"></i> View Items'
                : '<i class="fas fa-eye-slash"></i> Hide Items';
        });
    }

    // Populate active cart items
    function populateCartItems() {
        const itemsGrid = document.querySelector('.items-grid');
        if (!itemsGrid) return;

        itemsGrid.innerHTML = activeCartItems.map(item => `
            <div class="item-card">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.name}</h4>
                    <p class="item-price">${item.price}</p>
                    <span class="item-quantity">Quantity: ${item.quantity}</span>
                </div>
            </div>
        `).join('');
    }

    // Populate cart history
    function populateCartHistory() {
        const historyCards = document.querySelector('.history-cards');
        if (!historyCards) return;

        historyCards.innerHTML = cartHistory.map(cart => `
            <div class="history-card">
                <div class="history-card-header">
                    <h4>${cart.id}</h4>
                    <span class="history-card-date">${new Date(cart.date).toLocaleDateString()}</span>
                </div>
                <div class="history-card-details">
                    <div class="detail-row">
                        <span class="detail-label">Store</span>
                        <span class="detail-value">${cart.store}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Items</span>
                        <span class="detail-value">${cart.items}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total</span>
                        <span class="detail-value">${cart.total}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${cart.duration}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Populate store statistics
    function populateStoreStats() {
        const storeStatsContainer = document.querySelector('.store-stats');
        if (!storeStatsContainer) return;

        storeStatsContainer.innerHTML = storeStats.map(store => `
            <div class="store-stat">
                <div class="store-icon">
                    <i class="fas fa-store"></i>
                </div>
                <div class="store-info">
                    <h4 class="store-name">${store.name}</h4>
                    <p class="store-visits">${store.visits} visits</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${store.percentage}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Initialize shopping pattern chart
    function initializeChart() {
        const ctx = document.getElementById('shoppingPatternChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Shopping Duration',
                    data: [35, 45, 30, 50, 40, 60, 45],
                    borderColor: 'var(--primary)',
                    backgroundColor: 'rgba(0, 50, 90, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    }
                }
            }
        });
    }

    // Handle end session
    const endSessionBtn = document.querySelector('.end-session-btn');
    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to end this shopping session?')) {
                showNotification('Shopping session ended successfully', 'success');
                // Add session end logic here
            }
        });
    }

    // Handle time filter changes
    const timeFilter = document.getElementById('timeFilter');
    if (timeFilter) {
        timeFilter.addEventListener('change', () => {
            // Add filter logic here
            showNotification('Cart history updated', 'success');
        });
    }

    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize all components
    populateCartItems();
    populateCartHistory();
    populateStoreStats();
    initializeChart();

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }

        .notification.error {
            background: var(--danger);
        }

        .notification i {
            font-size: 1.25rem;
        }
    `;
    document.head.appendChild(style);
});