import React from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { useBetStore } from '../store/useBetStore';
import { useBankStore } from '../store/useBankStore';
import { SportsSoccer, TrendingUp, AccountBalance, CheckCircle, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const { bets, getStats } = useBetStore();
  const { getStats: getBankStats } = useBankStore();
  const stats = getStats();
  const bankStats = getBankStats();

  const activeBets = bets.filter(bet => bet.status === 'Pending').length;
  const totalProfit = bankStats.totalProfit;
  const totalBalance = bankStats.totalBalance;

  // Obter as últimas 5 apostas concluídas (ganhas ou perdidas)
  const lastCompletedBets = bets
    .filter(bet => bet.status !== 'Pending')
    .sort((a, b) => new Date(b.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const cards = [
    {
      title: 'Apostas Ativas',
      value: activeBets,
      icon: <SportsSoccer sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1B5E20'
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
      color: '#1B5E20'
    }
  ];

  const getSportName = (sport: string) => {
    switch (sport) {
      case 'Soccer': return 'Futebol';
      case 'Basketball': return 'Basquete';
      case 'Tennis': return 'Tênis';
      case 'Volleyball': return 'Vôlei';
      case 'Other': return 'Outro';
      default: return sport;
    }
  };

  const getBetTypeName = (type: string) => {
    switch (type) {
      case 'Single': return 'Simples';
      case 'Multiple': return 'Múltipla';
      default: return type;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Painel de Controle
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

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Últimas Apostas Concluídas
          </Typography>
          {lastCompletedBets.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              Nenhuma aposta concluída ainda.
            </Typography>
          ) : (
            <List>
              {lastCompletedBets.map((bet) => (
                <React.Fragment key={bet.id}>
                  <ListItem>
                    <ListItemIcon>
                      {bet.status === 'Won' ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Cancel color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            {getSportName(bet.sport)} - {getBetTypeName(bet.betType)}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: bet.status === 'Won' ? 'success.main' : 'error.main',
                            }}
                          >
                            {bet.status === 'Won' ? '+' : '-'} R$ {bet.amount.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      secondary={format(new Date(bet.date), 'dd/MM/yyyy')}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home; 