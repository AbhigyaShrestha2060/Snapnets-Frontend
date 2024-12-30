import { Heart, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImagesApi } from '../../api/api';
import './Homepage.css';

const Homepage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getImagesApi()
      .then((res) => {
        setImages(res.data.images);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleLike = (index) => {
    setImages((prevImages) =>
      prevImages.map((image, i) =>
        i === index ? { ...image, isLiked: !image.isLiked } : image
      )
    );
  };

  const handleNavigation = (index) => {
    navigate(`/detailedProduct/${index}`);
  };

  return (
    <div className='gallery-container'>
      <div className='masonry-grid'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`masonry-item ${
              image.isPortrait ? 'portrait' : 'landscape'
            }`}>
            <div
              className='image-container'
              onClick={() => handleNavigation(image._id)}>
              <img
                src={`http://localhost:5050/images/${image.image}`}
                alt={`Image ${index + 1}`}
                className='gallery-image'
              />
              <div className='overlay'>
                <h3 className='title'>{image.imageTitle}</h3>
                <div className='action-buttons'>
                  <button
                    className={`like-btn ${image.isLiked ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(index);
                    }}>
                    <Heart
                      size={24}
                      className={image.isLiked ? 'heart-filled' : ''}
                    />
                  </button>
                  <button
                    className='bid-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Bid Now clicked');
                    }}>
                    Bid Now
                  </button>
                  <button
                    className='add-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Add clicked');
                    }}>
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
