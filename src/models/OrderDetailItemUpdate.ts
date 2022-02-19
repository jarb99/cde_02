import ItemType from "./ItemType";
import LicenseType from "./LicenseType";
import Correlatable from "./Correlatable";
import ChangeTracking from "./ChangeTracking";
import SubscriptionKey from "./SubscriptionKey";
import ExpirationType from "./ExpirationType";

interface OrderDetailItemUpdate extends Correlatable, ChangeTracking {
  id?: number;
  isActive: boolean;
  type: ItemType;
  renewedSubscriptionKey?: SubscriptionKey | null;
  productId: number;
  licenseType: LicenseType;
  subscriptionPoolId?: number;
  expirationType?: ExpirationType | null;
  alignToDate?: Date | null;
  alignToSubscriptionKey?: SubscriptionKey | null;
  alignToLineCorrelationId?: number | null;
  expiryDate?: Date | null;
  quantity: number;
  renewalUnitPrice?: number;
  pricingBandId?: number;
  pricingBandUnitPrice?: number | null;
  unitPrice: number;
  unitRrp?: number | null;
}

export default OrderDetailItemUpdate;