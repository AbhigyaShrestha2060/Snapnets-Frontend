import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';
import image from '../../../assets/images/bg.jpg';

const UpdateProfile = () => {
  return (
    <div className='d-flex bg-white p-4 rounded shadow-sm'>
      {/* Left Section: Form */}
      <div className='flex-grow-1'>
        <h3 className='mb-4'>Update Profile</h3>
        <Form>
          {/* Username */}
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              value='@abc_123'
              readOnly
            />
          </Form.Group>

          {/* Email */}
          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              value='email@gmail.com'
            />
          </Form.Group>

          {/* Phone Number */}
          <Form.Group className='mb-3'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              value='+977 9876543210'
            />
          </Form.Group>

          {/* Submit Button */}
          <Button
            variant='primary'
            type='submit'>
            Save Changes
          </Button>
        </Form>
      </div>

      {/* Right Section: Profile Image */}
      <div className='d-flex flex-column align-items-center justify-content-center ms-5'>
        <div className='position-relative'>
          {/* Profile Image */}
          <img
            src={image}
            alt='Profile'
            className='rounded-circle'
            style={{ width: '250px', height: '250px', objectFit: 'cover' }}
          />
          {/* Camera Icon */}
          <div
            className='position-absolute bg-primary rounded-circle d-flex align-items-center justify-content-center'
            style={{
              width: '50px',
              height: '50px',
              bottom: '10px', // Moves the icon up within the image
              right: '10px', // Moves the icon left within the image
              cursor: 'pointer',
            }}>
            <FaCamera color='white' />
          </div>
        </div>
        <p className='mt-3 text-muted'>Change Profile Picture</p>
      </div>
    </div>
  );
};

export default UpdateProfile;
