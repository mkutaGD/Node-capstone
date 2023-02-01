const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const Exercise = require("../models/exercise");
const mongoose = require('mongoose')
const findOrCreateLog = require("../helpers");

router.post("/", (req, res) => {
  for (let [key, value] of Object.entries(req.body)) {
    if (value === "" || value === undefined) {
      return res.json({
        statusCode: 400,
        message: `Fill in ${key} field`,
      });
    }
  }

  User
    .findById(req.params._id)
    .exec()
    .then((user) => {
      let exerciseDate;
      if(new Date(req.body.date).toDateString() === "Invalid Date"){
        return res.json({
          statusCode: 400,
          message: 'Invalid Date'
        })
      }
      exerciseDate = new Date(req.body.date).toDateString() || Date.now().toDateString();
      
      let newExercise = new Exercise({
        user_id: user._id,
        description: req.body.description,
        duration: req.body.duration,
        date: exerciseDate,
      });
     
      Exercise.create(newExercise)
        .then((createdExercise) => findOrCreateLog(createdExercise, user, res))
        .catch((err) => res.json({ ...err, statusCode: 400 }));
    })
    .catch((err) => res.json({ ...err, statusCode: 400 }));
});

module.exports = router;
