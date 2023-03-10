const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const isBefore = require('date-fns/isBefore');
const isAfter = require('date-fns/isAfter');
const Exercise = require('../models/exercise');
const exercise = require("../models/exercise");


router.post("/", (req, res) => {
  if (req.body.username === "") {
    return res.json({
      statusCode: 400,
      message: "Fill in username field",
    });
  }
  User.create({ username: req.body.username })
    .then((createdUser) => res.json(createdUser))
    .catch((err) => {
      if(err.code === 11000){
        return res.json({ statusCode: 400, message: 'There is already user with this username' })
      }
      res.json({ ...err, statusCode: 400 })
    });
});

router.get("/", (req, res) => {
  User.find({})
    .exec()
    .then((users) => {
      if(!users) {
        return res.json({ statusCode: 404, message: 'No users were found' })
      }
      res.json(users)
    })
    .catch((err) => res.json({ ...err, statusCode: 400 }));
});

router.get("/:_id/logs", (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  User.findById(req.params._id)
    .then((user) => {
      Exercise.find({
          user: req.params._id,
          ...(
            from || to 
            ? {
              date: {
                ...(from ? { $gte: new Date(from) }: {}),
                ...(to ? { $lte: new Date(to) } : {})
              }
            } : {}
          )
        })
        .lean()
        .sort({ date: 1 })
        .limit(+req.query.limit)
        .exec()
        .then((exercises) => {
         
          exercises = exercises.map((exercise) => {
            return {...exercise, date: new Date(exercise.date).toDateString()};
          });
          res.json({
            username: user.username,
            userId: user._id,
            count: exercises.length,
            logs: exercises,
          })
        })
        .catch((err) => res.json({ ...err, statusCode: 400 }));
    })
    .catch((err) => res.json({ ...err, statusCode: 400 }));
});

module.exports = router;