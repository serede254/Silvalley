import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getSpaces, deleteSpace } from '../../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { format } from 'date-fns';

const AdminSpacesPage = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filtering
  const [locationFilter, setLocationFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // View mode
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);
  
  useEffect(() => {
    fetchSpaces();
  }, []);
  
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await getSpaces();
      setSpaces(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load spaces');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleLocationFilterChange = (event) => {
    setLocationFilter(event.target.value);
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleDeleteClick = (space) => {
    setSpaceToDelete(space);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSpaceToDelete(null);
  };
  
  const handleDeleteConfirm = async () => {
    if (!spaceToDelete) return;
    
    try {
      setLoading(true);
      await deleteSpace(spaceToDelete.id);
      
      // Update spaces list
      setSpaces(spaces.filter(space => space.id !== spaceToDelete.id));
      
      setSuccess(`Space "${spaceToDelete.name}" has been deleted`);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError('Failed to delete space');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };
  
  // Filter spaces
  const filteredSpaces = spaces.filter(space => {
    // Apply location filter
    if (locationFilter && space.location !== locationFilter) {
      return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        space.name.toLowerCase().includes(term) ||
        space.location.toLowerCase().includes(term) ||
        space.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  // Get unique locations for filter
  const locations = [...new Set(spaces.map(space => space.location))];
  
  // Paginate spaces
  const paginatedSpaces = filteredSpaces.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  if (loading && spaces.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Spaces
        </Typography>
        
        <Button
          component={RouterLink}
          to="/admin/spaces/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add New Space
        </Button>
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
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
            placeholder="Search by name, location, or description"
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={locationFilter}
              onChange={handleLocationFilterChange}
              label="Location"
            >
              <MenuItem value="">All Locations</MenuItem>
              {locations.map(location => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <IconButton onClick={toggleViewMode}>
            {viewMode === 'list' ? <ViewModuleIcon /> : <ViewListIcon />}
          </IconButton>
          
          <Button 
            variant="outlined" 
            onClick={fetchSpaces}
          >
            Refresh
          </Button>
        </Box>
        
        {viewMode === 'list' ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Price (Day)</TableCell>
                    <TableCell>Amenities</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSpaces.length > 0 ? (
                    paginatedSpaces.map((space) => (
                      <TableRow key={space.id}>
                        <TableCell>{space.name}</TableCell>
                        <TableCell>{space.location}</TableCell>
                        <TableCell>{space.capacity}</TableCell>
                        <TableCell>${space.pricePerDay.toFixed(2)}</TableCell>
                        <TableCell>
                          {space.amenities.slice(0, 3).map((amenity, index) => (
                            <Chip 
                              key={index}
                              label={amenity}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                          {space.amenities.length > 3 && (
                            <Chip 
                              label={`+${space.amenities.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={space.isActive ? 'Active' : 'Inactive'} 
                            color={space.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              component={RouterLink}
                              to={`/admin/spaces/edit/${space.id}`}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(space)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No spaces found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredSpaces.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedSpaces.length > 0 ? (
                paginatedSpaces.map((space) => (
                  <Grid item xs={12} sm={6} md={4} key={space.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={space.images[0] || 'https://via.placeholder.com/300x140?text=No+Image'}
                        alt={space.name}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div" noWrap>
                          {space.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {space.location}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            Capacity: {space.capacity}
                          </Typography>
                          <Typography variant="body2">
                            ${space.pricePerDay.toFixed(2)}/day
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Chip 
                            label={space.isActive ? 'Active' : 'Inactive'} 
                            color={space.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {space.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          component={RouterLink}
                          to={`/admin/spaces/edit/${space.id}`}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(space)}
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>No spaces found</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TablePagination
                rowsPerPageOptions={[6, 12, 24]}
                component="div"
                count={filteredSpaces.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </>
        )}
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Space</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{spaceToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSpacesPage;
