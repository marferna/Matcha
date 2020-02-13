const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
const bcrypt = require('bcryptjs');
let con = bdd.con;

function visite(id_connect, id_stalk) {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO notif (id_user, id_stalk, notif) VALUES ?";
		let values = [
			[id_connect, id_stalk, "à visité votre profil"]
		]
		con.query(sql, [values], function(err, resolve) {
			if (err) throw err;
		})
	})
}
module.exports.visite = visite;

function get_notif(id) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM notif WHERE id_stalk = ? AND NOT EXISTS (SELECT id_block FROM block_user WHERE id_user = ? AND block_user.id_block = notif.id_stalk) ORDER BY id DESC";
		let value = [
			[id], [id]
		]
		con.query(sql, value, function(err, result) {
			if (err) throw err;
			sql = "UPDATE notif SET lu = 1 WHERE id_stalk = ?";
			value = [
				[id]
			]
			con.query(sql, value, function(err, res) {
				if (err) throw err;
			})
			if (result != '') {
				var profil = require('./allUsers');
				profil.get_profil(id).then((users) => {
					if (users != '') {
						profil.get_img(id).then((photo) => {
							users = users.users;
							var i = 0;
							var j = 0;
							var notif = [];
							while (result[i] != undefined) {
								j = 0;
								while (users[j] != undefined && users[j].id != result[i].id_user) {
									j++;
								}
								if (users[j] != undefined) {
									if (result[i].notif == "Cheh vous avez perdu un match") {
										notif[i] = {
											notif: result[i].notif,
											lu: result[i].lu
										}
									} else {
											notif[i] = {
												id: users[j].id,
												login: users[j].login,
												nom: users[j].nom,
												prenom: users[j].prenom,
												photo: photo[j].photo,
												notif: result[i].notif,
												lu: result[i].lu
											}
									}
								}
								i++;
							}
							resolve ({notif});
						})
					}
				})
			}
		})
	})
}
module.exports.get_notif = get_notif;

function notif(id) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM notif WHERE id_stalk = ? AND lu = 0 AND NOT EXISTS (SELECT id_block FROM block_user WHERE id_user = ? AND block_user.id_block = notif.id_user)";
		let value = [
			[id], [id]
		]
		con.query(sql, value, function (err, result) {
			if (err) throw err;
			resolve(result.length);
		})
	})
}
module.exports.notif = notif;