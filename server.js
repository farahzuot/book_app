'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config;

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());


app.get('/' , (req,res)=> {
  res.status(200).send('WELCOME!')
})

app.use('*' , (req,res)=>{
  res.status(404).send('Error 404! the page not found')
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
