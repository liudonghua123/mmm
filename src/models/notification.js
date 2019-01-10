import {
  queryNotifications,
  addNotification,
  removeNotification,
  updateNotification,
} from '@/services/notification';

export default {
  namespace: 'notification',

  state: {},

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      console.info(`modal notification fetch`);
      const response = yield call(queryNotifications, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addNotification, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeNotification, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const userId = payload.id;
      if (userId) {
        const response = yield call(updateNotification, userId, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
  },
};
