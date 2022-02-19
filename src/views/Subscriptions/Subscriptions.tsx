import React, { CSSProperties, useCallback } from "react";
import { Redirect, useLocation } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { LocationDescriptor } from "history";
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
import { subscriptionsPath } from "../../Routes";
import { getCurrentSubscriptions, getExpiredSubscriptions, getSubscriptions } from "../../api/API";
import useUrlSearch from "../../utils/UrlSearch";
import LocationUtils from "../../utils/LocationUtils";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import Page from "../../components/Page";
import SearchInput from "../../components/SearchInput";
import PageableItemsCard from "../../components/PageableItemsCard";
import { formatDate } from "../../formatters/DateFormatters";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import PageHeader from "../../components/PageHeader";
import CustomerTableCell from "../Customers/CustomerTableCell";
import { getSubscriptionKey } from "../../models/SubscriptionSummary";
import { stringifySubscriptionKey } from "../../models/SubscriptionKey";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    results: {},
    search: {},
  });

const useStyles = makeStyles(styles);

const defaultPageSize = 10;

const createLocationDescriptor = (path: string, searchTerm: string | undefined, pageSize: number): LocationDescriptor => {
  return LocationUtils.getLocationDescriptor(path, searchTerm, 1, pageSize, defaultPageSize);
}

const Subscriptions: React.FC = () => {
  const tabs = [
    { name: "current", label: "Current", path: subscriptionsPath + "/current", searchFunc: getCurrentSubscriptions },
    { name: "expired", label: "Expired", path: subscriptionsPath + "/expired", searchFunc: getExpiredSubscriptions },
    { name: "all"    , label: "All"    , path: subscriptionsPath + "/all"    , searchFunc: getSubscriptions        },
  ]

  const location = useLocation();
  const currentTab = tabs.find(tab => tab.path.toLowerCase() === location.pathname.toLowerCase());

  const searchFunc = currentTab?.searchFunc;
  const fetch = useCallback(searchFunc!, [searchFunc]);
  const shouldFetch = useCallback(() => Boolean(searchFunc), [searchFunc]);
  const [fetchState, refetch, searchTerm, setSearchTerm, handleChangePageSize] = useUrlSearch(fetch, shouldFetch, defaultPageSize);

  const theme = useTheme();
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  const headerStyle: CSSProperties = {};
  if (xsDown) {
    headerStyle.marginBottom = theme.spacing(2);
  }

  if (!currentTab) {
    // TODO: Render 'not found' component with delayed redirect?
    return <Redirect to={tabs[0].path} />;
  }

  const errorMessageComponent = fetchState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving subscriptions", fetchState.error, refetch)
    : null;

  return (
    <Page className={classes.root} title="Subscriptions">
      <Container maxWidth={false}>
        <PageHeader title="Subscriptions" style={headerStyle}>
          <Hidden xsDown>
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Box style={{ margin: theme.spacing(0, (smDown ? 1 : 2)) }}>
                <Tabs
                  value={currentTab.name}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="standard"
                  aria-label="subscriptions tabs"
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
                        padding: theme.spacing(0, (smDown ? 1 : 3)),
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
        <Hidden smUp>
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
              aria-label="subscriptions tabs"
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
            marginTop: theme.spacing(xsDown ? 2 : 3),
          }}
          title="All Subscriptions"
          isLoading={fetchState.isFetching}
          noItemsMessage="There are no subscriptions to display here"
          showLoadingError={fetchState.hasErrored && !fetchState.hasErroredWithNotFound}
          loadingErrorComponent={errorMessageComponent}
          columnHeaders={[
            <TableCell key="customer">Customer</TableCell>,
            <TableCell key="pool">Pool</TableCell>,
            <TableCell key="product">Product</TableCell>,
            <TableCell key="licenseType">License Type</TableCell>,
            <TableCell key="quantity" align="right">Quantity</TableCell>,
            <TableCell key="expiry" align="right">Expiry</TableCell>
          ]}
          items={fetchState.items}
          itemKeySelector={subscription => stringifySubscriptionKey(getSubscriptionKey(subscription))}
          itemRowCellProvider={subscriptionGroup => [
            <CustomerTableCell key="customer"
                               customerId={subscriptionGroup.customer.id}
                               name={subscriptionGroup.customer.name}
                               country={subscriptionGroup.customer.country} />,
            <TableCell key="pool">{subscriptionGroup.pool?.name || ""}</TableCell>,
            <TableCell key="product">{subscriptionGroup.product.name}</TableCell>,
            <TableCell key="licenseType">{subscriptionGroup.licenseType}</TableCell>,
            <TableCell key="quantity" align="right">{subscriptionGroup.quantity}</TableCell>,
            <TableCell key="expiry" align="right">{formatDate(subscriptionGroup.expiryDate)}</TableCell>          
          ]}
          pagination={{
            kind: TablePaginationKind.Routing,
            pageNo: fetchState.pageNo,
            pageSize: fetchState.pageSize,
            onChangePageSize: handleChangePageSize,
            pageCount: fetchState.pageCount,
            totalItemCount: fetchState.totalItemCount,
            labelRowsPerPage: "Subscriptions per page:"
          }}
          reload={refetch}
        />
      </Container>
    </Page>
  );
};

export default Subscriptions;
