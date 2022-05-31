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
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MuiAlert from "@mui/material/Alert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Icon,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import DataTable from "examples/Tables/DataTable";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "store/slice/authThunk";
import { jwtDeccode, filterKelas } from "utils/jwtDecode";
import { getUjian, postUjian } from "store/slice/ujianThunk";
import { getKelas } from "store/slice/kelasThunk";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import { getSoal } from "store/slice/soalThunk";
import { deleteUjianById } from "store/slice/ujianThunk";
import { nonaktifkanUjian } from "store/slice/ujianThunk";
import { actifkanUjian } from "store/slice/ujianThunk";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const emptyUjian = {
  nama: "",
  idKelas: "",
  idSoal: "",
  durasi: 0,
  status: "",
  waktuMulai: new Date().toISOString(),
  _id: "",
};

function Ujian() {
  const [menu, setMenu] = useState(null);
  const [dialogSoal, setDialogSoal] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [kelasSiswa, setKelasSiswa] = useState([{ _id: "", nama: "" }]);
  const [waktuUjian, setWaktuUjian] = useState(new Date());
  const [openAlert, setOpenAlert] = useState(false);
  const [alerData, setAlerData] = useState({ msg: "", status: "" });
  const [ujianArr, setUjianArr] = useState([]);
  const [soal, setSoal] = useState([]);
  const [formTambahUjian, setFormTambahUjian] = useState(emptyUjian);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role !== "admin") {
          console.log(jwt);
          return navigate("/login");
        }
        const _ujian = await dispatch(getUjian());
        const _kelas = await dispatch(getKelas());
        const _soal = await dispatch(getSoal());
        setKelasSiswa(_kelas.payload.data);
        setSoal(_soal.payload.data);
        setUjianArr(_ujian.payload.data);
      } else {
        return navigate("/login");
      }
    };
    checkLogin();
  }, [token, openAlert]);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleSimpan = async () => {
    await dispatch(refreshToken());
    const _tambah = await dispatch(postUjian(formTambahUjian));
    setAlerData({ msg: _tambah.payload.message, status: _tambah.payload.status });
    setOpenAlert(true);
    if (_tambah.payload.status === "success") setDialogSoal(false);
  };
  const handleHpsUjian = async (_id) => {
    await dispatch(refreshToken());
    const _hapus = await dispatch(deleteUjianById(_id));
    setAlerData({ msg: _hapus.payload.message, status: _hapus.payload.status });
    setOpenAlert(true);
    if (_hapus.payload.status === "success") setDialogSoal(false);
  };
  const handleOnUjian = async (_id) => {
    await dispatch(refreshToken());
    const _on = await dispatch(actifkanUjian(_id));
    setAlerData({ msg: _on.payload.message, status: _on.payload.status });
    setOpenAlert(true);
    if (_on.payload.status === "success") setDialogSoal(false);
  };

  const handleOffUjian = async (_id) => {
    await dispatch(refreshToken());
    const _off = await dispatch(nonaktifkanUjian(_id));
    setAlerData({ msg: _off.payload.message, status: _off.payload.status });
    setOpenAlert(true);
    if (_off.payload.status === "success") setDialogSoal(false);
  };
  const NamaUjian = ({ nama }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {nama}
      </MDTypography>
    </MDBox>
  );
  const { columns, rows } = {
    columns: [
      { Header: "Nama Ujian", accessor: "namaUjian", width: "15%", align: "left" },
      { Header: "Kelas", accessor: "kelas", align: "left" },
      { Header: "Durasi", accessor: "durasi", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "waktu", accessor: "waktu", align: "center" },
      { Header: "aksi", accessor: "aksi", align: "right" },
    ],
    rows: ujianArr.map((x) => {
      const { _id, nama, idKelas, idSoal, durasi, status, waktuMulai } = x;
      return {
        namaUjian: <NamaUjian nama={nama} />,
        kelas: filterKelas(kelasSiswa, idKelas),
        durasi: `${durasi} menit`,
        status: (
          <MDBadge
            badgeContent={status}
            size="xs"
            color={status === "aktif" ? "info" : "secondary"}
            container
          />
        ),
        waktu: <MDTypography sx={{ fontSize: "inherit" }}>{waktuMulai}</MDTypography>,
        aksi: (
          <>
            <MDButton
              size="small"
              variant="contained"
              color={status === "aktif" ? "warning" : "success"}
              sx={{ marginRight: 0.2 }}
              onClick={status === "aktif" ? () => handleOffUjian(_id) : () => handleOnUjian(_id)}
            >
              {status === "aktif" ? "OFF" : "ON"}
            </MDButton>
            <MDButton
              size="small"
              onClick={() => handleHpsUjian(_id)}
              variant="contained"
              color="error"
            >
              Hapus
            </MDButton>
          </>
        ),
      };
    }),
  };

  const openDialogSoal = () => {
    setDialogSoal(true);
  };
  const closeDialogSoal = () => {
    setDialogSoal(false);
  };

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const handleChange = (val, name) => {
    console.log(val);
    let _formUjian = { ...formTambahUjian };
    _formUjian[`${name}`] = val;
    setFormTambahUjian(_formUjian);
  };

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={() => openDialogSoal()}>Buat</MenuItem>
    </Menu>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <MDBox>
                  <MDTypography variant="h6" gutterBottom>
                    Data Ujian
                  </MDTypography>
                </MDBox>
                <MDBox color="text" px={2}>
                  <Icon
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                    fontSize="small"
                    onClick={openMenu}
                  >
                    more_vert
                  </Icon>
                </MDBox>
                {renderMenu}
              </MDBox>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  showTotalEntries={false}
                  isSorted={false}
                  noEndBorder
                  entriesPerPage={false}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Dialog fullWidth maxWidth={"xs"} open={dialogSoal} onClose={closeDialogSoal}>
        <DialogTitle>Tambah Ujian</DialogTitle>
        <DialogContent>
          <MDBox
            fullWidth
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              mt: 1,
            }}
          >
            <MDInput
              value={formTambahUjian.nama}
              onChange={(e) => handleChange(e.target.value, "nama")}
              label="Nama Ujian"
              sx={{ mb: 1 }}
            />
            <MDInput
              value={formTambahUjian.durasi}
              onChange={(e) => handleChange(parseInt(e.target.value), "durasi")}
              label="Durasi (menit)"
              type="number"
              sx={{ mb: 1 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} sx={{ mb: 1 }}>
              <MobileDateTimePicker
                renderInput={(props) => <MDInput {...props} />}
                label="Jadwal"
                value={new Date(formTambahUjian.waktuMulai)}
                onChange={(newValue) => {
                  handleChange(newValue.toISOString(), "waktuMulai");
                }}
              />
            </LocalizationProvider>
            <FormControl margin="dense" variant="standard" sx={{ mb: 1 }} fullWidth>
              <InputLabel id="demo-simple-select-standard-label">Kelas</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Kelas"
                value={formTambahUjian.idKelas}
                onChange={(e) => handleChange(e.target.value, "idKelas")}
              >
                {kelasSiswa.map((k) => {
                  return <MenuItem value={k._id}>{k.nama}</MenuItem>;
                })}
              </Select>
            </FormControl>

            <FormControl margin="dense" variant="standard" sx={{ mb: 1 }} fullWidth>
              <InputLabel id="demo-simple-select-standard">Soal</InputLabel>
              <Select
                labelId="demo-simple-select-standard"
                id="demo-simple-select-standard"
                label="Soal"
                value={formTambahUjian.idSoal}
                onChange={(e) => handleChange(e.target.value, "idSoal")}
              >
                {soal.map((s) => {
                  return <MenuItem value={s._id}>{s.nama}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={closeDialogSoal}>Tutup</MDButton>
          <MDButton onClick={handleSimpan}>Simpan</MDButton>
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

export default Ujian;
