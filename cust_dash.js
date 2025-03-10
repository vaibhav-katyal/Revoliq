const API_URL = "http://localhost:5000"; // Change this to your API endpoint

// Fetch data
async function fetchData() {
    try {
        const response = await fetch(`${API_URL}/purchases`);
        const data = await response.json();

        updateDashboard(data);
        updateOrders(data);
        updateChart(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Update Dashboard Stats
function updateDashboard(data) {
    const totalPurchases = data.length;
    const totalSpent = data.reduce((sum, item) => sum + item.price, 0);

    document.getElementById("totalPurchases").textContent = totalPurchases;
    document.getElementById("totalSpent").textContent = `$${totalSpent.toFixed(2)}`;
}

// Update Orders Table
function updateOrders(data) {
    const ordersTable = document.getElementById("ordersTable");
    ordersTable.innerHTML = "";

    data.forEach(order => {
        ordersTable.innerHTML += `
            <tr>
                <td>#${order.id}</td>
                <td>${order.product}</td>
                <td>$${order.price.toFixed(2)}</td>
                <td>${order.status}</td>
            </tr>
        `;
    });
}

// Update Chart
function updateChart(data) {
    const ctx = document.getElementById("purchaseChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map(order => order.product),
            datasets: [{
                label: "Spending ($)",
                data: data.map(order => order.price),
                borderColor: "#00325a",
                fill: false,
            }]
        },
        options: {
            responsive: true,
        }
    });
}

// Page Navigation
document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", function() {
        document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
        document.getElementById(this.dataset.page).classList.add("active");

        document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
        this.classList.add("active");
    });
});

// Fetch data on load
fetchData();
