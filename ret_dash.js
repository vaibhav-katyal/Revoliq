// API Base URL
const API_URL = 'https://revoliq.onrender.com';

// Fetch data from server
async function fetchData() {
    try {
        const [products, orders] = await Promise.all([
            fetch(`${API_URL}/products`).then(res => res.json()),
            fetch(`${API_URL}/products`).then(res => res.json()) // Using products as orders for now
        ]);

        updateDashboardStats(products);
        updateCharts(products);
        updateRecentOrders(products);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.userType !== "retailer") {
        alert("Unauthorized access! Redirecting to login...");
        window.location.href = "/login/login.html";
        return;
    }

    console.log("Retailer data loaded:", user);

    // Update profile button and popup with retailer details
    document.querySelector(".profile-icon").src = user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
    document.getElementById("popupAvatar").src = user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
    document.getElementById("popupName").textContent = user.name || "Retailer Name";
    document.getElementById("popupEmail").textContent = user.email || "Email not available";
    document.getElementById("popupStoreName").textContent = user.storeName || "Store not specified";
    document.getElementById("popupMemberSince").textContent = user.createdAt ? new Date(user.createdAt).getFullYear() : "2024";

    // Show popup on click
    document.getElementById("profileButton").addEventListener("click", () => {
        document.getElementById("profilePopup").style.display = "block";
    });

    // Close popup
    document.getElementById("closePopup").addEventListener("click", () => {
        document.getElementById("profilePopup").style.display = "none";
    });

    // Close popup when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === document.getElementById("profilePopup")) {
            document.getElementById("profilePopup").style.display = "none";
        }
    });
});


// Update dashboard statistics
function updateDashboardStats(products) {
    const todayRevenue = products.reduce((sum, product) => sum + product.price, 0);
    const totalOrders = products.length;
    const uniqueCustomers = new Set(products.map(p => p.id)).size;

    document.querySelector('.stat-value:nth-child(1)').textContent = `₹${todayRevenue.toFixed(2)}`;
    document.querySelector('.stat-value:nth-child(2)').textContent = totalOrders;
    document.querySelector('.stat-value:nth-child(3)').textContent = uniqueCustomers;
}

// Update charts
function updateCharts(products) {
    // Revenue Chart
    const salesChart = new Chart(document.getElementById('salesChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Daily Revenue',
                data: calculateDailyRevenue(products),
                backgroundColor: 'rgba(0, 50, 90, 0.2)',
                borderColor: '#00325a',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Daily Revenue (₹)',
                    color: '#00325a',
                    font: { size: 16, weight: '500' }
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

    // Categories Chart
    const categories = groupByCategories(products);
    new Chart(document.getElementById('satisfactionChart').getContext('2d'), {
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
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { font: { size: 13 } }
                },
                title: {
                    display: true,
                    text: 'Product Categories',
                    color: '#00325a',
                    font: { size: 16, weight: '500' }
                }
            }
        }
    });
}

// Update recent orders table
function updateRecentOrders(products) {
    const tbody = document.querySelector('.transactions-table tbody');
    tbody.innerHTML = products.slice(0, 5).map(product => `
        <tr>
            <td>#ORD-${product.id}</td>
            <td>${product.name}</td>
            <td>Customer ${Math.floor(Math.random() * 100)}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td><span class="status completed">Completed</span></td>
            <td>
                <button class="action-btn" onclick="showOrderDetails('${product.id}')">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </td>
        </tr>
    `).join('');
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

// Export report
document.querySelector('.export-btn').addEventListener('click', () => {
    import('jspdf').then(module => {
        const { jsPDF } = module.default;
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF();
            
            doc.setFontSize(20);
            doc.text('Revoliq Sales Report', 14, 22);
            
            doc.autoTable({
                head: [['Order ID', 'Product', 'Amount', 'Status']],
                body: Array.from(document.querySelectorAll('.transactions-table tbody tr'))
                    .map(row => [
                        row.cells[0].textContent,
                        row.cells[1].textContent,
                        row.cells[3].textContent,
                        row.cells[4].textContent
                    ])
            });
            
            doc.save('revoliq-sales-report.pdf');
        });
    });
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        e.currentTarget.classList.add('active');
        loadPage(page);
    });
});

// Load different pages
function loadPage(page) {
    const mainContent = document.querySelector('.main-content');
    switch(page) {
        case 'products':
            window.location.href = 'products.html';
            break;
        case 'orders':
            window.location.href = 'orders.html';
            break;
        case 'customers':
            window.location.href = 'customers.html';
            break;
        case 'sales':
            window.location.href = 'sales.html';
            break;
        case 'inventory':
            window.location.href = 'inventory.html';
            break;
    }
}

// Initialize dashboard
fetchData();
// Refresh data every 30 seconds
setInterval(fetchData, 30000);