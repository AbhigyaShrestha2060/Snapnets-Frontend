import {
  NotificationsNone as BellIcon,
  CheckCircleOutline as CheckIcon,
  Close as CloseIcon,
  Collections,
  CurrencyRupee,
  ExitToApp,
  Favorite,
  Home,
  Menu as MenuIcon,
  Notifications,
  Person,
  Search,
  AccessTime as TimeIcon,
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
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getNotification,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from '../../api/api';
const NotificationMenu = ({
  anchorEl,
  open,
  onClose,
  notifications = [],
  onMarkAsRead,
}) => {
  const [filter, setFilter] = React.useState(0);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = React.useMemo(() => {
    if (filter === 1) return notifications.filter((n) => !n.read);
    if (filter === 2) return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, filter]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          maxHeight: 'none',
          maxWidth: 'none',
          p: 0,
        },
      }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Typography variant='h6'>Notifications</Typography>
        <IconButton
          size='small'
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs
        value={filter}
        onChange={(_, val) => setFilter(val)}
        sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label='All' />
        <Tab label='Unread' />
        <Tab label='Read' />
      </Tabs>

      <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <BellIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography color='text.secondary'>No notifications</Typography>
          </Box>
        ) : (
          filteredNotifications.map((notification, idx) => (
            <React.Fragment key={notification._id}>
              {idx > 0 && <Divider />}
              <ListItem
                sx={{
                  bgcolor: notification.read
                    ? 'background.paper'
                    : 'action.hover',
                  '&:hover': { bgcolor: 'action.hover' },
                }}>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.5,
                      }}>
                      <Typography variant='subtitle2'>
                        {notification.title || 'Notification'}
                      </Typography>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant='caption'
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}>
                          <TimeIcon fontSize='inherit' />
                          {formatTime(notification.createdAt || new Date())}
                        </Typography>
                        {!notification.read && (
                          <IconButton
                            size='small'
                            onClick={() => onMarkAsRead(notification._id)}
                            sx={{ color: 'primary.main' }}>
                            <CheckIcon fontSize='small' />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  }
                  secondary={notification.message}
                />
              </ListItem>
            </React.Fragment>
          ))
        )}
      </List>

      {filteredNotifications.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}>
          <Button
            onClick={() => onMarkAsRead('all')}
            size='small'>
            Mark all as read
          </Button>
        </Box>
      )}
    </Menu>
  );
};

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Liked', icon: <Favorite />, path: '/liked' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'My Bids', icon: <CurrencyRupee />, path: '/mybids' },
    { text: 'Boards', icon: <Collections />, path: '/boards' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleNotificationMenuOpen = (event) =>
    setNotificationAnchor(event.currentTarget);
  const handleNotificationMenuClose = () => setNotificationAnchor(null);

  const handleProfileMenuOpen = (event) =>
    setProfileAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchor(null);

  const handleMarkAsRead = async (id) => {
    try {
      if (id === 'all') {
        await markAllNotificationAsRead();
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      } else {
        await markNotificationAsRead(id);
        setNotifications(
          notifications.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotification();
        if (response.data.success) {
          setNotifications(response.data.notifications);
          const unread = response.data.notifications.filter(
            (n) => !n.read
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

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
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '16px',
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

          <Box sx={{ ml: 'auto' }}>
            <IconButton
              color='inherit'
              onClick={handleNotificationMenuOpen}>
              <Badge
                badgeContent={unreadCount}
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

      <Drawer
        variant='temporary'
        anchor='left'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}>
        {drawer}
      </Drawer>

      <NotificationMenu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />

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
        <MenuItem
          component='a'
          href='/helpandsupport'>
          Help and Support
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
