import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DraftItem from '../posts/DraftItem';
import { getDraft } from '../../actions/draft';

const Draft = ({ getDraft, draft: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getDraft, match.params.id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/drafts" className="btn">
        Back To Drafts
      </Link>
      <DraftItem draft={draft} showActions={false} />
    </Fragment>
  );
};

Post.propTypes = {
  getDraft: PropTypes.func.isRequired,
  draft: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  draft: state.post
});

export default connect(mapStateToProps, { getDraft })(Draft);
