import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 120px)'
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          color: '#00152a',
          textAlign: 'center'
        }}
      >
        ¡Bienvenido!
      </Typography>
    </Box>
  );
};

export default Home;