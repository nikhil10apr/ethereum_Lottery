import React, { Component, Fragment } from 'react';

export default class HomeComponent extends Component {
	renderRegister() {
		return (
			<div>
				<h2 className='mb-5 pb-3'>Register For Lottery</h2>
				<p>The Lottery is now open...</p>
				<button className='btn btn-success' onClick={this.props.register}>Register Now</button> 
			</div>
		)
	}

	render() {
		return (
			<div>
				{
					!this.props.lotteryOpen 
						? <h2>Lottery is not open yet</h2> 
						: !this.props.isRegistered 
							? this.renderRegister()
							: <h2>You are already registered for the lottery</h2>
				}
			</div>
		);
	}
}