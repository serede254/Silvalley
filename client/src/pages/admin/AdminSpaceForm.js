import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSpaceById, createSpace, updateSpace } from '../../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Available amenities list
const AMENITIES = [
  'WiFi',
  'Printer',
  'Coffee',
  'Kitchen',
  'Parking',
  'Meeting Room',
  'Air Conditioning',
  'Heating',
  'Security',
  'Whiteboard',
  'Projector',
  'TV',
  'Standing Desk',
  'Ergonomic Chair',
  '24/7 Access'
];

// Available space types
const SPACE_TYPES = [
  'Hot Desk',
  'Dedicated Desk',
  'Private Office',
  'Meeting Room',
  'Event Space',
  'Virtual Office'
];

const AdminSpaceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    capacity: 1,
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    spaceType: '',
    amenities: [],
    images: [''],
    isActive: true
  });
  
  // New amenity input
  const [newAmenity, setNewAmenity] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchSpaceData();
    }
  }, [id]);
  
  const fetchSpaceData = async () => {
    try {
      setLoading(true);
      const response = await getSpaceById(id);
      setFormData(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load space data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAmenitiesChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({ 
      ...prev, 
      amenities: typeof value === 'string' ? value.split(',') : value 
    }));
  };
  
  const handleAddCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };
  
  const handleRemoveAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };
  
  const handleAddImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };
  
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };
  
  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages.length ? updatedImages : [''] }));
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.spaceType) return 'Space type is required';
    if (formData.capacity < 1) return 'Capacity must be at least 1';
    if (formData.pricePerDay < 0) return 'Price cannot be negative';
    
    // Validate image URLs
    const nonEmptyImages = formData.images.filter(url => url.trim());
    if (nonEmptyImages.length === 0) return 'At least one image is required';
    
    return null;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Filter out empty image URLs
    const cleanedFormData = {
      ...formData,
      images: formData.images.filter(url => url.trim())
    };
    
    try {
      setSaving(true);
      
      if (isEditMode) {
        await updateSpace(id, cleanedFormData);
        setSuccess('Space updated successfully');
      } else {
        await createSpace(cleanedFormData);
        setSuccess('Space created successfully');
        // Reset form after successful creation
        setFormData({
          name: '',
          description: '',
          location: '',
          address: '',
          capacity: 1,
          pricePerDay: 0,
          pricePerWeek: 0,
          pricePerMonth: 0,
          spaceType: '',
          amenities: [],
          images: [''],
          isActive: true
        });
      }
      
      // Navigate back to spaces list after a delay
      setTimeout(() => {
        navigate('/admin/spaces');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError('Failed to save space');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/admin/spaces')}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Space' : 'Create New Space'}
        </Typography>
      </Box>
      
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={() => setSuccess('')}
        >
          {success}
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
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Space Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Space Type</InputLabel>
                <Select
                  name="spaceType"
                  value={formData.spaceType}
                  onChange={handleInputChange}
                  label="Space Type"
                >
                  {SPACE_TYPES.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="City or area"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Capacity & Pricing
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleNumberInputChange}
                fullWidth
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price Per Day"
                name="pricePerDay"
                type="number"
                value={formData.pricePerDay}
                onChange={handleNumberInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price Per Week"
                name="pricePerWeek"
                type="number"
                value={formData.pricePerWeek}
                onChange={handleNumberInputChange}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price Per Month"
                name="pricePerMonth"
                type="number"
                value={formData.pricePerMonth}
                onChange={handleNumberInputChange}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Amenities
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={formData.amenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput label="Amenities" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {AMENITIES.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      <Checkbox checked={formData.amenities.indexOf(amenity) > -1} />
                      <ListItemText primary={amenity} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Add Custom Amenity"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  fullWidth
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddCustomAmenity}
                  disabled={!newAmenity.trim()}
                >
                  Add
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.amenities.map((amenity) => (
                  <Chip
                    key={amenity}
                    label={amenity}
                    onDelete={() => handleRemoveAmenity(amenity)}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Images
              </Typography>
            </Grid>
            
            {formData.images.map((image, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label={`Image URL ${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    fullWidth
                    required={index === 0}
                  />
                  <IconButton 
                                      color="error" 
                                      onClick={() => handleRemoveImage(index)}
                                      disabled={formData.images.length === 1}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </Grid>
                              ))}
            
                              <Grid item xs={12}>
                                <Button 
                                  startIcon={<AddIcon />}
                                  onClick={handleAddImageField}
                                >
                                  Add Another Image
                                </Button>
                              </Grid>
            
                              <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                  Status
                                </Typography>
                              </Grid>
            
                              <Grid item xs={12}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      name="isActive"
                                      checked={formData.isActive}
                                      onChange={handleSwitchChange}
                                    />
                                  }
                                  label="Space is active and available for booking"
                                />
                              </Grid>
            
                              <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                  <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin/spaces')}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={saving}
                                  >
                                    {saving ? (
                                      <>
                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                        Saving...
                                      </>
                                    ) : (
                                      isEditMode ? 'Update Space' : 'Create Space'
                                    )}
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </form>
                        </Paper>
                      </Container>
                    )
}

export default AdminSpaceForm