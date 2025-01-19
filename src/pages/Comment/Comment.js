import {
  AccessTime,
  ArrowBack,
  Bookmark,
  BookmarkBorder,
  ChatBubbleOutline,
  EmojiEmotions,
  Favorite,
  FavoriteBorder,
  MoreVert,
  Send,
  Share,
} from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addCommentApi,
  getCommentsApi,
  getMe,
  likeImageApi,
} from '../../api/api';

const Comment = () => {
  const theme = useTheme();
  const [commentInput, setCommentInput] = useState('');
  const { id } = useParams();
  const [images, setImages] = useState({ comments: [] });
  const [visibleComments, setVisibleComments] = useState(3);
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, commentsRes] = await Promise.all([
        getMe(),
        getCommentsApi(id),
      ]);
      setUserImg(userRes.data.user.profilePicture);
      setImages(commentsRes.data.image);
      setLiked(commentsRes.data.image.hasLiked);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };
  const toggleLike = async (e) => {
    e.stopPropagation(); // Prevent image click navigation
    try {
      await likeImageApi(images.id);
      setLiked((prev) => !prev);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSend = async () => {
    if (commentInput.trim()) {
      try {
        await addCommentApi({ imageId: id, comment: commentInput });
        setCommentInput('');
        fetchData();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleLoadMore = () => {
    setVisibleComments((prev) => prev + 3);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    try {
      // Convert date string from "YYYY-MM-DD HH:mm:ss" format
      const [datePart, timePart] = dateStr.split(' ');
      if (!datePart || !timePart) return '';

      const [year, month, day] = datePart.split('-');
      const [hours, minutes, seconds] = timePart.split(':');

      if (!year || !month || !day || !hours || !minutes || !seconds) return '';

      const date = new Date(year, month - 1, day, hours, minutes, seconds);
      if (isNaN(date.getTime())) return '';

      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const ContentSkeleton = () => (
    <Box sx={{ width: '100%' }}>
      <Skeleton
        variant='text'
        width='60%'
        height={40}
      />
      <Skeleton
        variant='text'
        width='40%'
        height={30}
      />
      <Stack
        direction='row'
        spacing={2}
        sx={{ my: 2 }}>
        <Skeleton
          variant='circular'
          width={24}
          height={24}
        />
        <Skeleton
          variant='text'
          width={60}
        />
        <Skeleton
          variant='circular'
          width={24}
          height={24}
        />
        <Skeleton
          variant='text'
          width={60}
        />
      </Stack>
      <Skeleton
        variant='rectangular'
        height={100}
        sx={{ my: 2 }}
      />
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{ display: 'flex', gap: 2 }}>
            <Skeleton
              variant='circular'
              width={40}
              height={40}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant='text'
                width='30%'
              />
              <Skeleton
                variant='text'
                width='80%'
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );

  if (loading) {
    return (
      <Container
        maxWidth='xl'
        sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant='outlined'
          sx={{ mb: 3 }}>
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: '1 1 50%' }}>
            <Skeleton
              variant='rectangular'
              height={500}
              sx={{ borderRadius: 2 }}
            />
          </Box>
          <Box sx={{ flex: '1 1 50%' }}>
            <Card elevation={3}>
              <CardContent>
                <ContentSkeleton />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth='xl'
      sx={{ py: 4 }}>
      <Fade in={true}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant='outlined'
          sx={{
            mb: 3,
            borderRadius: '20px',
            textTransform: 'none',
            '&:hover': {
              transform: 'translateX(-4px)',
              transition: 'transform 0.2s',
            },
          }}>
          Back to Gallery
        </Button>
      </Fade>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          minHeight: '80vh',
        }}>
        {/* Left Side: Image */}
        <Box sx={{ flex: '1 1 50%' }}>
          <Zoom in={true}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: 'fit-content',
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
              }}>
              <Box
                component='img'
                src={`http://localhost:5050/images/${images.image}`}
                alt={images.imageTitle}
                onLoad={() => setImageLoaded(true)}
                sx={{
                  width: '100%',
                  height: images.isPortrait ? '600px' : '400px',
                  objectFit: 'cover',
                  borderRadius: 2,
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  boxShadow: theme.shadows[8],
                }}
              />
            </Paper>
          </Zoom>
        </Box>

        {/* Right Side: Comments and Details */}
        <Box sx={{ flex: '1 1 50%' }}>
          <Card
            elevation={3}
            sx={{
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <CardContent
              sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <Box sx={{ mb: 3 }}>
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={2}
                  sx={{ mb: 2 }}>
                  <Avatar
                    src={`http://localhost:5050/${images.uploadedBy?.profilePicture}`}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box flex={1}>
                    <Typography variant='h6'>{images.imageTitle}</Typography>
                    <Typography
                      variant='caption'
                      color='text.secondary'>
                      by {images.uploadedBy?.username}
                    </Typography>
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Stack>

                <Typography
                  variant='body2'
                  sx={{ mb: 2, color: 'text.secondary' }}>
                  {images.imageDescription}
                </Typography>

                <Stack
                  direction='row'
                  spacing={1}
                  sx={{ mb: 2 }}>
                  <Chip
                    size='small'
                    icon={<AccessTime />}
                    label={formatTimeAgo(images.uploadedDate)}
                    variant='outlined'
                  />
                </Stack>
              </Box>

              {/* Action Buttons */}
              <Stack
                direction='row'
                spacing={2}
                alignItems='center'
                sx={{ mb: 3 }}>
                <IconButton
                  onClick={(e) => toggleLike(e)}
                  color={liked ? 'error' : 'default'}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}>
                  {liked ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <Typography variant='body2'>
                  {images.totalLikes} likes
                </Typography>

                <IconButton>
                  <ChatBubbleOutline />
                </IconButton>
                <Typography variant='body2'>
                  {images.comments.length} comments
                </Typography>

                <Box sx={{ flex: 1 }} />

                <Tooltip title='Share'>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Tooltip>

                <Tooltip title={saved ? 'Saved' : 'Save'}>
                  <IconButton onClick={() => setSaved(!saved)}>
                    {saved ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Tooltip>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Comments Section */}
              <Box sx={{ flex: 1 }}>
                <List
                  sx={{
                    maxHeight: 'calc(100vh - 500px)',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}>
                  {images.comments && images.comments.length > 0 ? (
                    images.comments
                      .slice(0, visibleComments)
                      .map((comment, index) => (
                        <Fade
                          in={true}
                          timeout={300 + index * 100}
                          key={index}>
                          <ListItem
                            alignItems='flex-start'
                            sx={{
                              '&:hover': {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                              },
                              borderRadius: 1,
                              transition: 'background-color 0.2s',
                            }}>
                            <ListItemAvatar>
                              <Avatar
                                src={`http://localhost:5050/${comment.commentedBy.profilePicture}`}
                                alt={comment.commentedBy.username}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  border: `2px solid ${alpha(
                                    theme.palette.primary.main,
                                    0.2
                                  )}`,
                                }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Stack
                                  direction='row'
                                  alignItems='center'
                                  spacing={1}>
                                  <Typography variant='subtitle2'>
                                    {comment.commentedBy.username}
                                  </Typography>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'>
                                    • {formatTimeAgo(comment.commentDate)}
                                  </Typography>
                                </Stack>
                              }
                              secondary={
                                <Typography
                                  variant='body2'
                                  color='text.primary'
                                  sx={{ mt: 0.5 }}>
                                  {comment.comment}
                                </Typography>
                              }
                            />
                          </ListItem>
                        </Fade>
                      ))
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 4,
                      }}>
                      <ChatBubbleOutline
                        sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                      />
                      <Typography
                        variant='body1'
                        color='text.secondary'>
                        No comments yet
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.disabled'>
                        Be the first to share your thoughts!
                      </Typography>
                    </Box>
                  )}
                </List>

                {images.comments.length > visibleComments && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant='text'
                      onClick={handleLoadMore}
                      sx={{
                        textTransform: 'none',
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}>
                      Show More Comments
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Comment Input */}
              <Box sx={{ mt: 2 }}>
                <Stack
                  direction='row'
                  spacing={2}>
                  <Avatar
                    src={`http://localhost:5050/${userImg}`}
                    sx={{
                      width: 40,
                      height: 40,
                      border: `2px solid ${alpha(
                        theme.palette.primary.main,
                        0.2
                      )}`,
                    }}
                  />
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder='Add a comment...'
                      value={commentInput}
                      onChange={handleCommentChange}
                      onKeyPress={handleKeyPress}
                      variant='outlined'
                      size='small'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '20px',
                          bgcolor: alpha(theme.palette.background.paper, 0.8),
                          '&:hover': {
                            bgcolor: alpha(
                              theme.palette.background.paper,
                              0.95
                            ),
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <Stack
                            direction='row'
                            spacing={1}
                            sx={{ mr: 1 }}>
                            <IconButton size='small'>
                              <EmojiEmotions
                                sx={{ color: theme.palette.text.secondary }}
                              />
                            </IconButton>
                            {commentInput && (
                              <Zoom in={true}>
                                <IconButton
                                  onClick={handleSend}
                                  color='primary'
                                  size='small'
                                  sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: 'white',
                                    '&:hover': {
                                      bgcolor: theme.palette.primary.dark,
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                    '&:active': {
                                      transform: 'scale(0.95)',
                                    },
                                  }}>
                                  <Send fontSize='small' />
                                </IconButton>
                              </Zoom>
                            )}
                          </Stack>
                        ),
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Comment;
