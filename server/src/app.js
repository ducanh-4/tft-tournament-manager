const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TFT Tournament Manager API is running',
  });
});

app.listen(PORT, () => {
  console.log(`TFT Tournament Manager API running on port ${PORT}`);
});