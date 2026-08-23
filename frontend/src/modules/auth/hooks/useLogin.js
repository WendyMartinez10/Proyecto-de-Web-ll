import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';
import { login } from '../services/auth.service.js';

export const useLogin = () => {
    const [credenciales, setCredenciales] = useState({ identificador: '', password: '' });
    const [error, setError] = useState(null);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await login(credenciales);
            setUser(res.data.usuario);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return { credenciales, error, handleChange, handleSubmit };
};
