import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getSpaces } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const HomePage = () => {
  const { isAdmin } = useAuth();
  
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [amenityFilters, setAmenityFilters] = useState({
    wifi: false,
    kitchen: false,
    meetingRooms: false,
    access24_7: false
  });
  
  useEffect(() => {
    fetchSpaces();
  }, []);
  
  useEffect(() => {
    filterSpaces();
  }, [spaces, searchTerm, locationFilter, priceRange, amenityFilters]);
  
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await getSpaces();
      setSpaces(response.data);
      setFilteredSpaces(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load spaces');
    } finally {
      setLoading(false);
    }
  };
  
  const filterSpaces = () => {
    let results = [...spaces];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(space => 
        space.name.toLowerCase().includes(term) //|| 
        //space.description.toLowerCase().includes(term)
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      results = results.filter(space => 
        space.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Apply price range filter
    results = results.filter(space => 
      space.price >= priceRange[0] && space.price <= priceRange[1]
    );
    
    // Apply amenity filters
    const activeAmenityFilters = Object.entries(amenityFilters)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);
    
    if (activeAmenityFilters.length > 0) {
      results = results.filter(space => 
        activeAmenityFilters.every(amenity => space.amenities && space.amenities.includes(amenity))
      );
    }
    
    setFilteredSpaces(results);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };
  
  const handlePriceRangeChange = (_, newValue) => {
    setPriceRange(newValue);
  };
  
  const handleAmenityChange = (amenity) => {
    setAmenityFilters({
      ...amenityFilters,
      [amenity]: !amenityFilters[amenity]
    });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setPriceRange([0, 500]);
    setAmenityFilters({
      wifi: false,
      kitchen: false,
      meetingRooms: false,
      access24_7: false
    });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  if (loading && spaces.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Your Perfect Workspace
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse our selection of coworking spaces and find the perfect spot for your next workday.
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search spaces..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={toggleFilters}
                sx={{ mr: 1 }}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              
              {isAdmin && (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/admin/spaces/new"
                >
                  Add New Space
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {showFilters && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton size="small" onClick={clearFilters}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={handleLocationChange}
                  label="Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="New York">New York</MenuItem>
                  <MenuItem value="San Francisco">San Francisco</MenuItem>
                  <MenuItem value="Austin">Austin</MenuItem>
                  <MenuItem value="Seattle">Seattle</MenuItem>
                  <MenuItem value="Boston">Boston</MenuItem>
                  <MenuItem value="Chicago">Chicago</MenuItem>
                  <MenuItem value="Nashville">Nashville</MenuItem>
                  <MenuItem value="Miami">Miami</MenuItem>
                  <MenuItem value="Denver">Denver</MenuItem>
                  <MenuItem value="Phoenix">Phoenix</MenuItem>
                  <MenuItem value="Baltimore">Baltimore</MenuItem>
                  
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography gutterBottom>Price Range ($/day)</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={500}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">${priceRange[0]}</Typography>
                  <Typography variant="body2">${priceRange[1]}</Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography gutterBottom>Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="WiFi"
                  clickable
                  color={amenityFilters.wifi ? 'primary' : 'default'}
                  onClick={() => handleAmenityChange('wifi')}
                />
                <Chip
                  label="Kitchen"
                  clickable
                  color={amenityFilters.kitchen ? 'primary' : 'default'}
                  onClick={() => handleAmenityChange('kitchen')}
                />
                <Chip
                  label="Meeting Rooms"
                  clickable
                  color={amenityFilters.meetingRooms ? 'primary' : 'default'}
                  onClick={() => handleAmenityChange('meetingRooms')}
                />
                <Chip
                  label="24/7 Access"
                  clickable
                  color={amenityFilters.access24_7 ? 'primary' : 'default'}
                  onClick={() => handleAmenityChange('access24_7')}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {filteredSpaces.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            No spaces found
          </Typography>
          <Typography variant="body1" paragraph>
            Try adjusting your filters or search term
          </Typography>
          <Button variant="outlined" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredSpaces.map((space) => (
            <Grid item xs={12} sm={6} md={4} key={space.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={space.image || 'https://source.unsplash.com/random/300x200/?coworking'}
                  alt={space.name}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {space.name}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${space.price}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {space.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={space.rating || 4.5} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({space.reviewCount || 12})
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {space.description.length > 120
                      ? `${space.description.substring(0, 120)}...`
                      : space.description}
                  </Typography>
                  
                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      component={RouterLink}
                      to={`/spaces/${space.id}`}
                      variant="contained"
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default HomePage;