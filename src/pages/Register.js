import { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, Container, Link as MuiLink } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useNotification } from '../context/NotificationContext';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pass) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,20}$/;
    return re.test(pass);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      return showNotification('Por favor, ingresa un correo válido', 'warning');
    }

    if (!validatePassword(formData.password)) {
      return showNotification('La contraseña debe tener entre 8 y 20 caracteres, incluir números, una mayúscula y una minúscula', 'warning');
    }

    try {
      await api.post('/api/Authenticate/register', formData);
      showNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data) {
        const { message } = err.response.data;
        showNotification(message || 'Error en el registro', 'error');
      } else {
        showNotification('No se pudo conectar con el servidor', 'error');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Registro</Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth required label="Nombre de Usuario" margin="normal"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              fullWidth required label="Correo Electrónico" margin="normal"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth required label="Contraseña" type="password" margin="normal"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ my: 2 }}>
              REGISTRARME
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link} to="/login" variant="body2">
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