const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

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
        .then((results) => console.log(results))
        .catch((err) => console.log(err));

      res.sendFile(__dirname + '/index.html');
    });

    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect('/');
        })
        .catch((err) => console.log(err));
    });
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log('listening on 3000');
});
