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

app.get('/searches' , (req,res)=> {
  res.render('pages/searches/show');
})

app.use('/public', express.static('public'));

app.use('*' , (req,res)=>{
  res.status(404).send('Error 404! the page not found')
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
