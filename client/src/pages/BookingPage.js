import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { getSpaceById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    const fetchSpaceDetails = async () => {
      try {
        setLoading(true);
        const response = await getSpaceById(id);
        setSpace(response.data);
        
        // Check if space is available
        if (response.data.availableDesks <= 0) {
          setIsAvailable(false);
          setError('This space is currently sold out.');
        }
        
      } catch (err) {
        console.error(err);
        setError('Failed to load space details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpaceDetails();
  }, [id]);
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async () => {
    if (!isAvailable) {
      setError('This space is currently sold out and cannot be booked.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const bookingData = {
        spaceId: space.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        price: space.price
      };
      
      await createBooking(bookingData);
      
      // Navigate to success page or bookings list
      navigate('/bookings/success', { 
        state: { 
          spaceName: space.name,
          date: format(selectedDate, 'MMMM dd, yyyy'),
          price: space.price
        } 
      });
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create booking');
      setActiveStep(0);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          component={RouterLink} 
          to={`/spaces/${id}`} 
          variant="outlined" 
          sx={{ mt: 2 }}
        >
          Back to Space Details
        </Button>
      </Container>
    );
  }
  
  if (!space) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">Space not found</Alert>
        <Button 
          component={RouterLink} 
          to="/" 
          variant="outlined" 
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }
  
  // Determine availability status
  const isLowAvailability = space.availableDesks > 0 && space.availableDesks <= 3;
  const isSoldOut = space.availableDesks === 0;
  
  const steps = ['Select Date', 'Review Booking', 'Confirm Payment'];
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Book {space.name}
        </Typography>
        
        {!isAvailable && (
          <Alert severity="error" sx={{ mb: 3 }}>
            This space is currently sold out. Please check back later or explore other spaces.
          </Alert>
        )}
        
        {isLowAvailability && isAvailable && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Only {space.availableDesks} {space.availableDesks === 1 ? 'desk' : 'desks'} left! Book soon to secure your spot.
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select a date for your booking
            </Typography>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Booking Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
                disabled={!isAvailable}
              />
            </LocalizationProvider>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isAvailable}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your booking details
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Space:</Typography>
                <Typography variant="body1">{space.name}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Location:</Typography>
                <Typography variant="body1">{space.location}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Date:</Typography>
                <Typography variant="body1">{format(selectedDate, 'MMMM dd, yyyy')}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Price:</Typography>
                <Typography variant="body1">${space.price}</Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirm and pay
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo application. No actual payment will be processed.
            </Alert>
            
            <Typography variant="body1" paragraph>
              By clicking "Complete Booking", you agree to the terms and conditions of Silvalley.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5" color="primary">${space.price}</Typography>
            </Box>
            
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button onClick={handleBack}>
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <CircularProgress size={24} sx={{ mr: 1 }} />
                              Processing...
                            </>
                          ) : (
                            'Complete Booking'
                          )}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Container>
            );
          };
          
          export default BookingPage;
          
