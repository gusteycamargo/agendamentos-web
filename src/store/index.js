import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import CryptoJS from 'crypto-js';

const persistConfig = {
  key: 'root',
  storage,
}

const INITIAL_STATE = {
    user: {},
    campus: {},
};
  
function userLogged(state = INITIAL_STATE, action) {
    let ciphertext;

    switch (action.type) {
        case 'ADD_USER_LOGGED':            
            ciphertext = CryptoJS.AES.encrypt(JSON.stringify(action.user), process.env.REACT_APP_KEY_USER).toString();
            return { ...state, user: ciphertext };
        case 'ADD_CAMPUS':
            ciphertext = CryptoJS.AES.encrypt(JSON.stringify(action.campus), process.env.REACT_APP_KEY_CAMPUS).toString();
            return { ...state, campus: ciphertext };
        default:
            return state;
    }
}

const persistedReducer = persistReducer(persistConfig, userLogged);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);

