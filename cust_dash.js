const API_URL = "http://localhost:5000"; // Change this to your actual API endpoint

// Fetch user purchases & update UI
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

// ✅ Update Dashboard Stats
function updateDashboard(data) {
    const totalPurchases = data.length;
    const totalSpent = data.reduce((sum, item) => sum + item.price, 0);

    document.getElementById("totalPurchases").textContent = totalPurchases;
    document.getElementById("totalSpent").textContent = `$${totalSpent.toFixed(2)}`;
}

// ✅ Update Orders Table
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

// ✅ Update Spending Chart
function updateChart(data) {
    const ctx = document.getElementById("purchaseChart").getContext("2d");

    if (window.purchaseChart) {
        window.purchaseChart.destroy(); // Destroy previous chart if exists
    }

    window.purchaseChart = new Chart(ctx, {
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

// ✅ Handle User Authentication & Profile Display
import { auth, db, doc, getDoc, signOut } from "./login/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const userIdSpan = document.getElementById("userId");
    const userNameSpan = document.getElementById("userName");
    const userEmailSpan = document.getElementById("userEmail");
    const logoutButton = document.getElementById("logout");

    // Check if user is logged in
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                userIdSpan.textContent = userData.uid;
                userNameSpan.textContent = userData.name;
                userEmailSpan.textContent = userData.email;
            } else {
                console.error("User document not found in Firestore.");
            }
        } else {
            // Redirect to login if not logged in
            window.location.href = "login.html";
        }
    });

    // ✅ Logout functionality
    logoutButton.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });
});

// ✅ Page Navigation
document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

    navButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons
            navButtons.forEach((btn) => btn.classList.remove("active"));

            // Add active class to clicked button
            this.classList.add("active");

            // Hide all pages
            pages.forEach((page) => page.classList.remove("active"));

            // Show the selected page
            const selectedPage = document.getElementById(this.dataset.page);
            if (selectedPage) {
                selectedPage.classList.add("active");
            }
        });
    });
});

// ✅ Fetch data on page load
fetchData();
