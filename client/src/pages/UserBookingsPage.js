import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserBookings, cancelBooking } from '../services/api';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';

const UserBookingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  
  useEffect(() => {
    fetchUserBookings();
    
    // Check for success message from booking creation
    if (location.state?.success) {
      setSuccessMessage('Booking created successfully!');
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      setBookings(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };
  
  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    
    try {
      setLoading(true);
      await cancelBooking(bookingToCancel.id);
      
      // Update bookings list
      setBookings(bookings.map(booking => 
        booking.id === bookingToCancel.id 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      setSuccessMessage('Booking cancelled successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to cancel booking');
    } finally {
      setLoading(false);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };
  
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setBookingToCancel(null);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };
  
  if (loading && bookings.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      
      {bookings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You don't have any bookings yet
          </Typography>
          <Typography variant="body1" paragraph>
            Start by exploring available spaces and book your first workspace!
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')}
          >
            Explore Spaces
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div">
                      {booking.space.name}
                    </Typography>
                    <Chip 
                      label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} 
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {booking.space.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Booking Type
                      </Typography>
                      <Typography variant="body1">
                        {booking.bookingType === 'desk' ? 'Hot Desk' : 
                         booking.bookingType === 'office' ? 'Private Office' : 'Meeting Room'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" align="right">
                        Total Price
                      </Typography>
                      <Typography variant="h6" color="primary" align="right">
                        ${booking.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/spaces/${booking.space.id}`)}
                  >
                    View Space
                  </Button>
                  
                  {booking.status === 'confirmed' && (
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleCancelClick(booking)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose}>No, Keep It</Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserBookingsPage;
