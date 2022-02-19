import React, { useEffect, ChangeEvent } from "react";
import { Card, CardContent, Chip, createStyles, Grid, makeStyles, Theme, Typography, TextField } from "@material-ui/core";
import OrderStatus from "../../models/OrderStatus";
import PaymentMethod from "../../models/PaymentMethod";
import { formatDate } from "../../formatters/DateFormatters";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment";

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    header: {},
    content: {
      padding: theme.spacing(3)
    },
    logo: {
      height: "24px"
    }
  });

const useStyles = makeStyles(styles);

interface OrderDetailsCardProps {
  editing?: boolean;
  reference: string | null;
  dueDate: Date | null;
  status?: OrderStatus;
  cancelled?: boolean;
  paymentMethod?: PaymentMethod;
  couponCode?: string | null;
  onDueDateChanged: (date: Date | null) => void;
  onReferenceChanged: (reference: string | null) => void;
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({
  editing,
  reference,
  dueDate, 
  status,
  cancelled,
  paymentMethod,
  couponCode,
  onDueDateChanged,
  onReferenceChanged
}: OrderDetailsCardProps) => {
  const classes = useStyles();

  function getLogoSrc(): string | undefined {
    if (paymentMethod === PaymentMethod.SecurePay) {
      return "/images/logos/SecurePay.svg";
    }
    if (paymentMethod === PaymentMethod.PayPal) {
      return "/images/logos/pp_fc_hl.svg";
    }
    if (paymentMethod === PaymentMethod.Stripe) {
      return "/images/logos/250px-Stripe_Logo.png";
    }
    if (paymentMethod === PaymentMethod.BankDeposit) {
      // https://commons.wikimedia.org/wiki/File:ANZ-Logo-2009.svg
      return "https://upload.wikimedia.org/wikipedia/commons/c/c2/ANZ-Logo-2009.svg";
    }
    return undefined;
  }

  const logoSrc = getLogoSrc();
  
  const handleDueDateChanged = (date: MaterialUiPickersDate | null) => {
    if (!editing) {
      return;
    }

    onDueDateChanged(date != null ? date.toDate() : null);
  }

  const handleReferenceChanged = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!editing) {
      return;
    }

    onReferenceChanged(event.target.value);
  }

  useEffect(() => {
      if (!editing || dueDate != null) {
        return;
      }

      onDueDateChanged(moment().startOf("day").add(14, "days").toDate());
    },
    [editing, dueDate, onDueDateChanged]
  );
  
  return (
    <Card>
      <CardContent
        className={classes.content}
        style={{ overflow: "hidden" }}>
        <Grid container>
          <Grid container item direction="column" alignItems="center">
            <Grid item>
              {cancelled &&
              <Typography variant="h3"
                          color="error"
                          style={{
                            borderTop: "thick double #e53935",
                            borderBottom: "thick double #e53935",
                            width: "5.5em",
                            textAlign: "center",
                            transform: "rotate(3deg)"
                          }}>
                CANCELLED
              </Typography>
              }
            </Grid>
          </Grid>
          <Grid container
                item
                justify="space-between"
                alignItems="center"
                spacing={1}>

            <Grid item xs={6}>
              <Typography variant="h5" color="textSecondary">Due Date</Typography>
            </Grid>
            {!editing &&
            <Grid item>
              <Typography variant="h5" color="textPrimary">{formatDate(dueDate)}</Typography>
            </Grid>
            }
            {editing &&
            <Grid item xs={6}>
              <KeyboardDatePicker fullWidth
                                  inputVariant="filled"
                                  margin="dense"
                                  format="DD MMM YYYY"
                                  value={dueDate}
                                  onChange={handleDueDateChanged}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change due date',
                                  }}/>
            </Grid>
            }

            <Grid item xs={6}>
              <Typography variant="h5" color="textSecondary">Reference</Typography>
            </Grid>
            {!editing &&
            <Grid item>
              <Typography variant="h5" color="textPrimary">{reference}</Typography>
            </Grid>
            }
            {editing &&
            <Grid item xs={6}>
              <TextField fullWidth
                         variant="filled"
                         margin="dense"
                         value={reference ?? ""}
                         onChange={handleReferenceChanged}/>
            </Grid>
            }

            <Grid item xs={6}>
              <Typography variant="h5" color="textSecondary">Status</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" color="textPrimary">{status}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h5" color="textSecondary">Payment Method</Typography>
            </Grid>
            <Grid item>
              {logoSrc && (
                <img className={classes.logo}
                     alt={paymentMethod}
                     src={logoSrc}/>
              )}
              {!logoSrc && (
                <Typography variant="h5" color="textPrimary">
                  {paymentMethod}
                </Typography>
              )}
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h5" color="textSecondary">Coupon</Typography>
            </Grid>
            <Grid item>
              {couponCode && (
                <Chip variant="outlined"
                      size="small"
                      label={couponCode}
                      color="primary"/>
              )}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsCard;