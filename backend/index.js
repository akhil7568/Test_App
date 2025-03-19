const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error(" MongoDB Connection Error:", err));

// Middleware
app.use(express.json());

// User Schema & Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxLength: 50, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6, maxLength: 12, required: true },
    phone: { type: String },
    portfolio: { type: String },
});

const User = mongoose.model("User", userSchema);

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
        const { name, email, password, phone, portfolio } = req.body;


        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const user = new User({ name, email, password, phone, portfolio });
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