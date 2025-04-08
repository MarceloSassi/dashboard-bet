import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useBetStore } from '../store/useBetStore';
import { SportsSoccer, TrendingUp, AccountBalance } from '@mui/icons-material';

const Home: React.FC = () => {
  const { bets, getStats } = useBetStore();
  const stats = getStats();

  const activeBets = bets.filter(bet => bet.status === 'Pending').length;
  const totalProfit = stats.profit;
  const totalBalance = stats.totalWinnings;

  const cards = [
    {
      title: 'Apostas Ativas',
      value: activeBets,
      icon: <SportsSoccer sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2'
    },
    {
      title: 'Lucro Total',
      value: `R$ ${totalProfit.toFixed(2)}`,
      icon: <TrendingUp sx={{ fontSize: 40, color: totalProfit >= 0 ? 'success.main' : 'error.main' }} />,
      color: totalProfit >= 0 ? '#2e7d32' : '#d32f2f'
    },
    {
      title: 'Saldo Total',
      value: `R$ ${totalBalance.toFixed(2)}`,
      icon: <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard de Apostas
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Bem-vindo ao seu painel de gerenciamento de apostas.
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ color: card.color }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 