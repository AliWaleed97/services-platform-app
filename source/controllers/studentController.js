const User = require('../models/User');
const Offer = require('../models/Offer');
const Reservation = require('../models/Reservation');
const Skill = require('../models/Skill');
const Tag = require('../models/Tag');
const StudentInterest = require('../models/StudentInterest');
const Review = require('../models/Review');
const jwt = require('../auth/jwt');

// const ServiceProvider = require('../models/ServiceProvider');

const StudentController = {
  addReview: function(req, res) {
    const token = req.headers['jwt-token'];
    jwt.verify(token, function(decoded) {
      console.log('Decoded =>', decoded);
      console.log('id=>', decoded.id);
      let review = new Review({
        rating: req.body.rating,
        reviewer_id: decoded.id,
        content: req.body.content,
        sp_id: req.params.id,
      }).save(function(err, review) {
        if (err) {
          res.json({
            err: 'error',
          });
        } else {
          console.log(review);
        }
      });
    });
    // const review = new Review(req.body);
    // review.reviewer_id = req.user.id;
    // review.sp_id = req.body.id;
    // review.save(function(err, review) {
    //   if (err) {
    //     res.send(err.message);
    //   } else {
    //     console.log(review);
    //   }
    // });
  },
  search: function(req, res) {
    const search = new RegExp('^' + req.query.search + '$', "i")

    Tag.find({
      name: search
    }, function(err, tagsarray) {
      if (err)
        res.send(err.message);
    })

    Offer.find({
      $and: [{
        $or: [{
          title: search
        }, {
          field: search
        }, {
          description: search
        }, {
          offer_id: {
            $in: tagsarray.offer_id
          }
        }]
      }, {
        due_date: {
          $lt: Date.now()
        }
      }],
      function(err, offers) {
        if (err)
          res.send(err.message);
        else {
          console.log("found offers");
          //Render offers
        }
      }
    })
  },
  seeProgress: function(req, res) {
    Skill.find({
      user_id: user.id
    }, function(err, skills) {
      if (err)
        res.send(err.message);
      else {
        //Render Skills
      }
    });
  },
  applyOffer: function(req, res) {
    Offer.find({
      id: req.params.id
    }, function(err, offer) {
      if (err)
        res.send(err.message);
      else {
        if (offer.due_date < Date.now) {
          Console.log("You can't register now");
        } else {
          const reservation = new Reservation({
            user_id: req.user.id,
            offer_id: offer.id,
            service_provider_id: offer.sp_id,
            reservation_date: Date.now(),
            status: 2
          });
          reservation.save(function(err, reservation) {
            if (err) {
              res.send(err.message);
              console.log(err);
            } else {
              offer.slots_available = offer.slots_available - 1;
              offer.save(function(err, reservation) {
                if (err) {
                  res.send(err.message);
                  console.log(err);
                } else {
                  res.json({
                    message: "yo"
                  });
                }
              });
            }
          });
        }
      }
    });
  },
  viewStudent: function(req, res) {
    User.find({
      id: req.params.id
    }, function(err, user) {
      if (err)
        res.send(err.message);
      else {
        Student.find({
          user_id: user.id
        }, function(err, student) {
          //Render
          Console.log("Found the hoe.");
        });
      }

    });
  },
  editStudent: function(req, res) {
    User.find({
      id: req.params.id
    }, function(err, user) {
      if (err)
        res.send(err.message);
      else {
        Student.find({
          user_id: user.id
        }, function(err, student) {
          if (err)
            res.send(err.message);
          else {
            user.name = req.body.name;
            student.university = req.body.university;
            student.address = req.body.address;
            student.birthdate = req.body.birthdate;
            student.description = req.body.description;

            StudentInterest.remove({
              student_id: student.user_d
            }, function(err) {
              if (err) {
                Console.log("Can't deconste Student Interest");
              }
            });

            for (var i = 0; i < Interests.length; i++) {
              var newInterset = new StudentInterest({
                student_id: newUser.id,
                interest_id: Interests[i]
              });

              newInterset.save(function(err) {
                if (err)
                  Console.log(
                    "Student interests updating error ");
              });
            }

            user.save(function(err) {
              if (err)
                console.log('error');
              else {
                student.save(function(err) {
                  if (err)
                    console.log('error');
                  else {}
                  // Render

                });
              }
            });

          }
        });
      }

    });
  }
};

module.exports = StudentController;
