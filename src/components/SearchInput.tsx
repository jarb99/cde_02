import React, { CSSProperties } from "react";
import { createStyles, makeStyles, Paper, Input, IconButton } from "@material-ui/core";
import { theme } from "../theme";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";

const styles = createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    search: {
      flexGrow: 1,
      height: 42,
      padding: theme.spacing(0, 2),
      display: 'flex',
      alignItems: 'center',
    },
    searchIcon: {
      marginRight: theme.spacing(2),
      color: theme.palette.icon,
    },
    searchInput: {
      flexGrow: 1,
    },
    input: {},
    focused: {},
    disabled: {},
    adornment: {
      padding: 4,
      color: theme.palette.action.active ,
    },
    clearIndicator: {
      marginRight: -2,
      visibility: "hidden",
    },
    clearIndicatorVisible: {
      visibility: "visible",
    },
  });

const useStyles = makeStyles(styles);

interface SearchInputProps {
  className?: string;
  style?: CSSProperties;
  searchTerm: string;
  onChange: (searchTerm: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { className, style, searchTerm, onChange } = props;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(event.target.value);
  }

  const handleClearSearch = () => {
    onChange("");
  }

  const classes = useStyles();

  const ClearInputButton: React.FC<{ visible: boolean, onClick: () => void }> = (props) => {
    return (
      <IconButton
        className={clsx(classes.adornment, classes.clearIndicator, {[classes.clearIndicatorVisible]: props.visible })}
        aria-label="clear"
        onClick={props.onClick}>
        <CloseIcon fontSize="small"/>
      </IconButton>
    );
  }

  return (
    <div className={clsx(classes.root, className)} style={style}>
      <Paper
        className={classes.search}
        elevation={1}
      >
        <SearchIcon className={classes.searchIcon} />
        <Input
          className={classes.searchInput}
          disableUnderline
          placeholder="Search"
          value={searchTerm}
          onChange={handleInputChange}
          classes={{
            root: classes.input,
            focused: classes.focused,
            disabled: classes.disabled
          }}
          endAdornment={(
            <ClearInputButton
              visible={searchTerm.length > 0}
              onClick={handleClearSearch}
            />
          )}
        />
      </Paper>
    </div>
  );
}

export default SearchInput;