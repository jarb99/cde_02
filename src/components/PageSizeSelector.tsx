import React from "react";
import { Theme, createStyles, makeStyles, MenuItem, Select, InputBase, MenuItemProps } from "@material-ui/core";
import classNames from "classnames";

const styles = (theme: Theme) => createStyles({
  pageSizeSelect: {
    textAlign: 'right',
    textAlignLast: 'right', // Align <select> on Chrome.
  },
  pageSizeSelectIcon: {},
  pageSizeInput: {
    color: 'inherit',
    fontSize: 'inherit',
    flexShrink: 0,
  },
  pageSizeSelectRoot: {},
  pageSizeMenuItem: {},
});

const useStyles = makeStyles(styles);

interface PageSizeSelectorProps {
  value: number;
  options?: number[];
  onChangePageSize: (size: number) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = (props) => {
  const handleChangeSubPageSize = (child: React.ReactNode) => {
    const value = (child as React.ReactElement<MenuItemProps>)?.props.value as string;
    if (value) {
      props.onChangePageSize(parseInt(value));
    }
  }

  const classes = useStyles();
  return (
    <Select classes={{
              select: classes.pageSizeSelect,
              icon: classes.pageSizeSelectIcon,
            }}
            input={<InputBase className={classNames(classes.pageSizeInput, classes.pageSizeSelectRoot)} />}
            value={props.value}
            onChange={(event: object, child: React.ReactNode) => handleChangeSubPageSize(child)}>
      {(props.options || [5, 10, 25]).map(value => (
        <MenuItem className={classes.pageSizeMenuItem}
                  key={value}
                  value={value}>
          {value}
        </MenuItem>
      ))}
    </Select>
  );
}

export default PageSizeSelector;