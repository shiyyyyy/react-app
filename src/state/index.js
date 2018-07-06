import { combineReducers } from 'redux';
import * as CoreState from './CoreState';

export default combineReducers({
  ...CoreState
});