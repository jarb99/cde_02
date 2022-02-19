import React, { Suspense, useState } from "react";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import {
  Theme,
  createStyles,
  makeStyles,
  LinearProgress
} from "@material-ui/core";
import TopBar from "./TopBar";
import NavBar from "./NavBar";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      minHeight: "100vh",
      display: "flex",
      "@media all and (-ms-high-contrast:none)": {
        height: 0 // IE11 fix
      }
    },
    progress: {
      height: 2,
      marginBottom: -2
    },
    content: {
      paddingTop: 64,
      flexGrow: 1,
      maxWidth: "100%",
      overflowX: "hidden",
      [theme.breakpoints.up("lg")]: {
        paddingLeft: 256
      },
      [theme.breakpoints.down("xs")]: {
        paddingTop: 56
      }
    }
  });

const useStyles = makeStyles(styles);

const DashboardLayout: React.FunctionComponent<RouteConfigComponentProps<
  any
>> = (props: RouteConfigComponentProps<any>) => {
  const [openNavBarMobile, setOpenNavBarMobile] = useState<boolean>(false);

  function handleOpenNavBarMobile() {
    setOpenNavBarMobile(true);
  }

  function handleCloseNavBarMobile() {
    setOpenNavBarMobile(false);
  }

  const classes = useStyles();
  return (
    <>
      <TopBar onOpenNavBarMobile={handleOpenNavBarMobile} />
      <NavBar
        openMobile={openNavBarMobile}
        onMobileClose={handleCloseNavBarMobile}
      />
      <div className={classes.container}>
        <div className={classes.content}>
          <Suspense fallback={<LinearProgress className={classes.progress} />}>
            {renderRoutes(props.route ? props.route.routes : [])}
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
