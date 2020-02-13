import React from "react";

export default class Confirmation extends React.Component {
	
	constructor(props) {
		super(props);
		this.confirm = this.confirm.bind(this);
		this.state = {
			error: '',
		}
		this.load = 0;
	}

	confirm () {
		this.load = 1;
		var url = window.location.search;
		url = url.split('&');
		if (url[0] !== '') {
			var login = url[0].split('=')[1];
			var key = url[1].split('=')[1]
			fetch(`http://localhost:8080/auth/confirmation`, {
				method: 'POST',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(
					{
						login: login,
						key: key,
					}
				)
			}).then((response) => {
				response.text().then((res) => {
					if (res === "error") {
						this.setState({
							error: "An error has occurred"
						})
					} else if (res === "email already confirm") {
						this.setState({
							error: "Email already confirm"
						})
					} else {
						this.setState({
							error: "Email confirm"
						})
					}
				})
			})
		}
	}

	render() {
		if (this.load === 0) {
			this.confirm()
		}

		return (
			<div>
				{ this.state.error }
			</div>
		)
	}
}
