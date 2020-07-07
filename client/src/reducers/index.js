import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import draft from './draft';


export default combineReducers({
  alert,
  auth,
  profile,
  post,
  draft
});
