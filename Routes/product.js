// Use Express Router
const router = require('express').Router();
const { veryfyToken, verifyTokenAndAdmin } = require('./verifyToken')

// import crypto-js
const cryptoJS = require('crypto-js');

// import the User model
const dbProduct = require('../models/Product');



// CREATE product
router.post('/new', veryfyToken, async (req, res) => {
    const product = new dbProduct({
        title: req.body.title,
        description: req.body.description,
        measurement: req.body.measurement,
        image: req.body.image,
        category: req.body.category,
        price: req.body.price,
        market: req.body.market
    })

    try {
        const newProduct = await product.save();

        res.status(200).json(newProduct);
    } catch(err) {
        res.status(500).json(err);
    }
})


// UPDATE Admin can update a product record
router.put('/update/:id', verifyTokenAndAdmin,  async (req, res) => {
    
    try {
        const updatedProduct = await dbProduct.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body
            }, {new: true});
        res.status(201).json(updatedProduct);
    } catch(err) {
        res.status(500).json(err);
    }
})

// DELETE Admin can delete a product record
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await dbProduct.findByIdAndDelete(req.params.id);
        res.status(200).json("Product Deleted Successfully")
    } catch(err) {
        res.status(500).json(err);
    }
})

// FIND a product
router.get('/find/:id', async (req, res) => {
    try {
        const product = await dbProduct.findById(req.params.id);
        res.status(200).json(product);

    } catch(err) {
        res.status(500).json(err);
    }
})

// FIND all products
router.get('/find/', async (req, res) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try {
        let products;
        if (queryNew && !queryCategory) {
            products = await dbProduct.find().sort({ createdAt: -1}).limit(10);

        } else if (!queryNew && queryCategory) {
            products = await dbProduct.find(
                { category: 
                    { 
                        $in: [queryCategory]
                    }
                }
            ).sort({ createdAt: -1});
        } else if (queryNew && queryCategory) {
            products = await dbProduct.find(
                { category: 
                    { 
                        $in: [queryCategory]
                    }
                }
            ).sort({ createdAt: -1}).limit(10);

        } else {
            products = await dbProduct.find().sort({ createdAt: -1});
        }
        
        res.status(200).json(products);
        
    } catch(err) {
        res.status(500).json(err);
    }
})


// Get product stat
// Example: listed products per month
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const latestYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {

        const data = await dbProduct.aggregate([
            {
                $match: {
                    createdAt: { $gte: latestYear }
                }
            },

            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },

            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
        
    } catch(err) {
        res.status(500).json("error");
    }
})


module.exports = router;