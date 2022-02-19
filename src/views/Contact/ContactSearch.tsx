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
import ContactSummary from "../../models/ContactSummary";
import { getContacts } from "../../api/API";
import ContactSearchResult from "./ContactSearchResult";
import CloseIcon from "@material-ui/icons/Close";
import clsx from 'clsx';
import FadeTransition from "../../components/FadeTransition";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import BusinessIcon from '@material-ui/icons/Business';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import useApiFetch from "../../api/ApiFetch";
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
    "& .ContactSearchResult-content": {
      backgroundColor: theme.palette.grey[100]
    }
  },
  message: {
    padding: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center'
  }
}));

export type SelectedContact = ContactSummary & { autoSelected?: boolean } | null;

export interface FastSearchFixtures {
  companyName?: string;
  domainName?: string;
  emailAddress?: string;
}


interface ContactSearchProps {
  selectedContact: SelectedContact;
  onSelectionChanged: (selectedContact: SelectedContact) => void;
  disabled?: boolean;
  fixtures?: FastSearchFixtures;
}

const ContactSearch: React.FC<ContactSearchProps> = (props: ContactSearchProps) => {
  const minimumSearchTermLength = 2;

  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(search);

  const isValidSearch = (s: string) => s.length >= minimumSearchTermLength;
  const shouldFetch = useCallback(() => isValidSearch(submittedSearch), [submittedSearch]);
  const fetch = useCallback((cancelToken?: CancelToken) => getContacts(submittedSearch, cancelToken), [submittedSearch]);

  const [fetchState] = useApiFetch<ContactSummary[]>(fetch, shouldFetch);
  const [options, setOptions] = useState<ContactSummary[]>([]);

  useEffect(() => {
    if (!error) {
      setHelperText("Press ↩ to search");
    } else {
      setHelperText(`Minimum length is ${minimumSearchTermLength} characters`)
    }
  }, [error])

  useEffect(() => {
    if (!isValidSearch(search) || fetchState.hasErroredWithNotFound) {
      setOptions([]);
    }
  }, [search, fetchState.hasErroredWithNotFound]);

  useEffect(() => {
    setOptions(fetchState.data || []);
  }, [fetchState.data]);

  const {selectedContact, onSelectionChanged} = props;

  useEffect(() => {
    if (options.length === 0 && selectedContact != null) {
      onSelectionChanged(null);
    }

    if (options.length === 1 && (selectedContact == null || selectedContact.id !== options[0].id)) {
      onSelectionChanged({...options[0], autoSelected: true});
    }

    if (options.length > 1 && selectedContact != null && (!options.some(item => item.id === selectedContact.id) || selectedContact.autoSelected)) {
      onSelectionChanged(null);
    }
  }, [selectedContact, onSelectionChanged, options]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextSearch = event.target.value;

    setSearch(nextSearch);

    if (isValidSearch(nextSearch)) {
      setError(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (isValidSearch(search)) {
        setSubmittedSearch(search);
      } else {
        setError(true);
      }
    }
  };

  const handleClear = () => {
    setSearch("");
  };

  const handleSetToFixture = (fixture: string) => {
    setSearch(fixture);
    setSubmittedSearch(fixture);
  };

  const handleSelectionChanged = (selectedContact: SelectedContact) => {
    if (!props.disabled) {
      props.onSelectionChanged(selectedContact);
    }
  };

  return (
    <>
      <TextField disabled={props.disabled}
                 autoFocus={true}
                 margin="dense"
                 variant="filled"
                 fullWidth
                 placeholder="Search Contacts"
                 helperText={helperText}
                 value={search}
                 error={error}
                 onChange={handleChange}
                 onKeyPress={handleKeyPress}
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
                         <IconButton
                           className={clsx(classes.adornment, {[classes.hiddenAdornment]: !props.fixtures?.domainName})}
                           aria-label="search domain name"
                           onClick={() => handleSetToFixture(props.fixtures?.domainName || "")}>
                           <AlternateEmailIcon fontSize="small"/>
                         </IconButton>
                       </Tooltip>
                       <Tooltip title="Email Address">
                         <IconButton
                           className={clsx(classes.adornment, {[classes.hiddenAdornment]: !props.fixtures?.emailAddress})}
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
        <FadeTransition in={!fetchState.isFetching && !props.disabled} duration={!fetchState.isFetching ? 400 : 800}
                        fadedOpacity={0.32}>
          <Grid className={classes.options} container direction="row" justify="space-evenly" spacing={1}>
            {options.map(option => ({
              ...option,
              primaryPerson: option.contactPersons.length > 0 ? option.contactPersons[0] : null
            }))
            .map(option => (
              <Grid item xs={12} key={option.id}
                    className={clsx(classes.option, {[classes.selected]: option.id === props.selectedContact?.id})}
                    onClick={() => handleSelectionChanged(option)}>
                <ContactSearchResult contactId={option.id}
                                     contactName={option.contactName}
                                     location={option.location}
                                     firstName={option.primaryPerson?.firstName || ""}
                                     lastName={option.primaryPerson?.lastName || ""}
                                     emailAddress={option.primaryPerson?.emailAddress || ""}/>
              </Grid>
            ))}
          </Grid>
        </FadeTransition>
        }
        {(fetchState.hasErroredWithNotFound || (fetchState.isComplete && (!fetchState.data || fetchState.data.length === 0))) &&
        <FadeTransition in={!fetchState.isFetching}>
          <Typography variant="subtitle1" color="textSecondary" className={classes.message}>
            There are no matching contacts
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

export default ContactSearch;