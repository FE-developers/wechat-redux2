//app.js
const injectRef = Object.getPrototypeOf(global) || global;
const { regeneratorRuntime } = require('./wechat-redux2/index');
injectRef.regeneratorRuntime = regeneratorRuntime;

// import { initLocalStorage } from './wechat-redux2';
// import configStore from './store'
// const store = configStore();

App({
  onLaunch: function () {
  },
  globalData: {
  }
})
