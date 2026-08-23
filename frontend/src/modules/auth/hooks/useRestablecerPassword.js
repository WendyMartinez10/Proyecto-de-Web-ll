import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/auth.service.js';

export const useRestablecerPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();

    const [form, setForm] = useState({ nueva_password: '', confirmar_password: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError('El enlace no contiene un token válido.');
            return;
        }
        if (form.nueva_password !== form.confirmar_password) {
            setError('La confirmación no coincide con la nueva contraseña.');
            return;
        }

        try {
            await resetPassword({ token, ...form });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return { token, form, setForm, error, success, handleSubmit };
};
