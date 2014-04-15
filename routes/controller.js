exports.analytics = function(req, res) {
  res.render('analytics', {title: 'Analytics'});
};

// var Firebase = require('firebase');
// var dataStream = new Firebase('http://piobd.firebaseio.com/micra/')
// var nodemailer = require('nodemailer');
//
// //Sends mail to the specified address with data.
// function sendMail(data) {
//   var smtpTransport = nodemailer.createTransport("SMTP", {
//     service: "Gmail",
//     auth: {
//       user: "piobd.test@gmail.com",
//       pass: "piobd123"
//     }
//   });
//
//   var mailOptions = {
//     from: "PiOBD Reporting Service <piobd.test@gmail.com>",
//     to: "arvindravi43@gmail.com",
//     subject: "PiDrive Report | " + Date.now(),
//     text: "PiOBD Report",
//     html: "Your car is failing critically. It needs immediate attention! RPM: " + data.rpm + " | VSS: " + data.vss + " | Temp: "  + data.temp + " | Load: " + data.load_pct + " |"
//   }
//
//   smtpTransport.sendMail(mailOptions, function(error, response){
//     if(error) {
//       console.log(error);
//     }
//     else
//     {
//       console.log("Message sent: " + response.message);
//     }
//   });
// }
//
// var data = [];
// //Trigger sendMail on offending incoming values
// dataStream.on('child_added', function(snapshot){
//   snapshot.forEach(function(obj) {
//     if(obj.name() == 'rpm') {
//       console.log(obj.val().value);
//       data.rpm = obj.val().value;
//       if(data.rpm > 1500) {
//         sendMail(data)
//       }
//       else {
//         console.log("Good so far!");
//       }
//     }
// });
