import SubscriptionPool from "./SubscriptionPool";
import ProductSummary from "./ProductSummary";
import LicenseType from "./LicenseType";
import SubscriptionKey from "./SubscriptionKey";
import CustomerSummary from "./CustomerSummary";

interface SubscriptionSummary {
  customer: CustomerSummary;
  pool: SubscriptionPool;
  product: ProductSummary;
  licenseType: LicenseType;
  quantity: number;
  expiryDate: Date | null;
}

function getSubscriptionKey(subscription: SubscriptionSummary): SubscriptionKey {
  return {
    customerId:  subscription.customer.id,
    poolId:      subscription.pool?.id ?? null,
    productId:   subscription.product.id,
    licenseType: subscription.licenseType,
    expiryDate:  subscription.expiryDate,
  };
}

export { getSubscriptionKey };
export default SubscriptionSummary;