// Sample data for recent activities
const recentActivities = [
    {
        type: 'cart',
        title: 'Connected to Smart Cart',
        location: 'Store #123',
        time: '2 hours ago',
        amount: '₹2,450'
    },
    {
        type: 'purchase',
        title: 'Completed Shopping',
        location: 'Store #456',
        time: 'Yesterday',
        amount: '₹1,850'
    },
    {
        type: 'reward',
        title: 'Earned Reward Points',
        points: '+150 points',
        time: '2 days ago'
    }
];

// Sample data for frequently bought items
const frequentItems = [
    {
        name: 'Organic Bananas',
        price: '₹40',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
        purchaseCount: 12
    },
    {
        name: 'Whole Wheat Bread',
        price: '₹35',
        image: 'https://images.unsplash.com/photo-1598373182133-52452b9a1624?w=200',
        purchaseCount: 8
    },
    {
        name: 'Milk 1L',
        price: '₹60',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200',
        purchaseCount: 10
    },
    {
        name: 'Fresh Eggs',
        price: '₹75',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200',
        purchaseCount: 6
    }
];

// Populate Recent Activities
function populateRecentActivities() {
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${activity.type === 'cart' ? 'shopping-cart' : 
                               activity.type === 'purchase' ? 'check-circle' : 'gift'}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.title}</h4>
                ${activity.location ? `<p>${activity.location}</p>` : ''}
                ${activity.points ? `<p class="points">${activity.points}</p>` : ''}
                <span class="activity-time">${activity.time}</span>
            </div>
            ${activity.amount ? `<div class="activity-amount">${activity.amount}</div>` : ''}
        </div>
    `).join('');
}

// Populate Frequent Items
function populateFrequentItems() {
    const itemsGrid = document.querySelector('.items-grid');
    itemsGrid.innerHTML = frequentItems.map(item => `
        <div class="product-card">
            <img src="${item.image}" alt="${item.name}">
            <div class="product-info">
                <h4>${item.name}</h4>
                <p class="price">${item.price}</p>
                <p class="purchase-count">Bought ${item.purchaseCount} times</p>
            </div>
        </div>
    `).join('');
}

// Initialize Spending Chart
function initializeChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Spending',
                data: [1200, 1900, 800, 1600, 2000, 1800, 1500],
                borderColor: '#00325a',
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
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    populateRecentActivities();
    populateFrequentItems();
    initializeChart();

    // Handle chart period buttons
    document.querySelectorAll('.chart-period').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.chart-period.active').classList.remove('active');
            button.classList.add('active');
            // Update chart data based on selected period
        });
    });

    // Handle notifications
    document.querySelector('.notification-btn').addEventListener('click', () => {
        // Show notifications panel
    });

    // Handle scan cart button
    document.querySelector('.scan-cart-btn').addEventListener('click', () => {
        window.location.href = 'scan.html';
    });
});