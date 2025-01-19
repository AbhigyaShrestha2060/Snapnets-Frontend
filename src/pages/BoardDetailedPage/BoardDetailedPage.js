import { Heart, X } from 'lucide-react'; // Import the X icon for the Cross button
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams to get the board ID from the route
import {
  addBidApi,
  deleteImageFromBoard,
  getBoardById,
  likeImageApi,
} from '../../api/api'; // Import the delete API function
import AddBids from '../../components/common/AddBids';
import './BoardDetailedPage.css';

const BoardDetailedPage = () => {
  const [board, setBoard] = useState(null); // State to store board data
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null); // Track which image is being bid on
  const navigate = useNavigate();
  const { id } = useParams(); // Get the board ID from the route parameters

  useEffect(() => {
    // Fetch the board data by ID
    getBoardById(id)
      .then((res) => {
        setBoard(res.data.board); // Store the board data in state
      })
      .catch((err) => {
        console.error('Error fetching board data:', err);
      });
  }, [id]);

  const toggleLike = async (index) => {
    const image = board.lists[index];
    const imageId = image._id;
    try {
      await likeImageApi(imageId); // Call the API to toggle like status

      // Update the like status locally
      setBoard((prevBoard) => ({
        ...prevBoard,
        lists: prevBoard.lists.map((img, i) =>
          i === index
            ? {
                ...img,
                totalLikes: img.isLikedByUser
                  ? img.totalLikes - 1
                  : img.totalLikes + 1,
                isLikedByUser: !img.isLikedByUser,
              }
            : img
        ),
      }));
    } catch (error) {
      console.error('Error liking the image:', error);
    }
  };

  const handleNavigation = (imageId) => {
    navigate(`/detailedProduct/${imageId}`);
  };

  const openBidModal = (imageId) => {
    setSelectedImageId(imageId); // Set the selected image ID
    setShowBidModal(true); // Open the bid modal
  };

  const handleBidSubmit = async (bidData) => {
    try {
      const response = await addBidApi(bidData); // Submit the bid via API
      console.log('Bid submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting the bid:', error);
    }
  };

  const removeImageFromBoard = async (imageId) => {
    try {
      // Call the API to remove the image
      await deleteImageFromBoard({ boardId: id, imageId }); // Pass the board ID and image ID to the API

      // Update the local state to remove the image
      setBoard((prevBoard) => ({
        ...prevBoard,
        lists: prevBoard.lists.filter((img) => img._id !== imageId),
      }));
    } catch (error) {
      console.error('Error removing image from board:', error);
    }
  };

  if (!board) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }

  return (
    <div className='gallery-container'>
      <h1>{board.title}</h1> {/* Display the board title */}
      <div className='masonry-grid'>
        {board.lists.map((image) => (
          <div
            key={image._id}
            className={`masonry-item ${
              image.isPortrait ? 'portrait' : 'landscape'
            }`}>
            <div
              className='image-container'
              onClick={() => handleNavigation(image._id)}>
              <img
                src={`http://localhost:5050/images/${image.image}`}
                alt={image.imageTitle}
                className='gallery-image'
              />
              <div className='overlay'>
                <h3 className='title'>{image.imageTitle}</h3>
                <p className='description'>{image.imageDescription}</p>
                <div className='action-buttons'>
                  <button
                    className={`like-btn ${image.isLikedByUser ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(board.lists.indexOf(image));
                    }}>
                    <Heart
                      size={24}
                      className={image.isLikedByUser ? 'heart-filled' : ''}
                    />
                    {image.totalLikes}
                  </button>
                  <button
                    className='bid-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      openBidModal(image._id);
                    }}>
                    Bid Now
                  </button>
                  <button
                    className='remove-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImageFromBoard(image._id); // Remove the image from the board
                    }}>
                    <X size={24} /> {/* Cross icon */}
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
        handleClose={() => setShowBidModal(false)}
        handleBidSubmit={handleBidSubmit}
        imageId={selectedImageId}
      />
    </div>
  );
};

export default BoardDetailedPage;
