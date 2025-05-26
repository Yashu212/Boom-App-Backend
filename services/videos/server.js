const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

app.use('/api/videos', require('./routes/videoRoutes'));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Video service running on port ${PORT}`));
