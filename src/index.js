/***
 * 快应用
 * redux
 * 数据流
 */
import createStore from './createStore';
import combineReducers from './combineReducers';
import compose from './compose';
import applyMiddleware from './applyMiddleware';
import connect from './connect';
import { createLocalStorage, initStorage } from './storage.js';

export {
  combineReducers,
  createStore,
  compose,
  connect,
  applyMiddleware,
  createLocalStorage,
  initStorage
};

export default {
  createLocalStorage,
  initStorage,
  combineReducers,
  createStore,
  connect,
  applyMiddleware,
  compose
};


