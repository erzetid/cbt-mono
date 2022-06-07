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
import { Icon } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "store/slice/authThunk";
import { getKelas } from "store/slice/kelasThunk";
import { getNilaiUjian, getUjian } from "store/slice/ujianThunk";
import { filterKelas, jwtDeccode } from "utils/jwtDecode";
import PointDialog from "./PointDialog";

function Nilai() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [kelasSiswa, setKelasSiswa] = useState([{ _id: "", nama: "" }]);
  const [ujianArr, setUjianArr] = useState([]);
  const [dataNilai, setDataNilai] = useState([
    {
      nama: "",
      soal: "",
      nilai: "",
      waktuMulai: "",
      waktuSelesai: "",
      status: "",
    },
  ]);

  const handleClickOpen = async (_id) => {
    const nilai = await dispatch(getNilaiUjian(_id));
    if (nilai.payload.status === "success") {
      setDataNilai(nilai.payload.data);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        setUjianArr(_ujian.payload.data);
        const _kelas = await dispatch(getKelas());
        setKelasSiswa(_kelas.payload.data);
      } else {
        return navigate("/login");
      }
    };
    checkLogin();
  }, []);

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
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "aksi", accessor: "aksi", align: "center" },
    ],
    rows: ujianArr.map((ujian) => ({
      namaUjian: <NamaUjian nama={ujian.nama} />,
      kelas: filterKelas(kelasSiswa, ujian.idKelas),
      status: ujian.status,
      aksi: (
        <>
          <Icon
            sx={{ cursor: "pointer", mr: 1 }}
            onClick={() => handleClickOpen(ujian._id)}
            color="success"
            fontSize="small"
          >
            visibility
          </Icon>
        </>
      ),
    })),
  };

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
                    Data Nilai
                  </MDTypography>
                </MDBox>
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
      <PointDialog open={open} data={dataNilai} handleClose={handleClose} />
    </DashboardLayout>
  );
}

export default Nilai;
