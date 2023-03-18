const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(
  'mongodb+srv://hstorres96:Ely6Z46d2W02BXWm@cluster0.ae7mzee.mongodb.net/test?retryWrites=true&w=majority'
)
  .then((client) => {
    console.log('connected to database');
    const db = client.db('favorite-quotes');
    const quotesCollection = db.collection('quotes');

    app.get('/', (req, res) => {
      db.collection('quotes')
        .find()
        .toArray()
        .then((results) => {
          res.render('index.ejs', { quotes: results });
        })
        .catch((err) => console.log(err));
    });

    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect('/');
        })
        .catch((err) => console.log(err));
    });

    app.put('/quotes', (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: 'John' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    });

    app.delete('/quotes', (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          res.json(`Deleted Darth Vader's quote`);
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log('listening on 3000');
});
