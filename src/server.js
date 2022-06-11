const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');

app.disable('x-powered-by');

// Add middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Tell express to use your routers here
const moviesRouter = require('./routers/movies');
const costumerRouter = require('./routers/costumer');
const screensRouter = require('./routers/screens');
const ticketRouter = require('./routers/ticket');
app.use('/movies', moviesRouter);
app.use('/costumer', costumerRouter);
app.use('/screens', screensRouter);
app.use('/ticket', ticketRouter);


module.exports = app
