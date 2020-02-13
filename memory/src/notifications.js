import React from 'react';
import './css/notif.css';

export default class Notif extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notif: []
		}
		this.load = 0;
	}

	get_notif() {
		this.load = 1;
		var token = localStorage.getItem('token');
		fetch(`http://localhost:8080/notif/get_notif` , {
			method: 'GET',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.error === "error") {
				localStorage.removeItem('token');
				document.location.href='/';
			} else {
				this.setState({
					notif: parsedData.notif.notif
				})
			}
		})
	}
 
	visite = event => {
		localStorage.setItem('id_user', event);
		document.location.href= '/user';
	}

	put_notif(elem) {
		if (elem.lu === 1) {
			if (elem.notif === "Nouveau match" || elem.notif === "Cheh vous avez perdu un match") {
				return (
					<div className="lu">
					{ elem.notif }
					</div>
				)
			} else {
				return (
					<div className="lu" onClick={ e => this.visite(elem.id) }>
						<img className="avatara3" alt="" src={elem.photo} />
						{ elem.prenom } { elem.nom } { elem.notif }
					</div>
				)
			}
		} else {
			if (elem.notif === "Nouveau match" || elem.notif === "Cheh vous avez perdu un match") {
				return (
					<div className="non-lu">
						{ elem.notif }
					</div>
				)
			} else {
				return (
					<div className="non-lu" onClick={ e => this.visite(elem.id) }>
						<img className="avatara3" alt="" src={elem.photo} />
						{ elem.prenom } { elem.nom } { elem.notif }
					</div>
				)
			}
		}
	}

	render() {
		if (this.load === 0) {
			this.get_notif();
		}
		return (
			<div>
				{ 	this.state.notif.map((elem, index) => {
						return (
							<div className="placement" key={index}>
								{ this.put_notif(elem) }
							</div>
						)
					})
				}
			</div>
		)
	}
}
