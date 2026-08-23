import { fetchApi } from '../../../api/client.js';

export const registrarMarca = () => fetchApi('/marcas', { method: 'POST' });
export const getReportes = (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/marcas?${query}`);
};
