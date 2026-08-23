import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service.js';
import { getDepartamentos } from '../../departamentos/services/departamentos.service.js';

export const useRegistro = () => {
    const [formData, setFormData] = useState({
        nombre_usuario: '',
        nombre_completo: '',
        fecha_nacimiento: '',
        correo: '',
        password: '',
        confirmar_password: '',
        departamento_id: ''
    });
    const [departamentos, setDepartamentos] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getDeps = async () => {
            try {
                const res = await getDepartamentos();
                if (res.data) setDepartamentos(res.data);
            } catch (err) {
                console.error('Error al cargar departamentos', err);
            }
        };
        getDeps();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmar_password) {
            setError('La contraseña y su confirmación no coinciden.');
            return;
        }

        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return { formData, departamentos, error, success, handleChange, handleSubmit };
};
