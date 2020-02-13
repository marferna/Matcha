import React, { Component } from 'react';
import './css/header.css';


export default class Header extends Component {
    constructor(props) {
		super(props);
		this.state={
			notif: 0,
		}
		this.connection = this.connection.bind(this);
		this.interval = '';
	}

	componentDidMount() {
		this.interval = setInterval(() => this.get_notif(), 1000);
		const token = localStorage.getItem('token');
		window.addEventListener("unload", (e) => {
			fetch(`http://localhost:8080/auth/logout`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
				},
			})
		})
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	  } 

	get_notif() {
		const token = localStorage.getItem('token');
		fetch(`http://localhost:8080/notif/notif`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
				},
			}).then((response) => {
				return response.json();
			}).then((parsedData) => {
				if (parsedData.notif >= 1) {
					this.setState({ notif: 1 });
				} else {
					this.setState({ notif: 0 });
				}
			})
	}
	
	put_notif() {
		if (this.state.notif === 1) {
			return (
				<div className="putnotif"></div>
			)
		}
	}

	connection() {
        var token = localStorage.getItem('token');
		if (token !== null) 
		{
            return (
                <div className="wrap-nav-bar">
					<div className="container">
						<a href="/notif" className="m-link">Notif</a>
						{ this.put_notif() }
					</div>
					<div className="container">
						<a href="/match" className="m-link">Match</a>
					</div>
					<div className="container">
						<a href="/profil" className="m-link">Account</a>
					</div>
					<div className="container">
						<a href="/logout" className="m-link">Sign Out</a>
					</div>
                </div>
            )
        } else {
            return(
                <div>
					<a href="/?connection" className="m-link">Sign In</a>
					<a href="/?inscription" className="m-link">Register</a>
                </div>
            )
        }
	}

    render() {
        return (
            <div> 
                <nav className="menu">
                    <div className="inner">
                        <div className="m-left">
                            <a href="/" className="logo">Match Un Marin</a>
                        </div>
                        <div className="m-right">
                            { this.connection() }
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}
