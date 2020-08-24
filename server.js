console.clear();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const moment = require('moment');
const app = express();

const Folge = require('./models/folge');
const User = require('./models/user');

const dbPath = 'mongodb+srv://app:GFdAaT1auwjr4bp8@diedreifragezeichen-db-7k2z1.mongodb.net/diedreifragezeichen-db?retryWrites=true&w=majority';
mongoose.connect(dbPath, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', function() {
  console.log(`Connected to ${db.host}`);
});
db.on('error', function(err) {
  console.log(err);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = moment;

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ email: username })
  .then(user => {
    if (!user) return done(null, false, { message: 'Email not found' });

    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if (isMatch) return done(null, user);
      return done(null, false, { message: 'wrong password' });
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
}));

passport.serializeUser(function(user, done) {
  const id = user._id;
  done(null, id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use('/', (req, res, next) => {
  if (req.user) console.log(req.user);
  next();
});

app.get('/', async (req, res) => {
  const settings = req.query;
  const ascDesc = (sort) => {
    if (sort === 'asc') return '-';
      return '';
  }
  const perpage = 0;
  const offset = perpage * settings.page - perpage;
  // const folgen = await Folge.find({}).sort(`${ascDesc(settings.sort)}${settings.sortby}`).skip(offset).limit(perpage);
  console.log(settings);
  const folgen = await Folge.find({}).sort(`${ascDesc(settings.sort)}${settings.sortby}`);

  if (!settings.view) settings.view = 'grid';

  // res.render('index', { folgen, settings, user: req.user });
  res.render('index', { folgen, settings, user: req.user });
});

// app.get('/search', async (req, res) => {
//   const settings = req.query;
//   const folgen = await Folge.find( { $text: { $search: req.query.s } } );
//   // folgen.forEach(folge => {
//   //   const momentObj = moment(new Date(folge.release));
//   //   folge.release = momentObj.format('YYYY');
//   // });

//   if (!settings.view) settings.view = 'list';

//   res.render('search', { folgen, settings, user: req.user });
// });

app.get('/scrapeFolgenDetails', async (req, res) => {
  const scrapeDetails = require('./jobs/scrapeFolgenDetails');
  res.send(await scrapeDetails())
});

// REGISTER API ROUTES
// -------------------

app.use('/', require('./routes/Router'));

// START THE SERVER
// ---------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});