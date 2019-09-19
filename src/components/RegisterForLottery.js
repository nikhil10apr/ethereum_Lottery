import React, { Component, Fragment } from 'react';

export default class HomeComponent extends Component {
	constructor() {
		super();
	}

	render() {
		return (
            <div>
                {
					!this.props.lotteryOpen ? <h2>Lottery is not open yet</h2> : null}
					{this.props.lotteryOpen && !this.props.isRegistered ? 
						<button className='btn btn-success' onClick={this.props.register}>REGISTER FOR LOTTERY</button> : 
						null
					}
            </div>
        );
	}
}