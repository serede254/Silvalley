import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              CoworkingHub
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Find your perfect workspace in our network of premium coworking locations.
              Flexible options for professionals and teams of all sizes.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" color="primary">
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" color="primary">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                  About Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/login" color="inherit" underline="hover">
                  Login
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/register" color="inherit" underline="hover">
                  Register
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              123 Workspace Avenue
              <br />
              San Francisco, CA 94107
              <br />
              <Link href="mailto:info@coworkinghub.com" color="inherit" underline="hover">
                info@coworkinghub.com
              </Link>
              <br />
              <Link href="tel:+1234567890" color="inherit" underline="hover">
                (123) 456-7890
              </Link>
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} CoworkingHub. All rights reserved.
          </Typography>
          <Box>
            <Link href="#" color="inherit" underline="hover" sx={{ mr: 2 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
