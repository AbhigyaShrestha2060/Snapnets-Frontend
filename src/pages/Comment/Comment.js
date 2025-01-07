import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCommentApi, getCommentsApi, getMe } from '../../api/api'; // Import addCommentApi

const Comment = () => {
  const [commentInput, setCommentInput] = useState('');
  const { id } = useParams();
  const [images, setImages] = useState({ comments: [] }); // Initialize with empty comments array
  const [visibleComments, setVisibleComments] = useState(3); // Set initial visible comments
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState('');
  useEffect(() => {
    getMe().then((res) => {
      setUserImg(res.data.user.profilePicture);
      console.log('User:', res.data.user.profilePicture);
    });
  }, []);

  useEffect(() => {
    getCommentsApi(id).then((res) => {
      console.log('Comments:', res.data.image);
      setImages(res.data.image); // Update the images state with API response
    });
  }, [id]);

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleSend = async () => {
    if (commentInput.trim()) {
      try {
        // Create the data object for the API call
        const data = {
          imageId: id, // Pass the image ID (from the URL)
          comment: commentInput, // Pass the comment text
        };

        // Call the API to add the comment
        const response = await addCommentApi(data);

        if (response.data.success) {
          console.log('Comment added successfully');
          // Clear the input field after sending
          setCommentInput('');

          // Re-fetch the comments or update the images state to include the new comment
          getCommentsApi(id).then((res) => {
            setImages(res.data.image); // Update the images state with updated comments
          });
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleLoadMore = () => {
    setVisibleComments(visibleComments + 3); // Show 3 more comments
  };

  return (
    <div className='container mt-1'>
      {/* Back Button */}
      <button
        className='btn btn-secondary mb-3'
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        <i className='bi bi-arrow-left'></i> Back
      </button>

      <div className='row align-items-center'>
        {/* Left Side: Full Image */}
        <div
          className='col-md-6 d-flex justify-content-center align-items-center'
          style={{ height: '100%' }}>
          <img
            src={`http://localhost:5050/images/${images.image}`}
            alt={images.imageTitle}
            className='rounded'
            style={{
              width: images.isPortrait ? '300px' : '500px',
              height: images.isPortrait ? '500px' : '300px',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right Side: Details and Comments */}
        <div className='col-md-6'>
          <div className='card p-3'>
            {/* Details */}
            <h5>{images.imageTitle}</h5>
            <p>{images.imageDescription}</p>

            <p>
              <strong>Uploaded At:</strong>{' '}
              {new Date(images.uploadDate).toLocaleString()}{' '}
            </p>
            <p>
              <i className='bi bi-heart-fill text-danger'></i>{' '}
              {images.totalLikes} Liked <i className='bi bi-chat-left-text'></i>{' '}
              {images.comments.length} Comments
            </p>

            {/* Comment Section */}
            <hr />
            <div
              className='comments-section'
              style={{ maxHeight: '400px', overflowY: 'scroll' }}>
              <div
                className='comments-section'
                style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <div className='d-flex mb-3'>
                  <img
                    src={
                      `http://localhost:5050/${userImg}` ||
                      '/assets/images/bg.jpg'
                    }
                    alt={userImg}
                    className='rounded-circle me-2'
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                    }}
                  />
                  <div className='input-group'>
                    <input
                      type='text'
                      className='form-control me-2'
                      placeholder='Type your comment...'
                      value={commentInput}
                      onChange={handleCommentChange}
                    />
                    {commentInput && (
                      <button
                        className='btn btn-danger'
                        onClick={handleSend}>
                        Send
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Comments */}
              {images.comments && images.comments.length > 0 ? (
                images.comments
                  .slice(0, visibleComments)
                  .map((comment, index) => (
                    <div
                      key={index}
                      className='d-flex mb-3'>
                      <img
                        src={
                          `http://localhost:5050/${comment.commentedBy.profilePicture}` ||
                          '/assets/images/bg.jpg'
                        } // Use a default image if no profile picture
                        alt={comment.commentedBy.profilePicture}
                        className='rounded-circle me-2'
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <p className='mb-0'>
                          <strong>{comment.commentedBy.username}</strong>
                        </p>
                        <p className='text-muted'>{comment.comment}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No comments yet.</p> // Display a message if no comments are present
              )}
            </div>

            {/* Load More Button */}
            {images.comments.length > visibleComments && (
              <button
                className='btn btn-link'
                onClick={handleLoadMore}>
                Load More Comments
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
