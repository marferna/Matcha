const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
var fs = require('fs');
let con = bdd.con;

function trieAge(ageMin, ageMax, users) {
	return new Promise((resolve, reject) => {
		if (ageMax && ageMin) {
			var i = 0;
			var j = 0;
			ret = [];
			while (users[i] != undefined) {
				if (users[i].age >= ageMin && users[i].age <= ageMax) {
					ret[j] = {
						photo: users[i].photo,
						id: users[i].id,
						nom: users[i].nom,
						prenom: users[i].prenom,
						age: users[i].age,
						login: users[i].login,
						score: users[i].score,
						longitude: users[i].longitude,
						latitude: users[i].latitude,
					}
					j++;
				}
				i++;
			}
			users = ret;
		}
		resolve (users);
	})
}

function trieScore(scoreMin, scoreMax, users) {
	return new Promise((resolve, reject) => {
		if (scoreMax && scoreMin) {
			var i = 0;
			var j = 0;
			var ret = [];
			while (users[i] != undefined) {
				if (users[i].score >= scoreMin && users[i].score <= scoreMax) {
					ret[j] = {
						photo: users[i].photo,
						id: users[i].id,
						nom: users[i].nom,
						prenom: users[i].prenom,
						age: users[i].age,
						login: users[i].login,
						score: users[i].score,
						longitude: users[i].longitude,
						latitude: users[i].latitude,
					}
					j++;
				}
				i++;
			}
			users = ret;
		}
		resolve (users);
	})
}

function trieDist(locMin, locMax, users, id) {
	return new Promise((resolve, reject) => {
		if (locMax && locMin) {
			let sql = "SELECT * FROM users WHERE id = ?";
			let value = [
				[id]
			]
			con.query(sql, value, function (err, result) {
				if (err) throw err;
				var longitude = result[0].longitude;
				var latitude = result[0].latitude;
				var i = 0;
				var j = 0;
				var ret = [];
				while (users[i] != undefined) {
					if (users[i].longitude == '' || users[i].latitude == '') {
						i++;
					} else {
						if ((longitude == users[i].longitude) && (latitude == users[i].latitude)) {
							dist = 0;
						}
						else {
							var radlat1 = Math.PI * latitude/180;
							var radlat2 = Math.PI * users[i].latitude/180;
							var theta = longitude-users[i].longitude;
							var radtheta = Math.PI * theta/180;
							var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							if (dist > 1) {
								dist = 1;
							}
							dist = Math.acos(dist);
							dist = dist * 180/Math.PI;
							// dist = dist * 60 * 1.1515;
							dist = dist * 0.8684;
							
						}
						if (dist >= locMin && dist <= locMax) {
							ret[j] = {
								photo: users[i].photo,
								id: users[i].id,
								nom: users[i].nom,
								prenom: users[i].prenom,
								age: users[i].age,
								login: users[i].login,
								score: users[i].score,
								longitude: users[i].longitude,
								latitude: users[i].latitude,
							}
							j++;
						}
						i++;
					}
				}
				users = ret;
				resolve(users);
			})
		} else {
			resolve(users);
		}
	})
}

function getInteret() {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM ct_interet";
		con.query(sql, function (err, result) {
			if (err) throw err;
			resolve (result);
		})
	})
}

function trieInteret(users, interet, id) {
	return new Promise((resolve, reject) => {
		if (interet != '') {
			getInteret().then((res) => {
				var i = 0;
				var j = 0;
				var k = 0;
				var l = 0;
				var x = 0;
				var tab = [];
				var nope;
				while (users[i] != undefined) {
					j = 0;
					while (res[j] != undefined) {
						k = 0;
						while (interet[k] != undefined) {
							if (res[j].id_user == users[i].id && res[j].interet == interet[k]) {
								x = 0;
								nope = '';
								while (tab[x] != undefined) {
									if (users[i].id == tab[x].id) {
										nope = "nope";
									} 
									x++;
								}
								if (nope != "nope"){
									tab[l] = {
										photo: users[i].photo,
										id: users[i].id,
										nom: users[i].nom,
										prenom: users[i].prenom,
										age: users[i].age,
										login: users[i].login,
										score: users[i].score,
										longitude: users[i].longitude,
										latitude: users[i].latitude,
									}
									l++;
								}
							}
							k++;
						}
						j++;
					}
					i++;
				}
				users = tab;
				resolve (users);
			})
		} else {
			resolve (users);
		}

	})
}

function trie(id, trie) {
	return new Promise((resolve, reject) => {
		var age = [trie.ageMin, trie.ageMax];
		age.sort((a, b) => a - b);
		var ageMin = age[0];
		var ageMax = age[1];
		var score = [trie.scoreMin, trie.scoreMax];
		score.sort((a, b) => a - b);
		var scoreMin = score[0];
		var scoreMax = score[1];
		var loc = [trie.locMin, trie.locMax];
		loc.sort((a, b) => a - b);
		var locMin = loc[0];
		var locMax = loc[1];
		var profil = require('../js/allUsers.js');
		profil.get_profil(id).then((alluser) => {
			if (trie.suggestion == 1) {
				var users = trie.profils;
			} else {
				var users = alluser.users
			}
			var ret = [];
			trieAge(ageMin, ageMax, users).then((users) => {
				trieScore(scoreMin, scoreMax, users).then((users) => {
					trieDist(locMin, locMax, users, id).then((users) => {
						trieInteret(users, trie.interet, id).then((users) => {
							resolve(users);
						})
					})
				})
			})
		})
	})
}
module.exports.trie = trie;


function optionAge(users) {
	return new Promise((resolve, reject) => {
		var i = 0;
		var tmp;
		while (users[i + 1] != undefined) {
			if (users[i].age > users[i + 1].age) {
				tmp = users[i];
				users[i] = users[i + 1];
				users[i + 1] = tmp;
				i = -1;
			}
			i++;
		}
		resolve(users);
	})
}

function optionScore(users) {
	return new Promise((resolve, reject) => {
		var i = 0;
		var tmp;
		while (users[i + 1] != undefined) {
			if (users[i].score < users[i + 1].score) {
				tmp = users[i];
				users[i] = users[i + 1];
				users[i + 1] = tmp;
				i = -1;
			}
			i++;
		}
		resolve(users);
	})
}

function optionDistance(users, id) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE id = ?";
			let value = [
				[id]
			]
			con.query(sql, value, function (err, result) {
				if (err) throw err;
				var longitude = result[0].longitude;
				var latitude = result[0].latitude;
				var i = 0;
				var tmp;
				while(users[i + 1] != undefined) {
					if (users[i].longitude == '' || users[i].latitude == '') {
						dist1 = 9999999999;
					} else {
						if ((longitude == users[i].longitude) && (latitude == users[i].latitude)) {
							dist1 = 0;
						}
						else {
							var radlat1 = Math.PI * latitude/180;
							var radlat2 = Math.PI * users[i].latitude/180;
							var theta = longitude-users[i].longitude;
							var radtheta = Math.PI * theta/180;
							var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							if (dist > 1) {
								dist = 1;
							}
							dist = Math.acos(dist);
							dist = dist * 180/Math.PI;
							// dist = dist * 60 * 1.1515;
							dist1 = dist * 0.8684;
						}
					}
					if (users[i + 1].longitude == '' || users[i + 1].latitude == '') {
						dist2 = 9999999999;
						
					} else {
						if ((longitude == users[i + 1].longitude) && (latitude == users[i + 1].latitude)) {
							dist2 = 0;
						}
						else {
							var radlat1 = Math.PI * latitude/180;
							var radlat2 = Math.PI * users[i + 1].latitude/180;
							var theta = longitude-users[i + 1].longitude;
							var radtheta = Math.PI * theta/180;
							var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							if (dist > 1) {
								dist = 1;
							}
							dist = Math.acos(dist);
							dist = dist * 180/Math.PI;
							// dist = dist * 60 * 1.1515;
							dist2 = dist * 0.8684;
						}
					}
					if (dist1 > dist2) {
						tmp = users[i];
						users[i] = users[i + 1];
						users[i + 1] = tmp;
						i = -1;
					}
					i++;
				}
				resolve(users);
			})
		})
}

function optionInteret(users, id) {
	return new Promise ((resolve, reject) => {
		getInteret().then((interet) => {
			var i = 0;
			var j = 0;
			var k = 0;
			var l = 0;
			var x = 0;
			var tab = [];
			var tmp;
			while (users[i] != undefined) {
				j = 0;
				while (interet[j] != undefined) {
					if (interet[j].id_user == users[i].id) {
						k = 0;
						while(interet[k] != undefined) {
							if (interet[k].id_user == id && interet[k].interet == interet[j].interet) {
								tab[l] = {
									id: users[i].id,
									interet: interet[k].interet, 
								}
								l++;
							}
							k++;
						}
					}
					j++;
				}
				i++;
			}
			i = 0;
			var value1 = 0;
			var value2 = 0;
			while (users[i + 1] != undefined) {
				j = 0;
				value1 = 0;
				value2 = 0;
				while(tab[j] != undefined) {
					if (tab[j].id == users[i].id) {
						value1++;
					} if (tab[j].id == users[i + 1].id) {
						value2++;
					}
					j++;
				}
				if (value1 < value2) {
					tmp = users[i];
					users[i] = users[i + 1];
					users[i + 1] = tmp;
					i = -1;
				}
				i++;
			}
			resolve(users);
		})
	})
}

function option(id, users, option) {
	return new Promise((resolve, reject) => {
		if (option == 'age') {
			optionAge(users).then((users) => {
				resolve(users)
			})
		} else if (option == 'score') {
			optionScore(users).then((users) => {
				resolve(users)
			})
		} else if (option == 'distance') {
			optionDistance(users, id).then((users) => {
				resolve(users)
			})
		} else if (option == 'interet') {
			optionInteret(users, id).then((users) => {
				resolve(users)
			})
		}
	})
}
module.exports.option = option;

function suggGenre(users, profil) {
	return new Promise((resolve, reject) => {
		var i = 0;
		var j = 0;
		var tab = []
		while (users[i] != undefined) {
			if (users[i].genre == profil[0].interest) {
				tab[j] = users[i];
				j++;
			}
			i++;
		}
		users = tab;
		resolve(users);
	})
}


function suggDistance(users, profil) {
	return new Promise ((resolve, reject) => {
		var longitude = profil[0].longitude;
		var latitude = profil[0].latitude;
		var i = 0;
		var l = 0;
		var tab = [];
		while(users[i] != undefined) {
			if (users[i].longitude == '' || users[i].latitude == '') {
				dist = 9999999999;
			} else {
				if ((longitude == users[i].longitude) && (latitude == users[i].latitude)) {
					dist = 0;
				}
				else {
					var radlat1 = Math.PI * latitude/180;
					var radlat2 = Math.PI * users[i].latitude/180;
					var theta = longitude-users[i].longitude;
					var radtheta = Math.PI * theta/180;
					var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					if (dist > 1) {
						dist = 1;
					}
					dist = Math.acos(dist);
					dist = dist * 180/Math.PI;
					// dist = dist * 60 * 1.1515;
					dist = dist * 0.8684;
				}
			}
			if (dist < 30) {
				tab[l] = users[i];
				l++; 
			}
			i++;
		}
		users = tab;
		resolve(users);
	})
}

function suggScore(users, score) {
	return new Promise((resolve, reject) => {
		var i = 0;
		var l = 0;
		var k = 0;
		var tmp;
		var tab = []
		var far = []
		while (users[i] != undefined) {
			if(users[i].score - score >= -20 && users[i].score <= 20) {
				tab[l] = users[i];
				l++;
			} else {
				far[k] = users[i];
				k++;
			}
			i++
		}
		tab = tab.concat(far);
		users = tab;
		resolve (users);
	})
	
}

function suggestion(id) {
	return new Promise ((resolve, reject) => {
		let sql = "SELECT * FROM users WHERE id = ?";
		let value = [
			[id]
		]
		con.query(sql, value, function (err, profil) {
			if (err) throw err;
			if (profil[0].age == 0 || profil[0].genre == 'undefined' || profil[0].interest == 'undefined' ) {
				resolve({status: "error", response: "profil non complet"});
			} else {
				const getprofil = require('./allUsers');
				getprofil.get_profil(id).then((users) => {
					users = users.users;
					suggGenre(users, profil).then((users) => {
						var tmp = users;
						suggDistance(users, profil).then((users) => {
							optionInteret(users, profil[0].id).then((users) => {
								suggScore(users, profil[0].score).then((users) => {
									resolve(users);
								})
							})
						})
					})
				})
			}
		})
	})
}
module.exports.suggestion = suggestion;