import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addDraft, getDraft } from '../../actions/draft';
import Upload from '../uploader/Upload';
//import Upload from '../uploader/Upload';

const initialState = {
  text: '',
  title: '',
  description: '',
  dash: '',
  room: ''
}

const DraftForm = ({ 
  draft: {draft,loading},
  addDraft,
  getDraft,
  history
}) => {
  const [text, setText] = useState('');

  const [formData, setFormData] = useState(initialState);


  return (
    <div className='draft-form'>
      <div className='bg-primary p'>
        <h3>Create a Draft...</h3>
      </div>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          addDraft({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a draft'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

DraftForm.propTypes = {
  addDraft: PropTypes.func.isRequired
};

export default connect(
  null,
  { addDraft }
)(DraftForm);
