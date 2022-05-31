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
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, coba, refreshToken } from "../../../store/slice/authThunk";
// @mui material components
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { jwtDeccode } from "../../../utils/jwtDecode";

function Basic() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { token, loading, message } = useSelector((state) => state.auth);
  const [msg, setMsg] = useState(null);
  const handleLogin = async () => {
    if (username !== "" && password !== "") {
      const _token = await dispatch(login({ username, password }));
      console.log(_token);
      if (_token.payload.status === "success") {
        const jwt = jwtDeccode(_token.payload.token);
        if (jwt.role !== "admin") {
          setMsg("User tidak ditemukan");
        }
      }
    }
  };
  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatch(refreshToken());
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role === "admin") {
          console.log(jwt);
          return navigate("/dashboard");
        }
      }
    };
    checkLogin();
  }, [token]);
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            CBT - Nailul Rifki
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                error={username === ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                error={password === ""}
                fullWidth
              />
            </MDBox>
            {message && message !== "Access Denied / Unauthorized request" ? (
              <MDBox mb={2}>
                <Alert severity="warning">{message}</Alert>
              </MDBox>
            ) : null}
            {msg ? (
              <MDBox mb={2}>
                <Alert severity="warning">{msg}</Alert>
              </MDBox>
            ) : null}

            <MDBox mt={4} mb={1} textAlign="center">
              {loading ? (
                <CircularProgress color="info" />
              ) : (
                <MDButton variant="gradient" color="info" onClick={() => handleLogin()} fullWidth>
                  masuk
                </MDButton>
              )}
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
