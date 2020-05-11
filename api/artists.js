const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite');

// Middleware section
artistsRouter.param('artistId', (req, res, next, artistId) => {
  db.get('SELECT * FROM Artist WHERE id = $artistID', {$artistId: artistId}, (err, row) => {
    if (err) {
      next(err);
    }
    if (!row) {
      return res.status(404).send();
    }
    req.artist = row;
    next();
  });
});

// Get /api/artists
artistsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE is_currently_employed = 1', (err, rows) => {
    if (err) {
      next(err);
    }
    return res.send({ artists: rows});
  });
});

module.exports = artistsRouter;