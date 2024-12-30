import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/Navbar';
import Board from './pages/Boards/Boards';
import Comment from './pages/Comment/Comment';
import DetailedProduct from './pages/DetailedPage/DetailedPage';
import Homepage from './pages/Homepage/Homepage';
import Login from './pages/Login/Login';
import MyUploads from './pages/MyUploads/MyUploads';
import Profile from './pages/Profile/Profile';
import Register from './pages/Register/Register';

function Layout() {
  const location = useLocation(); // useLocation is now inside BrowserRouter

  // Define routes where Navbar should not be shown
  const hideNavbarRoutes = ['/login', '/register'];

  // Check if the current path matches one of the defined routes
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />} {/* Conditionally render Navbar */}
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
          path='/comment'
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
