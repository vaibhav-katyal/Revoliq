// API Base URL
const API_URL = 'http://localhost:5000';

// Fetch and display products
async function fetchProducts() {
    try {
        // Fetch both regular and added products
        const [regularResponse, addedResponse] = await Promise.all([
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/products/added`)
        ]);

        const regularProducts = await regularResponse.json();
        const addedProducts = await addedResponse.json();

        // Combine and display all products
        displayProducts([...regularProducts, ...addedProducts]);
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
    document.getElementById('barcodePreview').innerHTML = '';
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

document.getElementById('barcodeInput').addEventListener('change', function() {
    handleImagePreview(this, 'barcodePreview');
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
    let image = '';
    let barcode = '';

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

        // Get barcode data
        const barcodeFile = document.getElementById('barcodeInput').files[0];
        if (barcodeFile) {
            barcode = await convertToBase64(barcodeFile);
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