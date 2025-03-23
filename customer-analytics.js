document.addEventListener('DOMContentLoaded', () => {
    // Chart.js Global Configuration
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.color = '#636e72';
    Chart.defaults.plugins.legend.display = false;

    // Initialize Key Metric Charts
    function initializeMetricCharts() {
        const chartConfigs = {
            purchasesChart: {
                data: [2100, 2300, 2200, 2400, 2450],
                color: '#00325a'
            },
            timeChart: {
                data: [35, 32, 30, 33, 32],
                color: '#fa9600'
            },
            itemsChart: {
                data: [7, 8, 8.5, 8.2, 8.5],
                color: '#00b894'
            },
            visitsChart: {
                data: [12, 13, 14, 14, 15],
                color: '#6c5ce7'
            }
        };

        Object.entries(chartConfigs).forEach(([chartId, config]) => {
            const ctx = document.getElementById(chartId);
            if (!ctx) return;

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', ''],
                    datasets: [{
                        data: config.data,
                        borderColor: config.color,
                        backgroundColor: `${config.color}20`,
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
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    }
                }
            });
        });
    }

    // Initialize Spending Trends Chart
    function initializeSpendingTrendsChart() {
        const ctx = document.getElementById('spendingTrendsChart');
        if (!ctx) return;

        const spendingChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Amount Spent',
                    data: [2100, 2300, 2200, 2400, 2450, 2300, 2500],
                    borderColor: '#00325a',
                    backgroundColor: '#00325a20',
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

        // Handle trend type switches
        document.querySelectorAll('.trend-type').forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                document.querySelector('.trend-type.active').classList.remove('active');
                button.classList.add('active');

                spendingChart.data.datasets[0].label = type === 'amount' ? 'Amount Spent' : 'Items Bought';
                spendingChart.data.datasets[0].data = type === 'amount' 
                    ? [2100, 2300, 2200, 2400, 2450, 2300, 2500]
                    : [8, 10, 7, 12, 9, 11, 8];
                spendingChart.update();
            });
        });
    }

    // Initialize Categories Chart
    function initializeCategoriesChart() {
        const ctx = document.getElementById('categoriesChart');
        if (!ctx) return;

        const categories = {
            'Groceries': 45,
            'Electronics': 20,
            'Clothing': 15,
            'Home & Living': 12,
            'Others': 8
        };

        const colors = ['#00325a', '#fa9600', '#00b894', '#6c5ce7', '#636e72'];

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Create legend
        const legendContainer = document.querySelector('.categories-legend');
        if (legendContainer) {
            legendContainer.innerHTML = Object.entries(categories).map((category, index) => `
                <div class="legend-item">
                    <span class="legend-color" style="background: ${colors[index]}"></span>
                    <span class="legend-label">${category[0]}</span>
                    <span class="legend-value">${category[1]}%</span>
                </div>
            `).join('');
        }
    }

    // Initialize Shopping Pattern Charts
    function initializePatternCharts() {
        // Peak Hours Chart
        const peakHoursCtx = document.getElementById('peakHoursChart');
        if (peakHoursCtx) {
            new Chart(peakHoursCtx, {
                type: 'bar',
                data: {
                    labels: ['9AM', '12PM', '3PM', '6PM', '9PM'],
                    datasets: [{
                        data: [20, 45, 30, 60, 25],
                        backgroundColor: '#00325a80',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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

        // Preferred Days Chart
        const preferredDaysCtx = document.getElementById('preferredDaysChart');
        if (preferredDaysCtx) {
            new Chart(preferredDaysCtx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        data: [30, 25, 35, 40, 45, 60, 50],
                        backgroundColor: '#fa960080',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
    }

    // Initialize Store Performance List
    function initializeStoresList() {
        const storesList = document.querySelector('.stores-list');
        if (!storesList) return;

        const stores = [
            { name: 'Mumbai Central', visits: 24, percentage: 40 },
            { name: 'Andheri West', visits: 18, percentage: 30 },
            { name: 'Bandra East', visits: 12, percentage: 20 },
            { name: 'Dadar West', visits: 6, percentage: 10 }
        ];

        storesList.innerHTML = stores.map(store => `
            <div class="store-item">
                <div class="store-icon">
                    <i class="fas fa-store"></i>
                </div>
                <div class="store-info">
                    <h4 class="store-name">${store.name}</h4>
                    <div class="store-stats">
                        <span>${store.visits} visits</span>
                        <span>${store.percentage}% of total</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${store.percentage}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Handle time period selection
    document.querySelectorAll('.time-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.time-btn.active').classList.remove('active');
            button.classList.add('active');
            // Update charts based on selected period
            updateChartsForPeriod(button.dataset.period);
        });
    });

    // Handle custom date selection
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            if (startDate && endDate) {
                // Update charts based on custom date range
                updateChartsForDateRange(startDate, endDate);
            }
        });
    }

    // Update charts based on selected period
    function updateChartsForPeriod(period) {
        // Add logic to update charts based on selected period
        showNotification(`Data updated for ${period}`, 'success');
    }

    // Update charts based on custom date range
    function updateChartsForDateRange(startDate, endDate) {
        // Add logic to update charts based on date range
        showNotification('Data updated for custom range', 'success');
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

    // Initialize all components
    initializeMetricCharts();
    initializeSpendingTrendsChart();
    initializeCategoriesChart();
    initializePatternCharts();
    initializeStoresList();
});


document.addEventListener("DOMContentLoaded", () => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("No user found! Redirecting to login...");
        window.location.href = "/Revoliq/login/login.html";
        return;
    }

    console.log("User data loaded:", user);

    // Update sidebar profile name
    document.querySelector(".user-info h3").textContent = user.name || "Customer"; 

    // Update welcome message
    document.querySelector(".welcome-section h1").textContent = `Welcome back, ${user.name.split(' ')[0]}! 👋`;

    // Prefill other details if necessary
});
