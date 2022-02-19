import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core";
import useApiSearch from "../../api/ApiSearch";
import UserSummary from "../../models/UserSummary";
import { getCustomerUsers, getUsers } from "../../api/API";
import UserSearchResult from "./UserSearchResult";
import useDebounce from "../../utils/Debounce";
import CloseIcon from "@material-ui/icons/Close";
import clsx from 'clsx';
import FadeTransition from "../../components/FadeTransition";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import BusinessIcon from '@material-ui/icons/Business';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CustomerUserSummary from "../../models/CustomerUserSummary";
import { CancelToken } from "axios";

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
  selected: {
    "& .UserSearchResult-content": {
      backgroundColor: theme.palette.grey[100]
    }
  },
  message: {
    padding: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center'
  }
}));

export type SelectedUser = UserSummary & { autoSelected?: boolean } | null;

export interface FastSearchFixtures {
  companyName?: string;
  domainName?: string;
  emailAddress?: string;
}

interface UserSearchProps {
  selectedUser: SelectedUser;
  onSelectionChanged: (selectedUser: SelectedUser) => void;
  customerId?: number;
  disabled?: boolean;
  fixtures?: FastSearchFixtures;
}

const UserSearch: React.FC<UserSearchProps> = (props: UserSearchProps) => {
  const {selectedUser, onSelectionChanged, customerId, disabled, fixtures} = props;
  
  const classes = useStyles();
     
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const isCustomerScopedSearch = customerId != null;
  
  const isValidSearch = (s: string) => s.length >= 2;
  
  const shouldFetchUnscoped = useCallback(() => !isCustomerScopedSearch && isValidSearch(debouncedSearch), [isCustomerScopedSearch, debouncedSearch]);
  const [unscopedFetchState] = useApiSearch<UserSummary>(getUsers, debouncedSearch, 1, 50, shouldFetchUnscoped);
  
  const shouldFetchScoped = useCallback(() => isCustomerScopedSearch, [isCustomerScopedSearch]);
  const fetchCustomerUsers = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getCustomerUsers(customerId!, false, search, pageNo, pageSize, cancelToken), [customerId]);
  const [scopedFetchState] = useApiSearch<CustomerUserSummary>(fetchCustomerUsers, debouncedSearch, 1, 50, shouldFetchScoped);
  
  const isFetching = isCustomerScopedSearch ? scopedFetchState.isFetching : unscopedFetchState.isFetching;
  const hasErroredWithNotFound = isCustomerScopedSearch ? scopedFetchState.hasErroredWithNotFound : unscopedFetchState.hasErroredWithNotFound;
  const hasErrored = isCustomerScopedSearch ? scopedFetchState.hasErrored : unscopedFetchState.hasErrored;
  const error = isCustomerScopedSearch ? scopedFetchState.error : unscopedFetchState.error;
 
  const [options, setOptions] = useState<UserSummary[]>([]);
  
  useEffect(() => {
    if (isCustomerScopedSearch) {
      if (scopedFetchState.hasErroredWithNotFound) {
        setOptions([]);
      } else {
        setOptions(scopedFetchState.items.map(customerSummary => customerSummary.user));
      }
    } else {
      if (!isValidSearch(search) || unscopedFetchState.hasErroredWithNotFound) {
        setOptions([]);
      } else {
        setOptions(unscopedFetchState.items);
      }
    }
  }, [search, isCustomerScopedSearch, scopedFetchState.hasErroredWithNotFound, unscopedFetchState.hasErroredWithNotFound, scopedFetchState.items, unscopedFetchState.items]);
    
  useEffect(() => {
    if (options.length === 0 && selectedUser != null) {
      onSelectionChanged(null);
    } 
    
    if (options.length === 1 && (selectedUser == null || selectedUser.id !== options[0].id)) {
      onSelectionChanged({...options[0], autoSelected: true});
    } 
    
    if (options.length > 1 && selectedUser != null && (!options.some(item => item.id === selectedUser.id) || selectedUser.autoSelected)) {
      onSelectionChanged(null);
    }
  }, [selectedUser, onSelectionChanged, options]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleClear = () => {
    setSearch("");
  };

  const handleSetToFixture = (fixture: string) => {
    setSearch(fixture);
  };
  
  const handleSelectionChanged = (selectedUser: SelectedUser) => {
    if (!disabled) {
      onSelectionChanged(selectedUser);
    }
  };

  return (
    <>
      <TextField disabled={disabled}
                 autoFocus={true}
                 margin="dense"
                 variant="filled"
                 fullWidth
                 placeholder="Search Users"
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
                       {isFetching ? <Box className={classes.adornment}><CircularProgress color="inherit" size={20}/></Box> : null}
                       <IconButton
                         className={clsx(classes.adornment, classes.clearIndicator, {[classes.clearIndicatorVisible]: search.length > 0})}
                         aria-label="clear" onClick={handleClear}>
                         <CloseIcon fontSize="small"/>
                       </IconButton>
                       <Tooltip title="Company Name">
                         <IconButton
                           className={clsx(classes.adornment, {[classes.hiddenAdornment]: !fixtures?.companyName})}
                           aria-label="search company name"
                           onClick={() => handleSetToFixture(fixtures?.companyName || "")}>
                           <BusinessIcon fontSize="small"/>
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Domain Name">
                         <IconButton className={clsx(classes.adornment, {[classes.hiddenAdornment]: !fixtures?.domainName})}
                                     aria-label="search domain name"
                                     onClick={() => handleSetToFixture(fixtures?.domainName || "")}>
                           <AlternateEmailIcon fontSize="small"/>
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Email Address">
                         <IconButton className={clsx(classes.adornment, {[classes.hiddenAdornment]: !fixtures?.emailAddress})}
                                     aria-label="search email address"
                                     onClick={() => handleSetToFixture(fixtures?.emailAddress || "")}>
                           <MailOutlineIcon fontSize="small"/>
                         </IconButton>
                       </Tooltip>
                     </>
                   )
                 }}
      />
      <Box className={classes.content}>
        {options && options.length > 0 &&
        <FadeTransition in={!isFetching && !disabled} duration={!isFetching ? 400 : 800} fadedOpacity={0.32}>
          <Grid className={classes.options} container direction="row" justify="space-evenly" spacing={1}>
            {options.map(option => (
              <Grid item xs={12} key={option.id}
                    className={clsx(classes.option, {[classes.selected]: option.id === selectedUser?.id})}
                    onClick={() => handleSelectionChanged(option)}>
                <UserSearchResult userId={option.id}
                                  firstName={option.firstName}
                                  lastName={option.lastName}
                                  email={option.email}
                                  /*companyName={option.companyName}
                                  countryName={option.country?.name || ""}*//>
              </Grid>
            ))}
          </Grid>
        </FadeTransition>
        }
        {hasErroredWithNotFound &&
        <FadeTransition in={!isFetching}>
          <Typography variant="subtitle1" color="textSecondary" className={classes.message}>
            There are no matching users
          </Typography>
        </FadeTransition>
        }
        {!hasErroredWithNotFound && hasErrored &&
        <FadeTransition in={!isFetching}>
          <>
            {createRequestErrorMessage("An error has occurred retrieving the search results", error)}
          </>
        </FadeTransition>
        }
      </Box>
    </>
  );
};

export default UserSearch;