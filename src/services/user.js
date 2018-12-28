import request from '@/utils/request';


export async function login(params) {
  return request('/api/users/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/api/users/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryUsers() {
  return request('/api/users/');
}

export async function queryUserById(id) {
  return request(`/api/users/${id}`);
}