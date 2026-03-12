import api, { setAccessToken } from './api';

export async function loginUser(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  const { accessToken, user } = response.data;
  setAccessToken(accessToken);
  return { accessToken, user };
}

export async function logoutUser() {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // Even if logout fails on server, clear locally
  }
  setAccessToken(null);
}

export async function fetchCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}

export async function refreshSession() {
  const response = await api.post('/auth/refresh');
  const { accessToken, user } = response.data;
  setAccessToken(accessToken);
  return { accessToken, user };
}