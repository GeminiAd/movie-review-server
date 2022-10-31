const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'movie_db'
    },
    console.log(`Connected to the movie_db database.`)
);

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