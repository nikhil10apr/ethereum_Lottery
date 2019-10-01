import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Banner from './common/Banner'
import RegisterForLottery from './RegisterForLottery'
import Purchase from './Purchase'
import ViewTickets from './ViewTickets'
import { setPanelType } from '../redux/reducers/player';
import Web3Service from '../ethereum/ethereum-app-utility';
import '../styles/player.scss';

const lhsMenuItems = {
	register: 'Register for Lottery',
	purchase: 'Purchase Ticket(s)',
	viewall: 'View My Tickets'
};

export class PlayerComponent extends Component {
	constructor() {
		super();

		this.web3Service = Web3Service;
		this.getUserDetails();
		this.getLotteryStatus();

		this.state = {
			lotteryOpen: false,
			isRegistered: false,
			balance: '0',
			winningTicket: null
		};

		this.register = this.register.bind(this);
		this.buyTicket = this.buyTicket.bind(this);
		this.bindEvents();
	}

	bindEvents() {
		this.web3Service.contract.events.lotteryStatusUpdate()
		.on('data', (event) => {
		    console.log(event);
		    this.getLotteryStatus();
		});

		this.web3Service.contract.events.winnerIs()
		.on('data', (event) => {
		    console.log(event);
		    this.setState({
		    	winningTicket: event.returnValues._ticket.lotteryId
		    });
		});
	}

	getLotteryStatus() {
		this.web3Service.contract.methods.getLotteryState().call({ from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
			this.setState({
				lotteryOpen: resp === '1'
			});
		});
	}

	getBalance() {
		return this.web3Service.web3.eth.getBalance(this.userDetails.account).then((result) => {
			const etherBalance = this.web3Service.web3.utils.fromWei(result);
			this.userDetails.balance = etherBalance;
			this.setState({
				balance: etherBalance
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
		if (this.userDetails.account) {
			this.web3Service.contract.methods.isPlayerRegistered().call({ from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				this.setState({
					isRegistered: resp
				});
			});
			const accountBalance = this.getBalance()
		}
	}

	register() {
		axios.post('/assignAccount', {
			userId: this.userDetails.userId
		})
		.then(response => {
			this.userDetails.account = response.data.account;
			this.web3Service.contract.methods.registerPlayer(this.userDetails.name, this.userDetails.emailId, this.userDetails.phone).send({ from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000 }, (err, resp) => {
				if (err) {
					console.log(err);
					return false;
				}
				this.getBalance();
				this.setState({
					isRegistered: true
				}, function() {
					this.props.setPanel('purchase');
				});
			});
		});
	}

	buyTicket(numberOfTickets) {
		return this.web3Service.contract.methods.buyLotteryTickets(numberOfTickets).send({ from: this.userDetails.account, gasPrice: '10000000000000', gas: 1000000, value: this.web3Service.web3.utils.toWei(((this.props.lotteryPrice || 1) * numberOfTickets).toString()) });
	}

	getPanelComponent(banner) {
		switch (banner) {
			case 'register':
				return <RegisterForLottery 
							register={this.register}
							lotteryOpen={this.state.lotteryOpen}
							isRegistered={this.state.isRegistered}
							winner={this.state.winningTicket}
						/>;
			case 'purchase':
				return <Purchase 
							lotteryOpen={this.state.lotteryOpen}
							isRegistered={this.state.isRegistered}
							buyTicket={this.buyTicket}
							balance={this.userDetails.balance}
							account={this.userDetails.account}
							winner={this.state.winningTicket}
						/>;
			case 'viewall':
				return <ViewTickets account={this.userDetails.account}/>;
			default:
				return <RegisterForLottery 
							register={this.register}
							lotteryOpen={this.state.lotteryOpen}
							isRegistered={this.state.isRegistered}
							winner={this.state.winningTicket}
						/>;
		}
	}

	render() {
		return <div className='container player-section'>
			<div className='col-lg player-sidebar'>
				<h2 className='sidebar-header d-flex justify-content-center'>
					Welcome, {decodeURIComponent(this.userDetails.name)}
				</h2>
				{
					Object.keys(lhsMenuItems).map(key => {
						return (<Banner
							label={lhsMenuItems[key]}
							isSelected={this.props.selectedPanel === key}
							onClick={() => this.props.setPanel(key)}
						/>);
					})
				}
			</div>
			<div className='col-lg pt-5 mt-5 pl-5 player-panel'>
				{this.getPanelComponent(this.props.selectedPanel)}
			</div>
		</div>;
	}
}

const mapStateToProps = (state) => ({
	selectedPanel: state.player.panelType,
	lotteryPrice: state.admin.ticketPrice
})

const mapDispatchToProps = (dispatch) => ({
	setPanel: (panel) => dispatch(setPanelType(panel))
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayerComponent)