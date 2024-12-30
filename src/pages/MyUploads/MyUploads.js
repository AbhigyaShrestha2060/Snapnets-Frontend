import React, { useState } from 'react';
import { Alert, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';

const MyUploads = () => {
  // State for uploaded images
  const [uploads, setUploads] = useState([
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URLs
      title: 'Waterfall',
      status: 'being bid',
      bidInfo: 'It is being bid for ₹20,000 by abc_123.',
    },
    {
      id: 2,
      imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URLs
      title: 'Sailing Boat',
      status: 'sold',
      bidInfo: 'Your item was sold for ₹40,000 by abc_123.',
    },
    {
      id: 3,
      imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URLs
      title: 'Floral Painting',
      status: 'being bid',
      bidInfo: 'It is being bid for ₹25,000 by abc_123.',
    },
    {
      id: 4,
      imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URLs
      title: 'Pottery Art',
      status: 'sold',
      bidInfo: 'Your item was sold for ₹18,000 by abc_123.',
    },
  ]);

  // State for Modal and Form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    imageFile: null,
    imageTitle: '',
    imageDescription: '',
  });

  // State for Alert Message
  const [showAlert, setShowAlert] = useState(false);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle Add Image
  const handleAddImage = () => {
    const newUpload = {
      id: uploads.length + 1,
      imageUrl: URL.createObjectURL(formData.imageFile), // Convert file to URL
      title: formData.imageTitle,
      status: 'being bid',
      bidInfo: `It is being bid for ₹10,000 by abc_123.`,
    };

    setUploads([...uploads, newUpload]);
    setShowModal(false);
    setShowAlert(true);

    // Clear form data
    setFormData({
      imageFile: null,
      imageTitle: '',
      imageDescription: '',
    });

    // Hide alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className='container mt-4'>
      {/* Alert */}
      {showAlert && (
        <Alert
          variant='success'
          className='text-center'>
          Image uploaded successfully!
        </Alert>
      )}

      {/* Header */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h4>My Uploads</h4>
        <Button
          variant='danger'
          className='rounded-pill'
          onClick={() => setShowModal(true)}>
          Add Picture
        </Button>
      </div>

      <div className='row'>
        {/* Left Side: Uploaded Images */}
        <div className='col-md-8'>
          <Row className='g-3'>
            {uploads.map((upload) => (
              <Col
                md={4}
                key={upload.id}>
                <Card className='shadow'>
                  <Card.Img
                    variant='top'
                    src={upload.imageUrl}
                    alt={upload.title}
                  />
                  <Card.Body>
                    <Card.Title>{upload.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Right Side: Bid Status */}
        <div className='col-md-4'>
          <Card className='shadow'>
            <Card.Body>
              <h5>Item Bid Status</h5>
              {uploads.map((item) => (
                <div
                  key={item.id}
                  className='d-flex align-items-center border-bottom py-2'>
                  <Card.Img
                    src={item.imageUrl}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                    }}
                    className='rounded me-3'
                  />
                  <div>
                    <p
                      className='mb-0'
                      style={{ fontSize: '14px' }}>
                      {item.bidInfo}
                    </p>
                    <span
                      className={`badge ${
                        item.status === 'being bid'
                          ? 'bg-primary'
                          : 'bg-success'
                      }`}>
                      {item.status === 'being bid' ? 'Bidding' : 'Sold'}
                    </span>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type='file'
                name='imageFile'
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Image Title</Form.Label>
              <Form.Control
                type='text'
                name='imageTitle'
                value={formData.imageTitle}
                onChange={handleInputChange}
                placeholder='Enter Image Title'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Image Description</Form.Label>
              <Form.Control
                type='text'
                name='imageDescription'
                value={formData.imageDescription}
                onChange={handleInputChange}
                placeholder='Enter Image Description'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant='danger'
            onClick={handleAddImage}>
            Add Picture
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyUploads;
