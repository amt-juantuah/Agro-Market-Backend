// Use Express Router
const router = require('express').Router();
const { veryfyToken, verifyTokenAndAdmin } = require('./verifyToken')

// import crypto-js
const cryptoJS = require('crypto-js');

// import the User model
const dbUser = require('../models/User');


// UPDATE User can update records
router.put('/:id', veryfyToken,  async (req, res) => {
    if (req.body.password) {
        req.body.password = cryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString()
    }

    try {
        const updatedUser = await dbUser.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(201).json(updatedUser);
    } catch(err) {
        res.status(500).json(err);
    }
})

// DELETE Admin can delete a user
router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await dbUser.findByIdAndDelete(req.params.id);
        res.status(200).json("User Account Deleted Successfully")
    } catch(err) {
        res.status(500).json(err);
    }
})

// FIND get a user
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await dbUser.findById(req.params.id);

        // this user data includes the user's password. Remove the password
        const { password, ...others } = user._doc;
        res.status(200).json(others);

    } catch(err) {
        res.status(500).json(err);
    }
})

// FIND get all users
router.get('/find/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await dbUser.find().sort({ createdAt: -1}).limit(5) : await dbUser.find();
        res.status(200).json(users);
        // there is a problem. this will display the passwords of all users. Let us get rid of this problem
    } catch(err) {
        res.status(500).json(err);
    }
})


// Get users stat
// Example: registered users per month
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const latestYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {

        const data = await dbUser.aggregate([
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