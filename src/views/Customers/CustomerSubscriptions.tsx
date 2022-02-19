import * as React from "react";
import PageableItemsCard from "../../components/PageableItemsCard";
import { TableCell } from "@material-ui/core";
import { formatDate } from "../../formatters/DateFormatters";
import { getCustomerSubscriptionsCurrent, getCustomerSubscriptionsExpired, PageResults } from "../../api/API";
import CustomerSubscriptionSummary, { getCustomerSubscriptionKey } from "../../models/CustomerSubscriptionSummary";
import SubscriptionKey, { stringifySubscriptionKey } from "../../models/SubscriptionKey";
import { usePageState } from "../../components/PageState";
import useApiPagedFetch from "../../api/ApiPagedFetch";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { CancelToken } from "axios";
import { useCallback } from "react";


interface CustomerSubscriptionsProps {
  customerId: number;
  title: string;
  onFetch: (customerId: number, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => Promise<PageResults<CustomerSubscriptionSummary>>
  noItemsMessage?: string;
}

const CustomerSubscriptions: React.FC<CustomerSubscriptionsProps> = (props: CustomerSubscriptionsProps) => {
  const [{pageNo, pageSize}, setPageNo, setPageSize] = usePageState({pageNo: 1, pageSize: 10});

  const {onFetch, customerId} = props;
  
  const fetchSubscriptions = useCallback(
    (pageNo?: number, pageSize?: number, cancelToken?: CancelToken) =>
      onFetch(customerId, pageNo, pageSize, cancelToken)
    , [onFetch, customerId]);
  
  const [fetchState, refetch] = useApiPagedFetch<CustomerSubscriptionSummary>(fetchSubscriptions, pageNo, pageSize);

  const hasPool = fetchState.items.some(subscription => subscription.pool != null);

  const getColumnHeaders = (): React.ReactNode[] => {
    let headers = [
      <TableCell key="pool">Pool</TableCell>,
      <TableCell key="product">Product</TableCell>,
      <TableCell key="licenseType">License Type</TableCell>,
      <TableCell key="quantity" align="right">Quantity</TableCell>,
      <TableCell key="expiry" align="right">Expiry</TableCell>
    ];

    return hasPool ? headers : headers.slice(1);
  };

  const getCellProvider = (subscription: CustomerSubscriptionSummary): React.ReactNode[] => {
    const cells = [
      <TableCell key="pool">{subscription.pool?.name || ""}</TableCell>,
      <TableCell key="product">{subscription.product.name}</TableCell>,
      <TableCell key="licenseType">{subscription.licenseType}</TableCell>,
      <TableCell key="quantity" align="right">{subscription.quantity}</TableCell>,
      <TableCell key="expiry" align="right">{formatDate(subscription.expiryDate)}</TableCell>
    ];

    return hasPool ? cells : cells.slice(1);
  };

  const getKey = (subs: CustomerSubscriptionSummary): SubscriptionKey => {
    return getCustomerSubscriptionKey(subs, props.customerId!);
  }

  const errorMessageComponent = fetchState.hasErrored
    ? createRequestErrorMessage("An error has occurred retrieving the customer's subscriptions", fetchState.error, refetch)
    : null;

  return (
    <PageableItemsCard title={props.title}
                       isLoading={fetchState.isFetching}
                       showLoadingError={fetchState.hasErrored && !fetchState.hasErroredWithNotFound}
                       loadingErrorComponent={errorMessageComponent}
                       columnHeaders={getColumnHeaders()}
                       items={fetchState.items}
                       noItemsMessage={props.noItemsMessage || "There are no subscriptions for this customer"}
                       itemKeySelector={item => stringifySubscriptionKey(getKey(item))}
                       itemRowCellProvider={getCellProvider}
                       pagination={{
                         kind: TablePaginationKind.Default,
                         pageNo: fetchState.pageNo,
                         pageSize: fetchState.pageSize,
                         onChangePageNo: setPageNo,
                         onChangePageSize: setPageSize,
                         pageCount: fetchState.pageCount,
                         totalItemCount: fetchState.totalItemCount,
                         labelRowsPerPage: "Subscriptions per page:"
                       }}/>
  );
};


const createCurrentCustomerSubscriptions = (customerId: number, title: string = "Current Subscriptions") =>
  <CustomerSubscriptions customerId={customerId}
                         title={title}
                         onFetch={getCustomerSubscriptionsCurrent}
                         noItemsMessage="There are no current subscriptions for this customer"/>;

const createExpiredCustomerSubscriptions = (customerId: number, title: string = "Expired Subscriptions") =>
  <CustomerSubscriptions customerId={customerId}
                         title={title}
                         onFetch={getCustomerSubscriptionsExpired}
                         noItemsMessage="There are no expired subscriptions for this customer"/>;


export { createCurrentCustomerSubscriptions, createExpiredCustomerSubscriptions }
export default CustomerSubscriptions;