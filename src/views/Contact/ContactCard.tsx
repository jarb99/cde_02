import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Theme,
  Typography
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useXeroContactLink } from "./XeroContactLink";
import XeroAvatar from "../../components/XeroAvatar";
import ContactSelectDialog from "./ContactSearchDialog";
import ContactSummary from "../../models/ContactSummary";
import { Skeleton } from "@material-ui/lab";
import DialogTitle from "../../components/DialogTitle";
import { createXeroContact, deleteUserXeroContact, getContact, updateUserXeroContact } from "../../api/API";
import { AxiosError, CancelToken } from "axios";
import useApiFetch from "../../api/ApiFetch";
import { SelectedContact } from "./ContactSearch";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from "@material-ui/core/styles";
import ContactPersonsTooltip from "./ContactPersonsTooltip";
import AddIcon from '@material-ui/icons/Add';
import CustomerDetails from "../../models/CustomerDetails";
import { getDomainName } from "../Users/userUtils";

interface ContactCardProps {
  isLoading: boolean;
  customer?: CustomerDetails;
  onContactChanged: (contact: ContactSummary | null) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  contactPerson: {
    marginBottom: -4
  }
}));

const ContactCard: React.FC<ContactCardProps> = (props: ContactCardProps) => {
  const classes = useStyles();
  const haveContactId = (props.customer && props.customer.contactId && props.customer.contactId !== "") || false;
  const [haveNextContactId, setHaveNextContactId] = useState(haveContactId);
  const shouldFetchContact = useCallback(() => haveNextContactId, [haveNextContactId]);

  const customerContactId = props.customer?.contactId;

  const fetchContact = useCallback((cancelToken?: CancelToken) =>
      getContact(customerContactId || "", cancelToken)
    , [customerContactId]);

  const [contactState] = useApiFetch<ContactSummary>(fetchContact, shouldFetchContact);
  const [currentContact, setCurrentContact] = useState(contactState.data);

  const currentContactId = currentContact?.id;

  useEffect(() => {
    setHaveNextContactId(haveContactId && customerContactId !== currentContactId);
  }, [haveContactId, customerContactId, currentContactId]);

  useEffect(() => {
    if (!haveContactId) {
      setCurrentContact(null);
    }
  }, [haveContactId]);

  useEffect(() => {
    setCurrentContact(contactState.data)
  }, [contactState.data]);

  const [createError, setCreateError] = useState<AxiosError | null>(null);
  const [creating, setCreating] = useState(false);
  
  const [deleteError, setDeleteError] = useState<AxiosError | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [selecting, setSelecting] = useState(false);
  const [saveError, setSaveError] = useState<AxiosError | null>(null);
  const [saving, setSaving] = useState(false);

  const menuButton = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [createConfirmationOpen, setCreateConfirmationOpen] = useState(false);
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState(false);
  
  const getXeroContactLink = useXeroContactLink();

  const clearErrors = () => {
    setDeleteError(null);
    setCreateError(null);
    setSaveError(null);
  };

  const changeContact = (contact: ContactSummary | null) => {
    setCurrentContact(contact);
    props.onContactChanged(contact);
  };
  
  const handleLinkContactClick = () => {
    setMenuOpen(false);
    setSelecting(true);
  };
  
  const handleCreateContactClick = () => {
    setMenuOpen(false);
    setCreateConfirmationOpen(true);
  };

  const handleCreateConfirmationClose = () => {
    setCreateConfirmationOpen(false);
  };
  
  const handleCreateConfirmClick = async () => {
    setCreateConfirmationOpen(false);
    setCreating(true);
    clearErrors();

    try {
      const response = await createXeroContact(props.customer!.id);
      changeContact(response.data);
    } catch (error) {
      setCreateError(error)
    } finally {
      setCreating(false);
    }
  };
  
  const handleSelectClose = () =>
    setSelecting(false);

  const handleSave = async (contact: SelectedContact) => {
    try {
      if (contact == null || !props.customer?.id) {
        return;
      }

      setSaving(true);
      clearErrors();
      await updateUserXeroContact(props.customer.id, contact.id);
      
      changeContact(contact);
      handleSelectClose();
    } catch (error) {
      setSaveError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleMenuClick = () =>
    setMenuOpen(true);

  const handleMenuClose = () =>
    setMenuOpen(false);

  const handleOpenInXeroClick = () => {
    handleMenuClose();
    window.open(getXeroContactLink(currentContactId!));
  };

  const handleDeleteLinkClick = () => {
    setMenuOpen(false);
    setRemoveConfirmationOpen(true);
  };

  const handleRemoveConfirmationClose = () =>
    setRemoveConfirmationOpen(false);

  const handleRemoveConfirmClick = async () => {
    setRemoveConfirmationOpen(false);
    setDeleting(true);
    clearErrors();

    try {
      await deleteUserXeroContact(props.customer!.id);
      changeContact(null);
    } catch (error) {
      setDeleteError(error)
    } finally {
      setDeleting(false);
    }
  };

  const processing = props.isLoading || contactState.isFetching || creating || deleting;

  let title: React.ReactNode;

  if (processing) {
    title = <Skeleton width="60%"/>;
  } else if (currentContact?.contactName) {
    title = (
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5">{currentContact.contactName}</Typography>
        </Grid>
        <Grid item>
          <ContactPersonsTooltip arrow contactPersons={currentContact.contactPersons}>
            <Badge anchorOrigin={{vertical: "bottom", horizontal: "right"}} 
                   color="primary"
                   badgeContent={currentContact.contactPersons.length}>
              <PersonIcon className={classes.contactPerson}/>
            </Badge>
          </ContactPersonsTooltip>
        </Grid>
      </Grid>
    );
  } else if (contactState.hasErroredWithNotFound) {
    title = <Typography color="error">Linked contact was not found</Typography>;
  } else if (contactState.hasErrored) {
    title = <Typography color="error">An error has occurred retrieving the Xero contact</Typography>;
  } else if (createError) {
    title = <Typography color="error">An error has occurred creating the contact</Typography>;
  } else if (deleteError) {
    title = <Typography color="error">An error has occurred removing the contact link</Typography>;
  } else {
    title = <Typography color="textSecondary">No linked contact</Typography>;
  }

  let subheader: React.ReactNode;

  if (processing) {
    subheader = <Skeleton width="40%"/>;
  } else if (currentContact?.id) {
    subheader = currentContact.location || <span>&nbsp;</span>;
  }

  let action: React.ReactNode;

  if (!processing && (!contactState.hasErrored || contactState.hasErroredWithNotFound)) {
    let menuItems: React.ReactElement[] = [];

    if (!customerContactId) {
      menuItems = [
        <MenuItem aria-label="link contact" onClick={handleLinkContactClick}>
          <ListItemIcon>
            <LinkIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">Link Contact</Typography>
        </MenuItem>,
        <MenuItem aria-label="create contact" onClick={handleCreateContactClick}>
          <ListItemIcon>
            <AddIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">Create Contact</Typography>
        </MenuItem>
      ];
    } else {
      if (!contactState.hasErroredWithNotFound) {
        menuItems = [
          <MenuItem aria-label="open in Xero" onClick={handleOpenInXeroClick}>
            <ListItemIcon>
              <OpenInNewIcon fontSize="small"/>
            </ListItemIcon>
            <Typography variant="inherit">Open in Xero</Typography>
          </MenuItem>,
          <Divider/>
        ];
      }
            
      menuItems = [
        ...menuItems,
        <MenuItem aria-label="change contact link" onClick={handleLinkContactClick}>
          <ListItemIcon>
            <LinkIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">Change Link</Typography>
        </MenuItem>,
        <MenuItem aria-label="remove contact link" onClick={handleDeleteLinkClick}>
          <ListItemIcon>
          <LinkOffIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">Remove Link</Typography>
        </MenuItem>
      ];
    }
    
    action = (
      <>
        <IconButton
          aria-label="more"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          ref={menuButton}
        >
          <MoreVertIcon fontSize="small"/>
        </IconButton>
        <Menu
          id="menu"
          anchorEl={menuButton.current}
          keepMounted
          open={menuOpen}
          onClose={handleMenuClose}
        >
          {menuItems.map((item, index) => 
            React.cloneElement(item, {key: index}))}
        </Menu>
      </>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader avatar={<XeroAvatar/>}
                    title={title}
                    subheader={subheader}
                    action={action}/>
      </Card>

      <ContactSelectDialog open={selecting}
                           saving={saving}
                           onSave={handleSave}
                           onCancel={handleSelectClose}
                           errorMessage={saveError?.message}
                           fixtures={{
                             companyName: props.customer?.name,
                             domainName: getDomainName(props.customer?.owner?.email),
                             emailAddress: props.customer?.owner?.email
                           }}/>

      <Dialog open={createConfirmationOpen}
              onClose={handleCreateConfirmationClose}>
        <DialogTitle title="Create new Xero contact?"/>
        <DialogContent>
          <DialogContentText>
            A new contact will be created in Xero based on this user's details. Care should be taken not to introduce
            duplicate contacts in Xero.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateConfirmClick} color="primary" autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
                                 
      <Dialog open={removeConfirmationOpen}
              onClose={handleRemoveConfirmationClose}>
        <DialogTitle title="Remove Xero contact link?"/>
        <DialogContent>
          <DialogContentText>
            Removing this link prevents integration with Xero. This means invoices will not be created or retrieved
            and automated processing of paid invoices will not proceed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRemoveConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveConfirmClick} color="primary" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ContactCard;
