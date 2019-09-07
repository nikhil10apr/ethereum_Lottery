import React, { Component } from 'react';
import axios from 'axios';

import Web3Service from '../ethereum/ethereum-app-utility';
import lotteryStates from '../constants/lotteryStates';//0=NotStared, 1=Started, 2=Finished

import '../styles/admin.scss';

export default class AdminComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
		this.getUserDetails();
		this.state = {
			playersList: null,//Array
			lotteryStatus: null
		};
		this.getLotteryStatus();
		this.listPlayers();

		this.startLottery = this.startLottery.bind(this);
		this.stopLottery = this.stopLottery.bind(this);
		this.pickWinner = this.pickWinner.bind(this);
	}

	getLotteryStatus() {
		this.web3Service.contract.methods.getLotteryState().call({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			this.setState({
				lotteryStatus: lotteryStates[resp]
			});
		})
	}

	getUserDetails() {
		this.userDetails = {
			name: '',
			phone: '',
			userId: '',
			email: '',
			account: '',
			type: ''
		};
		location.href.split('?')[1].split('&').forEach((param) => {
			this.userDetails[param.split('=')[0]] = param.split('=')[1];
		});
	}

	startLottery() {
		this.web3Service.contract.methods.startLottery().send({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			this.setState({
				lotteryStatus: lotteryStates[1]
			});
			this.web3Service.web3.eth.getAccounts(function(err, accounts) {
				axios.put('/updateAccounts', {
					accounts: accounts
				});
			})
		})
	}

	stopLottery() {
		this.web3Service.contract.methods.stopLottery().send({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			this.setState({
				lotteryStatus: lotteryStates[2]
			});
		});
	}

	pickWinner() {
		this.web3Service.contract.methods.processLotteryWinners().send({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			this.setState({
				lotteryStatus: lotteryStates[0]
			});
			axios.delete('/updateAccounts');
		});
	}

	renderButtons() {
		if(this.state.lotteryStatus === 'NotStarted') {
			return <div className='col-sm-9 winner-section'>
				<button className='btn btn-success' onClick={this.startLottery}>START LOTTERY</button>
			</div>;
		} else if(this.state.lotteryStatus === 'Started') {
			return <div className='col-sm-9 winner-section'>
				<button className='btn btn-success' onClick={this.stopLottery}>STOP LOTTERY</button>
			</div>;
		} else if(this.state.lotteryStatus === 'Finished') {
			return <div className='col-sm-9 winner-section'>
				<button className='btn btn-success' onClick={this.pickWinner}>PICK WINNER</button>
			</div>;
		}
	}

	listPlayers() {
		let playersList;
		this.web3Service.contract.methods.getPlayers().call({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			playersList = resp ? resp.map(function(ele) {
				return <li>{ele.playerName}</li>;
			}) : [];
			this.setState({
				playersList: playersList
			});
		});
		this.web3Service.web3.eth.getAccounts((err,accs) => {
			console.log(accs);
		});
	}

	render() {
		return <div className='container admin-section'>
			<h2>Welcome, ADMIN</h2>
			<div className='row'>
				<div className='col-sm-3 players-section'>
					<ul className='playersList'>
						{this.state.playersList}
					</ul>
				</div>
				{this.renderButtons()}
			</div>
		</div>;
	}
}