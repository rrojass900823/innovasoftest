import React, { useState, useEffect } from 'react';
import {
    Typography, Button, Box, TextField, Grid, Paper,
    MenuItem, Avatar, IconButton, Container,
    Divider, CircularProgress
} from '@mui/material';
import { Save, ArrowBack, PhotoCamera } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Interes } from '../types/IInteres';
import { ClienteFormData } from '../types/IClienteFormData';

const MantenimientoCliente = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { authState } = useAuth();
    const { showNotification } = useNotification();

    const today = new Date().toISOString().split('T')[0];

    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [formData, setFormData] = useState<ClienteFormData>({
        identificacion: '',
        nombre: '',
        apellidos: '',
        sexo: '',
        fNacimiento: today,
        fAfiliacion: today,
        telefonoCelular: '',
        otroTelefono: '',
        interesFK: '',
        direccion: '',
        resenaPersonal: '',
        imagen: ''
    });

    const [intereses, setIntereses] = useState<Interes[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const initCarga = async () => {
            try {
                setLoadingData(true);
                const resIntereses = await api.get<Interes[]>('/api/Intereses/Listado');
                setIntereses(resIntereses.data);

                if (id) {
                    const resCliente = await api.get<ClienteFormData>(`/api/Cliente/Obtener/${id}`);
                    const c = resCliente.data;
                    setFormData({
                        ...c,
                        interesFK: c.interesesId || '',
                        fNacimiento: c.fNacimiento ? c.fNacimiento.split('T')[0] : today,
                        fAfiliacion: c.fAfiliacion ? c.fAfiliacion.split('T')[0] : today,
                    });
                }
            } catch (error) {
                showNotification('Error al cargar datos iniciales', 'error');
            } finally {
                setLoadingData(false);
            }
        };
        initCarga();
    }, [id, showNotification, today]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imagen: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            usuarioId: authState.usuarioId,
            id: id || undefined,
            celular: formData.telefonoCelular,
            resennaPersonal: formData.resenaPersonal,
            interesFK: formData.interesFK
        };

        try {
            if (id) {
                await api.post('/api/Cliente/Actualizar', payload);
                showNotification('Cliente actualizado con éxito', 'success');
            } else {
                await api.post('/api/Cliente/Crear', payload);
                showNotification('Cliente creado con éxito', 'success');
            }
            navigate('/clientes');
        } catch (error) {
            showNotification('Error al guardar el cliente. Verifique los campos obligatorios.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box component="form" onSubmit={handleSave}>
                <Paper sx={{ py: 2 }}>
                    <Grid container spacing={2} alignItems="center" sx={{ pb: 2, px: 2 }}>
                        <Grid item xs={12} sm={8} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={formData.imagen}
                                    sx={{ width: 80, height: 80, border: '2px solid #1976d2' }}
                                />
                                <IconButton
                                    color="primary"
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: -10,
                                        right: -10,
                                        backgroundColor: 'white',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                    }}
                                >
                                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                                    <PhotoCamera fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="h4">Mantenimiento de clientes</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="contained"
                                type="submit"
                                color='inherit'
                                startIcon={loading ? <CircularProgress color='inherit' size={18} /> : <Save />}
                                disabled={loading}
                            >
                                Guardar
                            </Button>
                            <Button
                                variant="contained"
                                color='inherit'
                                startIcon={<ArrowBack />}
                                onClick={() => navigate('/clientes')}
                                disabled={loading}
                            >
                                Regresar
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    {loadingData ?
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p:10 }}>
                            <CircularProgress />
                        </Box> : <Grid container spacing={3} sx={{ px: 2, pb: 2 }}>
                            <Grid item xs={12} sm={4}>
                                <TextField required fullWidth label="Identificación" name="identificacion" value={formData.identificacion} onChange={handleChange} inputProps={{ maxLength: 20 }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField required fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} inputProps={{ maxLength: 50 }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField required fullWidth label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} inputProps={{ maxLength: 100 }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField select required fullWidth label="Género" name="sexo" value={formData.sexo} onChange={handleChange}>
                                    <MenuItem value="M">Masculino</MenuItem>
                                    <MenuItem value="F">Femenino</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField required fullWidth label="Fecha de Nacimiento" type="date" name="fNacimiento" value={formData.fNacimiento} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField required fullWidth label="Fecha de Afiliación" type="date" name="fAfiliacion" value={formData.fAfiliacion} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth label="Teléfono Celular" name="telefonoCelular" value={formData.telefonoCelular} onChange={handleChange} inputProps={{ maxLength: 20 }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField fullWidth label="Teléfono Otro" name="otroTelefono" value={formData.otroTelefono} onChange={handleChange} inputProps={{ maxLength: 20 }} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField select required fullWidth label="Interés" name="interesFK" value={formData.interesFK} onChange={handleChange}>
                                    {intereses.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.descripcion}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={2} label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} inputProps={{ maxLength: 200 }} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth multiline rows={3} label="Reseña" name="resenaPersonal" value={formData.resenaPersonal} onChange={handleChange} inputProps={{ maxLength: 200 }} />
                            </Grid>
                        </Grid>
                    }
                </Paper>
            </Box>
        </Container>
    );
};

export default MantenimientoCliente;