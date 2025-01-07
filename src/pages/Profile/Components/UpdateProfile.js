import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updateProfilePicture, updateUserApi } from '../../../api/api';

const UpdateProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || ''
  ); // State for profile picture
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Frontend validation
  const validate = () => {
    const newErrors = {};
    if (
      !formData.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await updateUserApi(formData);
      toast.success('Profile updated successfully!', {});
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the profile.', {});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image file input change and upload immediately
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image
      if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('newImage', file);

        setIsUploading(true);

        try {
          const response = await updateProfilePicture(formData); // Call the API to update the profile picture
          const newProfilePicture = response.data.newProfilePicture; // Assuming the new image URL is returned
          setProfilePicture(newProfilePicture); // Update the state with the new image URL
          toast.success('Profile picture updated successfully!');
        } catch (error) {
          console.error(error);
          toast.error('An error occurred while updating the profile picture.');
        } finally {
          setIsUploading(false);
        }
      } else {
        toast.error('Please upload a valid image file.');
      }
    }
  };

  return (
    <div className='d-flex flex-column flex-md-row bg-white p-4 rounded shadow-sm'>
      {/* Form Section */}
      <div className='flex-grow-1 col-12 col-md-6 order-2 order-md-1'>
        <h3 className='mb-4'>Update Profile</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              value={formData.username}
              readOnly
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              value={formData.email}
              onChange={handleChange}
              name='email'
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type='text'
              value={formData.phoneNumber}
              onChange={handleChange}
              name='phoneNumber'
              isInvalid={!!errors.phoneNumber}
            />
            <Form.Control.Feedback type='invalid'>
              {errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant='success'
            type='submit'
            disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </div>

      {/* Profile Image Section */}
      <div className='d-flex flex-column align-items-center justify-content-center ms-md-5 col-12 col-md-6 order-1 order-md-2'>
        <div className='position-relative'>
          <img
            src={
              user?.profilePicture
                ? `http://localhost:5050/${user?.profilePicture}`
                : '/assets/images/bg.jpg'
            }
            alt={user?.username}
            className='rounded-circle'
            style={{ width: '250px', height: '250px', objectFit: 'cover' }}
          />
          <div
            className='position-absolute bg-danger rounded-circle d-flex align-items-center justify-content-center'
            style={{
              width: '50px',
              height: '50px',
              bottom: '10px',
              right: '10px',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('fileInput').click()}>
            <FaCamera color='white' />
          </div>
        </div>
        <input
          type='file'
          id='fileInput'
          style={{ display: 'none' }}
          accept='image/*'
          onChange={handleImageChange}
        />
        <p className='mt-3 text-muted'>Change Profile Picture</p>
      </div>
    </div>
  );
};

export default UpdateProfile;
