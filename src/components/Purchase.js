import React, { Component, Fragment } from 'react';

import Web3Service from '../ethereum/ethereum-app-utility';
import './purchase.scss'

export default class HomeComponent extends Component {
	constructor(props) {
		super();

		this.web3Service = Web3Service;
		this.state = {
			ticketPrice: 0,
			numberOfTickets: 0,
			tickets: '',
			error: false,
			purchased: false,
			balance: props.balance
		};

		this.purchase = this.purchase.bind(this);
		this.handleCounterChange = this.handleCounterChange.bind(this);
	}

	getTicketPrice() {
		this.web3Service.contract.methods.getTicketPrice.call({ from: this.props.account, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
			this.setState({
				ticketPrice: this.web3Service.web3.utils.fromWei(resp)
			});
		});
	}

	getBalance() {
		this.web3Service.web3.eth.getBalance(this.props.account).then((result) => {
			const etherBalance = this.web3Service.web3.utils.fromWei(result);
			this.setState({
				balance: etherBalance
			});
		});
	}

	purchase() {
		try {
			this.props.buyTicket(this.state.numberOfTickets).then(resp => {
				this.setState({ purchased: true, error: false, tickets: resp.transactionHash, numberOfTickets: 0 });
				this.getBalance();
			}).catch(err => {
				console.log(err)
				this.setState({ purchased: true, error: true, tickets: '' })
			});
		} catch (err) {
			console.log(err)
			this.setState({ purchased: true, error: true, tickets: '' })
		}
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
		const total = this.state.ticketPrice * this.state.numberOfTickets;
		const showCalculation = false;
		return (
			<Fragment>
			<div className='purchase'>
				<h1 className='mb-5'>Purchase Lottery Tickets</h1>
				<p>Your current Wallet Balance is: {this.state.balance || '0'} ETH</p>
				<p>Add tickets to your Cart and Buy them as per your convenience</p>
				<div className='my-4 counter'>
					<button className='btn btn-success flex-1' onClick={() => this.handleCounterChange('-')} disabled={this.state.numberOfTickets === 0}>-</button>
					<p className='px-2 my-2 d-flex justify-content-center'>{this.state.numberOfTickets}</p>
					<button className='btn btn-success flex-1' onClick={() => this.handleCounterChange('+')}>+</button>
				</div>
				<button className='btn btn-info' disabled={this.state.numberOfTickets === 0} onClick={this.purchase}>Buy Now</button>
			</div>
			{
				showCalculation ? 
				<div className='calculationPanel'>
					<ul>
						<li>Ticket Price: {this.state.ticketPrice}</li>
						<li>Ticket Count: {this.state.numberOfTickets}</li>
						<li>Totat Spend: {total}</li>
					</ul>
				</div> : null
			}
			</Fragment>
		)
	}

	renderPurchase() {
		return (
			<div style={{display:'flex'}}>
				{
					!this.props.lotteryOpen
						? <h2>Lottery is not open yet</h2>
						: !this.props.isRegistered
							? <h2>You are not registered. Please register for the lottery first.</h2>
							: this.renderForm()

				}
			</div>
		);
	}

	renderConfirmation() {
		return (
			<div>
				{
					this.state.error
						? <h2>There was an error completing your request</h2>
						: <h2>Tickets bought successfully</h2>
				}
				<button className='btn btn-info' onClick={(e) => {this.setState({purchased: false})}}>Buy Again</button>
			</div>
		);
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