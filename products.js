// API Base URL
const API_URL = 'http://localhost:5000';

// Fetch and display products
async function fetchProducts() {
    try {
        // Fetch added products only
        const response = await fetch(`${API_URL}/products/added`);
        const addedProducts = await response.json();

        // Display added products
        displayProducts(addedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products in grid
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetails('${product._id}')">
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${(product.price / (product.quantity || 1)).toFixed(2)}</p>
                <div class="product-stats">
                    <div class="stat">
                        <div class="stat-label">Stock</div>
                        <div class="stat-value">${product.quantity || 1}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Orders</div>
                        <div class="stat-value">${Math.floor(Math.random() * 50)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Revenue</div>
                        <div class="stat-value">₹${product.price.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Add Product Modal Functions
function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    document.getElementById('addProductForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
}

// Handle image preview
function handleImagePreview(input, previewId) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Handle image type selection
document.getElementsByName('imageType').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const urlInput = document.getElementById('imageUrlInput');
        const fileInput = document.getElementById('imageFileInput');
        
        if (e.target.value === 'url') {
            urlInput.style.display = 'block';
            fileInput.style.display = 'none';
        } else {
            urlInput.style.display = 'none';
            fileInput.style.display = 'block';
        }
    });
});

// Preview handlers
document.getElementById('imageFileInput').addEventListener('change', function() {
    handleImagePreview(this, 'imagePreview');
});

document.getElementById('imageUrlInput').addEventListener('input', function() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    if (this.value) {
        const img = document.createElement('img');
        img.src = this.value;
        preview.appendChild(img);
    }
});

// Handle form submission
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const barcode = document.getElementById('barcodeInput').value;
    let image = '';

    try {
        // Get image data
        if (document.getElementById('imageUrl').checked) {
            image = document.getElementById('imageUrlInput').value;
        } else {
            const imageFile = document.getElementById('imageFileInput').files[0];
            if (imageFile) {
                image = await convertToBase64(imageFile);
            }
        }

        const response = await fetch(`${API_URL}/products/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                price,
                image,
                barcode
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Product added successfully!');
            closeAddProductModal();
            await fetchProducts(); // Refresh the products list
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert(`Failed to add product: ${error.message}`);
    }
});

// Utility function to convert file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Search products
document.getElementById('searchProducts').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        product.style.display = name.includes(searchTerm) ? 'block' : 'none';
    });
});

// Initialize
fetchProducts();
// Refresh data every 30 seconds
setInterval(fetchProducts, 30000);

// Open/Close Cart Modal
function openAddCartModal() {
    document.getElementById('addCartModal').style.display = 'block';
}

function closeAddCartModal() {
    document.getElementById('addCartModal').style.display = 'none';
}

// Handle Add Cart Form Submission
document.getElementById('addCartForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const cartId = document.getElementById('cartId').value;
    const retailerId = document.getElementById('retailerId').value;

    try {
        const response = await fetch('http://localhost:5000/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId, retailerId })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cart added successfully!');
            closeAddCartModal();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert(`Failed to add cart: ${error.message}`);
    }
});
