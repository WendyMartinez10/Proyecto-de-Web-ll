import { useState, useEffect } from 'react';
import { getConfiguracion, actualizarConfiguracion } from '../services/configuracion.service.js';

export const useConfiguracion = () => {
    const [config, setConfig] = useState({});
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const res = await getConfiguracion();
            setConfig(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (clave, valor) => setConfig({ ...config, [clave]: valor });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setError(null);
        try {
            await actualizarConfiguracion(config);
            setMsg('Configuración actualizada correctamente.');
        } catch (err) {
            setError(err.message);
        }
    };

    return { config, msg, error, loading, handleChange, handleSubmit };
};
