import { queryUsers, addUser, removeUser, updateUser, queryUserById } from '@/services/user';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getUserId } from '@/utils/authority';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put, select }) {
      const userId = payload.id || (yield select(state => state.login.userId)) || getUserId();
      // if(!userId) {
      //   userId = yield select(state => state.login.userId);
      // }
      // if (!userId) {
      //   userId = getUserId();
      // }
      if (userId) {
        const response = yield call(updateUser, userId, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      }
      if (callback) callback();
    },
    *fetchCurrent(_, { call, put, select }) {
      let userId = yield select(state => state.login.userId);
      if (!userId) {
        userId = getUserId();
      }
      if (userId) {
        const response = yield call(queryUserById, userId);
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data.user || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
