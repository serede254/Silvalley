import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

const ProfilePage = () => {
  const { currentUser, updateUserData } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    if (currentUser) {
      // Initialize form with current user data
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        company: currentUser.company || '',
        jobTitle: currentUser.jobTitle || ''
      });
    }
    
    fetchUserProfile();
  }, [currentUser]);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      const userData = response.data;
      
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        jobTitle: userData.jobTitle || ''
      });
      
      // Update auth context with latest user data
      updateUserData(userData);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear messages when switching tabs
    setError('');
    setSuccess('');
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const validateProfileForm = () => {
    if (!profileData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    
    if (!profileData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    
    if (!profileData.email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      setError('Email is invalid');
      return false;
    }
    
    return true;
  };
  
  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    
    if (!passwordData.newPassword) {
      setError('New password is required');
      return false;
    } else if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return false;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await updateUserProfile(profileData);
      
      // Update auth context with new user data
      updateUserData(profileData);
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await updateUserProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password updated successfully');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main'
              }}
            >
              {currentUser?.firstName?.charAt(0) || 'U'}
            </Avatar>
            
            <Typography variant="h5" gutterBottom>
              {currentUser?.firstName} {currentUser?.lastName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {currentUser?.email}
            </Typography>
            
            {currentUser?.jobTitle && currentUser?.company && (
              <Typography variant="body2" color="text.secondary">
                {currentUser.jobTitle} at {currentUser.company}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              orientation="vertical"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab 
                icon={<PersonIcon />} 
                label="Profile" 
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textAlign: 'left', pl: 0 }}
              />
              <Tab 
                icon={<SecurityIcon />} 
                label="Security" 
                iconPosition="start"
                sx={{ justifyContent: 'flex-start', textAlign: 'left', pl: 0 }}
              />
            </Tabs>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box component="form" onSubmit={handleProfileSubmit}>
                <Typography variant="h5" gutterBottom>
                  Profile Information
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                  </Alert>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      required
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      required
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      name="jobTitle"
                      value={profileData.jobTitle}
                      onChange={handleProfileChange}
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box component="form" onSubmit={handlePasswordSubmit}>
                <Typography variant="h5" gutterBottom>
                  Change Password
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                    {success}
                  </Alert>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={loading}
                      helperText="Password must be at least 6 characters"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Update Password'}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
