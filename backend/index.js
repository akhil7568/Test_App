const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require('./models/userModel')
const app = express();
app.use(express.json());
dotenv.config();



// Routes
app.get("/", (req, res) => res.send("Hello, Server is Running!"));

app.get("/users", async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

app.post("/create", async(req, res) => {
    try {


        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.put("/update/:id", async(req, res) => {
    try {
        const { name } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.delete("/delete/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));