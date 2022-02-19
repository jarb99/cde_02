import React, { Key, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Theme,
  createStyles,
  makeStyles,
  ListItem,
  Button,
  Collapse
} from "@material-ui/core";
import { SvgIconProps } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import classNames from "classnames";

const styles = (theme: Theme) =>
  createStyles({
    item: {
      display: "block",
      paddingTop: 0,
      paddingBottom: 0
    },
    itemLeaf: {
      display: "flex",
      paddingTop: 0,
      paddingBottom: 0
    },
    button: {
      padding: "10px 8px",
      justifyContent: "flex-start",
      textTransform: "none",
      letterSpacing: 0,
      width: "100%"
    },
    buttonLeaf: {
      padding: "10px 8px",
      justifyContent: "flex-start",
      textTransform: "none",
      letterSpacing: 0,
      width: "100%",
      fontWeight: theme.typography.fontWeightRegular,
      "&.depth-0": {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    icon: {
      color: theme.palette.icon,
      display: "flex",
      alignItems: "center",
      marginRight: theme.spacing(1)
    },
    expandIcon: {
      marginLeft: "auto",
      height: 16,
      width: 16
    },
    label: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto"
    },
    active: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
      "& $icon": {
        color: theme.palette.primary.main
      }
    }
  });

const useStyles = makeStyles(styles);

interface NavItemProps {
  id?: Key;
  title: string;
  href?: string;
  depth: number;
  icon?: React.ComponentType<SvgIconProps>;
  label?: () => React.ReactNode;
  isActive?: boolean;
  isOpen?: boolean;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = (props: NavItemProps) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen === true);

  // if user navigates to a child of a collapsed item then always expand
  if (props.isActive === true && !isOpen) {
    setIsOpen(true);
  }

  const handleToggle = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  let paddingLeft = 8;

  if (props.depth > 0) {
    paddingLeft = 32 + 8 * props.depth;
  }

  const style = {
    paddingLeft
  };

  const key = props.id || props.href || props.title;

  if (props.children) {
    return (
      <ListItem className={classes.item} disableGutters key={key}>
        <Button
          className={classNames(classes.button, {
            [classes.active]: props.isActive
          })}
          onClick={handleToggle}
          style={style}
        >
          {props.icon && <props.icon className={classes.icon} />}
          {props.title}
          {props.label && <span className={classes.label}>{props.label}</span>}
          {isOpen ? (
            <ExpandLessIcon className={classes.expandIcon} color="inherit" />
          ) : (
            <ExpandMoreIcon className={classes.expandIcon} color="inherit" />
          )}
        </Button>
        <Collapse in={isOpen}>{props.children}</Collapse>
      </ListItem>
    );
  }

  return (
    <ListItem className={classes.itemLeaf} disableGutters key={key}>
      <Button
        activeClassName={classes.active}
        className={classNames(classes.buttonLeaf, `depth-${props.depth}`, {
          [classes.active]: props.isActive
        })}
        component={NavLink}
        exact
        style={style}
        to={props.href!}
      >
        {props.icon && <props.icon className={classes.icon} />}
        {props.title}
        {props.label && <span className={classes.label}>{props.label}</span>}
      </Button>
    </ListItem>
  );
};

export default NavItem;
