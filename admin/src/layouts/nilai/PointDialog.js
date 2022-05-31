import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DataTable from "examples/Tables/DataTable";

export default function PointDilaog({ open, handleClose, data }) {
  const { rows, columns } = {
    columns: [
      { Header: "Nama", accessor: "nama", width: "15%", align: "left" },
      { Header: "Soal", accessor: "soal", align: "left" },
      { Header: "Nilai", accessor: "nilai", align: "center" },
      { Header: "Waktu Mulai", accessor: "waktuMulai", align: "center" },
      { Header: "Waktu Selesai", accessor: "waktuSelesai", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
    ],
    rows: data,
  };
  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle>Daftar Nilai {data[0].soal}</DialogTitle>
        <DialogContent>
          <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
