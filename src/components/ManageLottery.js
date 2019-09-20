import React, { Component, Fragment } from 'react';

import './viewTickets.scss'

export default class HomeComponent extends Component {
	constructor() {
		super();

        this.onSubmit = this.onSubmit.bind(this);
        this.renderLotteryManager = this.renderLotteryManager.bind(this);
        this.renderPickWinner = this.renderPickWinner.bind(this);
        this.renderStartLottery = this.renderStartLottery.bind(this);
        this.renderStopLottery = this.renderStopLottery.bind(this);
    }
    
    onSubmit(e) {
        e.preventDefault();
        const ticketPrice = e.currentTarget.getElementsByTagName('input').price.value;
        this.props.startLottery(ticketPrice)
    }
    
    renderStartLottery() {
        return (
            <div>
                <h2 className='mb-4'>Lottery not open yet</h2>
                <p>Begin Now?</p>
                <form onSubmit={(e) => { this.onSubmit(e) }}>
					<p><label>Ticket Price</label><input type='text' name='price' /></p>
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
                    <h2>Winner Selected: {this.props.winner}</h2>
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
		return (
			<div>
				{
                    this.renderLotteryManager(this.props.lotteryState)
				}
			</div>
		);
	}
}