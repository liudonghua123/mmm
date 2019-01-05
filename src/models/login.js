import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { login } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    // status: undefined,
    loginId: undefined,
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
      yield put({
        type: 'changeLoginStatus',
        payload: {
          // status: false,
          loginId: undefined,
          currentAuthority: 'guest',
        },
      });
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
      setAuthority(payload.currentAuthority);
      const newState = {
        ...state,
        ...payload.data,
        loginId: payload.data.user.id,
        // status: payload.status,
        // type: payload.type,
      };
      console.info(`login: reducers changeLoginStatus newState: ${JSON.stringify(newState)}`);
      return newState;
    },

    updateLoginStatus(state, { payload }) {
      const newState = {
        ...state,
        ...payload,
        loginId: payload.id,
      };
      console.info(`login: reducers updateLoginStatus newState: ${JSON.stringify(newState)}`);
      return newState;
    },
  },
};
