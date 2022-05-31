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

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MuiAlert from "@mui/material/Alert";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Dashboard components
import Pengumuman from "layouts/dashboard/components/Pengumuman";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "store/slice/authThunk";
import { forwardRef, useEffect, useState } from "react";
import { jwtDeccode } from "../../utils/jwtDecode";
import { getSiswa } from "store/slice/siswaThunk";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { getKelas } from "store/slice/kelasThunk";
import { getPengumuman } from "store/slice/pengumumanThunk";
import { getSoal } from "store/slice/soalThunk";
import { postPengumuman } from "store/slice/pengumumanThunk";
import { deletePengumuman } from "store/slice/pengumumanThunk";
import MDTypography from "components/MDTypography";
import { getTokenUjian } from "store/slice/ujianThunk";
import { createTokenUjian } from "store/slice/ujianThunk";
import { getUjian } from "store/slice/ujianThunk";

const emptyPengumuman = {
  judul: "",
  isi: "",
  kelas: "",
};
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jmlSiswa, setJmlSiswa] = useState(0);
  const [jmlSoal, setJmlSoal] = useState(0);
  const [jmlUjian, setJmlUjian] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [kelas, setKelas] = useState("");
  const [kelasSiswa, setKelasSiswa] = useState([{ _id: "", nama: "" }]);
  const [dataPengumuman, setDataPengumuman] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [formPengumuman, setFormPengumuman] = useState(emptyPengumuman);
  const [openAlert, setOpenAlert] = useState(false);
  const [alerData, setAlerData] = useState({ msg: "", status: "" });
  const [tokenUjian, setTokenUjian] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      const { payload: siswa } = await dispatch(getSiswa());
      const _kelas = await dispatch(getKelas());
      const { payload: _pengumuman } = await dispatch(getPengumuman());
      const { payload: _soal } = await dispatch(getSoal());
      const { payload: _token } = await dispatch(getTokenUjian());
      const { payload: _ujian } = await dispatch(getUjian());
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role !== "admin") {
          console.log(jwt);
          return navigate("/login");
        }
        setDataPengumuman(_pengumuman.data);
        setKelasSiswa(_kelas.payload.data);
        setJmlSiswa(siswa.data.length);
        setJmlSoal(_soal.data.length);
        setTokenUjian(_token.token);
        setJmlUjian(_ujian.data.length);
      } else {
        return navigate("/login");
      }
    };
    checkLogin();
  }, [token, openDialog]);

  const handlePengumuman = () => setOpenDialog(!openDialog);
  const handleHpsPengumuman = async (_id) => {
    await dispatch(refreshToken());
    const _delete = await dispatch(deletePengumuman(_id));
    setAlerData({ msg: _delete.payload.message, status: _delete.payload.status });
    setOpenAlert(true);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  const handleChange = (e) => {
    console.log(e.target.value);
    const val = (e.target && e.target.value) || "";
    setKelas(val);
    let _formPengumuman = { ...formPengumuman };
    _formPengumuman[`kelas`] = val;
    setFormPengumuman(_formPengumuman);
  };

  const onChangePengumuman = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _formPengumuman = { ...formPengumuman };
    _formPengumuman[`${name}`] = val;
    setFormPengumuman(_formPengumuman);
  };

  const handleSimpanPengumuman = async () => {
    await dispatch(refreshToken());
    const _pengumuman = await dispatch(postPengumuman(formPengumuman));
    if (_pengumuman.payload.status === "success") {
      onCloseDialog();
    }
    setAlerData({ msg: _pengumuman.payload.message, status: _pengumuman.payload.status });
    setOpenAlert(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    setFormPengumuman(emptyPengumuman);
    setKelas("");
  };

  const handleRefreshTokenUjian = async () => {
    const _token = await dispatch(createTokenUjian());
    if (_token.payload.status === "success") setTokenUjian(_token.payload.data.token);
    setAlerData({ msg: _token.payload.message, status: _token.payload.status });
    setOpenAlert(true);
  };

  const LogAktifitas = () => {
    return (
      <Card
        style={{
          justify: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <MDBox pt={3} px={3}>
          <MDTypography align="center" variant="h6" fontWeight="medium">
            TOKEN UJIAN
          </MDTypography>
        </MDBox>
        <MDBox p={2}>
          <MDTypography variant="h1" align="center" fontWeight="medium">
            {tokenUjian}
          </MDTypography>
        </MDBox>
        <MDBox p={2}>
          <MDButton onClick={handleRefreshTokenUjian} color="info" variant="contained">
            REFRESH
          </MDButton>
        </MDBox>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="dark" icon="person" title="Siswa" count={jmlSiswa} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard icon="article" title="Soal" count={jmlSoal} />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard color="success" icon="quiz" title="Ujian" count={jmlUjian} />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Pengumuman
                data={dataPengumuman}
                btnHapus={handleHpsPengumuman}
                kelass={kelasSiswa}
                onClick={handlePengumuman}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <LogAktifitas />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />

      <Dialog open={openDialog} onClose={onCloseDialog} fullWidth={true} maxWidth="xs">
        <DialogTitle>Tambah Pengumuman</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="nam"
            label="Judul"
            type="text"
            fullWidth
            variant="standard"
            value={formPengumuman.judul}
            onChange={(e) => onChangePengumuman(e, "judul")}
          />
          <TextField
            margin="dense"
            id="nam"
            label="Isi"
            type="text"
            fullWidth
            variant="standard"
            value={formPengumuman.isi}
            onChange={(e) => onChangePengumuman(e, "isi")}
          />
          <FormControl margin="dense" variant="standard" fullWidth>
            <InputLabel id="demo-simple-select-standard-label">Kelas</InputLabel>
            <Select
              // error={kelas === null}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Kelas"
              value={kelas}
              onChange={(e) => handleChange(e)}
            >
              {kelasSiswa.map((k) => {
                return <MenuItem value={k._id}>{k.nama}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <MDButton color="error" onClick={onCloseDialog}>
            Batal
          </MDButton>
          <MDButton onClick={() => handleSimpanPengumuman()}>Simpan</MDButton>
        </DialogActions>
      </Dialog>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alerData.status} sx={{ width: "100%" }}>
          {alerData.msg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Dashboard;
