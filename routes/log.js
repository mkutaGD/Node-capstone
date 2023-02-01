const express = require("express");
const router = express.Router({ mergeParams: true });
const isBefore = require('date-fns/isBefore');
const isAfter = require('date-fns/isAfter');
const Log = require('../models/log');

router.get("/", (req, res) => {
  Log.findOne({ user_id: req.params._id })
    .exec()
    .then((userLog) => {
      if (req.query.from) {
        userLog.log = userLog.log.filter(
          (log) => new Date(log.date) >= new Date(req.query.from)
        );
      }
      if (req.query.from && req.query.to) {
        userLog.log = userLog.log.filter(
          (log) =>
            isAfter(new Date(log.date), new Date(req.query.from)) &&
            isBefore(new Date(log.date), new Date(req.query.to))
        );
      }
      if (req.query.limit) {
        userLog.log = userLog.log.slice(0, +req.query.limit);
      }
      userLog.log.sort();
      userLog.count = userLog.log.length;
      res.json(userLog);
    })
    .catch((err) => res.json({ ...err, statusCode: 400 }));
});

module.exports = router;
