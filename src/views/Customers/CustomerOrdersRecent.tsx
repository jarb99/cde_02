import * as React from "react";
import useApiFetch from "../../api/ApiFetch";
import { getCustomerOrdersRecent } from "../../api/API";
import CustomerOrder from "../../models/CustomerOrder";
import { CancelToken } from "axios";
import CustomerOrdersPageableItemsCard from "./CustomerOrdersPageableItemsCard";
import { useCallback } from "react";


interface CustomerOrdersRecentProps {
  customerId: number;
}

const CustomerOrdersRecent: React.FC<CustomerOrdersRecentProps> = (props: CustomerOrdersRecentProps) => {
  const {customerId} = props;
  const fetchCustomerOrders = useCallback((cancelToken?: CancelToken) => getCustomerOrdersRecent(customerId, cancelToken), [customerId]);
  const [fetchState, refetch] = useApiFetch<CustomerOrder[]>(fetchCustomerOrders);

  return (
    <CustomerOrdersPageableItemsCard customerId={customerId}
                                     title="Recent Orders"
                                     items={fetchState.data ?? []}
                                     isFetching={fetchState.isFetching}
                                     fetchErrored={fetchState.hasErrored}
                                     fetchErroredWithNotFound={fetchState.hasErroredWithNotFound}
                                     fetchError={fetchState.error}
                                     refetch={refetch}/>
  );
};

export default CustomerOrdersRecent;