var Firebase = require('firebase');
var express = require('express');
var router = express.Router();

var db = new Firebase("https://subscribr.firebaseio.com/");

/*
router.get('/', function(req, res) {
    res.redirect('http://ericbailey.co/subscribr/');
});
*/

router.get('/', function(req, res) {
    res.render('index', { title: 'subscribr', thanks: req.body.thanks });
});

router.post('/addme', function(req, res) {
    var userInfo = db.child('userInfo');
    userInfo.push({ name: req.body.name, email: req.body.email });

    console.log(req.body.name, req.body.email);
    res.redirect('/added');
});

router.get('/added', function(req, res) {
    res.render('index', { title: 'subscribr' , thanks: true});
});

var midAdded = false;
var linAdded = false;

router.post('/midam', function(req, res) {
    var dataDb = db.child('demo');

    console.log('GOT MIDAM POST REQUEST');
    parseMidam(req.body.midam, function(err, name, price, dueDate) {
        console.log('Parse back!', err, name, price, dueDate);

        if (err) console.log(err);
        else {
            console.log('GOT PRICE!', name, price, dueDate);

            if ((name == 'MidAmerican' && !midAdded) ||
                (name == 'Linode' && !linAdded)) {

                dataDb.push({
                    name: name,
                    price: price,
                    date: dueDate
                });

                if (name == 'MidAmerican') midAdded = true;
                else if (name == 'Linode') linAdded = true;
            }
        }
    });

    res.json(200, { message: 'sweet' });
});

var parseMidam = function(body, cb) {
    var priceRegExp = new RegExp('\\$(\\d+\\.\\d{2})');
    var dueDateRegExp = new RegExp('(\\d{1,2}\\/\\d{2}\\/\\d{4})');
    var dueDateWordRegExp = new RegExp('(January|February|March|April|May|June|July|August|September|November|October|December) (\\d+), (\\d{4})');

    var midamRexExp = new RegExp('midamerican');
    var linodeRegExp = new RegExp('linode');


    var priceMatch = body.match(priceRegExp);
    var dueDateMatch = body.match(dueDateRegExp);
    var dueDateWordMatch = body.match(dueDateWordRegExp);

    if (priceMatch) priceMatch = priceMatch[1];

    if (dueDateMatch) {
        dueDateMatch = dueDateMatch[1];
    }
    else if (dueDateWordMatch) {
        console.log('WORD', dueDateWordMatch);
        var month = dueDateWordMatch[1];
        var day = dueDateWordMatch[2];
        var year = dueDateWordMatch[3];

        var monthNum = 0;

        if      (month == 'January') monthNum = 1;
        else if (month == 'February') monthNum = 2;
        else if (month == 'March') monthNum = 3;
        else if (month == 'April') monthNum = 4;
        else if (month == 'May') monthNum = 5;
        else if (month == 'June') monthNum = 6;
        else if (month == 'July') monthNum = 7;
        else if (month == 'August') monthNum = 8;
        else if (month == 'September') monthNum = 9;
        else if (month == 'October') monthNum = 10;
        else if (month == 'November') monthNum = 11;
        else if (month == 'December') monthNum = 12;

        if (monthNum != 0) {
            dueDateWordMatch = monthNum.toString() + '/' + day + '/' + year;
        }
    }

    if (priceMatch && dueDateMatch) {
        cb(null, 'MidAmerican', priceMatch, dueDateMatch);
    }
    else if (priceMatch && dueDateWordMatch) {
        cb(null, 'Linode', priceMatch, dueDateWordMatch);
    }
    else if (!priceMatch) {
        cb('No billing price found!');
    }
    else {
        cb('No due date found');
    }
}

module.exports = router;

