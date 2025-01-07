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
export const jsonConfig = {
  headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

// User API
export const registerUserApi = (data) => Api.post('/user/register', data);
export const loginApi = (data) => Api.post('/user/login', data);
export const getMe = () => Api.get('/user/getMe', config);
export const updateUserApi = (data) => Api.put('/user/edit', data, config);
export const changePassword = (data) =>
  Api.put('/user/changePassword', data, config);
export const updateProfilePicture = (data) =>
  Api.put('/user/editProfilePicture', data, config);

// login with google
export const googleLoginApi = (data) => Api.post('/user/googleLogin', data);
// Image Api
export const uploadImageApi = (data) =>
  Api.post('/api/image/upload', data, config);
export const getImageById = (id) => Api.get(`/image/get/${id}`);
export const getImagesApi = () => Api.get('/image/getAll');
export const getImageByLike = () =>
  Api.get('/image/getlikedbyuser', jsonConfig);

export const likeImageApi = (id) =>
  Api.post(`/image/like/${id}`, {}, jsonConfig);

export const getAllLikedImageByUser = () =>
  Api.get('/image/getalllikedbyuser', jsonConfig);

export const addImage = (data) => Api.post('/image/add', data, config);
export const getAllImagesOfUser = () =>
  Api.get('/image/getAllImagesOfUser', jsonConfig);
export const editImage = (id, data) =>
  Api.put(`/image/updateImage/${id}`, data, config);
export const deleteImage = (id) => Api.delete(`/image/delete/${id}`, config);

// Comment Api
export const addCommentApi = (data) =>
  Api.post('/comment/addComment', data, config);
export const getCommentsApi = (id) =>
  Api.get(`/comment/getComment/${id}`, jsonConfig);

// Bid

export const addBidApi = (data) => Api.post('/bid/addBid', data, config);
export const getBidsApi = () => Api.get(`/bid/userBids`, jsonConfig);
export const getImageswithBidInformation = () =>
  Api.get(`/bid/userImagesWithbidInformation`, jsonConfig);
