import { fetchApi } from '../../../api/client.js';

export const getEquipos = () => fetchApi('/equipos');
export const crearEquipo = (formData) => fetchApi('/equipos', { method: 'POST', body: formData });
export const actualizarEquipo = (id, formData) => fetchApi(`/equipos/${id}`, { method: 'PUT', body: formData });
export const eliminarEquipo = (id) => fetchApi(`/equipos/${id}`, { method: 'DELETE' });
