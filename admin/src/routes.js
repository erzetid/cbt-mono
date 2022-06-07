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

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `element` key is used to store the element of its route.
*/

// Material Dashboard 2 React layouts
// @mui icons
import Icon from "@mui/material/Icon";
import Aktifitas from "layouts/aktifitas";
import Cetak from "layouts/cetak";
import Dashboard from "layouts/dashboard";
import Nilai from "layouts/nilai";
import Pengaturan from "layouts/pengaturan";
import Siswa from "layouts/siswa";
import Soal from "layouts/soal";
import React from "react";
const Ujian = React.lazy(() => import("layouts/ujian"));

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Siswa",
    key: "siswa",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/siswa",
    path: "/siswa",
    element: <Siswa />,
  },
  {
    type: "collapse",
    name: "Soal",
    key: "soal",
    icon: <Icon fontSize="small">article</Icon>,
    route: "/soal",
    path: "/soal",
    element: <Soal />,
  },
  {
    type: "collapse",
    name: "Ujian",
    key: "ujian",
    icon: <Icon fontSize="small">quiz</Icon>,
    route: "/ujian",
    path: "/ujian",
    element: (
      <React.Suspense fallback="loading....">
        <Ujian />
      </React.Suspense>
    ),
  },
  {
    type: "collapse",
    name: "Nilai",
    key: "nilai",
    icon: <Icon fontSize="small">create</Icon>,
    route: "/nilai",
    path: "/nilai",
    element: <Nilai />,
  },
  {
    type: "collapse",
    name: "Aktifitas",
    key: "aktifitas",
    icon: <Icon fontSize="small">analytics</Icon>,
    route: "/aktifitas",
    path: "/aktifitas",
    element: <Aktifitas />,
  },
  {
    type: "collapse",
    name: "Cetak",
    key: "cetak",
    icon: <Icon fontSize="small">print</Icon>,
    route: "/cetak",
    path: "/cetak",
    element: <Cetak />,
  },
  {
    type: "collapse",
    name: "Pengaturan",
    key: "pengaturan",
    icon: <Icon fontSize="small">settings</Icon>,
    route: "/pengaturan",
    path: "/pengaturan",
    element: <Pengaturan />,
  },
];

export default routes;
