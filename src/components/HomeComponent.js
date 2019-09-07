import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import '../styles/home.scss';

export default class HomeComponent extends Component {
	constructor() {
		super();
	}
	render() {
		return <div className='main'>
			<Link to='/signUp' className='btn btn-secondary'>NEW USER</Link>
			<Link to='/login' className='btn btn-success'>OLD USER</Link>
		</div>;
	}
}