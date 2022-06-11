const express = require("express");
const {
    getAllMovies,
    addMovie,
    getMovie,
    updateMovie,
} = require('../controllers/movies.controller.js');

const router = express.Router();

// In index.js, we told express that the /customer route should use this router file
// The below /register route extends that, so the end result will be a URL
// that looks like http://localhost:4000/customer/register
router.get("/", getAllMovies);
router.post("/", addMovie);
router.get('/:id',getMovie);
router.put('/:id',updateMovie);

module.exports = router;
