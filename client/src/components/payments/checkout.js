import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import api from '../../utils/api';
import PropTypes from 'prop-types';

export default class Checkout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stripeKey: null,
			paymentSettings: null,
			showCardInfoModal: false,
		};
	}

	componentWillMount() {
		this.getStripeKey();
	}

	async getStripeKey() {
		const response = await api.get('/payment/key');
		console.log(response.data.pub);
		this.setState({ stripeKey: response.data.pub });
	}

	onToken = async (token, addresses) => {
		// TODO: Send the token information and any other
		// relevant information to your payment process
		// server, wait for the response, and update the UI
		// accordingly. How this is done is up to you. Using
		// XHR, fetch, or a GraphQL mutation is typical.
		try {
			this.props.onToken(token);
		} catch (err) {}
	};
	render() {
		return (
			<div>
				{this.state.stripeKey && (
					<StripeCheckout
						stripeKey={this.state.stripeKey}
						token={this.onToken}
						amount={this.props.budget}
						email={this.props.email}
					/>
				)}
			</div>
		);
	}
}

Checkout.propTypes = {
	handleToken: PropTypes.func.isRequired,
	budget: PropTypes.number.isRequired,
};
