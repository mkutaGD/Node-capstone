const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const Exercise = require("../models/exercise");

router.post("/", (req, res) => {
  for (let [key, value] of Object.entries(req.body)) {
    if ((value === "" || value === undefined) && key !== 'date') {
      return res.json({
        statusCode: 400,
        message: `Fill in ${key} field`,
      });
    }
  }
  if(!req.params._id) {
    return res.json({ statusCode: 400, message: 'Specify user ID' })
  }
  User
    .findById(req.params._id)
    .exec()
    .then((user) => {
      let exerciseDate;
      if(req.body.date !== '' && new Date(req.body.date).toDateString() === "Invalid Date"){
        return res.json({
          statusCode: 400,
          message: 'Invalid Date'
        })
      } 
      exerciseDate = req.body.date !== '' ? new Date(req.body.date).toDateString() : new Date().toDateString();
      
      let newExercise = new Exercise({
        user: user,
        description: req.body.description,
        duration: req.body.duration,
        date: exerciseDate,
      });
     
      Exercise.create(newExercise)
        .then((createdExercise) => res.json(createdExercise))
        .catch((err) => res.json({ ...err, statusCode: 400 }));
    })
    .catch((err) => res.json({ ...err, statusCode: 400, message: "Probably user not found" }));
});

module.exports = router;
