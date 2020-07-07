import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';

import {deleteDraft } from '../../actions/draft';

const DraftItem = ({
  deleteDraft,
  auth,
  draft: { _id, text, name, avatar, user, date },
  showActions
}) => (
    <div className='bg-white p-1 my-1'>
      <div className='post'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='draft-date'>
            Drafted on <Moment format='YYYY/MM/DD'>{date}</Moment>
          </p>

          {showActions && (
            <Fragment>
              <Link to={`/drafts/${_id}`} className='btn btn-primary'>
                Edit Draft{' '}
              </Link>
              {!auth.loading && user === auth.user._id && (
                <button
                  onClick={() => deleteDraft(_id)}
                  type='button'
                  className='btn btn-danger'
                >
                  <i className='fas fa-times' />
                </button>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );

DraftItem.defaultProps = {
  showActions: true
};

DraftItem.propTypes = {
  draft: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteDraft: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {deleteDraft }
)(DraftItem);