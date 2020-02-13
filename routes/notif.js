const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bdd = require("../db_connect.js");
let con = bdd.con;

router.post('/visite', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({ error: "error"});
	} else {
		const notif = require('../js/notif');
		notif.visite(req.user.id, req.body.id_user).then(function(result) {
			res.status(200).send({});
		});
	}
});

router.get('/get_notif', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({ error: "error"});
	} else {
		const notif = require('../js/notif');
		notif.get_notif(req.user.id).then(function(result) {
			res.status(200).send({notif: result});
		});
	}
});

router.get('/notif', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({ error: "error"});
	} else {
		const notif = require('../js/notif');
		notif.notif(req.user.id).then(function(result) {
			res.status(200).send({notif: result});
		});
	}
});

function authenticateToken(req, res, next) {

	const authHeader = req.headers['authorization'];
	var token = authHeader && authHeader.split(':')[1];
	if (typeof token === 'undefined') {
		req.user = "";
		next();
	} else {
		token = token.split('"');
		if (token[1] == null) {
			req.user = "";
			next();
		}
		jwt.verify(token[1], '42born2code', (err, user) => {
			if (err) { 
				req.user = "";
				next();
			}
			let sql = "SELECT * FROM users WHERE id = ?";
			let value = [
				[user.id]
			]
			con.query(sql, value, function (err, result) {
				if (err) throw err;
				if (result == '') {
					req.user = "";
					next();
				} else {
					req.user = user;
					const connection = require('../js/connection.js');
					connection.log(req.user.id);
					next();
				}
			})
		});
	}
}
module.exports = router;
