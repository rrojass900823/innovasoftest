import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import NotFound from './pages/NotFound';
import MainLayout from './components/MainLayout';
import MantenimientoCliente from './pages/MantenimientoCliente';


function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <MainLayout> <Home /> </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/clientes" element={
              <ProtectedRoute>
                <MainLayout> <Clientes /> </MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/mantenimiento-cliente" element={
              <ProtectedRoute>
                <MainLayout><MantenimientoCliente /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/mantenimiento-cliente/:id" element={
              <ProtectedRoute>
                <MainLayout><MantenimientoCliente /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;