import { Heart, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBidApi, getImageByLike, likeImageApi } from '../../api/api'; // Ensure you import the API functions
import AddBids from '../../components/common/AddBids';
import './Homepage.css';

const Homepage = () => {
  const [images, setImages] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null); // For tracking which image is being bid on
  const navigate = useNavigate();

  useEffect(() => {
    getImageByLike()
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

  const openBidModal = (imageId) => {
    setSelectedImageId(imageId); // Set the image ID for the bid
    setShowBidModal(true); // Show the bid modal
  };

  const handleBidSubmit = async (bidData) => {
    try {
      const response = await addBidApi(bidData); // Call the API to submit the bid
      console.log('Bid submitted successfully:', response.data);
      // You can add additional logic, like refreshing bid info or showing a success message
    } catch (error) {
      console.error('Error submitting the bid:', error);
    }
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
                      openBidModal(image._id); // Open bid modal for the clicked image
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

      {/* Bid Modal */}
      <AddBids
        show={showBidModal}
        handleClose={() => setShowBidModal(false)} // Close the modal
        handleBidSubmit={handleBidSubmit} // Handle bid submission
        imageId={selectedImageId} // Pass the selected image ID to the modal
      />
    </div>
  );
};

export default Homepage;
