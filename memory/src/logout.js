import React, {} from 'react';

function remove() {
	var token = localStorage.getItem('token')
		fetch(`http://localhost:8080/auth/logout`, {
			method: 'GET',
			credentials: 'include',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': token
			}), 
		});
	localStorage.removeItem('token');
	document.location.href = '/';
}

export default class Logout extends React.Component {
	render() {
		return (
			<div>
			{ remove() }
			</div>
		)
	}
}