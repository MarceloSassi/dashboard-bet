import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ActiveBets from './pages/ActiveBets';
import History from './pages/History';
import Statistics from './pages/Statistics';
import AddBet from './pages/AddBet';
import Bank from './pages/Bank';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/active-bets" element={<ActiveBets />} />
            <Route path="/history" element={<History />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/add-bet" element={<AddBet />} />
            <Route path="/bank" element={<Bank />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
