var http = require('http');
var querystring = require('querystring');

var mailin = require('mailin');

// SMTP
mailin.start({
    port: 25,
    disableWebhook: true // Disable the webhook posting.
});

mailin.on('authorizeUser', function(connection, username, password, done) {
    done(null, true);
});

mailin.on('startMessage', function (connection) {
  //connection = {
      //from: 'sender@somedomain.com',
      //to: 'someaddress@yourdomain.com',
      //id: 't84h5ugf',
      //authentication: { username: null, authenticated: false, status: 'NORMAL' }
    //}
  //};
  //console.log(connection);
});

// Event emitted after a message was received and parsed.
mailin.on('message', function (connection, data, content) {
    //console.log(data);
    // Do something useful with the parsed message here.
    // Use parsed message `data` directly or use raw message `content`.

    var postData = querystring.stringify({
        'midam' : content
    });

    var options = {
        host: 'localhost',
        port: 80,
        path: '/midam',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            // console.log("body: " + chunk);
        });
    });

    req.write(postData);
    req.end();
});

