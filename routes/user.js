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
        return res.json({ statusCode: 404, message: 'No uswe was found' })
      }
      res.json(users)
    })
    .catch((err) => res.json({ ...err, statusCode: 400 }));
});

module.exports = router;