import * as React from "react";
import useApiPagedFetch from "../../api/ApiPagedFetch";
import CustomerOrder from "../../models/CustomerOrder";
import { getCustomerOrders } from "../../api/API";
import { TablePaginationKind } from "../../components/TablePaginationKind";
import { usePageState } from "../../components/PageState";
import { CancelToken } from "axios";
import CustomerOrdersPageableItemsCard, { CustomerOrdersMode } from "./CustomerOrdersPageableItemsCard";
import { useCallback } from "react";


interface CustomerOrdersProps {
  customerId: number;
  mode?: CustomerOrdersMode;
}

const CustomerOrders: React.FC<CustomerOrdersProps> = (props: CustomerOrdersProps) => {
  const [{pageNo, pageSize}, setPageNo, setPageSize] = usePageState({pageNo: 1, pageSize: 10});

  const fetchCustomerOrders = useCallback(
    (pageNo?: number, pageSize?: number, cancelToken?: CancelToken) =>
      getCustomerOrders(props.customerId, pageNo, pageSize, cancelToken)
    , [props.customerId]);

  const [fetchState, refetch] = useApiPagedFetch<CustomerOrder>(fetchCustomerOrders, pageNo, pageSize);

  return (
    <CustomerOrdersPageableItemsCard customerId={props.customerId}
                                     mode={props.mode}
                                     title="All Orders"
                                     items={fetchState.items}
                                     isFetching={fetchState.isFetching}
                                     fetchErrored={fetchState.hasErrored}
                                     fetchErroredWithNotFound={fetchState.hasErroredWithNotFound}
                                     fetchError={fetchState.error}
                                     refetch={refetch}
                                     pagination={{
                                   kind: TablePaginationKind.Default,
                                   pageNo: fetchState.pageNo,
                                   pageSize: fetchState.pageSize,
                                   onChangePageNo: setPageNo,
                                   onChangePageSize: setPageSize,
                                   pageCount: fetchState.pageCount,
                                   totalItemCount: fetchState.totalItemCount,
                                   labelRowsPerPage: "Orders per page:"
                                 }}/>
  );
};

export default CustomerOrders;