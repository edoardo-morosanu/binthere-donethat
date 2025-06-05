const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors(), express.json());
mongoose.connect(process.env.MONGO_URI);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(process.env.PORT);
