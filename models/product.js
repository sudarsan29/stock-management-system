const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    name: {
        type: String,
        reeuire: true
    },
    category: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stockQuantity: {
        type: Number,
        require: true
    },
    itemSold: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    }
}, {timestamps: true})

mongoose.model('ProductModel', productSchema)