const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// import the user route
const userRoute = require('./Routes/users');

// import the auth route
const authRoute = require('./Routes/auth');

// import the product route
const productRoute = require('./Routes/product');

// import the cart route
const cartRoute = require('./Routes/cart');

// import the order route
const orderRoute = require('./Routes/order');

// import the stripe route
const stripeRoute = require('./Routes/stripe');


// configure the dotenv file
dotenv.config();


// Create an express APP
const app = express();

// Connect to mongodb
// const uri = "mongodb+srv://<username>:<password>@cluster0.uh43p.mongodb.net/?retryWrites=true&w=majority";

const uri = process.env.MONGO_URL;
mongoose.connect(uri)
    .then(() => {console.log('DB connection is successful')})
    .catch((err) => {console.log(err)})

// Declare PORT
const port = process.env.PORT || 3000;


// Test an REST API
app.get('/api/test', (req, res) => {
    console.log('Test is successful');
    res.send("API IS WORKING");
})

// use express json
app.use(express.json());

// use cors
app.use(cors());

// use the userRoute
app.use('/api/user', userRoute);


// use the authRoute
app.use('/api/auth', authRoute);

// use the productRoute
app.use('/api/products', productRoute);


// use the cartRoute
app.use('/api/cart', cartRoute);

// use the orderRoute
app.use('/api/order', orderRoute);

// use the stripeRoute
app.use('/api/pay', stripeRoute);


// APP listening on PORT
app.listen(port, (req, res) => {
    console.log(`Server is running on http://localhost:${port}. Press on CTRL + C to quit or stop server`);
})