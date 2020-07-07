import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_DRAFTS,
  GET_USER_DRAFTS,
  DRAFT_ERROR,
  DELETE_DRAFT,
  ADD_DRAFT,
  GET_DRAFT,
} from './types';

// Get drafts
export const getDrafts = () => async dispatch => {
  try {
    const res = await api.get('/drafts');

    dispatch({
      type: GET_DRAFTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DRAFT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete draft
export const deleteDraft = id => async dispatch => {
  try {
    await api.delete(`/drafts/${id}`);

    dispatch({
      type: DELETE_DRAFT,
      payload: id
    });

    dispatch(setAlert('Draft Removed', 'success'));
  } catch (err) {
    dispatch({
      type: DRAFT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add draft
export const addDraft = formData => async dispatch => {
  try {
    const res = await api.post('/drafts', formData);

    dispatch({
      type: ADD_DRAFT,
      payload: res.data
    });

    dispatch(setAlert('Draft Created', 'success'));
  } catch (err) {
    dispatch({
      type: DRAFT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get draft
export const getDraft = id => async dispatch => {
  try {
    const res = await api.get(`/drafts/${id}`);

    dispatch({
      type: GET_DRAFT,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DRAFT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get User's drafts
export const getUserDrafts = id => async dispatch => {
  try {

    const res = await api.get(`/drafts/user/${id}`);

    dispatch({
      type: GET_USER_DRAFTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: DRAFT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
