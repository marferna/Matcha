const faker = require('faker');
faker.locale = "fr";
var add = require('./js/modif');
const bdd = require('./db_connect.js');
const ent = require('ent');
const bcrypt = require('bcryptjs');
let con = bdd.con;
con.connect();

function genre(max) {
	let math = Math.floor(Math.random() * Math.floor(max));
	if (math == 0)
		return ('homme');
	else if (math == 1)
		return ('femme');
	else
		return ('autre');
}

function age(max) {
	let math =  Math.floor(Math.random() * Math.floor(max));
	if (math < 18)
		return (18);
	else
		return (math);
}

async function insert(sql, values) {
	return  new Promise((resolve, reject) => {
		con.query(sql, [values], async function(err, res) {
			if (err) throw err;
			resolve();
		})
	})
}


async function insert_interet(id) {
	return new Promise((resolve, reject) => {
		let interet = [
			"sport", "voyages", "manga", "Harry Potter", "series", "dev", "escalde", "art", "jeux videos", "cinema", "restaurants", "visites", "musees", "rien", "dance", "apple", "android", "menage", "chien", "animaux", "les animaux fantastiques", "bateaux", "poisons", "poissons", "catamaran", "kayak", "canoe", "vaa'a", "mers", "ocean", "iles", "plongees", "aviron", "plage", "port", "yatch", "moulaga", "fruit de mers", "peche", "surf", "ski", "croisieres", "piscine", "helicopere", "moustache", "pirate", "indiens", "batman"
		]
		var k = 1;
		while (k < 4) {
			var math = Math.floor(Math.random() * Math.floor(49));
			add.add_interet("#" + interet[math], id);
			k++;
		}
		resolve();
	})
}

async function insert_photos(sql, values, i) {
	return new Promise((resolve, reject) => {
		con.query(sql, [values], async function(err, res) {
			if (err) throw err;
			resolve();
		})
	})
}


async function fill(nb) {
	return new Promise(async (resolve, reject) => {
		var i = 1;
		while (i <= nb) {
			var randomLogin = faker.internet.userName();
			randomLogin = randomLogin.replace(/[ùûü]/g,"u").replace(/[îï]/g,"i").replace(/[àâä]/g,"a").replace(/[ôö]/g,"o").replace(/[éèêë]/g,"e").replace(/ç/g,"c");
			var randomEmail = faker.internet.email();
			var randomLastName = faker.name.lastName();
			var randomFirstName = faker.name.firstName();
			var randomPassword = "Qwerty1";
			var randomGenre = genre(3);
			var randomInterest = genre(3);
			var randomBio = faker.lorem.lines();
			var randomAge = age(35);
			var randomLatitude = faker.address.latitude();
			var randomLongitude = faker.address.longitude();
			var randomLog = Math.floor(Math.random() * (1581449710326 - 1581021235721 + 1) + 1581021235721);
			var randomScore = Math.floor(Math.random() * (150 - -150 + 1) + -150);
			let sql = "INSERT INTO users (login, email, nom, prenom, passwd, genre, interest, bio, age, latitude, longitude, log, confirm_mail, score) VALUES ?"
			let values = [
				[ent.encode(randomLogin), randomEmail, ent.encode(randomLastName), ent.encode(randomFirstName), bcrypt.hashSync(ent.encode(randomPassword, 8)), randomGenre, randomInterest, randomBio, randomAge, randomLatitude, randomLongitude, randomLog, 1, randomScore]
			]
			await insert(sql, values);
			let photos = [
				"0.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg"
			]
			var math = Math.floor(Math.random() * Math.floor(26));
			var math2 = Math.floor(Math.random() * Math.floor(26));
			sql = "INSERT INTO photos (id_user, photo_1, photo_2, photo_3, photo_4, photo_5) VALUES ?";
			values = [
				[i, ent.encode(photos[math]), ent.encode(photos[math2]), ent.encode(''), ent.encode(''), ent.encode('')]
			]
			await insert_photos(sql, values, i);
			await insert_interet(i)
			console.log("user: " + i + " login: " + randomLogin + " has been created !");
			i++;
		}
		resolve("ok");
	})
}
module.exports.fill = fill;
