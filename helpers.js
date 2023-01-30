const Log = require("./models/log");

function findOrCreateLog(exercise, user, response) {
    Log.findOne({ user_id: user._id })
      .exec()
      .then((userLog) => {
        let exerciseLog = {
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date,
        };
        
        if (userLog) {
          userLog.log.push(exerciseLog);
          userLog.count = userLog.log.length;
          userLog.save()
          response.json(exercise);
        } else {
          let newLog = new Log({
            username: user.username,
            count: 1,
            user_id: user._id,
            log: [exerciseLog],
          });
  
          Log.create(newLog)
            .then((createdLog) => {
              response.json(exercise);
            })
            .catch((err) => response.json({...err, statusCode: response.statusCode}));
        }
      })
      .catch((err) => response.json({...err, statusCode: response.statusCode}));
  }
  