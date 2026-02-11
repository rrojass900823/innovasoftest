import React, { useState, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Drawer, List,
  ListItem, ListItemIcon, ListItemText, Divider, Box, IconButton,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  Home, People, LogoutOutlined as LogoutIcon,
  Menu as MenuIcon, AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }:MainLayoutProps) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [open, setOpen] = useState<boolean>(true);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (): void => {
    setOpen(!open);
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <AccountCircle sx={{ fontSize: 96, color: '#00152a' }} />
        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold', color: '#00152a' }}>
          {authState.userName || 'Usuario'}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 'bold', color: '#00152a' }}>
        MENÚ
      </Typography>
      <Divider sx={{ my: 1 }} />
      <List sx={{ px: 1 }}>
        <ListItem
          button
          component={Link as any}
          to="/home"
          onClick={isMobile ? toggleDrawer : undefined}
          sx={{ borderRadius: 2, mb: 1, '&:hover': { backgroundColor: '#e3f2fd' } }}
        >
          <ListItemIcon><Home color="primary" /></ListItemIcon>
          <ListItemText primary="Inicio" sx={{ color: '#00152a' }} />
        </ListItem>

        <ListItem
          button
          component={Link as any}
          to="/clientes"
          onClick={isMobile ? toggleDrawer : undefined}
          sx={{ borderRadius: 2, '&:hover': { backgroundColor: '#e3f2fd' } }}
        >
          <ListItemIcon><People color="primary" /></ListItemIcon>
          <ListItemText primary="Consulta Clientes" sx={{ color: '#00152a' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#00152a',
          borderBottom: '5px solid #33c2ff',
          boxShadow: 'none'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={toggleDrawer} edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              Innovasoft S.A
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {authState.userName}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} title="Cerrar Sesión">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 1 : 3,
          mt: 8,
          width: '95%',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: 0,
          ...(!isMobile && !open && {
            marginLeft: `-${drawerWidth}px`,
          })
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;