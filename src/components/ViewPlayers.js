import React, { Component, Fragment } from 'react';

import Web3Service from '../ethereum/ethereum-app-utility';

import './viewPlayers.scss'

export default class HomeComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
		this.state = {
			players: []
		}
		this.fetchPlayers = this.fetchPlayers.bind(this);
		this.showPlayers = this.showPlayers.bind(this);

		this.bindEvents();
	}

	bindEvents() {
		this.web3Service.contract.events.playerRegistered()
		.on('data', (event) => {
		    console.log(event);
		    this.fetchPlayers();
		})
		.on('changed', function(event){
		    // remove event from local database
		})
		.on('error', console.error);
	}

	showPlayers() {
		const players = this.state.players;
		return (
			<div className='players'>
				<h2 className='mb-5'>You have {players.length} Registered Player(s)</h2>
				<table className='mt-4'>
					<thead>
						<tr>
							<th>Name</th>
							<th>Phone</th>
							<th>Wallet Address</th>
						</tr>
					</thead>
					<tbody>
						{players.map(function (player) {
							return (
								<tr>
									<td>{player.playerName}</td>
									<td>{player.phoneNumber}</td>
									<td>{player.playerAddress}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		)
	}

	async fetchPlayers() {
		try {
			const players = await this.props.getAllPlayers();
			this.setState({players, error: false})
		} catch(error) {
			console.log(error)
			this.setState({error: true})
		}
	}

	render() {
		this.fetchPlayers()
		return (
			<div>
				{
					this.state.error
						? <h2>There was an error fetching players</h2>
						: this.state.players.length === 0
							? <h2>No players registered yet</h2>
							: this.showPlayers()
				}
			</div>
		);
	}
}