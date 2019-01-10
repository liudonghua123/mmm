import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryNotifications(params) {
  if (params) {
    return request(`/api/private/notifications/?${stringify(params)}`);
  }
  return request(`/api/private/notifications/`);
}

export async function queryNotificationById(id) {
  return request(`/api/private/notifications/${id}`);
}

export async function removeNotification(params) {
  return request('/api/private/notifications/', {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addNotification(params) {
  return request('/api/private/notifications/', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateNotification(id, params) {
  return request(`/api/private/notifications/${id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'put',
    },
  });
}
