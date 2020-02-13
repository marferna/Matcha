import React from "react";
import './css/home.css';

class HomeNoLog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inscription: window.location.href === "http://localhost:3000/?inscription" ? 1 : 0,
			connection: window.location.href === "http://localhost:3000/?connection" ? 1 : 0,
			error: '',
			longitude: '',
			latitude: '',
		}
		this.login = React.createRef();
		this.nom = React.createRef();
		this.prenom = React.createRef();
		this.email = React.createRef();
		this.reset_email = React.createRef();
		this.passwd = React.createRef();
		this.passwd2 = React.createRef();
		this.inputConnection = this.inputConnection.bind(this);
		this.inputInscription = this.inputInscription.bind(this);
		this.fetch_passwd = this.fetch_passwd.bind(this);
		this.load = 0;
		// this.success = this.success.bind(this);
		// this.error = this.error.bind(this);
	}

	inputInscription = (event) => {
		event.preventDefault();
		fetch(`http://localhost:8080/auth/inscription`, {
			method: 'POST',
			credentials: 'include',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					login: this.login.current.value,
					nom: this.nom.current.value,
					prenom: this.prenom.current.value,
					email: this.email.current.value,
					passwd: this.passwd.current.value,
					passwd2: this.passwd2.current.value
				}
			)
		}).then((response) => {
			response.text().then((res) => {
				if (res === "inscrit") {
					this.setState({
						error: 'You are well registered',
						inscription: 0,
						connection: 1
					})
				}
				else {
					if (res === "champs non complet") {
						this.setState({error: "Fields not complete"});
					}
					else if (res === "login exist") {
						this.setState({error: "Login already taken"});
					}
					else if (res === "email exist") {
						this.setState({error: "Email already taken"});
					}
					else if (res === "mdp different") {
						this.setState({error: "Passwords must be the same"}); // pas encore gere par le serveur
					}
					else if (res === "mdp easy") {
						this.setState({error: "Password too simple"}); //pas encore gere par le serveur
					}
				}
			});
		});
	}

	inscription() {
		if (this.state.inscription === 0) {
			return (
				<input className="button" defaultValue="Register" onClick={ e => this.clicksubmit() } />
			)
		} else {
			return (
				<form onSubmit={ this.inputInscription }>
					<table className="table-home">
						<tbody>
							<tr>
								<td align="right">
									<label className="typein" htmlFor="login">Login : </label>
								</td>
								<td>
									<input type="text"
									name="login"
									id="login"
									placeholder=""
									ref={this.login}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<label className="typein" htmlFor="nom">Last Name : </label>
								</td>
								<td>
									<input type="text"
									name="nom"
									id="nom"
									placeholder=""
									ref={this.nom}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<label className="typein" htmlFor="prenom">First Name : </label>
								</td>
								<td>
									<input type="text"
									name="prenom"
									id="prenom"
									placeholder=""
									ref={this.prenom}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<label className="typein" htmlFor="email">Email : </label>
								</td>
								<td>
									<input type="email"
									name="email"
									id="email"
									placeholder=""
									ref={this.email}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<label className="typein" htmlFor="passwd">Password : </label>
								</td>
								<td>
									<input type="password"
									name="passwd"
									id="passwd"
									placeholder=""
									ref={this.passwd}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<label className="typein" htmlFor="passwd2">Confirm Password : </label>
								</td>
								<td>
									<input type="password"
									name="passwd2"
									id="passwd2"
									placeholder=""
									ref={this.passwd2}
									/>
								</td>
							</tr>
							<tr>
								<td></td>
								<td>
								</td>
							</tr>
						</tbody>
					</table>
					<input type="submit" value="Register" />
					{ this.state.error }
				</form>
			);
		}
	}

	inputConnection = (event) => {
		event.preventDefault();

		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		  };

		  this.success = pos => {
			var crd = pos.coords;
			fetch(`http://localhost:8080/auth/connection`, {
				method: 'POST',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(
					{
						login: this.login.current.value,
						passwd: this.passwd.current.value,
						longitude: crd.longitude,
						latitude: crd.latitude
					}
				)
			}).then((response) => {
				response.text().then((res) => {
					if (res === "error") {
						this.setState({
							error: "Incorrect password or login",
						});
					} else if (res === "email") {
						this.setState({
							error: "Email must be confirmed",
						});
					} else {
						localStorage.setItem('token', res);
						document.location.href='profil';
					}
				});
			});
		  }

		  this.error = err => {
			fetch (`http://www.geoplugin.net/json.gp?jsoncallback=?`).then((response) => {
			response.text().then((res) => {
			  var pos = res.split(',');
			  var latitude = pos[17].split(':')[1].split('"')[1];
			  var longitude = pos[18].split(':')[1].split('"')[1];
			  fetch(`http://localhost:8080/auth/connection`, {
				method: 'POST',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(
					{
						login: this.login.current.value,
						passwd: this.passwd.current.value,
						longitude: longitude,
						latitude: latitude
					}
				)
			}).then((response) => {
				response.text().then((res) => {
					if (res === "error") {
						this.setState({
							error: "Incorrect password or login",
						});
					} else if (res === "email") {
						this.setState({
							error: "Email must be confirmed",
						});
					} else {
						localStorage.setItem('token', res);
						document.location.href='profil';
					}
				});
			});
			})
			})
		}
		navigator.geolocation.getCurrentPosition(this.success, this.error, options);
	}

	fetch_passwd = (event) => {
		event.preventDefault();
		fetch(`http://localhost:8080/auth/email_resetPasswd`, {
			method: 'POST',
			credentials: 'include',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(
				{
					email: this.reset_email.current.value,
				}
			)
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.response === "error") {
				this.setState({ error: "Invalid email" })
			}
		})
	}

	resetPasswd() {
		if (this.state.error !== '') {
			return (
				<div>
					Forgot Password ?
					<form onSubmit={ this.fetch_passwd }>
					<label className="typein" htmlFor="login">Email :</label>
						<input className="reset" type="email" name="email" ref={this.reset_email} placeholder="" />
						<input type="submit" value="Reset Password" className="button" />
					</form>
				</div>
			)
		}
	}

	connection() {
		if (this.state.connection === 0) {
			return (
				<input defaultValue="Sign In" className="button" onClick={ e => this.clickcon() } />
			)
		} else {
			return (
				<div>
					<form onSubmit={ this.inputConnection }>
						<table className="table-home">
							<tbody>
								<tr>
									<td align="right">
										<label className="typein" htmlFor="login">Login : </label>
									</td>
									<td>
										<input type="text"
										name="login"
										id="login"
										placeholder=""
										ref={this.login}
										/>
									</td>
								</tr>
								<tr>
									<td align="right">
										<label className="typein" htmlFor="passwd">Password : </label>
									</td>
									<td>
										<input type="password"
										name="passwd"
										id="passwd"
										placeholder=""
										ref={this.passwd}
										/>
									</td>
								</tr>
								<tr>
									<td></td>
									<td>
									</td>
								</tr>
							</tbody>
						</table>
						<input type="submit" value="Sign In" />
						{ this.state.error }
					</form>
					{ this.resetPasswd() }
				</div>
			);
		}
	}

	clicksubmit = event => {
		this.setState({
			inscription: 1,
			connection: 0,
			error: ''
		})
	};

	clickcon = event => {
		this.setState({
			inscription: 0,
			connection: 1,
			error: ''
		}) 
	};

	render () {

		return (
			<div className="home">
				{ this.inscription() }
				{ this.connection() }
			</div>
		)
	}
}

class HomeLog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profils: [],
			error: '',
			suggestion_button: 0,
		}
		this.interet = [];
		this.load = 0;
		this.profils = '';
		this.ageMin = React.createRef();
		this.ageMax = React.createRef();
		this.scoreMin = React.createRef();
		this.scoreMax = React.createRef();
		this.locMin = React.createRef();
		this.locMax = React.createRef();
		this.addInteret = React.createRef();
		this.get_profil = this.get_profil.bind(this);
		this.redirectProfil = this.redirectProfil.bind(this);
	}
	redirectProfil = event => {
		localStorage.setItem('id_user', event);
		document.location.href= '/user';
	}
	get_profil() {
		this.load = 1;
		var token = localStorage.getItem('token');
		fetch(`http://localhost:8080/match/get_profil`, {
			method: 'GET',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.response === "no connect") {
				localStorage.removeItem('token');
				document.location.href='/';
			} else {
				this.setState({
					profils: parsedData.users
				})
			}
		})

	}
	Interval = event => {
		event.preventDefault();
		this.setState({ error: ''});
		var token = localStorage.getItem('token');
		fetch(`http://localhost:8080/trie/option`, {
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
			body: JSON.stringify({
				locMin: this.locMin.current.value,
				locMax: this.locMax.current.value,
				ageMin: this.ageMin.current.value,
				ageMax: this.ageMax.current.value,
				scoreMin: this.scoreMin.current.value,
				scoreMax: this.scoreMax.current.value,
				interet: this.interet,
				suggestion: this.state.suggestion_button,
				profils: this.state.profils,
			})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.response === "no connect") {
				localStorage.removeItem('token');
				document.location.href='/';
			} else {
				this.setState({
					profils: parsedData.users
				})
			}
		})
	}

	fillInteret = event => {
		if (this.addInteret.current.value) {
			var i = 0;
			var nope = '';
			while (this.interet[i] !== undefined) {
				if (this.interet[i] === this.addInteret.current.value) {
					nope = "nope";
				}
				i++;
			}
			if (nope !== "nope") {
				this.interet[i] = "#" + this.addInteret.current.value;
				this.setState({error: ''});
			}
		}
	}

	deleteInteret = event => {
		var i = 0;
		var j = 0;
		var tab = [];
		while (this.interet[i] !== undefined) {
			if (i === event) {
				i++;
			} else {
				tab[j] = this.interet[i];
				j++;
				i++;
			}
		}
		this.interet = tab;
		this.setState({error: ''});
	}

	trie() {
		return (
			<form className="form-change" onSubmit={ this.Interval }>
				<fieldset className="carre">
					<legend className="leg">Select</legend>
					<div className="ok">
						Minimum Age :
						<input className="one" type="number" name="min-age" id="min-age" ref={ this.ageMin } min="18" />
						Maximum Age :
						<input type="number" name="max-age" id="max-age" ref={ this.ageMax } min="18" />
					</div>
					<div className="ok">
						Minimum Score :
						<input className="dos" type="number" name="min-score" id="min-score" ref={ this.scoreMin }/>
						Maximum Score :
						<input type="number" name="max-score" id="max-score" ref={ this.scoreMax }/>
					</div>
					<div className="ok">
						Minimum Range :
						<input className="tres" type="number" name="min-loc" id="min-loc" min="0" ref={ this.locMin }/>
						Maximum Range :
						<input type="number" name="max-loc" id="max-loc" min="0" ref={ this.locMax }/>
					</div>
					<div className="ok">
						Add Interest :
						<input className="quatre" type="text" name="interet" ref={ this.addInteret } />
						<button className="butbut1" name="add-interet" onClick={ (e) => this.fillInteret() } >Add</button>
						{this.interet.map((elem, index) => {
							return (
								<p onClick={ e => this.deleteInteret(index) } key={index}>{elem}</p>
								)
							})}
					</div>
					<input className="butbut" type="submit" value="Search" />
				</fieldset>
				</form>
		)
	}

	handleTrie = event => {
		event.preventDefault();
		var token = localStorage.getItem('token');
		fetch(`http://localhost:8080/trie/triable`, {
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
			body: JSON.stringify({
				profils: this.state.profils,
				option: event.target.value,
			})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.response === "no connect") {
				localStorage.removeItem('token');
				document.location.href='/';
			} else {
				this.setState({
					profils: parsedData.users
				})
			}
		})
	}

	trieCroissant() {
		return (
			<div className="lecedric">
				<select className="lecedric" name="trie" onChange={ this.handleTrie }>
					<option className="voila" value="default">Default</option>
					<option className="voila" value="age">Age</option>
					<option className="voila" value="score">Score de popularité</option>
					<option className="voila" value="distance">Distance</option>
					<option className="voila" value="interet">Interet</option>
				</select>
			</div>
		)
	}
	suggestion = event => {
		if (this.state.suggestion_button === 0){
			this.setState({ suggestion_button: 1 });
			this.fetch_suggestion();
		} else {
			this.setState({ suggestion_button: 0 });
			this.get_profil();
		}
	}

	fetch_suggestion() {
		var token = localStorage.getItem('token');
		fetch(`http://localhost:8080/trie/suggestion`, {
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
			body: JSON.stringify({
			})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.response === "no connect") {
				localStorage.removeItem('token');
				document.location.href='/';
			} else if (parsedData.users.response === 'profil non complet') {
				this.setState({error: "Profil non complet"});
			} else {
				this.setState({
					profils: parsedData.users
				})
			}
		})
	}

	render () {
		if (this.load === 0)
			this.get_profil()
		return (
			<div>
				{ this.trie() }
				{ this.trieCroissant() }
				<button className="suggest" onClick={ e => this.suggestion() }>{ this.state.suggestion_button === 0 ? "Suggestion" : "All profils"}</button>
				{ this.state.error }
				{ this.state.profils.map((elem, index) => {
					if (elem.photo === undefined) {
						return ('');
					} else {
						return (
							<div onClick={ e => this.redirectProfil(elem.id) } key={index} className="profil">
							<img height="100" alt="" src={elem.photo} />
							<p >{elem.prenom} {elem.nom}</p>
						</div>
						)
					}
				  })
				}
			</div>
		)
	}
}

export default class Home extends React.Component {
	render() {
			var token = localStorage.getItem('token');
			if (token === null) {
				 return <HomeNoLog />
			} else {
				return <HomeLog />
			}
	}
};
