import ItemType from "./ItemType";
import SubscriptionKey from "./SubscriptionKey"
import ProductSummary from "./ProductSummary";
import LicenseType from "./LicenseType";
import ExpirationType from "./ExpirationType";
import SubscriptionPool from "./SubscriptionPool";

interface OrderDetailItem {
  id?: number;
  isActive: boolean;
  type: ItemType;
  renewedSubscriptionKey?: SubscriptionKey;
  product: ProductSummary;
  licenseType: LicenseType;
  subscriptionPool?: SubscriptionPool;
  expirationType?: ExpirationType;
  alignToDate?: Date;
  alignToSubscriptionKey?: SubscriptionKey;
  alignToOrderItemId?: number;
  alignToLineCorrelationId?: number;
  expiryDate?: Date;
  applyProRataCalculation?: boolean;
  quantity: number;
  renewalUnitPrice?: number;
  pricingBandId?: number;
  pricingBandUnitPrice?: number;
  unitPrice: number;
  total: number;
  unitRrp?: number;
  totalRrp?: number;
  dateCreated: Date;
}

export default OrderDetailItem;