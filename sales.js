// API Base URL
const API_URL = 'http://localhost:5000';

// Initialize charts
let revenueTrendChart, topProductsChart, categoryChart, customerGrowthChart;

// Fetch and display sales analytics
async function fetchSalesAnalytics() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        updateCharts(products);
        updateMetrics(products);
    } catch (error) {
        console.error('Error fetching sales analytics:', error);
    }
}

// Update all charts
function updateCharts(products) {
    updateRevenueTrendChart(products);
    updateTopProductsChart(products);
    updateCategoryChart(products);
    updateCustomerGrowthChart(products);
}

// Update revenue trend chart
function updateRevenueTrendChart(products) {
    const ctx = document.getElementById('revenueTrendChart').getContext('2d');
    
    if (revenueTrendChart) {
        revenueTrendChart.destroy();
    }
    
    const dailyRevenue = calculateDailyRevenue(products);
    
    revenueTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue',
                data: dailyRevenue,
                borderColor: '#00325a',
                backgroundColor: 'rgba(0, 50, 90, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `₹${value}`
                    }
                }
            }
        }
    });
}

// Update top products chart
function updateTopProductsChart(products) {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    
    if (topProductsChart) {
        topProductsChart.destroy();
    }
    
    const topProducts = products
        .sort((a, b) => b.price - a.price)
        .slice(0, 5);
    
    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProducts.map(p => p.name),
            datasets: [{
                label: 'Revenue',
                data: topProducts.map(p => p.price),
                backgroundColor: '#fa9600'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `₹${value}`
                    }
                }
            }
        }
    });
}

// Update category chart
function updateCategoryChart(products) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const categories = groupByCategories(products);
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#00325a', '#fa9600', '#22c55e', '#3b82f6']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Update customer growth chart
function updateCustomerGrowthChart(products) {
    const ctx = document.getElementById('customerGrowthChart').getContext('2d');
    
    if (customerGrowthChart) {
        customerGrowthChart.destroy();
    }
    
    const customerGrowth = calculateCustomerGrowth(products);
    
    customerGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Customers',
                data: customerGrowth,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update metrics
function updateMetrics(products) {
    const metricsGrid = document.querySelector('.metrics-grid');
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
    const totalOrders = products.length;
    const averageOrderValue = totalRevenue / totalOrders;
    
    metricsGrid.innerHTML = `
        <div class="metric-card">
            <h3>Total Revenue</h3>
            <p>₹${totalRevenue.toFixed(2)}</p>
            <span class="trend positive">+15% vs last month</span>
        </div>
        <div class="metric-card">
            <h3>Total Orders</h3>
            <p>${totalOrders}</p>
            <span class="trend positive">+8% vs last month</span>
        </div>
        <div class="metric-card">
            <h3>Average Order Value</h3>
            <p>₹${averageOrderValue.toFixed(2)}</p>
            <span class="trend positive">+5% vs last month</span>
        </div>
    `;
}

// Helper functions
function calculateDailyRevenue(products) {
    return Array(7).fill(0).map(() => 
        products.reduce((sum, p) => sum + p.price, 0) / 7
    );
}

function groupByCategories(products) {
    return products.reduce((acc, product) => {
        const category = product.name.includes('Watch') ? 'Smart Watches' :
                        product.name.includes('Earbuds') ? 'Wireless Audio' :
                        product.name.includes('Camera') ? 'Cameras' : 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});
}

function calculateCustomerGrowth(products) {
    return Array(6).fill(0).map(() => Math.floor(Math.random() * 50) + 20);
}

// Date range filter
document.getElementById('applyDateRange').addEventListener('click', () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        fetchSalesAnalytics();
    }
});

// Initialize
fetchSalesAnalytics();
// Refresh data every 30 seconds
setInterval(fetchSalesAnalytics, 30000);