import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Grid, useTheme } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import TimelineOutlinedIcon from "@material-ui/icons/TimelineOutlined";
// import GridViewOutlinedIcon from "@material-ui/icons/GridViewOutlined";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
// import { useTheme } from "@emotion/react";

const lightColor = "rgba(255, 255, 255, 0.7)";

interface HeaderProps {
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, value: number) => void;
}
//onChange={props.handleTabChange}>
export function Navbar(props: HeaderProps) {
  const theme = useTheme();
  return (
    <React.Fragment>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        style={{ zIndex: 0, backgroundColor: "#f0f0f0", color: theme.palette.grey[700] }}
      >
        <Toolbar
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "solid 3px #f57431"
          }}
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography component="h3" variant="h4">
                16008: JUBILEE PLACE
              </Typography>
            </Grid>
            {/* <Grid item xs container style={{paddingTop:"0px"}}>
              <Tabs value={props.tabValue} > 
                {/* <Tab icon={<GridViewOutlinedIcon />} label="PROJECT" /> */}
                {/* <Tab icon={<FileCopyOutlinedIcon />} label="DOCS" />
                <Tab icon={<TimelineOutlinedIcon />} label="TIMELINE" />
              </Tabs>
            </Grid> */} 
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <IconButton color="inherit" style={{ fontSize: 0.5 }}>
                <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default Navbar;
