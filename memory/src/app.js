import React from 'react';
import './css/App.css';

class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.load = 0;
		this.load2 = 0;
		this.state = {
			user1: '',
			user2: '',
			login1: '',
			login2: '',
			avatar1: '',
			avatar2: '',
			message: [],
			user_from: '',
			date: '',
			error: '',
		}
		this.messages = React.createRef();
		this.user2 = '';
		this.interval = '';
	}

	componentDidMount() {
		this.interval = setInterval(() => this.handleMessage(), 1000);
	  }

	componentWillUnmount() {
		clearInterval(this.interval);
	  }

	handleName() {
		this.load = 1;
		this.user2 = localStorage.getItem('id_user');
		var token = localStorage.getItem("token")
		fetch(`http://localhost:8080/match/chat`, {
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
		body: JSON.stringify({
			user2: this.user2,
		})
		})
		.then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.response === "no connect") {
				localStorage.removeItem('token');
				document.location.href='/';
			}
			this.setState({
				user1: parsedData.res.user1,
				user2: parsedData.res.user2,
				login1: parsedData.res.login1,
				login2: parsedData.res.login2,
				avatar1: parsedData.res.avatar1,
				avatar2: parsedData.res.avatar2,
			})
		})
	}
	handleMessage() {
		this.load2 = 1;
		this.user2 = localStorage.getItem('id_user');
		var token = localStorage.getItem("token")
		fetch(`http://localhost:8080/match/messages`, {
			method: 'POST',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}),
		body: JSON.stringify({
			user2: this.user2,
		})
		}).then((response) => {
			return response.json();
		}).then((parsedData) => {
			if (parsedData.response === "no connect") {
				localStorage.removeItem('token');
				document.location.href='/';
			}
			this.setState({
				message: parsedData.message,
				user_from: parsedData.message.user_from,
				date: parsedData.message.date,
			})
		})
	}
	sendMessage(e) {
		e.preventDefault();
		this.setState({
			error: ''
		})
		if (this.messages.current.value !== '') {
			this.user2 = localStorage.getItem('id_user');
			var token = localStorage.getItem("token")
			fetch(`http://localhost:8080/match/send_messages`, {
				method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}),
				body: JSON.stringify({
					user2: this.user2,
					message: this.messages.current.value,
					user_from: this.state.user_from,
				})
			}).then((parsedData) => {
				if (parsedData.response === "no connect") {
					localStorage.removeItem('token');
					document.location.href='/';
				}
			})
			this.messages.current.value = '';
			}
	}
	checkAvatar = elem => {
		var photo;
		if (elem === this.state.user1)
			photo = this.state.avatar1
		else if (elem === this.state.user2)
			photo = this.state.avatar2
		return (photo)
	}

	reload() {
			this.load2 = 1;
			this.user2 = localStorage.getItem('id_user');
			var token = localStorage.getItem("token")
			fetch(`http://localhost:8080/match/messages`, {
				method: 'POST',
				credentials: 'include',
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': token
				}),
			body: JSON.stringify({
				user2: this.user2,
			})
			}).then((response) => {
				return response.json();
			}).then((parsedData) => {
				if (parsedData.response === "no connect") {
					localStorage.removeItem('token');
					document.location.href='/';
				}
				this.setState({
					message: parsedData.message,
					user_from: parsedData.message.user_from,
					date: parsedData.message.date,
				})
			})
	}

	render() {
		if (this.load === 0)
			this.handleName();
		if (this.load2 === 0)
			this.handleMessage();
		return (
			<div className="">
				<div className="">
					<h1 className="title">Chat Room</h1>
				</div>
				<div className="coin">
					{/* { this.state.login1 }
					<img className="avataraa" alt="" src={this.state.avatar1} /> */}
					<div className="user2">
						<p className="user">Your chat with { this.state.login2 }</p>
						<img className="avataraa" alt="" src={this.state.avatar2} />
					</div>
					<div className="message-send">
					{ this.state.message.map((elem, index) => {
						return (
							<div key={index}>
								<img className="avatara2" alt="" src={this.checkAvatar(elem.user_from)} />
								<p className="textsend">{elem.message} </p> <p className="date">{elem.date}</p>
							</div>
						)
						})
					}
					</div>
					<div className="">
						<form onSubmit={ e => this.sendMessage(e)}>
						<input type="text"
								name="message"
								id="message"
								placeholder="New message..."
								className="envoiemerde"
								ref={ this.messages }
								/>
							<button className="putsend">Send</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Chat;
