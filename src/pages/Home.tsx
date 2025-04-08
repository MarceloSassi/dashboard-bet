import React from 'react';
import { Box, Typography } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard de Apostas
      </Typography>
      <Typography variant="body1">
        Bem-vindo ao seu painel de gerenciamento de apostas.
      </Typography>
    </Box>
  );
};

export default Home; 