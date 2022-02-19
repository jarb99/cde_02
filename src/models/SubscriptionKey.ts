import LicenseType from "../models/LicenseType";

interface SubscriptionKey {
  customerId: number;
  poolId: number | null;
  productId: number;
  licenseType: LicenseType;
  expiryDate: Date | null;
}

function equalsSubscriptionKey(key1: SubscriptionKey, key2: SubscriptionKey): boolean {
  if (!Boolean(key1) && !Boolean(key2)) {
    return true;
  }
  return Boolean(key1) && Boolean(key2) &&
    key1.customerId            === key2.customerId  &&
    key1.poolId                === key2.poolId      &&
    key1.productId             === key2.productId   &&
    key1.licenseType           === key2.licenseType &&
    key1.expiryDate?.getTime() === key2.expiryDate?.getTime();
}

function stringifySubscriptionKey(key: SubscriptionKey): string {
  return JSON.stringify(key);
}

function parseSubscriptionKey(json: string): SubscriptionKey {
  return JSON.parse(json, (k, v) => k === "expiryDate" ? new Date(Date.parse(v)) : v);
}

export { equalsSubscriptionKey, stringifySubscriptionKey, parseSubscriptionKey };
export default SubscriptionKey;