import { fetchApi } from '../../../api/client.js';

export const getPrestamos = (params) => {
    const query = new URLSearchParams(params || {}).toString();
    return fetchApi(`/prestamos?${query}`);
};
export const getDetalles = (id) => fetchApi(`/prestamos/${id}`);
export const crearPrestamo = (data) => fetchApi('/prestamos', { method: 'POST', body: JSON.stringify(data) });
export const devolverCompleto = (id) => fetchApi(`/prestamos/${id}/devolver`, { method: 'PUT' });
export const devolverDetalle = (id, detalleId) => fetchApi(`/prestamos/${id}/detalle/${detalleId}/devolver`, { method: 'PUT' });
