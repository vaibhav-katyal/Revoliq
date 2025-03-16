document.addEventListener('DOMContentLoaded', () => {
    // Sample products data
    const products = [
        {
            id: 1,
            name: 'Organic Bananas',
            category: 'groceries',
            price: '₹40',
            image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200'
        },
        {
            id: 2,
            name: 'Wireless Earbuds',
            category: 'electronics',
            price: '₹2,999',
            image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200'
        },
        {
            id: 3,
            name: 'Cotton T-Shirt',
            category: 'fashion',
            price: '₹599',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'
        },
        {
            id: 4,
            name: 'Coffee Maker',
            category: 'home',
            price: '₹4,999',
            image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200'
        }
    ];

    // Sample shopping lists data
    const shoppingLists = [
        {
            id: 1,
            name: 'Weekly Groceries',
            description: 'Essential items for the week',
            date: '2024-02-20',
            items: [1, 2, 3]
        },
        {
            id: 2,
            name: 'Home Improvement',
            description: 'Items for home renovation',
            date: '2024-02-19',
            items: [4]
        }
    ];

    // Populate products grid
    function populateProducts(category = 'all') {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);

        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="favorite-btn" onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">${product.price}</div>
                    <div class="product-actions">
                        <button class="add-to-list-btn" onclick="addToList(${product.id})">
                            <i class="fas fa-list"></i>
                            Add to List
                        </button>
                        <button class="quick-add-btn" onclick="quickAdd(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                            Quick Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Populate shopping lists
    function populateShoppingLists() {
        const listsGrid = document.querySelector('.lists-grid');
        if (!listsGrid) return;

        listsGrid.innerHTML = shoppingLists.map(list => `
            <div class="list-card">
                <div class="list-header">
                    <h3 class="list-title">${list.name}</h3>
                    <span class="list-date">${new Date(list.date).toLocaleDateString()}</span>
                </div>
                <p class="list-description">${list.description}</p>
                <div class="list-items">
                    ${list.items.map(itemId => {
                        const product = products.find(p => p.id === itemId);
                        return `
                            <div class="item-preview">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                        `;
                    }).join('')}
                    ${list.items.length > 3 ? `
                        <div class="items-count">+${list.items.length - 3}</div>
                    ` : ''}
                </div>
                <div class="list-actions">
                    <button class="edit-list-btn" onclick="editList(${list.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="share-list-btn" onclick="shareList(${list.id})">
                        <i class="fas fa-share-alt"></i>
                        Share
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Handle category filtering
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.category-btn.active').classList.remove('active');
            button.classList.add('active');
            populateProducts(button.dataset.category);
        });
    });

    // Handle create list button
    const createListBtn = document.querySelector('.create-list-btn');
    const createListModal = document.getElementById('createListModal');
    const closeModal = document.querySelector('.close-modal');

    if (createListBtn && createListModal) {
        createListBtn.addEventListener('click', () => {
            createListModal.classList.add('show');
            populateProductSelector();
        });
    }

    if (closeModal && createListModal) {
        closeModal.addEventListener('click', () => {
            createListModal.classList.remove('show');
        });

        // Close modal when clicking outside
        createListModal.addEventListener('click', (e) => {
            if (e.target === createListModal) {
                createListModal.classList.remove('show');
            }
        });
    }

    // Populate product selector in create list modal
    function populateProductSelector() {
        const productSelector = document.querySelector('.product-selector');
        if (!productSelector) return;

        productSelector.innerHTML = products.map(product => `
            <div class="product-select-item">
                <input type="checkbox" id="product-${product.id}" value="${product.id}">
                <label for="product-${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <span>${product.name}</span>
                    <span class="price">${product.price}</span>
                </label>
            </div>
        `).join('');

        // Add styles for product selector items
        const style = document.createElement('style');
        style.textContent = `
            .product-select-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                border-bottom: 1px solid var(--border);
            }

            .product-select-item:last-child {
                border-bottom: none;
            }

            .product-select-item label {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex: 1;
                cursor: pointer;
            }

            .product-select-item img {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                object-fit: cover;
            }

            .product-select-item .price {
                margin-left: auto;
                color: var(--primary);
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }

    // Handle form submission
    const createListForm = document.getElementById('createListForm');
    if (createListForm) {
        createListForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            // Add form submission logic here
            createListModal.classList.remove('show');
            showNotification('Shopping list created successfully!');
        });
    }

    // Global functions
    window.toggleFavorite = (productId) => {
        // Add favorite toggle logic here
        showNotification('Product removed from favorites');
    };

    window.addToList = (productId) => {
        createListModal.classList.add('show');
        populateProductSelector();
        // Pre-select the product in the modal
        const checkbox = document.querySelector(`#product-${productId}`);
        if (checkbox) checkbox.checked = true;
    };

    window.quickAdd = (productId) => {
        // Add quick add logic here
        showNotification('Product added to cart');
    };

    window.editList = (listId) => {
        // Add edit list logic here
        showNotification('Editing list...');
    };

    window.shareList = (listId) => {
        // Add share list logic here
        showNotification('List shared successfully!');
    };

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

    // Initialize components
    populateProducts();
    populateShoppingLists();
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
