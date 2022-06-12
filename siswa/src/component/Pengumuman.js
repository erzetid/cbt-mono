import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { getPengumuman } from '../app/slice/ujianThunk';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Pengumuman() {
  const distpatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [desc, setDesc] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [dataPengumuman, setDataPengumuman] = React.useState([]);

  React.useEffect(() => {
    const pengumuman = async () => {
      const { payload } = await distpatch(getPengumuman());
      if (payload.status === 'success') setDataPengumuman(payload.data);
    };

    pengumuman();
  }, [distpatch]);

  const handleClickOpen = (title, desc) => {
    setDesc(desc);
    setTitle(title);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const truncate = (str) => {
    return str.length > 64 ? str.substr(0, 64 - 1) + '...' : str;
  };
  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {dataPengumuman.map((item) => (
          <>
            <ListItem
              alignItems="flex-start"
              onClick={() => handleClickOpen(item.judul, item.isi)}
            >
              <ListItemAvatar>
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={item.judul}
                secondary={
                  <React.Fragment>{truncate(item.isi)}</React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {desc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
