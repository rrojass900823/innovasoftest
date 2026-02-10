import { Box, Typography, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReportProblem } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';

const NotFound = () => {
  const { authState } = useAuth();

  const ErrorContent = (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: 2 }}>
        <ReportProblem color='primary' sx={{ fontSize: 120 }} />
        <Typography variant="h1" color="primary" sx={{ fontWeight: "bold" }}>404</Typography>
      </Grid>
      <Typography variant="h3" color="gray" sx={{ mb: 3, fontWeight: "bold" }}>
        Oops... Page Not Found!
      </Typography>
      {authState.isAuthenticated ? <></> :
        <Button variant="contained" component={Link} to={authState.isAuthenticated ? null : "/login"}>
          Ir al Login
        </Button>
      }
    </Box>
  );

  if (authState.isAuthenticated) {
    return <MainLayout>{ErrorContent}</MainLayout>;
  }

  return ErrorContent;
};

export default NotFound;