import { fetchApi } from '../../../api/client.js';

export const getConfiguracion = () => fetchApi('/configuracion');
export const actualizarConfiguracion = (data) => fetchApi('/configuracion', { method: 'PUT', body: JSON.stringify(data) });
