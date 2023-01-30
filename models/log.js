const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    username: String,
    count: Number,
    user_id: String,
    log: Array
})

module.exports = mongoose.model("Log", logSchema)