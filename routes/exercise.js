const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const Exercise = require("../models/exercise");
const findOrCreateLog = require("../helpers");

router.post("/", (req, res) => {
  for (let [key, value] of Object.entries(req.body)) {
    if (value === "" || value === undefined) {
      return res.json({
        statusCode: res.statusCode,
        message: `Fill in ${key} field`,
      });
    }
  }
  User.findById(req.params._id)
    .exec()
    .then((user) => {
      let exerciseDate =
        new Date(req.body.date).toDateString() || Date.now().toDateString();
      let newExercise = new Exercise({
        user_id: user._id,
        description: req.body.description,
        duration: req.body.duration,
        date: exerciseDate,
      });
      Exercise.create(newExercise)
        .then((createdExercise) => findOrCreateLog(createdExercise, user, res))
        .catch((err) => res.json({ ...err, statusCode: res.statusCode }));
    })
    .catch((err) => res.json({ ...err, statusCode: res.statusCode }));
});

module.exports = router;
