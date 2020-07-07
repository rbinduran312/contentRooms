import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addDraft } from '../../actions/draft';
import Upload from '../uploader/Upload';


const DraftTypeChoice = ({ addDraft }) => {
  const [type] = new FormData();
  return (
    <div className='draft-form'>
      <div className='bg-primary p'>
        <h3>Create a Drafttypechoice...</h3>
      </div>

    <Upload />

    </div>

  
  );
};

DraftTypeChoice.propTypes = {
  addDraft: PropTypes.func.isRequired
};

export default connect(
  null,
  { addDraft }
)(DraftTypeChoice);
