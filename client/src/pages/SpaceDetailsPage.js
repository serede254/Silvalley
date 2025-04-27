import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { getSpaceById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ImageList,
  ImageListItem
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PrintIcon from '@mui/icons-material/Print';
import SecurityIcon from '@mui/icons-material/Security';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';

// images for the space details page
import image1 from  '../images/additional 1.jpg';
import image2 from  '../images/additional 2.jpg';
import image3 from  '../images/additional 3.jpg';
import image4 from '../images/additional 4.jpg';
const SpaceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchSpaceDetails();
  }, [id]);
  
  const fetchSpaceDetails = async () => {
    try {
      setLoading(true);
      const response = await getSpaceById(id);
      setSpace(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load space details');
    } finally {
      setLoading(false);
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
          to="/" 
          variant="outlined" 
          sx={{ mt: 2 }}
        >
          Back to Home
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
  
  // Mock additional images for the space
  const additionalImages = [
    image1,
    image2,
    image3,
    image4
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={space.image || 'https://source.unsplash.com/random/800x400/?coworking'}
              alt={space.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 1,
                filter: isSoldOut ? 'grayscale(100%)' : 'none'
              }}
            />
            
            {/* Availability badge */}
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                left: 16,
                bgcolor: isSoldOut 
                  ? 'error.main' 
                  : isLowAvailability 
                    ? 'warning.main' 
                    : 'success.main',
                color: 'white',
                borderRadius: 1,
                px: 2,
                py: 0.75,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                zIndex: 1
              }}
            >
              {isSoldOut 
                ? 'Sold Out' 
                : `${space.availableDesks} ${space.availableDesks === 1 ? 'Desk' : 'Desks'} Available`}
            </Box>
            
            {isAdmin && (
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/admin/spaces/${space.id}/edit`)}
                >
                  Edit Space
                </Button>
              </Box>
            )}
          </Box>
          
          <ImageList cols={4} gap={8} sx={{ mt: 2 }}>
            {additionalImages.map((img, index) => (
              <ImageListItem key={index}>
                <img
                  src={img}
                  alt={`Space view ${index + 1}`}
                  loading="lazy"
                  style={{ borderRadius: 4 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {space.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body1" color="text.secondary">
                {space.location}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DesktopWindowsIcon 
                color={isSoldOut ? "error" : isLowAvailability ? "warning" : "primary"} 
                sx={{ mr: 1 }} 
              />
              <Typography 
                variant="body1" 
                color={isSoldOut ? "error.main" : isLowAvailability ? "warning.main" : "text.secondary"}
                fontWeight={isLowAvailability ? "bold" : "regular"}
              >
                {isSoldOut 
                  ? 'Currently sold out' 
                  : `${space.availableDesks} ${space.availableDesks === 1 ? 'desk' : 'desks'} available`}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating value={space.rating || 4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({space.reviewCount || 12} reviews)
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              {space.description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h5" gutterBottom>
              Amenities
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {space.amenities?.wifi && (
                <Grid item xs={6} sm={4} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WifiIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">High-Speed WiFi</Typography>
                  </Box>
                </Grid>
              )}
              

                          {space.amenities?.kitchen && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocalCafeIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body1">Kitchen</Typography>
                              </Box>
                            </Grid>
                          )}
              
                          {space.amenities?.access24_7 && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body1">24/7 Access</Typography>
                              </Box>
                            </Grid>
                          )}
              
                          {space.amenities?.meetingRooms && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MeetingRoomIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body1">Meeting Rooms</Typography>
                              </Box>
                            </Grid>
                          )}
              
                          {space.amenities?.airConditioning && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AcUnitIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body1">Air Conditioning</Typography>
                              </Box>
                            </Grid>
                          )}
              
                          {space.amenities?.printing && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PrintIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body1">Printing</Typography>
                              </Box>
                            </Grid>
                          )}
              
                          {space.amenities?.security && (
                            <Grid item xs={6} sm={4} md={3}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body1">Security</Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Grid>
        
                    <Grid item xs={12} md={4}>
                      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 100 }}>
                        <Typography variant="h5" gutterBottom>
                          Book This Space
                        </Typography>
            
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AttachMoneyIcon color="primary" />
                          <Typography variant="h4" component="span" sx={{ ml: 1, fontWeight: 'bold' }}>
                            ${space.price}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                            / day
                          </Typography>
                        </Box>
            
                        {/* Availability status in booking card */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 2,
                            p: 1,
                            borderRadius: 1,
                            bgcolor: isSoldOut 
                              ? 'error.light' 
                              : isLowAvailability 
                                ? 'warning.light' 
                                : 'success.light',
                          }}
                        >
                          <DesktopWindowsIcon 
                            color={isSoldOut ? "error" : isLowAvailability ? "warning" : "success"} 
                            sx={{ mr: 1 }} 
                          />
                          <Typography 
                            variant="body2" 
                            color={isSoldOut ? "error.dark" : isLowAvailability ? "warning.dark" : "success.dark"}
                            fontWeight="medium"
                          >
                            {isSoldOut 
                              ? 'Currently sold out' 
                              : isLowAvailability
                                ? `Only ${space.availableDesks} ${space.availableDesks === 1 ? 'desk' : 'desks'} left!`
                                : `${space.availableDesks} ${space.availableDesks === 1 ? 'desk' : 'desks'} available`}
                          </Typography>
                        </Box>
            
                        <Divider sx={{ my: 2 }} />
            
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <EventAvailableIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Instant Booking" 
                              secondary="Confirm your space immediately" 
                            />
                          </ListItem>
              
                          <ListItem>
                            <ListItemIcon>
                              <AccessTimeIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Flexible Hours" 
                              secondary="Book by the day, week, or month" 
                            />
                          </ListItem>
                        </List>
            
                        <Button
                          variant="contained"
                          color={isSoldOut ? "error" : isLowAvailability ? "warning" : "primary"}
                          size="large"
                          fullWidth
                          sx={{ mt: 2 }}
                          disabled={isSoldOut}
                          onClick={() => {
                            if (isAuthenticated) {
                              navigate(`/spaces/${space.id}/book`)
                            } else {
                              navigate('/login', { state: { from: { pathname: `/spaces/${space.id}/book` } } })
                            }
                          }}
                        >
                          {isSoldOut ? 'Sold Out' : 'Book Now'}
                        </Button>
            
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{ mt: 2 }}
                          component={RouterLink}
                          to="/"
                        >
                          Back to Spaces
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                </Container>
              )
}

export default SpaceDetailsPage