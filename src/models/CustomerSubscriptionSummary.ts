import SubscriptionPool from "./SubscriptionPool";
import ProductSummary from "./ProductSummary";
import LicenseType from "./LicenseType";
import SubscriptionKey from "./SubscriptionKey";

interface CustomerSubscriptionSummary {
  pool: SubscriptionPool;
  product: ProductSummary;
  licenseType: LicenseType;
  quantity: number;
  expiryDate: Date | null;
}

function getCustomerSubscriptionKey(subscription: CustomerSubscriptionSummary, customerId: number): SubscriptionKey {
  return {
    customerId:  customerId,
    poolId:      subscription.pool?.id ?? null,
    productId:   subscription.product.id,
    licenseType: subscription.licenseType,
    expiryDate:  subscription.expiryDate,
  };
}

export { getCustomerSubscriptionKey };
export default CustomerSubscriptionSummary;