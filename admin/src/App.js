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

import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import brandDark from "assets/images/logo-ct-dark.png";
// Images
import brandWhite from "assets/images/logo-ct.png";
// Material Dashboard 2 React themes
import theme from "assets/theme";
// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React contexts
import { setMiniSidenav, setOpenConfigurator, useMaterialUIController } from "context";
import Configurator from "examples/Configurator";
// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import SignIn from "layouts/authentication/sign-in";
import Dashboard from "layouts/dashboard";
import ManageSoal from "layouts/manageSoal";
import Nilai from "layouts/teacher/nilai";
import Soal from "layouts/teacher/soal";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
// react-router components
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import routes from "routes";
import { refreshToken } from "store/slice/authThunk";
import { jwtDeccode } from "utils/jwtDecode";
import store from "./store";
const routeGuru = [
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
    name: "Nilai",
    key: "nilai",
    icon: <Icon fontSize="small">create</Icon>,
    route: "/nilai",
    path: "/nilai",
    element: <Nilai />,
  },
];
export default function App() {
  const dispatchs = useDispatch();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const [menus, setMenus] = useState([]);
  const { token } = useSelector((state) => state.auth);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  useEffect(() => {
    const checkLogin = async () => {
      const auth = await dispatchs(refreshToken());
      if (auth.payload.status === "success") {
        const jwt = jwtDeccode(auth.payload.token);
        if (jwt.role === "admin") {
          setMenus(routes);
        } else {
          setMenus(routeGuru);
        }
      }
    };
    checkLogin();
  }, [menus, dispatchs, layout, token]);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route path={route.route} element={route.element} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <>
          <Routes>
            <Route path="/login" exact element={<SignIn />} />
            <Route path="/manage_soal" element={<ManageSoal />} />
            {getRoutes(menus)}
            <Route path="/home" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/nilai_guru" element={<Nilai />} />
          </Routes>
        </>
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="CBT - Nailul Rifki"
              routes={menus}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
      </ThemeProvider>
    </Provider>
  );
}
