const mysql = require('mysql');
const bdd = require("../db_connect.js");
const ent = require('ent');
var fs = require('fs');
let con = bdd.con;

function match(id) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM match_users WHERE user1 = ?"
		let values = [
			[id]
		]
		con.query(sql, values, function (err, tab1) {
			if (err) throw err;
			sql = "SELECT * FROM match_users WHERE user2 = ?"
			con.query(sql, values, function (err, tab2) {
				if (err) throw err;
				var tab3 = tab1.concat(tab2);
			})
		})
	})
}

module.exports.match = match

function insert_chat(id_connect, id_stalk)
{
	return new Promise((resolve, reject) => {
	// Take login - id_connect
	let req = "SELECT login FROM users WHERE id = ?"
	let value = [
		[id_connect]
	]
	con.query(req, value, function (err, res) {
		if (err) throw err;
		resolve (res[0].login)
		let login1 = res[0].login
		// Take login - id_stalk
		let req2 = "SELECT login FROM users WHERE id = ?"
		let value2 = [
				[id_stalk]
			]
			con.query(req2, value2, function (err, res) {
				if (err) throw err;
				resolve (res[0].login)
				let login2 = res[0].login
				// Take picture for id_connect
				let avatar1 = "SELECT * FROM photos WHERE id_user = ?"
				let value_avatar1 = [
					[id_connect]
				]
				con.query(avatar1, value_avatar1, function (err, result) {
					if (err) throw err;
					var photo1 = [];
					var i = 0;
					while (result[i] != undefined)
					{
						if (result[i].photo_1 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_1)) {
							photo1[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_1 };
						} else if (result[i].photo_2 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_2)) {
							photo1[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_2 };
						} else if ( result[i].photo_3 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_3)) {
							photo1[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_3 };
						} else if (result[i].photo_4 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_4)) {
							photo1[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_4 };
						} else if (result[i].photo_5 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_5)) {
							photo1[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_5 };
						} else {
							photo1[i] = { id_user: result[i].id_user, photo: '/photos/Default.png' };
						}
						i++;
					}
					resolve(photo1);
					let photo_user1 = photo1[0].photo;
					// Take picture for id_stalk
					let avatar2 = "SELECT * FROM photos WHERE id_user = ?"
					let value_avatar2 = [
						[id_stalk]
					]
					con.query(avatar2, value_avatar2, function (err, result) {
						if (err) throw err;
						var photo2 = []
						var i = 0;
						while (result[i] != undefined)
						{
							if (result[i].photo_1 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_1)) {
								photo2[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_1 };
							} else if (result[i].photo_2 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_2)) {
								photo2[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_2 };
							} else if ( result[i].photo_3 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_3)) {
								photo2[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_3 };
							} else if (result[i].photo_4 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_4)) {
								photo2[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_4 };
							} else if (result[i].photo_5 !== '' && fs.existsSync('./memory/public/photos/' + result[i].photo_5)) {
								photo2[i] = { id_user: result[i].id_user, photo: '/photos/' + result[i].photo_5 };
							} else {
								photo2[i] = { id_user: result[i].id_user, photo: '/photos/Default.png' };
							}
							i++;
						}
						resolve(photo2);
						let photo_user2 = photo2[0].photo;
						// Check if id_connect and id_stalk are not already put
						let check1 = "SELECT user1, user2 FROM chat WHERE user1 = ? AND user2 = ?"
						let value_check1 = [
							[id_connect], [id_stalk]
						]
						con.query(check1, value_check1, function (err, res) {
							if (err) throw err;
							let exist;
							if (res == '') {
								exist = 0;
							}
							else {
								exist = 1;
							}
							let check2 = "SELECT user1, user2 FROM chat WHERE user1 = ? AND user2 = ?"
							let value_check2 = [
								[id_stalk], [id_connect]
							]
							con.query(check2, value_check2, function (err, res) {
								if (err) throw err;
								let exist2;
								if (res == '') {
									exist2 = 0;
								}
								else {
									exist2 = 1;
								}
								if (exist === 0 && exist2 === 0) {
									// Insert all for chat table
									let insert = "INSERT INTO chat (user1, user2, login1, login2, avatar1, avatar2) VALUES ?"
									let values_insert = [
										[id_connect, id_stalk, login1, login2, photo_user1, photo_user2]
									]
									con.query(insert, [values_insert], function (err, res) {
										if (err) throw err;
										resolve(res);
									}
								)}
							})
						})
					})
				})
			})
		})
	})
}

module.exports.insert_chat = insert_chat;

function insert_chatmessage(id_connect, id_stalk, message, user_from) {
	return new Promise((resolve, reject) => {
		let sql = "INSERT INTO notif (id_user, id_stalk, notif) VALUES ?"
		let val = [
			[id_connect, id_stalk, "vous a envoyé un message"]
		]
		con.query(sql, [val], function (err, res) {
			if (err) throw err;
		})
		let date = new Date();
		let insert = "INSERT INTO message_chat (user1, user2, message, user_from, creation_time) VALUES ?"
		let values = [
			[id_connect, id_stalk, ent.encode(message), id_connect, date]
		]
		con.query(insert, [values], function (err, res) {
			if (err) throw err;
			resolve(res);
		})
	})
}

module.exports.insert_chatmessage = insert_chatmessage;

function chat_message(id_connect, id_stalk) {
	return new Promise((resolve, reject) => {
		let select = "SELECT * FROM message_chat WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)"
		let values = [
			[id_connect], [id_stalk], [id_stalk], [id_connect]
		]
		con.query(select, values, function (err, res) {
			if (err) throw err;
			if (res != '') {
				user1 = res[0].user1;
				user2 = res[0].user2;
				user_from = res[0].user_from;
				date = res[0].creation_time;
				let i = 0;
				let message = [];
				while(res[i] !== undefined)
				{
					message[i] = {
						message: ent.decode(res[i].message),
						user_from: res[i].user_from,
						date: res[i].creation_time
					}
						i++;
				}
				resolve({message: message})
			}
		})
	})
}

module.exports.chat_message = chat_message;

function chat(id_connect, id_stalk) {
	return new Promise((resolve, reject) => {
		let sql = "SELECT * FROM chat WHERE (user1 = ? AND user2 = ? ) OR (user1 = ? AND user2 = ? )"
		let values = [
			[id_connect], [id_stalk], [id_stalk], [id_connect]
		]
		con.query(sql, values, function (err, res) {
			if (err) throw err;
			user1 = res[0].user1;
			user2 = res[0].user2;
			login1 = res[0].login1;
			login2 = res[0].login2;
			avatar1 = res[0].avatar1;
			avatar2 = res[0].avatar2;
			resolve({user1, user2, login1, login2, avatar1, avatar2})
		})
	})
}

module.exports.chat = chat;
