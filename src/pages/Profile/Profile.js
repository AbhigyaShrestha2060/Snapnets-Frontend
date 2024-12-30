import React, { useState } from 'react';
import ChangePassword from './Components/ChangePassword';
import DeleteAccount from './Components/DeleteAccount';
import Sidebar from './Components/Sidebar';
import UpdateProfile from './Components/UpdateProfile';

function Profile() {
  const [activeComponent, setActiveComponent] = useState('update-profile');

  const renderContent = () => {
    switch (activeComponent) {
      case 'update-profile':
        return <UpdateProfile />;
      case 'change-password':
        return <ChangePassword />;
      case 'delete-account':
        return <DeleteAccount />;
      default:
        return <UpdateProfile />;
    }
  };

  return (
    <div className='container-fluid vh-100 d-flex flex-column'>
      <div className='row flex-grow-1'>
        {/* Profile Section */}
        <div className='col-12 d-md-none'>
          <Sidebar
            setActiveComponent={setActiveComponent}
            profileOnly={true}
          />
        </div>

        {/* Sidebar (for larger screens) */}
        <div className='col-md-3 d-none d-md-flex flex-column bg-white text-white'>
          <Sidebar setActiveComponent={setActiveComponent} />
        </div>

        {/* Main Content */}
        <div className='col-12 col-md-9 bg-light'>
          <div className='p-4'>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
