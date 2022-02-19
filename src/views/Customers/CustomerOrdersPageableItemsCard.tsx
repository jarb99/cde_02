import * as React from "react";
import CustomerOrder from "../../models/CustomerOrder";
import { PaginationProps } from "../../components/Pagination";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import { Box, Button, TableCell, useTheme } from "@material-ui/core";
import OrderTableCell from "../Orders/OrderTableCell";
import { formatDate } from "../../formatters/DateFormatters";
import { formatAud } from "../../formatters/NumberFormatters";
import PageableItemsCard from "../../components/PageableItemsCard";
import { Link as RouterLink } from "react-router-dom";
import { createAddOrderLocationDescriptor } from "../Orders/OrderPage";
import AddIcon from "@material-ui/icons/Add";
import { AxiosError } from "axios";
import CustomerTableCell from "./CustomerTableCell";
import ResellerTableCell from "../Resellers/ResellerTableCell";

export enum CustomerOrdersMode {
  Customer,
  Reseller
}

interface CustomerOrdersPageableItemsCardProps {
  customerId: number;
  mode?: CustomerOrdersMode;
  title: string;
  items: CustomerOrder[];
  isFetching: boolean;
  fetchErrored: boolean;
  fetchErroredWithNotFound: boolean;
  fetchError: AxiosError<CustomerOrder[]> | null;
  refetch: () => void;
  pagination?: PaginationProps;
}

const CustomerOrdersPageableItemsCard: React.FC<CustomerOrdersPageableItemsCardProps> = (props) => {
  const {customerId, mode, title, items, isFetching, fetchErrored, fetchErroredWithNotFound, fetchError, refetch, pagination} = props;

  const errorMessageComponent = fetchErrored
    ? createRequestErrorMessage("An error has occurred retrieving the customer's orders", fetchError, refetch)
    : null;

  const showDatePaid = items.some(order => order.datePaid != null);
  const showDateCompleted = items.some(order => order.dateCompleted != null);
  const showCustomer = items.some(order => order.customer.id !== customerId);
  const showReseller = items.some(order => order.reseller != null && order.reseller.id !== customerId);

  const filterColumns = (source: React.ReactElement[]): React.ReactElement[] => {
    return source.filter(column =>
      (showDatePaid || column.key !== "datePaid") &&
      (showDateCompleted || column.key !== "dateCompleted") &&
      (showCustomer || column.key !== "customer") &&
      (showReseller || column.key !== "reseller")
    );
  };

  const getColumnHeaders = (): React.ReactNode[] => {
    const headers = [
      <TableCell key="id" align="right">ID</TableCell>,
      <TableCell key="date" align="right">Date</TableCell>,
      <TableCell key="customer">Customer</TableCell>,
      <TableCell key="reseller">Reseller</TableCell>,
      <TableCell key="total" align="right">Total</TableCell>,
      <TableCell key="paymentMethod" align="center">Payment Method</TableCell>,
      <TableCell key="status" align="center">Status</TableCell>,
      <TableCell key="datePaid" align="right">Paid</TableCell>,
      <TableCell key="dateCompleted" align="right">Completed</TableCell>
    ];

    return filterColumns(headers);
  };

  const getCellProvider = (order: CustomerOrder): React.ReactNode[] => {
    const cells = [
      <OrderTableCell key="id" align="right" orderId={order.id}/>,
      <TableCell key="date" align="right">{formatDate(order.createdDateTime)}</TableCell>,
      <CustomerTableCell key="customer" customerId={order.customer.id} name={order.customer.name} country={order.customer.country}/>,
      (order.reseller ? <ResellerTableCell key="reseller" customerId={order.reseller?.id} name={order.reseller?.name} country={order.reseller?.country}/> : <TableCell key="reseller"/>),
      <TableCell key="total" align="right">{formatAud(order.totalPrice)}</TableCell>,
      <TableCell key="paymentMethod" align="center">{order.paymentMethod}</TableCell>,
      <TableCell key="status" align="center">{order.orderStatus}</TableCell>,
      <TableCell key="datePaid" align="right">{formatDate(order.datePaid)}</TableCell>,
      <TableCell key="dateCompleted" align="right">{formatDate(order.dateCompleted)}</TableCell>
    ];

    return filterColumns(cells);
  };

  const theme = useTheme();
  return (
    <PageableItemsCard title={title}
                       action={
                         <Box display="flex"
                              alignContent="center"
                              style={{
                                marginTop: theme.spacing(1)
                              }}>
                           <Button variant="contained"
                                   color="primary"
                                   component={RouterLink}
                                   to={createAddOrderLocationDescriptor(mode === CustomerOrdersMode.Reseller ? {resellerId: customerId} : {customerId})}
                                   startIcon={<AddIcon/>}>
                             Add
                           </Button>
                         </Box>
                       }
                       isLoading={isFetching}
                       showLoadingError={fetchErrored && !fetchErroredWithNotFound}
                       loadingErrorComponent={errorMessageComponent}
                       columnHeaders={getColumnHeaders()}
                       items={items}
                       noItemsMessage={"There are no orders for this customer"}
                       itemKeySelector={order => order.id}
                       itemRowCellProvider={getCellProvider}
                       pagination={pagination}/>
  );
};

export default CustomerOrdersPageableItemsCard;