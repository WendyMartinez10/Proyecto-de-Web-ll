import { useState } from 'react';
import { recoverPassword } from '../services/auth.service.js';

export const useOlvidePassword = () => {
    const [identificador, setIdentificador] = useState('');
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await recoverPassword({ identificador });
            setEnviado(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return { identificador, setIdentificador, enviado, error, handleSubmit };
};
