var express = require('express');
var router = express.Router();

var conn = require('../connection')
const session = require('express-session');

const save_file_on_server = require('../uploadfile');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/pevbook', function (req, res) {
    let Query = "SELECT * FROM booking INNER JOIN servicepro ON booking.serproid=servicepro.sid WHERE useremail='" + session.useremail + "' and sta='accept'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    })
})
router.get('/pevbook2', function (req, res) {
    let Query = "SELECT * FROM booking INNER JOIN servicepro ON booking.serproid=servicepro.sid WHERE useremail='" + session.useremail + "' and sta='done'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    })
})
router.get('/finaldat', function (req, res) {
    let id = req.query.id;
    let Query = "SELECT * FROM  serviceprogal  WHERE serid='" + id + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    })

})
router.get('/checksession', function (req, res) {
    let response = {};
    if (session.useremail !== undefined ) {
        response['message'] = 'yes';
    } else {
        response['message'] = 'no';
    }
    res.send(response);
})
router.get('/logout', function (req, res) {
    session.useremail = undefined;
})
router.post('/saverat', function (req, res) {
    let comment = req.body.comment;
    let rate = req.body.rates;
    let id = req.body.id;
    let email = req.body.email;
    console.log(comment);
    let Query = "INSERT INTO `serviceprogal`(`rating`, `comment`, `serid`, `email`) VALUES ('" + rate + "','" + comment + "','" + id + "','" + email + "')"
    conn.query(Query, function (err) {
        if (err) {
            throw err;
        } else {
            let response = {};
            response['message'] = 'yes';
            res.send(response);
        }
    })
})

router.patch('/statchan', function (req, res) {
    let id = req.body.id;
    let Query = "UPDATE `booking` SET `sta` = 'done' WHERE id = '" + id + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            let response = {'message': 'success'}
            res.send(response);
        }
    })
})
router.get('/fetchent', function (req, res) {
    let Query = "SELECT DISTINCT servicename FROM `servicesoffered`";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    })
})
router.post('/usersignup', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.fullname;
    let mobile = req.body.mobileno;
    let Query = "INSERT INTO `user`(`email`, `password`, `name`, `mobileno`) VALUES ('" + email + "','" + password + "','" + name + "','" + mobile + "')";
    conn.query(Query, function (err) {
        if (err) {
            throw err;
        } else {
            let response = {};
            response['message'] = 'success';
            session.useremail = req.body.email;
            res.send(response);
        }
    })
})
router.get('/workdata', function (req, res) {
    let service = req.query.name;
    let Query = "SELECT * FROM servicepro INNER JOIN servicesoffered ON servicepro.sid=servicesoffered.sid WHERE servicename='" + service + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    })
})
router.get('/ckeckmail', function (req, res) {
    let email = req.query.email;
    let Query = "select * from user where email='" + email + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                let response = {};
                response['message'] = 'no';
                res.send(response);
            } else {
                let response = {};
                response['message'] = 'yes';
                res.send(response);
            }
        }
    })
})

router.post('/bookda', function (req, res) {
    let worid = req.body.ids;
    let time = req.body.times;
    let status = 'paid';
    let timefrom = req.body.timefrom;
    let timeto = req.body.timeto;
    let pay = req.body.pay;
    let date = req.body.servdate;
    let Query = "INSERT INTO `booking`( `useremail`, `serproid`, `timefrom`, `timeto`, `nohour`, `dateofser`, `sta`, `price`)" +
        " VALUES ('" + session.useremail + "','" + worid + "','" + timefrom + "','" + timeto + "','" + time + "','" + date + "','" + status + "','" + pay + "')";
    conn.query(Query, function (err) {
        if (err) {
            throw err;
        } else {
            let response = {};
            response['message'] = 'yes';
            res.send(response);
        }
    })

})
router.post('/userlogin', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let Query = "select * from user where email='" + email + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            if (rows.length === 0) {
                let response = {'message': 'invalidemail'}
                res.send(response);
            } else if (rows[0].password !== password) {
                let response = {'message': 'invalidpassword'}
                res.send(response);
            } else {
                let response = {'message': 'success'}
                session.useremail = email;
                res.send(response);
            }
        }
    })
})
module.exports = router;
