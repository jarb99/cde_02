import React, { CSSProperties, useCallback } from "react";
import {
  Box,
  Container,
  createStyles,
  Hidden,
  makeStyles,
  Tab,
  TableCell,
  Tabs,
  Theme,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { getCancelledOrders, getCompleteOrders, getDraftOrders, getOrders, getPaidOrders } from "../../api/API";
import useUrlSearch from "../../utils/UrlSearch";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import Page from "../../components/Page";
import PageableItemsCard from "../../components/PageableItemsCard";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { formatAud } from "../../formatters/NumberFormatters";
import { formatDate } from "../../formatters/DateFormatters";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import OrderTableCell from "./OrderTableCell";
import { ordersPath } from "../../Routes";
import UserTableCell from "../Users/UserTableCell";
import CustomerTableCell from "../Customers/CustomerTableCell";
import { Redirect, useLocation } from "react-router";
import { LocationDescriptor, LocationState } from "history";
import LocationUtils from "../../utils/LocationUtils";
import OrderSummary from "../../models/OrderSummary";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    results: {
      marginTop: theme.spacing(3),
    },
    search: {
      flexGrow: 1,
      maxWidth: 480,
      flexBasis: 480,
      margin: theme.spacing(0, 2),
    },
  });

const useStyles = makeStyles(styles);

const defaultPageSize = 10;

const createLocationDescriptor = (path: string, searchTerm: string | undefined, pageSize: number): LocationDescriptor<LocationState> => {
  return LocationUtils.getLocationDescriptor(path, searchTerm, 1, pageSize, defaultPageSize);
}

const Orders: React.FC = () => {
  const tabs = [
    {name: "draft", label: "Draft", path: ordersPath + "/draft", searchFunc: getDraftOrders},
    {name: "paid", label: "Paid", path: ordersPath + "/paid", searchFunc: getPaidOrders},
    {name: "complete", label: "Complete", path: ordersPath + "/complete", searchFunc: getCompleteOrders},
    {name: "cancelled", label: "Cancelled", path: ordersPath + "/cancelled", searchFunc: getCancelledOrders},
    {name: "all", label: "All", path: ordersPath + "/all", searchFunc: getOrders},
  ]

  const location = useLocation();
  const currentTab = tabs.find(tab => tab.path.toLowerCase() === location.pathname.toLowerCase());

  const searchFunc = currentTab?.searchFunc;
  const fetch = useCallback(searchFunc!, [searchFunc]);
  const shouldFetch = useCallback(() => Boolean(searchFunc), [searchFunc]);

  const [fetchState, refetch, searchTerm, setSearchTerm, handleChangePageSize] = useUrlSearch(fetch, shouldFetch, defaultPageSize);

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();

  const headerStyle: CSSProperties = {};
  if (smDown) {
    headerStyle.marginBottom = theme.spacing(2);
  }

  if (!currentTab) {
    // TODO: Render 'not found' component with delayed redirect?
    return <Redirect to={tabs[2].path} />;
  }

  const hasDueDate = fetchState.items.some(order => order.dueDate != null);
  const hasDatePaid = fetchState.items.some(order => order.datePaid != null);
  const hasDateCompleted = fetchState.items.some(order => order.dateCompleted != null);

  const filterColumns = (source: React.ReactElement[]): React.ReactElement[] => {
    const tabName = currentTab?.name;
    return source.filter(column => 
      (tabName === "draft" || ((tabName === "cancelled" || tabName === "all") && hasDueDate) || column.key !== "dueDate") &&
      (tabName === "cancelled" || tabName === "all" || column.key !== "status") &&
      (hasDatePaid || column.key !== "datePaid") && 
      (hasDateCompleted || column.key !== "dateCompleted"));
  };
  
  
  const getColumnHeaders = (): React.ReactNode[] => {
    const headers = [
      <TableCell key="id" align="right">ID</TableCell>,
      <TableCell key="date" align="right">Date</TableCell>,
      <TableCell key="user">User</TableCell>,
      <TableCell key="customer">Customer</TableCell>,
      <TableCell key="total" align="right">Total</TableCell>,
      <TableCell key="paymentMethod">Payment Method</TableCell>,
      <TableCell key="status">Status</TableCell>,
      <TableCell key="dueDate" align="right">Due</TableCell>,
      <TableCell key="datePaid" align="right">Paid</TableCell>,
      <TableCell key="dateCompleted" align="right">Completed</TableCell>
    ];
    
    return filterColumns(headers);
  };

  const getCellProvider = (order: OrderSummary): React.ReactNode[] => {
    const cells = [
      <OrderTableCell key="id" align="right" orderId={order.id}/>,
      <TableCell key="date" align="right">{formatDate(order.createdDateTime)}</TableCell>,
      <UserTableCell key="user"
                     userId={order.user.id}
                     firstName={order.user.firstName}
                     lastName={order.user.lastName}
                     email={order.user.email} />,
      <CustomerTableCell key="customer"
                         customerId={order.customer.id}
                         name={order.customer.name}
                         country={order.customer.country} />,
      <TableCell key="total" align="right">{formatAud(order.totalPrice)}</TableCell>,
      <TableCell key="paymentMethod">{order.paymentMethod}</TableCell>,
      <TableCell key="status">{order.orderStatus}</TableCell>,
      <TableCell key="dueDate" align="right">{formatDate(order.dueDate)}</TableCell>,
      <TableCell key="datePaid" align="right">{formatDate(order.datePaid)}</TableCell>,
      <TableCell key="dateCompleted" align="right">{formatDate(order.dateCompleted)}</TableCell>
    ];

    return filterColumns(cells);
  };
  
  const errorMessageComponent = fetchState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving orders", fetchState.error, refetch)
    : null;

  return (
    <Page className={classes.root} title="Orders">
      <Container maxWidth={false}>
        <PageHeader title="Orders" style={headerStyle}>
          <Hidden smDown>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Box style={{ margin: theme.spacing(0, (mdDown ? 1 : 2)) }}>
                <Tabs
                  value={currentTab.name}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="standard"
                  aria-label="orders tabs"
                  style={{
                    minHeight: "auto",
                  }}
                >
                  {tabs.map(tab => (
                    <Tab
                      key={tab.name}
                      value={tab.name}
                      label={tab.label}
                      component={RouterLink}
                      to={createLocationDescriptor(tab.path, fetchState.searchTerm, fetchState.pageSize)}
                      style={{
                        minWidth: 72,
                        minHeight: 40,
                        padding: theme.spacing(0, (mdDown ? 1 : 3)),
                      }}
                    />
                  ))}
                </Tabs>
              </Box>
              <Box>
                <SearchInput
                  className={classes.search}
                  searchTerm={searchTerm}
                  onChange={setSearchTerm}
                  style={{
                    maxWidth: 480,
                    flexBasis: 480,
                  }}
                />
              </Box>
            </Box>
          </Hidden>
        </PageHeader>
        <Hidden mdUp>
          <Box style={{ margin: theme.spacing(1, 0) }}>
            <SearchInput
              className={classes.search}
              searchTerm={searchTerm}
              onChange={setSearchTerm}
            />
          </Box>
          <Box style={{ margin: theme.spacing(1, 0) }}>
            <Tabs
              value={currentTab.name}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="orders tabs"
            >
              {tabs.map(tab => (
                <Tab
                  key={tab.name}
                  value={tab.name}
                  label={tab.label}
                  component={RouterLink}
                  to={createLocationDescriptor(tab.path, fetchState.searchTerm, fetchState.pageSize)}
                />
              ))}
            </Tabs>
          </Box>
        </Hidden>
        <PageableItemsCard
          className={classes.results}
          style={{
            marginTop: theme.spacing(smDown ? 2 : 3),
          }}
          title="All Orders"
          isLoading={fetchState.isFetching}
          noItemsMessage="There are no orders to display here"
          showLoadingError={fetchState.hasErrored && !fetchState.hasErroredWithNotFound}
          loadingErrorComponent={errorMessageComponent}
          columnHeaders={getColumnHeaders()}
          items={fetchState.items}
          itemKeySelector={order => order.id}
          itemRowCellProvider={getCellProvider}
          pagination={{
            kind: TablePaginationKind.Routing,
            pageNo: fetchState.pageNo,
            pageSize: fetchState.pageSize,
            onChangePageSize: handleChangePageSize,
            pageCount: fetchState.pageCount,
            totalItemCount: fetchState.totalItemCount,
            labelRowsPerPage: "Orders per page:"
          }}
          reload={refetch}
        />
      </Container>
    </Page>
  );
};

export default Orders;
