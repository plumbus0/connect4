const mongoose = require('mongoose');

const games = new mongoose.Schema({
    date_made: Date,
    turn: Boolean,
    board: [[Number]]
})


module.exports = mongoose.models.games || mongoose.model("games", games);