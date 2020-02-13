const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
let con = bdd.con;

function email_exist(user) {
	return new Promise((resolve, reject) => {
		sql = "SELECT * FROM users WHERE email = ?";
		con.query(sql, [ent.encode(user.email)], function(err, result){
			if (err) throw err;
			if (result != '') 
				resolve (1);			
			resolve (0);
		});
	});
};

 function login_exist(user) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [ent.encode(user.login)], function(err, result){
			if(err) throw err;
			if ((result != '')) {
				resolve(1);			
			}
			else {
				resolve(0); 
			}
		});
	});
};

function passwd(passwd) {
	return new Promise ((resolve, reject) => {
		var upperCase = /[A-Z]/;
		var lowerCase = /[a-z]/; 
		var number = /[0-9]/;
		if (passwd.length < 7) {
			resolve ("nope");
		} else {
			var upper = 0;
			var lower = 0;
			var nums = 0;
			var specials = 0;
			var i = 0;
			while (i < passwd.length) {
				if(upperCase.test(passwd[i]))
					upper++;
				else if(lowerCase.test(passwd[i]))
					lower++;
				else if(number.test(passwd[i]))
					nums++;
				i++;
			}
			if (upper == 0 || lower == 0 || number == 0) {
				resolve ("nope");
			} else {
				resolve ("yes");
			}
		} 
	})
}
module.exports.passwd = passwd;

async function user_inscription(user) {
	return new Promise((resolve, reject) => {
		if (user.login.length === 0 || user.nom.length === 0 || user.prenom.length === 0 || user.email.length === 0 || user.passwd.length === 0 || user.passwd2.length === 0)
			resolve({status: "error", response: "champs non complet"});
		else {
			login_exist(user).then(function(result) {
				if (result == 1) {
					resolve({status: "error", response: "login exist"});
				}
				else {
					email_exist(user).then(function(result) {
						if (result == 1)
							resolve({status: "error", response: "email exist"});
						else {
							if (user.passwd == user.passwd2) {
								passwd(user.passwd).then((response) => {
									if (response == "yes") {
										var transporter = nodemailer.createTransport({
											host: 'smtp.gmail.com',
											port: 587,
											secure: false,
											requireTLS: true,
											auth: {
												user:  'matcha.42.ceaudouy@gmail.com',
												pass: 'Matcha.42'
											}
										});
										var key = Math.random().toString().substr(2);
										var message = "confirmer votre mail : " + "http://localhost:3000/confirmation?login=" + user.login + "&key=" + key;
										var mailOptions = {
											from: 'matcha.42.ceaudouy@gmail.com',
											to: user.email,
											subject: 'Confirmation mail',
											text: message
										};
										transporter.sendMail(mailOptions, function(error, info){
											if (error) throw error
										})
										let sql = "INSERT INTO users (login, email, nom, prenom, passwd, genre, interest, bio, confirm_mail, age) VALUES ?";
										var values = [
											[ent.encode(user.login), ent.encode(user.email), ent.encode(user.nom), ent.encode(user.prenom), bcrypt.hashSync(ent.encode(user.passwd, 8)), ent.encode("undefined"), ent.encode("undefined"), ent.encode("undefined"), key, ent.encode('')]
										]
										con.query(sql, [values], function(err, res) {
											if (err) throw err;
										});
										sql = "SELECT id FROM users WHERE login = ?"
										values = [
											[ent.encode(user.login)]
										]
										con.query(sql, values, function (err, result) {
											if (err) throw err;
											sql = "INSERT INTO photos (id_user, photo_1, photo_2, photo_3, photo_4, photo_5) VALUES ?";
											values = [
												[ent.encode(result[0].id.toString()), ent.encode(''), ent.encode(''), ent.encode(''), ent.encode(''), ent.encode('')]
											]
											con.query(sql, [values], function(err, res) {
												if (err) throw err;
											});
										})
											resolve({status: "ok", response: "inscrit"});
									} else {
										resolve ({status: "error", response: "mdp easy"})
									}
								})
							} else {
								resolve ({status: "error", response: "mdp different"})
							}
						}
					});
				}
			});
		}
	});
};
module.exports.user_inscription = user_inscription;
