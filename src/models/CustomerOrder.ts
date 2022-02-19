import OrderStatus from "./OrderStatus";
import OrderCustomer from "./OrderCustomer";
import CustomerSummary from "./CustomerSummary";

interface CustomerOrder {
  id: number;
  isActive: boolean;
  dueDate: Date | null;
  customer: OrderCustomer;
  reseller: CustomerSummary;
  paymentMethod: string;
  orderStatus: OrderStatus;
  totalPrice: number;
  hasGst: boolean;
  datePaid: Date | null;
  dateCompleted: Date | null;
  invoiceId: string;
  createdDateTime: Date;
}

export default CustomerOrder;