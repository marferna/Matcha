const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
let con = bdd.con;

function user_exist(user) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [ent.encode(user.login)], function (err, result) {
			if (err) throw err;
			if (result != '') {
				if (result[0].confirm_mail == 1) {
					bcrypt.compare(ent.encode(user.passwd), result[0].passwd, function (err, res) {
						if (res == true) {
							resolve (result);
						}
						else {
							resolve (1);
						}
					});
				} else {
					resolve ("email"); 
				}
			} else {
				resolve(1);
			}
		});
	});
};

function user_connection(user) {
	return new Promise((resolve, reject) => {
		user_exist(user).then(function(result) {
			resolve(result);
		});
		let sql = "UPDATE users SET latitude = ?, longitude = ? WHERE login = ?";
		let values = [
			[user.latitude], [user.longitude], [ent.encode(user.login)]
		]
		con.query(sql, values, function (err, result) {
			if (err) throw err;
		})
	});
};
module.exports.user_connection = user_connection;

function confirmation(user) {
	return new Promise((resolve, reject) => {
		if (user.login == undefined) {
			resolve ({response: "error"});
		} else {
			let sql = "SELECT * FROM users WHERE login = ?";
			var value = [
				[ent.encode(user.login)]
			]
			con.query(sql, value, function (err, result) {
				if (err) throw err;
				if (user.key == result[0].confirm_mail) {
					sql = "UPDATE users SET confirm_mail = ? WHERE login = ?";
					value = [
						[1], [ent.encode(user.login)]
					]
					con.query(sql, value, function (err, result) {
						if (err) throw err;
						resolve({response: "ok"});
					})
				} else if (result[0].confirm_mail == 1) {
					resolve ({response: "email already confirm"});
				} else {
					resolve ({response: "error"});
				} 
			})
		}
	})
}
module.exports.confirmation = confirmation;


function emailResetPasswd(email) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE email = ?";
		let value = [
			[ent.encode(email)]
		]
		con.query(sql, value, function(err, result) {
			if (err) throw err;
			if (result == '') {
				resolve({status: "error", response: "error"});
			} else {
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
				sql = "UPDATE users SET reset_passwd = ? WHERE email = ?";
				value = [
					[key], [ent.encode(email)]
				]
				con.query(sql, value, function (err, result) {
					if (err) throw err;
				})
				var message = "Reinitialiser mot de passe: " + "http://localhost:3000/reset?email=" + email + "&key=" + key;
				var mailOptions = {
					from: 'matcha.42.ceaudouy@gmail.com',
					to: email,
					subject: 'Reinitialisation mot de passe',
					text: message
				};
				transporter.sendMail(mailOptions, function(error, info){
					if (error) throw error; 
				})
			}
		})
	})
}
module.exports.emailResetPasswd = emailResetPasswd;

function resetPasswd(info) {
	return new Promise((resolve, reject) => { // gerer mdp trop court, etc....
		if (info.passwd == '' || info.passwd2 == '') {
			resolve({status: "error", response: "mdp empty"});
		} else if (info.email == '' || info.email == undefined || info.key == undefined || info.key == '') {
			resolve({status: "error", response: "error"});
		} else if (info.passwd != info.passwd2) {
			resolve({status: "error", response: "mdp non identique"});
		} else {``
			let sql = "select * FROM users WHERE email = ? AND reset_passwd = ?";
			let values = [
				[ent.encode(info.email)], [ent.encode(info.key.toString())]
			]
			con.query(sql, values, function (err, result) {
				if (err) throw err;
				if (result == '') {
					resolve ({status: "error", response: "error"});
				} else {
					sql = "UPDATE users SET passwd = ?, reset_passwd = ? WHERE email = ?";
					values = [
						[bcrypt.hashSync(ent.encode(info.passwd, 8))], [0], [ent.encode(info.email)]
					]
					con.query(sql, values, function (err, result) {
						if (err) throw err;
						resolve ({status: "ok", response: "ok"});
					})
				}
			})
		}

	})
}
module.exports.resetPasswd = resetPasswd;

function log(id) {
	return new Promise((resolve, reject) => {
		let sql = "UPDATE users SET log = ? WHERE id = ?";
		let values = [
			["log"], [id]
		]
		con.query(sql, values, function (err, result) {
			if (err) throw err;
			resolve("ok");
		})
	})
}
module.exports.log = log;

function delog(id) {
	return new Promise((resolve, reject) => {
		const date = new Date();
		let sql = "UPDATE users SET log = ? WHERE id = ?";
		let values = [
			[date.getTime()], [id]
		]
		con.query(sql, values, function (err, result) {
			if (err) throw err;
			resolve("ok");
		})
	})
}
module.exports.delog = delog;
