import * as React from "react";
import { useCallback } from "react";
import PageableItemsCard from "../../components/PageableItemsCard";
import { Box, TableCell } from "@material-ui/core";
import CustomerLink from "../Customers/CustomerLink";
import CustomerTableCell from "../Customers/CustomerTableCell";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { CancelToken } from "axios";
import { getCustomers } from "../../api/API";
import useUrlSearch from "../../utils/UrlSearch";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import DateTimeTableCell from "../../components/DateTimeTableCell";


interface ResellerCustomersProps {
  resellerId: number;
}

const ResellerCustomers: React.FC<ResellerCustomersProps> = (props) => {
  const fetch = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getCustomers(props.resellerId, search, pageNo, pageSize, cancelToken), [props.resellerId]);
  // eslint-disable-next-line
  const [fetchState, refetch, searchTerm, setSearchTerm, handleChangePageSize] = useUrlSearch(fetch);

  const errorMessageComponent = fetchState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving customers", fetchState.error, refetch)
    : null;

  return (
    <PageableItemsCard
      title={"All Customers"}
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
      itemRowCellProvider={customer => [
        <TableCell key="id" align="right">
          <CustomerLink customerId={customer.id}>
            <Box component="span" fontWeight="fontWeightMedium">{customer.id}</Box>
          </CustomerLink>
        </TableCell>,
        <CustomerTableCell key="customer"
                           customerId={customer.id}
                           name={customer.name}
                           country={customer.country}/>,
        <DateTimeTableCell key="created" align="right" dateTime={customer.createdDateTime}/>
      ]}
      pagination={{
        kind: TablePaginationKind.Default,
        pageNo: fetchState.pageNo,
        pageSize: fetchState.pageSize,
        onChangePageSize: handleChangePageSize,
        pageCount: fetchState.pageCount,
        totalItemCount: fetchState.totalItemCount,
        labelRowsPerPage: "Customers per page:"
      }}
      reload={refetch}
    />
  )
};

export default ResellerCustomers;