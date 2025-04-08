import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { useBetStore } from '../store/useBetStore';
import { useBankStore } from '../store/useBankStore';

const Settings: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { clearBets } = useBetStore();
  const { clearTransactions } = useBankStore();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClearData = () => {
    clearBets();
    clearTransactions();
    setOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configurações
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Gerenciamento de Dados
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleOpen}
          sx={{ mt: 2 }}
        >
          Limpar Todos os Dados
        </Button>
      </Box>

      {showSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Todos os dados foram limpos com sucesso!
        </Alert>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmar Limpeza de Dados</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita e irá:
          </Typography>
          <ul>
            <li>Remover todas as apostas</li>
            <li>Remover todas as transações bancárias</li>
            <li>Zerar todas as estatísticas</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClearData} color="error" variant="contained">
            Limpar Dados
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 