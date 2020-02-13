'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const bdd = require("./db_connect.js");

//connect to bdd
let con = bdd.con;
con.connect();

const server = express();

server.set('port', process.env.PORT || 8080);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

// CORS requests
const cors = require('cors')
server.options("http://localhost:3000", cors());
server.use(cors({origin: "http://localhost:3000", credentials: true}));
// disables 'x-powered-by', this makes it more difficult for users to see that we are using Express.
server.disable('x-powered-by');

server.set('trust proxy', 1)

//set up routes

const authRoutes = require('./routes/auth.js');
server.use('/auth', authRoutes);

const profilRoutes = require('./routes/profil.js');
server.use('/profil', profilRoutes);

const matchRoutes = require('./routes/match.js');
server.use('/match', matchRoutes);

const trieRoutes = require('./routes/trie.js');
server.use('/trie', trieRoutes);

const notifRoutes = require('./routes/notif.js');
server.use('/notif', notifRoutes);

server.use((req, res) => {
	res.type('text/plain');
	res.status(505);
	res.send('Error page');
});

server.listen(8080);