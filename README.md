# wechat-redux2

wechat redux is wechat global state  management. fully support the redux grammar

快应用redux状态管理库，完全支持redux语法，便于项目redux迁移

## usage 用法
```javascript
npm install wechat-redux2 --save 或 cnpm install wechat-redux2 --save
```

### 新增API
#### createLocalStorage
```javascript
// actions => 需要缓存的 action.type 名称，详细请看示例
createLocalStorage(actions)
```
#### initStorage
```javascript
// store => redux 实例
initLocalStorage(store);
```


### store.js
```javascript
/***
 * 这里修改状态
 */

import { createStore, applyMiddleware, compose, createLocalStorage } from 'wechat-redux2';

import thunkMiddleware from 'redux-thunk';
// redux 怎么配置就怎么配置就完事
import rootReducer from './reducers/index.js';
import { createLogger } from 'redux-logger';
import actions from './storage/index.js';

const middlewares = [
  thunkMiddleware,
  createLogger(),
  createLocalStorage(actions)
];

const enhancer = compose(
  applyMiddleware(...middlewares),
  // other store enhancers if any
);

export default function configStore() {
  const store = createStore(rootReducer, enhancer);
  return store;
}

```

### app.js
```html
<script>
/**
 * framework app 应用引擎
 * 改造微信小程序生命周期,保证执行顺序
 */
import app from './packages/framework/app.js';
import router from './packages/router/index.js';
import regeneratorRuntime from './packages/framework/runtime.js';
import configStore from './store/index.js';
const store = configStore();
import { initStorage } from 'wechat-redux2';
import request from './packages/request/index.js';
import {getUserInfo} from './store/actions/user.js';
import rules from './rules';

app({
  store,
  // 这个生命周期经过改造之后已经可以在进入页面前做完所有操作了
  onCreate: async function (page) {
    
    await initStorage(store);

    const { user } = store.getState();

    // token
    if (user.token) request.bind({
      header: {
        token: user.token
      }
    });

    await store.dispatch(getUserInfo());

  }
})
</script>
```

### 页面模版使用与data保持一致，所有redux操作都会与视图的data对象做双向绑定 connect 请看示例
```javascript
// pages/user/index.js
import regeneratorRuntime from '../../packages/framework/runtime.js';
import { connect } from 'wechat-redux2';

const store = connect(
  ({user}) => ({
    user: user.info
  }),
  dispatch: () => ({})
);

const config = {

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    setTimeout(() => {

      console.log(this.data.user,123);
    },2000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
};

Page(store(config));

```



