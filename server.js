console.clear();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const scrapeIt = require('scrape-it');
const app = express();

const Folge = require('./models/folge');

const dbPath = 'mongodb+srv://app:HJTFT2Ae4QsFksbD@diedreifragezeichen-db-7k2z1.mongodb.net/diedreifragezeichen-db?retryWrites=true&w=majority';
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

app.get('/', async (req, res) => {
  // const folgen = await Folge.find({}).sort('-rating');
  const folgen = await Folge.find({}).sort('number');1
  console.log(folgen);
  res.render('index', { folgen });
});

app.get('/folge', async (req, res) => {
  const folgen = await Folge.find({}).select('-ratings');
  res.json(folgen);
});

app.get('/search', async (req, res) => {
  console.log(req.query.s);
  const result = await Folge.find( { $text: { $search: req.query.s } } );
  res.render('search', { result });
});

app.get('/folge/:number', async (req, res) => {
  try {
    const folge = await Folge.findOne({ number: req.params.number });
    res.render('folge', folge);
  } catch (err) {
    console.log(err);
    res.render('404');
  }
});

app.post('/folge/:number/rate', async (req, res) => {
  try {
    const folge = await Folge.findOne({ number: req.params.number });
    console.log(folge);
    folge.ratings.push(req.body.rating);
    folge.rating = getRating(folge);

    folge.save()
    .then(() => {
      res.redirect(`/folge/${req.params.number}`)
    })
    .catch(err => console.log(err));

  } catch (err) {
    console.log(err);
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
});

app.get('/scrapeFolgenDetails', async (req, res) => {
  const folgen = await Folge.find({});

  let counter = 0;
  folgen.forEach(folge => {
    const formattedTitle = folge.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace('ß', 'ss')
          .replace('ä', 'a')
          .replace('ö', 'o')
          .replace('ü', 'u');
    scrapeIt(`https://dreifragezeichen.de/produktwelt/details/${formattedTitle}`, {
      title: '.product-title',
      release: '.title span:last-of-type',
      inhalt: '#info-inhalt p',
      sprecher: '#info-sprecher p'
    }).then(({ data, response }) => {
      console.log(`Status Code: ${response.statusCode}`)
      // console.log(data)
      folge.inhalt = data.inhalt;
      folge.sprecher = data.sprecher;
      folge.release = data.release;
  
      console.log(data.inhalt);
      folge.save()
      .then(() => {
        console.log(folge.number);
        counter++;
        if (counter === folgen.length) res.send('done')
      })
      .catch(err => console.log(err));
    })
  });
});

function getRating(folge) {
  let s = 0;

  folge.ratings.forEach(r => {
    s = s + Number(r);
  });
  
  return Math.floor(s / folge.ratings.length * 10) / 10;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});