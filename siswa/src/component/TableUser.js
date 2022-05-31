import { Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

export default function DataTable({ data }) {
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
          <Link to={'ujian?id=' + params.value.id}>
            <Button
              sx={{
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
              }}
              size="small"
            >
              <Typography color="text.primary" sx={{ fontSize: 12 }}>
                {params.value.status === 'Belum dikerjakan'
                  ? 'Mulai'
                  : 'Lanjutkan'}
              </Typography>
            </Button>
          </Link>
        );
      }
    }
  ];

  const rows = data.map((x) => {
    return {
      id: x._id,
      namaUjian: x.nama,
      tanggalUjian: new Date(x.waktuMulai).toLocaleString(),
      keterangan: x.statusSiswa,
      aksi: { id: x._id, status: x.statusSiswa }
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
