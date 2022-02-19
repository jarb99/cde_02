import React, { useEffect, Key } from "react";
import { useLocation, matchPath } from "react-router";
import {
  Theme,
  createStyles,
  makeStyles,
  Hidden,
  Drawer,
  List,
  ListSubheader
} from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core";
import NavItem from "../../components/NavItem";
import NavItems from "./NavItems";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },
    mobileDrawer: {
      width: 256,
      paddingTop: theme.spacing(2)
    },
    desktopDrawer: {
      width: 256,
      top: 64,
      height: "calc(100% - 64px)",
      paddingTop: theme.spacing(2)
    },
    navigation: {
      overflow: "auto",
      padding: theme.spacing(0, 2, 2, 2),
      flexGrow: 1
    }
  });

const useStyles = makeStyles(styles);

export interface NavItemConfig {
  id?: Key;
  title: string;
  href?: string;
  isAbsolute?: boolean;
  icon?: React.ComponentType<SvgIconProps>;
  label?: () => React.ReactNode;
  items?: NavItemConfig[];
  isOpen?: boolean;
}

function resolvePath(
  basePath?: string,
  path?: string,
  isAbsolute?: boolean
): string | undefined {
  if (path) {
    return isAbsolute === true ? path : basePath + path;
  }
  return basePath;
}

function isItemActive(
  item: NavItemConfig,
  pathname: string,
  parentHref: string = ""
): boolean {
  const resolvedHref = resolvePath(parentHref, item.href, item.isAbsolute);

  if (item.items) {
    for (let i = 0; i < item.items.length; i++) {
      if (isItemActive(item.items[i], pathname, resolvedHref)) {
        return true;
      }
    }
  }

  if (resolvedHref) {
    const match = matchPath(pathname, { path: resolvedHref, exact: false });
    return match !== null;
  }
  return false;
}

function renderNavItem(
  item: NavItemConfig,
  pathname: string,
  depth: number = 0,
  parentHref: string = ""
): React.ReactNode {
  const key = item.id || item.title;

  if (!item.href) {
    return (
      <List key={key}>
        <ListSubheader disableSticky>
          {item.icon && item.icon}
          {item.title}
          {item.label && item.label()}
        </ListSubheader>
        {item.items && item.items.map(x => renderNavItem(x, pathname))}
      </List>
    );
  }

  const resolvedHref = resolvePath(parentHref, item.href, item.isAbsolute);

  const isActive = isItemActive(item, pathname, parentHref);

  if (item.items) {
    return (
      <NavItem
        depth={depth}
        icon={item.icon}
        key={key}
        label={item.label}
        isOpen={item.isOpen}
        isActive={isActive}
        title={item.title}
      >
        <List>
          {item.items.map(x =>
            renderNavItem(x, pathname, depth + 1, resolvedHref)
          )}
        </List>
      </NavItem>
    );
  }

  return (
    <NavItem
      depth={depth}
      href={resolvedHref}
      icon={item.icon}
      key={key}
      label={item.label}
      isActive={isActive}
      title={item.title}
    />
  );
}

interface NavBarProps {
  openMobile: boolean;
  onMobileClose: () => void;
}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
  const location = useLocation();

  useEffect(() => {
    if (props.openMobile && props.onMobileClose) {
      props.onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const classes = useStyles();

  const content = (
    <div className={classes.root}>
      <nav className={classes.navigation}>
        {NavItems.map(item => renderNavItem(item, location.pathname))}
      </nav>
    </div>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={props.onMobileClose}
          open={props.openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default NavBar;
