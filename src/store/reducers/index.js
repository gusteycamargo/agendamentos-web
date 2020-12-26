import { combineReducers } from 'redux';

import campus from './campus';
import userLogged from './userLogged';

export default combineReducers({
    campus,
    userLogged
});
