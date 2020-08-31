import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProfileTop = ({
	profile: {
		location,
		website,
		social,
		otherUser: {
			user: { _id, name, avatar },
		},
		user,
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
					<div>
						<Link
							to=''
							className='btn btn-secondary'
							onClick={(event) => event.preventDefault()}
						>
							Request Sent
						</Link>
					</div>
				);
			case 'requestReceived':
				return (
					<div>
						<Link
							to=''
							className='btn btn-secondary'
							onClick={(e) => acceptFriendRequest(_id, e)}
						>
							Accept
						</Link>
						<Link
							to=''
							className='btn btn-secondary'
							onClick={(e) => rejectFriendRequest(_id, e)}
						>
							Reject
						</Link>
					</div>
				);
			default:
				return (
					<Link
						to=''
						className='btn btn-secondary'
						onClick={(e) => addFriend(e, _id, name)}
					>
						Add as friend
					</Link>
				);
		}
	};

	return (
		<div className='profile-top bg-primary p-2'>
			<img className='round-img my-1' src={avatar} alt='' />
			<h1 className='large'>{name}</h1>
			<p>{location && <span>{location}</span>}</p>
			<div className='icons my-1'>
				{website && (
					<a href={website} target='_blank' rel='noopener noreferrer'>
						<i className='fas fa-globe fa-2x' />
					</a>
				)}
				{social && social.twitter && (
					<a href={social.twitter} target='_blank' rel='noopener noreferrer'>
						<i className='fab fa-twitter fa-2x' />
					</a>
				)}
				{social && social.facebook && (
					<a href={social.facebook} target='_blank' rel='noopener noreferrer'>
						<i className='fab fa-facebook fa-2x' />
					</a>
				)}
				{social && social.linkedin && (
					<a href={social.linkedin} target='_blank' rel='noopener noreferrer'>
						<i className='fab fa-linkedin fa-2x' />
					</a>
				)}
				{social && social.youtube && (
					<a href={social.youtube} target='_blank' rel='noopener noreferrer'>
						<i className='fab fa-youtube fa-2x' />
					</a>
				)}
				{social && social.instagram && (
					<a href={social.instagram} target='_blank' rel='noopener noreferrer'>
						<i className='fab fa-instagram fa-2x' />
					</a>
				)}
			</div>
			{user._id !== _id && (friendStatus === '' || friendStatus)
				? renderButton()
				: ''}
		</div>
	);
};

ProfileTop.propTypes = {
	profile: PropTypes.object.isRequired,
	friendStatus: PropTypes.string.isRequired,
	acceptFriendRequest: PropTypes.func.isRequired,
	rejectFriendRequest: PropTypes.func.isRequired,
	addFriend: PropTypes.func.isRequired,
};

export default ProfileTop;
