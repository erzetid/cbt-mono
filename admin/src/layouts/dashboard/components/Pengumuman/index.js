/**
=========================================================
* Soft UI Dashboard React - v3.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Soft UI Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Soft UI Dashboard Materail-UI example components
import DataTable from "examples/Tables/DataTable";
import { filterKelas } from "utils/jwtDecode";

function Pengumuman({ onClick, data, kelass, btnHapus }) {
  const { columns, rows } = {
    columns: [
      { Header: "judul", accessor: "judul", width: "10%", align: "left" },
      { Header: "isi", accessor: "isi", width: "45%", align: "left" },
      { Header: "kelas", accessor: "kelas", align: "center" },
      { Header: "diperbarui", accessor: "diperbarui", align: "center" },
      { Header: "aksi", accessor: "aksi", align: "center" },
    ],
    rows: data.map((x) => {
      const { _id, judul, isi, diperbarui, kelas } = x;
      return {
        judul,
        isi,
        kelas: filterKelas(kelass, kelas),
        diperbarui: <MDTypography sx={{ fontSize: "inherit" }}>{diperbarui}</MDTypography>,
        aksi: (
          <>
            <Icon
              key={_id}
              sx={{ cursor: "pointer" }}
              onClick={() => btnHapus(_id)}
              color="error"
              fontSize="small"
            >
              delete_forever
            </Icon>
          </>
        ),
      };
    }),
  };
  const [menu, setMenu] = useState(null);

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
      <MenuItem onClick={onClick}>Buat</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Pengumuman
          </MDTypography>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
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
  );
}

export default Pengumuman;
