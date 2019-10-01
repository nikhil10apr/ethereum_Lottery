import React, { Component, Fragment } from 'react';

import Web3Service from '../ethereum/ethereum-app-utility';

import './viewTickets.scss'

export default class ViewTicketComponent extends Component {
	constructor(props) {
		super();

		this.web3Service = Web3Service;
		this.state = {
			tickets: []
		};
		this.fetchTickets(props.account);
		this.bindEvents();
	}

	bindEvents() {
		this.web3Service.contract.events.ticketSold()
		.on('data', (event) => {
		    console.log(event);
		    this.fetchTickets(this.props.account);
		});
	}

	showTickets() {
		const { tickets } = this.state;
		return (
			<div className='tickets'>
				{this.props.account ? 
					<h2 className='mb-5'>You have purchased {tickets.length} Ticket(s)</h2> : 
					<h2 className='mb-5'>You have sold {tickets.length} Ticket(s)</h2>
				}
				<table className='mt-4'>
					<thead>
						{
							this.props.account ? <tr><th>Ticket ID</th></tr> :
							<tr><th>Ticket ID</th><th>Name</th><th>Wallet Address</th></tr>
						}
					</thead>
					<tbody>
						{tickets.map(ticket => {
							return this.props.account ? <tr><td>{ticket.lotteryId}</td></tr> :
							<tr><td>{ticket.lotteryId}</td><td>{ticket.playerName}</td><td>{ticket.playerAddress}</td></tr>
						})}
					</tbody>
				</table>
			</div>
		)
	}

	fetchTickets(account) {
		if(account) {
			this.web3Service.contract.methods.fetchMyTickets().call({ from: account, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				if (err) {
					console.log(error);
					this.setState({error: true});
					return;
				}
				this.setState({tickets: resp, error: false})
			});
		} else {
			this.web3Service.contract.methods.getLotteryTickets().call({ from: account, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				if (err) {
					console.log(error);
					this.setState({error: true});
					return;
				}
				this.web3Service.contract.methods.getPlayers().call({ from: account, gasPrice: '10000000000000', gas: 1000000 }, (err, data) => {
					const tickets = resp.map(function(ticket) {
						const playerData = data.filter(function(player) {
							return player.playerAddress === ticket.ticketOwner;
						});
						return {lotteryId: ticket.lotteryId, ...playerData[0]};
					});
					this.setState({tickets: tickets, error: false})
				});
				
			});
		}
	}

	render() {
		return (
			<div>
				{
					this.state.error
						? <h2>There was an error fetching your tickets</h2>
						: this.state.tickets.length === 0
							? <h2>No tickets</h2>
							: this.showTickets()
				}
			</div>
		);
	}
}