import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import draft from './draft';
import room from './room';



export default combineReducers({
  alert,
  auth,
  profile,
  post,
  draft,
  room
});
