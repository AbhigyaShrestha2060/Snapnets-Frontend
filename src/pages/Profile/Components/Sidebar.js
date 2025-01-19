import {
  AddCircleOutline,
  DeleteOutline,
  ExitToApp,
  Lock,
  Person,
  PhotoLibrary,
  Wallet,
} from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'transparent',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  margin: '0 auto',
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 0,
  },
  '&:hover': {
    '&::before': {
      opacity: 0.1,
    },
  },
  '& .MuiButton-startIcon': {
    position: 'relative',
    zIndex: 1,
  },
  '& .MuiButton-label': {
    position: 'relative',
    zIndex: 1,
  },
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  '& > div': {
    textAlign: 'center',
  },
}));

const Sidebar = ({ setActiveComponent, user, isGoogleUser, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleViewProfileDetails = () => {
    navigate('/myUploads');
    onClose?.();
  };

  const handleNavigation = (component) => {
    setActiveComponent(component);
    onClose?.();
  };

  return (
    <Box
      sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Profile Section */}
      <StyledCard elevation={0}>
        <CardContent>
          <Stack
            spacing={3}
            alignItems='center'>
            <ProfileAvatar
              src={
                user?.profilePicture
                  ? `http://localhost:5050/${user?.profilePicture}`
                  : '/assets/images/bg.jpg'
              }
              alt={user?.username}
            />
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography
                variant='h5'
                fontWeight='bold'
                gutterBottom>
                @{user?.username || 'Guest'}
              </Typography>

              <StatsBox>
                <div>
                  <Typography
                    variant='h6'
                    color='primary.main'>
                    {user?.followers || 0}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'>
                    Followers
                  </Typography>
                </div>
                <Divider
                  orientation='vertical'
                  flexItem
                />
                <div>
                  <Typography
                    variant='h6'
                    color='primary.main'>
                    {user?.following || 0}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'>
                    Following
                  </Typography>
                </div>
              </StatsBox>

              <Card
                sx={{
                  mt: 3,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  p: 2,
                  borderRadius: 3,
                }}>
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'>
                  <Box>
                    <Typography variant='body2'>Balance</Typography>
                    <Typography variant='h5'>
                      ₹{user?.balance || '0'}
                    </Typography>
                  </Box>
                  <Wallet sx={{ fontSize: 32, opacity: 0.8 }} />
                </Stack>
              </Card>

              <Button
                variant='contained'
                startIcon={<AddCircleOutline />}
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  py: 1.5,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }}>
                Add Money
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </StyledCard>

      {/* Navigation Links */}
      <List sx={{ mt: 3, mb: 2 }}>
        <ListItem
          disablePadding
          sx={{ mb: 1 }}>
          <NavButton
            startIcon={<Person />}
            onClick={() => handleNavigation('update-profile')}>
            Update Profile
          </NavButton>
        </ListItem>

        {!isGoogleUser && (
          <ListItem
            disablePadding
            sx={{ mb: 1 }}>
            <NavButton
              startIcon={<Lock />}
              onClick={() => handleNavigation('change-password')}>
              Change Password
            </NavButton>
          </ListItem>
        )}

        <ListItem
          disablePadding
          sx={{ mb: 1 }}>
          <NavButton
            startIcon={<PhotoLibrary />}
            onClick={handleViewProfileDetails}>
            View My Uploads
          </NavButton>
        </ListItem>

        <ListItem disablePadding>
          <NavButton
            startIcon={<DeleteOutline />}
            onClick={() => handleNavigation('delete-account')}
            sx={{
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              },
            }}>
            Delete Account
          </NavButton>
        </ListItem>
      </List>

      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <Button
          variant='contained'
          color='error'
          fullWidth
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          sx={{
            mt: 2,
            borderRadius: 3,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
          }}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
