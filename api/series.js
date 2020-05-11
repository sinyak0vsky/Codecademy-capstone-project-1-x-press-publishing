const express = require('express');
const sqlite3 = require('sqlite3');

const seriesRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Middleware section
seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  db.get('SELECT * FROM Series WHERE id = $id', {$id: seriesId}, (err, row) => {
    if (err) {
      return next(err);
    }
    if (!row) {
      return res.status(404).send();
    }
    req.series = row;
    next();
  });
});

// GET /api/series
seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (err, rows) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send({series: rows});
  });
});

// GET /api/series/:seriesId

module.exports = seriesRouter;