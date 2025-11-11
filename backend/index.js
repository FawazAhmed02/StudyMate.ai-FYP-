const express = require('express');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/student');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');
const noteRoutes = require('./routes/noteRoutes');
const videoRoutes = require('./routes/videoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/student', studentRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Backend server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});