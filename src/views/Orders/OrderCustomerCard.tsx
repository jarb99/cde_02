import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Fade,
  LinearProgress,
  makeStyles,
  Slide,
  Theme,
  Tooltip,
  Typography
} from "@material-ui/core";
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import OrderCustomer from "../../models/OrderCustomer";
import OrderUser from "../../models/OrderUser";
import UserLink from "../Users/UserLink";
import { createRequestErrorMessage, ErrorMessageSize } from "../../components/RequestErrorMessage";
import { AxiosError } from "axios";
import CustomerLink from "../Customers/CustomerLink";

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    header: {},
    progress: {
      height: 1,
      marginTop: -1
    },
    cardContent: {
      overflow: "hidden",
      padding: theme.spacing(0),
      '&:last-child': {
        paddingBottom: 0
      },
    },
    rowContainer: {
      display: "flex",
      flexDirection: "row",
      minHeight: "88px",
    },
    rowContent: {
      flexGrow: 1,
      margin: "auto",
      padding: theme.spacing(2, 3),
    },
    slideContainer: {
      display: "flex",
      padding: theme.spacing(2, 1, 2, 0),
    },
    slideContent: {
      borderLeft: `1px solid ${theme.palette.divider}`,
      display: "flex",
      paddingLeft: theme.spacing(1),
    },
    editButton: {
      variant: "text",
      color: "default",
      width: "100%",
      minWidth: 0,
      height: "100%",
      padding: theme.spacing(2),
    },
  });

const useStyles = makeStyles(styles);

const isDefined = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== "";
};

interface OrderCustomerCardProps {
  onCustomerChange: () => void;
  customer?: OrderCustomer;
  loadingCustomer?: boolean;
  loadCustomerFailed?: boolean;
  loadCustomerError?: AxiosError | null;
  onRetryFetchCustomer?: () => void;
  onUserChange: () => void;
  user?: OrderUser;
  loadingUser?: boolean;
  loadUserFailed?: boolean;
  loadUserError?: AxiosError | null;
  onRetryFetchUser?: () => void;
  hideNoUserMessage?: boolean;
  hideNoCustomerMessage?: boolean;
  showEditControls: boolean;
  disableEditControls?: boolean;
}

const OrderCustomerCard: React.FC<OrderCustomerCardProps> = (props: OrderCustomerCardProps) => {
  const { customer, user, showEditControls, disableEditControls } = props;
  const classes = useStyles();

  const [showingEditUser, setShowingEditUser] = useState<boolean>(false);
  const [showingEditCustomer, setShowingEditCustomer] = useState<boolean>(false);

  const companyName = customer?.name;
  const address = customer?.address;
  const city = customer?.city;
  const postalCode = customer?.postalCode;
  const state = customer?.state;
  const country = customer?.country?.name;
  const taxNumber = customer?.taxNumber;

  const showState = isDefined(state)
    && !(state?.trim().toLowerCase() === city?.trim().toLowerCase())
    && !(state?.trim().toLowerCase() === country?.trim().toLowerCase());

  return (
    <Card>
      <CardHeader className={classes.header}
                  title={<Typography variant="h4">Customer</Typography>} />
      <Divider />
      <Fade in={props.loadingUser || props.loadingCustomer || false}>
        <LinearProgress className={classes.progress}/>
      </Fade>
      <CardContent className={classes.cardContent}>
        <Box className={classes.rowContainer}>
          <Box className={classes.rowContent}>
            {props.loadUserFailed !== true && user !== null && user !== undefined && (
              <>
              {/* Name */}
              {(isDefined(user?.firstName) || isDefined(user?.lastName)) && (
                <Typography
                  variant="h5"
                  color="textPrimary">
                  <UserLink userId={user!.id}>
                    {`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
                  </UserLink>
                </Typography>
              )}
              {/* Email */}
              {isDefined(user?.email) && (
                <Typography
                  variant="body1"
                  color="textPrimary"
                  style={{wordBreak: "break-word"}}>
                  {user!.email}
                </Typography>
              )}
              </>
            )}
            {props.loadUserFailed !== true && user != null && props.hideNoUserMessage !== true && (
              <Typography variant="body1"
                          color="textSecondary"
                          align="center">
                There is no user linked to this order
              </Typography>
            )}
            {props.loadUserFailed === true &&
              createRequestErrorMessage("Error retrieving user details", props.loadUserError || null, props.onRetryFetchUser, ErrorMessageSize.Small)}
          </Box>
          {(showEditControls || showingEditUser) && (
            <Box className={classes.slideContainer}>
              <Slide in={showEditControls}
                     direction="left"
                     onEntering={() => setShowingEditUser(true)}
                     onExited={() => setShowingEditUser(false)}>
                <Box className={classes.slideContent}>
                  <Tooltip title="Change User">
                    <Button className={classes.editButton}
                            aria-label="change user"
                            onClick={props.onUserChange}
                            disabled={disableEditControls}>
                      <SwapHorizIcon />
                    </Button>
                  </Tooltip>
                </Box>
              </Slide>
            </Box>
          )}
        </Box>
        <Divider />
        <Box className={classes.rowContainer}>
          <Box className={classes.rowContent}>
            {props.loadCustomerFailed !== true && customer != null && (
              <>
              {/* Company Name */}
              {isDefined(companyName) && customer?.id && (
                <Typography
                  variant="h5"
                  color={"textPrimary"}>
                  <CustomerLink customerId={customer.id}>
                    {companyName}
                  </CustomerLink>
                </Typography>
              )}
              {/* Address */}
              {isDefined(address) && (
                <Typography
                  variant="body1"
                  color={"textPrimary"}>
                  {address}
                </Typography>
              )}
              {/* City */}
              {isDefined(city) && (
                <Typography
                  variant="body1"
                  color={"textPrimary"}
                  display="inline">
                  {city}
                </Typography>
              )}
              {isDefined(city) && showState && (
                <Typography
                  variant="body1"
                  display="inline">
                  {", "}
                </Typography>
              )}
              {/* State */}
              {showState && (
                <Typography
                  variant="body1"
                  color={"textPrimary"}
                  display="inline">
                  {state}
                </Typography>
              )}
              {showState && isDefined(postalCode) && (
                <Typography
                  variant="body1"
                  display="inline">
                  {", "}
                </Typography>
              )}
              {isDefined(city) && !showState && isDefined(postalCode) && (
                <Typography
                  variant="body1"
                  display="inline">
                  {", "}
                </Typography>
              )}
              {/* Postcode */}
              {isDefined(postalCode) && (
                <Typography
                  variant="body1"
                  color={"textPrimary"}
                  display="inline">
                  {postalCode}
                </Typography>
              )}
              {/* Country */}
              {isDefined(country) && (
                <Typography
                  variant="body1"
                  color={"textPrimary"}>
                  {country}
                </Typography>
              )}
              {/* Tax Number */}
              {isDefined(taxNumber) && (
                <Typography
                  variant="body1"
                  color={"textPrimary"}>
                  {taxNumber}
                </Typography>
              )}
              </>
            )}
            {props.loadCustomerFailed !== true && user != null && props.hideNoCustomerMessage !== true && (
              <Typography variant="body1"
                          color="textSecondary"
                          align="center">
                There is no customer linked to this order
              </Typography>
            )}
            {props.loadCustomerFailed === true &&
            createRequestErrorMessage("Error retrieving customer details", props.loadCustomerError || null, props.onRetryFetchCustomer, ErrorMessageSize.Small)}
          </Box>
          {(showEditControls || showingEditCustomer) && (
            <Box className={classes.slideContainer}>
              <Slide in={showEditControls}
                     direction="left"
                     onEntering={() => setShowingEditCustomer(true)}
                     onExited={() => setShowingEditCustomer(false)}>
                <Box className={classes.slideContent}>
                  <Tooltip title="Change Customer">
                    <Button className={classes.editButton}
                            aria-label="change customer"
                            onClick={props.onCustomerChange}
                            disabled={disableEditControls}>
                      <SwapHorizIcon />
                    </Button>
                  </Tooltip>
                </Box>
              </Slide>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCustomerCard;
