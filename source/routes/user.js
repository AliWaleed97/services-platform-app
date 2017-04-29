  const express = require('express');
  const jwt = require('../auth/jwt');
  const User = require('../models/User');
  const homeController = require('../controllers/homeController');
  const Student = require('../models/Student');
  const bcrypt = require('bcrypt-nodejs');

  const studentController = require('../controllers/studentController');
  const StudentInterest = require('../models/StudentInterest');
  const sPController = require('../controllers/sPController');
  const generatePassword = require('password-generator');
  const nodemailer = require('nodemailer');


  const router = express.Router();

  // var path = require('path');
  // var multer = require('multer');
  // var crypto = require("crypto");
  // var storage = multer.diskStorage({
  //   destination: 'public/uploads/',
  //   filename: function(req, file, cb) {
  //     crypto.pseudoRandomBytes(16, function(err, raw) {
  //       if (err) return cb(err);
  //
  //       cb(null, raw.toString('hex') + path.extname(file.originalname));
  //     });
  //   }
  // });
  //
  // var upload = multer({
  //   storage: storage
  // });

  router.post('/login', (req, res) => {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
      res.status(400).json({
        err: errors,
      });
    } else {
      const token = jwt.generate({
        email: req.body.email,
        password: req.body.password,
      }, (token) => {
        if (!token) {
          res.status(401).json({
            err: 'Wrong Credentials',
          });
        } else {
          res.json({
            token,
          });
        }
      });
    }
  });

  router.post('/signup', (req, res) => {
    const email = req.body.email;
    // const password = req.body.password;
    const name = req.body.name;
    // const password2 = req.body.password2;
    const password = generatePassword();
    const university = req.body.university;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Must be a valid Email').isEmail();
    // req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('university', 'university is required').notEmpty();
    // req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({
        err: errors,

      });
    } else {

       const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'foobar.se@gmail.com',
                            pass: 'foobar1234',
                        },
                    });

                    // setup email data with unicode symbols
                    const mailOptions = {
                        from: ' "Foobar" <foobar.se@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: 'System Approval ✔', // Subject line
                        text: `Congratulations! You have been approved for our system and 
                        now you can login using your email and password:${
              password}`
              , 
              // plain text body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            res.status(500).json({
                                status: 'error',
                                message: err,
                            });
                        }
                        console.log('Message %s sent: %s', info.messageId,
                            info.response);
                    });

      console.log(password);
    
      // Password= bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      const user = new User({
        email: req.body.email,
        // password: user.generateHash(password),
        name: req.body.name,
        type: 2,
        is_deleted: false,
        is_blocked: false,
      });
      user.password = user.generateHash(password);
      user.save((err) => {
        if (err) {
          return res.status(400).json({
            err: [{ msg: 'Email is already taken' }],
          });
        }


        const newStudent = new Student({
          user_id: user._id,
          university: req.body.university,
          address: req.body.address,
          birthdate: req.body.birthdate,
          description: req.body.description,

        });

        const interests = req.body.interests;
        console.log(user);
        if (interests) {
          console.log(interests);
          for (let i = 0; i < interests.length; i += 1) {
            const newInterset = new StudentInterest({
                  student_id: user._id,
                  interest_id: interests[i]._id,
                });
            newInterset.save((saveerr) => {
                  if (saveerr) {
                return res.status(400).json({
                  err: [{ msg: 'Student Interest saving error' }],
                });
              }
                });
          }
        }

        // do your updates here
        if (req.file) {
          user.profileimg.name = req.file.filename;
          user.profileimg.path = req.file.path;
          user.profileimg.size = req.file.size;
        }

        // save the user

        newStudent.save((saveerr2) => {
          if (saveerr2) {
            res.json(err);
          }
        });


        res.json({
          message: 'Signup success',
        });
      });
    }
  });
  router.post('/resetPW', homeController.resetPassword); // viewing announcements
  router.post('/decode', homeController.getsignedvals); // decoding token from front end
  router.post('/comments/view', sPController.viewComments); // viewing comments of a specific review
  router.post('/comments/create', studentController.addComment); // adding a comment to a review


  // module.exports = function() {


  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  // app.get('/', homeController.getAllStudents);
  // app.post('/profile', upload.single('work_img') , profileController.createWork);
  //
  // app.post('/changedp', upload.single('profile_img'), profileController.changedp);
  //
  //
  // app.get('/portfolio/:id', portfolioController.getAllWorks);

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  //   app.get('/signup', function(req, res) {
  //     // render the page and pass in any flash data if it exists
  //     res.render('signup.ejs', {
  //       message: req.flash('signupMessage'),
  //       pagetitle: "Signup",
  //       user: req.user
  //     });
  //   });
  //
  //   //process the signup form
  //   app.post('/signup', passport.authenticate('local-signup', {
  //     successRedirect: '/profile', // redirect to the secure profile section
  //     failureRedirect: '/signup', // redirect back to the signup page if there is an error
  //     failureFlash: true // allow flash messages
  //   }));
  //
  //   app.post('/login', passport.authenticate('local-login', {
  //     successRedirect: '/profile', // redirect to the secure profile section
  //     failureRedirect: '/login', // redirect back to the signup page if there is an error
  //     failureFlash: true // allow flash messages
  //   }));
  //
  //   // =====================================
  //   // FACEBOOK ROUTES =====================
  //   // =====================================
  //   // route for facebook authentication and login
  //   app.get('/auth/facebook', passport.authenticate('facebook', {
  //     scope: 'email'
  //   }));
  //
  //   // handle the callback after facebook has authenticated the user
  //   app.get('/auth/facebook/callback',
  //     passport.authenticate('facebook', {
  //       successRedirect: '/profile',
  //       failureRedirect: '/'
  //     }));
  //
  //   // process the signup form
  //   // app.post('/signup', do all our passport stuff here);
  //
  //   // =====================================
  //   // PROFILE SECTION =====================
  //   // =====================================
  //   // we will want this protected so you have to be logged in to visit
  //   // we will use route middleware to verify this (the isLoggedIn function)
  //   // app.get('/profile', isLoggedIn, profileController.getAllWorks)
  //
  //   // =====================================
  //   // LOGOUT ==============================
  //   // =====================================
  //   app.get('/logout', function(req, res) {
  //     req.logout();
  //     res.redirect('/');
  //   });
  // };
  //
  // // route middleware to make sure a user is logged in
  // function isLoggedIn(req, res, next) {
  //
  //   // if user is authenticated in the session, carry on
  //   if (req.isAuthenticated())
  //     return next();
  //   // if they aren't redirect them to the home page
  //   res.redirect('/');
  // };

  module.exports = router;
