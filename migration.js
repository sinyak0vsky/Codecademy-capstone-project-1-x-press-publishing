const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS Artist');
  db.run('DROP TABLE IF EXISTS Series');
  db.run('DROP TABLE IF EXISTS Issue');

  db.run('CREATE TABLE Artist (id INTEGER PRIMARY KEY, name TEXT NOT NULL, date_of_birth TEXT NOT NULL, biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1)', function(err) {
    if (err) {
      console.log(err);
    }
  });
  db.run('INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ("John", "May 1, 2002", "My biography", 1)', function(err) {
    if (err) {
      console.log(err);
    }
  });

  db.run('CREATE TABLE Series (id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL)', function(err) {
    if (err) {
      console.log(err);
    }
  });
  db.run('INSERT INTO Series (name, description) VALUES ("Test name", "Test description")', function(err) {
    if (err) {
      console.log(err);
    }
  });

  db.run('CREATE TABLE Issue (id INTEGER PRIMARY KEY, name TEXT NOT NULL, issue_number INTEGER NOT NULL, publication_date TEXT NOT NULL, artist_id INTEGER NOT NULL, series_id INTEGER NOT NULL)', function(err) {
    if (err) {
      console.log(err);
    }
  });
  db.run('INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ("Issue name", 1 , "May 1, 2020", 1, 1)', function(err) {
    if (err) {
      console.log(err);
    }
  });

});
