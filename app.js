const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

// Setup Handlebars
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir: path.join(__dirname, 'views/partials') // No need for manual partials registration
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// Add the route handlers here:

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Beers route
app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => res.render('beers', { beers: beersFromApi }))
    .catch(error => console.log(error));
});

// Random Beer route
app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(responseFromAPI => {
      //getRandom returns an array, we destructure it to get the first item.
      const [randomBeer] = responseFromAPI;
      //pass the random beer object to the template.
      res.render('random-beer', { beer: randomBeer });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error occurred while retrieving a random beer');
    });
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
