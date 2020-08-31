import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DraftItem from './DraftItem';
import DraftForm from './DraftForm';
import { getDrafts } from '../../actions/draft';

const Drafts = ({ getDrafts, draft: { drafts } }) => {
  useEffect(() => {
    getDrafts();
  }, [getDrafts]);

  return (
    <Fragment>
      <h1 className="large text-primary">Drafts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      <div className="posts">
        {drafts.map((draft) => (
          <DraftItem key={draft._id} draft={draft} />
        ))}
      </div>
    </Fragment>
  );
};

Drafts.propTypes = {
  getDrafts: PropTypes.func.isRequired,
  draft: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  draft: state.draft
});

export default connect(mapStateToProps, { getDrafts })(Drafts);
