import Masonry from '@mui/lab/Masonry';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Camera,
  Heart,
  MessageCircle,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  followUser,
  getImagesByUserId,
  getUserFollowDetails,
  likeImageApi,
  unfollowUser,
} from '../../api/api';
import FollowModal from '../../components/common/FollowModal';

const PRIMARY_COLOR = '#E60023';
const PRIMARY_LIGHT = '#FF1A1A';

const ProfileCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  position: 'relative',
  overflow: 'visible',
  boxShadow: 'none',
  border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
}));

const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  transition: 'transform 0.2s ease',
  border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
  boxShadow: 'none',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const ImageCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.2s ease',
  boxShadow: 'none',
  '&:hover': {
    transform: 'translateY(-4px)',
    '& .overlay': {
      opacity: 1,
    },
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.common.black, 0.6),
  opacity: 0,
  transition: 'opacity 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5),
  justifyContent: 'space-between',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: PRIMARY_COLOR,
  color: 'white',
  padding: '8px 20px',
  borderRadius: theme.spacing(3),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: PRIMARY_LIGHT,
    transform: 'translateY(-2px)',
  },
}));

const UserImages = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userProfilePicture, setUserProfilePicture] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [followData, setFollowData] = useState(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesResponse, followResponse] = await Promise.all([
          getImagesByUserId(id),
          getUserFollowDetails(id),
        ]);

        if (imagesResponse.data.success) {
          setImages(imagesResponse.data.images);
          setUserName(imagesResponse.data.username);
          setUserProfilePicture(imagesResponse.data.profilePicture);
        }

        if (followResponse.data.success) {
          setFollowData(followResponse.data.data);
          setIsFollowing(followResponse.data.isFollowing);
          setTotalFollowers(followResponse.data.data.followers.count);
          setTotalFollowing(followResponse.data.data.following.count);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFollow = async () => {
    try {
      const data = { userId: id };
      if (isFollowing) {
        await unfollowUser(data);
        setTotalFollowers((prev) => prev - 1);
      } else {
        await followUser(data);
        setTotalFollowers((prev) => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleLike = async (imageId, e) => {
    e.stopPropagation();
    try {
      await likeImageApi(imageId);
      setImages((prevImages) =>
        prevImages.map((img) =>
          img._id === imageId
            ? {
                ...img,
                isLikedByLoggedInUser: !img.isLikedByLoggedInUser,
                totalLikes: img.isLikedByLoggedInUser
                  ? img.totalLikes - 1
                  : img.totalLikes + 1,
              }
            : img
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleImageClick = (imageId) => {
    window.location.href = `/detailedProduct/${imageId}`;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <LinearProgress
          sx={{
            height: 3,
            borderRadius: 1.5,
            '& .MuiLinearProgress-bar': {
              backgroundColor: PRIMARY_COLOR,
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Container
      maxWidth='xl'
      sx={{ py: 4 }}>
      <ProfileCard sx={{ mb: 4 }}>
        <Grid
          container
          spacing={3}
          alignItems='center'>
          <Grid
            item
            xs={12}
            md={4}>
            <Stack
              direction='row'
              spacing={2}
              alignItems='center'>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  border: `3px solid ${theme.palette.background.paper}`,
                  boxShadow: `0 0 0 1px ${alpha(PRIMARY_COLOR, 0.1)}`,
                }}
                src={`http://localhost:5050${userProfilePicture}`}
              />
              <Box>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  gutterBottom>
                  {userName}
                </Typography>
                <GradientButton
                  startIcon={
                    isFollowing ? (
                      <UserCheck size={18} />
                    ) : (
                      <UserPlus size={18} />
                    )
                  }
                  onClick={handleFollow}
                  size='medium'>
                  {isFollowing ? 'Following' : 'Follow'}
                </GradientButton>
              </Box>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={8}>
            <Grid
              container
              spacing={2}>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}>
                <StatsCard onClick={() => setShowFollowersModal(true)}>
                  <Stack
                    direction='row'
                    spacing={2}
                    alignItems='center'>
                    <UserPlus
                      size={20}
                      color={PRIMARY_COLOR}
                    />
                    <Box>
                      <Typography
                        variant='h6'
                        fontWeight='bold'>
                        {totalFollowers.toLocaleString()}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'>
                        Followers
                      </Typography>
                    </Box>
                  </Stack>
                </StatsCard>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}>
                <StatsCard onClick={() => setShowFollowingModal(true)}>
                  <Stack
                    direction='row'
                    spacing={2}
                    alignItems='center'>
                    <UserCheck
                      size={20}
                      color={PRIMARY_COLOR}
                    />
                    <Box>
                      <Typography
                        variant='h6'
                        fontWeight='bold'>
                        {totalFollowing.toLocaleString()}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'>
                        Following
                      </Typography>
                    </Box>
                  </Stack>
                </StatsCard>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}>
                <StatsCard>
                  <Stack
                    direction='row'
                    spacing={2}
                    alignItems='center'>
                    <Camera
                      size={20}
                      color={PRIMARY_COLOR}
                    />
                    <Box>
                      <Typography
                        variant='h6'
                        fontWeight='bold'>
                        {images.length}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'>
                        Total Images
                      </Typography>
                    </Box>
                  </Stack>
                </StatsCard>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={3}>
                <StatsCard>
                  <Stack
                    direction='row'
                    spacing={2}
                    alignItems='center'>
                    <Heart
                      size={20}
                      color={PRIMARY_COLOR}
                    />
                    <Box>
                      <Typography
                        variant='h6'
                        fontWeight='bold'>
                        {images.reduce((acc, img) => acc + img.totalLikes, 0)}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'>
                        Total Likes
                      </Typography>
                    </Box>
                  </Stack>
                </StatsCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ProfileCard>

      <Masonry
        columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}
        spacing={2}>
        {images.map((image, index) => (
          <motion.div
            key={image._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}>
            <ImageCard onClick={() => handleImageClick(image._id)}>
              <Box
                component='img'
                src={`http://localhost:5050/images/${image.image}`}
                alt={image.imageTitle}
                sx={{
                  width: '100%',
                  height: image.isPortrait ? 300 : 200,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <ImageOverlay className='overlay'>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='flex-start'>
                  <Typography
                    variant='subtitle1'
                    color='white'
                    fontWeight='600'>
                    {image.imageTitle}
                  </Typography>
                </Stack>

                <Stack
                  direction='row'
                  spacing={1}>
                  <Chip
                    icon={
                      <IconButton
                        size='small'
                        onClick={(e) => handleLike(image._id, e)}
                        sx={{
                          color: image.isLikedByLoggedInUser
                            ? PRIMARY_COLOR
                            : 'white',
                          p: 0.5,
                        }}>
                        <Heart
                          size={18}
                          fill={
                            image.isLikedByLoggedInUser ? PRIMARY_COLOR : 'none'
                          }
                        />
                      </IconButton>
                    }
                    label={image.totalLikes}
                    size='small'
                    sx={{
                      height: 24,
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                  <Chip
                    icon={<MessageCircle size={14} />}
                    label={image.comments.length}
                    size='small'
                    sx={{
                      height: 24,
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                      color: 'white',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                </Stack>
              </ImageOverlay>
            </ImageCard>
          </motion.div>
        ))}
      </Masonry>

      <FollowModal
        open={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title='Followers'
        data={followData?.followers}
      />

      <FollowModal
        open={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title='Following'
        data={followData?.following}
      />
    </Container>
  );
};

export default UserImages;
