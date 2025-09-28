// index.js

require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Allows server to accept JSON in request body

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// --- Mongoose User Schema & Model ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

// --- API Endpoints (Routes) will go here ---
// index.js (continued)

app.get("/aphrodite", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// --- API Endpoints (Routes) ---

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // 4. Create a JWT
    const token = jwt.sign(
        { userId: newUser._id, name: newUser.name },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(201).json({ token, userName: newUser.name });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error });
  }
});


// POST /api/login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        
        // 3. Create a JWT
        const token = jwt.sign(
            { userId: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, userName: user.name });

    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});