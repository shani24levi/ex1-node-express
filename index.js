// Express server 
const express = require('express');
const logger = require('morgan');
const colors = require('colors');

const app = express();

app.use(logger('dev')); //for logs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routs
const Users = require('./handler');
app.use('/users', Users);

const port = process.env.PORT || 5000 ;

//Listening on port 
app.listen(port, () => console.log(colors.red.underline.bgBrightWhite(`Server running on port ${port}`)));
