import { useState } from 'react';
import { 
  TextField, Button, Paper, Typography, Box, Container, 
  IconButton, InputAdornment, FormControlLabel, Checkbox, Link as MuiLink 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/Authenticate/login', credentials);
      const { token, userid, username } = response.data;
      
      if (rememberMe) {
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('remember');
      }

      login(token, username, userid, true);
      showNotification('¡Bienvenido de nuevo!', 'success');
      navigate('/home');
    } catch (err) {
      showNotification('Usuario o contraseña incorrectos', 'error');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Iniciar Sesión</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth required label="Usuario" name="username" margin="normal"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
            <TextField
              fullWidth required label="Contraseña" type={showPassword ? 'text' : 'password'}
              margin="normal"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
              label="Recuérdame"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ my: 2}}>
              Iniciar Sesión
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link} to="/register" variant="body2">
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