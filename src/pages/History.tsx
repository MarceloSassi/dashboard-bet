import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useBetStore } from '../store/useBetStore';
import { format } from 'date-fns';
import { Bet, BetStatus, Sport } from '../types/bet';

const History: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<BetStatus | 'All'>('All');

  const allBets = useBetStore((state) => state.bets);
  const completedBets = allBets.filter((bet) => bet.status !== 'Pending');

  const handleSportChange = (event: SelectChangeEvent) => {
    setSelectedSport(event.target.value as Sport | 'All');
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSelectedStatus(event.target.value as BetStatus | 'All');
  };

  const filteredBets = completedBets.filter((bet) => {
    const dateMatch =
      (!startDate || bet.date >= startDate) &&
      (!endDate || bet.date <= endDate);
    const sportMatch = selectedSport === 'All' || bet.sport === selectedSport;
    const statusMatch = selectedStatus === 'All' || bet.status === selectedStatus;
    return dateMatch && sportMatch && statusMatch;
  });

  const getStatusColor = (status: BetStatus) => {
    switch (status) {
      case 'Won':
        return 'success';
      case 'Lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSportLabel = (sport: Sport) => {
    switch (sport) {
      case 'Soccer':
        return 'Futebol';
      case 'Basketball':
        return 'Basquete';
      case 'Tennis':
        return 'Tênis';
      case 'Volleyball':
        return 'Vôlei';
      case 'Other':
        return 'Outro';
      default:
        return sport;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Histórico de Apostas
      </Typography>
      <Typography variant="body1" gutterBottom>
        Histórico completo de todas as apostas.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            gap: 2,
            '& > *': {
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 8px)' }
            }
          }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Data Inicial"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DatePicker
                label="Data Final"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Esporte</InputLabel>
              <Select
                value={selectedSport}
                label="Esporte"
                onChange={handleSportChange}
              >
                <MenuItem value="All">Todos os Esportes</MenuItem>
                <MenuItem value="Soccer">Futebol</MenuItem>
                <MenuItem value="Basketball">Basquete</MenuItem>
                <MenuItem value="Tennis">Tênis</MenuItem>
                <MenuItem value="Volleyball">Vôlei</MenuItem>
                <MenuItem value="Other">Outro</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="All">Todos</MenuItem>
                <MenuItem value="Won">Ganhou</MenuItem>
                <MenuItem value="Lost">Perdeu</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
        <List>
          {filteredBets.map((bet, index) => (
            <React.Fragment key={bet.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" component="span">
                        {bet.description}
                      </Typography>
                      <Chip
                        label={bet.status === 'Won' ? 'Ganhou' : 'Perdeu'}
                        color={getStatusColor(bet.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block' }}
                      >
                        {format(bet.date, 'dd/MM/yyyy')} - {getSportLabel(bet.sport)}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block' }}
                      >
                        Valor: R$ {bet.amount.toFixed(2)} | Odd: {bet.odd}
                      </Typography>
                      {bet.status === 'Won' && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="success.main"
                          sx={{ display: 'block' }}
                        >
                          Ganho: R$ {(bet.amount * bet.odd - bet.amount).toFixed(2)}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < filteredBets.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default History; 