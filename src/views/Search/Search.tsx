import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  makeStyles, Paper,
  TextField,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core";
import useApiSearch from "../../api/ApiSearch";
import useDebounce from "../../utils/Debounce";
import CloseIcon from "@material-ui/icons/Close";
import clsx from 'clsx';
import FadeTransition from "../../components/FadeTransition";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import BusinessIcon from '@material-ui/icons/Business';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { CancelToken } from "axios";
import { SearchResults } from "../../api/API";

const useStyles = makeStyles((theme: Theme) => createStyles({
  input: {
    "&:hover:not($disabled) $clearIndicatorVisible, &$focused $clearIndicatorVisible": {
      visibility: "visible",
    },
  },
  focused: {},
  disabled: {},
  adornment: {
    padding: 4,
    color: theme.palette.action.active
  },
  hiddenAdornment: {
    display: "none"
  },
  clearIndicator: {
    marginRight: -2,
    visibility: "hidden",
  },
  clearIndicatorVisible: {},
  content: {
    marginTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    height: "300px",
    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 203px)"
    }
  },
  options: {
    padding: theme.spacing(1),
  },
  option: {
    padding: theme.spacing(1)
  },
  resultContent: {
    padding: theme.spacing(2)
  },
  selected: {
    "& .SearchResult-content": {
      backgroundColor: theme.palette.grey[100]
    }
  },
  message: {
    padding: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center'
  }
}));


export interface FastSearchFixtures {
  companyName?: string;
  domainName?: string;
  emailAddress?: string;
}

interface Item {
  id: number;  
}

interface SelectedItem extends Item {
  autoSelected?: boolean;
}

interface SearchProps<TItem extends Item> {
  selectedItem: TItem & SelectedItem;
  onSelectionChanged: (selectedItem: TItem & SelectedItem | null) => void;
  fetch: (search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => Promise<SearchResults<TItem>>;
  renderResult: (item: TItem) => React.ReactNode;
  disabled?: boolean;
  fixtures?: FastSearchFixtures;
}

const Search: React.FC<SearchProps<any>> = <TItem extends Item>(props: PropsWithChildren<SearchProps<TItem>>) => {
  const {selectedItem, onSelectionChanged, fetch, renderResult} = props;
  
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const isValidSearch = (s: string) => s.length >= 2;
  const shouldFetch = useCallback(() => isValidSearch(debouncedSearch), [debouncedSearch]);

  const [fetchState] = useApiSearch<TItem>(fetch, debouncedSearch, 1, 50, shouldFetch);
  const [options, setOptions] = useState<TItem[]>([]);

  useEffect(() => {
    if (!isValidSearch(search) || fetchState.hasErroredWithNotFound) {
      setOptions([]);
    }
  }, [search, fetchState.hasErroredWithNotFound]);

  useEffect(() => {
    setOptions(fetchState.items);
  }, [fetchState.items]);

  useEffect(() => {
    if (options.length === 0 && selectedItem != null) {
      onSelectionChanged(null);
    }

    if (options.length === 1 && (selectedItem == null || selectedItem.id !== options[0].id)) {
      onSelectionChanged({...options[0], autoSelected: true});
    }

    if (options.length > 1 && selectedItem != null && (!options.some(item => item.id === selectedItem.id) || selectedItem.autoSelected)) {
      onSelectionChanged(null);
    }
  }, [selectedItem, onSelectionChanged, options]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClear = () => {
    setSearch("");
  };

  const handleSetToFixture = (fixture: string) => {
    setSearch(fixture);
  };

  const handleSelectionChanged = (selectedItem: TItem & SelectedItem) => {
    if (!props.disabled) {
      props.onSelectionChanged(selectedItem);
    }
  };

  return (
    <>
      <TextField disabled={props.disabled}
                 autoFocus={true}
                 margin="dense"
                 variant="filled"
                 fullWidth
                 placeholder="Search"
                 value={search}
                 onChange={handleChange}
                 InputProps={{
                   classes: {
                     root: classes.input,
                     focused: classes.focused,
                     disabled: classes.disabled
                   },
                   endAdornment: (
                     <>
                       {fetchState.isFetching ? <Box className={classes.adornment}><CircularProgress color="inherit" size={20}/></Box> : null}
                       <IconButton
                         className={clsx(classes.adornment, classes.clearIndicator, {[classes.clearIndicatorVisible]: search.length > 0})}
                         aria-label="clear" onClick={handleClear}>
                         <CloseIcon fontSize="small"/>
                       </IconButton>
                       <Tooltip title="Company Name">
                         <IconButton
                           className={clsx(classes.adornment, {[classes.hiddenAdornment]: !props.fixtures?.companyName})}
                           aria-label="search company name"
                           onClick={() => handleSetToFixture(props.fixtures?.companyName || "")}>
                           <BusinessIcon fontSize="small"/>
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Domain Name">
                         <IconButton className={clsx(classes.adornment, {[classes.hiddenAdornment]: !props.fixtures?.domainName})}
                                     aria-label="search domain name"
                                     onClick={() => handleSetToFixture(props.fixtures?.domainName || "")}>
                           <AlternateEmailIcon fontSize="small"/>
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Email Address">
                         <IconButton className={clsx(classes.adornment, {[classes.hiddenAdornment]: !props.fixtures?.emailAddress})}
                                     aria-label="search email address"
                                     onClick={() => handleSetToFixture(props.fixtures?.emailAddress || "")}>
                           <MailOutlineIcon fontSize="small"/>
                         </IconButton>
                       </Tooltip>
                     </>
                   )
                 }}
      />
      <Box className={classes.content}>
        {options && options.length > 0 &&
        <FadeTransition in={!fetchState.isFetching && !props.disabled} duration={!fetchState.isFetching ? 400 : 800} fadedOpacity={0.32}>
          <Grid className={classes.options} container direction="row" justify="space-evenly" spacing={1}>
            {options.map(option => (
              <Grid item xs={12} key={option.id}
                    className={clsx(classes.option, {[classes.selected]: option.id === selectedItem?.id})}
                    onClick={() => handleSelectionChanged(option)}>
                <Box width={1} className="SearchResult-root">
                  <Paper className={clsx(classes.resultContent, "SearchResult-content")}>
                    {renderResult(option)}
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </FadeTransition>
        }
        {fetchState.hasErroredWithNotFound &&
        <FadeTransition in={!fetchState.isFetching}>
          <Typography variant="subtitle1" color="textSecondary" className={classes.message}>
            There are no results
          </Typography>
        </FadeTransition>
        }
        {!fetchState.hasErroredWithNotFound && fetchState.hasErrored &&
        <FadeTransition in={!fetchState.isFetching}>
          <>
            {createRequestErrorMessage("An error has occurred retrieving the search results", fetchState.error)}
          </>
        </FadeTransition>
        }
      </Box>
    </>
  );
};

export default Search;