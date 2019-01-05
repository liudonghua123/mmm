import request from '@/utils/request';
import { stringify } from 'qs';

export async function login(params) {
  return request('/api/public/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/api/public/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryUsers(params) {
  return request(`/api/private/users/?${stringify(params)}`);
}

export async function queryUserById(id) {
  return request(`/api/private/users/${id}`);
}

export async function removeUser(params) {
  return request('/api/private/users/', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addUser(params) {
  return request('/api/private/users/', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateUser(params) {
  return request('/api/private/users/', {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
