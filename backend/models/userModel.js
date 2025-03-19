const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        maxLength: 12,
        required: true
    },
    phone: {
        type: String
    },
    portfolio: {
        type: String
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;