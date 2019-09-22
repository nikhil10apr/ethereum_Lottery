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
	}

	showTickets() {
		const { tickets } = this.state;
		return (
			<div className='tickets'>
				<h2 className='mb-5'>You have purchased {tickets.length} Ticket(s)</h2>
				<table className='mt-4'>
					<th className='pb-4 d-flex justify-content-center'><td>Ticket ID</td></th>
					{tickets.map(function (ticket) {
						return <tr className='d-flex justify-content-center'><td>{ticket.lotteryId}</td></tr>
					})}
				</table>
			</div>
		)
	}

	fetchTickets(account) {
		try {
			this.web3Service.contract.methods.fetchMyTickets().call({ from: account, gasPrice: '10000000000000', gas: 1000000 }).then((err, resp) => {
				if (err) return;
				this.setState({tickets, error: false})
			});
		} catch(error) {
			console.log(error)
			this.setState({error: true})
		}
	}

	render() {
		return (
			<div>
				{
					this.state.error
						? <h2>There was an error fetching your tickets</h2>
						: this.state.tickets.length === 0
							? <h2>No tickets purchase yet</h2>
							: this.showTickets()
				}
			</div>
		);
	}
}