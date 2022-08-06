const router = require('express').Router();

// import the User model
const dbUser = require('../models/User');

// import crypto-js
const cryptoJS = require('crypto-js');

// import the jwt
const jwt = require('jsonwebtoken');



// Register
router.post('/register', async (req, res) => {
    const newUser = new dbUser({
        username: req.body.username,
        email: req.body.email,
        location: req.body.location,
        market: req.body.market,
        password: cryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString(),
        isAdmin: req.body.isAdmin
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(err) {
        res.status(500).json(err);
    }
})


// Login route
router.post('/login', async (req, res) => {

    // how to find our user inside our database
    try {
        // username is unique for each user
        const user = await dbUser.findOne(
            { 
                username: req.body.username 
            }
        );

        // reject request if user doesnt exist
        if (!user) {
            res.status(403).json("Forbidden!! Username is wrong or User doesn't exist");
        }

        // decrypt the encrypted user password in the database
        const userPassword = cryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(cryptoJS.enc.Utf8);

        // reject request if password is wrong for user
        if (userPassword !== req.body.password) {
            res.status(401).json("Wrong password");
        }

        // get jwt access token
        // for a user with noted id and isAdmin
        // take note to provide the jwt key you specified 
        // in the dotenv file
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            }, 
            process.env.JWT_KEY,
            { expiresIn: "2d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({accessToken, ...others});

    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;