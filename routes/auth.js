const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bdd = require("../db_connect.js");
let con = bdd.con;

router.post('/inscription', (req, res) => {
	const inscription =  require('../js/inscription.js');
	inscription.user_inscription(req.body).then(function(result) {
		if (result.response == "inscrit") {
		}
		res.status(200).send(result.response);
	});
});

router.get('/logout', authenticateToken, (req, res) => {
	if (req.user != "") {
		const connection = require('../js/connection.js');
		connection.delog(req.user.id).then(function(result) {
			res.status(200).send("ok");
		})
	}
})


router.post('/log', authenticateToken, (req, res) => {
	if (req.user != "") {
		const connection = require('../js/connection.js');
		connection.log(req.user.id).then(function(result) {
			res.status(200).send("ok");
		})
	}
})


router.post('/connection', (req, res) => {
	const connection = require('../js/connection.js');
	connection.user_connection(req.body).then(function(result) {
		if (result == 1){
			res.status(200).send("error");
		} else if (result == "email") {
			res.status(200).send("email");
		} else {
			const user = {
				id: result[0].id,
			}
			const accessToken = jwt.sign(user, '42born2code')
			res.json({ accessToken: accessToken })
		}
	});
});


router.post('/confirmation', (req, res) => {
	const connection = require('../js/connection.js');
	connection.confirmation(req.body).then(function(result) {
		 res.status(200).send(result.response);
	});
});

router.post('/email_resetPasswd', (req, res) => {
	const reset = require('../js/connection.js');
	reset.emailResetPasswd(req.body.email).then(function(result) {
		 res.status(200).send(result);
	});
});


router.post('/resetPasswd', (req, res) => {
	const reset = require('../js/connection.js');
	reset.resetPasswd(req.body).then(function(result) {
		 res.status(200).send(result);
	});
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
				}
				next();
			})
		});
	}
}
module.exports = router;