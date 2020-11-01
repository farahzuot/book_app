'use strict';

const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const superagent = require('superagent');
require('dotenv').config;


const app = express();
app.use(cors());



// Setting the view engine for templating
app.set('view engine', 'ejs');


// Middleware (access the data form (Form Data header))
//app.use(express.urlencoded({ extended: true }));
//app.use(express.static('public'));

const PORT = process.env.PORT || 3000;


app.get('/' , (req,res)=> {
  res.render('pages/index');
})

app.get('/hello' , (req,res)=> {
  res.render('pages/index');
})

app.get('/searches/new' , (req,res)=> {
  res.render('pages/searches/show');
})



app.use('/public', express.static('public'));

app.post('/searches', getBooks )
app.get('/searches', getBooks )




app.use('*' , (req,res)=>{
  res.status(404).send('Error 404! the page not found')
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));



function BookInfo (data) {
  this.title = data.volumeInfo.title,
  this.authors = data.volumeInfo.authors,
  this.description = data.volumeInfo.description,
  this.img = data.volumeInfo.imageLinks.smallThumbnail;
}

function getBooks (req,res) {
  console.log('at the bigining of the fun');
  const url = 'https://www.googleapis.com/books/v1/volumes?q=search+terms'
  superagent.get(url).then ( data => {
    console.log('inside the superagent');
    let singleObj = data.body.items;
    let arrayObj = singleObj.map( value => {
      return new BookInfo (value)
    })

    res.send(arrayObj);
  }).catch( error => console.log('erro ...',error));

}




