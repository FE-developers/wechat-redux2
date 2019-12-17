const injectRef = {};
export const createKey = type => `action:${type}`;

// 创建本地缓存
export const createLocalStorage = (storage = []) => () => {
  injectRef.storage = storage;
  return next => {
    return action => {
      const isStorage = storage.find(item => item === action.type);
      // 允许存储
      if (isStorage && action.payload !== undefined) {
        wx.setStorageSync(createKey(action.type), action.payload);
      } else if (isStorage) {
        console.error('当前 action 存储失败，没有设置对应的 payload');
      }
      return next(action)
    };
  }
};

// 初始化本地缓存
export const initStorage = (store = []) => {
  const storage = injectRef.storage;

  return Promise.all(storage.map(type => {
    const key = createKey(type);

    return new Promise(resolve => {
      const data = wx.getStorageSync(key) || null;
      resolve({data});
    }).then(info => {
      if (info && info.data !== undefined && info.data !== null && info.data !== '') {
        return new Promise(resolve => {
          try {
            store.dispatch({
              type,
              payload: info.data
            }).then(() => {
              resolve();
            });
          } catch (e) {
            store.dispatch({
              type,
              payload: info.data
            });
            resolve();
          }
        });
      }
    });

  }));
};

export const initLocalStorage = initStorage;