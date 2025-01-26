// theme.js
import { createTheme } from '@mui/material/styles';

// Sidebar.jsx
import {
  AddCircleOutline,
  ArrowDownward,
  ArrowUpward,
  DeleteOutline,
  ExitToApp,
  Lock,
  Person,
  PhotoLibrary,
  Wallet,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBalance, initializeKhalti } from '../../../api/api';
import FollowModal from '../../../components/common/FollowModal';
export const theme = createTheme({
  palette: {
    primary: {
      main: '#E60023',
      light: '#ff1a1a',
      dark: '#cc0000',
      contrastText: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

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

const TransactionRow = styled(TableRow)(({ theme, type }) => ({
  '& .MuiTableCell-root': {
    color:
      type === 'Deposit'
        ? theme.palette.success.main
        : theme.palette.error.main,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
  },
}));

const Sidebar = ({ setActiveComponent, user, isGoogleUser, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [openTransactions, setOpenTransactions] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [balanceData, setBalanceData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [followData, setFollowData] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    fetchBalance();
    fetchFollowData(user);
  }, [user]);

  const fetchBalance = async () => {
    try {
      const response = await getBalance();
      if (response.data.success) {
        setBalanceData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch balance',
        severity: 'error',
      });
    }
  };
  const fetchFollowData = async (user) => {
    await setFollowData(user?.data);
  };

  const handleAddBalance = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const response = await initializeKhalti({
        totalPrice: amount,
        website_url: 'http://localhost:3000',
      });
      if (response.data.success) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error adding balance:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add balance',
        severity: 'error',
      });
    }
  };

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
                <div onClick={() => setShowFollowersModal(true)}>
                  <Typography
                    variant='h6'
                    color='primary.main'>
                    {user?.followersCount || 0}
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
                <div onClick={() => setShowFollowingModal(true)}>
                  <Typography
                    variant='h6'
                    color='primary.main'>
                    {user?.followingCount || 0}
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
                  bgcolor: '#E60023',
                  color: 'white',
                  p: 2,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => setOpenTransactions(true)}>
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'>
                  <Box>
                    <Typography variant='body2'>Balance</Typography>
                    <Typography variant='h5'>
                      ₹{balanceData?.balance || '0'}
                    </Typography>
                  </Box>
                  <Wallet sx={{ fontSize: 32, opacity: 0.8 }} />
                </Stack>
              </Card>

              <Button
                variant='contained'
                startIcon={<AddCircleOutline />}
                fullWidth
                onClick={() => setOpenModal(true)}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #E60023, #ff1a1a)',
                }}>
                Add Money
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </StyledCard>

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

      <FollowModal
        open={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title='Followers'
        data={followData?.followers}
      />

      <FollowModal
        open={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title='Following'
        data={followData?.following}
      />

      {/* Add Money Modal */}
      <StyledDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth='xs'
        fullWidth>
        <DialogTitle>
          <Typography
            variant='h6'
            fontWeight='bold'
            color='primary'>
            Add Balance
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Enter Amount (₹)'
            type='number'
            fullWidth
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            error={Boolean(error)}
            helperText={error}
            InputProps={{
              inputProps: { min: 0 },
              startAdornment: (
                <Typography
                  color='text.secondary'
                  sx={{ mr: 1 }}>
                  ₹
                </Typography>
              ),
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
              setError('');
              setAmount('');
            }}
            color='inherit'>
            Cancel
          </Button>
          <Button
            onClick={handleAddBalance}
            variant='contained'
            sx={{
              background: 'linear-gradient(45deg, #E60023, #ff1a1a)',
              '&:hover': {
                background: 'linear-gradient(45deg, #cc0000, #e60000)',
              },
            }}>
            Add
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Transactions Modal */}
      <Dialog
        open={openTransactions}
        onClose={() => setOpenTransactions(false)}
        maxWidth='md'
        fullWidth>
        <DialogTitle>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography
              variant='h6'
              fontWeight='bold'>
              Transaction History
            </Typography>
            <Typography
              variant='h6'
              color='primary'
              fontWeight='bold'>
              Balance: ₹{balanceData?.balance || '0'}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {balanceData?.transactions.map((transaction, index) => (
                  <TransactionRow
                    key={index}
                    type={transaction.type}>
                    <TableCell>{transaction.transactionDate}</TableCell>
                    <TableCell
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {transaction.type === 'Deposit' ? (
                        <ArrowUpward
                          color='success'
                          fontSize='small'
                        />
                      ) : (
                        <ArrowDownward
                          color='error'
                          fontSize='small'
                        />
                      )}
                      {transaction.type}
                    </TableCell>
                    <TableCell align='right'>
                      {transaction.type === 'Deposit' ? '+' : ''}₹
                      {Math.abs(transaction.amount)}
                    </TableCell>
                  </TransactionRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenTransactions(false)}
            color='inherit'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sidebar;
