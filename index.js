const express = require('express')
const app = express()
const mongoose = require("mongoose");
const cors = require('cors');
const exerciseRoutes = require('./routes/exercise');
const logRoutes = require('./routes/log');
const userRoutes = require('./routes/user');
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/exercise_tracker')

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.use('/api/users', userRoutes);
app.use('/api/users/:_id/logs', logRoutes);
app.use('/api/users/:_id/exercises', exerciseRoutes);

app.post("*", (req, res) => {
  res.json({ statusCode: res.statusCode, message: "Not Found. Probably you need to specify user id in new exercise form" })
})

app.get("*", (req, res) => {
  res.json({ statusCode: res.statusCode, message: "Not Found" })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})