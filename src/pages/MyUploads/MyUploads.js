import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Snackbar,
  styled,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  addImage,
  deleteImage,
  editImage,
  getAllImagesOfUser,
  getImageswithBidInformation,
} from '../../api/api';

// Styled components with enhanced designs
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
  },
  '&:hover .card-actions': {
    opacity: 1,
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme, isportrait }) => ({
  height: isportrait === 'true' ? '400px' : '250px',
  width: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const FloatingActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease',
  background: 'rgba(0, 0, 0, 0.6)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
}));

const StyledBidCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  position: 'sticky',
  top: theme.spacing(2),
  maxHeight: 'calc(100vh - 100px)',
  overflow: 'auto',
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 250,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  marginBottom: theme.spacing(3),
  position: 'relative',
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const MyUploads = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [uploads, setUploads] = useState([]);
  const [bidInfo, setBidInfo] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    imageFile: null,
    imageTitle: '',
    imageDescription: '',
    keywords: '',
    isPortrait: false,
  });
  const [editData, setEditData] = useState({
    imageTitle: '',
    imageDescription: '',
    keywords: '',
    isPortrait: false,
  });
  const [errors, setErrors] = useState({
    fetch: '',
    add: '',
    edit: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [imagesResponse, bidResponse] = await Promise.all([
        getAllImagesOfUser(),
        getImageswithBidInformation(),
      ]);

      if (imagesResponse.data.success) {
        const mappedImages = imagesResponse.data.images.map((img) => ({
          id: img._id,
          imageUrl: `http://localhost:5050/images/${img.image}`,
          title: img.imageTitle,
          description: img.imageDescription,
          keywords: img.keywords,
          isPortrait: img.isPortrait,
          totalLikes: img.totalLikes,
          likedBy: img.likedBy,
          uploadDate: new Date(img.uploadDate).toLocaleDateString(),
        }));
        setUploads(mappedImages);
      }

      if (bidResponse.data.success) {
        setBidInfo(bidResponse.data.data);
      }
    } catch (error) {
      setErrors({ ...errors, fetch: 'Failed to load data' });
      showSnackbar('Error loading data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event, isEdit = false) => {
    const { name, value, files, type, checked } = event.target;
    const newValue =
      type === 'file' ? files[0] : type === 'checkbox' ? checked : value;

    if (type === 'file' && files[0]) {
      const fileUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(fileUrl);
    }

    if (isEdit) {
      setEditData((prev) => ({ ...prev, [name]: newValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddImage = async () => {
    try {
      const { imageFile, imageTitle, imageDescription, keywords, isPortrait } =
        formData;

      if (
        !imageFile ||
        !imageTitle.trim() ||
        !imageDescription.trim() ||
        !keywords.trim()
      ) {
        setErrors({ ...errors, add: 'All fields are required' });
        return;
      }

      const keywordArray = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      if (keywordArray.length < 3) {
        setErrors({ ...errors, add: 'Provide at least three keywords' });
        return;
      }

      const data = new FormData();
      data.append('title', imageTitle.trim());
      data.append('description', imageDescription.trim());
      data.append('isPortrait', isPortrait);
      data.append('newImage', imageFile);
      data.append('keywords', keywords.trim());

      await addImage(data);
      await fetchData();
      setOpenAddDialog(false);
      showSnackbar('Image uploaded successfully');
      resetForm();
    } catch (error) {
      setErrors({ ...errors, add: 'Upload failed' });
    }
  };

  const handleEditImage = async () => {
    try {
      if (
        !editData.imageTitle.trim() ||
        !editData.imageDescription.trim() ||
        !editData.keywords.trim()
      ) {
        setErrors({ ...errors, edit: 'All fields are required' });
        return;
      }

      await editImage(selectedImage.id, editData);
      await fetchData();
      setOpenEditDialog(false);
      showSnackbar('Image updated successfully');
    } catch (error) {
      setErrors({ ...errors, edit: 'Update failed' });
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await deleteImage(id);
      setUploads((prevUploads) =>
        prevUploads.filter((upload) => upload.id !== id)
      );
      showSnackbar('Image deleted successfully');
    } catch (error) {
      showSnackbar('Failed to delete image', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      imageFile: null,
      imageTitle: '',
      imageDescription: '',
      keywords: '',
      isPortrait: false,
    });
    setPreviewUrl('');
    setErrors({ fetch: '', add: '', edit: '' });
  };

  return (
    <Container
      maxWidth='xl'
      sx={{ py: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}>
          <Typography
            variant='h4'
            fontWeight='bold'
            sx={{
              background: '#E60023',
              backgroundImage: 'linear-gradient(45deg, #E60023, #ff1a1a)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
            My Gallery
          </Typography>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              borderRadius: '50px',
              px: 3,
              py: 1,
              background: 'linear-gradient(45deg, #E60023, #ff1a1a)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[8],
              },
            }}>
            Add Picture
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        ) : (
          <Grid
            container
            spacing={3}>
            <Grid
              item
              xs={12}
              md={8}>
              <AnimatePresence>
                <Grid
                  container
                  spacing={3}>
                  {uploads.map((upload, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={upload.isPortrait ? 6 : 6}
                      md={upload.isPortrait ? 4 : 4}
                      key={upload.id}
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}>
                      <StyledCard>
                        <StyledCardMedia
                          component='img'
                          image={upload.imageUrl}
                          alt={upload.title}
                          isportrait={upload.isPortrait.toString()}
                        />
                        <FloatingActions className='card-actions'>
                          <Tooltip title='Edit'>
                            <IconButton
                              size='small'
                              sx={{ color: 'white' }}
                              onClick={() => {
                                setSelectedImage(upload);
                                setEditData({
                                  imageTitle: upload.title,
                                  imageDescription: upload.description,
                                  keywords: upload.keywords.join(', '),
                                  isPortrait: upload.isPortrait,
                                });
                                setOpenEditDialog(true);
                              }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton
                              size='small'
                              sx={{ color: 'white' }}
                              onClick={() => handleDeleteImage(upload.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </FloatingActions>
                        <CardContent>
                          <Typography
                            variant='h6'
                            gutterBottom
                            noWrap>
                            {upload.title}
                          </Typography>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}>
                            {upload.description}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mb: 1,
                            }}>
                            <FavoriteIcon
                              color='error'
                              sx={{ fontSize: 20 }}
                            />
                            <Typography variant='body2'>
                              {upload.totalLikes} likes
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 0.5,
                            }}>
                            {upload.keywords.slice(0, 3).map((keyword) => (
                              <Chip
                                key={keyword}
                                label={keyword}
                                size='small'
                                sx={{
                                  backgroundColor: '#E60023',
                                  color: '#FFFFFF',
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              </AnimatePresence>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}>
              <StyledBidCard elevation={3}>
                <Typography
                  variant='h6'
                  gutterBottom
                  sx={{
                    borderBottom: '2px solid #E60023',
                    pb: 1,
                    mb: 2,
                  }}>
                  Bid Status
                </Typography>
                <List>
                  {bidInfo.map((info) => (
                    <ListItem
                      key={info.image.id}
                      sx={{
                        mb: 2,
                        backgroundColor: theme.palette.background.default,
                        borderRadius: theme.shape.borderRadius,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}>
                      <ListItemAvatar>
                        <Avatar
                          variant='rounded'
                          src={`http://localhost:5050/images/${info.image.image}`}
                          sx={{ width: 56, height: 56 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant='subtitle1'
                            color='primary'>
                            Current Bid: ₹
                            {info.latestBid?.bidAmount || 'No bids'}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant='body2'
                            color='text.secondary'>
                            {info.latestBid
                              ? `Bid by ${info.latestBid.bidder.username}`
                              : 'No active bids'}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </StyledBidCard>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Add Image Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false);
          resetForm();
        }}
        maxWidth='sm'
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 2,
          },
        }}>
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
          }}>
          Add New Picture
          <IconButton
            onClick={() => {
              setOpenAddDialog(false);
              resetForm();
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {errors.add && (
            <Alert
              severity='error'
              sx={{ mb: 2 }}>
              {errors.add}
            </Alert>
          )}
          <PreviewContainer>
            {previewUrl ? (
              <Box
                component='img'
                src={previewUrl}
                alt='Preview'
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <PhotoCameraIcon
                sx={{ fontSize: 60, color: theme.palette.grey[400] }}
              />
            )}
          </PreviewContainer>
          <Button
            variant='outlined'
            component='label'
            startIcon={<PhotoCameraIcon />}
            fullWidth
            sx={{
              mb: 3,
              borderRadius: 2,
              height: 48,
            }}>
            Upload Image
            <input
              type='file'
              hidden
              accept='image/*'
              name='imageFile'
              onChange={(e) => handleInputChange(e)}
            />
          </Button>
          <TextField
            fullWidth
            label='Image Title'
            name='imageTitle'
            value={formData.imageTitle}
            onChange={(e) => handleInputChange(e)}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <TextField
            fullWidth
            label='Image Description'
            name='imageDescription'
            value={formData.imageDescription}
            onChange={(e) => handleInputChange(e)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <TextField
            fullWidth
            label='Keywords (comma-separated)'
            name='keywords'
            value={formData.keywords}
            onChange={(e) => handleInputChange(e)}
            helperText='Add at least 3 keywords'
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPortrait}
                onChange={(e) => handleInputChange(e)}
                name='isPortrait'
              />
            }
            label='Is this a portrait?'
          />
        </DialogContent>
        <DialogActions
          sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => {
              setOpenAddDialog(false);
              resetForm();
            }}
            sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleAddImage}
            sx={{
              borderRadius: 2,
              px: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}>
            Add Picture
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Image Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth='sm'
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 2,
          },
        }}>
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
          }}>
          Edit Picture
          <IconButton
            onClick={() => setOpenEditDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {errors.edit && (
            <Alert
              severity='error'
              sx={{ mb: 2 }}>
              {errors.edit}
            </Alert>
          )}
          <TextField
            fullWidth
            label='Image Title'
            name='imageTitle'
            value={editData.imageTitle}
            onChange={(e) => handleInputChange(e, true)}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <TextField
            fullWidth
            label='Image Description'
            name='imageDescription'
            value={editData.imageDescription}
            onChange={(e) => handleInputChange(e, true)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <TextField
            fullWidth
            label='Keywords (comma-separated)'
            name='keywords'
            value={editData.keywords}
            onChange={(e) => handleInputChange(e, true)}
            helperText='Add at least 3 keywords'
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editData.isPortrait}
                onChange={(e) => handleInputChange(e, true)}
                name='isPortrait'
              />
            }
            label='Is this a portrait?'
          />
        </DialogContent>
        <DialogActions
          sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handleEditImage}
            sx={{
              borderRadius: 2,
              px: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyUploads;
