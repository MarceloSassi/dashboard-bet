import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  MoneyOff as MoneyOffIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { useBankStore } from '../store/useBankStore';
import { Transaction, TransactionType } from '../types/bank';

const Bank: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<TransactionType>('Deposit');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(new Date());
  const [description, setDescription] = useState('');

  const { transactions, addTransaction, deleteTransaction, getStats } = useBankStore();
  const stats = getStats();

  const handleAddTransaction = () => {
    if (amount && date) {
      addTransaction({
        type: selectedType,
        amount: parseFloat(amount),
        date,
        description,
      });
      setOpenDialog(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedType('Deposit');
    setAmount('');
    setDate(new Date());
    setDescription('');
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    return type === 'Deposit' ? 'Depósito' : 'Saque';
  };

  const cards = [
    {
      title: 'Saldo Total',
      value: `R$ ${stats.totalBalance.toFixed(2)}`,
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1B5E20'
    },
    {
      title: 'Lucro Total',
      value: `R$ ${stats.totalProfit.toFixed(2)}`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: stats.totalProfit >= 0 ? 'success.main' : 'error.main' }} />,
      color: stats.totalProfit >= 0 ? '#2e7d32' : '#d32f2f'
    },
    {
      title: 'Total Depositado',
      value: `R$ ${stats.totalDeposits.toFixed(2)}`,
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1B5E20'
    },
    {
      title: 'Total Sacado',
      value: `R$ ${stats.totalWithdrawals.toFixed(2)}`,
      icon: <MoneyOffIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      color: '#d32f2f'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Banco
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Nova Transação
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
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

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Histórico de Transações
          </Typography>
          <List>
            {transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ mr: 2 }}>
                            {getTransactionTypeLabel(transaction.type)}
                          </Typography>
                          {transaction.description && (
                            <Typography variant="body2" color="text.secondary">
                              {transaction.description}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={format(new Date(transaction.date), 'dd/MM/yyyy')}
                    />
                    <ListItemSecondaryAction>
                      <Typography
                        variant="body1"
                        sx={{
                          color: transaction.type === 'Deposit' ? 'success.main' : 'error.main',
                          mr: 2,
                        }}
                      >
                        {transaction.type === 'Deposit' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                      </Typography>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nova Transação</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              select
              label="Tipo"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as TransactionType)}
              fullWidth
            >
              <MenuItem value="Deposit">Depósito</MenuItem>
              <MenuItem value="Withdrawal">Saque</MenuItem>
            </TextField>
            <TextField
              label="Valor"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: 'R$',
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddTransaction} variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bank; 