'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const superagent = require('superagent');
const pg = require('pg');
var methodOverride = require('method-override');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;



const app = express();
app.use(cors());
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));



//

app.get('/', homeHandler)

app.post('/searches', searchBooks)

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/show');
})

app.post('/books', addBooks)

app.get('/books/:bookId', showDetails)

app.put('/books/:bookId', updateBook);

app.delete('/books/delete/:bookId', deleteBook);



app.use('*', (req, res) => {
  res.render('pages/error');
})


// constructor function

function BookInfo(data) {
  this.title = data.volumeInfo.title,
    this.authors = data.volumeInfo.authors,
    this.description = data.volumeInfo.description,
    this.img = data.volumeInfo.imageLinks.smallThumbnail;
}


// functions

let arrayObj = [];
function searchBooks(req, res) {
  let type = req.body.type;
  let checked;
  if (type === 'title') {
    checked = 'intitle';
  } else if (type === 'author') {
    checked = 'inauthor';
  }
  let url = `https://www.googleapis.com/books/v1/volumes?q=${checked}`;
  //console.log(url);
  superagent.get(url).then(data => {
    //console.log(data.body.items[0].volumeInfo.industryIdentifiers.identifier);
    //console.log(data.body.items[0].volumeInfo.authors[0])
    data.body.items.map(value => {
      let text = req.body.text;
      if (checked === 'intitle') {
        if (text === value.volumeInfo.title) {
          arrayObj.push(new BookInfo(value));
        }
      }
      else if (checked === 'inauthor') {
        console.log(value);
        //console.log('rightfirst')
        if (text === value.volumeInfo.authors[0]) {
          //console.log('right')
          arrayObj.push(new BookInfo(value));
          //console.log('arrobj',arrayObj);
        }
      }
    })
    //console.log(arrayObj);
    res.render('pages/searches/result', { value: arrayObj });
  }).catch(console.error)
}




function homeHandler(req, res) {

  const sql = 'SELECT * FROM books;';
  let booksResults;
  client.query(sql).then(data => {
    //console.log(data.rows);
    booksResults = data.rows;
    res.render('pages/index', { value: booksResults })
  }).catch(console.error);
}




function showDetails(req, res) {
  const sql = 'SELECT * FROM books WHERE id=$1';
  const idValue = [req.params.bookId];
  client.query(sql, idValue).then(data => {
    //console.log('datatest',data.rows[0])
    res.render('pages/books/details', { value: data.rows[0] })
  });
}


function addBooks(req, res) {
  //console.log('req.body=',req.body)
  const { img, title, authors, description } = req.body;
  const sql = "INSERT INTO books (img, title, author, description) VALUES($1,$2,$3,$4) RETURNING *;";
  const addValues = [img, title, authors, description];
  //console.log('add values =',addValues);
  client.query(sql, addValues).then((data) => {
    console.log('datatest', data.rows[0])
    res.status(201).redirect(`/books/${data.rows[0].id}`);
  }).catch(console.error);
}

function updateBook(req,res) {
  // destructure var
  const bookId = req.params.bookId;
  const { title, authors, img, description } = req.body;
  // create an sql update query
  const sql = 'UPDATE books SET title=$1,description=$4, author=$2, img=$3 WHERE id=$5 ;';
  const safeValus = [title, authors, img, description , bookId];
  // execute using the client query
  client.query(sql, safeValus).then(() => {
    res.redirect(`/books/${bookId}`)
  });
  // redirect the user the same page as they are in ;
}

function deleteBook(req,res) {
  const bookId = req.params.bookId;
  const sql = 'DELETE FROM books WHERE id=$1';
  client.query(sql, [bookId]).then(()=>{
    console.log(bookId)
    res.redirect('/');
  }).catch(console.error);
}


client.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(console.error);
