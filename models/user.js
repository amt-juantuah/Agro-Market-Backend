const mongoose = require('mongoose');

// create schema
const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required:true, unique:true},
        email: { type: String, required:true, unique: true },
        location: { type: String },
        market: { type: String },
        password: { type: String, required:true },
        isAdmin: { type: Boolean, default: false, },
    },
    { timestamps: true }
)
const me = UserSchema.findOne

module.exports = mongoose.model('User', UserSchema);