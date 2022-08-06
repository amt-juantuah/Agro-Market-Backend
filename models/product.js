const mongoose = require('mongoose');

// create schema
const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required:true},
        description: { type: String, required: true},
        measurement: { type: String },
        image: { type: String, required: true},
        category: { type: Array, required: true },
        price: { type: Number, required:true },
        market: { type: String }
    },
    { timestamps: true }
)


module.exports = mongoose.model('Product', ProductSchema);