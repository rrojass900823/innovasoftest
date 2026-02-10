import { useState, useEffect, useCallback } from 'react';
import {
  Typography, Button, Box, TextField, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Tooltip, CircularProgress,
  Divider
} from '@mui/material';
import {
  Add, ArrowBack, Search, Edit, Delete, Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Clientes = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { showNotification } = useNotification();

  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '', identificacion: '' });
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showClearBtn, setShowClearBtn] = useState(false);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        nombre: '',
        identificacion: '',
        usuarioId: authState.usuarioId
      };
      const response = await api.post('/api/Cliente/Listado', payload);
      const data = Array.isArray(response.data) ? response.data : [];
      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      showNotification('Error al cargar la lista de clientes', 'error');
    } finally {
      setLoading(false);
    }
  }, [authState.usuarioId, showNotification]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const busquedaNombre = filtros.nombre.toLowerCase().trim();
    const busquedaId = filtros.identificacion.toLowerCase().trim();
    if (!busquedaNombre && !busquedaId) {
      handleReset();
      return;
    }
    const resultado = clientes.filter(cliente => {
      const nombreCompleto = `${cliente.nombre} ${cliente.apellidos}`.toLowerCase();
      const coincideNombre = nombreCompleto.includes(busquedaNombre);
      const coincideId = cliente.identificacion.toLowerCase().includes(busquedaId);
      return coincideNombre && coincideId;
    });

    setClientesFiltrados(resultado);

    if (resultado.length === 0) {
      showNotification('No se encontraron coincidencias', 'info');
      handleReset();
    } else {
      setShowClearBtn(true);
    }
  };

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFiltros({ nombre: '', identificacion: '' });
    setClientesFiltrados(clientes);
    setShowClearBtn(false);
  };

  const handleDeleteClick = (id) => {
    setSelectedClientId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      //const response = await api.delete(`/api/Cliente/Eliminar/${selectedClientId}`);
      //TODO el método “delete” está desactivado, se debe programar, pero no consumirlo.
        showNotification('No se pudo eliminar el cliente', 'error');
        setOpenDelete(false);
        fetchClientes();
    } catch (error) {
      showNotification('No se pudo eliminar el cliente', 'error');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);


  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ pt: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2, px: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00152a' }}>
              Consulta de clientes
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pr: 2 }}>
            <Button variant="contained" color='inherit' startIcon={<Add />} onClick={() => navigate('/mantenimiento-cliente')}>
              Agregar
            </Button>
            <Button variant="contained" color='inherit' startIcon={<ArrowBack />} onClick={() => navigate('/home')}>
              Regresar
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre" name="nombre" value={filtros.nombre} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField fullWidth label="Identificación" name="identificacion" value={filtros.identificacion} onChange={handleInputChange} size="small" />
            </Grid>
            <Grid item xs={12} sm={1} sx={{ display: 'flex', gap: 1, justifyContent: "center" }}>
              {!showClearBtn ?
                <IconButton
                  color="default"
                  type="submit"
                  sx={{ border: "solid 1px" }}
                >
                  <Search />
                </IconButton> : <IconButton
                  color="error"
                  type='button'
                  sx={{ border: "solid 1px" }}
                  onClick={handleReset}
                >
                  <Refresh />
                </IconButton>
              }
            </Grid>
          </Grid>
        </form>
        <Divider sx={{ my: 1 }} />
        <Grid container alignItems="center" sx={{ pl: 2, pt: 2, pb: 0 }}>
        <TableContainer
          sx={{
            borderRadius: 0,
            maxHeight: 'calc(100vh - 320px)',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#00152a !important', color: 'white', fontWeight: 'bold' }}>Identificación</TableCell>
                <TableCell sx={{ backgroundColor: '#00152a !important', color: 'white', fontWeight: 'bold' }}>Nombre completo</TableCell>
                <TableCell sx={{ backgroundColor: '#00152a !important', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.identificacion}</TableCell>
                    <TableCell>{`${row.nombre} ${row.apellidos}`}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => navigate(`/mantenimiento-cliente/${row.id}`)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton color="error" onClick={() => handleDeleteClick(row.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    {loading ? <CircularProgress /> : 'No hay datos que coincidan con la búsqueda.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Grid>
      </Paper>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Está seguro que desea eliminar este cliente?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clientes;