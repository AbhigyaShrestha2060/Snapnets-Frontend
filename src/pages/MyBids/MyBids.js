// MyBids.jsx
import React, { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFire,
  FaGavel,
  FaHeart,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getBidsApi } from '../../api/api';
import AddBids from '../../components/common/AddBids';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getBidsApi()
      .then((res) => {
        setBids(res.data.bids);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOpenModal = (bid) => {
    setSelectedBid(bid);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBid(null);
  };

  const getBidStatus = (latestBid, userBid) => {
    const latestBidAmount = Number(latestBid);
    const userBidAmount = Number(userBid);

    if (latestBidAmount > userBidAmount) {
      return {
        containerClass: 'bg-danger bg-opacity-10',
        textClass: 'text-danger',
        icon: <FaExclamationTriangle className='me-2' />,
        message: 'Your bid is lower than the current bid',
      };
    }
    return {
      containerClass: 'bg-success bg-opacity-10',
      textClass: 'text-success',
      icon: <FaCheckCircle className='me-2' />,
      message: 'Your bid is currently winning',
    };
  };

  const handleNavigation = (id) => {
    navigate(`/detailedProduct/${id}`);
  };

  const getImageStyles = (isPortrait) => {
    const baseStyles = {
      width: '100%',
      objectFit: 'cover',
    };

    return {
      ...baseStyles,
      height: isPortrait ? '300px' : '200px',
      objectPosition: 'center',
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className='container-fluid p-4'>
        <div className='row g-4'>
          {/* Featured/Trending Card */}
          <div className='col-12 col-md-6 col-lg-3'>
            <div className='card h-100 border-0 rounded-4 bg-light shadow-sm'>
              <div className='card-body p-3'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <div className='d-flex align-items-center'>
                    <FaFire className='text-warning me-2' />
                    <span className='fw-bold'>Trending</span>
                  </div>
                  <span className='badge bg-danger px-2 py-1'>
                    <FaHeart className='me-1' />
                    25k
                  </span>
                </div>
                <img
                  src={'/assets/images/bg.jpg'}
                  alt='trending'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '600px',
                    objectFit: 'cover',
                  }}
                />

                <h6 className='mb-2'>Golden Art</h6>
                <div className='d-flex justify-content-between small mb-2'>
                  <span>Current Bid: {formatCurrency(45000)}</span>
                </div>
                <div className='d-flex justify-content-between small mb-3'>
                  <span>Item Left: 5</span>
                  <div className='d-flex align-items-center text-warning'>
                    <FaClock className='me-1' />
                    <span>10:10</span>
                  </div>
                </div>
                <button
                  className='btn btn-danger w-100 rounded-3'
                  onClick={() =>
                    handleOpenModal({
                      image: {
                        _id: 'trending-001',
                        imageTitle: 'Golden Art',
                      },
                      latestBidAmount: 45000,
                    })
                  }>
                  Add Your Bid
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {bids.map((item, index) => {
            const bidStatus = getBidStatus(
              item.latestBidAmount,
              item.userLatestBidAmount
            );

            const isWinning =
              Number(item.latestBidAmount) <= Number(item.userLatestBidAmount);

            return (
              <div
                key={index}
                className='col-12 col-md-6 col-lg-3'>
                <div
                  className='card h-100 border-0 rounded-4 shadow-sm hover-lift'
                  onClick={() => handleNavigation(item.image?._id)}
                  style={{ cursor: 'pointer' }}>
                  <div className='position-relative'>
                    <img
                      src={
                        !item.image
                          ? '/api/placeholder/400/320'
                          : `http://localhost:5050/images/${item.image.image}`
                      }
                      className='card-img-top rounded-4'
                      alt={item.image?.imageTitle || 'Bid Image'}
                      style={getImageStyles(item.image?.isPortrait)}
                    />
                    <div className='position-absolute top-0 start-0 m-3'>
                      <div className='badge bg-light text-dark px-3 py-2 rounded-pill d-flex align-items-center'>
                        <FaClock className='text-danger me-1' />
                        <span>10:10</span>
                      </div>
                    </div>
                    <div className='position-absolute top-0 end-0 m-3'>
                      <span className='badge bg-light text-danger px-2 py-2 rounded-pill'>
                        <FaHeart /> {item.image?.totalLikes || 0}
                      </span>
                    </div>
                  </div>

                  <div className='card-body p-3'>
                    <h6 className='mb-2'>
                      {item.image?.imageTitle || `Bid #${item.bidAmount}`}
                    </h6>
                    <div className='small mb-3'>
                      <p className='text-muted mb-1'>
                        {item.image?.imageDescription ||
                          'Image information not available'}
                      </p>
                    </div>

                    <div
                      className={`p-2 rounded-3 mb-3 ${bidStatus.containerClass}`}>
                      <div className='d-flex align-items-center small mb-2'>
                        {bidStatus.icon}
                        <span className={bidStatus.textClass}>
                          {bidStatus.message}
                        </span>
                      </div>
                      <div className='d-flex justify-content-between small mb-1'>
                        <span>Latest Bid:</span>
                        <span className='fw-bold'>
                          {formatCurrency(item.latestBidAmount)}
                        </span>
                      </div>
                      <div className='d-flex justify-content-between small'>
                        <span>Your Bid:</span>
                        <span className={`fw-bold ${bidStatus.textClass}`}>
                          {formatCurrency(item.userLatestBidAmount)}
                        </span>
                      </div>
                      <div className='d-flex justify-content-between small mt-1'>
                        <span className='text-muted'>Bid Time:</span>
                        <span>{formatDate(item.userLatestBidDate)}</span>
                      </div>
                    </div>

                    <button
                      className={`btn ${
                        !isWinning ? 'btn-danger' : 'btn-success'
                      } w-100 rounded-3 d-flex align-items-center justify-content-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(item);
                      }}>
                      <FaGavel className='me-2' />
                      {!isWinning ? 'Increase Bid' : 'Currently Winning'}
                      {!isWinning && <FaArrowRight className='ms-2' />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Bids Modal */}
      {showModal && (
        <AddBids
          show={showModal}
          onClose={handleCloseModal}
          bid={selectedBid}
          currentBid={selectedBid?.latestBidAmount}
          itemTitle={selectedBid?.image?.imageTitle}
        />
      )}
    </>
  );
};

export default MyBids;
