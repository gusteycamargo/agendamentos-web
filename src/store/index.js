import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { encryptTransform } from 'redux-persist-transform-encrypt';

import rootReducers from './reducers'

const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    encryptTransform({
      secretKey: process.env.REACT_APP_KEY_CRP,
      onError: function (error) {
        console.log(error);
        // Handle the error.
      },
    }),
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);