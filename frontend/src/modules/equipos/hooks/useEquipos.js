import { useState, useEffect } from 'react';
import { getEquipos, crearEquipo, actualizarEquipo, eliminarEquipo } from '../services/equipos.service.js';

const initialForm = { codigo: '', descripcion: '', estado: 'disponible', imagen: null };

export const useEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editing, setEditing] = useState(null);
    const [editingEstadoOriginal, setEditingEstadoOriginal] = useState(null);

    useEffect(() => {
        loadEquipos();
    }, []);

    const loadEquipos = async () => {
        try {
            const res = await getEquipos();
            setEquipos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'imagen') {
            setForm({ ...form, imagen: e.target.files[0] });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('codigo', form.codigo);
        formData.append('descripcion', form.descripcion);
        formData.append('estado', form.estado);
        if (form.imagen) formData.append('imagen', form.imagen);

        try {
            if (editing) {
                await actualizarEquipo(editing, formData);
            } else {
                await crearEquipo(formData);
            }
            setForm(initialForm);
            setEditing(null);
            setEditingEstadoOriginal(null);
            loadEquipos();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEdit = (eq) => {
        setForm({ codigo: eq.codigo, descripcion: eq.descripcion, estado: eq.estado, imagen: null });
        setEditing(eq.id);
        setEditingEstadoOriginal(eq.estado);
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setEditingEstadoOriginal(null);
        setForm(initialForm);
    };

    const handleDelete = async (id) => {
        if (confirm('¿Eliminar equipo?')) {
            try {
                await eliminarEquipo(id);
                loadEquipos();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return {
        equipos, form, editing, editingEstadoOriginal,
        handleChange, handleSubmit, handleEdit, handleCancelEdit, handleDelete
    };
};
