import React from 'react';
import img1 from '../../assets/images/Logo.png';
import img2 from '../../assets/images/bg.jpg';

const Board = () => {
  // Static collections data with your provided images
  const collections = [
    {
      name: 'Board Name 1',
      images: [img2, img2, img1],
    },
    {
      name: 'Board Name 2',
      images: [img1, img1, img2],
    },
    {
      name: 'Board Name 3',
      images: [img1, img2, img1],
    },
  ];

  return (
    <div className='container mt-5'>
      {/* Boards Grid */}
      <div className='row gy-4'>
        {collections.map((collection, index) => (
          <div
            className='col-md-3' // Adjust column width for smaller boards
            key={index}>
            <div className='card border-0'>
              {/* Images Grid */}
              <div className='card-body p-0'>
                <div>
                  {/* Top Image */}
                  <div>
                    <img
                      src={collection.images[0]}
                      alt={`Board ${collection.name} - 1`}
                      className='img-fluid w-100'
                      style={{
                        height: '120px', // Reduce height of the top image
                        objectFit: 'cover',
                        margin: '0', // Remove margin
                      }}
                    />
                  </div>
                  {/* Bottom Images */}
                  <div className='row gx-0 gy-0 mt-0'>
                    {' '}
                    {/* Remove gaps */}
                    {collection.images.slice(1, 3).map((image, imgIndex) => (
                      <div
                        className='col-6'
                        key={imgIndex}>
                        <img
                          src={image}
                          alt={`Board ${collection.name} - ${imgIndex + 2}`}
                          className='img-fluid w-100'
                          style={{
                            height: '200px', // Portrait height for bottom images
                            objectFit: 'cover',
                            margin: '0', // Remove margin
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Board Name */}
              <div className='card-footer bg-white border-0 text-center'>
                <h5 className='fw-bold mb-0'>{collection.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
