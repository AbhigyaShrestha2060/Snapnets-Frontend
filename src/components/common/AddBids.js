import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { addBidApi } from '../../api/api';

const AddBids = ({ show, onClose, bid, currentBid, itemTitle }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setErrorMessage('Please enter a valid bid amount.');
      return;
    }

    if (parseFloat(bidAmount) <= currentBid) {
      setErrorMessage('Your bid must be higher than the current bid.');
      return;
    }

    try {
      const bidData = {
        imageId: bid.image?._id,
        bidAmount: parseFloat(bidAmount),
      };

      const response = await addBidApi(bidData);

      setSuccessMessage('Bid submitted successfully!');
      setErrorMessage('');

      setBidAmount('');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting bid:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      tabIndex='-1'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Place Your Bid</h5>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}></button>
          </div>
          <div className='modal-body'>
            <p>
              <strong>Item:</strong> {itemTitle || 'N/A'}
            </p>
            <p>
              <strong>Current Bid:</strong>{' '}
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'NPR',
              }).format(currentBid)}
            </p>
            <div className='mb-3'>
              <label
                htmlFor='bidAmount'
                className='form-label'>
                Enter Your Bid Amount
              </label>
              <input
                type='number'
                id='bidAmount'
                className='form-control'
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder='Enter amount higher than current bid'
              />
            </div>
            {errorMessage && (
              <div className='alert alert-danger'>{errorMessage}</div>
            )}
            {successMessage && (
              <div className='alert alert-success'>{successMessage}</div>
            )}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}>
              Cancel
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={onSubmit}>
              Submit Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AddBids.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bid: PropTypes.object.isRequired,
  currentBid: PropTypes.number.isRequired,
  itemTitle: PropTypes.string,
};

export default AddBids;
