// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to get photos
app.get('/api/photos', async (req, res) => {
  try {
    const { page = 1, query = '' } = req.query;
    const endpoint = query
      ? `/search/photos?page=${page}&query=${query}`
      : `/photos?page=${page}`;
    
    const response = await axios.get(`${UNSPLASH_API_URL}${endpoint}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Unsplash' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
