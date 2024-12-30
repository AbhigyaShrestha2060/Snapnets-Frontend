import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import logo from '../../assets/images/Logo.png';

const Navbar = () => {
  const [notifications] = useState([
    'New bid on your post',
    'Your post was liked',
    'You have a new follower',
    'Notification 4',
    'Notification 5',
    'Notification 6',
    'Notification 7',
    'Notification 8',
  ]);

  return (
    <nav
      className='navbar navbar-expand-lg navbar-light'
      style={{ backgroundColor: '#E60023', padding: '0.5rem' }}>
      <div className='container-fluid'>
        {/* Logo on the Left */}
        <a
          className='navbar-brand d-flex align-items-center'
          href='/'
          style={{ color: 'white' }}>
          <img
            src={logo}
            alt='Logo'
            style={{
              height: '75px',
              width: '75px',
              backgroundColor: 'white',
              borderRadius: '5px',
              padding: '5px',
            }}
          />
        </a>

        {/* Toggle Button for Small Screens */}
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>

        {/* Centered Navigation Items */}
        <div
          className='collapse navbar-collapse'
          id='navbarNav'>
          <div className='navbar-nav mx-auto'>
            <a
              href='/'
              className='nav-link text-white mx-3'>
              <i
                className='bi bi-house'
                style={{ fontSize: '1.5rem' }}></i>{' '}
              Home
            </a>
            <a
              href='#'
              className='nav-link text-white mx-3'>
              <i
                className='bi bi-heart'
                style={{ fontSize: '1.5rem' }}></i>{' '}
              Liked
            </a>
            <a
              href='#'
              className='nav-link text-white mx-3'>
              <i
                className='bi bi-search'
                style={{ fontSize: '1.5rem' }}></i>{' '}
              Search
            </a>
            <a
              href='#'
              className='nav-link text-white mx-3'>
              <i
                className='bi bi-currency-rupee'
                style={{ fontSize: '1.5rem' }}></i>{' '}
              My Bids
            </a>
            <a
              href='#'
              className='nav-link text-white mx-3'>
              <i
                className='bi bi-collection'
                style={{ fontSize: '1.5rem' }}></i>{' '}
              Boards
            </a>
          </div>
        </div>

        {/* Notification and Profile Icons on the Right */}
        <div className='d-flex align-items-center'>
          {/* Notification Dropdown */}
          <div className='dropdown'>
            <a
              href='#'
              className='nav-link text-white mx-3 dropdown-toggle'
              id='notificationDropdown'
              role='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'>
              <i
                className='bi bi-bell'
                style={{ fontSize: '1.5rem' }}></i>
            </a>
            <ul
              className='dropdown-menu dropdown-menu-end'
              aria-labelledby='notificationDropdown'
              style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {notifications.map((notification, index) => (
                <li key={index}>
                  <a
                    className='dropdown-item'
                    href='#'>
                    {notification}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className='dropdown'>
            <a
              href='#'
              className='nav-link text-white mx-3 dropdown-toggle'
              id='profileDropdown'
              role='button'
              data-bs-toggle='dropdown'
              aria-expanded='false'>
              <i
                className='bi bi-person'
                style={{ fontSize: '1.5rem' }}></i>
            </a>
            <ul
              className='dropdown-menu dropdown-menu-end'
              aria-labelledby='profileDropdown'>
              <li>
                <a
                  className='dropdown-item'
                  href='#'>
                  View Profile
                </a>
              </li>
              <li>
                <a
                  className='dropdown-item'
                  href='#'>
                  Settings
                </a>
              </li>
              <li>
                <hr className='dropdown-divider' />
              </li>
              <li>
                <a
                  className='dropdown-item'
                  href='#'>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
