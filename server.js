console.clear();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const dbPath = `mongodb+srv://app:${process.env.MONGO_PASSWORD}@diedreifragezeichen-db-7k2z1.mongodb.net/diedreifragezeichen-db?retryWrites=true&w=majority`;
mongoose.connect(dbPath, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', function() {
  console.log(`Connected to ${db.host}`);
});
db.on('error', function(err) {
  console.log(err);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// SERVE CLIENT APP ON /
app.use(express.static('client/dist'));


// REGISTER API ROUTES
// -------------------
app.use('/api', require('./routes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
});

// START THE SERVER
// ---------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});