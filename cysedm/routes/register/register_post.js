const https = require('https');
const fs = require('fs');
module.exports = [
  {
    method: "POST",
    path: "/register",
    config: {
      handler: async function (req, h) {
        var msg;
        // Hieronder eventuele serverside validaties
        if (req.payload.password.toString() === req.payload.confirm_password.toString()) {
          // De user mag nu gepersisteerd worden
          // API van the Hermanator aanroepen
          var post_data = JSON.stringify({
            username: req.payload.username,
            firstName: req.payload.firstname,
            lastName: req.payload.lastname,
            password: req.payload.password,
            email: req.payload.email
          });

          // POST opties aangeven:
          var post_options = {
            host: 'localhost',
            port: '3000',
            path: '/api/v1/user/create',
            method: 'POST',
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(post_data)
            }
          };
          post_options.agent = new https.Agent(post_options);
          // En go!
          var status = "varken";
          await new Promise((resolve, reject) => {
            const postreq = https.request(post_options, (res) => {
              resolve(res.statusCode);
            })
            postreq.write(post_data);
            postreq.end();
          }).then(result => {
            status = result;
          });

          if (status === 201) {
            return h.view('redirect');
          } else {
            msg = "Fout opgetreden";
            l.error(msg);
          }
          //return reply.response("gelukt").code(200);


        } else {
          // Wachtwoorden komen niet overeen. Foutmelding terugsturen.
          msg = "The passwords do not match.";
          return h.view('register', {
            errMsg: msg
          });
        }
      },
    }
  }
]
