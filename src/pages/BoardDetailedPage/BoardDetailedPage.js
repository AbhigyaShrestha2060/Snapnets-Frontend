import Masonry from '@mui/lab/Masonry';
import { Box, Container, Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { GavelIcon, Heart, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addBidApi,
  deleteImageFromBoard,
  getBoardById,
  likeImageApi,
} from '../../api/api';
import AddBids from '../../components/common/AddBids';

// Styled Components
const ImageWrapper = styled(Box)(({ theme, isPortrait }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  height: isPortrait ? '500px' : '300px',
  width: '100%',
  margin: '0',
  boxSizing: 'border-box',
  backgroundColor: theme.palette.grey[900],
  '&:hover .overlay': {
    opacity: 1,
  },
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    height: isPortrait ? '400px' : '250px',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const ActionButton = styled(Box)(({ theme }) => ({
  minWidth: '40px',
  width: '40px',
  height: '40px',
  padding: theme.spacing(1),
  borderRadius: '50%',
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const BoardDetailedPage = () => {
  const [board, setBoard] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getBoardById(id)
      .then((res) => {
        setBoard(res.data.board);
      })
      .catch((err) => {
        console.error('Error fetching board data:', err);
      });
  }, [id]);

  const toggleLike = async (index, e) => {
    e.stopPropagation();
    const image = board.lists[index];
    try {
      await likeImageApi(image._id);
      setBoard((prevBoard) => ({
        ...prevBoard,
        lists: prevBoard.lists.map((img, i) =>
          i === index
            ? {
                ...img,
                totalLikes: img.isLikedByUser
                  ? img.totalLikes - 1
                  : img.totalLikes + 1,
                isLikedByUser: !img.isLikedByUser,
              }
            : img
        ),
      }));
    } catch (error) {
      console.error('Error liking the image:', error);
    }
  };

  const handleImageClick = (imageId) => {
    navigate(`/detailedProduct/${imageId}`);
  };

  const handleBidClick = (imageId, e) => {
    e.stopPropagation();
    setSelectedImageId(imageId);
    setShowBidModal(true);
  };

  const handleBidSubmit = async (bidData) => {
    try {
      const response = await addBidApi(bidData);
      console.log('Bid submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting the bid:', error);
    }
  };

  const removeImageFromBoard = async (imageId, e) => {
    e.stopPropagation();
    try {
      await deleteImageFromBoard({ boardId: id, imageId });
      setBoard((prevBoard) => ({
        ...prevBoard,
        lists: prevBoard.lists.filter((img) => img._id !== imageId),
      }));
    } catch (error) {
      console.error('Error removing image from board:', error);
    }
  };

  if (!board) {
    return (
      <Container maxWidth='xl'>
        <Typography variant='h6'>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth='xl'
      sx={{
        py: 2,
        bgcolor: 'background.default',
        minHeight: '100vh',
        px: { xs: 1, sm: 2, md: 3 },
      }}>
      <Typography
        variant='h4'
        sx={{ mb: 3, fontWeight: 'bold' }}>
        {board.title}
      </Typography>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          spacing={1.5}>
          {board.lists.map((image, index) => (
            <Box
              key={image._id}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => handleImageClick(image._id)}>
              <ImageWrapper isPortrait={image.isPortrait}>
                <StyledImage
                  src={`http://localhost:5050/images/${image.image}`}
                  alt={image.imageTitle}
                  loading='lazy'
                />
                <Overlay className='overlay'>
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{ mb: 1, color: 'common.white' }}>
                      {image.imageTitle}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ color: 'common.white' }}>
                      {image.imageDescription}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Box sx={{ display: 'flex' }}>
                      <ActionButton onClick={(e) => toggleLike(index, e)}>
                        <Heart
                          size={20}
                          fill={image.isLikedByUser ? 'currentColor' : 'none'}
                          color={
                            image.isLikedByUser ? '#f44336' : 'currentColor'
                          }
                        />
                      </ActionButton>
                      <ActionButton
                        onClick={(e) => handleBidClick(image._id, e)}>
                        <GavelIcon size={20} />
                      </ActionButton>
                      <ActionButton
                        onClick={(e) => removeImageFromBoard(image._id, e)}>
                        <X size={20} />
                      </ActionButton>
                    </Box>
                    {image.currentBid && (
                      <Typography
                        variant='subtitle2'
                        sx={{
                          bgcolor: 'warning.main',
                          color: 'warning.contrastText',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}>
                        ${image.currentBid}
                      </Typography>
                    )}
                  </Box>
                </Overlay>
              </ImageWrapper>
            </Box>
          ))}
        </Masonry>
      </Box>

      <AddBids
        show={showBidModal}
        handleClose={() => setShowBidModal(false)}
        handleBidSubmit={handleBidSubmit}
        imageId={selectedImageId}
      />
    </Container>
  );
};

export default BoardDetailedPage;
