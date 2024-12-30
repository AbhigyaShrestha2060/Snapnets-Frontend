import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../../assets/images/Logo.png';

const Comment = () => {
  const [commentInput, setCommentInput] = useState('');
  const navigate = useNavigate(); // Hook for navigation
  const product = {
    image: img1,
    title: 'Nature Picture',
    creator: 'abc_123',
    date: '12/11/2024',
    likes: '2.5k',
    isProtrait: true,
    comments: [
      { username: '123_abc', comment: 'Beautiful Scene', image: img1 },
      { username: 'abcfgh', comment: 'I want to go there', image: img1 },
    ],
    price: 'Rs 10,000',
    description: 'This is the product description',
  };

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleSend = () => {
    if (commentInput.trim()) {
      console.log('Comment sent:', commentInput);
      setCommentInput(''); // Clear the input field after sending
    }
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
            src={product.image}
            alt={product.title}
            className='rounded'
            style={{
              width: product.isProtrait ? '300px' : '500px',
              height: product.isProtrait ? '500px' : '300px',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right Side: Details and Comments */}
        <div className='col-md-6'>
          <div className='card p-3'>
            {/* Details */}
            <h5>{product.title}</h5>
            <p>{product.description}</p>
            <p>
              <strong>Price:</strong> {product.price}
            </p>
            <p>
              <i className='bi bi-heart-fill text-danger'></i> {product.likes}{' '}
              Liked <i className='bi bi-chat-left-text'></i>{' '}
              {product.comments.length} Comments
            </p>

            {/* Comment Section */}
            <hr />
            <div className='comments-section'>
              <div className='d-flex mb-3'>
                <img
                  src={img1}
                  alt='User'
                  className='rounded-circle me-2'
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                  }}
                />
                <input
                  type='text'
                  className='form-control me-2'
                  placeholder='Type your comment...'
                  value={commentInput}
                  onChange={handleCommentChange}
                />
                {commentInput && (
                  <button
                    className='btn btn-primary'
                    onClick={handleSend}>
                    Send
                  </button>
                )}
              </div>

              {product.comments.map((comment, index) => (
                <div
                  key={index}
                  className='d-flex mb-3'>
                  <img
                    src={comment.image}
                    alt={comment.username}
                    className='rounded-circle me-2'
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <p className='mb-0'>
                      <strong>{comment.username}</strong>
                    </p>
                    <p className='text-muted'>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
