var express = require('express');
var router = express.Router();
var conn = require('../connection')
const session = require('express-session');
const save_file_on_server = require('../uploadfile');
router.post('/loginaction', function (req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let Query = "select email,password,username from admin where email ='" + email + "'";
    conn.query(Query, function (err, rows) {
        if (err) {
            throw err;
        }
        if (rows.length === 0) {
            let response = {'message': 'invalidemail'}
            res.send(response);
        } else {
            if (rows[0].password === password && rows[0].username === username) {
                let response = {'message': 'success'}
                session.email = email;
                session.username = username;
                res.send(response);
            } else if (rows[0].username !== username) {
                let response = {'message': 'invalidusername'}
                res.send(response);
            } else {
                let response = {'message': 'invalidpassword'}

                res.send(response);
            }
        }
    })
})
router.get('/pendata',function (req,res){
    let Query="select * from servicepro";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }
        else{

            res.send(rows);
        }
    })
})
router.patch('/updat',function (req,res){
    let id=req.body.id;
    let status=req.body.status;
    let Query="update servicepro set status='"+status+"' where sid='"+id+"'";
    conn.query(Query,function (err){
        if(err){
            throw err;
        }else{
            let response={};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.post('/categorydat',function (req,res){
    let category=req.body.category;
    let dis=req.body.discription;
    let Query="INSERT INTO `category`(`categoryname`, `catdiscription`) VALUES ('"+category+"','"+dis+"')";
    conn.query(Query,function (err){
        if(err){
            throw err;
        }else{
let response={};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.get('/fetchcate',function (req,res){
    let Query="select * from category";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }else{
            let response={};
            response['message'] = rows;
            res.send(response);

        }
    })
})
router.get('/allcategories', (req, res) => {
    let Query = "select * from category";
    conn.query(Query, function (err, rows) {
        if (err) throw err;
        res.send(rows);
    })
})
router.post('/insertsubcat',function (req,res){
    let cat=req.body.category;
    let sub=req.body.subcategory;
    let dis=req.body.discription;
    let Query="INSERT INTO `subcategory`( `subcategoryname`, `subdiscription`, `categoryname`) " +
        "VALUES ('"+sub+"','"+dis+"','"+cat+"')";
    conn.query(Query,function (err){
        if(err){
            throw err;
        }else{
            let response={};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.post('/deletcate',function (req,res){
    let id=req.body.id;
    let Query="delete from category where categoryname='"+id+"'";
    conn.query(Query,function (err){
        if(err){
            throw err;
        }else{
            let response={};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.post('/deletsubcat',function (req,res){
    let id=req.body.id;
    let Query="delete from subcategory where subcategoryname='"+id+"'";
    conn.query(Query,function (err){
        if(err){
            throw err;
        }else{
            let response={};
            response['message'] = 'success';
            res.send(response);
        }
    })
})
router.get('/adminlogout', function (req, res) {
    session.email = undefined;
})
router.get('/getsubcat',function (req,res){
    let Query="select * from subcategory";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }else{
            let response={};
            response['message'] = rows;
            res.send(response);

        }
    })
})
router.patch('/adminchangepassword', function (req, res) {
    let email = session.email;
    let current = req.body.currentpassword;
    let pas = req.body.password;
    let newp = req.body.confirmpassword;
    let response = {};
    if (pas !== newp) {
        response['message'] = 'invalidpassword';
        res.send(response);
    } else {
        let Query = "select * from admin where email='" + email + "'";
        conn.query(Query, function (err, rows) {
            if (err) {
                response['message'] = 'error';
                res.send(response);
            }
            if (rows.length > 0) {
                let updateQuery = "update admin set password='" + newp + "'where email='" + email + "'";
                conn.query(updateQuery, function (err) {
                    if (err) {
                        response['message'] = 'error';
                        res.send(response);
                    } else {
                        response['message'] = 'success';
                        res.send(response);
                    }
                })
            }
        })
    }
})
router.get('/getentry',function (req,res){
    let Query="SELECT * FROM booking INNER JOIN servicepro ON booking.serproid=servicepro.sid WHERE sta='done'";
    conn.query(Query,function (err,rows){
        if(err){
            throw err;
        }else{
            res.send(rows);
        }
    })
})
router.get('/checksession', function (req, res) {
    let response = {};
    if (session.email !== undefined && session.username !== undefined) {
        response['message'] = 'yes';
        response['email'] = session.email;
        response['username'] = session.username;
    } else {
        response['message'] = 'no';
    }
    res.send(response);
})
module.exports = router;
