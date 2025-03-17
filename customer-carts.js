document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    // Update profile name
    document.querySelector(".user-info h3").textContent = user.name || "Customer";

    let startTime = parseInt(localStorage.getItem('cartStartTime')) || 0;
    let activeCartId = localStorage.getItem('activeCartId');
    let timer;

    function updateShoppingTime() {
        if (!startTime) return;

        const currentTime = new Date().getTime();
        const elapsedMinutes = Math.floor((currentTime - startTime) / 60000);
        const elapsedSeconds = Math.floor(((currentTime - startTime) % 60000) / 1000);

        document.querySelector('.cart-stats').innerHTML = `
            <div class="stat">
                <i class="fas fa-clock"></i>
                <span>${elapsedMinutes}m ${elapsedSeconds}s</span>
                <label>Shopping Time</label>
            </div>
        `;
    }

    // Update active cart display
    function updateActiveCart() {
        if (!activeCartId) {
            document.querySelector('.active-cart-details').innerHTML = `
                <p>No active cart session</p>
            `;
            document.querySelector('.cart-status').className = 'cart-status disconnected';
            document.querySelector('.cart-status').innerHTML = `
                <i class="fas fa-times"></i> Disconnected
            `;
            return;
        }

        document.querySelector('.cart-id h3').textContent = `Cart #${activeCartId}`;
        document.querySelector('.cart-status').className = 'cart-status connected';
        document.querySelector('.cart-status').innerHTML = `
            <i class="fas fa-wifi"></i> Connected
        `;

        // Start timer
        timer = setInterval(updateShoppingTime, 1000);
        updateShoppingTime();
    }

    // Fetch and display cart history
    async function fetchCartHistory() {
        try {
            const response = await fetch(`https://revoliq.onrender.com/api/cart/history/${user.uid}`);
            const history = await response.json();

            const historyCards = document.querySelector('.history-cards');
            historyCards.innerHTML = history.map(cart => `
                <div class="history-card">
                    <div class="history-card-header">
                        <h4>Cart #${cart.cartId}</h4>
                        <span class="history-card-date">
                            ${new Date(cart.scannedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div class="history-card-details">
                        <div class="detail-row">
                            <span class="detail-label">Duration</span>
                            <span class="detail-value">${Math.floor(cart.duration / 60)}m ${cart.duration % 60}s</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching cart history:', error);
        }
    }

    // Handle end session
    const endSessionBtn = document.querySelector('.end-session-btn');
    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', async () => {
            if (!activeCartId) return;

            if (confirm('Are you sure you want to end this shopping session?')) {
                const currentTime = new Date().getTime();
                const duration = Math.floor((currentTime - startTime) / 1000); // Duration in seconds

                try {
                    const response = await fetch('https://revoliq.onrender.com/api/cart/end-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            cartId: activeCartId,
                            userId: user.uid,
                            duration
                        })
                    });

                    if (response.ok) {
                        clearInterval(timer);
                        localStorage.removeItem('cartStartTime');
                        localStorage.removeItem('activeCartId');
                        activeCartId = null;
                        startTime = 0;

                        updateActiveCart();
                        fetchCartHistory();

                        showNotification('Shopping session ended successfully', 'success');
                    }
                } catch (error) {
                    console.error('Error ending session:', error);
                    showNotification('Error ending session', 'error');
                }
            }
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

    // Initialize
    updateActiveCart();
    fetchCartHistory();
});