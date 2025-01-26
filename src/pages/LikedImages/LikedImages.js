import { Add } from '@mui/icons-material';
import Masonry from '@mui/lab/Masonry';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { GavelIcon, Heart, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  addImageToBoard,
  createBoard,
  getAllBoardsOfAUser,
  getAllLikedImageByUser,
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

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: '40px',
  width: '40px',
  height: '40px',
  padding: theme.spacing(1),
  borderRadius: '50%',
  marginRight: theme.spacing(1),
}));

const FloatingActionButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  zIndex: 1000,
  boxShadow: theme.shadows[4],
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const LikedImages = () => {
  const [images, setImages] = useState([]);
  const [boards, setBoards] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAddToBoardModal, setShowAddToBoardModal] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    fetchData();
    fetchBoards();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllLikedImageByUser();
      setImages(response.data.images);
    } catch (error) {
      console.error('Error fetching liked images:', error);
    } finally {
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await getAllBoardsOfAUser();
      if (response.data.boards) {
        setBoards(response.data.boards);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const handleImageLoad = (imageId) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img._id === imageId ? { ...img, loaded: true } : img
      )
    );
  };

  const handleNavigate = () => {
    window.location.href = '/myUploads';
  };

  const handleImageClick = (imageId) => {
    window.location.href = `/detailedProduct/${imageId}`;
  };

  const toggleLike = async (index, e) => {
    e.stopPropagation();
    const image = images[index];
    try {
      await likeImageApi(image._id);
      setImages((prevImages) =>
        prevImages.map((img, i) =>
          i === index ? { ...img, isLikedByUser: !img.isLikedByUser } : img
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBidClick = (image, e) => {
    e.stopPropagation();
    setSelectedImage(image);
    setSelectedImageId(image._id);
    setShowBidModal(true);
  };

  const handleBidClose = () => {
    setShowBidModal(false);
    setSelectedImage(null);
  };

  const handleAddToBoard = async () => {
    try {
      if (selectedBoardId) {
        await addImageToBoard({
          imageIds: [selectedImageId],
          boardId: selectedBoardId,
        });
      } else if (newBoardName.trim()) {
        const response = await createBoard({ title: newBoardName.trim() });
        const newBoard = response?.data?.board;
        await addImageToBoard({
          imageIds: [selectedImageId],
          boardId: newBoard._id,
        });
        setBoards((prev) => [...prev, newBoard]);
      }
      setShowAddToBoardModal(false);
      setSelectedBoardId('');
      setNewBoardName('');
    } catch (error) {
      console.error('Error adding to board:', error);
    }
  };

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
        sx={{ mb: 4, textAlign: 'center' }}>
        Liked Images
      </Typography>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          spacing={1.5}>
          {images.map((image, index) => (
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
                  onLoad={() => handleImageLoad(image._id)}
                  loading='lazy'
                  sx={{ opacity: image.loaded ? 1 : 0 }}
                />
                <Overlay className='overlay'>
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{ mb: 1 }}>
                      {image.imageTitle}
                    </Typography>
                    <Typography variant='body2'>
                      {image.imageDescription}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Box>
                      <ActionButton
                        color={image.isLikedByUser ? 'error' : 'inherit'}
                        onClick={(e) => toggleLike(index, e)}>
                        <Heart
                          fill={image.isLikedByUser ? 'currentColor' : 'none'}
                        />
                      </ActionButton>
                      <ActionButton
                        color='success'
                        onClick={(e) => handleBidClick(image, e)}>
                        <GavelIcon />
                      </ActionButton>
                      <ActionButton
                        color='inherit'
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageId(image._id);
                          setShowAddToBoardModal(true);
                        }}>
                        <Plus />
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

      {/* AddBids Modal */}
      {selectedImage && (
        <AddBids
          show={showBidModal}
          onClose={handleBidClose}
          bid={{ image: { _id: selectedImage._id } }}
          currentBid={selectedImage.latestBid?.bidAmount || 0}
          itemTitle={selectedImage.imageTitle}
        />
      )}

      {/* Add to Board Modal */}
      <Dialog
        open={showAddToBoardModal}
        onClose={() => setShowAddToBoardModal(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            minWidth: 300,
          },
        }}>
        <DialogTitle>Save to Board</DialogTitle>
        <DialogContent>
          {boards.length > 0 ? (
            <FormControl
              fullWidth
              sx={{ mb: 2 }}>
              <InputLabel>Choose Existing Board</InputLabel>
              <Select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                label='Choose Existing Board'>
                <MenuItem value=''>Select a board</MenuItem>
                {boards.map((board) => (
                  <MenuItem
                    key={board._id}
                    value={board._id}>
                    {board.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography
              variant='body2'
              color='text.secondary'>
              No boards found. Create a new board.
            </Typography>
          )}
          <Box sx={{ position: 'relative', py: 3 }}>
            <Divider>
              <Typography
                variant='body2'
                color='text.secondary'>
                or
              </Typography>
            </Divider>
          </Box>

          <TextField
            fullWidth
            label='Create New Board'
            placeholder='Enter board name'
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddToBoardModal(false)}>Cancel</Button>
          <Button
            onClick={handleAddToBoard}
            variant='contained'
            disabled={!selectedBoardId && !newBoardName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <FloatingActionButton
        variant='contained'
        color='error'
        onClick={handleNavigate}
        component={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          bgcolor: '#ff1744',
          '&:hover': {
            bgcolor: '#d50000',
          },
        }}>
        <Add />
      </FloatingActionButton>
    </Container>
  );
};

export default LikedImages;
