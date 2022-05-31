/**
=========================================================
* Material Dashboard 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// @mui material components
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Data
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "store/slice/authThunk";
import { getKelas } from "store/slice/kelasThunk";
import { deleteSiswa, getSiswa, postSiswa, putSiswa } from "store/slice/siswaThunk";
import { filterKelas, jwtDeccode } from "utils/jwtDecode";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const columns = [
  { Header: "nisn", accessor: "nisn", align: "left" },
  { Header: "nama", accessor: "nama", width: "45%", align: "left" },
  { Header: "kelas", accessor: "kelas", align: "left" },
  // { Header: "status", accessor: "status", align: "center" },
  { Header: "action", accessor: "action", align: "center" },
];

function Siswa() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message, loading, status } = useSelector((state) => state.siswa);
  const [refreshTable, setRefreshTable] = useState(0);
  const { token } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [_id, setId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [statusAlert, setStatusAlert] = useState("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nisn, setNisn] = useState("");
  const [nama, setNama] = useState("");
  const [barisSiswa, setBarisSiswa] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [kelas, setKelas] = useState(null);
  const [kelasSiswa, setKelasSiswa] = useState([]);
  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      const _siswa = await dispatch(getSiswa());
      const _kelas = await dispatch(getKelas());
      setKelasSiswa(_kelas.payload.data);
      setBarisSiswa(setTable(_siswa.payload.data));
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role !== "admin") {
          console.log(jwt);
          return navigate("/login");
        }
      } else {
        return navigate("/login");
      }
    };
    checkLogin();
  }, [token, refreshTable]);

  const handleClickAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleChange = (event) => {
    setKelas(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setNama("");
    setKelas(null);
    setOpenEdit(false);
  };

  const Nama = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const Kelas = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
    </MDBox>
  );

  const setTable = (siswa) => {
    return siswa.map((item) => {
      const { kelas, nama, nisn, _id } = item;
      return {
        nama: <Nama name={nama} email="john@creative-tim.com" />,
        kelas: <Kelas title={filterKelas(kelasSiswa, kelas)} />,
        nisn: (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {nisn}
          </MDTypography>
        ),
        action: (
          <>
            <MDButton
              onClick={() => handleEdit(item)}
              variant="gradient"
              color="warning"
              fontWeight="medium"
              sx={{ marginRight: 2 }}
            >
              Edit
            </MDButton>
            <MDButton
              onClick={() => handleHapus(_id)}
              variant="gradient"
              color="error"
              fontWeight="medium"
            >
              Hapus
            </MDButton>
          </>
        ),
      };
    });
  };

  const handleEdit = (item) => {
    setNama("");
    setKelas(null);
    setOpenEdit(true);

    setId(item._id);
    setNama(item.nama);
    setKelas(item.kelas);
  };
  const handleHapus = async (_id) => {
    const _hapus = await dispatch(deleteSiswa(_id));
    setMsg(_hapus.payload.message);
    setStatusAlert(_hapus.payload.status);
    handleClickAlert();
    if (_hapus.payload.status === "success") {
      setRefreshTable(refreshTable + 1);
    }
  };

  const handleOk = async () => {
    if (kelas !== null) {
      if (username !== "" || password !== "" || nisn !== "" || nama !== "") {
        await dispatch(refreshToken());
        const _simpan = await dispatch(
          postSiswa({
            username,
            password,
            nisn,
            kelas,
            nama,
          })
        );

        setMsg(_simpan.payload.message);
        setStatusAlert(_simpan.payload.status);
        handleClickAlert();

        if (_simpan.payload.status === "success") {
          setUsername("");
          setKelas("");
          setNisn("");
          setPassword("");
          setNama("");
          setRefreshTable(refreshTable + 1);
          return setOpen(false);
        }
      }
    }
  };

  const handleOkEdit = async () => {
    if (kelas !== null || nama !== "") {
      await dispatch(refreshToken());
      const _edit = await dispatch(putSiswa({ _id, kelas, nama }));
      setMsg(_edit.payload.message);
      setStatusAlert(_edit.payload.status);

      handleClickAlert();
      if (_edit.payload.status === "success") {
        setRefreshTable(refreshTable + 1);
        return handleCloseEdit();
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="info"
              >
                <Grid
                  sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}
                >
                  <MDTypography variant="h6" color="white">
                    Data Siswa
                  </MDTypography>

                  <MDButton onClick={handleClickOpen} color="info">
                    Tambah siswa
                  </MDButton>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: barisSiswa }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Dialog open={open} fullWidth={true} maxWidth={"xs"} onClose={handleClose}>
        <DialogTitle>Tambah siswa</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={username === ""}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={password === ""}
          />
          <TextField
            margin="dense"
            label="NISN"
            type="text"
            fullWidth
            variant="standard"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
            error={nisn === ""}
          />
          <TextField
            margin="dense"
            label="Nama"
            type="text"
            fullWidth
            variant="standard"
            value={nama}
            error={nama === ""}
            onChange={(e) => setNama(e.target.value)}
          />
          <FormControl margin="dense" variant="standard" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">Kelas</InputLabel>
            <Select
              error={kelas === null}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Kelas"
              value={kelas}
              onChange={(e) => handleChange(e)}
            >
              <MenuItem value={null}>
                <em>None</em>
              </MenuItem>
              {kelasSiswa.map((k) => {
                return <MenuItem value={k._id}>{k.nama}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDBox>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <MDButton onClick={() => handleClose()}>Cancel</MDButton>
                <MDButton onClick={(e) => handleOk(e)}>Simpan</MDButton>
              </>
            )}
          </MDBox>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} fullWidth={true} maxWidth={"xs"} onClose={handleCloseEdit}>
        <DialogTitle>Edit Siswa</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama"
            type="text"
            fullWidth
            variant="standard"
            value={nama}
            error={nama === ""}
            onChange={(e) => setNama(e.target.value)}
          />
          <FormControl margin="dense" variant="standard" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">Kelas</InputLabel>
            <Select
              error={kelas === null}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Kelas"
              value={kelas}
              onChange={(e) => handleChange(e)}
            >
              <MenuItem value={null}>
                <em>None</em>
              </MenuItem>
              {kelasSiswa.map((k) => {
                return <MenuItem value={k._id}>{k.nama}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDBox>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <MDButton onClick={() => handleCloseEdit()}>Cancel</MDButton>
                <MDButton onClick={() => handleOkEdit()}>Simpan</MDButton>
              </>
            )}
          </MDBox>
        </DialogActions>
      </Dialog>
      <Footer />
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={statusAlert} sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Siswa;
