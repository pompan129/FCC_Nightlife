import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {setAuthentication} from "./actions";
import App from './app';
import reducers ,{enableBatching} from './reducers';
import{BrowserRouter } from 'react-router-dom'
import './index.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(enableBatching(reducers));

const token = localStorage.getItem("jwt");  //todo needed?
const username = localStorage.getItem("username");   //todo needed?

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider> ,
  document.getElementById('root'));
