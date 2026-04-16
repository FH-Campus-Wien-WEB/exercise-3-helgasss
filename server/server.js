const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
    // Wandelt das movieModel Objekt in ein Array um [cite: 6]
    let movies = Object.values(movieModel);
    
    // Task 1.4: Query-Parameter 'genre' auslesen 
    const genreFilter = req.query.genre;

    if (genreFilter) {
        // Filtert die Liste: Gib nur Filme zurück, die das Genre enthalten 
        let filteredMovies = movies.filter(movie => movie.Genres.includes(genreFilter));
        res.send(filteredMovies);
    } else {
        // Wenn kein Parameter da ist (z.B. Button "All"), schick alle Filme 
        res.send(movies);
    }
});
app.get('/genres', function (req, res) {
    // 1. Alle Filme aus dem Modell holen (als Array)
    const movies = Object.values(movieModel);

    // 2. Alle Genres aus allen Filmen in einer Liste sammeln
    // .flatMap geht durch jeden Film und holt die Genre-Listen heraus
    let allGenres = movies.flatMap(movie => movie.Genres);

    // 3. Duplikate entfernen (Set) und alphabetisch sortieren (sort)
    // Wir wollen "Drama" nicht fünfmal in der Liste haben.
    let uniqueGenres = [...new Set(allGenres)].sort();

    // 4. Die fertige Liste an den Browser schicken
    res.json(uniqueGenres);
});

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
