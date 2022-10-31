const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const Importer = require('mysql-import');

const host = 'localhost';
const user = 'root';
const password = 'password';
const database = 'movie_db';

const db = mysql.createConnection(
    {
        host: host,
        user: user,
        password: password,
        database: database
    },
    console.log(`Connected to the movie_db database.`)
);

const importer = new Importer({ host, user, password, database });

importer.import('./db/schema.sql', './db/seeds.sql').then(() => {
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
}).catch(err => {
    console.error(err);
});

app.post('/api/add-movie', (req, res) => {
    db.query(`INSERT INTO movies (name) VALUE (?)`, req.body.name, function (err, results, fields) {
        res.send(req.body.name + " ADDED");
    });
});

app.get('/api/movies', (req, res) => {
    db.query("SELECT * FROM movies", function (err, results, fields) {
        res.json(results);
    });
});

app.delete('/api/movie/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    console.log(movieId);
    db.query("DELETE FROM movies WHERE id = ?", movieId, function (err, results, fields) {
        res.send("MOVIE DELETED");
    });
});

app.get('/api/movie-reviews', (req, res) => {
    db.query("SELECT reviews.id, movies.name AS movie_name, reviews.review FROM reviews INNER JOIN movies ON reviews.movie_id = movies.id", function (err, results, fields) {
        res.json(results);
    });
});

app.put('/api/review/:id', (req, res) => {
    const reviewId = parseInt(req.params.id);
    db.query("UPDATE reviews SET review = ? WHERE id = ?", [req.body.review, reviewId], function (err, results, fields) {
        res.send("MOVIE UPDATED");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});