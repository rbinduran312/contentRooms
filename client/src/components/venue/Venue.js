import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ReactJWPlayer from 'react-jw-player';

import { getVenue } from '../../actions/event';
import Spinner from '../layout/Spinner';

const Venue = ({ match, event: { loading, venue, error }, getVenue }) => {
	const [activeStage, setActiveStage] = useState(null);
	const [activeId, setActiveId] = useState(null);

	const [errorMessage, setError] = useState(null);
	const history = useHistory();

	useEffect(() => {
		getVenue(match.params.id);
	}, [getVenue]);

	useEffect(() => {
		if (venue && activeStage && activeId) {
			const player = window.jwplayer(activeId);
			player.remove();
		}
		handleActiveStage();
	}, [match.params.stageName]);

	useEffect(() => {
		if (venue && venue.stages && venue.stages.length) {
			if (!match.params.stageName) {
				history.push(`/event/${venue.event._id}/venue/${venue.stages[0].name}`);
			} else {
				handleActiveStage();
			}
		}
	}, [venue]);

	useEffect(() => {
		if (error && error.msg) {
			setError(error.msg);
		} else {
			setError(null);
		}
	}, [error]);

	const m3u8Config = {
		file: '',
	};

	const drmConfig = {
		default: false,
		type: 'mpd',
		file: '',
		drm: {
			widevine: {
				url:
					'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=BBA049',
			},
		},
		label: 0,
	};

	const handleActiveStage = () => {
		if (venue && venue.stages && venue.stages.length) {
			if (!match.params.stageName) {
				setActiveStage(venue.stages[0]);
				setActiveId(venue._id + venue.stages[0].name);
			} else {
				venue.stages.forEach((stage) => {
					if (stage.name === match.params.stageName) {
						setActiveStage(stage);
						setActiveId(venue._id + stage.name);
					}
				});
			}
		}
	};

	// const type = venue.stages[0].streamingUrl.split('.').pop();
	// const playlist = [];
	// playlist[0] = type === 'm3u8' ? m3u8Config : drmConfig;
	// playlist[0].file = venue.stages[0].streamingUrl;
	// const idToStage = venue.id + venue.stages[0].name;

	return (
		<React.Fragment>
			{loading ? (
				<Spinner />
			) : (
				<React.Fragment>
					{errorMessage && (
						<div className='error-container'>{errorMessage}</div>
					)}
					{venue && venue.event ? <h1>{venue.event.name}</h1> : ''}
					<ul>
						{venue && venue.stages && venue.stages.length
							? venue.stages.map((stage) => (
									<li className='stage-link'>
										<Link
											to={`/event/${venue.event._id}/venue/${stage.name}`}
											className={`btn ${
												activeStage && stage.name === activeStage.name
													? 'btn-primary'
													: 'btn-secondary'
											}`}
										>
											{stage.name}
										</Link>
									</li>
							  ))
							: ''}
					</ul>
					{venue && activeId && activeStage && activeStage.streamingUrl ? (
						<div>
							<ReactJWPlayer
								playerId={activeId}
								playerScript='https://cdn.jwplayer.com/libraries/Xysw2DQ5.js'
								file={activeStage.streamingUrl}
								autostart={true}
							/>
						</div>
					) : (
						''
					)}
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

Venue.propTypes = {
	event: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	event: state.event,
});

export default connect(mapStateToProps, { getVenue })(Venue);
