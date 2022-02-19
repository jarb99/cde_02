import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Button, createStyles, Hidden, IconButton, makeStyles, Theme, Toolbar } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import InputIcon from "@material-ui/icons/Input";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      boxShadow: "none",
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.getContrastText(theme.palette.grey[800])
    },
    flexGrow: {
      flexGrow: 1
    },
    logo: {
      height: "42px"
    },
    menuButton: {
      marginRight: theme.spacing(1)
    },
    loginButton: {
      marginLeft: theme.spacing(1)
    },
    loginIcon: {
      marginRight: theme.spacing(1)
    },
    logoutButton: {
      marginLeft: theme.spacing(1)
    },
    logoutIcon: {
      marginRight: theme.spacing(1)
    }
  });

const useStyles = makeStyles(styles);

interface TopBarProps {
  onOpenNavBarMobile: () => void;
}

const TopBar: React.FC<TopBarProps> = (props: TopBarProps) => {
  const classes = useStyles();
  
  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Hidden lgUp>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            onClick={props.onOpenNavBarMobile}
          >
            <MenuIcon/>
          </IconButton>
        </Hidden>
        <RouterLink to="/">
          <img className={classes.logo} alt="Logo" src="/images/logos/logo--white.svg"/>
        </RouterLink>
        <div className={classes.flexGrow}/>
        <Hidden mdDown>
          <form className={classes.root} noValidate autoComplete="off" action="/api/account/logout" method="post">
            <Button className={classes.logoutButton}
                    color="inherit"
                    type="submit">
              <InputIcon className={classes.logoutIcon}/>
              Sign out
            </Button>
          </form>
          <span></span>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
