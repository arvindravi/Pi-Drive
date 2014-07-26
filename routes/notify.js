/**
 * GET /
 * Home page.
 */
//
var Firebase = require('firebase');
var dataStream = new Firebase('http://piobd.firebaseio.com/micra/')
var path  = require('path')
  , templateDir = path.join(__dirname, '../public/templates')
  , emailTemplates = require('email-templates');
var nodemailer = require('nodemailer');

// Template
function sendMail(data){
  emailTemplates(templateDir, function(err, template) {
    if(err){
      console.log(err);
    }
    else
    {
       // Prepare nodemailer transport object
      var transport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
          user: "piobd.test@gmail.com",
          pass: "piobd123"
        }
      });

      // An example users object with formatted email function
      var locals = {
        email: 'pidrive.client@gmail.com',
        name: {
          first: 'Pi',
          last: 'Drive'
        },
        data: data
      };

      // Send a single email
      template('default', locals, function(err, html, text) {
        if (err) {
          console.log(err);
        } else {
          transport.sendMail({
            from: 'PiOBD Report <piobd.test@gmail.com>',
            to: locals.email,
            subject: 'PiOBD | Report',
            html: html,
            // generateTextFromHTML: true,
            text: text
          }, function(err, responseStatus) {
            if (err) {
              console.log(err);
            } else {
              console.log(responseStatus.message);
            }
          });
        }
      });
    }
  });

}


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
//     to: "nivedha0701@gmail.com",
//     subject: "PiDrive Report | " + Date.now(),
//     text: "PiOBD Report",
//     html: "Your car is failing. It needs immediate attention! RPM: " + data.rpm + " | VSS: " + data.vss + " | Temp: "  + data.temp + " | Load: " + data.load_pct + " |"
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

var data = [];
//Trigger sendMail on offending incoming values
dataStream.on('child_added', function(snapshot){
	snapshot.forEach(function(obj) {
    if(obj.name() == 'rpm') {
      data.rpm = obj.val().value;
      console.log("RPM:" + data.rpm);
      if(data.rpm > 1400) {
        sendMail(data.rpm);
      }
      else {
        console.log("RPM is good!");
      }
    }
    if(obj.name() == 'vss') {
      data.vss = obj.val().value;
      if(data.vss > 200) {
        sendMail(data.vss);
      }
      else {
        console.log("VSS is good!");
      }
    }
    if(obj.name() == 'load_pct') {
      data.load_pct = obj.val().value;
      if(data.load_pct > 80) {
        sendMail(data.load_pct);
      }
      else {
        console.log("Load is good!")
      }
    }
    if(obj.name() == 'temp') {
      data.temp = obj.val().value;
      if(data.temp > 120) {
        sendMail(data.temp);
      }
      else {
        console.log("Temp is good!")
      }
    }
  });
});

// var data = [];
// dataStream.on('value', function(snapshot) {
//   snapshot.forEach(function(DataObject) {
//     var d = {};
//     DataObject.forEach(function(obj) {
//       if(obj.name() == 'load_pct') {
//         d.load_pct = obj.val().value;
//       }
//       if(obj.name() == 'rpm') {
//         d.rpm = obj.val().value;
//       }
//       if(obj.name() == 'temp') {
//         d.temp = obj.val().value;
//       }
//       if(obj.name() == 'vss') {
//         d.vss = obj.val().value;
//       }
//     });
//     data.push(d);
//   });
// });

exports.index = function(req, res) {
  res.render('home', {
    title: "PiDrive",
  });
};
