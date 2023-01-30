const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    username: String,
    description: String,
    duration: Number,
    date: String,
    user_id: String
})

module.exports = mongoose.model("Exercise", exerciseSchema)