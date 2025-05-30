import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://snapnets-backend.onrender.com/' + '/api',
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

export const deleteUser = () => Api.delete('/user/deleteUser', config);

//Otp
export const sendOtpApi = (data) => Api.post('/user/resetPasswordEmail', data);
export const verifyOtpApi = (data) => Api.post('/user/verifyResetOTP', data);

// login with google
export const googleLoginApi = (data) => Api.post('/user/googleLogin', data);
// Image Api
export const uploadImageApi = (data) =>
  Api.post('/api/image/upload', data, config);
export const getImageById = (id) => Api.get(`/image/get/${id}`, config);
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

export const getTrendingImages = () => Api.get('/image/mostLikedImages');

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

// Balance
export const getBalance = () => Api.get('/balance/balancebyuser', jsonConfig);

export const addBalance = (amount) =>
  Api.post('/balance/addBalance', amount, jsonConfig);

// Followers
export const followUser = (data) =>
  Api.post('/followers/followUser', data, jsonConfig);

export const unfollowUser = (data) =>
  Api.post('/followers/unfollowUser', data, jsonConfig);

export const getFollowers = () => Api.get('/getFollowers', jsonConfig);

export const getUserFollowDetails = (userIdToCheck) =>
  Api.get(`/followers/getUserFollowDetails/${userIdToCheck}`, config);

// initialize-khalti
export const initializeKhalti = (data) =>
  Api.post('/payment/initialize-khalti', data, jsonConfig);

// notification
export const getNotification = () =>
  Api.get('/notification/getNotification', jsonConfig);

export const markNotificationAsRead = (id) =>
  Api.put(`/notification/markAsRead/${id}`, {}, jsonConfig);

export const markAllNotificationAsRead = () =>
  Api.put('/notification/markAllAsRead', {}, jsonConfig);
