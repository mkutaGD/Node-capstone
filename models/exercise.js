const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    description: String,
    duration: Number,
    date: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Exercise", exerciseSchema)