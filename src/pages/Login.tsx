import React, { useState } from 'react';
import { 
  TextField, Button, Paper, Typography, Box, Container, 
  IconButton, InputAdornment, FormControlLabel, Checkbox, Link as MuiLink 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { LoginResponse } from '../types/ILoginResponse';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post<LoginResponse>('/api/Authenticate/login', credentials);
      
      const { token, userid, username } = response.data;
      
      if (rememberMe) {
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('remember');
      }

      login(token, username, userid, 'true');
      
      showNotification('¡Bienvenido de nuevo!', 'success');
      navigate('/home');
    } catch (err) {
      showNotification('Usuario o contraseña incorrectos', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Iniciar Sesión</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth 
              required 
              label="Usuario" 
              name="username" 
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth 
              required 
              label="Contraseña" 
              type={showPassword ? 'text' : 'password'}
              name="password"
              margin="normal"
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
              }
              label="Recuérdame"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ my: 2}}>
              Iniciar Sesión
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link as any} to="/register" variant="body2">
                ¿No tienes una cuenta? Regístrate
              </MuiLink>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;