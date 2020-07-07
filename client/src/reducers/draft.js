import {
    GET_DRAFTS,
    GET_USER_DRAFTS,
    DRAFT_ERROR,
    DELETE_DRAFT,
    ADD_DRAFT,
    GET_DRAFT,
  } from '../actions/types';
  
  const initialState = {
    drafts: [],
    draft: null,
    loading: true,
    error: {}
  };
  
  export default function(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_DRAFTS:
        return {
          ...state,
          drafts: payload,
          loading: false
        };
      case GET_DRAFT:
        return {
          ...state,
          draft: payload,
          loading: false
        };
      case GET_USER_DRAFTS:
        return {
          ...state,
          drafts: payload,
          loading: false
        };
      case ADD_DRAFT:
        return {
          ...state,
          drafts: [payload, ...state.drafts],
          loading: false
        };
      case DELETE_DRAFT:
        return {
          ...state,
          drafts: state.drafts.filter(draft => draft._id !== payload),
          loading: false
        };
      case DRAFT_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
        };
      default:
        return state;
    }
  }
  