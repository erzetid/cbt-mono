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

import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAktifitasLogs, deleteLogs } from "store/slice/logThunk";
import { refreshToken } from "store/slice/authThunk";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import MDButton from "components/MDButton";
import { jwtDeccode } from "utils/jwtDecode";

const columns = [
  { Header: "nama", accessor: "namaSiswa", width: "25%", align: "left" },
  { Header: "ujian", accessor: "namaUjian", align: "left" },
  { Header: "status", accessor: "status", align: "center" },
  { Header: "action", accessor: "action", align: "center" },
];

const Aktifitas = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [refreshTable, setRefreshTable] = useState(false);

  const [barisLog, setBarisLog] = useState([]);
  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role !== "admin") {
          return navigate("/login");
        }
        const _log = await dispatch(getAktifitasLogs());
        setBarisLog(setTable(_log.payload.data));
      } else {
        return navigate("/login");
      }
    };
    checkLogin();
  }, [refreshTable]);
  const handleClickReset = async (id) => {
    await dispatch(refreshToken());
    await dispatch(deleteLogs(id));
    setRefreshTable(!refreshTable);
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
      const { namaSiswa, namaUjian, _id } = item;
      return {
        namaSiswa: <Nama name={namaSiswa} email="john@creative-tim.com" />,
        namaUjian: <Kelas title={namaUjian} />,
        status: <LoadingButton loading />,
        action: (
          <>
            <MDButton
              onClick={() => handleClickReset(_id)}
              size="small"
              variant="gradient"
              color="error"
              fontWeight="medium"
            >
              Reset
            </MDButton>
          </>
        ),
      };
    });
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
                    Aktifitas Ujian
                  </MDTypography>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: barisLog }}
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
      <Footer />
    </DashboardLayout>
  );
};

export default Aktifitas;
