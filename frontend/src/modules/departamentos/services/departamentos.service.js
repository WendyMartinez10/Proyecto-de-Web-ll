import { fetchApi } from '../../../api/client.js';

export const getDepartamentos = () => fetchApi('/departamentos');
export const crearDepartamento = (data) => fetchApi('/departamentos', { method: 'POST', body: JSON.stringify(data) });
export const actualizarDepartamento = (id, data) => fetchApi(`/departamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarDepartamento = (id) => fetchApi(`/departamentos/${id}`, { method: 'DELETE' });
