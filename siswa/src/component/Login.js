import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../app/slice/authThunk';
import trainImage from '../asset/train.jpg';

export default function Login() {
  const dispatch = useDispatch();
  const { loading, message } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username !== '' && password !== '') {
      await dispatch(login({ username, password }));
    }
  };

  return (
    <Grid sx={{ flexGrow: 1 }} container spacing={2}>
      <Grid container justifyContent="center" sx={{ padding: 5 }}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={trainImage}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h6" sx={{ textAlign: 'center' }}>
              Login Siswa
            </Typography>
            {message && message !== 'Access Denied / Unauthorized request' ? (
              <Alert sx={{ m: 1 }} severity="warning">
                {message}
              </Alert>
            ) : null}
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-username">Username</InputLabel>
              <OutlinedInput
                id="outlined-username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              loading
              fullWidth
              sx={{ m: 1 }}
              disabled={loading}
              variant="contained"
              onClick={handleLogin}
            >
              {loading ? <CircularProgress color="inherit" /> : 'Login'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
