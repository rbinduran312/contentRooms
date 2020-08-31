import React from 'react';
import { Link } from 'react-router-dom';

const FriendRequests = ({
	friendRequests,
	acceptFriendRequest,
	rejectFriendRequest,
}) => {
	return friendRequests && friendRequests.length ? (
		<div className='friend-request-wrapper'>
			<h2>Friend Requests</h2>
			<div className='friend-request-container'>
				{friendRequests.map((request) => (
					<div key={request._id} className='profile bg-light'>
						<img src={request.avatar} alt='' className='round-img' />
						<div>
							<h2>{request.name}</h2>
							<React.Fragment>
								<Link
									to=''
									className='btn btn-primary'
									onClick={() => acceptFriendRequest(request._id)}
								>
									Accept
								</Link>
								<Link
									to=''
									className='btn btn-primary'
									onClick={(e) => rejectFriendRequest(request._id)}
								>
									Reject
								</Link>
							</React.Fragment>
						</div>
					</div>
				))}
			</div>
		</div>
	) : (
		''
	);
};

export default FriendRequests;
