import {getStore} from './createStore';

/***
 * dispatch封装
 */
const listenDispatch = function (methods) {
  Object.keys(methods).forEach(name => {
    const fn = methods[name];
    methods[name] = fn;
  });
  return methods;
};

/***
 * 修饰符
 */
export default function connect(mapState, mapDispatch) {

  const store = getStore();

  // 如果没有store,绑定失败
  if (!store) {
    console.warn(`connect 绑定失败,当前store未初始化.`);
    return function(conf){
      return conf;
    };
  };

  /***
   * 每次 dispatch
   * 都应该被处理
   */
  const methods = listenDispatch(mapDispatch ? mapDispatch(store.dispatch) : {});

  return function (conf) {

    // 初始状态
    const state = mapState ? mapState(store.getState()) : {};

    const sub = function (mapState) {
      const store = getStore();
      // 每次执行完成执行更新操作
      const newState = mapState ? mapState(store.getState()) : {};
      // 每次被改变时,重新修改被改变的值
      this.setData(Object.assign(newState || {}));
    };

    /**
     * 出现组件核心关键字
     * 认为当前是组件接口
     */
    if (
      (conf.methods instanceof Object) ||
      (conf.properties instanceof Function) ||
      (conf.attached instanceof Function) ||
      (conf.ready instanceof Function) ||
      (conf.moved instanceof Function) ||
      (conf.detached instanceof Function)
    ){
      conf.methods = Object.keys(methods).forEach(item => {
        if (!conf.methods) conf.methods = {};
        conf.methods[item] = methods[item];
      });
    } else {
      Object.keys(methods).forEach(item => {
        conf[item] = methods[item];
      });
    }

    if (!conf.data) conf.data = {};
    
    conf.data = Object.assign(conf.data, state || {});
    
    const _onLoad = conf.onLoad;
    const _onShow = conf.onShow;

    conf.onLoad = function(){
      // dispacth 订阅
      store.subscribe(() => {
        Promise.resolve().then(() => sub.call(this, mapState));
      });
      sub.call(this, mapState);
      return _onLoad && _onLoad.call(this, ...arguments);
    };

    // 发生onShow同步状态
    conf.onShow = function(){
      sub.call(this, mapState);
      return _onShow && _onShow.call(this, ...arguments);
    };

    return conf;
  }
}