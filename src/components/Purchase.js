import React, { Component, Fragment } from 'react';

import './purchase.scss'

export default class HomeComponent extends Component {
	constructor() {
		super();

		this.state = {
			numberOfTickets: 0,
			tickets: '',
			error: false,
			purchased: false
		}

		this.purchase = this.purchase.bind(this)
		this.renderForm = this.renderForm.bind(this)
		this.renderPurchase = this.renderPurchase.bind(this)
		this.renderConfirmation = this.renderConfirmation.bind(this)
		this.handleCounterChange = this.handleCounterChange.bind(this)
	}

	async purchase() {
		try {
			const purchaseResponse = await this.props.buyTicket(this.state.numberOfTickets);
			this.setState({purchased: true, error: false, tickets: purchaseResponse.transactionHash})
		} catch(err) {
			console.log(error)
			this.setState({purchased: true, error: true, tickets: ''})
		}
		// this.props.buyTicket(this.state.numberOfTickets).then(function(resp, err) {
		// 	if(err) {
		// 		this.setState({purchased: true, error: true, tickets: ''})
		// 	} else {
		// 		this.setState({purchased: true, error: false, tickets: resp})
		// 	}
		// })
	}

	handleCounterChange(incrementType) {
		const currentTicketCount = this.state.numberOfTickets;
		if (incrementType === '+') {
			this.setState({ numberOfTickets: currentTicketCount + 1 })
		} else if (incrementType === '-') {
			this.setState({ numberOfTickets: currentTicketCount - 1 })
		}
	}

	renderForm() {
		return (
			<div className='purchase'>

				<h1 className='mb-5'>Purchase Lottery Tickets</h1>

				<p>Your current Wallet Balance is: {this.props.balance || '0'} ETH</p>
				<p>Add tickets to your Cart and Buy them as per your convenience</p>
				<div className='my-4 counter'>
					<button className='btn btn-success flex-1' onClick={() => this.handleCounterChange('+')}>+</button>
					<p className='px-2 my-2 d-flex justify-content-center'>{this.state.numberOfTickets}</p>
					<button className='btn btn-success flex-1' onClick={() => this.handleCounterChange('-')} disabled={this.state.numberOfTickets === 0}>-</button>
				</div>
				<button className='btn btn-info' disabled={this.state.numberOfTickets === 0} onClick={this.purchase}>Buy Now</button>
			</div>
		)
	}

	renderPurchase() {
		return (
			<div>
				{
					!this.props.lotteryOpen
						? <h2>Lottery is not open yet</h2>
						: !this.props.isRegistered
							? <h2>You are not registered. Please register for the lottery first.</h2>
							: this.renderForm()

				}
			</div>
		)
	}

	renderConfirmation() {
		return (
			<div>
				{
					this.state.error
						? <h2>There was an error completing your request</h2>
						: <h2>Tickets bought successfully</h2>
				}
			</div>
		)
	}

	render() {
		return (
			<div>
				{
					this.state.purchased
						? this.renderConfirmation()
						: this.renderPurchase()
				}
			</div>
		);
	}
}