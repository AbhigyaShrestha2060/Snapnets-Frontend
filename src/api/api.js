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

//Otp
export const sendOtpApi = (data) => Api.post('/user/sendOtp', data);
export const verifyOtpApi = (data) => Api.post('/user/verifyOtp', data);

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

export const getImagesByUserId = (id) =>
  Api.get(`/image/getAllImageOfAUserbyId/${id}`, jsonConfig);

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

// Boards
export const createBoard = (data) =>
  Api.post('/board/createBoard', data, jsonConfig);

export const addImageToBoard = (data) =>
  Api.post('/board/addImageToBoard', data, jsonConfig);

export const getAllBoardsOfAUser = () =>
  Api.get('/board/getAllBoardsOfAUser', jsonConfig);
export const getBoardById = (id) => Api.get(`/board/viewBoard/${id}`, config);
export const deleteBoard = (id) =>
  Api.delete(`/board/deleteBoard/${id}`, config);
export const deleteImageFromBoard = (data) =>
  Api.delete('/board/removeImageFromBoard', data, jsonConfig);
