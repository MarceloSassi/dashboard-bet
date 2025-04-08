import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Container,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useBetStore } from '../store/useBetStore';
import { Bet, Sport, BetType, BetStatus } from '../types/bet';

const AddBet: React.FC = () => {
  const [formData, setFormData] = useState({
    sport: '' as Sport,
    betType: '' as BetType,
    amount: '',
    odd: '',
    date: new Date(),
    description: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        date,
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const newBet: Omit<Bet, 'id'> = {
      sport: formData.sport,
      betType: formData.betType,
      amount: parseFloat(formData.amount),
      odd: parseFloat(formData.odd),
      date: formData.date,
      description: formData.description,
      status: 'Pending' as BetStatus,
    };

    useBetStore.getState().addBet(newBet);

    // Reset form
    setFormData({
      sport: '' as Sport,
      betType: '' as BetType,
      amount: '',
      odd: '',
      date: new Date(),
      description: '',
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nova Aposta
        </Typography>
        <Typography variant="body1" gutterBottom>
          Adicione uma nova aposta ao seu histórico.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Esporte"
                  value={formData.sport}
                  onChange={handleChange('sport')}
                  required
                >
                  <MenuItem value="Soccer">Futebol</MenuItem>
                  <MenuItem value="Basketball">Basquete</MenuItem>
                  <MenuItem value="Tennis">Tênis</MenuItem>
                  <MenuItem value="Volleyball">Vôlei</MenuItem>
                  <MenuItem value="Other">Outros</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Tipo de Aposta"
                  value={formData.betType}
                  onChange={handleChange('betType')}
                  required
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Multiple">Multiple</MenuItem>
                  <MenuItem value="System">System</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valor Apostado (R$)"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange('amount')}
                  required
                  inputProps={{ min: "0.01", step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Odd"
                  type="number"
                  value={formData.odd}
                  onChange={handleChange('odd')}
                  required
                  inputProps={{ min: "1.01", step: "0.01" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <DatePicker
                    label="Data da Aposta"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição (opcional)"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange('description')}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Adicionar Aposta
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddBet; 