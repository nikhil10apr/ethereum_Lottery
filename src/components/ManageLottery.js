import React, { Component, Fragment } from 'react';
import axios from 'axios';

import Web3Service from '../ethereum/ethereum-app-utility';
import './viewTickets.scss'

export default class HomeComponent extends Component {
	constructor(props) {
		super(props);

        this.web3Service = Web3Service;
        this.state = {
            collection: 0
        };
        this.getCollection(props.account);
        this.onSubmit = this.onSubmit.bind(this);
    }

    getCollection(account) {
        this.web3Service.contract.methods.getTotalAmount().call({from: account, gasPrice: '10000000000000', gas: 1000000}, (err, resp) => {
            this.setState({
                collection: this.web3Service.web3.utils.fromWei(resp)
            });
        })
    }
    
    onSubmit(e) {
        e.preventDefault();
        const lotteryName = e.currentTarget.getElementsByTagName('input').lotteryName.value;
        const ticketPrice = e.currentTarget.getElementsByTagName('input').price.value;
        this.props.startLottery(ticketPrice);
        axios.put('/createNewLottery', {
            lotteryName: lotteryName,
            ticketPrice: ticketPrice
        });
    }
    
    renderStartLottery() {
        return (
            <div>
                <h2 className='mb-4'>Lottery not open yet</h2>
                <p>Begin Now?</p>
                <form onSubmit={this.onSubmit}>
                    <p><label className='label-width'>Lottery Name</label><input type='text' name='lotteryName' /></p>
					<p><label className='label-width'>Ticket Price</label><input type='text' name='price' /></p>
					<p><button className='btn btn-primary'>Start</button></p>
				</form>
            </div>
        )
    }

    renderStopLottery() {
        return (
            <div>
                <h2 className='mb-4'>Lottery is currently open for Registration</h2>
                <p>Stop Registrations Now?</p>
                <button className='btn btn-primary' onClick={this.props.stopLottery}>Stop</button>
            </div>
        )
    }

    renderPickWinner() {
        return (
            <div>
                <h2 className='mb-4'>Lottery is closed for Registration</h2>
                <p>Choose Winner Now?</p>
                <button className='btn btn-primary' onClick={this.props.pickWinner}>Pick Winner</button>
            </div>
        )
    }

    renderLotteryManager(lotteryState) {

        if(lotteryState === 'NotStarted' && Object.keys(this.props.winner).length) {
            return (
                <div>
                    <h2>Winner Selected:</h2>
                    <ul>
                        <li><h4>Ticket Id: {this.props.winner.lotteryId}</h4></li>
                        <li><h4>Name: {this.props.winner.name}</h4></li>
                        <li><h4>Wallet Address: {this.props.winner.address}</h4></li>
                    </ul>
                </div>
            )
        } else {
            switch(lotteryState) {
                case 'NotStarted':
                    return this.renderStartLottery()
                case 'Started':
                    return this.renderStopLottery()
                case 'Finished':
                    return this.renderPickWinner()
                default:
                    return <div>Unknown Lottery State</div>
            }
        }
    }

	render() {
        this.getCollection(this.props.account);
		return (
            <Fragment>
			<div style={{flex: '3'}}>
				{
                    this.renderLotteryManager(this.props.lotteryState)
				}
			</div>
            <div style={{flex: '1'}}>
                Total Collection: {this.state.collection} ETH
            </div>
            </Fragment>
		);
	}
}