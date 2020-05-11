const express = require('express');
const sqlite3 = require('sqlite3');
const issuesRouter = require('./issues');

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
seriesRouter.use('/:seriesId/issues', issuesRouter);

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
seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).send({series: req.series});
});

// POST /api/series
seriesRouter.post('/', (req, res, next) => {
  const {name, description} = req.body.series;
  if (!name || !description) {
    return res.status(400).send();
  }
  db.run('INSERT INTO Series (name, description) VALUES ($name, $description)', {$name: name, $description: description}, function(err) {
    if (err) {
      return next(err);
    }
    db.get('SELECT * FROM Series WHERE id = $id', {$id: this.lastID}, (err, row) => {
      if (err) {
        return next(err);
      }
      return res.status(201).send({series: row});
    });
  });
});

// PUT /api/series/:seriesId
seriesRouter.put('/:seriesId', (req, res, next) => {
  const {name, description} = req.body.series;
  if (!name || !description) {
    return res.status(400).send();
  }
  db.run('UPDATE Series SET name = $name, description = $description', {$name: name, $description: description}, function(err) {
    if (err) {
      return next(err);
    }
    db.get('SELECT * FROM Series WHERE id = $id', {$id: req.series.id}, (err, row) => {
      if (err) {
        return next(err);
      }
      res.status(200).send({series: row});
    });
  });
});


module.exports = seriesRouter;