import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Grid,
  Alert
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const bookingDetails = location.state || {};

  if (!bookingDetails.paymentId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          No payment information found. Please return to the home page.
        </Alert>
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleOutlineIcon 
            color="success" 
            sx={{ fontSize: 80, mb: 2 }} 
          />
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your booking has been confirmed and your payment has been processed successfully.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Booking Details
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
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Payment ID:</Typography>
            <Typography variant="body1">{bookingDetails.paymentId}</Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Payment Date:</Typography>
            <Typography variant="body1">
              {new Date(bookingDetails.paymentDate).toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1">Amount Paid:</Typography>
            <Typography variant="h6" color="primary">${bookingDetails.totalPrice}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ 
          p: 2, 
          bgcolor: 'success.light', 
          borderRadius: 1, 
          color: 'success.contrastText',
          mb: 3
        }}>
          <Typography variant="body1">
            A confirmation email has been sent to your registered email address with all the details.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
      </Paper>
    </Container>
  );
};

export default PaymentSuccessPage;