import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';

const ChangePassword = () => {
  return (
    <Card
      className='p-4 shadow rounded'
      style={{ maxWidth: '800px', margin: 'auto' }}>
      <h3 className='text-center mb-4'>Change Password</h3>
      <Form>
        {/* Password Fields */}
        <div className='mb-3'>
          {/* Old Password */}
          <Form.Group
            controlId='oldPassword'
            className='mb-3'>
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter Old Password'
              className='w-100'
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
              className='w-100'
            />
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm Your Password'
              className='w-100'
            />
          </Form.Group>
        </div>

        {/* Submit Button */}
        <div className='d-flex justify-content-end mt-4'>
          <Button
            variant='success'
            type='submit'>
            Change Password
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ChangePassword;
