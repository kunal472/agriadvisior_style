import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiService from '../api/apiService';
import { Container, Typography, Card, CardContent, CircularProgress, Box, Alert } from '@mui/material';
import { format } from 'date-fns';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const response = await apiService.get(`/api/recommendations/history/${user.id}`);
          setHistory(response.data);
        } catch (error) {
          console.error("Failed to fetch history:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
        Recommendation History
      </Typography>
      {history.length === 0 ? (
        <Alert severity="info">You have no saved recommendations.</Alert>
      ) : (
        history.map((item) => {
          // The backend stores the recommendation as a JSON string, so we parse it.
          const recommendationData = JSON.parse(item.recommendation_text);
          return (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(item.created_at), 'PPP p')}
                </Typography>
                {/* Note: Requires backend to provide farm name in the response */}
                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                  Farm: {item.farm ? item.farm.name : `Farm ID ${item.farm_id}`}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {recommendationData.map((crop, index) => (
                     <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" color="primary">{crop.crop}</Typography>
                        <Typography variant="body2">Predicted Yield: {crop.predicted_yield_quintal_per_hectare} quintal/hectare</Typography>
                     </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default HistoryPage;