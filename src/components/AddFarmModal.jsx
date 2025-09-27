import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import apiService from '../api/apiService';

const AddFarmModal = ({ open, onClose, onFarmAdded }) => {
  const [farmName, setFarmName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(4));
        setLongitude(position.coords.longitude.toFixed(4));
        setIsLocating(false);
      },
      () => {
        alert('Unable to retrieve your location.');
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!farmName || !latitude || !longitude) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      const newFarmData = {
        name: farmName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };
      await apiService.post('/api/farms', newFarmData);
      onFarmAdded(); // Notify parent to refresh the farm list
      handleClose();
    } catch (error) {
      console.error('Failed to add farm:', error);
      alert('Error adding farm. Please try again.');
    }
  };

  const handleClose = () => {
    // Reset form fields on close
    setFarmName('');
    setLatitude('');
    setLongitude('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a New Farm</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Farm Name"
          type="text"
          fullWidth
          variant="standard"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="latitude"
          label="Latitude"
          type="number"
          fullWidth
          variant="standard"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <TextField
          margin="dense"
          id="longitude"
          label="Longitude"
          type="number"
          fullWidth
          variant="standard"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <Button
          onClick={handleGetLocation}
          startIcon={<AddLocationAltIcon />}
          disabled={isLocating}
          sx={{ mt: 2 }}
        >
          {isLocating ? 'Getting Location...' : 'Get My Location'}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add Farm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFarmModal;