const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
var fs = require('fs');
let con = bdd.con;

function get_profil(id) {
	return new Promise ((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE id = ?";
		var values = [
			[id]
		]
		con.query(sql, [values], function (err, result) {
			if (err) throw err;
			if (result != '') {
				var res = {
						id: result[0].id,
						login: ent.decode(result[0].login),
						email: ent.decode(result[0].email),
						nom: ent.decode(result[0].nom),
						prenom: ent.decode(result[0].prenom),
						passwd: result[0].passwd,
						genre: ent.decode(result[0].genre),
						interest: ent.decode(result[0].interest),
						bio: ent.decode(result[0].bio),
						age: ent.decode(result[0].age.toString())
				}
			}
			else {
				var res = 'error';
			}
			sql = "SELECT * FROM photos WHERE id_user = ?";
			con.query(sql, [ent.encode(id.toString())], function (err, result) {
				if (result == '') { 
					var data = '/photos/Default.png';
					var photos = {
						photo_1: data
					}
				} else if (result[0].photo_1 == '' && result[0].photo_2 == '' && result[0].photo_3 == '' && result[0].photo_4 == '' && result[0].photo_5 == '') {
					var data = '/photos/Default.png'
					var photos = {
						photo_1: data
					}
				} else {
					if (result[0].photo_1 !== '' && fs.existsSync('./memory/public/photos/' + result[0].photo_1)) {
						var photo_1 = '/photos/' + result[0].photo_1;
					} if (result[0].photo_2 !== '' && fs.existsSync('./memory/public/photos/' + result[0].photo_2)) {
						var photo_2 = '/photos/' + result[0].photo_2;
					}if (result[0].photo_3 !== '' && fs.existsSync('./memory/public/photos/' + result[0].photo_3)) {
						var photo_3 = '/photos/' + result[0].photo_3;
					} if (result[0].photo_4 !== '' && fs.existsSync('./memory/public/photos/' + result[0].photo_4)) {
						var photo_4 = '/photos/' + result[0].photo_4;
					} if (result[0].photo_5 !== '' && fs.existsSync('./memory/public/photos/' + result[0].photo_5)) {
						var photo_5 = '/photos/' + result[0].photo_5;
					}
					var photos = {
						photo_1: photo_1,
						photo_2: photo_2,
						photo_3: photo_3,
						photo_4: photo_4,
						photo_5: photo_5,
					}
				}
				sql = "SELECT interet FROM ct_interet WHERE id_user = ?";
				con.query(sql, [id], function (err, result) {
					var interet = '';
					if(err) throw err;
					if (result != '') {
						var i = 0;
						while (result[i] != undefined) {
							interet = interet + " " + ent.decode(result[i].interet);
							i++;
						}
					}
					resolve ({user: res, photos: photos, interet: interet});
				})
			})
		});
	});
}
module.exports.get_profil = get_profil;
