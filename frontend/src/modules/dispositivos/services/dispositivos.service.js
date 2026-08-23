import { fetchApi } from '../../../api/client.js';

export const getDispositivos = () => fetchApi('/dispositivos');
export const registrarDispositivo = (data) => fetchApi('/dispositivos', { method: 'POST', body: JSON.stringify(data) });
export const cambiarEstadoDispositivo = (id, estado) => fetchApi(`/dispositivos/${id}/estado`, { method: 'PUT', body: JSON.stringify({ estado }) });
