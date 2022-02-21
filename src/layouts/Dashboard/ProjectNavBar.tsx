import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import { Grid, useTheme } from "@material-ui/core";
// import GridViewOutlinedIcon from "@material-ui/icons/GridViewOutlined";
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
// import { useTheme } from "@emotion/react";

const lightColor = "rgba(255, 255, 255, 0.7)";

const projectTitle = "16008: JUBILEE PLACE";

interface HeaderProps {
  title: string;
  tabValue?: number;
  handleTabChange?: (event: React.SyntheticEvent, value: number) => void;
}
//onChange={props.handleTabChange}>
export function ProjectNavBar(props: HeaderProps) {
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
                 {projectTitle} | <span style={{ color: "grey" }}>{props.title}</span>
              </Typography>
            </Grid>
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

export default ProjectNavBar;
