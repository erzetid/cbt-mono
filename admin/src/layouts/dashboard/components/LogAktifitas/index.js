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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

function LogAktifitas() {
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
          6H8Z7
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDButton color="info" variant="contained">
          REFRESH
        </MDButton>
      </MDBox>
    </Card>
  );
}

export default LogAktifitas;
