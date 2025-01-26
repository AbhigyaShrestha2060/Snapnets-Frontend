import {
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as ClockIcon,
  Close as CloseIcon,
  CurrencyRupee,
  Favorite as FavoriteIcon,
  Gavel as GavelIcon,
  TrendingUp,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Slide,
  Stack,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBidApi, getBidsApi } from '../../api/api';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  transition: 'all 0.3s ease-in-out',
  border: 'none',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
    '& .card-media': {
      transform: 'scale(1.05)',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out',
  '&.card-media': {
    transition: 'transform 0.3s ease-in-out',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 20,
  height: 32,
  backgroundColor: status === 'winning' ? '#e8f5e9' : '#ffebee',
  color: status === 'winning' ? '#2e7d32' : '#d32f2f',
  '& .MuiChip-icon': {
    color: status === 'winning' ? '#2e7d32' : '#d32f2f',
  },
}));

const BidButton = styled(Button)(({ theme, iswinning }) => ({
  borderRadius: 8,
  padding: '10px 20px',
  backgroundColor: iswinning === 'true' ? '#2e7d32' : '#E60023',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: iswinning === 'true' ? '#1b5e20' : '#d32f2f',
    transform: 'scale(1.02)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const FloatingTimeChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  borderRadius: 20,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '& .MuiChip-icon': {
    color: '#E60023',
  },
}));

const LikesBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 20,
  padding: '4px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '& .MuiSvgIcon-root': {
    color: '#E60023',
    fontSize: 18,
  },
}));

const StyledBidInfo = styled(Paper)(({ theme, iswinning }) => ({
  padding: theme.spacing(2),
  backgroundColor: iswinning
    ? 'rgba(46, 125, 50, 0.05)'
    : 'rgba(211, 47, 47, 0.05)',
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction='up'
      ref={ref}
      {...props}
    />
  );
});

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await getBidsApi();
      setBids(response.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (bid, event) => {
    event?.stopPropagation();
    setSelectedBid(bid);
    setBidAmount(bid.latestBidAmount.toString());
    setShowBidModal(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCloseModal = () => {
    setShowBidModal(false);
    setSelectedBid(null);
    setBidAmount('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleBidSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setErrorMessage('Please enter a valid bid amount.');
      return;
    }

    if (parseFloat(bidAmount) <= selectedBid.latestBidAmount) {
      setErrorMessage('Your bid must be higher than the current bid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bidData = {
        imageId: selectedBid.image?._id,
        bidAmount: parseFloat(bidAmount),
      };

      await addBidApi(bidData);
      setSuccessMessage('Bid submitted successfully!');
      setErrorMessage('');

      // Refresh bids after successful submission
      await fetchBids();

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Error submitting bid:', error);
      setErrorMessage(
        error.response?.data?.message ||
          'An error occurred while placing your bid.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBidStatus = (latestBid, userBid) => {
    const latestBidAmount = Number(latestBid);
    const userBidAmount = Number(userBid);

    if (latestBidAmount > userBidAmount) {
      return {
        icon: <WarningIcon />,
        label: 'Outbid',
        status: 'losing',
        message: 'Your bid is lower than the current bid',
      };
    }
    return {
      icon: <CheckCircleIcon />,
      label: 'Winning',
      status: 'winning',
      message: 'Your bid is currently winning',
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderBidModal = () => (
    <Dialog
      open={showBidModal}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseModal}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          backdropFilter: 'blur(10px)',
        },
      }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Stack
          direction='row'
          alignItems='center'
          spacing={1}>
          <GavelIcon sx={{ color: '#E60023' }} />
          <Typography variant='h6'>Place Your Bid</Typography>
        </Stack>
        <IconButton
          onClick={handleCloseModal}
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
              bgcolor: 'rgba(230, 0, 35, 0.05)',
              borderRadius: 2,
            }}>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'>
                  Item
                </Typography>
                <Typography variant='h6'>
                  {selectedBid?.image?.imageTitle || 'N/A'}
                </Typography>
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
                    color: '#E60023',
                  }}>
                  <CurrencyRupee fontSize='small' />
                  {selectedBid
                    ? formatCurrency(selectedBid.latestBidAmount)
                        .replace('NPR', '')
                        .trim()
                    : '0'}
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
          onChange={(e) => {
            setBidAmount(e.target.value);
            setErrorMessage('');
          }}
          placeholder={
            selectedBid
              ? `Enter amount higher than ${formatCurrency(
                  selectedBid.latestBidAmount
                )}`
              : ''
          }
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

      <Box sx={{ p: 2, px: 3 }}>
        <Stack
          direction='row'
          spacing={2}
          justifyContent='flex-end'>
          <Button
            onClick={handleCloseModal}
            variant='outlined'
            color='inherit'
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 100,
              borderColor: '#E60023',
              color: '#E60023',
              '&:hover': {
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(230, 0, 35, 0.04)',
              },
            }}>
            Cancel
          </Button>
          <Button
            onClick={handleBidSubmit}
            variant='contained'
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 100,
              backgroundColor: '#E60023',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
              '&:disabled': {
                backgroundColor: '#ff8080',
              },
            }}>
            {isSubmitting ? 'Submitting...' : 'Place Bid'}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );

  const fmttDate = (dateString) => {
    console.log(dateString); // Debugging output
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      // Format older dates as "DD MMM YYYY, HH:mm AM/PM"
      const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return date.toLocaleString('en-US', options);
    }
  };

  return (
    <Container
      maxWidth='xl'
      sx={{ py: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}>
          <Typography
            variant='h4'
            fontWeight='bold'
            sx={{
              background: '#E60023',
              backgroundImage: 'linear-gradient(45deg, #E60023, #ff1a1a)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
            My Bids
          </Typography>
          <Chip
            icon={<GavelIcon />}
            label={`${bids.length} Active Bids`}
            sx={{
              backgroundColor: '#E60023',
              color: '#ffffff',
              '& .MuiChip-icon': { color: '#ffffff' },
            }}
          />
        </Box>

        {/* Loading State */}
        {loading ? (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress
              sx={{
                borderRadius: 1,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#E60023',
                },
              }}
            />
          </Box>
        ) : (
          <Grid
            container
            spacing={3}>
            {/* Bid Cards */}
            <AnimatePresence>
              {bids.map((item, index) => {
                const bidStatus = getBidStatus(
                  item.latestBidAmount,
                  item.userLatestBidAmount
                );
                const isWinning =
                  Number(item.latestBidAmount) <=
                  Number(item.userLatestBidAmount);

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={index}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}>
                    <StyledCard
                      onClick={() =>
                        navigate(`/detailedProduct/${item.image?._id}`)
                      }>
                      <Box sx={{ position: 'relative' }}>
                        <StyledCardMedia
                          component='img'
                          height={item.image?.isPortrait ? '320' : '240'}
                          image={
                            !item.image
                              ? '/api/placeholder/400/320'
                              : `http://localhost:5050/images/${item.image.image}`
                          }
                          alt={item.image?.imageTitle || 'Bid Image'}
                          className='card-media'
                        />
                        <FloatingTimeChip
                          icon={<ClockIcon />}
                          label={fmttDate(item.image.biddingEndDate)}
                        />
                        <LikesBadge>
                          <FavoriteIcon />
                          <Typography
                            variant='body2'
                            fontWeight='medium'>
                            {item.image?.totalLikes || 0}
                          </Typography>
                        </LikesBadge>
                      </Box>
                      <CardContent>
                        <Typography
                          variant='h6'
                          gutterBottom>
                          {item.image?.imageTitle || `Bid #${item.bidAmount}`}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                          {item.image?.imageDescription ||
                            'Image information not available'}
                        </Typography>

                        <StyledBidInfo iswinning={isWinning}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 2,
                            }}>
                            {bidStatus.icon}
                            <Typography
                              variant='body2'
                              color={isWinning ? 'success.main' : 'error.main'}>
                              {bidStatus.message}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}>
                            <Typography
                              variant='body2'
                              color='text.secondary'>
                              Latest Bid:
                            </Typography>
                            <Typography
                              variant='body2'
                              fontWeight='bold'>
                              {formatCurrency(item.latestBidAmount)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 1,
                            }}>
                            <Typography
                              variant='body2'
                              color='text.secondary'>
                              Your Bid:
                            </Typography>
                            <Typography
                              variant='body2'
                              fontWeight='bold'
                              color={isWinning ? 'success.main' : 'error.main'}>
                              {formatCurrency(item.userLatestBidAmount)}
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}>
                            <Typography
                              variant='caption'
                              color='text.secondary'>
                              Bid Time:
                            </Typography>
                            <Typography variant='caption'>
                              {formatDate(item.userLatestBidDate)}
                            </Typography>
                          </Box>
                        </StyledBidInfo>

                        <BidButton
                          fullWidth
                          variant='contained'
                          iswinning={isWinning.toString()}
                          startIcon={<GavelIcon />}
                          endIcon={!isWinning && <ArrowForwardIcon />}
                          onClick={(e) => handleOpenModal(item, e)}>
                          {isWinning ? 'Currently Winning' : 'Increase Bid'}
                        </BidButton>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                );
              })}
            </AnimatePresence>
          </Grid>
        )}
      </Box>

      {/* Render Bid Modal */}
      {renderBidModal()}

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
    </Container>
  );
};

export default MyBids;
