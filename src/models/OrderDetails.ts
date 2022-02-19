import OrderUser from "./OrderUser";
import OrderCustomer from "./OrderCustomer";
import OrderAffiliate from "./OrderAffiliate";
import OrderDetailItem from "./OrderDetailItem";
import OrderStatus from "./OrderStatus";
import PaymentMethod from "./PaymentMethod";
import OrderInvoiceSummary from "./OrderInvoiceSummary";
import ResellerSummary from "./ResellerSummary";

interface OrderDetails {
  id: number;
  isActive: boolean;
  dueDate: Date | null;
  user: OrderUser;
  customer: OrderCustomer;
  affiliate: OrderAffiliate | null;
  reseller: ResellerSummary | null;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  couponCode: string | undefined;
  totalPrice: number;
  hasGst: boolean;
  reference: string | null;
  invoiceId: string | null;
  createdDateTime: Date;
  items: OrderDetailItem[];
  invoices: OrderInvoiceSummary[];
}

export default OrderDetails;