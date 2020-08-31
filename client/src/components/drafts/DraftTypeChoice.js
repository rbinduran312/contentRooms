import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addDraft } from '../../actions/draft';
import Upload from '../uploader/Upload';
//import Upload from '../uploader/Upload';

const DraftTypeChoice = ({ addDraft }) => {
  const [text, setText] = useState('');
  return (
    <div className='draft-form'>
      <div className='bg-primary p'>
        <h3>Create a Draft...</h3>
      </div>
        <div className="Card">
          <Upload />
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

DraftTypeChoice.propTypes = {
  addDraft: PropTypes.func.isRequired
};

export default connect(
  null,
  { addDraft }
)(DraftTypeChoice);



{/* <div className="Card">
<Upload />
</div> */}