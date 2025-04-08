import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { useBetStore } from '../store/useBetStore';
import { format } from 'date-fns';
import { Bet, Sport } from '../types/bet';

const Statistics: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [stats, setStats] = useState({
    totalBets: 0,
    totalWon: 0,
    totalLost: 0,
    totalAmount: 0,
    totalWinnings: 0,
    winRate: 0,
    profit: 0,
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');

  useEffect(() => {
    const loadData = () => {
      const allBets = useBetStore.getState().bets;
      const filteredBets = allBets.filter((bet) => {
        const dateMatch =
          (!startDate || bet.date >= startDate) &&
          (!endDate || bet.date <= endDate);
        const sportMatch = selectedSport === 'All' || bet.sport === selectedSport;
        return dateMatch && sportMatch;
      });
      
      setBets(filteredBets);
      const currentStats = useBetStore.getState().getStats(filteredBets);
      setStats(currentStats);
    };

    loadData();
    const unsubscribe = useBetStore.subscribe(loadData);

    return () => {
      unsubscribe();
    };
  }, [startDate, endDate, selectedSport]);

  const handleSportChange = (event: SelectChangeEvent) => {
    setSelectedSport(event.target.value as Sport | 'All');
  };

  // Prepare data for profit over time chart
  const profitOverTime = bets.reduce((acc, bet) => {
    const date = format(bet.date, 'yyyy-MM-dd');
    const existingEntry = acc.find((entry) => entry.x === date);
    const profit = bet.status === 'Won' ? bet.amount * bet.odd - bet.amount : -bet.amount;

    if (existingEntry) {
      existingEntry.y += profit;
    } else {
      acc.push({ x: date, y: profit });
    }
    return acc;
  }, [] as { x: string; y: number }[]);

  // Sort by date
  profitOverTime.sort((a, b) => a.x.localeCompare(b.x));

  // Calculate cumulative profit
  let cumulativeProfit = 0;
  const cumulativeProfitData = profitOverTime.map((point) => {
    cumulativeProfit += point.y;
    return { ...point, y: cumulativeProfit };
  });

  // Prepare data for win/loss pie chart
  const winLossData = [
    {
      id: 'Won',
      label: 'Ganhou',
      value: stats.totalWon,
      color: '#4caf50',
    },
    {
      id: 'Lost',
      label: 'Perdeu',
      value: stats.totalLost,
      color: '#f44336',
    },
  ];

  // Prepare data for sport distribution pie chart
  const sportDistribution = bets.reduce((acc, bet) => {
    const existingSport = acc.find((entry) => entry.id === bet.sport);
    if (existingSport) {
      existingSport.value += 1;
    } else {
      acc.push({ id: bet.sport, label: bet.sport, value: 1 });
    }
    return acc;
  }, [] as { id: string; label: string; value: number }[]);

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Estatísticas
        </Typography>
        <Typography variant="body1" gutterBottom>
          Análise e estatísticas das apostas.
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap',
            gap: 2,
            '& > *': {
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 8px)' }
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
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Lucro Total
              </Typography>
              <Typography variant="h4" color={stats.profit >= 0 ? 'success.main' : 'error.main'}>
                R$ {stats.profit.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Taxa de Vitória
              </Typography>
              <Typography variant="h4">
                {stats.winRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Apostas
              </Typography>
              <Typography variant="h4">
                {stats.totalBets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Apostado
              </Typography>
              <Typography variant="h4">
                R$ {stats.totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lucro ao Longo do Tempo
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveLine
                  data={[
                    {
                      id: 'Lucro',
                      data: cumulativeProfitData,
                    },
                  ]}
                  margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: (value) => `R$ ${value.toFixed(2)}`,
                  }}
                  pointSize={6}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  enableSlices="x"
                  enableGridX={false}
                  enableGridY={true}
                  enablePoints={false}
                  enableArea={true}
                  areaOpacity={0.15}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição de Vitórias/Derrotas
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsivePie
                  data={winLossData}
                  margin={{ top: 10, right: 20, bottom: 50, left: 20 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateY: 50,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#999',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle',
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribuição por Esporte
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsivePie
                  data={sportDistribution}
                  margin={{ top: 10, right: 20, bottom: 50, left: 20 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateY: 50,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#999',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle',
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics; 