const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        lowercase: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
        maxLength: 12,
    },
    phone: {
        type: Number,
        required: [true, "Phone is required"],
    },
    portfolio: {
        type: String,
        required: [true, "Portfolio is required"],
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;