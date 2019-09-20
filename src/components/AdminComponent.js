import React, { Component } from 'react';
import axios from 'axios';

import Banner from './common/Banner'

import { setPanelType } from '../redux/reducers/admin';
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
		this.web3Service.contract.methods.startLottery(this.web3Service.web3.utils.toWei('1')).send({from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
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
						label='Pick a Winner'
						isSelected={this.props.selectedPanel === 'selectWinner'}
						onClick={() => this.props.setPanel('selectWinner')}
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
			<div className='col-lg pt-5 mt-5 pl-5 admin-panel'>
				{/* {this.getPanelComponent(this.props.selectedPanel)} */}
			</div>
		</div>;
	}
}

const mapStateToProps = (state) => ({
	selectedPanel: state.player.panelType
})

const mapDispatchToProps = (dispatch) => ({
	setPanel: (panel) => dispatch(setPanelType(panel))
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent)