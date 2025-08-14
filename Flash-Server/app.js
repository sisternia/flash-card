const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Cấu hình CORS cho domain production
app.use(cors({
  origin: ['https://nihonflashcard.live', 'https://www.nihonflashcard.live'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth.routes');
const flashcardRoutes = require('./routes/flashcard.routes');

app.use('/api/auth', authRoutes);
app.use('/api/sets', flashcardRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
