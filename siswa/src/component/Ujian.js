import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mulaiUjian, preTest } from '../app/slice/ujianThunk';
import trainImage from '../asset/train.jpg';

export default function Ujian() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataPreTest, message, idScore } = useSelector((state) => state.ujian);
  const [searchParams, setSearchParams] = useSearchParams();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (idScore) {
      navigate('/Pertanyaan?id=' + idScore);
    }
  }, [idScore, navigate]);

  useEffect(() => {
    if (!searchParams.get('id')) {
      return navigate('/');
    }
    const getData = async () => {
      await dispatch(preTest(searchParams.get('id')));
    };
    getData();
  }, [dispatch, navigate, searchParams]);

  const onClickMasuk = async () => {
    if (token) {
      await dispatch(mulaiUjian({ token, idUjian: searchParams.get('id') }));
    }
  };

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={trainImage}
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" sx={{ textAlign: 'center' }}>
          {dataPreTest.ujian}
        </Typography>
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            <TableBody>
              <TableRow>
                <TableCell align="left">Nama</TableCell>
                <TableCell align="left">: {dataPreTest.nama}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Soal</TableCell>
                <TableCell align="left">: {dataPreTest.soal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Waktu</TableCell>
                <TableCell align="left">: {dataPreTest.durasi} Menit</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Jumlah Soal</TableCell>
                <TableCell align="left">: {dataPreTest.jumlah} buah</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Jadwal</TableCell>
                <TableCell align="left">
                  : {new Date(dataPreTest.jadwal).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions>
        <Stack
          component="form"
          sx={{
            width: 280,
            padding: 1,
            right: 0,
            left: 0
          }}
          spacing={2}
          noValidate
          autoComplete="off"
        >
          {message !== '' ? (
            <Alert sx={{ m: 1 }} severity="warning">
              {message}
            </Alert>
          ) : null}
          <Grid container>
            <Grid xs={9} md={9}>
              <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                placeholder="Masukan token"
                size="small"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </Grid>
            <Grid xs={2} md={2} sx={{ marginLeft: 1 }}>
              <Button variant="contained" onClick={onClickMasuk}>
                Masuk
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </CardActions>
    </Card>
  );
}
