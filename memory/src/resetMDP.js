import React from "react";

export default class ResetMDP extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: '',
		}
		this.load = 0;
		this.passwd = React.createRef();
		this.passwd2 = React.createRef();
	}

	reset = (event) => {
		event.preventDefault();
		var url = window.location.search;
		url = url.split('&');
		if (url[0] !== '') {
			var email = url[0].split('=')[1];
			var key = url[1].split('=')[1]
			if (email !== '' && key !== '') {
				fetch(`http://localhost:8080/auth/resetPasswd`, {
					method: 'POST',
					credentials: 'include',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(
						{
							passwd: this.passwd.current.value,
							passwd2: this.passwd2.current.value,
							email: email,
							key: key
						}
					)
				}).then((response) => { 
					return response.json();
				}).then((parsedData) => {
					if (parsedData.response === "error") {
						this.setState({ error: "une erreur s'est produit" });
					} else if (parsedData.response === "mdp empty") {
						this.setState({ error: "champs non complet" });
					} else if (parsedData.response === "mdp non identique") {
						this.setState({ error: "les mots de passe ne sont pas identiques" });
					} else {
						this.setState({ error: "le mot de passe a bien été changé" });
					}
				})
			}
		}	
	}

	render () {

		return (
			<div className="home">
				<form onSubmit={ this.reset }>
					<table>
						<tbody>
							<tr>
								<td align="right">
									<label htmlFor="passwd">Mot de passe :</label>
								</td>
								<td>
									<input type="password"
									name="passwd"
									id="passwd"
									placeholder="Mot de passe"
									ref={this.passwd}
									/>
								</td>
							</tr>
							<tr>
								<td align="right">
									<label htmlFor="passwd2">Confirmer mot de passe :</label>
								</td>
								<td>
									<input type="password"
									name="passwd2"
									id="passwd2"
									placeholder="Confirmer mot de passe"
									ref={this.passwd2}
									/>
								</td>
							</tr>
							<tr>
								<td></td>
								<td>
									<input type="submit" value="Reinitialiser mot de passe" />
								</td>
							</tr>
						</tbody>
					</table>


				</form>
				{ this.state.error }
			</div>
		)
	}
}
