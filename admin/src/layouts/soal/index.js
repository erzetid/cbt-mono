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
import { useNavigate, useSearchParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

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
  Icon,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import DataTable from "examples/Tables/DataTable";
import MuiAlert from "@mui/material/Alert";
import MDBadge from "components/MDBadge";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { refreshToken } from "store/slice/authThunk";
import { jwtDeccode } from "utils/jwtDecode";
import { useDispatch, useSelector } from "react-redux";
import { getSoal, deleteSoalById } from "store/slice/soalThunk";
import { setJawaban } from "store/slice/soalThunk";
import { postSoal } from "store/slice/soalThunk";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Soal() {
  const [menu, setMenu] = useState(null);
  const [dialogSoal, setDialogSoal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [openAlert, setOpenAlert] = useState(false);
  const [alerData, setAlerData] = useState({ msg: "", status: "" });
  const [nama, setNamaSoal] = useState("");
  const [jumlah, setJumlahSoal] = useState(0);
  const [jumlahOpsi, setjumlahOpsi] = useState(0);

  const [soals, setSoals] = useState([]);
  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      const soal = await dispatch(getSoal());
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role !== "admin") {
          console.log(jwt);
          return navigate("/login");
        }
        setSoals(soal.payload.data);
      } else {
        return navigate("/login");
      }
    };
    checkLogin();
  }, [token, openAlert]);
  const hapusSoal = async (_id) => {
    await dispatch(refreshToken());
    const _delete = await dispatch(deleteSoalById(_id));
    setAlerData({ msg: _delete.payload.message, status: _delete.payload.status });
    setOpenAlert(true);
  };
  const { columns, rows } = {
    columns: [
      { Header: "Kode Soal", accessor: "kodeSoal", width: "15%", align: "left" },
      { Header: "Nama soal", accessor: "namaSoal", width: "30%", align: "left" },
      { Header: "Jumlah Soal", accessor: "jumlahSoal", align: "center" },
      { Header: "Diperbarui", accessor: "diperbarui", align: "center" },
      { Header: "aksi", accessor: "aksi", align: "center" },
    ],
    rows: soals.map((x) => {
      const { _id, nama, jumlah, diperbarui } = x;

      return {
        kodeSoal: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
              {_id}
            </MDTypography>
          </MDBox>
        ),
        namaSoal: nama,
        jumlahSoal: <MDBadge badgeContent={jumlah + " butir"} size="xs" container />,
        diperbarui: <MDTypography sx={{ fontSize: "inherit" }}>{diperbarui}</MDTypography>,
        aksi: (
          <>
            <Icon
              sx={{ cursor: "pointer", mr: 1 }}
              onClick={() => navigate("/manage_soal?id_soal=" + _id)}
              color="success"
              fontSize="small"
            >
              visibility
            </Icon>
            <Icon
              sx={{ cursor: "pointer" }}
              color="error"
              onClick={() => hapusSoal(_id)}
              fontSize="small"
            >
              delete_forever
            </Icon>
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
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  const tambahSoal = async () => {
    await dispatch(refreshToken());
    const newSoal = await dispatch(
      postSoal({ nama, jumlah: parseInt(jumlah), jumlahOpsi: parseInt(jumlahOpsi) })
    );
    setAlerData({ msg: newSoal.payload.message, status: newSoal.payload.status });
    setOpenAlert(true);
    if (newSoal.payload.status === "success") {
      setDialogSoal(false);
      setNamaSoal("");
      setJumlahSoal(0);
      setjumlahOpsi(0);
    }
  };

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

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
                    Data Soal
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
        <DialogTitle>Tambah Soal</DialogTitle>
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
              label="Nama Soal"
              value={nama}
              onChange={(e) => setNamaSoal(e.target.value)}
              error={true}
              sx={{ mb: 1 }}
            />
            <MDInput
              label="Jumlah Soal"
              type="number"
              value={jumlah}
              onChange={(e) => setJumlahSoal(e.target.value)}
              error={true}
              sx={{ mb: 1 }}
            />
            <MDInput
              label="Jumlah Pilihan Ganda"
              value={jumlahOpsi}
              onChange={(e) => setjumlahOpsi(e.target.value)}
              type="number"
              error={true}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={closeDialogSoal}>Tutup</MDButton>
          <MDButton onClick={tambahSoal}>Simpan</MDButton>
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

export default Soal;
