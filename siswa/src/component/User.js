import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { styled } from '@mui/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from '../app/slice/authThunk';
import { getUjian } from '../app/slice/ujianThunk';
import TableUser from './TableUser';

const AvatarCust = styled(Avatar)({
  margin: 'auto',
  height: 100,
  width: 100
});

const Typography1 = styled(Typography)({
  margin: 'auto',
  padding: 10,
  fontSize: 18,
  textAlign: 'center'
});

const User = () => {
  const dispatch = useDispatch();
  const { dataUjian, nama } = useSelector((state) => state.ujian);
  useEffect(() => {
    const fetch = async () => {
      await dispatch(refreshToken());
      await dispatch(getUjian());
    };
    fetch();
  }, [dispatch]);

  return (
    <div>
      <Card
        sx={{
          minWidth: 275,
          marginBottom: 0.5,
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        }}
      >
        <CardContent>
          <AvatarCust alt={nama} src="/static/images/avatar/2.jpg" />

          <Typography1 color="text.secondary" gutterBottom>
            {nama}
          </Typography1>
        </CardContent>
      </Card>

      <Grid container>
        <Grid item xs={12}>
          <Card
            sx={{
              minWidth: 275,
              marginBottom: 2
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 300,
                  color: 'text.primary'
                }}
                color="text"
                gutterBottom
              >
                <Grid container>
                  <LocalActivityIcon /> AKTIFITAS
                </Grid>
              </Typography>
            </CardContent>
          </Card>
          <TableUser data={dataUjian} />
        </Grid>
      </Grid>
    </div>
  );
};

export default User;
