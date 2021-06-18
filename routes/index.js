var express = require('express');
var router = express.Router();
var conn = require('../connection')
const session = require('express-session');
const save_file_on_server = require('../uploadfile');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/allcategories', (req, res) => {
    let Query = "select * from category";
    conn.query(Query, function (err, rows) {
        if (err) throw err;
        res.send(rows);
    })
})
router.get('/logo', function (req, res) {
    session.workemail = undefined;
    session.id = undefined;
})
router.get('/fetchent',function (req,res){
    let Query="SELECT DISTINCT servicename FROM `servicesoffered`";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }else{
            res.send(rows);
        }
    })
})
router.get('/sessionche', function (req, res) {
    let response = {};
    if (session.workemail !== undefined && session.id !== undefined) {
        response['message'] = 'yes';
    } else {
        response['message'] = 'no';
    }
    res.send(response);
})
router.patch('/updata', function (req, res) {
    let name = req.body.fullname;
    let dis = req.body.discription;

    let Query = "";

    if ((req.files && req.files.photo)) {

        let photo = req.files.photo;
        let filename = 'images/' + photo.name;
        save_file_on_server(photo, 'images');
        Query = "UPDATE `servicepro` SET `name`='" + name + "',`photo`='" + filename + "',`discription`='" + dis + "' WHERE email='" + session.workemail + "'"
    } else {
        Query = "UPDATE `servicepro` SET `name`='" + name + "',`discription`='" + dis + "' WHERE email='" + session.workemail + "'"
    }
    conn.query(Query, function (err) {
        if (err) {
            throw err;
        } else {
            let response = {};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.get('/allsubcategories', (req, res) => {
    let Query = "select * from subcategory where categoryname='" + req.query.categoryname + "'";
    conn.query(Query, function (err, rows) {
        if (err) throw err;
        res.send(rows);
    })
})
router.post('/inservice', function (req, res) {
    let ser = req.body.service;
    let pri = req.body.price;
    let Query = "INSERT INTO `servicesoffered`( `servicename`, `price`, `sid`) VALUES ('" + ser + "','" + pri + "','" + session.id + "')"
    conn.query(Query, function (err) {
        if (err) {
            throw err;
        } else {
            let response = {};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.post('/vendordata', function (req, res) {

    let category = req.body.category;
    let subcategory = req.body.subcategory;
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.fullname;
    let mobileno = req.body.mobileno;
    let city = req.body.city;
    let pay = req.body.pay;
    let workhourfrom = req.body.workhourfrom;
    let workhourto = req.body.workhourto;
    let workdayfrom = req.body.workdayfrom;
    let workdayto = req.body.workdayto;
    let dis = req.body.discription;
    let status = 'pending';

    let photo = req.files.photo;

    let filename = 'images/' + photo.name;
    save_file_on_server(photo, 'images');

    let Query = "INSERT INTO `servicepro`( `categoryname`, `email`, `password`, `name`, `city`, `mobileno`," +
        " `workhourfrom`, `workhourto`, `photo`, `payperhour`, `status`, `workdayfrom`, `workdayto`, `discription`, `subcategoryname`) " +
        "VALUES ('" + category + "','" + email + "','" + password + "','" + name + "','" + city + "'," +
        "'" + mobileno + "','" + workhourfrom + "','" + workhourto + "','" + filename + "','" + pay + "'" +
        ",'" + status + "','" + workdayfrom + "','" + workdayto + "','" + dis + "','" + subcategory + "')";
    conn.query(Query, function (err) {
        if (err) {
            throw err;
        } else {
            let response = {};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.post('/worklogin', function (req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let Query = "select sid,email,password,status from servicepro where email ='" + email + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        }
        if (rows.length === 0) {
            let response = {'message': 'invalidemail'}
            res.send(response);
        } else {
            if (rows[0].status !== 'approved') {
                let response = {'message': 'blocked'}
                res.send(response);
            } else if (rows[0].password === password) {
                let response = {'message': 'success'}
                session.workemail = email;
             session.id=rows[0].sid;
                res.send(response);


            } else {
                let response = {'message': 'invalidpassword'}
                res.send(response);
            }
        }
    })
})

router.get('/getpaid',function (req,res){
    let Query="SELECT * FROM booking INNER JOIN servicepro ON booking.serproid=servicepro.sid WHERE email='"+session.workemail+"' and sta='paid'";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }else{
            res.send(rows);
        }
    })
})
router.get('/pevbook',function (req,res){
    let Query="SELECT * FROM booking INNER JOIN servicepro ON booking.serproid=servicepro.sid WHERE email='"+session.workemail+"' and sta='done'";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }else{
            res.send(rows);
        }
    })
})
router.get('/getdatawork', function (req, res) {
    let email = session.workemail;
    let Query = "select * from servicepro where email='" + email + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        } else {
            res.send(rows);
        }
    })
})
router.patch('/statchan',function (req,res){
    let id=req.body.id;
    let Query="UPDATE `booking` SET `sta` = 'accept' WHERE id = '"+id+"'";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }
        else{
            let response = {'message': 'success'}
            res.send(response);
        }
    })
})
router.get('/fetser',function (req,res){
    let Query="select * from servicesoffered where sid='"+session.id+"'";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }else{
            let response = {};
            response['message'] = rows;
            res.send(response);
        }
    })
})
router.post('/delserv',function (req,res){
  let pid=req.body.id;
    let Query="delete from servicesoffered where pid='"+pid+"'";
    conn.query(Query,function (err){
        if(err){
            throw err;
        }else{
            let response = {};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.post('/checkmail', function (req, res) {
    let email = req.body.email;
    let Query = "select email from servicepro  where email='" + email + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        }
        if (rows.length > 0) {
            let response = {};
            response['message'] = 'yes';
            res.send(response);
        }
    })
})


module.exports = router;
