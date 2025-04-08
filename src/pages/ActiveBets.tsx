import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useBetStore } from '../store/useBetStore';
import { format } from 'date-fns';
import { Bet, BetStatus } from '../types/bet';

const ActiveBets: React.FC = () => {
  const [selectedBet, setSelectedBet] = React.useState<{
    id: string;
    status: BetStatus;
  } | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);

  const updateBetStatus = useBetStore((state) => state.updateBetStatus);
  const deleteBet = useBetStore((state) => state.deleteBet);

  const loadData = () => {
    const bets = useBetStore.getState().getBetsByStatus('Pending');
    setActiveBets(bets);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = useBetStore.subscribe(loadData);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStatusChange = (id: string, status: BetStatus) => {
    setSelectedBet({ id, status });
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (selectedBet) {
      updateBetStatus(selectedBet.id, selectedBet.status);
      setOpenDialog(false);
      setSelectedBet(null);
      setActiveBets(activeBets.filter(bet => bet.id !== selectedBet.id));
    }
  };

  const handleDelete = (id: string) => {
    deleteBet(id);
    setActiveBets(activeBets.filter(bet => bet.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Apostas Ativas
      </Typography>
      <Typography variant="body1" gutterBottom>
        Lista de apostas em andamento.
      </Typography>
      {activeBets.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Nenhuma aposta ativa no momento.
        </Typography>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 3,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' }
          }
        }}>
          {activeBets.map((bet) => (
            <Card key={bet.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {bet.sport}
                  </Typography>
                  <Chip
                    label={bet.betType}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  Data: {format(bet.date, 'dd/MM/yyyy')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Valor: R$ {bet.amount.toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Odd: {bet.odd.toFixed(2)}
                </Typography>
                {bet.description && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {bet.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(bet.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => handleStatusChange(bet.id, 'Won')}
                    size="small"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleStatusChange(bet.id, 'Lost')}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Confirmar {selectedBet?.status === 'Won' ? 'Vitória' : 'Derrota'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja marcar esta aposta como {selectedBet?.status === 'Won' ? 'ganha' : 'perdida'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActiveBets; 