console.clear();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

const dbPath = process.env.MONGO_URI;
mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', function() {
  console.log(`Connected to ${db.host}`);
});
db.on('error', function(err) {
  console.log(err);
});

// MIDDLEWARE
// -------------------
app.use(helmet({ contentSecurityPolicy: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// SERVE CLIENT
// ------------
app.use(express.static('client/dist'));

// REGISTER API ROUTES
// -------------------
app.use('/api', require('./routes'));

// Route everything != /api to SAP
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// START THE SERVER
// ---------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
