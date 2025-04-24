import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { processStripePayment } from '../services/api';
import { useAuth } from '../context/AuthContext';
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
  Stepper,
  Step,
  StepLabel,
  TextField
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

// The inner payment form component that uses Stripe hooks
const PaymentForm = ({ bookingDetails, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setIsProcessing(true);
    setCardError('');
    
    try {
      // Create a payment intent on your server
      const { clientSecret } = await processStripePayment({
        amount: bookingDetails.totalPrice * 100, // Stripe requires amount in cents
        currency: 'usd',
        booking_id: bookingDetails.bookingId,
        customer_email: billingDetails.email
      });
      
      // Confirm the payment with Stripe.js
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails
        }
      });
      
      if (error) {
        setCardError(error.message);
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setCardError('An error occurred while processing your payment. Please try again.');
      onPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Full Name"
            name="name"
            value={billingDetails.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={billingDetails.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address.line1"
            value={billingDetails.address.line1}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            label="City"
            name="address.city"
            value={billingDetails.address.city}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            label="State"
            name="address.state"
            value={billingDetails.address.state}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            label="Postal Code"
            name="address.postal_code"
            value={billingDetails.address.postal_code}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Card Details
          </Typography>
          <Box sx={{ border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </Box>
          {cardError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {cardError}
            </Typography>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.light', 
            borderRadius: 1, 
            color: 'primary.contrastText',
            mt: 2
          }}>
            <Typography variant="h6">
              Total Amount: ${bookingDetails.totalPrice}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isProcessing || !stripe}
            sx={{ mt: 2 }}
          >
            {isProcessing ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

// Main payment page component
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get booking details from location state
  const bookingDetails = location.state || {};
  
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  
  // Validate if we have booking details
  useEffect(() => {
    if (!bookingDetails.totalPrice) {
      setError('No booking details found. Please start a new booking.');
    }
  }, [bookingDetails]);
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentSuccess(true);
    setPaymentId(paymentIntent.id);
    
    // Navigate to success page after a short delay
    setTimeout(() => {
      navigate('/payment/success', { 
        state: { 
          ...bookingDetails,
          paymentId: paymentIntent.id,
          paymentDate: new Date().toISOString()
        } 
      });
    }, 1500);
  };
  
  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };
  
  if (error && !bookingDetails.totalPrice) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
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
  
  const steps = ['Review Booking', 'Payment Details', 'Confirmation'];
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Complete Payment
        </Typography>
        
        {paymentSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Payment processed successfully! Redirecting to confirmation page...
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
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
              Review Booking Details
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Space:</Typography>
                <Typography variant="body1">{bookingDetails.spaceName}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Location:</Typography>
                <Typography variant="body1">{bookingDetails.location}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">From Date:</Typography>
                <Typography variant="body1">{bookingDetails.startDate}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">To Date:</Typography>
                <Typography variant="body1">{bookingDetails.endDate}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Number of Seats:</Typography>
                <Typography variant="body1">
                  {bookingDetails.numSeats} {bookingDetails.numSeats === 1 ? 'Seat' : 'Seats'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Duration:</Typography>
                <Typography variant="body1">
                  {bookingDetails.totalDays} {bookingDetails.totalDays === 1 ? 'Day' : 'Days'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1">Price Breakdown:</Typography>
                <Typography variant="body1">
                  ${bookingDetails.price} per seat per day × {bookingDetails.numSeats} {bookingDetails.numSeats === 1 ? 'seat' : 'seats'} × {bookingDetails.totalDays} {bookingDetails.totalDays === 1 ? 'day' : 'days'} = ${bookingDetails.totalPrice}
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                component={RouterLink}
                to={`/spaces/${bookingDetails.spaceId}/book`}
              >
                Back to Booking
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Proceed to Payment
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            
            <Elements stripe={stripePromise}>
              <PaymentForm 
                bookingDetails={bookingDetails}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </Elements>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
              <Button onClick={handleBack}>
                Back to Review
              </Button>
            </Box>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Confirmation
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              Your payment has been processed successfully!
            </Alert>
            
            <Typography variant="body1" paragraph>
              Payment ID: {paymentId}
            </Typography>
            
            <Typography variant="body1" paragraph>
              A confirmation email has been sent to your email address. You can also view your booking details in your account dashboard.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                component={RouterLink}
                to="/bookings"
                variant="outlined"
              >
                View My Bookings
              </Button>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentPage;