let Reservation = require("../models/Reservation");
let Offer = require("../models/Offer");
const jwt = require('../auth/jwt');

let reservationController = {

  getReservations: function(req, res) { //returning customized reservations depending on the type of user requesting it
    // const token = req.headers['jwt-token'];
    // jwt.verify(token, function(decoded) {
    //   if (decoded.type == 2) //if the user type is student , we return his/her reservations
    //   {
        let query = {
          user_id: "12"
        };
        Reservation.find(query, function(err, reservations) { //finding all reservations made by this student
          
          if (err) {
            res.status(500).json({
              status: 'error',
              message: err.message,
            });
          } else {
            //res.render('viewReservations', {reservations:reservations});

            res.status(200).json({
              status: 'success',
              data: {
                reservations,
              },
            });
          }
        });
      // } else if (decoded.type == 3) {
      //   // } else if(false){
      //   let query = {
      //     service_provider_id: decoded.id
      //   };
      //   Reservation.find(query, function(err, reservations) { //finding all reservations made to this SP

      //     if (err) {
      //       res.status(500).json({
      //         status: 'error',
      //         message: err.message,
      //       });

      //     } else {
      //       //res.render('viewReservations', {reservations:reservations});
      //       res.status(200).json({
      //         status: 'success',
      //         data: {
      //           reservations
      //         },
      //       });
      //     }
      //   });
      // }

 //   });

  //}
}
}
module.exports = reservationController;
