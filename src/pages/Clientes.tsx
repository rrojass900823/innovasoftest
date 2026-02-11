import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Cliente } from '../types/ICliente';

const Clientes = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { showNotification } = useNotification();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<number | string | null>(null);
  const [showClearBtn, setShowClearBtn] = useState<boolean>(false);
  const nombreRef = useRef<HTMLInputElement>(null);
  const identificacionRef = useRef<HTMLInputElement>(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        nombre: '',
        identificacion: '',
        usuarioId: authState.usuarioId
      };
      const response = await api.post<Cliente[]>('/api/Cliente/Listado', payload);
      const data = Array.isArray(response.data) ? response.data : [];
      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      showNotification('Error al cargar la lista de clientes', 'error');
    } finally {
      setLoading(false);
    }
  }, [authState.usuarioId, showNotification]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const busquedaNombre = nombreRef.current?.value.toLowerCase().trim() || '';
    const busquedaId = identificacionRef.current?.value.toLowerCase().trim() || '';
    
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

const handleReset = () => {
    if (nombreRef.current) nombreRef.current.value = '';
    if (identificacionRef.current) identificacionRef.current.value = '';
    setClientesFiltrados(clientes);
    setShowClearBtn(false);
  };

  const handleDeleteClick = (id: number | string) => {
    setSelectedClientId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      // TODO: Implementar eliminación real cuando el backend esté listo
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
              <TextField 
                fullWidth 
                label="Nombre" 
                name="nombre" 
                inputRef={nombreRef}
                size="small" 
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField 
                fullWidth 
                label="Identificación" 
                name="identificacion" 
                inputRef={identificacionRef}
                size="small" 
              />
            </Grid>
            <Grid item xs={12} sm={1} sx={{ display: 'flex', gap: 1, justifyContent: "center" }}>
              {!showClearBtn ? (
                <IconButton color="default" type="submit" sx={{ border: "solid 1px" }}>
                  <Search />
                </IconButton>
              ) : (
                <IconButton color="error" type='button' sx={{ border: "solid 1px" }} onClick={handleReset}>
                  <Refresh />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </form>

        <Divider sx={{ my: 1 }} />

        <TableContainer sx={{ maxHeight: 'calc(100vh - 320px)' }}>
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