const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require('../models/user');


router.post("/", (req, res) => {
  if (req.body.username === "") {
    return res.json({
      statusCode: res.statusCode,
      message: "Fill in username field",
    });
  }
  User.create({ username: req.body.username })
    .then((createdUser) => res.json(createdUser))
    .catch((err) => res.json({ ...err, statusCode: res.statusCode }));
});

router.get("/", (req, res) => {
  User.find({})
    .exec()
    .then((users) => res.json(users))
    .catch((err) => res.json({ ...err, statusCode: res.statusCode }));
});

module.exports = router;