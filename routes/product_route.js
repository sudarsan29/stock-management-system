const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductModel = mongoose.model("ProductModel");
const protectedRoute = require('../middleware/protectedResource');


// Creating the product
router.post("/createProduct", protectedRoute, (req, res) => {
    const { name, image, category, price, stockQuantity, itemSold, description } = req.body;
    if(!name || !category || !image|| !price || !stockQuantity || !itemSold || !description) {
        return res.status(400).json({error: "One or more mandatory fields are missing"});
    }

    const product = new ProductModel({name, image, category, price, stockQuantity, itemSold: itemSold || 0, description});
    product.save()
    .then((savedProduct) => {
        res.status(201).json({ product: savedProduct});
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Product creation has been failed"});
    });
});

// Getting all products
router.get("/allProducts", protectedRoute, (req,res) => {
    ProductModel.find()
    .then((products) => {
        res.status(200).json({ products });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Failed to get the products"});
    });
});

// Update the product details
router.put("/updateProduct/:id", protectedRoute, (req, res) => {
    const updateData = req.body;

    ProductModel.findByIdAndUpdate(req.params.id, updateData, { new: true})
    .then((updatedProduct) => {
        res.status(200).json({ product: updatedProduct });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json( { error: "Failed to update the product "});
    });
});

// Delete the product
router.delete("/deleteProduct/:id", protectedRoute, (req,res) => {
    ProductModel.findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(200).json( { message: "Product deleted successfully" });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error : "Failed to delete the product"});
    });
});  

// Fetch the stock data
router.get("/stockData", protectedRoute, (req, res) => {
    ProductModel.find()
    .then((products) => {
        const totalItemSold = products.reduce((sum, product) => sum + product.itemSold, 0);
        const totalRevenue = products.reduce((sum, product) => sum + (product.itemSold * product.price), 0);
        res.status(200).json({ totalItemSold, totalRevenue, products });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Failed to calculate stock overview" });
    });
});

module.exports = router;