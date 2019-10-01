import React, { Component } from 'react';
import axios from 'axios';

import Banner from './common/Banner'
import ManageLottery from './ManageLottery'
import ViewPlayers from './ViewPlayers'
import ViewTickets from './ViewTickets'

import { setPanelType, setTicketPrice, setLotteryWinner } from '../redux/reducers/admin';
import { connect } from 'react-redux';

import Web3Service from '../ethereum/ethereum-app-utility';
import lotteryStates from '../constants/lotteryStates';//0=NotStared, 1=Started, 2=Finished

import '../styles/admin.scss';

export class AdminComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
		this.getUserDetails();
		this.state = {
			playersList: null,//Array
			lotteryStatus: null,
			showAlert: false
		};
		this.getLotteryStatus();
		// this.listPlayers();

		this.startLottery = this.startLottery.bind(this);
		this.stopLottery = this.stopLottery.bind(this);
		this.pickWinner = this.pickWinner.bind(this);
		this.getUsers = this.getUsers.bind(this);
		
		this.bindEvents();
	}

	bindEvents() {
		this.web3Service.contract.events.ticketSold()
		.on('data', (event) => {
		    console.log(event);
		    this.setState({
		    	showAlert: true
		    });
		});

		this.web3Service.contract.events.winnerIs()
		.on('data', (event) => {
		    console.log(event);
		    this.props.setWinner({
		    	name: event.returnValues._player.playerName,
		    	address: event.returnValues._ticket.ticketOwner,
		    	lotteryId: event.returnValues._ticket.lotteryId,
		    	balance: event.returnValues._balance
		    })
		});
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

	startLottery(ticketPrice) {
		this.web3Service.contract.methods.startLottery(this.web3Service.web3.utils.toWei(ticketPrice.toString())).send({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
			if (err) return;
			this.setState({
				lotteryStatus: lotteryStates[1]
			});
			this.props.setPrice(ticketPrice)
			this.props.setWinner({})
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

	getUsers() {
		return this.web3Service.contract.methods.getPlayers().call({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000})
	}

	getPanelComponent(banner) {
		switch (banner) {
			case 'manageLottery':
				return <ManageLottery 
							lotteryState={this.state.lotteryStatus}
							stopLottery={this.stopLottery}
							startLottery={this.startLottery}
							pickWinner={this.pickWinner}
							winner={this.props.winner}
							account={this.userDetails.account}
						/>
			case 'viewallusers':
				return <ViewPlayers 
							getAllPlayers={this.getUsers}
						/>
			case 'viewalltickets':
				return <ViewTickets />
			default:
				return <ManageLottery 
							lotteryState={this.state.lotteryStatus}
							stopLottery={this.stopLottery}
							startLottery={this.startLottery}
							pickWinner={this.pickWinner}
							winner={this.props.winner}
						/>
		}
	}

	showAlert() {
		if(this.state.showAlert) {
			setTimeout(() => {
				this.setState({
					showAlert: false
				});
			}, 5000);
			return <div className='flash'>Ticket Sold</div>;
		}

		return null;
	}

	render() {
		return <div className='container admin-section'>
			<div className='col-lg admin-sidebar'>
				<h2 className='sidebar-header d-flex justify-content-center'>
					Welcome, {decodeURIComponent(this.userDetails.name)}
				</h2>
				<div>
					<Banner
						label='Manage Lottery'
						isSelected={this.props.selectedPanel === 'manageLottery'}
						onClick={() => this.props.setPanel('manageLottery')}
					/>
				</div>
				<div>
					<Banner
						label='View All Registered Users'
						isSelected={this.props.selectedPanel === 'viewallusers'}
						onClick={() => this.props.setPanel('viewallusers')}
					/>
				</div>
				<div>
					<Banner
						label='View All Purchased Tickets'
						isSelected={this.props.selectedPanel === 'viewalltickets'}
						onClick={() => this.props.setPanel('viewalltickets')}
					/>
				</div>
			</div>
			{
				this.showAlert()
			}
			<div className='col-lg pt-5 mt-5 pl-5 admin-panel'>
				{this.getPanelComponent(this.props.selectedPanel)}
			</div>
		</div>;
	}
}

const mapStateToProps = (state) => ({
	selectedPanel: state.admin.panelType,
	winner: state.admin.winner
})

const mapDispatchToProps = (dispatch) => ({
	setPanel: (panel) => dispatch(setPanelType(panel)),
	setPrice: (price) => dispatch(setTicketPrice(price)),
	setWinner: (winner) => dispatch(setLotteryWinner(winner))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent)