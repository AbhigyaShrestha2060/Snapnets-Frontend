import Masonry from '@mui/lab/Masonry';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import { GavelIcon, Heart, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getImageByLike, likeImageApi } from '../../api/api';
import AddBids from '../../components/common/AddBids';

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

const Search = () => {
  const [images, setImages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      performSearch(searchTerm);
    }
  }, [images, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await getImageByLike();
      const loadedImages = response.data.images.map((img) => ({
        ...img,
        loaded: true,
      }));
      setImages(loadedImages);
      setSearchResults(loadedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = (query) => {
    if (!query) {
      setSearchResults(images);
      return;
    }

    const filteredImages = images.filter((image) =>
      image.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query.toLowerCase())
      )
    );
    setSearchResults(filteredImages);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
  };

  const handleImageClick = (imageId) => {
    window.location.href = `/detailedProduct/${imageId}`;
  };

  const toggleLike = async (index, e) => {
    e.stopPropagation();
    const image = searchResults[index];
    try {
      await likeImageApi(image._id);
      const updatedImage = { ...image, isLikedByUser: !image.isLikedByUser };

      setImages((prevImages) =>
        prevImages.map((img) => (img._id === image._id ? updatedImage : img))
      );

      setSearchResults((prevResults) =>
        prevResults.map((img) => (img._id === image._id ? updatedImage : img))
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBidClick = (image, e) => {
    e.stopPropagation();
    setSelectedImage(image);
    setShowBidModal(true);
  };

  const handleBidClose = () => {
    setShowBidModal(false);
    setSelectedImage(null);
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
      <Box sx={{ mb: 4, width: '100%', maxWidth: '600px', mx: 'auto' }}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Search for images by keywords...'
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 1,
          }}
        />
      </Box>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          spacing={1.5}>
          {searchResults.map((image, index) => (
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
                          console.log('Add clicked');
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
    </Container>
  );
};

export default Search;
