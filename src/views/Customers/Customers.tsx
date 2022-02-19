import * as React from "react";
import { useCallback } from "react";
import { Box, Button, Container, createStyles, makeStyles, TableCell, Theme } from "@material-ui/core";
import useUrlSearch from "../../utils/UrlSearch";
import { getCustomers } from "../../api/API";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import Page from "../../components/Page";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import PageableItemsCard from "../../components/PageableItemsCard";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import CustomerLink from "./CustomerLink";
import CustomerTableCell from "./CustomerTableCell";
import { CancelToken } from "axios";
import CustomerSummary from "../../models/CustomerSummary";
import ResellerLink from "../Resellers/ResellerLink";
import ResellerTableCell from "../Resellers/ResellerTableCell";
import DateTimeTableCell from "../../components/DateTimeTableCell";


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
    indicatorCell: {
      width: "1%",
      whiteSpace: "nowrap",
    },
  });

const useStyles = makeStyles(styles);

const Customers: React.FC = () => {
  const fetch = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getCustomers(undefined, search, pageNo, pageSize, cancelToken), []);
  const [fetchState, refetch, searchTerm, setSearchTerm, handleChangePageSize] = useUrlSearch(fetch);

  const errorMessageComponent = fetchState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving customers", fetchState.error, refetch)
    : null;
  
  const cellProvider = (customer: CustomerSummary): React.ReactNode[] => {
    let cells;

    if (customer.isReseller) {
      cells = [
        <TableCell key="id" align="right">
          <ResellerLink customerId={customer.id}>
            <Box component="span" fontWeight="fontWeightMedium">{customer.id}</Box>
          </ResellerLink>
        </TableCell>,
        <ResellerTableCell key="customer"
                           customerId={customer.id}
                           name={customer.name}
                           country={customer.country}/>,
        
      ];
    } else {
      cells = [
        <TableCell key="id" align="right">
          <CustomerLink customerId={customer.id}>
            <Box component="span" fontWeight="fontWeightMedium">{customer.id}</Box>
          </CustomerLink>
        </TableCell>,
        <CustomerTableCell key="customer"
                           customerId={customer.id}
                           name={customer.name}
                           country={customer.country}/>
      ];
    }

    cells.push(<DateTimeTableCell key="created" align="right" dateTime={customer.createdDateTime}/>);
    
    return cells;
  }

  const classes = useStyles();
  return (
    <Page className={classes.root} title="Customers">
      <Container maxWidth={false}>
        <PageHeader title="Customers">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
          >
            <SearchInput
              className={classes.search}
              searchTerm={searchTerm}
              onChange={setSearchTerm}
            />
            <Button color="primary" variant="contained" style={{ minWidth: "fit-content" }}>
              Add customer
            </Button>
          </Box>
        </PageHeader>
        <PageableItemsCard
          className={classes.results}
          title="All Customers"
          isLoading={fetchState.isFetching}
          noItemsMessage="There are no customers to display here"
          showLoadingError={fetchState.hasErrored && !fetchState.hasErroredWithNotFound}
          loadingErrorComponent={errorMessageComponent}
          columnHeaders={[
            <TableCell key="id" align="right">ID</TableCell>,
            <TableCell key="customer">Customer</TableCell>,
            <TableCell key="created" align="right">Created</TableCell>
          ]}
          items={fetchState.items}
          itemKeySelector={customer => customer.id}
          itemRowCellProvider={cellProvider}
          pagination={{
            kind: TablePaginationKind.Routing,
            pageNo: fetchState.pageNo,
            pageSize: fetchState.pageSize,
            onChangePageSize: handleChangePageSize,
            pageCount: fetchState.pageCount,
            totalItemCount: fetchState.totalItemCount,
            labelRowsPerPage: "Customers per page:"
          }}
          reload={refetch}
        />
      </Container>
    </Page>
  );
};

export default Customers;