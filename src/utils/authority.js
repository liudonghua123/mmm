// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['user'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function isAdmin() {
  const authorityString = localStorage.getItem('antd-pro-authority');
  return authorityString.includes('admin');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  return localStorage.setItem('token', token);
}

export function clearToken() {
  return localStorage.removeItem('token');
}

export function getUserId() {
  return localStorage.getItem('userId');
}

export function setUserId(userId) {
  return localStorage.setItem('userId', userId);
}

export function clearUserId() {
  return localStorage.removeItem('userId');
}
