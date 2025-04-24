import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SpaceCard = ({ space }) => {
  // Determine availability status
  const isLowAvailability = space.availableDesks > 0 && space.availableDesks <= 3;
  const isSoldOut = space.availableDesks === 0;
  
  return (
    <Card 
      elevation={2}
      sx={{ 
        height: 450, // Fixed height for all cards
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <CardMedia
        component="img"
        height="200" // Fixed height for image
        image={space.image || 'https://source.unsplash.com/random/300x200/?coworking'}
        alt={space.name}
        sx={{ 
          objectFit: 'cover',
          filter: isSoldOut ? 'grayscale(100%)' : 'none'
        }}
      />
      
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        position: 'relative'
      }}>
        {/* Availability badge */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -20, 
            right: 16,
            bgcolor: isSoldOut 
              ? 'error.main' 
              : isLowAvailability 
                ? 'warning.main' 
                : 'success.main',
            color: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        >
          {isSoldOut 
            ? 'Sold Out' 
            : `${space.availableDesks} ${space.availableDesks === 1 ? 'Desk' : 'Desks'} Left`}
        </Box>
        
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2" noWrap sx={{ maxWidth: '70%' }}>
            {space.name}
          </Typography>
          
          <Chip 
            label={`${space.price}`} 
            size="small" 
            color="primary" 
            icon={<AttachMoneyIcon />} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {space.location}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={space.rating || 4.5} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({space.reviewCount || 12})
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            height: 60, // Fixed height for description
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis'
          }}
        >
          {space.description}
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            mb: 2, 
            flexWrap: 'wrap', 
            gap: 0.5,
            height: 32, // Fixed height for amenities
            overflow: 'hidden'
          }}
        >
          {space.amenities?.wifi && (
            <Chip icon={<WifiIcon />} label="WiFi" size="small" variant="outlined" />
          )}
          {space.amenities?.kitchen && (
            <Chip icon={<LocalCafeIcon />} label="Kitchen" size="small" variant="outlined" />
          )}
          {space.amenities?.access24_7 && (
            <Chip icon={<AccessTimeIcon />} label="24/7" size="small" variant="outlined" />
          )}
        </Stack>
        
        <Box sx={{ mt: 'auto' }}>
          <Button 
            component={RouterLink} 
            to={`/spaces/${space.id}`}
            variant="contained" 
            fullWidth
            disabled={isSoldOut}
            color={isLowAvailability ? "warning" : "primary"}
          >
            {isSoldOut ? 'Sold Out' : 'View Details'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SpaceCard;
