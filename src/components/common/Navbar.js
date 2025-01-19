import {
  Collections,
  CurrencyRupee,
  ExitToApp,
  Favorite,
  Home,
  Menu as MenuIcon,
  Notifications,
  Person,
  Search,
} from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [notifications] = useState([
    'New bid on your post',
    'Your post was liked',
    'You have a new follower',
    'Notification 4',
    'Notification 5',
    'Notification 6',
    'Notification 7',
    'Notification 8',
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // State for dropdown menus
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleProfileMenuClose();
  };

  // Notification menu handlers
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchor(null);
  };

  const navItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Liked', icon: <Favorite />, path: '/liked' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'My Bids', icon: <CurrencyRupee />, path: '/mybids' },
    { text: 'Boards', icon: <Collections />, path: '/boards' },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: 'center',
        bgcolor: '#E60023',
        height: '100%',
        color: 'white',
      }}>
      <Box sx={{ p: 2 }}>
        <img
          src='/assets/images/Logo.png'
          alt='Logo'
          style={{
            height: '75px',
            width: '75px',
            backgroundColor: 'white',
            borderRadius: '5px',
            padding: '5px',
          }}
        />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component='a'
            href={item.path}
            sx={{
              color: 'white',
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '16px', // Matches ListItem padding
                right: '16px',
                height: '2px',
                backgroundColor: 'white',
                transform:
                  location.pathname === item.path ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.3s ease',
              },
              ...(location.pathname === item.path && {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }),
            }}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight:
                    location.pathname === item.path ? 'bold' : 'normal',
                },
              }}
            />
            {location.pathname === item.path && (
              <Box
                sx={{
                  width: 4,
                  height: '100%',
                  position: 'absolute',
                  right: 0,
                  backgroundColor: '#E60023',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position='sticky'
        sx={{ bgcolor: '#E60023', top: 0 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color='inherit'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            component='a'
            href='/'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}>
            <img
              src='/assets/images/Logo.png'
              alt='Logo'
              style={{
                height: '80px',
                width: '80px',
                backgroundColor: 'white',
                borderRadius: '5px',
                padding: '5px',
              }}
            />
          </Box>

          {/* Navigation Items - Hidden on mobile */}
          {!isMobile && (
            <Box
              sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  color='inherit'
                  startIcon={item.icon}
                  href={item.path}
                  sx={{
                    mx: 1,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      backgroundColor: 'white',
                      transform:
                        location.pathname === item.path
                          ? 'scaleX(1)'
                          : 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      fontWeight: 'bold',
                    }),
                  }}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side icons */}
          <Box sx={{ ml: 'auto' }}>
            <IconButton
              color='inherit'
              onClick={handleNotificationMenuOpen}>
              <Badge
                badgeContent={notifications.length}
                color='error'>
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton
              color='inherit'
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}>
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant='temporary'
        anchor='left'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}>
        {drawer}
      </Drawer>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          style: {
            maxHeight: 300,
          },
        }}>
        {notifications.map((notification, index) => (
          <MenuItem
            key={index}
            onClick={handleNotificationMenuClose}>
            {notification}
          </MenuItem>
        ))}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileMenuClose}>
        <MenuItem
          component='a'
          href='/profile'>
          View Profile
        </MenuItem>
        <MenuItem
          component='a'
          href='/myUploads'>
          My Uploads
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
