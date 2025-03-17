require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Firebase Service Key

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));



  const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true }, // Ensure UID is unique
    email: { type: String, required: true, unique: true }, // Prevent duplicate emails
    name: { type: String },
    userType: { type: String, enum: ['customer', 'retailer'], default: 'customer' },
    storeName: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


app.post('/api/storeUser', async (req, res) => {
    try {
        console.log("📩 Received request to store user:", req.body);

        const { uid, email, name, userType, storeName } = req.body;

        if (!uid || !email) {
            console.error("❌ Missing UID or Email");
            return res.status(400).json({ success: false, message: "UID and Email are required" });
        }

        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.error("❌ MongoDB is NOT connected!");
            return res.status(500).json({ success: false, message: "MongoDB not connected" });
        }

        // Check if a user with the same email already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ Email already exists:", existingUser);
            return res.status(400).json({ success: false, message: "Email already registered. Please log in." });
        }

        // Check if the UID already exists (unlikely, but good practice)
        let existingUID = await User.findOne({ uid });
        if (existingUID) {
            console.log("⚠️ UID already exists:", existingUID);
            return res.status(400).json({ success: false, message: "User already exists. Please log in." });
        }

        // Store user in MongoDB
        const user = new User({ uid, email, name, userType, storeName });
        await user.save();
        console.log("✅ User saved successfully in MongoDB!");

        res.json({ success: true, message: "User saved in MongoDB" });
    } catch (error) {
        console.error("❌ Error storing user in MongoDB:", error);
        res.status(500).json({ success: false, message: "Error storing user", error: error.message });
    }
});



app.get('/api/getUser/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", error });
    }
});


// Cart Schema
const cartSchema = new mongoose.Schema({
    cartId: { type: String, required: true, unique: true },
    retailerId: { type: String, required: true },
    products: [{ 
        productId: String, 
        name: String, 
        price: Number, 
        quantity: Number 
    }],
    active: { type: Boolean, default: true },
    qrCode: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
const qrcode = require('qrcode'); // ✅ Import QR Code library

// Scanned Cart Schema
const scannedCartSchema = new mongoose.Schema({
    cartId: { type: String, required: true },
    retailerId: { type: String, required: true },
    scannedAt: { type: Date, default: Date.now }
});

const ScannedCart = mongoose.model('ScannedCart', scannedCartSchema);

// Get all carts
app.get('/carts', async (req, res) => {
    try {
        const carts = await Cart.find().sort({ createdAt: -1 });
        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Retailer adds a new cart
app.post('/cart/add', async (req, res) => {
    try {
        console.log("📩 Received request to add cart:", req.body);

        const { cartId, retailerId } = req.body;

        if (!cartId || !retailerId) {
            console.error("❌ Missing cartId or retailerId");
            return res.status(400).json({ message: "Cart ID and Retailer ID are required" });
        }

        // Check if the cart already exists
        const existingCart = await Cart.findOne({ cartId });
        if (existingCart) {
            console.log("⚠️ Cart already exists:", existingCart);
            return res.status(400).json({ message: "Cart already exists" });
        }

        // Generate QR code
        console.log("🖼 Generating QR Code...");
        const qrData = JSON.stringify({ cartId, retailerId });
        const qrCode = await qrcode.toDataURL(qrData);

        // Create new cart
        const newCart = new Cart({
            cartId,
            retailerId,
            products: [],
            qrCode
        });

        await newCart.save();
        console.log("✅ Cart added successfully!");

        res.status(201).json({ message: "Cart added successfully!", cart: newCart });
    } catch (error) {
        console.error("❌ Error adding cart:", error);
        res.status(500).json({ message: "Error adding cart", error: error.message });
    }
});


// Scan QR code and verify cart
app.post('/api/qr/scan', async (req, res) => {
    try {
        const { cartId, retailerId, userId } = req.body;

        // Ensure all required fields are present
        if (!cartId || !retailerId || !userId) {
            return res.status(400).json({ message: "Missing cartId, retailerId, or userId" });
        }

        // Check if cart exists and is active
        let cart = await Cart.findOne({ cartId, retailerId });

        if (!cart) {
            return res.status(404).json({ message: "Invalid cart" });
        }

        if (!cart.active) {
            return res.status(400).json({ message: "Cart is inactive" });
        }

        // Ensure cart is assigned to the correct user
        cart.userId = userId;
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart linked successfully!",
            cartId: cart.cartId
        });
    } catch (error) {
        res.status(500).json({ message: "Error linking cart", error });
    }
});

// Product Schema
const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 10 },
    image: String,
    scannedAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// Added Products Schema
const addedProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    barcode: String,
    createdAt: { type: Date, default: Date.now }
});
const AddedProduct = mongoose.model('Added_Pdts', addedProductSchema);

// Find product by barcode
app.get('/products/find/:barcode', async (req, res) => {
    try {
        const { barcode } = req.params;
        const product = await AddedProduct.findOne({ barcode });
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Scan and add to cart
app.post('/scan', async (req, res) => {
    try {
        const { barcode, userId } = req.body;

        if (!barcode || !userId) {
            return res.status(400).json({ message: "Missing barcode or userId" });
        }

        // Find the active cart for this user
        let cart = await Cart.findOne({ userId, active: true });

        if (!cart) {
            return res.status(404).json({ message: "No active cart found for this user" });
        }

        // Find product details
        let product = await AddedProduct.findOne({ barcode });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is already in the user's cart
        let cartProduct = cart.products.find(p => p.productId === barcode);

        if (cartProduct) {
            cartProduct.quantity += 1; // Increase quantity if already exists
        } else {
            cart.products.push({
                productId: barcode,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        await cart.save();

        res.status(201).json({ message: "Product added to your cart!", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// Fetch all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ scannedAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Update product details
app.put('/products/:id', async (req, res) => {
    try {
        const { quantity, price } = req.body;
        if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.quantity = quantity;
        product.price = price;
        await product.save();

        res.json({ message: "Product updated!", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Add new product
app.post('/products/add', async (req, res) => {
    try {
        const { name, price, image, barcode } = req.body;
        
        if (!name || !price || !barcode) {
            return res.status(400).json({ message: "Name, price, and barcode are required" });
        }

        const newProduct = new AddedProduct({
            name,
            price,
            image,
            barcode
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Fetch all added products
app.get('/products/added', async (req, res) => {
    try {
        const products = await AddedProduct.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.get('/api/products/orders/:userId', async (req, res) => {
    try {
        const products = await AddedProduct.find()
            .sort({ createdAt: -1 });
        
        // Transform products into order-like structure
        const transformedProducts = products.map(product => ({
            orderId: product._id,
            date: product.createdAt,
            name: product.name,
            total: product.price,
            status: 'completed' // Default status
        }));
        
        res.json(transformedProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

// Add this endpoint to fetch single product details
app.get('/api/product/detail/:id', async (req, res) => {
    try {
        const product = await AddedProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product details", error: error.message });
    }
});

// Endpoint to end cart session
// app.post('/api/cart/end-session', async (req, res) => {
//     try {
//         const { cartId, userId, duration } = req.body;

//         // Create scanned cart record
//         const scannedCart = new ScannedCart({
//             cartId,
//             retailerId: userId,
//             duration,
//             scannedAt: new Date()
//         });
//         await scannedCart.save();

//         res.json({ success: true, message: "Cart session ended successfully" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error ending cart session", error: error.message });
//     }
// });

// Endpoint to get cart history
app.get('/api/cart/history/:userId', async (req, res) => {
    try {
        const scannedCarts = await ScannedCart.find({ retailerId: req.params.userId })
            .sort({ scannedAt: -1 })
            .limit(10);
        res.json(scannedCarts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart history", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));