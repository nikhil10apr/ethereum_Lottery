import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

import Web3Service from '../ethereum/ethereum-app-utility';
import '../styles/player.scss';

export default class HomeComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
		this.getUserDetails();
		this.getLotteryStatus();

		this.state = {
			lotteryOpen: false,
			isRegistered: false
		};

		this.register = this.register.bind(this);
		this.buyTicket = this.buyTicket.bind(this);
	}

	getLotteryStatus() {
		this.web3Service.contract.methods.getLotteryState().call({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			this.setState({
				lotteryOpen: resp === '1'
			});
		});
	}

	getUserDetails() {
		this.userDetails = {
			name: '',
			phone: '',
			userId: '',
			emailId: '',
			account: '',
			type: ''
		};
		location.href.split('?')[1].split('&').forEach((param) => {
			this.userDetails[param.split('=')[0]] = decodeURIComponent(param.split('=')[1]);
		});
		this.userDetails.account && this.web3Service.contract.methods.isPlayerRegistered().call({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			this.setState({
				isRegistered: resp
			});
		})
	}

	register() {
		axios.post('/assignAccount',{
			userId: this.userDetails.userId
		})
		.then(response => {
			this.userDetails.account = response.data.account;
			this.web3Service.contract.methods.registerPlayer(this.userDetails.name, this.userDetails.emailId, this.userDetails.phone).send({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
				if(err) {
					console.log(err);
					return false;
				}
				this.setState({
					isRegistered: true
				});
				console.log(resp)
			});
		});
	}

	buyTicket() {
		this.web3Service.contract.methods.buyLotteryTickets().send({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, function(err, resp) {
			if(err) {
				console.log(err);
				return false;
			}
			console.log(resp)
		});
	}

	render() {
		return <div className='container player-section'>
			Hi, {this.userDetails.name}
			{!this.state.lotteryOpen ? <h2>Lottery is not open yet</h2> : null}
			{this.state.lotteryOpen && !this.state.isRegistered ? 
				<button className='btn btn-success' onClick={this.register}>REGISTER FOR LOTTERY</button> : 
				null
			}
			{this.state.lotteryOpen && this.state.isRegistered ? 
				<button className='btn btn-success' onClick={this.buyTicket}>BUY TICKET</button> : 
				null
			}
			
		</div>;
	}
}