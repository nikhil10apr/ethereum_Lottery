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

	renderContent() {
		if(!this.props.lotteryOpen && this.props.winner) {
			return <h2>Winning Ticket Is: {this.props.winner}</h2>;
		} else if(!this.props.lotteryOpen) {
			return <h2>Lottery is not open yet</h2>;
		} else if(!this.props.isRegistered) {
			return this.renderRegister()
		} else {
			return <h2>You are already registered for the lottery</h2>;
		}
	}

	render() {
		return (
			<div>
				{
					this.renderContent()
				}
			</div>
		);
	}
}