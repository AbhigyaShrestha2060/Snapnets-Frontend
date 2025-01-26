import { Favorite, FavoriteBorder } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Clock,
  DollarSign,
  MessageCircle,
  Package,
  TrendingUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCommentApi, getImageById, likeImageApi } from '../../api/api';
import AddBids from '../../components/common/AddBids';

const DetailedProduct = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const [textareaInput, setTextareaInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getImageById(id);
        const data = response.data;
        const {
          image,
          imageTitle,
          imageDescription,
          isPortrait,
          uploadDate,
          totalLikes,
          uploadedBy,
          isReadyToBid,
          biddingEndDate,
          biddingStartDate,
        } = data.image;

        setLiked(data.hasLiked);
        setLikesCount(totalLikes);

        const highestBid = data.latestBid?.bidAmount ?? 'Not Bid Yet';
        const userBid = data.userBid?.bidAmount ?? 'Not Bid Yet';

        setProduct({
          image,
          title: imageTitle,
          description: imageDescription,
          isPortrait,
          date: new Date(uploadDate).toLocaleDateString(),
          creator: uploadedBy.username,
          creatorPicture: uploadedBy.profilePicture,
          creatorId: uploadedBy._id,
          yourBid: userBid,
          highestBid,
          biddingStartDate: biddingStartDate
            ? new Date(biddingStartDate).toLocaleDateString()
            : 'Not Available',
          auctionEnd: biddingEndDate
            ? new Date(biddingEndDate).toLocaleDateString()
            : 'Not Available',
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleTextareaChange = (e) => {
    setTextareaInput(e.target.value);
  };

  const handleTextareaSubmit = async () => {
    if (textareaInput.trim()) {
      try {
        await addCommentApi({
          comment: textareaInput,
          imageId: id,
        });
        setTextareaInput('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleViewComment = () => {
    navigate(`/comment/${id}`);
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    try {
      await likeImageApi(id);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
        <Grid
          container
          spacing={4}>
          <Grid
            item
            xs={12}
            md={6}>
            <Skeleton
              variant='rectangular'
              height={400}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}>
            <Skeleton
              variant='text'
              height={60}
            />
            <Skeleton
              variant='text'
              height={40}
            />
            <Skeleton
              variant='text'
              height={40}
            />
            <Skeleton
              variant='rectangular'
              height={200}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4 }}>
      <Grid
        container
        spacing={4}>
        <Grid
          item
          xs={12}
          md={6}>
          <Paper
            elevation={3}
            sx={{ p: 2 }}>
            <Box
              component='img'
              src={`http://localhost:5050/images/${product.image}`}
              alt={product.title}
              sx={{
                width: '100%',
                height: product.isPortrait ? 600 : 400,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2,
              }}
            />
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography
                variant='h4'
                sx={{ mb: 1 }}>
                {product.title}
              </Typography>
              <Typography
                variant='body2'
                sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              <Typography
                onClick={() => navigate(`/userUploads/${product.creatorId}`)}
                variant='subtitle1'
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                }}>
                <Avatar
                  src={`http://localhost:5050${product.creatorPicture}`}
                  alt={product.creator}
                  sx={{ width: 40, height: 40 }}
                />
                <Chip
                  label={product.creator || 'Unknown'}
                  variant='outlined'
                  size='small'
                />
              </Typography>

              <Typography
                variant='body2'
                sx={{ mb: 2 }}>
                Upload Date: {product.date}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Stack
                  direction='row'
                  spacing={1}
                  alignItems='center'>
                  <IconButton
                    onClick={toggleLike}
                    color={liked ? 'error' : 'default'}
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.1)' },
                    }}>
                    {liked ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Typography variant='body2'>{likesCount} likes</Typography>
                </Stack>
              </Box>

              <Button
                variant='contained'
                fullWidth
                sx={{
                  bgcolor: 'error.main',
                  '&:hover': { bgcolor: 'error.dark' },
                }}
                onClick={() => setModalVisible(true)}>
                Place Bid
              </Button>

              <Divider sx={{ my: 3 }} />

              <Grid
                container
                spacing={2}
                sx={{ mb: 3 }}>
                <Grid
                  item
                  xs={6}
                  sm={3}>
                  <Paper
                    elevation={1}
                    sx={{ p: 1.5, textAlign: 'center' }}>
                    <DollarSign
                      size={20}
                      style={{ margin: '0 auto 8px' }}
                    />
                    <Typography
                      variant='caption'
                      display='block'>
                      Your Bid
                    </Typography>
                    <Typography variant='subtitle2'>
                      {product.yourBid}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={3}>
                  <Paper
                    elevation={1}
                    sx={{ p: 1.5, textAlign: 'center' }}>
                    <TrendingUp
                      size={20}
                      style={{ margin: '0 auto 8px' }}
                    />
                    <Typography
                      variant='caption'
                      display='block'>
                      Highest Bid
                    </Typography>
                    <Typography variant='subtitle2'>
                      {product.highestBid}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={3}>
                  <Paper
                    elevation={1}
                    sx={{ p: 1.5, textAlign: 'center' }}>
                    <Package
                      size={20}
                      style={{ margin: '0 auto 8px' }}
                    />
                    <Typography
                      variant='caption'
                      display='block'>
                      Bid Started
                    </Typography>
                    <Typography variant='subtitle2'>
                      {product.biddingStartDate}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={3}>
                  <Paper
                    elevation={1}
                    sx={{ p: 1.5, textAlign: 'center' }}>
                    <Clock
                      size={20}
                      style={{ margin: '0 auto 8px' }}
                    />
                    <Typography
                      variant='caption'
                      display='block'>
                      Auction End
                    </Typography>
                    <Typography variant='subtitle2'>
                      {product.auctionEnd}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: 'end' }}>
                <Button
                  startIcon={<MessageCircle />}
                  variant='text'
                  onClick={handleViewComment}>
                  View Comments
                </Button>
              </Box>

              <Box sx={{ position: 'relative' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder='Add a comment...'
                  value={textareaInput}
                  onChange={handleTextareaChange}
                  variant='outlined'
                />
                {textareaInput && (
                  <Button
                    variant='contained'
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                    }}
                    onClick={handleTextareaSubmit}>
                    Submit
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AddBids
        show={isModalVisible}
        onClose={() => setModalVisible(false)}
        bid={{ image: { _id: id } }}
        currentBid={
          typeof product.highestBid === 'number' ? product.highestBid : 0
        }
        itemTitle={product.title}
      />
    </Box>
  );
};

export default DetailedProduct;
