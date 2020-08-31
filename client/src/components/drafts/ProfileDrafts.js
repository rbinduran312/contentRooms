import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DraftItem from './DraftItem';
import { getUserDrafts } from '../../actions/draft';

const ProfileDrafts = ({getUserDrafts, user , draft: {drafts}}) => {
  useEffect(() => {
    getUserDrafts(user._id);

  }, [getUserDrafts,user._id]);

  return (
    <Fragment>
      <div className='drafts'>
        {drafts.map(draft => (
          <DraftItem key={draft._id} draft={draft} />
        ))}
      </div>
    </Fragment>
  );
};

getUserDrafts.propTypes = {
  getUserDrafts: PropTypes.func.isRequired,
  draft: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  draft: state.draft
});

export default connect(
  mapStateToProps,
  { getUserDrafts }
)(ProfileDrafts);
