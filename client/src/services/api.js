import axios from 'axios';
import { spaces } from '../mockData';
// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication APIs
export const registerUser = (userData) => {
  return api.post('/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/login', credentials);
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put('/api/users/profile', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Space APIs
export const getSpaces = (filters) => {
  // For development with mock data
  return Promise.resolve({
    data: spaces
  });
  
  // For production
  // return api.get('/spaces', { params: filters });
};

export const getSpaceById = (id) => {
  // with mock data
  const space = spaces.find(s => s.id === id);
  return Promise.resolve({
    data: space
  });
  
  // For production
  // return api.get(`/spaces/${id}`);
};

export const createSpace = (spaceData) => {
  return api.post('/spaces', spaceData);
};

export const updateSpace = (id, spaceData) => {
  return api.put(`/spaces/${id}`, spaceData);
};

export const deleteSpace = (id) => {
  return api.delete(`/spaces/${id}`);
};

// Booking APIs
export const getUserBookings = () => {
  return api.get('/bookings/user');
};

export const createBooking = async (bookingData) => {
  try {
    // First, get the space to check availability
    const spaceResponse = await getSpaceById(bookingData.spaceId);
    const space = spaceResponse.data;
    
    // Check if space has available desks
    if (space.availableDesks <= 0) {
      return Promise.reject({
        response: {
          data: {
            message: 'This space is currently sold out and cannot be booked.'
          }
        }
      });
    }
    
    // For mock implementation, update the available desks count
    // Find the space in the mock data and decrement its availableDesks
    const spaceIndex = spaces.findIndex(s => s.id === bookingData.spaceId);
    if (spaceIndex !== -1) {
      spaces[spaceIndex].availableDesks -= 1;
    }
    
    // Simulate API response for development
    const mockBookingResponse = {
      id: `b${Date.now()}`,
      userId: 'u1', // Assuming current user
      userEmail: 'user@example.com',
      spaceId: bookingData.spaceId,
      spaceName: space.name,
      date: bookingData.date,
      price: bookingData.price,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    
    return Promise.resolve({
      data: mockBookingResponse
    });
    
    // For production
    // return api.post('/bookings', bookingData);
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = (id) => {
  return api.put(`/bookings/${id}/cancel`);
};

// Admin APIs
export const getAdminSpaces = () => {
  return api.get('/admin/spaces');
};

export const getAdminBookings = () => {
  return api.get('/admin/bookings');
};

export const getAdminUsers = () => {
  return api.get('/admin/users');
};

export const getDashboardStats = () => {
  return api.get('/admin/dashboard/stats');
};

export default api;
