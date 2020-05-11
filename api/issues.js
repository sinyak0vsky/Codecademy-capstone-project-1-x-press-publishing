const express = require('express');
const sqlite3 = require('sqlite3');

const issuesRouter = express.Router({mergeParams: true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// GET /api/series/:seriesId/issues
issuesRouter.get('/', (req, res, next) => {  
  db.all('SELECT * FROM Issue WHERE series_id = $seriesId', {$seriesId: req.params.seriesId} , (err, rows) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send({issues: rows});
  });
});

//POST /api/series/:seriesId/issues
issuesRouter.post('/', (req, res, next) => {
  const {name, issueNumber, publicationDate, artistId} = req.body.issue;
  if (!name || !issueNumber || !publicationDate || !artistId) {
    return res.status(400).send();
  }
  db.get('SELECT * FROM Artist WHERE id = $artistId', {$artistId: artistId}, (err, row) => {
    if (err) {
      return next(err);
    }
    if (!row) {
      return res.status(400).send();
    }
    db.run('INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)', {$name: name, $issueNumber: issueNumber, $publicationDate: publicationDate, $artistId: artistId, $seriesId: req.params.seriesId}, function(err) {
      if (err) {
        return next(err);
      }
      db.get('SELECT * FROM Issue WHERE id = $id', {$id: this.lastID}, (err, row) => {
        if (err) {
          return next(err);
        }
        return res.status(201).send({issue: row});
      })
    })
  });
});

module.exports = issuesRouter;