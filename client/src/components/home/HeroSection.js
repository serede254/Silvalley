import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper
} from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'primary.main',
        color: 'white',
        pt: 8,
        pb: 6,
        overflow: 'hidden'
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h2"
              fontWeight="bold"
              gutterBottom
            >
              Find Your Perfect Workspace
            </Typography>
            
            <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              Book flexible coworking spaces, meeting rooms, and private offices in prime locations.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ fontWeight: 'bold' }}
              >
                Get Started
              </Button>
              
              <Button
                component={RouterLink}
                to="/#spaces"
                variant="outlined"
                size="large"
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Browse Spaces
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                overflow: 'hidden',
                borderRadius: 2,
                transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Coworking space"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">
              50+
            </Typography>
            <Typography variant="body1">
              Locations
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">
              1,000+
            </Typography>
            <Typography variant="body1">
              Workspaces
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">
              10,000+
            </Typography>
            <Typography variant="body1">
              Happy Members
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
