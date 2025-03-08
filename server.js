require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

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

// API to store scanned product
app.post('/scan', async (req, res) => {
    try {
        const { id, name, price, image, scannedAt } = req.body;
        if (!id || !name || !price || !image) return res.status(400).json({ message: "Product ID, name, price, and image are required" });

        let product = await Product.findOne({ id });
        if (product) {
            product.quantity += 1;
            product.price += price;
        } else {
            product = new Product({ id, name, price, image, scannedAt });
        }
        await product.save();

        res.status(201).json({ message: "Product saved!", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// API to get scanned products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ scannedAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// API to update product quantity and price
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

// API to delete a product
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));