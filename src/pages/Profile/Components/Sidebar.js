import React from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import img from '../../../assets/images/bg.jpg';

const Sidebar = ({ setActiveComponent }) => {
  return (
    <div
      className='d-flex flex-column justify-item-center text-white'
      style={{ width: '100%', maxWidth: '300px' }}>
      {/* Profile Section */}
      <Card
        className='mb-4 text-center shadow rounded justify-item-center'
        style={{ border: 'none' }}>
        <Card.Body>
          <Image
            src={img}
            roundedCircle
            className='mb-3'
            style={{ width: '150px', height: '150px' }}
          />
          <h5 className='text-dark'>@abc_123</h5>
          <p className='text-muted mb-1'>Followers: 10 | Following: 99</p>
          <p className='text-dark'>₹9,99,999</p>
        </Card.Body>
      </Card>

      {/* Navigation Links */}
      <Card
        className='shadow rounded text-dark mb-4'
        style={{ border: 'none' }}>
        <Card.Body className='p-2'>
          <Button
            variant='light'
            className='text-start w-100 mb-2 rounded-pill'
            onClick={() => setActiveComponent('update-profile')}>
            Update Profile
          </Button>
          <Button
            variant='light'
            className='text-start w-100 mb-2 rounded-pill'
            onClick={() => setActiveComponent('change-password')}>
            Change Password
          </Button>
          <Button
            variant='light'
            className='text-start w-100 mb-2 rounded-pill'
            onClick={() => setActiveComponent('view-profile-details')}>
            View Profile Details
          </Button>
          <Button
            variant='light'
            className='text-start w-100 mb-2 rounded-pill'
            onClick={() => setActiveComponent('delete-account')}>
            Delete Account
          </Button>
        </Card.Body>
      </Card>

      {/* Logout */}
      <Button
        variant='danger'
        className='text-start mt-auto w-100 rounded-pill shadow'>
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
