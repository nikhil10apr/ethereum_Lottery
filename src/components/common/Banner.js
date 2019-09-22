import React, { Component, Fragment } from 'react';

import './Banner.scss';

export default class HomeComponent extends Component {
	constructor() {
		super();

		this.state = {
			lotteryOpen: false,
			isRegistered: false
		};
	}

	render() {
		const bannerClassName = "banner my-2" + (this.props.isSelected ? " selected-banner" : "");
		return (
			<div className={bannerClassName} onClick={this.props.onClick}>
				<span className="banner-title d-flex justify-content-center pt-1">
					{this.props.label}
				</span>
			</div>
		);
	}
}