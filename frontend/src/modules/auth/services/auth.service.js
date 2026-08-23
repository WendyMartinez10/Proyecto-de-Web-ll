import { fetchApi } from '../../../api/client.js';

export const login = (data) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const register = (data) => fetchApi('/auth/registro', { method: 'POST', body: JSON.stringify(data) });
export const logout = () => fetchApi('/auth/logout', { method: 'POST' });
export const getProfile = () => fetchApi('/auth/perfil');
export const updateProfile = (data) => fetchApi('/auth/perfil', { method: 'PUT', body: JSON.stringify(data) });
export const changePassword = (data) => fetchApi('/auth/password', { method: 'PUT', body: JSON.stringify(data) });
export const recoverPassword = (data) => fetchApi('/auth/recuperar', { method: 'POST', body: JSON.stringify(data) });
export const resetPassword = (data) => fetchApi('/auth/restablecer', { method: 'POST', body: JSON.stringify(data) });
