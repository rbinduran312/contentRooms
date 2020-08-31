import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import EventItem from './EventItem';
import { getEvents} from '../../actions/event';

const Events = ({ getEvents, event: { events, loading } }) => {
  useEffect(() => {
    getEvents();
  }, [getEvents]);


  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
          <Fragment>
            <h1 className='large text-primary'>Events</h1>
            <p className='lead'>
              <i className='fab fa-connectdevelop' /> Browse Content Events
          </p>
            <div className='profiles'>
              {events.length > 0 ? (
                events.map(event => (
                  <EventItem key={event._id} event={event}  />
                ))
              ) : (
                  <h4>No events found...</h4>
                )}
            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

Events.propTypes = {
  getEvents: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getEvents}
)(Events);
