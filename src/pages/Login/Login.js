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
import ParticlesAuth from '../../components/common/ParticlesAuth';

// Import images
import { loginApi } from '../../api/api';
import logoLight from '../../assets/images/Logo.png';

const Login = () => {
  document.title = 'Login';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Validate form inputs
  const validateForm = () => {
    const { email } = formData;

    if (!email) {
      return 'Email is required.';
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError, {
        position: 'top-center',
        autoClose: 3000,
      });
      setError(validationError);
      return;
    }

    const { email, password } = formData;

    try {
      const response = await loginApi({ email, password });

      toast.success('Login Successful!', {
        position: 'top-center',
        autoClose: 3000,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setError('');

      // Wait for 3 seconds before navigating
      setTimeout(() => {
        navigate('/homepage');
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please try again.';
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
          <Container className='container-sm mx-auto'>
            <Row>
              <Col lg={12}>
                <div className='text-center'>
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
                        src={logoLight}
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
                      <h5 className='text-danger'>Welcome Back!</h5>
                      <p className='text-muted'>Sign in to continue.</p>
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
                            placeholder='Enter email'
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className='mb-3'>
                          <div className='float-end'>
                            <Link
                              to='/auth-pass-reset-basic'
                              className='text-muted'>
                              Forgot password?
                            </Link>
                          </div>
                          <Label
                            className='form-label'
                            htmlFor='password'>
                            Password
                          </Label>
                          <div className='position-relative auth-pass-inputgroup mb-3'>
                            <Input
                              type='password'
                              className='form-control pe-5 password-input'
                              placeholder='Enter password'
                              id='password'
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        {error && (
                          <div className='text-danger mb-3'>{error}</div>
                        )}

                        <div className='mt-4'>
                          <Button
                            id='signIn'
                            className='btn btn-danger w-100'
                            type='submit'>
                            Sign In
                          </Button>
                        </div>
                      </form>
                    </div>
                  </CardBody>
                </Card>

                <div className='mt-4 text-center'>
                  <p className='mb-0'>
                    Don't have an account?{' '}
                    <Link
                      to='/register'
                      className='fw-semibold text-primary text-decoration-underline'>
                      {' '}
                      Signup{' '}
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

export default Login;
