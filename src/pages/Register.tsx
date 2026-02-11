import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Container, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axiosConfig';
import { useNotification } from '../context/NotificationContext';
import { RegisterFormData } from '../types/IRegisterFormData';

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({ 
    username: '', 
    email: '', 
    password: '' 
  });
  
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pass: string): boolean => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,20}$/;
    return re.test(pass);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      return showNotification('Por favor, ingresa un correo válido', 'warning');
    }

    if (!validatePassword(formData.password)) {
      return showNotification(
        'La contraseña debe tener entre 9 y 20 caracteres e incluir números, una mayúscula y una minúscula', 
        'warning'
      );
    }

    try {
      await api.post('/api/Authenticate/register', formData);
      showNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const message = (err.response.data as { message?: string }).message;
        showNotification(message || 'Error en el registro', 'error');
      } else {
        showNotification('No se pudo conectar con el servidor', 'error');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Registro</Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth required label="Nombre de Usuario" name="username" margin="normal"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth required label="Correo Electrónico" name="email" margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth required label="Contraseña" name="password" type="password" margin="normal"
              value={formData.password}
              onChange={handleChange}
              helperText="Min. 9 caracteres, números, mayúscula y minúscula"
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
              REGISTRARME
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link as any} to="/login" variant="body2">
                ¿Ya tienes una cuenta? Iniciar
              </MuiLink>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;