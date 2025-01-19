import { DeleteOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  styled,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteBoard, getAllBoardsOfAUser } from '../../api/api';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    '& .deleteButton': {
      opacity: 1,
    },
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
}));

const TopImage = styled(CardMedia)(({ theme }) => ({
  height: 180,
  width: '100%',
  objectFit: 'cover',
}));

const BottomImagesContainer = styled(Grid)(({ theme }) => ({
  height: 120,
  marginTop: 1,
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: theme.palette.error.main,
  },
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await getAllBoardsOfAUser();
      if (response?.data?.boards) {
        setBoards(response.data.boards);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const handleBoardClick = (id) => {
    navigate(`/boardDetailed/${id}`);
  };

  const openDeleteDialog = (id, event) => {
    event.stopPropagation();
    setSelectedBoardId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteBoard = async () => {
    try {
      await deleteBoard(selectedBoardId);
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board._id !== selectedBoardId)
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  // If there are no boards, show empty state
  if (boards.length === 0) {
    return (
      <Container maxWidth='xl'>
        <EmptyStateContainer>
          <Box sx={{ mb: 4 }}>
            {/* You can replace this with your own empty state illustration */}
            <img
              src='/path/to/empty-state-image.png'
              alt='No boards'
              style={{ width: '200px', height: '200px', opacity: 0.5 }}
            />
          </Box>
          <Typography
            variant='h4'
            component='h2'
            gutterBottom>
            No Boards Found
          </Typography>
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ mb: 4 }}>
            Create your first board to get started!
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate('/create-board')}
            sx={{ borderRadius: 2 }}>
            Create Board
          </Button>
        </EmptyStateContainer>
      </Container>
    );
  }

  return (
    <Container
      maxWidth='xl'
      sx={{ py: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Grid
          container
          spacing={3}>
          {boards.map((board) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={board._id}
              component={motion.div}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <StyledCard>
                <ImageContainer onClick={() => handleBoardClick(board._id)}>
                  <TopImage
                    component='img'
                    image={
                      board.lists[0]?.image
                        ? `http://localhost:5050/images/${board.lists[0].image}`
                        : '/path/to/default/image.jpg'
                    }
                    alt={`Board ${board.title} - Main`}
                  />
                  <BottomImagesContainer
                    container
                    spacing={0.5}>
                    {board.lists.slice(1, 3).map((list, index) => (
                      <Grid
                        item
                        xs={6}
                        key={list._id}>
                        <CardMedia
                          component='img'
                          image={`http://localhost:5050/images/${list.image}`}
                          alt={`Board ${board.title} - ${index + 2}`}
                          sx={{ height: '100%', objectFit: 'cover' }}
                        />
                      </Grid>
                    ))}
                  </BottomImagesContainer>
                  <DeleteButton
                    className='deleteButton'
                    size='small'
                    onClick={(e) => openDeleteDialog(board._id, e)}>
                    <DeleteOutline />
                  </DeleteButton>
                </ImageContainer>
                <CardContent sx={{ textAlign: 'center', pb: 2 }}>
                  <Typography
                    variant='h6'
                    noWrap>
                    {board.title}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            minWidth: 300,
          },
        }}>
        <DialogTitle>Delete Board</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this board? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant='outlined'
            sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBoard}
            variant='contained'
            color='error'
            sx={{ borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Board;
