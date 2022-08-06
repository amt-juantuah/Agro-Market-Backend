// Use Express Router
const router = require('express').Router();
const { veryfyToken, verifyTokenAndAdmin } = require('./verifyToken')

// import crypto-js
const cryptoJS = require('crypto-js');

// import the cart model
const dbCart = require('../models/Cart');


// CREATE cart
router.post('/', veryfyToken, async (req, res) => {
    const cart = new dbCart(req.body);

    try {
        const newCart = await cart.save();

        res.status(200).json(newCart);
    } catch(err) {
        res.status(500).json(err);
    }
})


// UPDATE cart
router.put('/:id', veryfyToken,  async (req, res) => {
    
    try {
        const updatedCart = await dbCart.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body
            }, {new: true});
        res.status(201).json(updatedCart);
    } catch(err) {
        res.status(500).json(err);
    }
})

// DELETE cart
router.delete('/delete/:id', veryfyToken, async (req, res) => {
    try {
        await dbCart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart Deleted Successfully")
    } catch(err) {
        res.status(500).json(err);
    }
})

// GET USER Cart
router.get('/find/:userId', veryfyToken, async (req, res) => {
    try {
        const cart = await dbCart.findOne(
            {
                userId: req.params.userId
            }
        );
        res.status(200).json(cart);

    } catch(err) {
        res.status(500).json(err);
    }
})

// FIND all carts
router.get('/find/',verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await dbCart.find();

        res.status(200).json(carts)
        
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;