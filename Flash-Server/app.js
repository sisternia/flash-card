const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth.routes');
const flashcardRoutes = require('./routes/flashcard.routes');

app.use('/api/auth', authRoutes);
app.use('/api/sets', flashcardRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

