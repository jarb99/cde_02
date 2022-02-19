import CountrySummary from "./CountrySummary";
import ResellerSummary from "./ResellerSummary";

interface OrderCustomer {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: CountrySummary;
  taxNumber: string;
  isReseller: boolean;
  reseller: ResellerSummary | null;
}

export default OrderCustomer;