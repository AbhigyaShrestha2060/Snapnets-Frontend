import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:5050/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};
const jsonConfig = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

// User API

export const registerUserApi = (data) => Api.post('/user/register', data);
export const loginApi = (data) => Api.post('/user/login', data);

// Image Api

export const uploadImageApi = (data) =>
  Api.post('/api/image/upload', data, config);
export const getImagesApi = () => Api.get('/image/getAll');
export const getImageById = (id) => Api.get(`/image/get/${id}`);
