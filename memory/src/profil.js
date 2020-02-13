import React from 'react';
import './css/profil.css'

export default class Profil extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			load: 0,
			login: "",
			email: "",
			nom: "",
			prenom: "",
			genre: "",
			interest: "",
			bio: "",
			genre_homme: false,
			genre_femme: false,
			genre_autre: false,
			interest_homme: false,
			interest_femme: false,
			interest_autre: false,
			error: '',
			files: '',
			interet_1: false,
			interet_2: false,
			interet_3: false,
			interet_4: false,
			interet_5: false,
			value_photo: 1,
			age: '',
			modif_profil: 0,
			modif_passwd: 0,
			add_img: 0,
			add_interet: 0,
			localisation: 0,

		};
		this.ageValue = ''
		this.age = React.createRef();
		this.login = React.createRef();
		this.nom = React.createRef();
		this.prenom = React.createRef();
		this.email = React.createRef();
		this.old_passwd = React.createRef();
		this.new_passwd = React.createRef();
		this.new_passwd2 = React.createRef();
		this.interet = React.createRef();
		this.localisation = React.createRef();
		this.handleInputChange = this.handleInputChange.bind(this);
		this.inputSubmit = this.inputSubmit.bind(this);
		this.handleValue = this.handleValue.bind(this);
		this.submitPasswd = this.submitPasswd.bind(this);
		this.uploadImage = this.uploadImage.bind(this);
		this.submitIMG = this.submitIMG.bind(this);
		this.deleteIMG = this.deleteIMG.bind(this);
		this.getUser = this.getUser.bind(this);
		this.handleInteret = this.handleInteret.bind(this);
		this.putIMG = this.putIMG.bind(this);
		this.switchPhoto = this.switchPhoto.bind(this);
		this.valueLeft = this.valueLeft.bind(this);
		this.valueRight = this.valueRight.bind(this);
		this.putAge = this.putAge.bind(this);
	}

	handleValue = event => {
		this.setState({
			bio: event.target.value
		});
	}

	handleInputChange = event => {
		const target = event.target;
		const name = target.name;
	
		if (name === 'genre_homme') {
			this.setState({
				genre_homme: true,
				genre_femme: false,
				genre_autre: false
			});
		}
		else if (name === 'genre_femme') {
			this.setState({
				genre_homme: false,
				genre_femme: true,
				genre_autre: false
			});
		}
		else if (name === 'genre_autre') {
			this.setState({
				genre_homme: false,
				genre_femme: false,
				genre_autre: true
			});
		}

		if (name === 'interest_homme') {
			this.setState({
				interest_homme: true,
				interest_femme: false,
				interest_autre: false
			});
		}
		else if (name === 'interest_femme') {
			this.setState({
				interest_homme: false,
				interest_femme: true,
				interest_autre: false
			});
		}
		else if (name === 'interest_autre') {
			this.setState({
				interest_homme: false,
				interest_femme: false,
				interest_autre: true
			});
		}
	}

	submitPasswd = event => {
		event.preventDefault();
		const token = localStorage.getItem('token');
		fetch(`http://localhost:8080/profil/modifPasswd`, {
				method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}), 
				body: JSON.stringify(
				{
					old: this.old_passwd.current.value,
					new: this.new_passwd.current.value,
					new2: this.new_passwd2.current.value
				}),
			}).then((response) => {
				this.setState({
					firstLoad: 0
				})
				response.text().then((res) => {
					if (res === "no connect")
						document.location.href='/';
					else if (res !== '') {
						if (res === "mdp different") {
							this.setState({ error: "Passwords must be the same" });
						} else if (res === "mdp easy") {
							this.setState({ error: "Password too simple" }); //pas encore gere par le serveur
						} else if (res === "wrong passwd") {
							this.setState({ error: "Old password incorrect" });
						} else {
							this.setState({ error: "Password changed" });
						}
					}
					else
						window.location.reload();
				});
			});
			this.setState({
				load: 0
			})
	}

	inputSubmit = event => {
		event.preventDefault();
		const token = localStorage.getItem('token');
		var genre = '';
		var interest = '';
		if (this.state.genre_homme === true) {
			genre = "homme";
		} else if (this.state.genre_femme === true) {
			genre = "femme";
		} else if (this.state.genre_autre === true) {
			genre = "autre";
		} if (this.state.interest_homme === true) {
			interest = "homme";
		} else if (this.state.interest_femme === true) {
			interest = "femme";
		} else if (this.state.interest_autre === true) {
		 	interest = "autre";
		}
		this.setState({
			error: ''
		});
		fetch(`http://localhost:8080/profil/modif`, {
				method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}), 
				body: JSON.stringify(
				{
					login: this.login.current.value,
					nom: this.nom.current.value,
					prenom: this.prenom.current.value,
					email: this.email.current.value,
					genre: genre,
					interest: interest,
					age: this.age.current.value,
					bio: this.state.bio,
					interet: {interet1: this.state.interet_1, interet2: this.state.interet_2, interet3: this.state.interet_3, interet4: this.state.interet_4, interet5: this.state.interet_5}
				}),
			}).then((response) => {
				response.text().then((res) => {
					if (res === "no connect")
						document.location.href='/';
					else if (res !== '') {
						if (res === "login exist") {
							this.setState({error: "Login already used"});
						}
						else if (res === "email exist") {
							this.setState({error: "Email already used"});
						}
						
						this.setState({
							error: res,
						});
					}
				});
			});
			this.setState({
				load: 0
			})
	}

	check_img(img) {
		if (img ==="data:") {
			return ("nope");
		} else {
			return ("oui");
		}
	}

	uploadImage = event => {
		var file = event.target.files[0];
		if (file !== undefined) {
			var ext = file.name.split('.').pop()
			if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
				if (file.size < 50000) {
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = event => {
						if ( this.check_img(event.target.result) === "oui") {
							this.setState({
									files: event.target.result,
									error: ''
							})
						} else {
							this.setState({
								error: 'File undefined',
								files: ''
							})
						}
					}
				} else {
					this.setState({
						error: 'File is too big',
						files: ''
					})
				}
			} else {
				this.setState({
					error: 'The extension file need to be on jpg, jpeg or png',
					files: ''
				})
			}
		} else {
			this.setState ({
				files: ''
			})
		}
	}
	
	submitIMG = event => {
		event.preventDefault();
		var token = localStorage.getItem('token');
		fetch(`http://localhost:8080/profil/img`, {
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}), 
			body: JSON.stringify({
				files: this.state.files
			})
		})
		this.setState({
			load: 0,
			files: ''
		})
	}

	deleteIMG = event => {
		const token = localStorage.getItem('token');
		fetch('http://localhost:8080/profil/deleteIMG',{
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
			body: JSON.stringify({
				photo: event.target.name
			})
		}).then((response) => {
			response.text().then((res) => {
				this.setState({
					error: res
				})
			})
		})
		var value = this.valueRight(this.state.value_photo);
		this.setState({
			load: 0,
			value_photo: value
		})
		
	}

	handleInteret = event => {
		const name = event.target.name;
		if (name === 'interet1') {
			this.state.interet_1 === true ? this.setState({ interet_1: false}) :  this.setState({ interet_1: true});
		} if (name === 'interet2') {
			this.state.interet_2 === true ? this.setState({ interet_2: false}) :  this.setState({ interet_2: true});
		} if (name === 'interet3') {
			this.state.interet_3 === true ? this.setState({ interet_3: false}) :  this.setState({ interet_3: true});
		} if (name === 'interet4') {
			this.state.interet_4 === true ? this.setState({ interet_4: false}) :  this.setState({ interet_4: true});
		} if (name === 'interet5') {
			this.state.interet_5 === true ? this.setState({ interet_5: false}) :  this.setState({ interet_5: true});
		}

	}
	
	valueRight(value) {
		if (value === 1 && this.state.photo_1 === undefined){
			
				value = value + 1
		} if (value === 2&& this.state.photo_2=== undefined){
			
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
				<img alt="" width="640" height="310" src={this.state.photo_1} />
			)
		}	if (this.state.value_photo === 2) {
			return (
				<img alt="" width="640" height="310" src={this.state.photo_2} />
			)
		}	if (this.state.value_photo === 3) {
			return (
				<img alt="" width="640" height="310" src={this.state.photo_3} />
			)
		}	if (this.state.value_photo === 4) {
			return (
				<img alt="" width="640" height="310" src={this.state.photo_4} />
			)
		}	if (this.state.value_photo === 5) {
			return (
				<img alt="" width="640" height="310" src={this.state.photo_5} />
			)
		}
	}

	getUser() {
			const token = localStorage.getItem('token');
			fetch(`http://localhost:8080/profil/user`, {
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
							document.location.href='/';
						}
						this.setState({
							login: parsedData.user.login,
							email: parsedData.user.email,
							nom: parsedData.user.nom,
							prenom: parsedData.user.prenom,
							genre: parsedData.user.genre,
							interest: parsedData.user.interest,
							age: parsedData.user.age,
						});
						if (this.state.load === 0) {
							this.setState({
								load: 1,
								bio: parsedData.user.bio
							});
						if (this.state.genre === 'homme') {
							this.setState({
								genre_homme: true,
								genre_femme: false,
								genre_autre: false
							});
						};
						if (this.state.genre === 'femme') {
							this.setState({
								genre_femme: true,
								genre_homme: false,
								genre_autre: false
							});
						}
						if (this.state.genre === 'autre') {
							this.setState({
								genre_autre: true,
								genre_homme: false,
								genre_femme: false
							});
						}
						if (this.state.interest === 'homme') {
							this.setState({
								interest_homme: true,
								interest_femme: false,
								interest_autre: false,
							});
						};
						if (this.state.interest === 'femme') {
							this.setState({
								interest_femme: true,
								interest_homme: false,
								interest_autre: false,
							});
						}
						if (this.state.interest === 'autre') {
							this.setState({
								interest_autre: true,
								interest_homme: false,
								interest_femme: false,
							});
						}
						this.bio = this.state.bio;
					}
					var value = this.valueRight(this.state.value_photo);
					this.setState({
						value_photo: value,
						photo_1: parsedData.photos.photo_1,
						photo_2: parsedData.photos.photo_2,
						photo_3: parsedData.photos.photo_3,
						photo_4: parsedData.photos.photo_4,
						photo_5: parsedData.photos.photo_5,
						interet: parsedData.interet, 
					})
					this.ageValue = parsedData.user.age;
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

	button_profil = event => {
		this.setState({
			modif_profil: 1,
			modif_passwd: 0,
			add_img: 0,
			add_interet: 0,
		})
	}

	button_passwd = event => {
		this.setState({
			modif_profil: 0,
			modif_passwd: 1,
			add_img: 0,
			add_interet: 0,
		})
	}

	button_photo = event => {
		this.setState({
			modif_profil: 0,
			modif_passwd: 0,
			add_img: 1,
			add_interet: 0,
		})
	}

	button_interet = event => {
		this.setState({
			modif_profil: 0,
			modif_passwd: 0,
			add_img: 0,
			add_interet: 1,
		})
	}

	modif_passwd() {
		if (this.state.modif_passwd !== 0) {
			return (
				<div className="div-modif">
					<form className="retapre" onSubmit={this.submitPasswd}>
						<div className="profil-table">
							<div>
								Old Password : 
								<input 
									type="password"
									name="old_passwd"
									placeholder=""
									ref={this.old_passwd} />
							</div>
							<div>
								New Password : 
								<input
									type="password"
									name="new_passwd"
									placeholder=""
									ref={this.new_passwd} />
							</div>
							<div>
								Confirm New Password :
								<input 
									type="password"
									name="new_passwd2"
									placeholder=""
									ref={this.new_passwd2} />
							</div>
						</div>
					<input type="submit" className="butpass" name="submit_passwd" value="Change Password" />
					</form>
				</div>
			)
		}
	}

	modif_profil() {
		if (this.state.modif_profil !== 0) {
			return (
				<div className="div-modif">
					<form className="retapre" onSubmit={this.inputSubmit}>
						<div className="profil-table" >
							<div>
							New Login :
							<input type="text"
								name="login"
								id="login"
								placeholder="" 
								ref={this.login}
								/>
							</div>
							<div>
								New Email :
								<input type="email"
								name="email"
								id="email"
								placeholder=""
								ref={this.email}
								/>
							</div>
							<div>
								New Last Name :
								<input type="text"
								name="nom"
								id="nom"
								placeholder=""
								ref={this.nom}
								/>
							</div>
							<div>
								New First Name :
								<input type="text"
								name="prenom"
								id="prenom"
								placeholder=""
								ref={this.prenom}
								/>
							</div>
							<div>
								Gender :
								
									<input 
										type="checkbox"
										id="genre_homme"
										name="genre_homme" 
										checked={this.state.genre_homme}
										onChange={this.handleInputChange} />
									<label htmlFor="genre_homme" >Man</label>
									<input 
										type="checkbox"
										id="genre_femme"
										name="genre_femme" 
										checked={this.state.genre_femme}
										onChange={this.handleInputChange} />
									<label htmlFor="genre_femme" >Woman</label>
									<input 
										type="checkbox"
										id="genre_autre"
										name="genre_autre" 
										checked={this.state.genre_autre}
										onChange={this.handleInputChange} />
									<label htmlFor="genre_autre" >Other</label>
								</div>
								<div>
									Interest :
									<input 
										type="checkbox"
										id="interest_homme"
										name="interest_homme" 
										checked={this.state.interest_homme}
										onChange={this.handleInputChange} />
									<label htmlFor="interest_homme" >Men</label>
									<input 
										type="checkbox"
										id="interest_femme"
										name="interest_femme" 
										checked={this.state.interest_femme}
										onChange={this.handleInputChange} />
									<label htmlFor="interest_femme" >Women</label>
									<input 
										type="checkbox"
										id="interest_autre"
										name="interest_autre" 
										checked={this.state.interest_autre}
										onChange={this.handleInputChange} />
									<label htmlFor="interest_autre" >Others</label>
								</div>
								<div>
										<label htmlFor="age">Age :</label>
										<input type="number" name="age" id="age" defaultValue={this.ageValue}  ref={this.age} min="18" max="150"/>
								</div>
								<div>
										Bio:
										<textarea name="bio" rows="4" cols="40"  value={this.state.bio} onChange={this.handleValue}>
										</textarea>
								</div>
								<input type="submit" className="butaccount" value="Change Account" />
							</div>
						</form>
				</div>
			)
		}
	}

	add_img() {
		if (this.state.add_img !== 0) {
			return (
				<div className="div-modif">
					<form className="retapre" onSubmit={this.submitIMG} encType="multipart/form-data">
						<input className="buttt" type="file" id="image" name="image" onChange={ this.uploadImage }/>
						<input className="butsend" type="submit" value="Send Picture" />
					</form>
						<img className="preview-img" alt="" src={this.state.files} />
				</div>
			)
		}
	}

	submitInteret = event => {
		event.preventDefault();
		if (this.interet.current.value !== '') {
			var value = "#" + this.interet.current.value;
			var token = localStorage.getItem('token');
			fetch(`http://localhost:8080/profil/interet`, {
				method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}), 
				body: JSON.stringify({
					interet: value
				})
			}).then((response) => {
				return response.json();
			}).then((parsedData) => {
				if (parsedData.response === "already interet") {
					this.setState({
						error: "Vous avez déjà cet interet"
					});
				} else if (parsedData.response === "lenght max") {
					this.setState({
						error: "Vous avez atteint la limite d'interet"
					});
				} else {
					this.setState({
						error: "Interet à été ajouté",
						load: 0,
					});
				}
			})
		}
	}

	add_interet() {
		if (this.state.add_interet !== 0) {
			return (
				<div className="div-modif">
					<form className="retapre" onSubmit={ this.submitInteret }>
						<div className="profil-table">
							<div>
								<input type="text" placeholder="#Cool" ref={ this.interet } />
							</div>
						</div>
						<input className="butcool" type="submit" value="Add Interest" />
					</form>
				</div>
			)
		}
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

	render () {
			if (this.state.load !== 1)
				this.getUser();
		return (
			<div>
				<h1 className="title">Profile of {this.state.login}</h1>
				<table className="photo">
				<tbody>
						<tr>
							<td>
								<div className="ov">
									<p className="previous" href="" name="left" onClick={ e => this.switchPhoto("left") }>&lt;</p>
								</div>
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
				<div className="div-supp-img">
					<button className="supp-img" onClick={ this.deleteIMG }  name={ this.state.value_photo }>Delete Image</button>
				</div>
				<div>
						{this.state.error}
				</div>
				<div>
				<input type="submit" value="Change Account" className="profil-button" onClick={ e => this.button_profil() } />
				<input type="submit" value="Change Password" className="profil-button" onClick={ e => this.button_passwd() } />
				<input type="submit" value="Add Picture" className="profil-button" onClick={ e => this.button_photo() } />
				<input type="submit" value="Add Interest" className="profil-button" onClick={ e => this.button_interet() } />
				</div>
				<div>
				<div className="div-table">
					<div className="profil-info">
							<div className="typelove">
									Login :
									<div className="repo">
										{ this.state.login }
									</div>
							</div>
							<div className="typelove">
									Email : 
									<div className="repo">
										{ this.state.email }
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
							{ this.putAge() }
							<div className="typelove">
									Gender :
									<div className="repo">
										{ this.state.genre }
									</div>
							</div>
							<div className="typelove">
									Interest :
									<div className="repo">
										{ this.state.interest }
									</div>
							</div>
							{ this.putInteret() }
							<div className="typelove">
									Bio :
									<div className="repo">
										{ this.state.bio }
									</div>
							</div>
					</div>
				</div>
					{ this.modif_profil() }
					{ this.modif_passwd() }
					{ this.add_img() }
					{ this.add_interet() }
				</div>
			</div>
		);
	};
};
