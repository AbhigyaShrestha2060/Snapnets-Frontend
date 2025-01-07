import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import {
  addImage,
  deleteImage,
  editImage,
  getAllImagesOfUser,
  getImageswithBidInformation,
} from '../../api/api';

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [bidInfo, setBidInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    imageFile: null,
    imageTitle: '',
    imageDescription: '',
    keywords: '',
    isPortrait: false,
  });
  const [editData, setEditData] = useState({
    imageTitle: '',
    imageDescription: '',
    keywords: '',
    isPortrait: false,
  });
  const [fetchError, setFetchError] = useState('');
  const [addError, setAddError] = useState('');
  const [editError, setEditError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const response = await getAllImagesOfUser();
        if (response.data.success) {
          const mappedImages = response.data.images.map((img) => ({
            id: img._id,
            imageUrl: `http://localhost:5050/images/${img.image}`,
            title: img.imageTitle,
            description: img.imageDescription,
            keywords: img.keywords,
            isPortrait: img.isPortrait,
            totalLikes: img.totalLikes,
            likedBy: img.likedBy,
            uploadDate: img.uploadDate,
          }));
          setUploads(mappedImages);
          setFetchError('');
        } else {
          setFetchError('Failed to fetch user images.');
        }
      } catch (err) {
        console.error('Error fetching user images:', err);
        setFetchError('No Images Uploaded, Upload Now.');
      }
    };

    const fetchBidInformation = async () => {
      try {
        const response = await getImageswithBidInformation();
        if (response.data.success) {
          setBidInfo(response.data.data);
        } else {
          console.error('Failed to fetch bid information.');
        }
      } catch (err) {
        console.error('Error fetching bid information:', err);
      }
    };

    fetchUserImages();
    fetchBidInformation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === 'file' ? files[0] : type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddImage = async () => {
    const { imageFile, imageTitle, imageDescription, keywords, isPortrait } =
      formData;

    if (
      !imageFile ||
      !imageTitle.trim() ||
      !imageDescription.trim() ||
      !keywords.trim()
    ) {
      setAddError('All fields except image are required.');
      return;
    }

    const keywordArray = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    if (keywordArray.length < 3) {
      setAddError('You must provide at least three keywords.');
      return;
    }

    const data = new FormData();
    data.append('title', imageTitle.trim());
    data.append('description', imageDescription.trim());
    data.append('isPortrait', isPortrait);
    data.append('newImage', imageFile);
    data.append('keywords', keywords.trim());

    try {
      await addImage(data);
      setShowModal(false);
      setShowAlert(true);
      setAddError('');

      setFormData({
        imageFile: null,
        imageTitle: '',
        imageDescription: '',
        keywords: '',
        isPortrait: false,
      });

      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      setAddError('Failed to upload the image. Please try again.');
      console.error('Error adding image:', err);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await deleteImage(id);
      setUploads((prevUploads) =>
        prevUploads.filter((upload) => upload.id !== id)
      );
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const handleEditImage = async () => {
    if (
      !editData.imageTitle.trim() ||
      !editData.imageDescription.trim() ||
      !editData.keywords.trim()
    ) {
      setEditError('All fields are required.');
      return;
    }

    try {
      await editImage(selectedImage.id, editData);
      setUploads((prevUploads) =>
        prevUploads.map((upload) =>
          upload.id === selectedImage.id
            ? {
                ...upload,
                title: editData.imageTitle,
                description: editData.imageDescription,
                keywords: editData.keywords,
                isPortrait: editData.isPortrait,
              }
            : upload
        )
      );
      setShowEditModal(false);
      setEditError('');
    } catch (err) {
      console.error('Error editing image:', err);
      setEditError('Failed to update the image details. Please try again.');
    }
  };

  return (
    <div className='container mt-4'>
      {showAlert && (
        <Alert
          variant='success'
          className='text-center'>
          Image uploaded successfully!
        </Alert>
      )}
      {fetchError && (
        <Alert
          variant='danger'
          className='text-center'>
          {fetchError}
        </Alert>
      )}
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
                    <Card.Text>
                      <small className='text-muted'>{upload.description}</small>
                    </Card.Text>
                    <Card.Text>
                      <small className='text-muted'>
                        Likes: {upload.totalLikes}
                      </small>
                    </Card.Text>
                    <Button
                      variant='warning'
                      className='me-2'
                      onClick={() => {
                        setSelectedImage(upload);
                        setEditData({
                          imageTitle: upload.title,
                          imageDescription: upload.description,
                          keywords: upload.keywords,
                          isPortrait: upload.isPortrait,
                        });
                        setShowEditModal(true);
                      }}>
                      Edit
                    </Button>
                    <Button
                      variant='danger'
                      onClick={() => handleDeleteImage(upload.id)}>
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {/* Bid Status */}
        <Col md={4}>
          <div className='p-3 border rounded shadow-sm'>
            <h5 className='mb-3'>Item Bid Status</h5>
            {bidInfo.map((info) => (
              <div
                key={info.image.id}
                className='d-flex align-items-center mb-3 border-bottom pb-2'>
                <img
                  src={`http://localhost:5050/images/${info.image.image}`}
                  alt={info.image.image}
                  className='me-3 rounded'
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <div className='flex-grow-1'>
                  <p
                    className='mb-1 text-muted'
                    style={{ fontSize: '0.9rem' }}>
                    {info.latestBid
                      ? `It is being bid for ₹${info.latestBid.bidAmount} by ${info.latestBid.bidder.username}.`
                      : 'No bids yet.'}
                  </p>
                  <small className='text-muted'>
                    {info.latestBid?.bidDate || ''}
                  </small>
                </div>
                <i
                  className={`bi ${
                    info.latestBid ? 'bi-check-circle-fill text-success' : ''
                  }`}
                  style={{ fontSize: '1.5rem' }}></i>
              </div>
            ))}
          </div>
        </Col>
      </div>

      {/* Add Image Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {addError && <Alert variant='danger'>{addError}</Alert>}
            <Form.Group className='mb-3'>
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type='file'
                name='imageFile'
                accept='image/*'
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
            <Form.Group className='mb-3'>
              <Form.Label>Keywords (comma-separated)</Form.Label>
              <Form.Control
                type='text'
                name='keywords'
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder='e.g., nature, art, waterfall'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Check
                type='checkbox'
                name='isPortrait'
                label='Is this a portrait?'
                checked={formData.isPortrait}
                onChange={handleInputChange}
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

      {/* Edit Image Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {editError && <Alert variant='danger'>{editError}</Alert>}
            <Form.Group className='mb-3'>
              <Form.Label>Image Title</Form.Label>
              <Form.Control
                type='text'
                name='imageTitle'
                value={editData.imageTitle}
                onChange={handleEditInputChange}
                placeholder='Enter Image Title'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Image Description</Form.Label>
              <Form.Control
                type='text'
                name='imageDescription'
                value={editData.imageDescription}
                onChange={handleEditInputChange}
                placeholder='Enter Image Description'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Keywords (comma-separated)</Form.Label>
              <Form.Control
                type='text'
                name='keywords'
                value={editData.keywords}
                onChange={handleEditInputChange}
                placeholder='e.g., nature, art, waterfall'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Check
                type='checkbox'
                name='isPortrait'
                label='Is this a portrait?'
                checked={editData.isPortrait}
                onChange={handleEditInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant='warning'
            onClick={handleEditImage}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyUploads;
