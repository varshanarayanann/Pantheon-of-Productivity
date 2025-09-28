// // server.js

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const PORT = 5001; // Ensure this matches your frontend's API calls

// // --- Middleware ---
// // Allows cross-origin requests from your frontend
// app.use(cors()); 
// app.use(express.json());

// // --- API Endpoint (Route) ---
// // GET /api/music: Serves the Muses music playlist
// app.get('/api/music', (req, res) => {
  
//   const filePath = path.join(__dirname, 'data', 'muses-music.json');

//   // Read the JSON file
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       // If there's an error (e.g., file not found), send a 500 status.
//       console.error('Error reading JSON file:', err);
//       return res.status(500).send('Server Error');
//     }
//     try {
//       // Parse the JSON data and send it as a response.
//       const musicData = JSON.parse(data);
//       res.json(musicData);
//     } catch (parseErr) {
//       // If the JSON is invalid, send a 500 status.
//       console.error('Error parsing JSON:', parseErr);
//       res.status(500).send('Invalid JSON format');
//     }
//   });
// });

// // --- Start the Server ---
// app.listen(PORT, () => {
//   console.log(`Muses backend is running on http://localhost:${PORT}`);
// });