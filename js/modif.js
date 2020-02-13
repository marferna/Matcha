const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
const bcrypt = require('bcryptjs');
let con = bdd.con;



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


function login(info, id) {
	return new Promise((resolve, reject) => {
		if (info.login != '') {
			login_exist(info).then((res) => {
				if (res == 1) {
					resolve("login exist");
				} else {
					let sql = "UPDATE users SET login = ? WHERE id = ?"
					var values = [
						[ent.encode(info.login)], [ent.encode(id.toString())]
					]
					con.query(sql, values, function(err, result){
						if(err) throw err;
					});
					resolve('ok');
				}
			})
		};
	})
}

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

function email(info, id) {
	return new Promise((resolve, reject) => {
		if (info.email != '') {
		email_exist(info).then((res) => {
			if (res == 1) {
				resolve("email exist");
			} else {
					let sql = "UPDATE users SET email = ? WHERE id = ?"
					var values = [
					[ent.encode(info.email)], [ent.encode(id.toString())]
					]
					con.query(sql, values, function(err, result){
						if(err) throw err;
					});
					resolve("ok");
				}
			})
		};
	})
}

function modif_profil(info, id) {
	return new Promise((resolve, reject) => {
		if (info.login != '') {
			login(info, id).then((res) =>{
				if (res != 'ok')
				 resolve("login exist");
			})
		}
		if (info.email != '') {
			email(info, id).then((res) => {
				if (res != "ok") {
					resolve('email exist');

				}
				})
		}
		if (info.nom != '') {
			let sql = "UPDATE users SET nom = ? WHERE id = ?"
					var values = [
						[ent.encode(info.nom)], [ent.encode(id.toString())]
					]
					con.query(sql, values, function(err, result){
						if(err) throw err;
					});
		}

		if (info.prenom != '') {
			let sql = "UPDATE users SET prenom = ? WHERE id = ?"
					var values = [
						[ent.encode(info.prenom)], [ent.encode(id.toString())]
					]
					con.query(sql, values, function(err, result){
						if(err) throw err;
					});
		}

		if (info.genre != ''){
			let sql = "UPDATE users SET genre = ? WHERE id = ?"
			var values = [
				[ent.encode(info.genre)], [ent.encode(id.toString())]
			]
			con.query(sql, values, function(err, result){
				if(err) throw err;
			});
		}

		if (info.interest != ''){
			let sql = "UPDATE users SET interest = ? WHERE id = ?"
			var values = [
				[ent.encode(info.interest)], [ent.encode(id.toString())]
			]
			con.query(sql, values, function(err, result){
				if(err) throw err;
			});
		}

		if (info.age != '') {
			let sql = "UPDATE users SET age = ? WHERE id = ?";
			values = [
				[ent.encode(info.age)], [id]
			]
			con.query(sql, values, function (err, result) {
				if (err) throw err;
			});
		}

		if (info.bio != '') {
			let sql = "UPDATE users SET bio = ? WHERE id = ?"
			var values = [
				[info.bio], [ent.encode(id.toString())]
			]
			con.query(sql, values, function(err, result){
				if(err) throw err;
			});
		}
	})
}	
module.exports.modif_profil = modif_profil;


function modif_passwd(info, id) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE id = ?";
		con.query(sql, [ent.encode(id.toString())], function (err, result) {
			if (err) throw err;
			if (result != '') {
				bcrypt.compare(ent.encode(info.old), result[0].passwd, function (err, res) {
					if (res == true) {
						if (info.new == info.new2) {
							var mdp = require('./inscription.js');
							mdp.passwd(info.new).then((response) => {
								if (response == "yes") {
								sql = "UPDATE users SET passwd = ? WHERE id = ?";
								var values = [
									[bcrypt.hashSync(ent.encode(info.new, 8))], [ent.encode(id.toString())]
								]
								con.query(sql, values, function(err, result){
									if (err) throw err;
									resolve ("ok");
								});
							} else {
								resolve ("mdp easy");
							}
							})
						} else {
							resolve ("mdp different");
						}
					} else {
						resolve ("wrong passwd");
					}
				})
			}
		})
	})
}
module.exports.modif_passwd = modif_passwd;

async function upload_img(img, id) {
	return new Promise((resolve, reject) => {
		const modif = require('../js/modif');

		let name = id + "_" + Date.now() + ".png";
		let sql = "SELECT * FROM photos WHERE id_user = ?";
		var request;
		var values = [
					[ent.encode(id.toString())]
				]
		con.query(sql, values, function (err, result) {
			if (err) throw err;
			if (result == ''){
				let sql = "INSERT INTO photos (id_user, photo_1, photo_2, photo_3, photo_4, photo_5) VALUES ?";
				var values = [
					[ent.encode(id.toString()), ent.encode(''), ent.encode(''), ent.encode(''), ent.encode(''), ent.encode('')]
				]
				con.query(sql, [values], function(err, res) {
					if (err) throw err;
				});
				require("fs").writeFile("./memory/public/photos/" + name, img, 'base64', function(err) {
					if (err) throw err;
				});
			} else {
				if (result[0].photo_1 == '') {
					request = "photo_1";
				} else if (result[0].photo_2 == '') {
					request = "photo_2";
				} else if (result[0].photo_3 == '') {
					request = "photo_3";
				} else if (result[0].photo_4 == '') {
					request = "photo_4";
				} else if (result[0].photo_5 == '') {
					request = "photo_5";
				} else {
					request = ("error");
				}
				if (request != "error") {
					sql = "UPDATE photos SET " + request + " = ? WHERE id_user = ?"; 
					var values = [
						[ent.encode(name)], [ent.encode(id.toString())]
					]
					con.query(sql, values, function(err, res) {
						if (err) throw err;
					});
					require("fs").writeFile("./memory/public/photos/" + name, img, 'base64', function(err) {
						if (err) throw err;
					});
					resolve ("ok");
				} else {
					resolve ('error');
				}
			}
			
		})
	})
}
module.exports.upload_img = upload_img;


function deleteIMG(photo, id) {
	return new Promise((resolve, reject) => {
		var sql = "SELECT * FROM photos WHERE id_user = ?"
		var request;
		value = [
			[ent.encode(id.toString())]
		]
		con.query(sql, value, function (err, result) {
			if (err) throw err;
			if (photo == 1 && result[0].photo_1 != '') {
				request = "photo_1";
			} else if (photo == 2 && result[0].photo_2 != '') {
				request = "photo_2";
			} else if (photo == 3 && result[0].photo_3 != '') {
				request = "photo_3";
			} else if (photo == 4 && result[0].photo_4 != '') {
				request = "photo_4";
			} else if (photo == 5 && result[0].photo_5 != '') {
				request = "photo_5";
			} else {
				request = "error";
				resolve ("une erreur s'est produit");
			} if (request != "error") {
				sql = "UPDATE photos SET " + request + "= ? WHERE id_user = ?";
				value = [
					[ent.encode('')], [ent.encode(id.toString())]
				]
				con.query(sql, value, function (err, res) {
					if (err) throw err;
				})
				resolve('');
			}
		})
	})
}
module.exports.deleteIMG = deleteIMG;


async function add_interet(interet, id) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM ct_interet WHERE id_user = ?";
		let values = [
			[id], [ent.encode(interet)]
		]
		con.query(sql, values, function (err, result) {
			if (err) throw err;
			var lenght = 0;
			while (result[lenght] != undefined) {
				lenght++;
			}
			if (lenght < 10) {
				sql = "SELECT * FROM ct_interet WHERE id_user = ? AND interet = ?";
				values = [
					[id], [ent.encode(interet)]
				]
				con.query(sql, values, function (err, result) {
					if (err) throw err;
					if (result == '') {
							sql = "INSERT INTO ct_interet (id_user, interet) VALUES ?";
							values = [
								[id, ent.encode(interet)]
							]
							con.query(sql, [values], function (err, result) {
								if (err) throw err;
								resolve({status: "ok", response: "ok"});
							})
						} else {
							resolve ({status: "error", response: "already interet"});
					}
				})
			} else {
				resolve ({status: "error", response: "lenght max"});
			}
		})
		
	})
}
module.exports.add_interet = add_interet;
