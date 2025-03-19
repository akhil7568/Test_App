const express = require("express");
const app = express();
require("dotenv").config();

const db = require("./config/db");
const userModel = require("./models/userModel");

app.use(express.json()); // Ensure JSON is parsed

app.get("/", (req, res) => {
    res.send("Hello, Server is Running!");
});

app.get("/users", async(req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

app.post("/create", async(req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging Log

        const { name, email, password, phone, portfolio } = req.body;

        // Check if all required fields are present
        if (!name || !email || !password || !phone || !portfolio) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const user = new userModel({ name, email, password, phone, portfolio });
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.put("/update/:id", async(req, res) => {
    try {
        const userId = req.params.id;
        const { name } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(userId, { name }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User name updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.delete("/delete/:id", async(req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});