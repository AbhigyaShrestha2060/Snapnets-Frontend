import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getImageById } from '../../api/api';
import AddBids from '../../components/common/AddBids';

const DetailedProduct = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const [textareaInput, setTextareaInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

  // Fetch product details using API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getImageById(id);
        const {
          image,
          imageTitle,
          imageDescription,
          isPortrait,
          uploadDate,
          totalLikes,
          uploadedBy,
        } = response.data.image;

        setProduct({
          image: image,
          title: imageTitle,
          description: imageDescription,
          isPortrait: isPortrait,
          date: new Date(uploadDate).toLocaleDateString(),
          likes: totalLikes,
          creator: uploadedBy.username,
          rating: 4,
          price: 'Rs 5000',
          highestBid: 'Rs 10,000',
          stockLeft: '25/50 sold',
          auctionEnd: '10:10:10',
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleTextareaChange = (e) => {
    setTextareaInput(e.target.value);
  };

  const handleTextareaSubmit = () => {
    if (textareaInput.trim()) {
      console.log('Textarea content submitted:', textareaInput);
      setTextareaInput('');
    }
  };

  const handleViewComment = () => {
    navigate(`/comment/${id}`);
  };

  const handleBidSubmit = ({ imageId, bidAmount }) => {
    console.log('Bid Submitted:', { imageId, bidAmount });
    // Add API call or logic to handle bid submission
    setModalVisible(false);
  };

  return (
    <div className='container mt-5'>
      <div className='row align-items-center'>
        {/* Left Side: Image */}
        <div className='col-md-5 d-flex flex-column align-items-center'>
          {loading ? (
            <div
              className='spinner-border text-danger'
              role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          ) : error ? (
            <div className='text-danger'>{error}</div>
          ) : (
            <img
              src={`http://localhost:5050/images/${product.image}`}
              alt={product.title}
              className='rounded'
              style={{
                width: product.isPortrait ? '300px' : '500px',
                height: product.isPortrait ? '500px' : '300px',
                objectFit: 'cover',
              }}
            />
          )}
          <button
            className='btn btn-danger mt-3 w-75'
            onClick={() => setModalVisible(true)}>
            Place Bid
          </button>
        </div>

        {/* Right Side: Details */}
        <div className='col-md-7'>
          <div className='card p-4'>
            <div className='d-flex justify-content-between mb-3'>
              <p>
                <i className='bi bi-heart-fill text-danger'></i> {product.likes}{' '}
                people liked this
              </p>
              <a
                onClick={handleViewComment}
                className='text-decoration-none'>
                <i className='bi bi-chat-left-text'></i> View Comments
              </a>
            </div>

            <h5 className='card-title mb-3'>{product.title}</h5>
            <p className='card-text mb-2'>
              Creator: {product.creator} &#x24B8;
            </p>
            <p className='card-text mb-2'>Published Date: {product.date}</p>
            <div className='mb-3'>
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`bi ${
                    i < product.rating ? 'bi-star-fill' : 'bi-star'
                  } text-warning`}></i>
              ))}
            </div>

            <div className='row mb-3'>
              <div className='col'>
                <p className='mb-1'>Price</p>
                <h6>{product.price}</h6>
              </div>
              <div className='col'>
                <p className='mb-1'>Highest Bid</p>
                <h6>{product.highestBid}</h6>
              </div>
              <div className='col'>
                <p className='mb-1'>Stock Left</p>
                <h6>{product.stockLeft}</h6>
              </div>
              <div className='col'>
                <p className='mb-1'>Auction End</p>
                <h6>{product.auctionEnd}</h6>
              </div>
            </div>

            <p className='card-text'>Description</p>
            <p>{product.description}</p>

            {/* Textarea with Submit Button Inside */}
            <div className='position-relative'>
              <textarea
                className='form-control pe-5'
                placeholder='Type Something...'
                rows='2'
                value={textareaInput}
                onChange={handleTextareaChange}
                style={{ paddingRight: '75px' }}></textarea>
              {textareaInput && (
                <button
                  className='btn btn-primary position-absolute top-50 end-0 translate-middle-y me-2'
                  onClick={handleTextareaSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      <AddBids
        show={isModalVisible}
        handleClose={() => setModalVisible(false)}
        handleBidSubmit={handleBidSubmit}
        imageId={id}
      />
    </div>
  );
};

export default DetailedProduct;
