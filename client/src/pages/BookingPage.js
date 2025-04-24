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
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { format, differenceInDays, addDays } from 'date-fns';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [numSeats, setNumSeats] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Calculate total days and price
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const totalPrice = space ? space.price * numSeats * totalDays : 0;
  
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
  
  // Validate date selection
  useEffect(() => {
    // Ensure end date is not before start date
    if (endDate < startDate) {
      setEndDate(addDays(startDate, 1));
    }
  }, [startDate, endDate]);
  
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
    
    if (numSeats > space.availableDesks) {
      setError(`Only ${space.availableDesks} desks are available. Please reduce the number of seats.`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const bookingData = {
        spaceId: space.id,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        numSeats: numSeats,
        totalPrice: totalPrice
      };
      
      const response = await createBooking(bookingData);
      
      // Navigate to payment page with booking details
      navigate('/payment', { 
        state: { 
          bookingId: response.data.id,
          spaceId: space.id,
          spaceName: space.name,
          location: space.location,
          startDate: format(startDate, 'MMMM dd, yyyy'),
          endDate: format(endDate, 'MMMM dd, yyyy'),
          numSeats: numSeats,
          totalDays: totalDays,
          price: space.price,
          totalPrice: totalPrice
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
  
  const steps = ['Select Booking Details', 'Review Booking', 'Confirm Payment'];
  
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
              Select your booking details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="From Date"
                  type="date"
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: format(new Date(), 'yyyy-MM-dd'), // Sets minimum date to today
                  }}
                  disabled={!isAvailable}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="To Date"
                  type="date"
                  value={format(endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: format(startDate, 'yyyy-MM-dd'), // Sets minimum date to start date
                  }}
                  disabled={!isAvailable}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth disabled={!isAvailable}>
                  <InputLabel id="seats-label">Number of Seats</InputLabel>
                  <Select
                    labelId="seats-label"
                    value={numSeats}
                    label="Number of Seats"
                    onChange={(e) => setNumSeats(e.target.value)}
                  >
                    {[...Array(Math.min(10, space.availableDesks)).keys()].map(i => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Seat' : 'Seats'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'primary.light', 
                  borderRadius: 1, 
                  color: 'primary.contrastText',
                  mt: 2
                }}>
                  <Typography variant="subtitle1">
                    Booking Summary:
                  </Typography>
                  <Typography variant="body2">
                    {totalDays} {totalDays === 1 ? 'day' : 'days'} × {numSeats} {numSeats === 1 ? 'seat' : 'seats'} × ${space.price}/day
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total: ${totalPrice}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
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
                <Typography variant="subtitle1">From Date:</Typography>
                <Typography variant="body1">{format(startDate, 'MMMM dd, yyyy')}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">To Date:</Typography>
                <Typography variant="body1">{format(endDate, 'MMMM dd, yyyy')}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Number of Seats:</Typography>
                <Typography variant="body1">{numSeats} {numSeats === 1 ? 'Seat' : 'Seats'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Duration:</Typography>
                <Typography variant="body1">{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1">Price Breakdown:</Typography>
                <Typography variant="body1">
                  ${space.price} per seat per day × {numSeats} {numSeats === 1 ? 'seat' : 'seats'} × {totalDays} {totalDays === 1 ? 'day' : 'days'} = ${totalPrice}
                </Typography>
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
              <Typography variant="h5" color="primary">${totalPrice}</Typography>
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
