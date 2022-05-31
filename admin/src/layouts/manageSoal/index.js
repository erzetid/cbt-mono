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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import MDButton from "components/MDButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RichEditorExample from "components/Draft/Draft";
import MDInput from "components/MDInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDeccode } from "utils/jwtDecode";
import { refreshToken } from "store/slice/authThunk";
import { getSoalById } from "store/slice/soalThunk";
import { getPerSoalById } from "store/slice/soalThunk";
import { editPertanyaan } from "store/slice/soalThunk";
import { change } from "store/slice/draftJs";
import { setJawaban } from "store/slice/soalThunk";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ManageSoal = () => {
  const [valueOpsi, setValueOpsi] = useState(null);
  const [btnAktif, setBtnAktif] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [soal, setSoal] = useState({ dataSoal: [], _id: "", nama: "" });
  const { token } = useSelector((state) => state.auth);
  const [perSoal, setPerSoal] = useState({ soal: "", pilihan: [], _id: "customId123" });
  const { value } = useSelector((state) => state.draftJs);
  const [searchParams, setSearchParams] = useSearchParams();
  const [alerData, setAlerData] = useState({ msg: "", status: "" });
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      const _soal = await dispatch(getSoalById(searchParams.get("id_soal")));
      setSoal(_soal.payload.data);
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
  }, [token]);
  const makeid = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const btnSoal = soal.dataSoal.map((item) => {
    return (
      <MDButton
        size="small"
        variant="contained"
        onClick={(e) => clickBtnColor(e)}
        sx={{
          margin: 0.1,
        }}
        color={btnAktif === item._id ? "success" : "secondary"}
        name={item._id}
      >
        {item.no}
      </MDButton>
    );
  });

  const clickBtnColor = async (e) => {
    await dispatch(refreshToken());
    const _perSoal = await dispatch(getPerSoalById(e.target.name));
    dispatch(change(_perSoal.payload.data.soal));
    setPerSoal(_perSoal.payload.data);
    setBtnAktif(e.target.name);
    setValueOpsi(_perSoal.payload.data.jawaban);
  };
  const handleChangeOpsi = async (event) => {
    const jawaban = event.target.value;
    const _id = perSoal._id;
    const _data = await dispatch(setJawaban({ _id, jawaban }));
    setValueOpsi(jawaban);
    setAlerData({ msg: _data.payload.message, status: _data.payload.status });
    setOpenAlert(true);
  };

  const simpanSoal = async () => {
    await dispatch(refreshToken());
    const _data = await dispatch(
      editPertanyaan({ pertanyaan: value, _id: btnAktif, pilihan: perSoal.pilihan })
    );
    setAlerData({ msg: _data.payload.message, status: _data.payload.status });
    setOpenAlert(true);
  };
  const handleChange = (event, index, _id) => {
    let _opsiInput = perSoal.pilihan;
    _opsiInput[index] = { opsi: event.target.value, _id };
    setPerSoal({ ...perSoal, pilihan: _opsiInput });
  };

  const opsiSoal = perSoal.pilihan.map((x, index) => {
    return (
      <RadioGroup
        key={x._id}
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={valueOpsi}
        onChange={(e) => handleChangeOpsi(e)}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <FormControlLabel value={x._id} control={<Radio />} label={x._id} />
          </AccordionSummary>
          <AccordionDetails key={x._id}>
            <MDInput
              fullWidth
              value={x.opsi}
              onChange={(event) => handleChange(event, index, x._id)}
            />
          </AccordionDetails>
        </Accordion>
      </RadioGroup>
    );
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox sx={{ display: "flex", flexDirection: "column" }} alignItems="center" p={3}>
                <MDTypography variant="h6" gutterBottom>
                  {soal.nama}
                </MDTypography>
                <Grid container key={perSoal._id} spacing={1}>
                  <Grid item xs={12}>
                    {btnSoal}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RichEditorExample />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {opsiSoal}
                  </Grid>
                </Grid>
              </MDBox>
              <MDButton onClick={simpanSoal} sx={{ margin: 2 }} color="info">
                Simpan
              </MDButton>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alerData.status} sx={{ width: "100%" }}>
          {alerData.msg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default ManageSoal;
