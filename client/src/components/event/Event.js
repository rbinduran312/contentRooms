import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import EventTop from './EventTop';
import EventAbout from './EventAbout';
import { getEventById, postPayment } from '../../actions/event';
import EventPosts from '../posts/EventPosts';

//import RoomPosts from '../posts/RoomPosts';
//import RoomDrafts from '../drafts/RoomDrafts';

const Event = ({
	getEventById,
	postPayment,
	event: { event, loading },
	auth,
	match,
}) => {
	useEffect(() => {
		getEventById(match.params.id);
	}, [getEventById, match.params.id]);

	const onToken = (token) => {
		postPayment({
			token: token,
			amount: Number(event.budget * 100),
			payment_kind: 'Event',
			data: event._id,
			email: auth.user.email,
		});
	};

	return (
		<Fragment>
			{event === null || loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to='/events' className='btn btn-light'>
						Back To Events
					</Link>
					<div className='profile-grid my-1'>
						<EventTop event={event} user={auth.user} onToken={onToken} />
						<EventAbout event={event} />
						{auth.isAuthenticated && auth.loading === false && (
							<EventPosts match={match} />
						)}
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

Event.propTypes = {
	getEventById: PropTypes.func.isRequired,
	postPayment: PropTypes.func.isRequired,
	event: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	event: state.event,
	auth: state.auth,
});

export default connect(mapStateToProps, { getEventById, postPayment })(Event);
