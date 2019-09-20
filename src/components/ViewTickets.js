import React, { Component, Fragment } from 'react';

import './viewTickets.scss'

export default class HomeComponent extends Component {
	constructor() {
		super();

		this.state = {
			tickets: []
		}
		this.fetchTickets = this.fetchTickets.bind(this);
		this.showTickets = this.showTickets.bind(this);
	}

	showTickets() {
		const tickets = this.state.tickets;
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

	async fetchTickets() {
		try {
			const tickets = await this.props.getAllTickets();
			this.setState({tickets, error: false})
		} catch(error) {
			console.log(error)
			this.setState({error: true})
		}
	}

	render() {
		this.fetchTickets()
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