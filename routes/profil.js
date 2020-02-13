const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bdd = require("../db_connect.js");
let con = bdd.con;

router.post('/modif', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send("no connect");
	} else {
		const modif = require('../js/modif.js');
		modif.modif_profil(req.body, req.user.id).then((result)=> {
			res.status(200).send(result);
		});
	}
});

router.get('/user', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send({ error: "error"});
	} else {
		const profil = require('../js/profil');
		profil.get_profil(req.user.id).then(function(result) {
			res.status(200).send({user: result.user, photos: result.photos, interet: result.interet});
		});
	}
});

router.post('/modifPasswd', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send("no connect");
	} else {
		const modif = require('../js/modif');
		modif.modif_passwd(req.body, req.user.id).then((result) => {
			res.status(200).send(result);
		});
	}
});


router.post('/img', authenticateToken, (req, res) => { 
	if (req.user == "") {
		res.status(200).send({});
	} else if (req.body.files != '') {
		var img = req.body.files.replace('data:image/jpeg;base64,', '');
		var modif = require('../js/modif.js');
		modif.upload_img(img, req.user.id).then((result) => {
			res.status(200).send(result);
		})
	}
})

router.post('/deleteIMG', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send("no connect");
	} else {
		var modif = require('../js/modif.js');
		modif.deleteIMG(req.body.photo, req.user.id).then((result) => {
			res.status(200).send(result);
		})
	}
})

router.post('/interet', authenticateToken, (req, res) => {
	if (req.user == "") {
		res.status(200).send("no connect");
	} else {
		var modif = require('../js/modif.js');
		modif.add_interet(req.body.interet, req.user.id).then((result) => {
			res.status(200).send(result);
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