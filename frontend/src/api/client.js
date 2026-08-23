export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Origen del backend para las imágenes de equipos.
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export const getImagenEquipoUrl = (imagen) => {
    if (!imagen) return null;
    return `${API_ORIGIN}/uploads/equipos/${imagen}`;
};

export const fetchApi = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        credentials: 'include' // Obligatorio para cookies de sesión
    };

    if (options.body instanceof FormData) {
        delete defaultOptions.headers['Content-Type'];
    }

    const config = { ...defaultOptions, ...options };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        let mensaje = 'Error en la petición';

        if (Array.isArray(data.error)) {
            // El backend devuelve un arreglo de { campo, mensaje } cuando falla
            // la validación (ver commonValidators.js -> validateResult).
            mensaje = data.error.map((e) => e.mensaje || e.msg || JSON.stringify(e)).join(' | ');
        } else if (typeof data.error === 'string') {
            mensaje = data.error;
        } else if (data.error) {
            mensaje = JSON.stringify(data.error);
        }

        const error = new Error(mensaje);
        error.details = data.error; // por si algún hook quiere los errores campo a campo
        throw error;
    }

    return data;
};