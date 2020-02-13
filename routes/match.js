const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bdd = require("../db_connect.js");
let con = bdd.con;

router.get('/match', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"});
	} else {
		var match = require('../js/match.js');
		match.match(req.user.id)
	}
})

router.post('/chat', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"});
	} else {
		var match = require('../js/match.js');
		match.chat(req.user.id, req.body.user2).then((response) => {
			res.status(200).send({res: response});
		})
	}
})

router.post('/messages', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"});
	} else {
		var match = require('../js/match.js');
		match.chat_message(req.user.id, req.body.user2).then((response) => {
			res.status(200).send(response);
		})
	}
})

router.post('/send_messages', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"});
	} else {
		var match = require('../js/match.js');
		match.insert_chatmessage(req.user.id, req.body.user2, req.body.message).then((response) => {
			res.status(200).send();
		})
	}
})

router.get('/get_profil', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"});
	} else {
		var profil = require('../js/allUsers.js');
		profil.get_profil(req.user.id).then((response) => {
			res.status(200).send(response);
		})
	}
})

router.get('/get_match', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"});
	} else {
		var profil = require('../js/allUsers.js');
		profil.get_match(req.user.id).then((response) => {
			res.status(200).send({users: response});
		})
	}
})


router.post('/get_user', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({response: "no connect"})
	} if (req.body.id_user == '' || req.body.id_user == undefined) {
		res.status(200).send({response: "error id_user"})
	} else {
		var profil = require('../js/allUsers.js');
		profil.get_user(req.user.id, req.body.id_user).then((response) => {
			res.status(200).send({user: response});
		})
	}
})

router.post('/like', authenticateToken, (req, res) => {
	if(req.user == "") {
		res.status(200).send({response: "no connect"})
	} if (req.body.id_user == '' || req.body.id_user == undefined) {
		res.status(200).send({response: "error id_user"})
	} else {
		var profil = require('../js/allUsers.js');
		profil.like(req.user.id, req.body.id_user).then((response) => {
			res.status(200).send(response);
		})
	}
})

router.post('/block_user', authenticateToken, (req, res) => {
	if(req.user == "") {
		res.status(200).send({response: "no connect"})
	} if (req.body.id_user == '' || req.body.id_user == undefined) {
		res.status(200).send({response: "error id_user"})
	} else {
		var profil = require('../js/allUsers.js');
		profil.block_user(req.user.id, req.body.id_user).then((response) => {
			res.status(200).send(response);
		})
	}
})

router.post('/report_user', authenticateToken, (req, res) => {
	if(req.user == "") {
		res.status(200).send({response: "no connect"})
	} if (req.body.id_user == '' || req.body.id_user == undefined) {
		res.status(200).send({response: "error id_user"})
	} else {
		var profil = require('../js/allUsers.js');
		profil.report_user(req.user.id, req.body.id_user).then((response) => {
			res.status(200).send(response);
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
