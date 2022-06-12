import { Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getScore } from '../app/slice/ujianThunk';

export default function DataTable({ data }) {
  const dispatch = useDispatch();
  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'namaUjian', headerName: 'Nama Ujian', width: 200 },
    { field: 'tanggalUjian', headerName: 'Tanggal', width: 200 },
    {
      field: 'keterangan',
      headerName: 'Keterangan',
      sortable: false,
      width: 160
    },
    {
      field: 'aksi',
      headerName: 'Aksi',
      sortable: false,
      width: 120,
      renderCell: (params) => {
        return (
          <Link
            to={
              params.value.status === 'selesai'
                ? '#'
                : 'ujian?id=' + params.value.id
            }
          >
            <Button
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
              }}
              size="small"
              onClick={
                params.value.status === 'selesai'
                  ? () => checkNilai(params.value.idScore)
                  : 'ujian?id=' + params.value.id
              }
            >
              <Typography color="text.primary" sx={{ fontSize: 12 }}>
                {getStatus(params.value.status)}
              </Typography>
            </Button>
          </Link>
        );
      }
    }
  ];

  const checkNilai = async (nilai) => {
    const { payload } = await dispatch(getScore(nilai));
    if (payload.status === 'success') {
      return alert('Nilai anda : ' + payload.hasil);
    }
    alert('Ada yang salah!');
  };

  const getStatus = (status) => {
    if (status === 'Belum dikerjakan') {
      return 'Mulai';
    } else if (status === 'selesai') {
      return 'Lihat hasil';
    } else {
      return 'Lanjutkan';
    }
  };

  const rows = data.map((x) => {
    return {
      id: x._id,
      namaUjian: x.nama,
      tanggalUjian: new Date(x.waktuMulai).toLocaleString(),
      keterangan: x.statusSiswa,
      aksi: { id: x._id, status: x.statusSiswa, idScore: x.idScore }
    };
  });
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}
