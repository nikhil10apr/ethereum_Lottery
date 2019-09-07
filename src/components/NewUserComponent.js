import React, { Component, Fragment } from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';

import '../styles/userForm.scss';

export default class NewUserComponent extends Component {
	constructor() {
		super();

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e, history) {
		e.preventDefault();
		axios.post('/newUser', {
			name: e.currentTarget.getElementsByTagName('input').name.value,
			userId: e.currentTarget.getElementsByTagName('input').userId.value,
			phone: e.currentTarget.getElementsByTagName('input').phone.value,
			email: e.currentTarget.getElementsByTagName('input').email.value
		})
		.then(function(response) {
			let queryParam = '';
			for(var key in response.data.ops[0]) {
				document.cookie = key + '=' + response.data.ops[0][key];
				queryParam += key + '=' + response.data.ops[0][key] + '&';
			}
			console.log(response);
			history.push('/player?' + queryParam);
		});
	}

	render() {
		return <div className='form-section'>
			<h1>SIGN UP</h1>
			<Route render={({ history}) => (
				<form onSubmit={(e) => { this.onSubmit(e, history) }}>
					<p><label>Name:</label><input type='text' name='name' /></p>
					<p><label>User Id:</label><input type='text' name='userId' /></p>
					<p><label>Phone No:</label><input type='text' name='phone' /></p>
					<p><label>Email:</label><input type='text' name='email' /></p>
					<p><button className='btn btn-primary'>SUBMIT</button></p>
				</form>
			)} />
		</div>;
	}
}