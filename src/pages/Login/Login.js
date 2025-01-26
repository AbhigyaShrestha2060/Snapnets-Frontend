import { GoogleLogin } from '@react-oauth/google';
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import {
  googleLoginApi,
  loginApi,
  sendOtpApi,
  verifyOtpApi,
} from '../../api/api';
import ParticlesAuth from '../../components/common/ParticlesAuth';

const Login = () => {
  document.title = 'Login';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const toggleForgotModal = () => {
    setIsForgotModalOpen(!isForgotModalOpen);
    if (!isForgotModalOpen) {
      setOtp('');
      setNewPassword('');
      setEmailForReset('');
      setIsOtpSent(false);
    }
  };

  const handleForgotEmailSubmit = async () => {
    if (!emailForReset) {
      toast.error('Email is required', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    try {
      await sendOtpApi({ email: emailForReset });
      toast.success('OTP sent to your email!', {
        position: 'top-center',
        autoClose: 3000,
      });
      setIsOtpSent(true);
    } catch (err) {
      toast.error(
        err.response.data.message || 'Failed to send OTP. Please try again.',
        {
          position: 'top-center',
          autoClose: 3000,
        }
      );
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      toast.error('Please enter the OTP', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    if (!newPassword) {
      toast.error('Please enter new password', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    try {
      await verifyOtpApi({ email: emailForReset, otp, newPassword });
      toast.success('Password reset successful! Please login.', {
        position: 'top-center',
        autoClose: 3000,
      });
      setIsForgotModalOpen(false);
      setIsOtpSent(false);
      setOtp('');
      setNewPassword('');
      setEmailForReset('');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const { email } = formData;
    if (!email) {
      return 'Email is required.';
    }
    return null;
  };

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

      setTimeout(() => {
        window.location.href = '/homepage';
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
        <div className='auth-page-content pb-3'>
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
                              onClick={toggleForgotModal}
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
                        <div className='mt-4'>
                          <GoogleLogin
                            className='w-full'
                            onSuccess={(credentialResponse) => {
                              const token = credentialResponse.credential;
                              googleLoginApi({ token })
                                .then((response) => {
                                  localStorage.setItem(
                                    'token',
                                    response.data.token
                                  );
                                  localStorage.setItem(
                                    'user',
                                    JSON.stringify(response.data.user)
                                  );
                                  window.location.href = '/homepage';
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }}
                            onError={() => {
                              console.log('Login Failed');
                            }}
                          />
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
                      Signup
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        toggle={toggleForgotModal}>
        <ModalHeader toggle={toggleForgotModal}>
          {isOtpSent ? 'Enter OTP & New Password' : 'Forgot Password'}
        </ModalHeader>
        <ModalBody>
          {isOtpSent ? (
            <>
              <div className='mb-3'>
                <Label htmlFor='otp'>OTP</Label>
                <Input
                  type='text'
                  id='otp'
                  placeholder='Enter the OTP'
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor='newPassword'>New Password</Label>
                <Input
                  type='password'
                  id='newPassword'
                  placeholder='Enter new password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor='emailForReset'>Email</Label>
              <Input
                type='email'
                id='emailForReset'
                placeholder='Enter your email'
                value={emailForReset}
                onChange={(e) => setEmailForReset(e.target.value)}
                required
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {isOtpSent ? (
            <Button
              color='primary'
              onClick={handleOtpSubmit}>
              Reset Password
            </Button>
          ) : (
            <Button
              color='primary'
              onClick={handleForgotEmailSubmit}>
              Send OTP
            </Button>
          )}
          <Button
            color='secondary'
            onClick={toggleForgotModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Login;
