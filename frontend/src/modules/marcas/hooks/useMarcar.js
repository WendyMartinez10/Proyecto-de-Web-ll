import { useState } from 'react';
import { registrarMarca } from '../services/marcas.service.js';
import { registrarDispositivo } from '../../dispositivos/services/dispositivos.service.js';

export const useMarcar = () => {
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [nombreDisp, setNombreDisp] = useState('');

    const handleMarcar = async () => {
        setMensaje(null);
        setError(null);
        try {
            const res = await registrarMarca();
            setMensaje(res.data.message);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegistrarDispositivo = async (e) => {
        e.preventDefault();
        setMensaje(null);
        setError(null);
        try {
            await registrarDispositivo({ nombre: nombreDisp });
            setMensaje('Dispositivo registrado correctamente. Ya puedes marcar.');
            setNombreDisp('');
        } catch (err) {
            setError(err.message);
        }
    };

    return { mensaje, error, nombreDisp, setNombreDisp, handleMarcar, handleRegistrarDispositivo };
};
