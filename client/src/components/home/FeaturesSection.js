import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Avatar
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WifiIcon from '@mui/icons-material/Wifi';

const features = [
  {
    icon: <WorkOutlineIcon />,
    title: 'Flexible Workspaces',
    description: 'Choose from hot desks, dedicated desks, or private offices to suit your working style and budget.'
  },
  {
    icon: <MeetingRoomIcon />,
    title: 'Meeting Rooms',
    description: 'Book fully-equipped meeting rooms for client presentations, team meetings, or workshops.'
  },
  {
    icon: <EventAvailableIcon />,
    title: 'Easy Booking',
    description: 'Book spaces by the day, week, or month with our simple online booking system.'
  },
  {
    icon: <WifiIcon />,
    title: 'Premium Amenities',
    description: 'Enjoy high-speed WiFi, kitchen facilities, printing services, and 24/7 access at select locations.'
  }
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Why Choose CoworkingHub
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph align="center" sx={{ mb: 6 }}>
        We provide everything you need for a productive workday
      </Typography>
      
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  mb: 2
                }}
              >
                {feature.icon}
              </Avatar>
              
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
