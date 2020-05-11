const express = require('express');
const artistsRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Middleware section
artistsRouter.param('artistId', (req, res, next, artistId) => { 
  db.get('SELECT * FROM Artist WHERE id = $artistId', {$artistId: artistId}, (err, row) => {    
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

// Get /api/artists/:artistId
artistsRouter.get('/:artistId', (req, res) => {
  res.status(200).send({artist: req.artist});
});

// POST /api/artists
artistsRouter.post('/', (req, res) => {
  const {name, dateOfBirth, biography} = req.body.artist;
  let {is_currently_employed} = req.body.artist;
  if (!name || !dateOfBirth || !biography) {
    return res.status(400).send();
  }
  is_currently_employed = is_currently_employed ? is_currently_employed : 1;  

  db.run('INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $date_of_birth, $biography, $is_currently_employed)', 
    {
      $name: name,
      $date_of_birth: dateOfBirth,
      $biography: biography,
      $is_currently_employed: is_currently_employed
    }, function(err) {
      if (err) {
        next(err);
      }
      db.get('SELECT * FROM Artist WHERE id = $id', {$id: this.lastID}, (err, row) => {
        if (err) {
          next(err);
        }
        return res.status(201).send({artist: row});
      })
    });
});


module.exports = artistsRouter;