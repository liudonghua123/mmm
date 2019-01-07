import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { login } from '@/services/user';
import { setAuthority, setToken, setUserId, clearToken, clearUserId } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    // status: undefined,
    userId: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.info(`login: effets login payload: ${JSON.stringify(payload)}`);
      const response = yield call(login, payload);
      console.info(`login: effets login response: ${JSON.stringify(response)}`);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *updateLoginUser({ payload }, { put }) {
      yield put({
        type: 'updateLoginStatus',
        payload,
      });
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      console.info(`model login -> logout`)
      yield put({
        type: 'changeLoginStatus',
        payload: {
          // status: false,
          userId: undefined,
          currentAuthority: 'guest',
        },
      });
      clearToken();
      clearUserId();
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.user.authority);
      setToken(payload.data.token);
      const newState = {
        ...state,
        ...payload.data,
        userId: payload.data.user.id,
        // status: payload.status,
        // type: payload.type,
      };
      setUserId(payload.data.user.id);
      console.info(`login: reducers changeLoginStatus newState: ${JSON.stringify(newState)}`);
      return newState;
    },

    updateLoginStatus(state, { payload }) {
      const newState = {
        ...state,
        ...payload,
      };
      console.info(`login: reducers updateLoginStatus newState: ${JSON.stringify(newState)}`);
      return newState;
    },
  },
};
