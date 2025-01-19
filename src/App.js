import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import Navbar from './components/common/Navbar';
import BoardDetailedPage from './pages/BoardDetailedPage/BoardDetailedPage';
import Board from './pages/Boards/Boards';
import Comment from './pages/Comment/Comment';
import DetailedProduct from './pages/DetailedPage/DetailedPage';
import Homepage from './pages/Homepage/Homepage';
import LikedImages from './pages/LikedImages/LikedImages';
import Login from './pages/Login/Login';
import MyBids from './pages/MyBids/MyBids';
import MyUploads from './pages/MyUploads/MyUploads';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';
import Search from './pages/Search/Search';
import UserImages from './pages/UserImages/UserImages';

function Layout() {
  const location = useLocation(); // useLocation is now inside BrowserRouter

  // Define routes where Navbar should not be shown
  const hideNavbarRoutes = ['/login', '/register'];

  // Check if the current path matches one of the defined routes
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <ToastContainer />
      <Routes>
        <Route
          path='/homepage'
          element={<Homepage />}
        />
        <Route
          path='/'
          element={<Homepage />}
        />
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/boards'
          element={<Board />}
        />
        <Route
          path='/detailedProduct/:id'
          element={<DetailedProduct />}
        />
        <Route
          path='/comment/:id'
          element={<Comment />}
        />
        <Route
          path='/profile'
          element={<Profile />}
        />
        <Route
          path='/myUploads'
          element={<MyUploads />}
        />
        <Route
          path='/search'
          element={<Search />}
        />
        <Route
          path='/liked'
          element={<LikedImages />}
        />
        <Route
          path='/mybids'
          element={<MyBids />}
        />
        <Route
          path='/boardDetailed/:id'
          element={<BoardDetailedPage />}
        />
        <Route
          path='/userUploads/:id'
          element={<UserImages />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
