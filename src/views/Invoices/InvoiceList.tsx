import * as React from "react";
import { MouseEventHandler } from "react";
import FadeTransition from "../../components/FadeTransition";
import {
  Checkbox,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core";
import InvoiceSummary from "../../models/InvoiceSummary";
import { formatDate } from "../../formatters/DateFormatters";
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import PaymentIcon from '@material-ui/icons/Payment';
import { formatAud } from "../../formatters/NumberFormatters";
import { makeStyles } from "@material-ui/core/styles";
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import XeroInvoiceLink, { useXeroInvoiceLink } from "./XeroInvoiceLink";

interface InvoiceListProps {
  selectedInvoices: string[];
  invoices: InvoiceSummary[];
  onInvoiceSelectionToggle: (invoiceId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  message: {
    padding: theme.spacing(5),
    display: 'flex',
    justifyContent: 'center'
  }
}));

const InvoiceList: React.FC<InvoiceListProps> = (props) => {
  const rowSpacing = 5;
  const cellSpacing = 1;
  const classes = useStyles();
  const getXeroInvoiceLink = useXeroInvoiceLink();

  const handleToggle = (value: string) => () => {
    props.onInvoiceSelectionToggle(value);
  };
  
  const handleOpenInXeroClick = (invoiceId: string): MouseEventHandler => (event) => {
    event.preventDefault();
    window.open(getXeroInvoiceLink(invoiceId));
  };

  return (
    <FadeTransition in={!props.isLoading && !props.disabled} duration={!props.isLoading ? 400 : 800}
                    fadedOpacity={0.32}>
      <div>
        {props.invoices.length > 0 &&
        <List>
          {props.invoices.map((invoice, index) => {
            const key = `${invoice.id}`;
            const labelId = `checkbox-list-label-${key}`;
            return (
              <ListItem key={key} divider button onClick={handleToggle(key)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={props.selectedInvoices.indexOf(key) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText id={labelId}>
                  <Grid container direction="column">
                    <Grid container item spacing={rowSpacing}>
                      <Grid item xs={3}>
                        <Typography variant="h6">
                          {invoice.invoiceNumber}
                        </Typography>
                      </Grid>
                      <Grid container item xs={4} spacing={cellSpacing}>
                        <Grid item>
                          <Typography color="textSecondary">
                            <ReceiptOutlinedIcon fontSize="small"/>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="textSecondary">
                            {formatAud(invoice.total || 0)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container item xs={4} spacing={cellSpacing}>
                        <Grid item>
                          <Typography color="textSecondary">
                            <PaymentIcon fontSize="small"/>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="textSecondary">
                            {formatAud(invoice.amountPaid || 0)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container item spacing={rowSpacing}>
                      <Grid item xs={3}>
                        <Typography color="textSecondary">
                          {invoice.status}
                        </Typography>
                      </Grid>
                      <Grid container item xs={4} spacing={cellSpacing}>
                        <Grid item>
                          <Typography color="textSecondary">
                            <TodayIcon fontSize="small"/>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="textSecondary">
                            {formatDate(invoice.date)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container item xs={4} spacing={cellSpacing}>
                        <Grid item>
                          <Typography color="textSecondary">
                            <EventIcon fontSize="small"/>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="textSecondary">
                            {formatDate(invoice.dueDate)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ListItemText>
                <ListItemSecondaryAction>
                  <XeroInvoiceLink invoiceId={invoice.id}>
                    <Tooltip title="Open in Xero">
                      <IconButton edge="end" aria-label="open in xero" onClick={handleOpenInXeroClick(invoice.id)}>
                        <OpenInNewIcon/>
                      </IconButton>
                    </Tooltip>
                  </XeroInvoiceLink>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
        }

        {!props.isLoading && props.invoices.length === 0 &&
        <Typography variant="subtitle1" color="textSecondary" className={classes.message}>
          No invoices were found
        </Typography>
        }
      </div>
    </FadeTransition>
  );
};

export default InvoiceList;
