import * as React from "react";
import { useCallback } from "react";
import { usePageState } from "../../components/PageState";
import useApiPagedFetch from "../../api/ApiPagedFetch";
import { getCustomerLicensesCurrent, getCustomerLicensesExpired, PageResults } from "../../api/API";
import CustomerLicense from "../../models/CustomerLicense";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import PageableItemsCard from "../../components/PageableItemsCard";
import { TableCell } from "@material-ui/core";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { formatDate } from "../../formatters/DateFormatters";
import { CancelToken } from "axios";


interface CustomerLicensesProps {
  customerId: number;
  title: string;
  onFetch: (customerId: number, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => Promise<PageResults<CustomerLicense>>;
  noItemsMessage?: string;
}

const CustomerLicenses: React.FC<CustomerLicensesProps> = (props) => {
  const [{pageNo, pageSize}, setPageNo, setPageSize] = usePageState({pageNo: 1, pageSize: 10});

  const {onFetch, customerId} = props;
  
  const fetchLicenses = useCallback(
    (pageNo?: number, pageSize?: number, cancelToken?: CancelToken) =>
      onFetch(customerId, pageNo, pageSize, cancelToken)
    , [onFetch, customerId]);
  
  const [fetchState, refetch] = useApiPagedFetch<CustomerLicense>(fetchLicenses, pageNo, pageSize);

  const errorMessageComponent = fetchState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving the customer's licenses", fetchState.error, refetch)
    : null;

  return (
    <PageableItemsCard title={props.title}
                       isLoading={fetchState.isFetching}
                       showLoadingError={fetchState.hasErrored && !fetchState.hasErroredWithNotFound}
                       loadingErrorComponent={errorMessageComponent}
                       columnHeaders={[
                         <TableCell key="serial">Serial</TableCell>,
                         <TableCell key="product">Product</TableCell>,
                         <TableCell key="quantity" align="right">Quantity</TableCell>,
                         <TableCell key="activations" align="right">Activations</TableCell>,
                         <TableCell key="expiry" align="right">Expiry</TableCell>,
                       ]}
                       items={fetchState.items}
                       noItemsMessage={props.noItemsMessage || "There are no licenses for this customer"}
                       itemKeySelector={license => license.id}
                       itemRowCellProvider={license => [
                         <TableCell key="serial" style={{fontFamily: "monospace"}}>{license.serialCode}</TableCell>,
                         <TableCell key="product">{license.product.name}</TableCell>,
                         <TableCell key="quantity" align="right">{license.quantity}</TableCell>,
                         <TableCell key="activations" align="right">{license.activations}</TableCell>,
                         <TableCell key="expiry" align="right">{formatDate(license.expirationDateTime)}</TableCell>,
                       ]}
                       pagination={{
                         kind: TablePaginationKind.Default,
                         pageNo: fetchState.pageNo,
                         pageSize: fetchState.pageSize,
                         onChangePageNo: setPageNo,
                         onChangePageSize: setPageSize,
                         pageCount: fetchState.pageCount,
                         totalItemCount: fetchState.totalItemCount,
                         labelRowsPerPage: "Licenses per page:"
                       }}/>
  );
};


const createCurrentCustomerLicenses = (userId: number, title: string = "Current Licenses") =>
  <CustomerLicenses customerId={userId}
                    title={title}
                    onFetch={getCustomerLicensesCurrent}
                    noItemsMessage="There are no current licenses for this user"/>;

const createExpiredCustomerLicenses = (userId: number, title: string = "Expired Licenses") =>
  <CustomerLicenses customerId={userId}
                    title={title}
                    onFetch={getCustomerLicensesExpired}
                    noItemsMessage="There are no expired licenses for this user"/>;


export { createCurrentCustomerLicenses, createExpiredCustomerLicenses };
export default CustomerLicenses;