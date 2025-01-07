import React, { useEffect } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ setActiveComponent, user }) => {
  const navigate = useNavigate();
  const [isGoogleUser, setIsGoogleUser] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const handleViewProfileDetails = () => {
    navigate('/myUploads');
  };

  useEffect(() => {
    setIsGoogleUser(user?.isGoogleUser);
  }, [user]);

  return (
    <div
      className='d-flex flex-column text-white p-3'
      style={{ width: '100%', maxWidth: '500px' }}>
      {/* Profile Section */}
      <Card
        className='mb-4 text-center shadow rounded'
        style={{ border: 'none' }}>
        <Card.Body>
          <Image
            src={
              user?.profilePicture
                ? `http://localhost:5050/${user?.profilePicture}`
                : '/assets/images/bg.jpg'
            }
            alt={user?.username}
            roundedCircle
            className='mb-3'
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
          <h5 className='text-dark'>@{user?.username || 'Guest'}</h5>
          <p className='text-muted mb-1'>
            Followers: {user?.followers || 0} | Following:{' '}
            {user?.following || 0}
          </p>
          <p className='text-dark'>₹{user?.balance || '0'}</p>
        </Card.Body>
      </Card>

      {/* Navigation Links */}
      <Card
        className='shadow rounded text-dark mb-4'
        style={{ border: 'none' }}>
        <Card.Body className='p-2'>
          <Button
            variant='light'
            className='text-center w-100 mb-2 rounded-pill'
            onClick={() => setActiveComponent('update-profile')}>
            Update Profile
          </Button>
          <Button
            variant='light'
            className='text-center w-100 mb-2 rounded-pill'
            onClick={() => setActiveComponent('change-password')}>
            Change Password
          </Button>
          <Button
            variant='light'
            className='text-center w-100 mb-2 rounded-pill'
            onClick={() => handleViewProfileDetails()}>
            View My Uploads
          </Button>
          <Button
            variant='light'
            className='text-center w-100 mb-2 rounded-pill'
            onClick={() => setActiveComponent('delete-account')}>
            Delete Account
          </Button>
        </Card.Body>
      </Card>

      {/* Logout */}
      <Button
        variant='danger'
        className='text-center mt-auto w-100 rounded-pill shadow'
        onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
