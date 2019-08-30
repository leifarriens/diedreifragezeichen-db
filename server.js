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
  console.log(req.query);
  const settings = req.query;
  const folgen = await Folge.find({}).sort(`-${settings.sortby}`);

  folgen.map((folge, i) => {
    // console.log(folge.rating);
    if (folge.rating < 8) {
      folgen.splice(i, 1)
    };
    // console.log(folge);
  })
  // console.log(folgen);
  res.render('index', { folgen, settings });
});

app.get('/search', async (req, res) => {
  console.log(req.query.s);
  const result = await Folge.find( { $text: { $search: req.query.s } } );
  res.render('search', { result });
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
    console.log(folge.inhalt);
    scrapeIt(`https://dreifragezeichen.de/produktwelt/details/${formattedTitle}`, {
      title: '.product-title',
      release: '.title span:last-of-type',
      inhalt: '#info-inhalt p',
      sprecher: '#info-sprecher p'
    }).then(({ data, response }) => {
      // console.log(`Status Code: ${response.statusCode}`)
      // console.log(data)
      folge.inhalt = data.inhalt;
      folge.sprecher = data.sprecher;
      folge.release = data.release;
  
      // console.log(data.inhalt);
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

// REGISTER API ROUTES
// -------------------

app.use('/', require('./routes/Router'));

// START THE SERVER
// ---------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on localhost:${PORT}`);
});