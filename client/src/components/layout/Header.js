import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Container,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PersonIcon from '@mui/icons-material/Person'

const Header = () => {
  const { currentUser, logout } = useAuth()
  const isAuthenticated = !!currentUser
  const isAdmin = currentUser?.role === 'admin'
  
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate('/')
  }

  const handleNavigate = (path) => {
    navigate(path)
    handleMenuClose()
    setMobileMenuOpen(false)
  }

  const menuId = 'primary-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { minWidth: 180 }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={() => handleNavigate('/profile')}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      
      <MenuItem onClick={() => handleNavigate('/bookings')}>
        <ListItemIcon>
          <BookmarkIcon fontSize="small" />
        </ListItemIcon>
        My Bookings
      </MenuItem>
      
      {isAdmin && (
        <MenuItem onClick={() => handleNavigate('/admin')}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Admin Dashboard
        </MenuItem>
      )}
      
      <Divider />
      
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem>
            <ListItemText 
              primary="CoworkingHub" 
              primaryTypographyProps={{ 
                variant: 'h6', 
                color: 'primary',
                fontWeight: 'bold'
              }} 
            />
          </ListItem>
          <Divider />
          
          {!isAuthenticated ? (
            <>
              <ListItem button onClick={() => handleNavigate('/login')}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate('/register')}>
                <ListItemText primary="Register" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button onClick={() => handleNavigate('/profile')}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              
              <ListItem button onClick={() => handleNavigate('/bookings')}>
                <ListItemIcon>
                  <BookmarkIcon />
                </ListItemIcon>
                <ListItemText primary="My Bookings" />
              </ListItem>
              
              {isAdmin && (
                <ListItem button onClick={() => handleNavigate('/admin')}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              )}
              
              <Divider />
              
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  )

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            CoworkingHub
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              <Button 
                component={RouterLink} 
                to="/" 
                sx={{ color: 'text.primary', mx: 1 }}
              >
                Home
              </Button>
              <Button 
                component={RouterLink} 
                to="/about" 
                sx={{ color: 'text.primary', mx: 1 }}
              >
                About
              </Button>
            </Box>
          )}

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              ) : (
                <>
                  <Button 
                    component={RouterLink} 
                    to="/login" 
                    sx={{ color: 'text.primary', mx: 1 }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to="/register" 
                    variant="contained" 
                    color="primary"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
      {renderMenu}
      {mobileMenu}
    </AppBar>
  )
}

export default Header