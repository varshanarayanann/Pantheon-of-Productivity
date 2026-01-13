// index.js
const { GoogleGenAI } = require('@google/genai');

require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

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

// --- Journal Schema & Model ---
const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: Number,
    default: 1
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Journal = mongoose.model('Journal', JournalSchema);




// --- API Endpoints (Routes) will go here ---
// index.js (continued)

app.get("/aphrodite", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// --- API Endpoints (Routes) ---

// GET /api/music - Serves the Muses music playlist
app.get('/api/music', (req, res) => {
  const filePath = path.join(__dirname, '../muses-backend/data', 'muses-music.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).send('Server Error');
    }
    try {
      const musicData = JSON.parse(data);
      res.json(musicData);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).send('Invalid JSON format');
    }
  });
});

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

    res.status(201).json({ token, userName: newUser.name, userId: newUser._id });

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

        res.status(200).json({ token, userName: user.name, userId: user._id });

    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error });
    }
});

// POST /api/journal - Create a new journal entry
app.post('/api/journal', async (req, res) => {
    try {
        const { title, content, author, mood } = req.body;

        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Title, content, and author are required.' });
        }

        // Validate mood (1-5)
        const moodValue = mood || 1;
        if (moodValue < 1 || moodValue > 5) {
            return res.status(400).json({ message: 'Mood must be between 1 and 5.' });
        }

        // Create new journal entry
        const newJournal = new Journal({
            title,
            content,
            author,
            mood: moodValue
        });

        await newJournal.save();
        res.status(201).json({ message: 'Journal entry created successfully', journal: newJournal });

    } catch (error) {
        res.status(500).json({ message: 'Server error creating journal entry.', error });
    }
});

// POST /api/athena - Sends a message to Athena AI
app.post('/api/athena', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Make sure API_KEY is set in .env
    if (!process.env.API_KEY) {
      return res.status(500).json({ error: 'API_KEY environment variable not set' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Create a new chat session
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are Athena, the Greek goddess of wisdom, strategy, and crafts. Act as a wise and patient tutor.',
      },
    });

    // Send the user message
    const response = await chat.sendMessage({ message });

    // Respond to frontend
    res.json({ text: response.text });

  } catch (err) {
    console.error('Athena API error:', err);
    res.status(500).json({ error: 'Failed to communicate with Athena' });
  }
});

app.post('/api/hera', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Ensure API_KEY is set
    if (!process.env.API_KEY) {
      return res.status(500).json({ text: "Server misconfiguration: API_KEY not set." });
    }

    // Initialize GenAI client
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Create a chat session
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are Hera, the Greek goddess of marriage, family, and protection. You are wise, supportive, and nurturing. Speak with calm authority and guide users gently.",
      },
    });

    // Add conversation history if available
    const conversation = history?.map(h => ({
      role: h.role,
      text: h.text,
    })) || [];

    // Send the latest user message
    const response = await chat.sendMessage({ message, history: conversation });

    // Respond to the frontend
    res.json({ text: response.text });

  } catch (error) {
    console.error("Error in /api/hera:", error);
    res.status(500).json({ text: "Hera is currently unavailable. Please try again later." });
  }
});

// POST /api/chat - Chat endpoint for Hera/Athena
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Here, you would send the message to the AI or process it
    // For now, let's just echo it back as a placeholder
    const aiResponse = {
      text: `Hera received your message: "${message}" and remembers ${history.length} previous messages.`,
    };

    res.json(aiResponse);
  } catch (error) {
    console.error('Error handling /api/chat:', error);
    res.status(500).json({ text: "Server error while processing your message." });
  }
});


// GET /api/journal/:userId - Get all journal entries for a user
app.get('/api/journal/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const journals = await Journal.find({ author: userId }).sort({ date: -1 });
        res.json(journals);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching journal entries.', error });
    }
});

// GET /api/journal/:userId/today - Get today's journal entry for a user
app.get('/api/journal/:userId/today', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get start and end of today
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        
        const todaysEntry = await Journal.findOne({
            author: userId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        
        res.json(todaysEntry);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching today\'s journal entry.', error });
    }
});

// PUT /api/journal/:entryId - Update a journal entry
app.put('/api/journal/:entryId', async (req, res) => {
    try {
        const { entryId } = req.params;
        const { title, content, mood } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required.' });
        }

        // Validate mood (1-5)
        const moodValue = mood || 1;
        if (moodValue < 1 || moodValue > 5) {
            return res.status(400).json({ message: 'Mood must be between 1 and 5.' });
        }

        const updatedEntry = await Journal.findByIdAndUpdate(
            entryId,
            { title, content, mood: moodValue },
            { new: true, runValidators: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: 'Journal entry not found.' });
        }

        res.json({ message: 'Journal entry updated successfully', journal: updatedEntry });

    } catch (error) {
        res.status(500).json({ message: 'Server error updating journal entry.', error });
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});