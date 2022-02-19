import * as yup from 'yup';
import ItemType from "../../models/ItemType";
import LicenseType from "../../models/LicenseType";
import SubscriptionPool from "../../models/SubscriptionPool";
import ExpirationType from "../../models/ExpirationType";
import CustomerSubscriptionSummary from "../../models/CustomerSubscriptionSummary";


const requiredMessage = "Required";
const zeroOrMoreMessage = "Must be zero or more";
const oneOrMoreMessage = "Must be one or more";
const notMoreThanMessage = "Cannot exceed ${max}"; // eslint-disable-line no-template-curly-in-string


const orderItemSchema = yup.object({
  itemType: yup
    .mixed<ItemType>()
    .required(requiredMessage),
  productId: yup
    .number()
    .when("itemType", 
      (itemType: ItemType, schema: any) => 
        itemType === ItemType.New 
          ? schema.required(requiredMessage) 
          : schema.nullable()),
  licenseType: yup
    .mixed<LicenseType>()
    .when("itemType",
      (itemType: ItemType, schema: any) => 
        itemType === ItemType.New 
          ? schema.required(requiredMessage) 
          : schema.nullable()),
  subscriptionPool: yup
    .object()
    .nullable()
    .when(["itemType", "$subscriptionPools"],
      (itemType: ItemType, subscriptionPools: SubscriptionPool[], schema: any) =>
        itemType === ItemType.New && subscriptionPools?.length > 0
          ? schema.required(requiredMessage)
          : schema),
  expirationType: yup
    .mixed<ExpirationType>()
    .required(requiredMessage),
  alignToDate: yup
    .date()
    .nullable()
    .when("expirationType",
      (expirationType: ExpirationType, schema: any) =>
        expirationType === ExpirationType.AlignToDate
          ? schema.required(requiredMessage)
          : schema),
  alignToSubscriptionKey: yup
    .object()
    .nullable()
    .when("expirationType",
    (expirationType: ExpirationType, schema: any) =>
      expirationType === ExpirationType.AlignToSubscription
        ? schema.required(requiredMessage)
        : schema),
  alignToLine: yup
    .object()
    .nullable()
    .when("expirationType",
    (expirationType: ExpirationType, schema: any) =>
      expirationType === ExpirationType.AlignToItem
        ? schema.required(requiredMessage)
        : schema),
  applyProRataCalculation: yup
    .boolean()
    .nullable(),
  expiryDate: yup
    .date()
    .nullable(),
  pricingBandId: yup
    .number()
    .nullable()
    .when("itemType",
    (itemType: ItemType, schema: any) =>
      itemType === ItemType.New
        ? schema.required(requiredMessage)
        : schema),
  executionDate: yup
    .date()
    .nullable()
    .when("expirationType",
      (expirationType: ExpirationType, schema: any) =>
        (expirationType !== ExpirationType.Default && expirationType !== ExpirationType.TwoYears)
          ? schema.required(requiredMessage)
          : schema),
  quantity: yup
    .number()
    .nullable()
    .positive(oneOrMoreMessage)
    .required(requiredMessage)
    .when(["itemType", "$renewedSubscription"],
      (itemType: ItemType, renewedSubscription: CustomerSubscriptionSummary | null, schema: any) =>
        itemType === ItemType.Renewal && renewedSubscription != null
          ? schema.max(renewedSubscription.quantity, notMoreThanMessage)
          : schema
      ),
  unitPrice: yup
    .number()
    .nullable()
    .min(0, zeroOrMoreMessage)
    .required(requiredMessage),
  totalPrice: yup
    .number()
    .nullable()
    .min(0, zeroOrMoreMessage)
    .required(requiredMessage),
  subscriptionKey: yup
    .object()
    .nullable()
    .when("itemType",
      (itemType: ItemType, schema: any) =>
      itemType === ItemType.Renewal
        ? schema.required(requiredMessage)
        : schema)
});

export default orderItemSchema;