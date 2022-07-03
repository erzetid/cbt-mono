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
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { FileUpload } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Icon,
  Radio,
  RadioGroup,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import RichEditorExample from "components/Draft/Draft";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { refreshToken } from "store/slice/authThunk";
import { change } from "store/slice/draftJs";
import {
  deleteFileSoal,
  editPertanyaan,
  getPerSoalById,
  getSoalById,
  setJawaban,
  upload,
} from "store/slice/soalThunk";
import { jwtDeccode } from "utils/jwtDecode";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ManageSoal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [valueOpsi, setValueOpsi] = useState(null);
  const [btnAktif, setBtnAktif] = useState(null);
  const [soal, setSoal] = useState({ dataSoal: [], _id: "", nama: "" });
  const { token } = useSelector((state) => state.auth);
  const [perSoal, setPerSoal] = useState({ soal: "", pilihan: [], _id: "customId123", file: null });
  const { value } = useSelector((state) => state.draftJs);
  const [searchParams, setSearchParams] = useSearchParams();
  const [alerData, setAlerData] = useState({ msg: "", status: "" });
  const [openAlert, setOpenAlert] = useState(false);
  const [dialogImport, setDialogImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadUpload, setLoadUpload] = useState(false);

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
  const closeDialogImport = () => {
    setDialogImport(false);
  };
  const openDialogImport = () => {
    setDialogImport(true);
  };
  const uploadFile = async () => {
    if (selectedFile) {
      setLoadUpload(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("_id", perSoal._id);
      const _upload = await dispatch(upload(formData));
      setAlerData({ msg: _upload.payload.message, status: _upload.payload.status });
      setOpenAlert(true);
      if (_upload.payload.status === "success") {
        setDialogImport(false);
        setSelectedFile(null);
        clickBtnColor({ target: { name: perSoal._id } });
      }
      setLoadUpload(false);
    }
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

  const isVideo = (filename) => filename && filename.includes("mp4");
  const isImage = (filename) =>
    (filename && filename.includes("png")) || filename.includes("jpeg") || filename.includes("jpg");
  const isAudio = (filename) => filename && filename.includes("mp3");

  const renderFile = () => {
    const filename = perSoal.file;
    if (!filename) return null;
    const source = "http://localhost:5000/dist/assets/" + perSoal.file;
    if (isVideo(filename)) {
      return (
        <video width="250" controls>
          <source src={source} />
        </video>
      );
    } else if (isImage(filename)) {
      return <img src={source} width={250} />;
    } else if (isAudio(filename)) {
      return (
        <audio width="250" controls>
          <source src={source} />
        </audio>
      );
    } else {
      return null;
    }
  };

  const deleteFile = async () => {
    // perSoal._id
    const _data = await dispatch(deleteFileSoal(perSoal._id));
    setAlerData({ msg: _data.payload.message, status: _data.payload.status });
    setOpenAlert(true);
    if (_data.payload.status === "success") {
      clickBtnColor({ target: { name: perSoal._id } });
    }
  };

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
                    {btnAktif ? (
                      <>
                        <RichEditorExample />
                        <MDBox sx={{ marginTop: 2, marginBottom: 2 }}>
                          {renderFile()}
                          {perSoal.file && (
                            <Icon
                              sx={{ cursor: "pointer" }}
                              color="error"
                              fontSize="medium"
                              onClick={deleteFile}
                            >
                              delete_forever
                            </Icon>
                          )}
                        </MDBox>
                        <MDButton onClick={openDialogImport} fullWidth color="primary">
                          Tambahkan File
                        </MDButton>
                      </>
                    ) : (
                      "Silahkan klik nomor soal"
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {opsiSoal}
                  </Grid>
                </Grid>
              </MDBox>
              {btnAktif && (
                <MDButton onClick={simpanSoal} sx={{ margin: 2 }} color="info">
                  Simpan
                </MDButton>
              )}
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
      <Dialog fullWidth maxWidth={"xs"} open={dialogImport} onClose={closeDialogImport}>
        <DialogTitle>Tambahkan File</DialogTitle>

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
              accept=".xlsx"
              id="icon-button-file"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={closeDialogImport}>Tutup</MDButton>
          <LoadingButton
            loading={loadUpload}
            loadingPosition="start"
            startIcon={<FileUpload />}
            color="primary"
            onClick={uploadFile}
          >
            Upload
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageSoal;
