import React from 'react';
import './css/profil.css';

export default class User extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login: '',
			nom: '',
			age: '',
			genre: '',
			interest: '',
			bio: '',
			score: '',
			photo_1: '',
			photo_2: '',
			photo_3: '',
			photo_4: '',
			photo_5: '',
			value_photo: 1,
			like: '',
			reload: 1,
			user_like: 0,
			block: '',
			interet: '',
			log: '',
			distance: '',
			connect_photo: '',
		}
		this.load = 0;
		this.notif = 0;
		this.get_user = this.get_user.bind(this);
		this.like = this.like.bind(this);
		this.block_user = this.block_user.bind(this);
	}

	componentDidMount() { 
		var token = localStorage.getItem('token');
		if (!token) {
			localStorage.removeItem('id_user');
			document.location.href = '/';
		}
	}

	putdistance() {
		if (this.state.distance !== '')
		{
			return (
				<div className="typelove">
						Range :
						<div className="repo">
							{ this.state.distance } nautic
						</div>
				</div>
			)
		}
	}

	valueRight(value) {
		if (value === 1 && this.state.photo_1 === undefined){

				value = value + 1
		} if (value === 2 && this.state.photo_2=== undefined){

				value = value + 1
		} if (value === 3 && this.state.photo_3 === undefined){

				value = value + 1
		} if (value === 4 && this.state.photo_4 === undefined){

				value = value + 1
		} if (value === 5 && this.state.photo_5 === undefined) {
				value = 1
			if (value === 1 && this.state.photo_1 === undefined){

					value = value + 1
			} if (value === 2 && this.state.photo_2 === undefined){

					value = value + 1
			} if (value === 3 && this.state.photo_3 === undefined){

					value = value + 1
			} if (value === 4 && this.state.photo_4 === undefined){

					value = value + 1
			}
		}
		return (value);
	}

	valueLeft(value) {
		if (value === 5 && this.state.photo_5 === undefined){

				value = value - 1
		} if (value === 4 && this.state.photo_4 === undefined){

				value = value - 1
		} if (value === 3 && this.state.photo_3 === undefined){

				value = value - 1
		} if (value === 2 && this.state.photo_2 === undefined){

				value = value - 1
		} if (value === 1 && this.state.photo_1 === undefined) {

				value = 5
			if (value === 5 && this.state.photo_5 === undefined){

					value = value - 1
			} if (value === 4 && this.state.photo_4 === undefined){

					value = value - 1
			} if (value === 3 && this.state.photo_3 === undefined){

					value = value - 1
			} if (value === 2 && this.state.photo_2 === undefined){

					value = value - 1
			}
		}
		return (value);
	}

	switchPhoto = event => {
		var value;
		if (event === 'left') {
			if ( this.state.value_photo === 1) {
					value = 5
			} else {
					value = this.state.value_photo - 1
			}
			value = this.valueLeft(value);
			this.setState({
				value_photo: value
			})
		} else if (event === 'right' && this.state.value_photo !== 5) {
			if ( this.state.value_photo === 5) {
				value = 1
		} else {
				value = this.state.value_photo + 1
		}
		value = this.valueRight(value);
		this.setState({
			value_photo: value
		})
		}
	};

	putIMG() {
		if (this.state.value_photo === 1) {
			return (
				<img width="640px" height="310px" alt="" src={this.state.photo_1} />
			)
		}	if (this.state.value_photo === 2) {
			return (
				<img width="640px" height="310px" alt="" src={this.state.photo_2} />
			)
		}	if (this.state.value_photo === 3) {
			return (
				<img width="640px" height="310px" alt="" src={this.state.photo_3} />
			)
		}	if (this.state.value_photo === 4) {
			return (
				<img width="640px" height="310px" alt="" src={this.state.photo_4} />
			)
		}	if (this.state.value_photo === 5) {
			return (
				<img width="640px" height="310px" alt="" src={this.state.photo_5} />
			)
		}
	}

	like() {
		this.load = 0;
		var token = localStorage.getItem('token');
		var id_user = localStorage.getItem('id_user');
		fetch (`http://localhost:8080/match/like`, {
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
			body: JSON.stringify(
			{
				id_user: id_user
			})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			this.setState({ like: parsedData.response });
		})
	}

	putAge() {
		if (this.state.age > 17) {
			return (
				<div className="typelove">
						Age : 
						<div className="repo">
							{ this.state.age } years
						</div>
				</div>
				);
		}
	}

	button_like() {
		if (this.state.photo_1 !== "/photos/Default.png" && this.state.connect_photo === 'ok') {
			return (
				<input type="submit" className="like" value={ this.state.like } onClick={ e => this.like() }></input>
			)
		}

	}

	user_like() {
		if (this.state.user_like === 1 && this.state.photo_1 !== "/photos/Default.png") {
			return (
				<div className="ligne">This user likes you !</div>
			)
		}
	}

	block_user = (event) => {
		var token = localStorage.getItem('token');
		var id_user = localStorage.getItem('id_user');
		fetch (`http://localhost:8080/match/block_user`, {
			method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}),
				body: JSON.stringify(
				{
					id_user: id_user
				})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.status === "ok") {
				this.setState({
					block: "This user has been blocked"
				});
			}
		})
	}

	report_user = (event) => {
		var token = localStorage.getItem('token');
		var id_user = localStorage.getItem('id_user');
		fetch (`http://localhost:8080/match/report_user`, {
			method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}),
				body: JSON.stringify(
				{
					id_user: id_user
				})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.status === "ok") {
				this.setState({
					block: "This user has been reported"
				});
			}
		})
	}

	putInteret() {
		if (this.state.interet !== '') {
			return (
				<div className="typelove">
						Interest :
						<div className="repo">
							{ this.state.interet }
						</div>
				</div>
			)
		}
	}

	log() {
		if (this.state.log === 'log') {
			return (
					<p className="ligne">User online</p>
			)
		} else if (this.state.log !== '') {
			return (
					<p className="ligne">User offline since { this.state.log }</p>
			)
		}
	}
	get_user() {
		this.load = 1;
		var token = localStorage.getItem('token');
		var id_user = localStorage.getItem('id_user');
		fetch (`http://localhost:8080/match/get_user`, {
			method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}),
				body: JSON.stringify(
				{
					id_user: id_user
				})
		}).then((response) => {
				return response.json();
			}).then((parsedData) => {
				if (parsedData.response === "no connect") {
					document.location.href = '/';
				} if (parsedData.response === "error id_user") {
					localStorage.removeItem('id_user');
					document.location.href = '/';
				} else {
					this.setState({
						login: parsedData.user.user.login,
						nom: parsedData.user.user.nom,
						prenom: parsedData.user.user.prenom,
						age: parsedData.user.user.age,
						genre: parsedData.user.user.genre,
						interest: parsedData.user.user.interest,
						bio: parsedData.user.user.bio,
						score: parsedData.user.user.score,
						photo_1: parsedData.user.photos.photo_1,
						photo_2: parsedData.user.photos.photo_2,
						photo_3: parsedData.user.photos.photo_3,
						photo_4: parsedData.user.photos.photo_4,
						photo_5: parsedData.user.photos.photo_5,
						like: parsedData.user.like.like,
						user_like: parsedData.user.user_like,
						interet: parsedData.user.interet,
						log: parsedData.user.user.date,
						distance: parsedData.user.user.distance,
						connect_photo: parsedData.user.connect_photo,
					})
					var value = 1;
					if (this.state.photo_1 === undefined) {
						value++;
					} if ( value === 2 && this.state.photo_2 === undefined) {
						value++;
					} if ( value === 3 && this.state.photo_3 === undefined) {
						value++;
					} if ( value === 4 && this.state.photo_4 === undefined) {
						value++;
					}
					this.setState({ value_photo: value });
				}
			})
	}

	sendNotif() {
		this.notif = 1;
		var token = localStorage.getItem('token');
		var id_user = localStorage.getItem('id_user');
		fetch (`http://localhost:8080/notif/visite`, {
			method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}),
				body: JSON.stringify(
				{
					id_user: id_user
				})
		})
	}

    render () {
		if (this.notif === 0) {
			this.sendNotif();
		}
		if (this.load === 0) {
			this.get_user()
		}

		return (
			<div>
				<h1 className="title">Profile of {this.state.login}</h1>
				{ this.state.block }
				<table className="photo">
					<tbody>
						<tr>
							<td>
								<p className="previous"  href="" name="left" onClick={ e => this.switchPhoto("left") }>&lt;</p>
							</td>
							<td>
								<section id="slideshow">
									<div className="container">
										<div id="slider">
											<figure>
												{ this.putIMG() }
											</figure>
										</div>
									</div>
								</section>
							</td>
							<td>
								<p className="next" href="" name="right" onClick={ e => this.switchPhoto("right") }>&gt;</p>
							</td>
						</tr>
					</tbody>
				</table>
				{ this.user_like() }
				{ this.log() }
				<div className="div-table">
					<div className="profil-info">
							<div className="typelove">
									Login :  
									<div className="repo">
										{ this.state.login }
									</div>
							</div>
							<div className="typelove">
									Last Name :
									<div className="repo">
										{ this.state.nom }
									</div>
							</div>
							<div className="typelove">
									First Name :
									<div className="repo">
										{ this.state.prenom }
									</div>
							</div>
							<div className="repo">
								{ this.putAge() }
							</div>
							<div className="typelove">
									Gender :
									<div className="repo">
										{ this.state.genre }
									</div>
							</div>
							<div className="typelove">
									Search :
									<div className="repo">
										{ this.state.interest }
									</div>
							</div>
							<div className="repo">
								{ this.putInteret() }
							</div>
							<div className="typelove">
									Score :
									<div className="repo">
										{ this.state.score }
									</div>
							</div>
							<div className="typelove">
									Bio :
									<div className="repo">
										{ this.state.bio }
									</div>
							</div>
							<div className="repo">
								{ this.putdistance() }
							</div>
					</div>
				</div>
				<div className="div-button">
					{ this.button_like() }
					<div className="trophaut">
						<input type="submit" className="mcdo" value="Block User" onClick={ e => this.block_user() } />
						<input type="submit" className="mcdo" value="Report User" onClick={ e => this.report_user() } />
					</div>
				</div>
			</div>
        )
    }
}
