import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { changePassword } from '../../../api/api';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate form inputs
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in all fields!');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match!');
    }

    if (oldPassword === newPassword) {
      return toast.error(
        'New password cannot be the same as the old password!'
      );
    }

    try {
      setLoading(true); // Start loading
      // Call the ChangePassword API function
      const data = {
        currentPassword: oldPassword,
        newPassword: newPassword,
      };
      const response = await changePassword(data);

      if (response.data.success) {
        toast.success('Password changed successfully!');
      } else {
        toast.error(response.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to change password!');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Card
      className='p-4 shadow rounded'
      style={{ maxWidth: '800px', margin: 'auto' }}>
      <h3 className='text-center mb-4'>Change Password</h3>
      <Form onSubmit={handleSubmit}>
        {/* Old Password */}
        <Form.Group
          controlId='oldPassword'
          className='mb-3'>
          <Form.Label>Old Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Old Password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* New Password */}
        <Form.Group
          controlId='newPassword'
          className='mb-3'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group
          controlId='confirmPassword'
          className='mb-3'>
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Your Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <div className='d-flex justify-content-end mt-4'>
          <Button
            variant='success'
            type='submit'
            disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ChangePassword;
