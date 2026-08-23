import { useState, useEffect } from 'react';
import { updateProfile, changePassword } from '../services/auth.service.js';
import { getDepartamentos } from '../../departamentos/services/departamentos.service.js';
import { useAuth } from './useAuth.js';

export const usePerfil = () => {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({ nombre_completo: '', fecha_nacimiento: '', departamento_id: '' });
    const [departamentos, setDepartamentos] = useState([]);
    const [msgPerfil, setMsgPerfil] = useState(null);
    const [errPerfil, setErrPerfil] = useState(null);

    const [passForm, setPassForm] = useState({ password_actual: '', nueva_password: '', confirmar_password: '' });
    const [msgPass, setMsgPass] = useState(null);
    const [errPass, setErrPass] = useState(null);

    useEffect(() => {
        if (user) {
            setForm({
                nombre_completo: user.nombre_completo || '',
                fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.slice(0, 10) : '',
                departamento_id: user.departamento_id || ''
            });
        }
        getDepartamentos().then(res => setDepartamentos(res.data)).catch(() => {});
    }, [user]);

    const handleChangeForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleChangePass = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value });

    const handleSubmitPerfil = async (e) => {
        e.preventDefault();
        setMsgPerfil(null);
        setErrPerfil(null);
        try {
            await updateProfile(form);
            setUser({ ...user, ...form });
            setMsgPerfil('Perfil actualizado correctamente.');
        } catch (err) {
            setErrPerfil(err.message);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setMsgPass(null);
        setErrPass(null);
        if (passForm.nueva_password !== passForm.confirmar_password) {
            setErrPass('La confirmación no coincide con la nueva contraseña.');
            return;
        }
        try {
            await changePassword(passForm);
            setMsgPass('Contraseña actualizada correctamente.');
            setPassForm({ password_actual: '', nueva_password: '', confirmar_password: '' });
        } catch (err) {
            setErrPass(err.message);
        }
    };

    return {
        user, form, departamentos, msgPerfil, errPerfil,
        passForm, msgPass, errPass,
        handleChangeForm, handleChangePass, handleSubmitPerfil, handleSubmitPassword
    };
};
