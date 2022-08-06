// Use Express Router
const router = require('express').Router();
const { veryfyToken, verifyTokenAndAdmin } = require('./verifyToken')

// import crypto-js
const cryptoJS = require('crypto-js');

// import the order model
const dbOrder = require('../models/Order');


// CREATE order
router.post('/', veryfyToken, async (req, res) => {
    const order = new dbOrder(req.body);

    try {
        const newOrder = await order.save();

        res.status(200).json(newOrder);
    } catch(err) {
        res.status(500).json(err);
    }
})


// UPDATE order
router.put('/:id', verifyTokenAndAdmin,  async (req, res) => {
    
    try {
        const updatedOrder = await dbOrder.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body
            }, {new: true});
        res.status(201).json(updatedOrder);
    } catch(err) {
        res.status(500).json(err);
    }
})

// DELETE order
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await dbOrder.findByIdAndDelete(req.params.id);
        res.status(200).json("Order Deleted Successfully")
    } catch(err) {
        res.status(500).json(err);
    }
})

// GET USER orders
router.get('/find/:userId', veryfyToken, async (req, res) => {
    try {
        const orders = await dbOrder.find(
            {
                userId: req.params.userId
            }
        );
        res.status(200).json(cart);

    } catch(err) {
        res.status(500).json(err);
    }
})

// admin FIND all orders
router.get('/find/',verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await dbOrder.find();

        res.status(200).json(orders);

    } catch(err) {
        res.status(500).json(err);
    }
})


// Get Orders stats per month
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const latestMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevLatestMonth = new Date(date.setMonth(latestMonth.getMonth() - 1));

    try {

        const income = await dbOrder.aggregate([
            {
                $match: {
                    createdAt: { $gte: prevLatestMonth }
                }
            },

            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                }
            },

            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);
        res.status(200).json(income);
    } catch(err) {
        res.status(500).json(err);
    }
})

// // Get product stat
// // Example: listed products per month
// router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
//     const date = new Date();
//     const latestYear = new Date(date.setFullYear(date.getFullYear() - 1));

//     try {

//         const data = await dbProduct.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: latestYear }
//                 }
//             },

//             {
//                 $project: {
//                     month: { $month: "$createdAt" }
//                 }
//             },

//             {
//                 $group: {
//                     _id: "$month",
//                     total: { $sum: 1 }
//                 }
//             }
//         ]);
//         res.status(200).json(data);
        
//     } catch(err) {
//         res.status(500).json("error");
//     }
// })

module.exports = router;