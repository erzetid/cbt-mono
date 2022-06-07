import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";
import React, { forwardRef } from "react";
import { useReactToPrint } from "react-to-print";
import userIcon from "../../assets/images/icon-user.png";

export default function CetakDialog({ open, handleClose, data: dataSiswa }) {
  const componentRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const _data = dataSiswa.map((siswa) => {
    return (
      <div
        style={{
          margin: 5,
          height: 204,
          width: 322,
          borderColor: "coral",
          borderStyle: "solid",
          display: "inline-block",
        }}
      >
        <h5 style={{ textAlign: "center" }}>SMK MAARIF NU 01 WANASARI</h5>
        <h6 style={{ textAlign: "center" }}>Jalan Pemuda Sawojajar km 5.0</h6>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <div style={{ width: "30%" }}>
            <img src={userIcon} style={{ padding: 5, height: 100, width: 100 }} />
          </div>
          <div style={{ width: "70%", fontSize: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ width: "30%" }}>Nama :</div>
              <div style={{ width: "70%" }}>{siswa.nama} </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ width: "30%" }}>Kelas :</div>
              <div style={{ width: "70%" }}>{siswa.kelas}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ width: "30%" }}>Username :</div>
              <div style={{ width: "70%" }}>{siswa.username}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ width: "30%" }}>Password :</div>
              <div style={{ width: "70%" }}>{siswa.password}</div>
            </div>
          </div>
        </div>
        <div style={{ marginRight: 5, textAlign: "right", marginTop: -10 }}>
          <h6>Brebes, {new Date().toLocaleString()}</h6>
          <div style={{ fontSize: 12 }}>Kepala Sekolah</div>
        </div>
      </div>
    );
  });

  const ComponentToPrint = forwardRef((props, ref) => {
    return (
      <div ref={ref} style={{ marginTop: 5, marginLeft: 15 }}>
        <div>{props.content}</div>
      </div>
    );
  });

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle>Cetak Kartu</DialogTitle>
        <div style={{ marginRight: 50, marginLeft: 50, marginBottom: 10 }}>
          <MDButton color={"primary"} onClick={handlePrint}>
            Print
          </MDButton>
        </div>
        <DialogContent>{<ComponentToPrint content={_data} ref={componentRef} />}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
