import React from "react";
import './css/home.css';

export default class Match extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profils: [],
		}
		this.load = 0;
	}
	
	redirectProfil = event => {
		localStorage.setItem('id_user', event);
		document.location.href= '/user';
	}

	redirectChat = event => {
		localStorage.setItem('id_user', event);
		document.location.href= '/chat';
	}


	get_match() {
		this.load = 1;
		var token = localStorage.getItem('token');
		fetch(`http://localhost:8080/match/get_match` , {
			method: 'GET',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
		}).then((response) => {
			return response.json();
		}).then((parsedData) => { 
			if (parsedData.response === "no connect") {
				localStorage.removeItem('token');
				document.location.href='/';
			} else {
				this.setState({
					profils: parsedData.users.users
				})
			}
		})
	}

	render() {
		if (this.load === 0) {
			this.get_match();
		}
		return (
			<div>
				{ this.state.profils.map((elem, index) => {
					return (
						<div key={index} className="profil">
							<div onClick={ e => this.redirectProfil(elem.id) }  >
								<img height="100" alt="" src={elem.photo} />
								<p >{elem.prenom} {elem.nom}</p>
							</div>
							<button className="clecss" name="name" onClick={ e => this.redirectChat(elem.id) }>Chat</button>
						</div>
							)
					})
				}
			</div>
		)
	}
}
