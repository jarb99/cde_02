import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from "@material-ui/core";
import XeroAvatar from "../../components/XeroAvatar";
import OrderInvoiceSummary from "../../models/OrderInvoiceSummary";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InvoiceSelectDialog from "../Invoices/InvoiceSelectDialog";
import { Skeleton } from "@material-ui/lab";
import XeroInvoiceLink from "../Invoices/XeroInvoiceLink";
import { CancelToken } from "axios";
import { exportOrderInvoice, getCustomerInvoices, updateOrderInvoices } from "../../api/API";
import InvoiceSummary from "../../models/InvoiceSummary";
import useApiSend, { SendStatus } from "../../api/ApiSend";
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from "@material-ui/icons/LinkOff";
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DialogTitle from "../../components/DialogTitle";
import * as _ from "lodash";


interface OrderInvoicesCardProps {
  isLoading: boolean;
  disabled?: boolean;
  orderId?: number;
  customerId?: number;
  invoices?: OrderInvoiceSummary[];
  onLinkedInvoicesChanged: (linkedInvoices: OrderInvoiceSummary[]) => void;
}

const OrderInvoicesCard: React.FC<OrderInvoicesCardProps> = (props) => {

  const menuButton = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [selecting, setSelecting] = useState(false);
  const handleFetch = useCallback((cancelToken?: CancelToken) => getCustomerInvoices(props.customerId!, cancelToken),
    [props.customerId]);
  
  const [saveState, save] = useApiSend(
    useCallback((payload: string[], cancelToken?: CancelToken) =>
        updateOrderInvoices(props.orderId!, payload, cancelToken)
      , [props.orderId]));
  
  const saving = saveState.status === SendStatus.Queued || saveState.status === SendStatus.Executing;
  
  const [exportInvoiceState, exportInvoice] = useApiSend(
    useCallback((payload: any, cancelToken?: CancelToken) =>
      exportOrderInvoice(props.orderId!, cancelToken)
      , [props.orderId]));
  
  const exporting = exportInvoiceState.status === SendStatus.Queued || exportInvoiceState.status === SendStatus.Executing;
  
  const [selectedInvoices, setSelectedInvoices] = useState<OrderInvoiceSummary[]>([]);
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState(false);
  const [exportConfirmationOpen, setExportConfirmationOpen] = useState(false);
  
  const handleMenuClick = () =>
    setMenuOpen(true);

  const handleMenuClose = () =>
    setMenuOpen(false);
  
  const handleLinkInvoicesClick = () => {
    setMenuOpen(false);
    setSelecting(true);
  };
  
  const handleDeleteLinksClick = () => {
    setMenuOpen(false);
    setRemoveConfirmationOpen(true);
  };

  const handleRemoveConfirmationClose = () =>
    setRemoveConfirmationOpen(false);

  const handleRemoveConfirmClick = () => {
    setRemoveConfirmationOpen(false);
    saveSelection([]);
  };
  
  const handleExportConfirmationClose = () =>
    setExportConfirmationOpen(false);

  const handleExportConfirmClick = () => {
    setExportConfirmationOpen(false);
    exportInvoice({});
  };
  
  const handleLinkInvoicesSaveClick = (selectedInvoices: InvoiceSummary[]) =>
    saveSelection(selectedInvoices);
  
  const saveSelection = (selectedInvoices: InvoiceSummary[]) => {
    setSelectedInvoices(selectedInvoices.map(invoice => ({
      orderId: props.orderId!,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber!
    })));
    
    save(selectedInvoices.map(invoice => invoice.id));
  };
  
  const {onLinkedInvoicesChanged} = props;

  useEffect(() => {
    if (exportInvoiceState.status === SendStatus.Completed) {
      if (onLinkedInvoicesChanged) {
        onLinkedInvoicesChanged([exportInvoiceState.response!]);
      }
    }
  }, [exportInvoiceState.status, exportInvoiceState.response, onLinkedInvoicesChanged])

  useEffect(() => {
    if (saveState.status === SendStatus.Completed) {
      setSelecting(false);
      
      if (onLinkedInvoicesChanged) {
        onLinkedInvoicesChanged(selectedInvoices);
      }
    }
  }, [saveState.status, onLinkedInvoicesChanged, selectedInvoices]);
  
  const handleSelectClose = () => {
    if (!saving) {
      setSelecting(false);
    }
  };
  
  const handleExportInvoiceClick = () => {
    setMenuOpen(false);
    setExportConfirmationOpen(true);
  };
  
  const getSeparator = (end: boolean, penultimate: boolean): string => {
    if (end) {
      return "";
    }
        
    if (penultimate) {
      return " and "
    }
    
    return ", ";
  };
  
  const getInvoiceLink = (invoice: OrderInvoiceSummary, index: number, count: number): React.ReactNode => ( 
    <span key={invoice.invoiceId}>
      <XeroInvoiceLink invoiceId={invoice.invoiceId}>{invoice.invoiceNumber}</XeroInvoiceLink>
      {getSeparator(index === count - 1, index === count - 2)}
    </span>
  );

  let exportConfirmationTitle = "";
  let exportConfirmationText = "";
  
  let title: React.ReactNode;
  let menuItems: React.ReactElement[] = [];
  
  const processing = props.isLoading || saving || exporting; 
  const noLinkedInvoices = "No linked invoices";
  
  if (processing) {
    title = <Skeleton width="60%"/>
  } else if (exportInvoiceState.status === SendStatus.Failed) {
    title = <Typography color="error">An error has occurred exporting the invoice</Typography>;
    menuItems = [];
  } else if (!props.orderId || !props.customerId) {
    title = <Typography color="textSecondary">{noLinkedInvoices}</Typography>;
    menuItems = [];
  } else if (props.invoices && props.invoices.length > 0) {
    title = (
      <Typography>
        Linked to&nbsp;
        {_.sortBy(props.invoices, invoice => invoice.invoiceNumber)
        .map((invoice, index, array) =>
          getInvoiceLink(invoice, index, array.length)
        )}
      </Typography>
    );
    
    if (props.invoices.length === 1) {
      menuItems = [
        <MenuItem aria-label="create invoice" onClick={handleExportInvoiceClick}>
          <ListItemIcon>
            <ImportExportIcon fontSize="small"/>
          </ListItemIcon>
          <Typography variant="inherit">Export Invoice</Typography>
        </MenuItem>,
        <Divider/>
      ];

      exportConfirmationTitle = `Export order to invoice ${props.invoices[0].invoiceNumber}?`;
      exportConfirmationText = `All existing line items on ${props.invoices[0].invoiceNumber} will be removed in Xero and replaced by new line items based on this order's details. Care should be taken not to inadvertently remove line items added outside of the invoice export process.`;
    }
    
    menuItems = [
      ...menuItems,
      <MenuItem aria-label="link invoices" onClick={handleLinkInvoicesClick}>
        <ListItemIcon>
          <SwapHorizIcon fontSize="small"/>
        </ListItemIcon>
        <Typography variant="inherit">Change Linked Invoices</Typography>
      </MenuItem>,
      <MenuItem aria-label="link invoices" onClick={handleDeleteLinksClick}>
        <ListItemIcon>
          <LinkOffIcon fontSize="small"/>
        </ListItemIcon>
        <Typography variant="inherit">Remove Linked Invoices</Typography>
      </MenuItem>
    ];
  } else {
    title = <Typography color="textSecondary">{noLinkedInvoices}</Typography>;
    menuItems = [
      <MenuItem aria-label="create invoice" onClick={handleExportInvoiceClick}>
        <ListItemIcon>
          <ImportExportIcon fontSize="small"/>
        </ListItemIcon>
        <Typography variant="inherit">Export Invoice</Typography>
      </MenuItem>,
      <MenuItem aria-label="link invoices" onClick={handleLinkInvoicesClick}>
        <ListItemIcon>
          <LinkIcon fontSize="small"/>
        </ListItemIcon>
        <Typography variant="inherit">Link Invoices</Typography>
      </MenuItem>
    ];

    exportConfirmationTitle = "Export order to a new invoice?";
    exportConfirmationText = "A new invoice will be created in Xero based on this order's details. Care should be taken not to introduce duplicate invoices in Xero.";
  }

  const action = menuItems.length > 0
    ? (
      <>
        <IconButton
          aria-label="more"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          ref={menuButton}
          disabled={processing || props.disabled}
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
    )
    : null;
  
  const selectedInvoiceIds = ((saving ? selectedInvoices : props.invoices) || []).map(invoice => invoice.invoiceId);
  
  return (
    <>
      <Card>
        <CardHeader avatar={<XeroAvatar/>}
                    title={title}
                    action={action}/>
      </Card>
      <InvoiceSelectDialog open={selecting} 
                           showProgress={saving}
                           disabled={saving}
                           errorMessage={saveState.error?.message}
                           selectedInvoices={selectedInvoiceIds}
                           onFetch={handleFetch}
                           onSave={handleLinkInvoicesSaveClick}
                           onCancel={handleSelectClose}/>

      <Dialog open={removeConfirmationOpen}
              onClose={handleRemoveConfirmationClose}>
        <DialogTitle title="Remove Xero invoice links?"/>
        <DialogContent>
          <DialogContentText>
            Removing these links prevents integration with Xero. This means invoices automated processing of paid 
            invoices will not proceed.
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

      <Dialog open={exportConfirmationOpen}
              onClose={handleExportConfirmationClose}>
        <DialogTitle title={exportConfirmationTitle}/>
        <DialogContent>
          <DialogContentText>
            {exportConfirmationText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportConfirmationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleExportConfirmClick} color="primary" autoFocus>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderInvoicesCard;