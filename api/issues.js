const express = require('express');
const sqlite3 = require('sqlite3');

const issuesRouter = express.Router({mergeParams: true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

issuesRouter.get('/', (req, res, next) => {  
  db.all('SELECT * FROM Issue WHERE series_id = $seriesId', {$seriesId: req.params.seriesId} , (err, rows) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send({issues: rows});
  });
});

module.exports = issuesRouter;