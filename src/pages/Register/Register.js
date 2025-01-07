import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
} from 'reactstrap';
import { registerUserApi } from '../../api/api';
import ParticlesAuth from '../../components/common/ParticlesAuth';

const Register = () => {
  document.title = 'Register';

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Validate form inputs
  const validateForm = () => {
    const { email, username, password, confirmPassword } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format.';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters long.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const { email, username, password } = formData;

    try {
      const response = await registerUserApi({
        email,
        username,
        password,
      });
      toast.success('Registration Successful!', {
        position: 'top-center',
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      setError('');
      // Redirect or show success message
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 3000,
      });
      setError(errorMessage);
    }
  };

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className='auth-page-content'>
          <Container>
            <Row>
              <Col lg={12}>
                <div className='text-center text-white-50'>
                  <div
                    className='mt-4'
                    style={{ position: 'relative', display: 'inline-block' }}>
                    <div
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 0,
                        borderRadius: '15px',
                      }}></div>
                    <Link
                      to='/'
                      className='d-inline-block auth-logo'>
                      <img
                        src={'/assets/images/Logo.png'}
                        alt=''
                        height='200'
                        style={{
                          display: 'block',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className='justify-content-center'>
              <Col
                md={8}
                lg={6}
                xl={5}>
                <Card className='mt-4'>
                  <CardBody className='p-4'>
                    <div className='text-center mt-2'>
                      <h5 className='text-dark'>Create Account</h5>
                    </div>
                    <div className='p-2 mt-4'>
                      <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                          <Label
                            htmlFor='email'
                            className='form-label'>
                            Email
                          </Label>
                          <Input
                            type='text'
                            className='form-control'
                            id='email'
                            placeholder='Enter Email'
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className='mb-3'>
                          <Label
                            htmlFor='username'
                            className='form-label'>
                            Username
                          </Label>
                          <Input
                            type='text'
                            className='form-control'
                            id='username'
                            placeholder='Enter username'
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className='mb-3'>
                          <Label
                            className='form-label'
                            htmlFor='password'>
                            Password
                          </Label>
                          <Input
                            type='password'
                            className='form-control'
                            id='password'
                            placeholder='Enter password'
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className='mb-3'>
                          <Label
                            className='form-label'
                            htmlFor='confirmPassword'>
                            Confirm Password
                          </Label>
                          <Input
                            type='password'
                            className='form-control'
                            id='confirmPassword'
                            placeholder='Confirm Password'
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        {error && (
                          <div className='text-danger mb-3'>{error}</div>
                        )}

                        <div className='mt-4'>
                          <Button
                            style={{
                              backgroundColor: '#E60023',
                              border: 'none',
                            }}
                            className='btn w-100'
                            type='submit'>
                            Sign Up
                          </Button>
                        </div>
                      </form>
                    </div>
                  </CardBody>
                </Card>

                <div className='mt-4 text-center'>
                  <p className='mb-0'>
                    Already have an account?{' '}
                    <Link
                      to='/login'
                      className='fw-semibold text-primary text-decoration-underline'>
                      {' '}
                      Sign In{' '}
                    </Link>{' '}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Register;
