import {
  Close as CloseIcon,
  CurrencyRupee,
  Gavel,
  TrendingUp,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Slide,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { addBidApi } from '../../api/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction='up'
      ref={ref}
      {...props}
    />
  );
});

const AddBids = ({ show, onClose, bid, currentBid, itemTitle }) => {
  const theme = useTheme();
  const [bidAmount, setBidAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount);
  };

  const handleBidChange = (e) => {
    const value = e.target.value;
    setBidAmount(value);
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  const onSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setErrorMessage('Please enter a valid bid amount.');
      return;
    }

    if (parseFloat(bidAmount) <= currentBid) {
      setErrorMessage('Your bid must be higher than the current bid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bidData = {
        imageId: bid.image?._id,
        bidAmount: parseFloat(bidAmount),
      };

      await addBidApi(bidData);
      setSuccessMessage('Bid submitted successfully!');
      setErrorMessage('');
      setBidAmount('');

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting bid:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
        },
      }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Stack
          direction='row'
          alignItems='center'
          spacing={1}>
          <Gavel sx={{ color: theme.palette.primary.main }} />
          <Typography variant='h6'>Place Your Bid</Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'rotate(90deg)',
              color: theme.palette.error.main,
            },
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
            }}>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'>
                  Item
                </Typography>
                <Typography variant='h6'>{itemTitle || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp fontSize='small' />
                  Current Bid
                </Typography>
                <Typography
                  variant='h5'
                  color='primary'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'medium',
                  }}>
                  <CurrencyRupee fontSize='small' />
                  {formatCurrency(currentBid).replace('NPR', '').trim()}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <TextField
          autoFocus
          fullWidth
          label='Your Bid Amount'
          variant='outlined'
          type='number'
          value={bidAmount}
          onChange={handleBidChange}
          placeholder={`Enter amount higher than ${formatCurrency(currentBid)}`}
          helperText='Enter amount in NPR'
          InputProps={{
            startAdornment: (
              <CurrencyRupee sx={{ color: 'text.secondary', mr: 1 }} />
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        <Box sx={{ mt: 2 }}>
          {errorMessage && (
            <Alert
              severity='error'
              sx={{
                borderRadius: 2,
                animation: 'slideIn 0.2s ease-out',
              }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert
              severity='success'
              sx={{
                borderRadius: 2,
                animation: 'slideIn 0.2s ease-out',
              }}>
              {successMessage}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button
          onClick={onClose}
          variant='outlined'
          color='inherit'
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            minWidth: 100,
          }}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant='contained'
          disabled={isSubmitting}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            minWidth: 100,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0))',
              transform: 'translateY(-100%)',
              transition: 'transform 0.3s',
            },
            '&:hover::after': {
              transform: 'translateY(0)',
            },
          }}>
          {isSubmitting ? 'Submitting...' : 'Place Bid'}
        </Button>
      </DialogActions>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Dialog>
  );
};

AddBids.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bid: PropTypes.object.isRequired,
  currentBid: PropTypes.number.isRequired,
  itemTitle: PropTypes.string,
};

export default AddBids;
