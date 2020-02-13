import React from 'react';
import ReactDOM from 'react-dom';
// import './css/index.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
  } from "react-router-dom";
  import Home from './home_page.js';
  import Profil from './profil.js';
  import Logout from './logout.js';
  import Header from './header.js';
  import Confirmation from './confirmation.js';
  import User from './user.js';
  import ResetMDP from './resetMDP.js'
  import Match from './match';
  import Notif from './notifications';
	import Chat from './app';
	import './css/index.css';

function App() {
	return (
	  <Router>
		  <Header />
		  <Switch>
		  <Route path="/notif">
				<Notif />
		  </Route> 
		  <Route path="/match">
				<Match />
		  </Route>   
			<Route path="/chat">
				<Chat />
			</Route>
		  <Route path="/reset">
				<ResetMDP />
		  </Route>
		  <Route path="/user">
				<User />
		  </Route>
		  <Route path="/confirmation">
				<Confirmation />
		  </Route>
		  <Route path="/logout">
			  <Logout/>
			</Route>
			<Route path="/profil">
			  < Profil />
			</Route>
			<Route path="/">
				<Home />
			</Route>
		  </Switch>
	  </Router>
	);
  }

ReactDOM.render(<App />, document.getElementById('root'));
