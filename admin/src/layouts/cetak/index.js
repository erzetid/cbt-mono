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

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Card from "@mui/material/Card";
// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Data
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "store/slice/authThunk";
import { getKelas } from "store/slice/kelasThunk";
import { getSiswaByKelas } from "store/slice/siswaThunk";
import { filterKelas, jwtDeccode } from "utils/jwtDecode";
import CetakDialog from "./cetakDialog";

const Cetak = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dataSiswa, setDataSiswa] = useState([]);
  const [kelasSiswa, setKelasSiswa] = useState([{ _id: "", nama: "" }]);
  const [kelas, setKelas] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role !== "admin") {
          return navigate("/login");
        }
        const _kelas = await dispatch(getKelas());
        setKelasSiswa(_kelas.payload.data);
      } else {
        return navigate("/login");
      }
    };
    checkLogin();
  }, []);

  const handleClickOpen = async () => {
    if (kelas !== "") {
      const { payload } = await dispatch(getSiswaByKelas(kelas));
      if (payload?.status === "success") {
        const dataCetak = payload.data.map((item) => {
          return {
            nama: item.nama,
            kelas: filterKelas(kelasSiswa, item.kelas),
            username: item.nisn,
            password: item.nisn,
          };
        });
        setDataSiswa(dataCetak);
        setOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setKelas(event.target.value);
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
                    Cetak Kartu Ujian
                  </MDTypography>
                </Grid>
              </MDBox>
              <MDBox p={5} sx={{ display: "flex", flexDirection: "row" }}>
                <Grid style={{ minWidth: 200 }}>
                  <FormControl margin="dense" variant="standard" fullWidth>
                    <InputLabel id="demo-simple-select-standard-label">Pilih Kelas</InputLabel>
                    <Select
                      error={kelas === null}
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
                </Grid>
                <Grid>
                  <MDButton
                    color="secondary"
                    style={{ marginBottom: -20, marginLeft: 5 }}
                    onClick={handleClickOpen}
                  >
                    Print
                  </MDButton>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <CetakDialog open={open} data={dataSiswa} handleClose={handleClose} />
      <Footer />
    </DashboardLayout>
  );
};

export default Cetak;
