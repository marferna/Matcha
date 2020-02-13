const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bdd = require("../db_connect.js");
let con = bdd.con;

router.post('/option', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"})
	} else {
		var trie = require('../js/option.js');
		trie.trie(req.user.id, req.body).then((response) => {
			res.status(200).send({users: response});
		})
	}
})

router.post('/triable', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"})
	} else {
		var trie = require('../js/option.js');
		trie.option(req.user.id, req.body.profils, req.body.option).then((response) => {
			res.status(200).send({users: response});
		})
	}
})

router.post('/suggestion', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"})
	} else {
		var trie = require('../js/option.js');
		trie.suggestion(req.user.id).then((response) => {
			res.status(200).send({users: response});
		})
	}
})


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