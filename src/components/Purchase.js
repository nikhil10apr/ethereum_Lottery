import React, { Component, Fragment } from 'react';

export default class HomeComponent extends Component {
	constructor() {
		super();
	}

	render() {
		return (
            <div>
                {this.props.lotteryOpen && this.props.isRegistered ? 
						<button className='btn btn-success' onClick={this.props.buyTicket}>BUY TICKET</button> : 
						null
					}
            </div>
        );
	}
}