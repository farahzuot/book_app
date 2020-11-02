'use strict';

const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const superagent = require('superagent');
require('dotenv').config;

const app = express();
app.use(cors());
app.use(express.static('views'));



// Setting the view engine for templating
app.set('view engine', 'ejs');


// Middleware (access the data form (Form Data header))
app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/hello', (req, res) => {
  res.render('pages/index');
})

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/show');
})



app.use('/public', express.static('public'));

app.post('/searches', searchBooks)
//app.get('/searches', searchBooks )




app.use('*', (req, res) => {
  res.render('pages/error');
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));



function BookInfo(data) {
  this.title = data.volumeInfo.title,
  this.authors = data.volumeInfo.authors,
  this.description = data.volumeInfo.description,
  this.img = data.volumeInfo.imageLinks.smallThumbnail;
}


function searchBooks(req, res) {
  let type = req.body.type;
  let checked;
  //console.log(req.body);
  if(type ==='title'){
    checked ='intitle';
    //console.log(checked);
  } else if (type === 'author') {
    checked ='inauthor';
    //console.log(checked);
  }
  let url = `https://www.googleapis.com/books/v1/volumes?q=${checked}`;
  console.log(url);
  let arrayObj = [];
  superagent.get(url).then(data => {
    data.body.items.map(value => {

      let text = req.body.text;
      if ( checked === 'intitle') {
        if ( text === value.volumeInfo.title ) {
          arrayObj.push(new BookInfo(value));
        } }

      else if ( checked === 'inauthor') {
        if ( text === value.volumeInfo.authors[0] ) {
          arrayObj.push(new BookInfo(value));
        }
      }
    })

    console.log( arrayObj);
    res.render('pages/searches/result', { value: arrayObj });
  }).catch(console.error)
}






