import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {setAuthentication} from "./actions";
import App from './App';
import reducers ,{enableBatching} from './reducers';
import './index.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(enableBatching(reducers));

const token = localStorage.getItem("jwt");
const username = localStorage.getItem("username");


if(token && username){
  store.dispatch(setAuthentication(true));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider> ,
  document.getElementById('root'));
