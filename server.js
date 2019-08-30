console.clear();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const scrapeIt = require('scrape-it');
const moment = require('moment');
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
          
    scrapeIt(`https://dreifragezeichen.de/produktwelt/details/${formattedTitle}`, {
      title: '.product-title',
      release: '.title span:last-of-type',
      inhalt: '#info-inhalt p',
      sprecher: '#info-sprecher p'
    }).then(({ data, response }) => {
      folge.inhalt = data.inhalt;
      folge.sprecher = data.sprecher;
      const releaseSplit = data.release.replace('Veröffentlichungsdatum: ', '').split('.');
      const formattedDate = `${releaseSplit[1]}/${releaseSplit[0]}/${releaseSplit[2]}`;
      if (moment(formattedDate).isValid()) {
        folge.release = moment(formattedDate); 
      } else {
        folge.release = '???';
      }

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