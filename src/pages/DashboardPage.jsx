import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import apiService from '../api/apiService';
import { Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import Chatbot from '../components/Chatbot';
import AddFarmModal from '../components/AddFarmModal';
import AddIcon from '@mui/icons-material/Add';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null); // New state for error handling

  const fetchFarms = async () => {
    try {
      setError(null); // Clear previous errors
      const response = await apiService.get('/api/farms');
      setFarms(response.data);
      if (response.data.length > 0) {
        // Only set the default if a farm isn't already selected
        if (!selectedFarmId) {
          setSelectedFarmId(response.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch farms:', err);
      setError('Could not load your farms. Please try refreshing the page.');
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleFarmAdded = () => {
    // Refresh the farm list after a new one is added
    fetchFarms();
  };

  const handleGetRecommendation = async () => {
    if (!selectedFarmId) return;
    setIsLoading(true);
    setRecommendation(null);
    setError(null); // Clear previous errors
    try {
      const response = await apiService.get(`/api/recommendations/${selectedFarmId}`);
      const recData = response.data;
      setRecommendation(recData);
      await apiService.post('/api/recommendations/save', {
        farm_id: selectedFarmId, recommendation_text: recData,
      });
    } catch (err) {
      console.error('Failed to get recommendation:', err);
      setError('Failed to get a recommendation. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <Typography variant="h4" component="h1">{t('dashboardTitle')}</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <Button variant="outlined" onClick={logout}>{t('logoutButton')}</Button>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">{t('selectFarm')}</Typography>
            {/* This is the missing button to open the modal */}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
              Add Farm
            </Button>
          </Box>
          <FormControl fullWidth>
            <InputLabel id="farm-select-label">Farm</InputLabel>
            <Select
                labelId="farm-select-label"
                id="farm-select"
                value={selectedFarmId}
                label="Farm"
                onChange={(e) => setSelectedFarmId(e.target.value)}
            >
              {farms.length > 0 ? (
                  farms.map((farm) => <MenuItem key={farm.id} value={farm.id}>{farm.name}</MenuItem>)
              ) : (
                  <MenuItem disabled>{t('noFarmsFound')}</MenuItem>
              )}
            </Select>
          </FormControl>
          <Button
              variant="contained"
              onClick={handleGetRecommendation}
              disabled={isLoading || !selectedFarmId}
              sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : t('getAdviceButton')}
          </Button>
        </Box>

        {/* Added Array.isArray check for safety */}
        {recommendation && Array.isArray(recommendation) && (
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>{t('recommendationTitle')}</Typography>
                {recommendation.map((crop, index) => (
                    <Box key={index} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
                      <Typography variant="h6" color="primary">{crop.crop}</Typography>
                      <Typography>Yield: {crop.predicted_yield_quintal_per_hectare} quintal/hectare</Typography>
                      <Typography>Profit: ₹ {crop.estimated_profit_rs_per_hectare} /hectare</Typography>
                      <Typography>Sustainability: {crop.sustainability_score_10} / 10</Typography>
                    </Box>
                ))}
              </CardContent>
            </Card>
        )}

        <Chatbot />

        <AddFarmModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onFarmAdded={handleFarmAdded}
        />
      </Box>
  );
};

export default DashboardPage;