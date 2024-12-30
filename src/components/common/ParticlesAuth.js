import React from 'react';
import bgImg from '../../assets/images/bg.jpg';
import withRouter from './withRouter';

const ParticlesAuth = ({ children }) => {
  return (
    <React.Fragment>
      <div
        className='auth-page-wrapper'
        style={{ position: 'relative' }}>
        <div
          className='auth-one-bg-position'
          id='auth-particles'
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '65vh',
            position: 'relative', // Ensure the SVG is positioned relative to this container
            overflow: 'hidden', // Prevents the SVG from overflowing
          }}>
          {/* The SVG to create the cut */}
          <div
            className='svg-shape'
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              zIndex: 1, // Keeps the SVG below the content
            }}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              version='1.1'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              viewBox='0 0 1440 120'>
              <path
                d='M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z'
                fill='#fff' // Adjust color as needed
              ></path>
            </svg>
          </div>
        </div>

        {/* Children content should remain above the SVG */}
        <div
          className='content-wrapper'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2, // Ensure the content is above the SVG
          }}>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ParticlesAuth);
