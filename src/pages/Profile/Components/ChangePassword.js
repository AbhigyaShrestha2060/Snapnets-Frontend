import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { changePassword } from '../../../api/api';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '500px',
  margin: 'auto',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error when user starts typing
    setErrors({ ...errors, [field]: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate old password
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Old password is required';
      isValid = false;
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Check if new password is same as old password
    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword =
        'New password must be different from old password';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const data = {
        currentPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };

      const response = await changePassword(data);

      if (response.data.success) {
        toast.success('Password changed successfully!');
        // Clear form
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to change password!');
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordField = (field, label, placeholder) => (
    <TextField
      fullWidth
      label={label}
      type={showPasswords[field] ? 'text' : 'password'}
      placeholder={placeholder}
      value={formData[field]}
      onChange={handleChange(field)}
      error={!!errors[field]}
      helperText={errors[field]}
      InputProps={{
        startAdornment: (
          <InputAdornment position='start'>
            <LockIcon color='action' />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              onClick={() => togglePasswordVisibility(field)}
              edge='end'>
              {showPasswords[field] ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );

  return (
    <StyledCard>
      <CardContent>
        <Box
          component='form'
          onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box textAlign='center'>
              <Typography
                variant='h5'
                fontWeight='bold'
                gutterBottom>
                Change Password
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'>
                Please enter your old password and choose a new one
              </Typography>
            </Box>

            {renderPasswordField(
              'oldPassword',
              'Old Password',
              'Enter your current password'
            )}
            {renderPasswordField(
              'newPassword',
              'New Password',
              'Enter your new password'
            )}
            {renderPasswordField(
              'confirmPassword',
              'Confirm Password',
              'Confirm your new password'
            )}

            <Button
              type='submit'
              variant='contained'
              size='large'
              disabled={loading}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
              }}>
              {loading ? (
                <CircularProgress
                  size={24}
                  color='inherit'
                />
              ) : (
                'Change Password'
              )}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ChangePassword;
