const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const apiRouter = require('./api/api');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware section
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(errorHandler());
app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

module.exports = app;