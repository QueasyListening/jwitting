const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const server = express();

const middleware = require('./setup/middleware.js')(server);
const routes = require('./setup/routes.js')(server);
mongoose
    .connect('mongodb://localhost/auth')
    .then(response => {
        console.log('\nConnected to MongoDb\n');
    })
    .catch(error => {
        console.log('Failed to connect to database');
    });


 
    
    server.listen(5000, () => console.log('\nAPI running on port 5000\n'));
