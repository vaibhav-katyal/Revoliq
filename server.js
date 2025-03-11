require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // Increased limit for base64 images

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Product Schema (existing)
const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 10 },
    image: String,
    scannedAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// Added Products Schema (new)
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
        const { barcode } = req.body;
        
        // Find product in Added_Pdts collection
        const addedProduct = await AddedProduct.findOne({ barcode });
        
        if (!addedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product already exists in Products collection
        let product = await Product.findOne({ id: barcode });
        
        if (product) {
            // Update existing product quantity
            product.quantity += 1;
        } else {
            // Create new product
            product = new Product({
                id: barcode,
                name: addedProduct.name,
                price: addedProduct.price,
                image: addedProduct.image,
                quantity: 1,
                scannedAt: new Date()
            });
        }
        
        await product.save();
        res.status(201).json({ message: "Product scanned and added!", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ scannedAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

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

app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

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

app.get('/products/added', async (req, res) => {
    try {
        const products = await AddedProduct.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));