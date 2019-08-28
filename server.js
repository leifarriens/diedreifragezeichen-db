const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const Folge = require('./models/folge');

const dbPath = 'mongodb+srv://app:HBY1j1w620ugqrqV@diedreifragezeichen-db-7k2z1.mongodb.net/diedreifragezeichen-db?retryWrites=true&w=majority';
mongoose.connect(dbPath, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', function() {
  console.log(`Connected to ${dbPath}`);
});
db.on('error', function(err) {
  console.log(err);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/folge/:id', async (req, res) => {
  try {
    const folge = await Folge.findById(req.params.id);
    folge.rating = getRating(folge);
    res.render('folge', folge);
  } catch (err) {
    console.log(err);;
  }

  function getRating(folge) {
    let s = 0;
    folge.ratings.forEach(r => {
      s = s + Number(r);
    });
    
    return Math.floor(s / folge.ratings.length * 10) / 10;
  }
});

app.post('/folge', async (req, res) => {
  console.log(req.body);
  const { title, number } = req.body;

  const folge = new Folge();
  folge.title = title;
  folge.number = number;

  console.log(folge);
  folge.save()
  .then(() => res.json({
    message: 'Folge gespeichert!'
  }))
  .catch(err => console.log(err));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});