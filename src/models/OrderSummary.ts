import OrderUser from "./OrderUser";
import OrderStatus from "./OrderStatus";
import PaymentMethod from "./PaymentMethod";
import OrderCustomer from "./OrderCustomer";

interface OrderSummary {
  id: number;
  isActive: boolean;
  dueDate: Date | null;
  customer: OrderCustomer;
  user: OrderUser;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  totalPrice: number;
  hasGst: boolean;
  datePaid: Date | null;
  dateCompleted: Date | null;
  invoiceId: string | null;
  createdDateTime: Date;
}

export default OrderSummary;