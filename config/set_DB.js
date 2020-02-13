const bdd = require("./db_connect.js");
let con = bdd.con;
let con_1 = bdd.con_1;

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

async function table(filesql) {
	return new Promise(async (resolve, reject) => {
		let file_data = await readFile(filesql, 'utf8');
		let tab = file_data.split('\n');
		let i = 0;
		let str = '';
		for (i = 0; i < tab.length; i++) {
			if (tab[i] != '') {
				str = str + tab[i];
				str = str.replace(/\r/gi, " ");
				str = str.replace(/\n/gi, " ");
				if (tab[i].indexOf(';') != -1) {
					con.query(str, function (err, result) {
						if (err) throw err;
					})
					str = '';
				}
			}
		}
		resolve();
	})
}

async function fill(filesql) {
	return new Promise ((resolve, reject) => {
		sql = "CREATE DATABASE IF NOT EXISTS `db_matcha`";
		con_1.query(sql,  async function (err, result) {
			if (err) throw err;
			con.connect(function (err) {
				if (err) throw err;
				table(filesql);
				resolve();
			})
		})
	})
}

const created = fill('./db_matcha_empty.sql');

console.log("la DB a bien été créé !");
// module.exports.fill = fill;