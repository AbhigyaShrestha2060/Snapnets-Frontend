import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Button } from 'react-bootstrap';

const FollowModal = ({ open, onClose, title, data }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth='sm'
    fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <List>
        {data?.list.map((item) => (
          <ListItem
            key={item._id}
            onClick={() =>
              (window.location.href = `/userUploads/${item.follower._id}`)
            }>
            <ListItemAvatar>
              <Avatar
                src={`http://localhost:5050${
                  item.follower?.profilePicture || item.user?.profilePicture
                }`}
                alt={item.follower?.username || item.user?.username}
              />
            </ListItemAvatar>
            <ListItemText
              primary={item.follower?.username || item.user?.username}
              secondary={item.follower?.email || item.user?.email}
            />
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default FollowModal;
