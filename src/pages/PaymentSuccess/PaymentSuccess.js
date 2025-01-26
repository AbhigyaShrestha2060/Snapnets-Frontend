import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addBalance } from '../../api/api';

const PaymentSuccess = () => {
  const location = useLocation();

  // Parse query parameters
  const { orderId, amount, pidx } = queryString.parse(location.search);
  // Handler to navigate back to the home page or orders
  const handleGoToOrders = () => {
    window.location.href = '/profile';
  };
  useEffect(() => {
    console.log({ orderId, amount, pidx });

    addBalance({ amount: amount / 100, pidx })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderId, amount, pidx]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        padding: 3,
      }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 500,
          textAlign: 'center',
        }}>
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 80,
            color: 'green',
            marginBottom: 2,
          }}
        />
        <Typography
          variant='h4'
          gutterBottom>
          Payment Successful!
        </Typography>
        <Typography
          variant='body1'
          sx={{ marginBottom: 2 }}>
          Your payment was completed successfully. Below are the details:
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        <Typography variant='subtitle1'>
          <strong>Amount Paid:</strong> NPR {amount / 100}
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        <Button
          variant='contained'
          color='primary'
          onClick={handleGoToOrders}
          sx={{ marginTop: 2 }}>
          Go Back
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentSuccess;
