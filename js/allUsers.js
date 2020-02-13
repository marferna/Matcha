const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
var fs = require('fs');
let con = bdd.con;


function get_img(id) {
	return new Promise((resolve, reject) => {
		var sql = "SELECT * FROM photos WHERE NOT id_user = ? AND NOT EXISTS (SELECT id_block FROM block_user WHERE id_user = ? AND block_user.id_block = photos.id_user)";
		var value =  [
			[id], [id]
		]
		con.query(sql, value, (err, result) => {
			if (err) throw err;
			var photo = []
			var i = 0;
			while (result[i] != undefined) {
				if (result[i].photo_1 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_1)) {
					photo[i] = {id_user: result[i].id_user, photo: '/photos/' + result[i].photo_1 };
				} else if (result[i].photo_2 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_2)) {
					photo[i] = {id_user: result[i].id_user, photo: '/photos/' + result[i].photo_2 };
				} else if ( result[i].photo_3 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_3)) {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_3 };
				} else if (result[i].photo_4 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_4)) {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_4 };
				} else if (result[i].photo_5 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_5)) {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_5 };
				} else {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/Default.png' };
				}
				i++;
			}
			resolve(photo);
		})
	})
}

module.exports.get_img = get_img;

function lonlat(longitude_stalk, latitude_stalk, id_connect) {
	return new Promise((resolve, reject) => {


		var sql = "SELECT * FROM users WHERE id = ?"
		var value = [
			[id_connect]
		]
		con.query(sql, value, function (err, result) {
			if (err) throw err;
			var longitude = result[0].longitude;
			var latitude = result[0].latitude;
			if ((longitude == longitude_stalk) && (latitude == latitude_stalk)) {
				resolve (0)
			}
			else {
				var radlat1 = Math.PI * latitude/180;
				var radlat2 = Math.PI * latitude_stalk/180;
				var theta = longitude-longitude_stalk;
				var radtheta = Math.PI * theta/180;
				var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
				if (dist > 1) {
					dist = 1;
				}
				dist = Math.acos(dist);
				dist = dist * 180/Math.PI;
				// dist = dist * 60 * 1.1515;
				dist = dist * 0.8684;
				resolve (dist)
			}
		})
	})
}

function get_img(id) {
	return new Promise((resolve, reject) => {
		var sql = "SELECT * FROM photos WHERE NOT id_user = ? AND NOT EXISTS (SELECT id_block FROM block_user WHERE id_user = ? AND block_user.id_block = photos.id_user)";
		var value =  [
			[id], [id]
		]
		con.query(sql, value, (err, result) => {
			if (err) throw err;
			var photo = []
			var i = 0;
			while (result[i] != undefined) {
				if (result[i].photo_1 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_1)) {
					photo[i] = {id_user: result[i].id_user, photo: '/photos/' + result[i].photo_1 };
				} else if (result[i].photo_2 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_2)) {
					photo[i] = {id_user: result[i].id_user, photo: '/photos/' + result[i].photo_2 };
				} else if ( result[i].photo_3 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_3)) {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_3 };
				} else if (result[i].photo_4 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_4)) {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_4 };
				} else if (result[i].photo_5 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_5)) {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_5 };
				} else {
					photo[i] = { id_user: result[i].id_user, photo: '/photos/Default.png' };
				}
				i++;
			}
			resolve(photo);
		})
	})
}
module.exports.get_img = get_img;

function get_profil(id) {
	return new Promise((resolve, reject) => {
		var sql = "SELECT users.* FROM users WHERE NOT users.id = ? AND NOT EXISTS (SELECT id_block FROM block_user WHERE id_user = ? AND block_user.id_block = users.id)";
		var value = [
			[id], [id]
		]
		con.query(sql, value, function (err, result) {
			if (err) throw err;
			var users = [];
			var i = 0;
			while (result[i] != undefined) {
				users[i] = {
					id: result[i].id,
					nom: ent.decode(result[i].nom),
					prenom: ent.decode(result[i].prenom),
					age: result[i].age,
					login: ent.decode(result[i].login),
					score: result[i].score,
					longitude: result[i].longitude,
					latitude: result[i].latitude,
					genre: result[i].genre,
					interest: result[i].interest,
				}
				i++;
			}
			get_img(id).then((response) => {
				i = 0;
				var j = 0;
				while (users[i] != undefined) {
					j = 0;
					while (response[j] != undefined && response[j].id_user != users[i].id) {
						j++
					}
					if (response[j] != undefined) {
						users[i] = {
							photo: response[j].photo,
							id: users[i].id,
							nom: ent.decode(users[i].nom),
							prenom: ent.decode(users[i].prenom),
							age: users[i].age,
							login: ent.decode(users[i].login),
							score: users[i].score,
							longitude: users[i].longitude,
							latitude: users[i].latitude,
							genre: users[i].genre,
							interest: users[i].interest,
						};
					} else {
						users[i] = '';
					}
					i++;
				}
				resolve({ users: users });
			})
		})
	})
}

module.exports.get_profil = get_profil;

function get_user(id_connect, id_stalk) { //a faire check si pas bloque
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE id = ?";
		value = [
			[id_stalk]
		]
		con.query(sql, value, function (err, result) {
			if(err) throw err;
			sql = "SELECT * FROM photos WHERE id_user = ?";
			value = [
				[id_stalk]
			]
			con.query(sql, value, function (err, res) {
				sql = "SELECT * FROM ct_interet WHERE id_user = ?";
				con.query(sql, value, function (err, res_interet) {
					var interet = '';
					if(err) throw err;
					if (res_interet != '') {
						var i = 0;
						while (res_interet[i] != undefined) {
							interet = interet + " " + ent.decode(res_interet[i].interet);
							i++;
						}
					}

					if (res == '') {
						var data = '/photos/Default.png';
						var photos = {
							photo_1: data
						}
					} else if (res[0].photo_1 == '' && res[0].photo_2 == '' && res[0].photo_3 == '' && res[0].photo_4 == '' && res[0].photo_5 == '') {
						var data = '/photos/Default.png'
						var photos = {
							photo_1: data
						}
					} else {
						if (res[0].photo_1 !== '' && fs.existsSync('./memory/public/photos/' + res[0].photo_1)) {
							var photo_1 = '/photos/' + res[0].photo_1;
						} if (res[0].photo_2 !== '' && fs.existsSync('./memory/public/photos/' + res[0].photo_2)) {
							var photo_2 = '/photos/' + res[0].photo_2;
						} if (res[0].photo_3 !== '' && fs.existsSync('./memory/public/photos/' + res[0].photo_3)) {
							var photo_3 = '/photos/' + res[0].photo_3;
						} if (res[0].photo_4 !== '' && fs.existsSync('./memory/public/photos/' + res[0].photo_4)) {
							var photo_4 = '/photos/' + res[0].photo_4;
						} if (res[0].photo_5 !== '' && fs.existsSync('./memory/public/photos/' + res[0].photo_5)) {
							var photo_5 = '/photos/' + res[0].photo_5;
						}
						var photos = {
							photo_1: photo_1,
							photo_2: photo_2,
							photo_3: photo_3,
							photo_4: photo_4,
							photo_5: photo_5,
						}
					}
					var date = result[0].log
					if (date == 'log') {
						var logout = 'log';
					} else if (date == '') {
						var logout = '';
					} else {
						var now = new Date();
						var diff = now.getTime() - date;
						var seconds = Math.floor(diff / 1000);
						if (seconds > 59) {
							var minutes = Math.floor(seconds / 60);
							if (minutes > 59) {
								var hours = Math.floor(minutes / 60);
								if (hours > 23) {
									var months = Math.floor(hours / 24);
									var logout = months + " months";
								} else {
									var logout = hours + " hours";
								}
							} else {
								var logout = minutes + " minutes";
							}
						} else {
							var logout = seconds + " seconds";
						}
					}
					lonlat(result[0].longitude, result[0].latitude, id_connect).then((dist) => {
						var user = {
							login: ent.decode(result[0].login),
							nom: ent.decode(result[0].nom),
							prenom: ent.decode(result[0].prenom),
							age: ent.decode(result[0].age.toString()),
							genre: ent.decode(result[0].genre),
							interest: ent.decode(result[0].interest),
							bio: ent.decode(result[0].bio),
							score: result[0].score,
							date: logout,
							distance: dist,
						}

						check_like(id_connect, id_stalk).then((response) => {
							if (response == "empty" || response[0].like_button == 0) {
								var like = { like: "like" };
							} else {
								var like = { like: "dislike" };
							}

							sql = "SELECT * FROM likes_match WHERE id_user = ? AND id_stalk = ? AND like_button = 1";
							value = [
								[id_stalk], [id_connect]
							]
							con.query(sql, value, function (err, res_like) {
								if (err) throw err;
								if (res_like != '') {
									var user_like = 1;
								} else {
									var user_like = 0;
								}
								sql = "SELECT * FROM photos WHERE id_user = ?";
								value = [
									[id_connect]
								]
								con.query(sql, value, function(err, result){
									if (err) throw err;
									if (result[0].photo_1 == '' && result[0].photo_2 == '' && result[0].photo_3 == '' && result[0].photo_4 == '' && result[0].photo_5 == '') {
										var connect_photo = "default";
									} else {
										var connect_photo = "ok";
									}
									resolve({user: user, photos: photos, interet: interet, like: like, user_like: user_like, connect_photo: connect_photo});
								})
							})
						})
					})
				})
			})
		})
	})
}
module.exports.get_user = get_user;

function check_like(id_connect, id_stalk) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM likes_match WHERE id_user = ? AND id_stalk = ?"
		let values = [
			[id_connect], [id_stalk]
		]
		con.query(sql, values, function(err, result) {
			if (err) throw err;
			if (result == '') {
				resolve ("empty");
			} else {
				resolve (result);
			}
		})
	})
}
module.exports.check_like = check_like;


function get_score(id_connect) {
	return new Promise ((resolve, reject) => {
		let sql = "SELECT score FROM users WHERE id = ?"
		value = [
			[id_connect]
		]
		con.query(sql, value, function (err, result) {
			if (err) throw err;
			resolve (result[0].score)
		})
	})
}

function add_match(id_connect, id_stalk) {
	return new Promise ((resolve, reject) => {
			let sql = "SELECT * FROM likes_match WHERE (id_user = ? AND id_stalk = ?) OR (id_user = ? AND id_stalk = ?)";
			let values = [
				[id_connect], [id_stalk], [id_stalk],  [id_connect]
			]
			con.query(sql, values, function (err, result) {
				if (err) throw err;
				if (result.length == 2) {
					sql = "INSERT INTO match_users (user1, user2) VALUES ?";
					values = [
						[id_connect, id_stalk]
					]
					const chat = require('./match.js');
					chat.insert_chat(id_connect, id_stalk);
					con.query(sql, [values], function (err, result) {
						if (err) throw err;
					})
					sql = "INSERT INTO notif (id_user, id_stalk, notif) VALUES ?";
					values = [
						[id_connect, id_stalk, "Nouveau match"]
					]
					con.query(sql, [values], function(err, resolve) {
						if (err) throw err;
					})
					values = [
						[id_stalk, id_connect, "Nouveau match"]
					]
					con.query(sql, [values], function(err, resolve) {
						if (err) throw err;
					})
					resolve("match")
			 	} else {
					resolve ("nope");
				}
		})
	})
}

function delete_match(id_connect, id_stalk) {
	let sql = "SELECT * FROM match_users WHERE user1 = ? AND user2 = ?";
	let values = [
		[id_connect], [id_stalk]
	]
	con.query(sql, values, function (err, result) {
		if (err) throw err;
		if (result == '') {
			values = [
				[id_stalk], [id_connect] 
			]
			con.query(sql, values, function (err, result) {
				if (err) throw err;
				if (result != '') {
					sql = "DELETE FROM match_users WHERE user1 = ? AND user2 = ?";
					con.query(sql, values, function (err, result) {
						if (err) throw err;
					})
					sql = "INSERT INTO notif (id_user, id_stalk, notif) VALUES ?";
					values = [
						[id_connect, id_stalk, "Cheh vous avez perdu un match"]
					]
					con.query(sql, [values], function(err, resolve) {
						if (err) throw err;
					})
				}
			})
		} else {
			sql = "DELETE FROM match_users WHERE user1 = ? AND user2 = ?";
			con.query(sql, values, function (err, result) {
				if (err) throw err;
			})
			sql = "INSERT INTO notif (id_user, id_stalk, notif) VALUES ?";
					values = [
						[id_connect, id_stalk, "Cheh vous avez perdu un match"]
					]
					con.query(sql, [values], function(err, resolve) {
						if (err) throw err;
					})
		}
	})
}

function like(id_connect, id_stalk) {
	return new Promise ((resolve, reject) => {
		check_like(id_connect, id_stalk).then((response) => {
			if (response == "empty") {
				let sql = "INSERT INTO likes_match (id_user, id_stalk, like_button) VALUES ?"
				let values = [
					[id_connect, id_stalk, 1]
				]
				con.query(sql, [values], function(err, result) {
					if (err) throw err;
				})
				add_match(id_connect, id_stalk).then((response) => {
					if (response == "nope") {
					sql = "INSERT INTO notif (id_user, id_stalk, notif) VALUES ?";
					values = [
						[id_connect, id_stalk, "Nouveau like"]
					]
					con.query(sql, [values], function(err, resolve) {
						if (err) throw err;
					})
					}
				});
				resolve ({response: "dilike"})
			} else {
				// if (response[0].like_button == 0) {
				// 	let sql = "UPDATE likes_match SET like_button = ? WHERE id_user = ? AND id_STALK = ?";
				// 	let values = [
				// 		[1],  [id_connect], [id_stalk]
				// 	]
				// 	con.query(sql, values, function (err, result) {
				// 		if (err) throw err;
				// 	})
				// 	add_match(id_connect, id_stalk);
				// } else {
					let sql = "DELETE FROM likes_match WHERE id_user = ? AND id_stalk = ?";
					let values = [
						[id_connect], [id_stalk]
					]
					con.query(sql, values, function (err, result) {
						if (err) throw err;
					})
					delete_match(id_connect, id_stalk);
				}
					resolve({response: response[0].like_button == 1 ? "like" : "dislike"})
				// }
				get_score(id_stalk).then((res) => {
					var score = response[0].like_button == 1 ? res - 5 : res + 5;
					sql = "UPDATE users SET score = ? WHERE id = ?";
					values = [
						[score], [id_stalk]
					]
					con.query(sql, values, function (err, result) {
						if(err) throw err;
					})
				})
 		})
	})
}
module.exports.like = like;

function block_user(id_connect, id_stalk) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM block_user WHERE id_user = ? AND id_block = ?";
		let values = [
			[id_connect], [id_stalk]
		]
		con.query(sql, values, function (err, result) {
			if (err) throw err;
			if (result == '') {
				let sql = "INSERT INTO block_user (id_user, id_block, block) VALUES ?";
				values = [
					[id_connect, id_stalk, 1]
				]
				con.query(sql, [values], function (err, result) {
					if (err) throw err;
				})
				get_score(id_stalk).then((res) => {
					sql = "UPDATE users SET score = ? WHERE id = ?";
					var score = res - 10;
					values = [
						[score], [id_stalk]
					]
					con.query(sql, values, function (err, result){
						if (err) throw err;
					})
				})
			}
			let sql = "DELETE FROM likes_match WHERE id_user = ? AND id_stalk = ?";
					values = [
						[id_connect], [id_stalk]
					]
					con.query(sql, values, function (err, result) {
						if (err) throw err;
					})
			delete_match(id_connect, id_stalk);
			resolve({status: "ok", response: "bloqué"});
		})

	})
}
module.exports.block_user = block_user;

function report_user(id_connect, id_stalk) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM report_user WHERE id_user = ? AND id_report = ?";
		let values = [
			[id_connect], [id_stalk]
		]
		con.query(sql, values, function (err, result) {
			if (err) throw err;
			if (result == '') {
				let sql = "INSERT INTO report_user (id_user, id_report) VALUES ?";
				let values = [
					[id_connect, id_stalk]
				]
				con.query(sql, [values], function (err, result) {
					if (err) throw err;
				})
				get_score(id_stalk).then((res) => {
					var score = res - 10;
					sql = "UPDATE users SET score = ? WHERE id = ?";
					values = [
						[score], [id_stalk]
					]
					con.query(sql, values, function (err, result){
						if (err) throw err;
					})
				})
			}
			resolve({status: "ok", response: "report"});
		})

	})
}
module.exports.report_user = report_user;

function get_match(id) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM match_users WHERE user1 = ? OR user2 = ?";
		let values = [
			[id], [id]
		]
		con.query(sql, values, function(err, result) {
			if (err) throw err;
			var users = [];
			var i = 0;
			var j = 0;
			var k = 0;
			var l = 0;
			get_profil(id).then((profil) => {
				profil = profil.users;
				get_img(id).then((photos) => {
					while (result[i] != undefined) {
						if (result[i].user1 == id) {
							j = 0;
							l = 0;
							while (photos[j] != undefined && photos[j].id_user != result[i].user2) {
								j++
							}
							while (profil[l] != undefined && profil[l].id != result[i].user2) {
								l++;
							}
							if (photos[j] != undefined && profil[l] != undefined) {
								users[k] = {
									id: photos[j].id_user,
									photo: photos[j].photo,
									login: profil[l].login,
									nom: profil[l].nom,
									prenom: profil[l].prenom,
								}
								k++;
							}
						} if (result[i].user2 == id) {
							j = 0;
							l = 0;
							while (photos[j].id_user != result[i].user1) {
								j++
							}
							while (profil[l].id != result[i].user1) {
								l++;
							}
							users[k] = {
								id: photos[j].id_user,
								photo: photos[j].photo,
								login: profil[l].login,
								nom: profil[l].nom,
								prenom: profil[l].prenom,
							}
							k++;
						}
						i++;
					}
					resolve ({ users: users });
				})
			})
		})
	})
}
module.exports.get_match = get_match;