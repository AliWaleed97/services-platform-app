const SP = require('../models/ServiceProvider');
const Announcement = require('../models/Announcement');
const Review = require('../models/Review');
const Video = require("../models/Video");
const Reservation = require('../models/Reservation');
const Assessment = require('../models/Assessment');


const spController = {
  postAnnouncement: function(req, res) {
    const user = req.user;
    const announcement = new Announcement({
      title: req.body.title,
      content: req.body.content,
      announcer_id: user.id,
      type: 'SPannouncement'

    }).save(function(err, announcement) {
      if (err) {
        res.json(err.message);
      } else {
        res.json("Ay Haga");
        console.log(announcement);
      }
    });
  },
  viewReviews: function(req, res) {
    const user = req.user;
    const reviews = Review.find({
      sp_id: user.id
    }, function(err, reviews) {
      if (err) {
        res.json(err.message);
      } else {
        console.log(reviews);
      }
    });
  },
  assessStudent: function(req, res) {
    const user = req.user;
    const assessment = new Assessment({
      sp_id: user.id,
      user_id: req.params.id,
      rating: req.body.rating,
    }).save(function(err, assessment) {
      if (err) {
        res.json(err.message);
      } else {
        console.log(assessment);
      }
    });
  },
  getAllSPProfiles: function(req, res) { //viewing a summary of all SP profiles
    SP.find(function(err, profiles) {

      if (err) {
        res.json(err.message);
      } else {
        //res.render('spProfiles', {profiles:profiles});
        res.json(profiles);
        console.log('summary of SP profiles retrieved successfully');
      }
    });
  },

  getSPProfile: function(req, res) { //viewing a specific SP profile
    var query = {
      user_id: req.params.id //Recently Changed to Params
    };

    SP.findOne(query, function(err, providerProfile) {
      if (err) console.log(err);

      console.log(req);
      res.json(providerProfile);
      // res.render('spProfile', {
      //   sPProfile: providerProfile

    });

  },
  //method used to add a video to the database
  addVideoByURL: function(req, res) {

    const user = req.user;
    const user_id = user.id;
    var title = req.body.title;
    var url = req.body.videoURL;
    //creating the new video instance in the database
    var newVideo = new Video({
      user_id: user_id,
      title: title,
      url: url

    });
    newVideo.save();

  },


  //getting the embeded video object for the front end to embed it
  getVideo: function(req, res) {
    // const id = req.params.id;
    // //var id = req.spid; //id that will be passed by the form as a hidden variable of the current sp
    // //getting the videos of the currently viewed service provider
    // getVideoById = function(id, out) {
    //   Video.findById(id, function(err, videos) {
    //     if (err)
    //       console.log(err);
    //     else {
    //       res.json(videos);
    //     }
    //   });
    // };
    //old method above new method below
    var query = {
      user_id: req.params.id //Recently Changed to Params
    };

    Video.find(query, function(err, video) {
      if (err) console.log(err);

      console.log(req);
      res.json(video);
    });
  }
};

module.exports = spController;
