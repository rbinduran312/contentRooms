import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
	profile: {
		user: { _id, name, avatar },
		status,
		location,
	},
	addFriend,
	friendStatus,
	acceptFriendRequest,
	rejectFriendRequest,
}) => {
	const renderButton = () => {
		switch (friendStatus) {
			case 'friend':
				return '';
			case 'requestSent':
				return (
					<React.Fragment>
						<Link
							to=''
							className='btn btn-primary'
							onClick={(event) => event.preventDefault()}
						>
							Request Sent
						</Link>
					</React.Fragment>
				);
			case 'requestReceived':
				return (
					<React.Fragment>
						<Link
							to=''
							className='btn btn-primary'
							onClick={(e) => acceptFriendRequest(_id, e)}
						>
							Accept
						</Link>
						<Link
							to=''
							className='btn btn-primary'
							onClick={(e) => rejectFriendRequest(_id, e)}
						>
							Reject
						</Link>
					</React.Fragment>
				);
			default:
				return (
					<Link
						to=''
						className='btn btn-primary'
						onClick={(e) => addFriend(e, _id, name)}
					>
						Add as friend
					</Link>
				);
		}
	};
	return (
		<div className='profile bg-light'>
			<img src={avatar} alt='' className='round-img' />
			<div>
				<h2>{name}</h2>
				<p className='my-1'>{location && <span>{location}</span>}</p>
				<Link to={`/profile/${_id}`} className='btn btn-primary'>
					View Profile
				</Link>
				{renderButton()}
			</div>
		</div>
	);
};

ProfileItem.propTypes = {
	profile: PropTypes.object.isRequired,
	acceptFriendRequest: PropTypes.func.isRequired,
	rejectFriendRequest: PropTypes.func.isRequired,
};

export default ProfileItem;
