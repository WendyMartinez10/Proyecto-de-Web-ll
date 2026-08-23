import { useState, useEffect } from 'react';
import { getDepartamentos, crearDepartamento, actualizarDepartamento, eliminarDepartamento } from '../services/departamentos.service.js';

const initialForm = { nombre: '', descripcion: '', encargado: '' };

export const useDepartamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDepartamentos();
    }, []);

    const loadDepartamentos = async () => {
        try {
            const res = await getDepartamentos();
            setDepartamentos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editing) {
                await actualizarDepartamento(editing, form);
            } else {
                await crearDepartamento(form);
            }
            setForm(initialForm);
            setEditing(null);
            loadDepartamentos();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (dep) => {
        setForm({ nombre: dep.nombre, descripcion: dep.descripcion || '', encargado: dep.encargado || '' });
        setEditing(dep.id);
        setError(null);
    };

    const handleCancel = () => {
        setEditing(null);
        setForm(initialForm);
        setError(null);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este departamento/carrera?')) return;
        try {
            await eliminarDepartamento(id);
            loadDepartamentos();
        } catch (err) {
            alert(err.message);
        }
    };

    return { departamentos, form, editing, error, handleChange, handleSubmit, handleEdit, handleCancel, handleDelete };
};
