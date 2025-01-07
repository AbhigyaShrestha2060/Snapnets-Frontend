import { Heart, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLikedImageByUser, likeImageApi } from '../../api/api'; // Ensure you import the likeImageApi function
import './LikedImages.css';

const LikedImages = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLikedImageByUser()
      .then((res) => {
        setImages(res.data.images);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleLike = async (index) => {
    const image = images[index];
    const id = image._id;
    try {
      // Call the likeImageApi to update the like status on the server
      await likeImageApi(id); // Pass the image ID to the API function

      // Update the like status on the client-side
      setImages((prevImages) =>
        prevImages.map((img, i) =>
          i === index ? { ...img, isLikedByUser: !img.isLikedByUser } : img
        )
      );
    } catch (error) {
      console.log('Error liking the image:', error);
    }
  };

  const handleNavigation = (index) => {
    navigate(`/detailedProduct/${index}`);
  };

  return (
    <div className='gallery-container'>
      <h1 className='gallery-title text-center'>Liked Images</h1>
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
                    className={`like-btn ${image.isLikedByUser ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(index);
                    }}>
                    <Heart
                      size={24}
                      className={image.isLikedByUser ? 'heart-filled' : ''}
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

export default LikedImages;
