import ExpirationType from "../../models/ExpirationType";
import SubscriptionKey, { equalsSubscriptionKey } from "../../models/SubscriptionKey";
import ItemType from "../../models/ItemType";
import LicenseType from "../../models/LicenseType";
import moment, { Moment } from "moment";
import { formatNumber } from "../../formatters/NumberFormatters";
import SubscriptionPool from "../../models/SubscriptionPool";
import { OrderItemEditValues } from "./OrderItemEdit";
import OrderDetailItem from "../../models/OrderDetailItem";
import Correlatable from "../../models/Correlatable";

interface ValidationError {
  errorMessage: string;
  type: any;
}

interface State {
  data: {
    itemType: ItemType;
    productId: number | null;
    licenseType: LicenseType;
    subscriptionPool: SubscriptionPool | null;
    renewalUnitPrice: number | null;
    expirationType: ExpirationType | null;
    alignToDate: Date | null;
    alignToSubscriptionKey: SubscriptionKey | null;
    alignToLine: OrderDetailItem & Correlatable | null;
    pricingBandId: number | null;
    pricingBandUnitPrice: number | null;
    expiryDate: Date | null;
    applyProRataCalculation: boolean | null;
    executionDate: Date | null;
    quantity: number | null;
    calculatedUnitPrice: number | null;
    unitPrice: number | null;
    totalPrice: number | null;
    
    subscriptionKey: SubscriptionKey | null;
  },
  validationErrors: {
    [key: string]: ValidationError
  },
  visibility: {
    showProductSelection: boolean;
    showLicenseTypeSelection: boolean;
    showPoolSelection: boolean;
    showExpirationSelection: boolean;
    showAlignToDateSelection: boolean;
    showAlignToSubscriptionSelection: boolean;
    showAlignToLineSelection: boolean;
    showPricingBandSelection: boolean;
    showPricingDetailsInput: boolean;
    showApplyProRataCalculationSelection: boolean;
    showExecutionDateSelection: boolean;
    
    showSubscriptionSelection: boolean;
  },
  configuration: {
    defaultExecutionDate: Date | null;
  },
  context: {
    orderItems: (OrderDetailItem & Correlatable)[];
    correlationId: number | null;
  }
}

// Action Types
enum ActionType {
  Reset = "RESET",
  
  ItemTypeChanged = "ITEM_TYPE_CHANGED",
  ProductChanged = "PRODUCT_CHANGED",
  LicenseTypeChanged = "LICENSE_TYPE_CHANGED",
  SubscriptionPoolChanged = "SUBSCRIPTION_POOL_CHANGED",
  ExpirationChanged = "EXPIRATION_CHANGED",
  AlignToDateChanged = "ALIGN_TO_DATE_CHANGED",
  AlignToSubscriptionChanged = "ALIGN_TO_SUBSCRIPTION_CHANGED",
  AlignToLineChanged = "ALIGN_TO_LINE_CHANGED",
  PricingBandChanged = "PRICING_BAND_CHANGED",
  ApplyProRataCalculationInitialized = "APPLY_PRO_RATA_CALCULATION_INITIALIZED",
  ApplyProRataCalculationChanged = "APPLY_PRO_RATA_CALCULATION_CHANGED",
  ExecutionDateChanged = "EXECUTION_DATE_CHANGED",
  QuantityChanged = "QUANTITY_CHANGED",
  CalculatedUnitPriceInitialized = "CALCULATED_UNIT_PRICE_INITIALIZED",
  UnitPriceChanged = "UNIT_PRICE_CHANGED",
  TotalPriceChanged = "TOTAL_PRICE_CHANGED",
  ExpiryDateChanged = "EXPIRY_DATE_CHANGED",

  SubscriptionChanged = "SUBSCRIPTION_CHANGED",
  
  Validating = "VALIDATING",
  Validated = "VALIDATED"
}

type Action =
  { type: ActionType.Reset, payload: OrderItemEditValues | null } |
  { type: ActionType.ItemTypeChanged, payload: ItemType } |
  { type: ActionType.ProductChanged, payload: { id: number | null, renewalUnitPrice: number | null } } |
  { type: ActionType.LicenseTypeChanged, payload: LicenseType } |
  { type: ActionType.ExpirationChanged, payload: ExpirationType } |
  { 
    type:
      ActionType.AlignToDateChanged | 
      ActionType.ExecutionDateChanged |
      ActionType.ExpiryDateChanged, 
    payload: Date | null 
  } |
  { type: ActionType.AlignToSubscriptionChanged, payload: SubscriptionKey | null } |
  { type: ActionType.AlignToLineChanged, payload: OrderDetailItem & Correlatable | null } |
  { type: ActionType.PricingBandChanged, payload: { id: number | null, unitPrice: number | null } } |
  { 
    type: 
      ActionType.ApplyProRataCalculationInitialized |
      ActionType.ApplyProRataCalculationChanged, 
    payload: boolean | null 
  } |
  {
    type: ActionType.SubscriptionChanged, 
    payload: {
      subscriptionKey: SubscriptionKey | null,
      renewalUnitPrice: number | null,
      subscriptionQuantity?: number | null,
      subscriptionPool?: SubscriptionPool | null
    }
  } |
  { type: ActionType.SubscriptionPoolChanged, payload: SubscriptionPool | null } |
  { type: ActionType.Validating } |
  { type: ActionType.Validated, payload?: { [key: string]: ValidationError } } |
  {
    type:
      ActionType.QuantityChanged |
      ActionType.CalculatedUnitPriceInitialized |
      ActionType.UnitPriceChanged |
      ActionType.TotalPriceChanged,
    payload: number | null
  }; 

// Initial State
const getInitialState = (defaultExecutionDate: Date | null, initialValues?: OrderItemEditValues, orderItems?: (OrderDetailItem & Correlatable)[], correlationId?: number | null): State => {
  let state: State = {
    data: {
      itemType: ItemType.New,
      productId: null,
      renewalUnitPrice: null,
      licenseType: LicenseType.Standalone,
      subscriptionPool: null,
      expirationType: ExpirationType.Default,
      alignToDate: null,
      alignToSubscriptionKey: null,
      alignToLine: null,
      pricingBandId: null,
      pricingBandUnitPrice: null,
      expiryDate: null,
      applyProRataCalculation: null,
      executionDate: null,
      quantity: null,
      calculatedUnitPrice: null,
      unitPrice: null,
      totalPrice: null,

      subscriptionKey: null
    },
    validationErrors: {},
    visibility: {
      showProductSelection: true,
      showLicenseTypeSelection: false,
      showPoolSelection: false,
      showExpirationSelection: false,
      showAlignToDateSelection: false,
      showAlignToSubscriptionSelection: false,
      showAlignToLineSelection: false,
      showPricingBandSelection: false,
      showPricingDetailsInput: false,
      showApplyProRataCalculationSelection: false,
      showExecutionDateSelection: false,

      showSubscriptionSelection: false
    },
    configuration: {
      defaultExecutionDate: defaultExecutionDate
    },
    context: {
      orderItems: orderItems ?? [],
      correlationId: correlationId ?? null
    }
  };
  
  if (!initialValues) {
    return state;
  }

  state = reducer(state, {type: ActionType.ItemTypeChanged, payload: initialValues.itemType});

  switch (initialValues.itemType) {
    case ItemType.New: {
      state = reducer(state, {type: ActionType.ProductChanged, payload: {id: initialValues.product.id, renewalUnitPrice: initialValues.renewalUnitPrice}});
      state = reducer(state, {type: ActionType.LicenseTypeChanged, payload: initialValues.licenseType});
      state = reducer(state, {type: ActionType.SubscriptionPoolChanged, payload: initialValues.subscriptionPool});
      break;
    }
      
    case ItemType.Renewal:
      state = reducer(state, {type: ActionType.SubscriptionChanged, payload: {subscriptionKey: initialValues.renewedSubscriptionKey, renewalUnitPrice: initialValues.renewalUnitPrice, subscriptionQuantity: initialValues.quantity, subscriptionPool: initialValues.subscriptionPool}});
      break;
  }

  state = reducer(state, {type: ActionType.ExpirationChanged, payload: initialValues.expirationType});

  switch (initialValues.expirationType) {
    case ExpirationType.Default:
      break;
    
    case ExpirationType.AlignToSubscription:
      state = reducer(state, {type: ActionType.AlignToSubscriptionChanged, payload: initialValues.alignToSubscriptionKey});
      break;

    case ExpirationType.AlignToItem:
      state = reducer(state, {type: ActionType.AlignToLineChanged, payload: initialValues.alignToLine});
      break;
      
    case ExpirationType.AlignToDate:
      state = reducer(state, {type: ActionType.AlignToDateChanged, payload: initialValues.alignToDate});
      break;

    case ExpirationType.TwoYears:
      break;
  }

  switch (initialValues.itemType) {
    case ItemType.New: 
      state = reducer(state, {type: ActionType.PricingBandChanged, payload: {id: initialValues.pricingBandId, unitPrice: initialValues.pricingBandUnitPrice}});
      state = reducer(state, {type: ActionType.ExecutionDateChanged, payload: state.configuration.defaultExecutionDate});
      break;
    
    case ItemType.Renewal:
      state = reducer(state, {type: ActionType.ExecutionDateChanged, payload: initialValues.renewedSubscriptionKey?.expiryDate ?? null});
      break;
  }
  
  state = reducer(state, {type: ActionType.QuantityChanged, payload: initialValues.quantity});
  
  if (initialValues.unitPrice !== 0 && state.data.unitPrice !== initialValues.unitPrice) {
    const calculatedUnitPrice = state.data.unitPrice;
    state = reducer(state, {type: ActionType.UnitPriceChanged, payload: initialValues.unitPrice});

    if (initialValues.applyProRataCalculation) {
      state = reducer(state, {type: ActionType.CalculatedUnitPriceInitialized, payload: calculatedUnitPrice});
    }
  }

  // TODO: consider adding an initialising flag to the state so the reducers are aware we are in the initialisation 
  //  phase, which would mean we would handle the following here but rather in the reducers. 

  // the reducer for ActionType.UnitPriceChanged will set applyProRataCalculation to false, so we need to 
  // set it back to true if that's what it was. 
  // NB: we don't set it to false because that then defaults the unit price to the pricing band unit price. 
  if (initialValues.applyProRataCalculation) {
    state = reducer(state, {type: ActionType.ApplyProRataCalculationInitialized, payload: initialValues.applyProRataCalculation});
  }

  return state;
};

// Reducer
const reducer = (state: State, action: Action): State => {
  let intermediateState: State;
  
  switch (action.type) {
    case ActionType.Reset:
      return getInitialState(state.configuration.defaultExecutionDate, action.payload ?? undefined, state.context.orderItems, state.context.correlationId);
    
    case ActionType.ItemTypeChanged:
      intermediateState = withDataChange(
        state.data.itemType !== action.payload
          ? getInitialState(state.configuration.defaultExecutionDate, undefined, state.context.orderItems, state.context.correlationId)
          : state, {itemType: action.payload});
      
      return withVisibilityChange(intermediateState, {
        showProductSelection: action.payload === ItemType.New,
        showSubscriptionSelection: action.payload === ItemType.Renewal
      });

    case ActionType.ProductChanged:
      intermediateState = withRecalculation(state, {
        productId: action.payload.id,
        renewalUnitPrice: action.payload.renewalUnitPrice,
        pricingBandId: null,
        pricingBandUnitPrice: null,
        quantity: null,
        unitPrice: null,
        totalPrice: null
      });
      
      return withVisibilityChange(intermediateState, {
        showLicenseTypeSelection: action.payload != null,
        showPoolSelection: action.payload != null,
        showApplyProRataCalculationSelection: action.payload != null,
        showExpirationSelection: action.payload != null,
        showAlignToLineSelection: action.payload != null && state.visibility.showAlignToLineSelection,
        showAlignToSubscriptionSelection: action.payload != null && state.visibility.showAlignToSubscriptionSelection,
        showAlignToDateSelection: action.payload != null && state.visibility.showAlignToDateSelection
      });

    case ActionType.LicenseTypeChanged:
      intermediateState = withDataChange(state, {
        licenseType: action.payload,
        subscriptionPool: action.payload !== LicenseType.Standalone ? null : state.data.subscriptionPool 
      });
      
      return withVisibilityChange(intermediateState, {
        showPoolSelection: action.payload === LicenseType.Standalone,
        showExpirationSelection: action.payload != null,
        showAlignToDateSelection: action.payload != null && state.visibility.showAlignToDateSelection,
        showAlignToSubscriptionSelection: action.payload != null && state.visibility.showAlignToSubscriptionSelection,
        showAlignToLineSelection: action.payload != null && state.visibility.showAlignToLineSelection,
        showPricingBandSelection: action.payload != null && state.visibility.showPricingBandSelection,
        showPricingDetailsInput: action.payload != null && state.visibility.showPricingDetailsInput,
        showApplyProRataCalculationSelection: action.payload != null && state.visibility.showApplyProRataCalculationSelection,
        showExecutionDateSelection: action.payload != null && state.visibility.showExecutionDateSelection
      });

    case ActionType.SubscriptionPoolChanged:
      return withDataChange(state, {subscriptionPool: action.payload});

    case ActionType.ExpirationChanged:
      const expiryDate = getDefaultExpiryDate(state.data.itemType, action.payload, state.data.subscriptionKey?.expiryDate);
            
      intermediateState = withRecalculation(state, {
        expirationType: action.payload,
        alignToDate: action.payload === ExpirationType.AlignToDate ? expiryDate : null,
        alignToSubscriptionKey: null,
        alignToLine: null,
        expiryDate: expiryDate,
        applyProRataCalculation: action.payload !== ExpirationType.Default && action.payload !== ExpirationType.TwoYears,
        executionDate: getDefaultExecutionDate(state.data.itemType, action.payload, state.data.subscriptionKey?.expiryDate, state.configuration.defaultExecutionDate)
      });
      
      return withVisibilityChange(intermediateState, {
        showAlignToDateSelection: action.payload === ExpirationType.AlignToDate,
        showAlignToSubscriptionSelection: action.payload === ExpirationType.AlignToSubscription,
        showAlignToLineSelection: action.payload === ExpirationType.AlignToItem,
        showPricingBandSelection: action.payload != null && state.data.itemType === ItemType.New,
        showPricingDetailsInput: action.payload != null,
        showApplyProRataCalculationSelection: state.data.itemType === ItemType.New && action.payload !== ExpirationType.Default && action.payload !== ExpirationType.TwoYears,
        showExecutionDateSelection: state.data.itemType === ItemType.New && action.payload !== ExpirationType.Default && action.payload !== ExpirationType.TwoYears
      });

    case ActionType.AlignToSubscriptionChanged:
      return withRecalculation(state, {alignToSubscriptionKey: action.payload, expiryDate: action.payload?.expiryDate});

    case ActionType.AlignToDateChanged:
      return withRecalculation(state, {alignToDate: action.payload, expiryDate: action.payload});
      
    case ActionType.AlignToLineChanged:
      return withRecalculation(state, {
        alignToLine: action.payload, 
        expiryDate: getExpiryDate(action.payload, state.context.orderItems, state.context.correlationId ? [state.context.correlationId] : []),
        subscriptionPool: state.visibility.showPoolSelection && state.data.subscriptionPool == null ? action.payload?.subscriptionPool : state.data.subscriptionPool
      });
      
    case ActionType.PricingBandChanged: 
      return withRecalculation(state, {pricingBandId: action.payload.id, pricingBandUnitPrice: action.payload.unitPrice});

    case ActionType.ApplyProRataCalculationInitialized:
      return withDataChange(state, {applyProRataCalculation: action.payload});
    
    case ActionType.ApplyProRataCalculationChanged:
      intermediateState = withExpiryDateReset(state);
      return withRecalculation(intermediateState, {applyProRataCalculation: action.payload});
      
    case ActionType.ExecutionDateChanged:
      return withRecalculation(state, {executionDate: action.payload});
      
    case ActionType.QuantityChanged:
      return withRecalculation(state, {quantity: formatNumber(action.payload, 0)});

    case ActionType.CalculatedUnitPriceInitialized:
      return withDataChange(state, {calculatedUnitPrice: action.payload});

    case ActionType.UnitPriceChanged:
      intermediateState = withApplyProRataCalculationChange(state, false);
      const nextUnitPrice = formatNumber(action.payload, 2);
      return withRecalculation(intermediateState, {unitPrice: nextUnitPrice, calculatedUnitPrice: nextUnitPrice});
      
    case ActionType.TotalPriceChanged:
      intermediateState = withApplyProRataCalculationChange(state, false);
      return withRecalculation(intermediateState, {totalPrice: formatNumber(action.payload, 2)});
      
    case ActionType.ExpiryDateChanged:
      return withRecalculation(state, {expiryDate: action.payload});
      
    case ActionType.SubscriptionChanged:
      intermediateState = withRecalculation(state, {
        subscriptionKey: action.payload.subscriptionKey, 
        renewalUnitPrice: action.payload.renewalUnitPrice,
        productId: action.payload.subscriptionKey?.productId,
        subscriptionPool: action.payload.subscriptionPool,
        licenseType: action.payload.subscriptionKey?.licenseType,
        applyProRataCalculation: state.data.expirationType != null && state.data.expirationType !== ExpirationType.Default && state.data.expirationType !== ExpirationType.TwoYears,
        executionDate: getDefaultExecutionDate(state.data.itemType, state.data.expirationType ?? ExpirationType.Default, action.payload.subscriptionKey?.expiryDate, state.configuration.defaultExecutionDate),
        expiryDate: getDefaultExpiryDate(state.data.itemType, state.data.expirationType ?? ExpirationType.Default, action.payload.subscriptionKey?.expiryDate) ?? state.data.expiryDate,
        quantity: action.payload.subscriptionQuantity ?? state.data.quantity,
        alignToSubscriptionKey: 
          action.payload.subscriptionKey != null && 
          state.data.alignToSubscriptionKey != null && 
          equalsSubscriptionKey(action.payload.subscriptionKey, state.data.alignToSubscriptionKey) 
            ? null 
            : state.data.alignToSubscriptionKey
      });
      
      return withVisibilityChange(intermediateState, {
        showExpirationSelection: action.payload.subscriptionKey != null,
        showAlignToDateSelection: action.payload.subscriptionKey != null && state.visibility.showAlignToDateSelection,
        showAlignToSubscriptionSelection: action.payload.subscriptionKey != null && state.visibility.showAlignToSubscriptionSelection,
        showAlignToLineSelection: action.payload.subscriptionKey != null && state.visibility.showAlignToLineSelection,
        showPricingDetailsInput: action.payload.subscriptionKey != null,
        showApplyProRataCalculationSelection: action.payload.subscriptionKey != null && state.visibility.showApplyProRataCalculationSelection,
        showExecutionDateSelection: action.payload.subscriptionKey != null && state.visibility.showExecutionDateSelection
      });

    case ActionType.Validating:
      return {
        ...state,
        validationErrors: {}
      };

    case ActionType.Validated:
      return {
        ...state,
        validationErrors: action.payload || {}
      };
  }
};

const withVisibilityChange = (state: State, change: Partial<State["visibility"]>) => ({
  ...state,
  visibility: {
    ...state.visibility,
    ...change
  }
});

type DataFields = State["data"];

const withDataChange = (state: State, change: Partial<DataFields>) => ({
  ...state,
  data: {
    ...state.data,
    ...change
  }
});

const withRecalculation = (state: State, change: Partial<DataFields>) => {
  let nextState = withDataChange(state, change);   
  const changedFields = Object.keys(change) as (keyof DataFields)[];
  
  const unitPriceRecalculationTriggerFields: (keyof DataFields)[] = [
    "pricingBandUnitPrice",
    "renewalUnitPrice",
    "applyProRataCalculation",
    "executionDate",
    "expiryDate"];
  
  if (changedFields.some(field => unitPriceRecalculationTriggerFields.includes(field))) {
    const {pricingBandUnitPrice, renewalUnitPrice, applyProRataCalculation, executionDate, expiryDate} = nextState.data;
    
    if ((pricingBandUnitPrice != null || nextState.data.itemType === ItemType.Renewal) && renewalUnitPrice != null) {
      const proRataRate = (applyProRataCalculation && executionDate != null && expiryDate != null && expiryDate > executionDate)
        ? moment.duration(getDateOnly(expiryDate).diff(getDateOnly(executionDate))).asDays() / 365 //TODO: check if this spans a 29 Feb
        : 1;

      const unitPrice = renewalUnitPrice * proRataRate + (
        nextState.data.itemType === ItemType.Renewal
            ? 0
            : (pricingBandUnitPrice ?? 0) - renewalUnitPrice);
      
      const nextUnitPrice = formatNumber(unitPrice, 2);
      
      nextState = withDataChange(nextState, {
        unitPrice: nextUnitPrice,  
        calculatedUnitPrice: nextUnitPrice
      });
    } else if (pricingBandUnitPrice != null) {
      const nextUnitPrice = formatNumber(pricingBandUnitPrice, 2);
      
      nextState = withDataChange(nextState, {
        unitPrice: nextUnitPrice, 
        calculatedUnitPrice: nextUnitPrice
      });
    }
  }
  
  const totalPriceRecalculationTriggerFields: (keyof DataFields)[] = [
    ...unitPriceRecalculationTriggerFields,
    "quantity",
    "unitPrice"];
  
  if (changedFields.some(field => totalPriceRecalculationTriggerFields.includes(field))) {
    const {quantity, unitPrice} = nextState.data;
        
    if (quantity == null || unitPrice == null) {
      return nextState;
    }
    
    const total = quantity * unitPrice; 
    
    return withDataChange(nextState, {totalPrice: Math.round(total * 100)/100})
  }
  
  if (changedFields.every(field => field === "totalPrice")) {
    if (nextState.data.quantity == null || nextState.data.totalPrice == null) {
      return nextState;
    }
    
    const nextUnitPrice = formatNumber(nextState.data.totalPrice / nextState.data.quantity, 2);

    return withDataChange(nextState, {unitPrice: nextUnitPrice, calculatedUnitPrice: nextUnitPrice});
  }
  
  return nextState;
};

const withApplyProRataCalculationChange = (state: State, change: boolean | null): State => {
  let intermediateState = withExpiryDateReset(state);

  if (state.data.applyProRataCalculation == null) {
    return intermediateState;
  }

  return withDataChange(intermediateState, {applyProRataCalculation: change});
};

const withExpiryDateReset = (state: State): State => {
  switch (state.data.expirationType) {
    case ExpirationType.AlignToSubscription:
      return withDataChange(state, {expiryDate: state.data.alignToSubscriptionKey?.expiryDate});
    case ExpirationType.AlignToItem:
      return withDataChange(state, {expiryDate: state.data.alignToLine?.expiryDate});
    default:
      return state;
  }
}

const getDefaultExecutionDate = (
  itemType: ItemType,
  expirationType: ExpirationType,
  subscriptionExpiryDate: Date | null | undefined,
  defaultExecutionDate: Date | null
): Date | null => {

  if (expirationType !== ExpirationType.Default && expirationType !== ExpirationType.TwoYears) {
    if (itemType === ItemType.Renewal && subscriptionExpiryDate != null) {
      return subscriptionExpiryDate;
    } else if (defaultExecutionDate != null) {
      return defaultExecutionDate;
    } else {
      return getDateOnly().add(14, "day").toDate();
    }
  }
  
  return null;
};

const getDefaultExpiryDate = (
  itemType: ItemType,
  expirationType: ExpirationType,
  subscriptionExpiryDate: Date | null | undefined
): Date | null => {

  if (itemType === ItemType.Renewal && expirationType === ExpirationType.Default && subscriptionExpiryDate != null) {
    return moment(subscriptionExpiryDate).add(1, "year").toDate();
  }
  
  if (itemType === ItemType.Renewal && expirationType === ExpirationType.TwoYears && subscriptionExpiryDate != null) {
    return moment(subscriptionExpiryDate).add(2, "year").toDate();
  }
  
  if (expirationType === ExpirationType.AlignToDate) {
    return getDateOnly().add(1, "year").toDate();
  }

  return null;
}

const getExpiryDate = (
  item: (OrderDetailItem & Correlatable) | null,
  items: (OrderDetailItem & Correlatable)[],
  visited: number[] = []
): Date | null => {

  if (visited.find(x => x === item?.correlationId)) {
    return null;
  }

  // if (item?.expiryDate) {
  //   return item.expiryDate;
  // }

  if (item?.expirationType === ExpirationType.Default) {
    if (item.type === ItemType.New) {
      return null;
    }
    if (item.type === ItemType.Renewal && item.renewedSubscriptionKey) {
      return moment(item.renewedSubscriptionKey.expiryDate).add(1, "year").toDate();
    }
  } else if (item?.expirationType === ExpirationType.TwoYears) {
    if (item.type === ItemType.New) {
      return null;
    }
    if (item.type === ItemType.Renewal && item.renewedSubscriptionKey) {
      return moment(item.renewedSubscriptionKey.expiryDate).add(2, "year").toDate();
    }
  } else if (item?.expirationType === ExpirationType.AlignToDate) {
    return item.alignToDate ?? null;
  } else if (item?.expirationType === ExpirationType.AlignToSubscription) {
    return item.alignToSubscriptionKey?.expiryDate ?? null;
  } else if (item?.expirationType === ExpirationType.AlignToItem) {
    if (item.alignToLineCorrelationId) {
      const alignToItem = items.find(x => x.correlationId === item.alignToLineCorrelationId);
      if (alignToItem) {
        visited.push(item.correlationId);
        return getExpiryDate(alignToItem, items, visited);
      }
    }
  }

  return null;
}

const getDateOnly = (date?: Date): Moment => 
  moment(date).startOf("day");


export { reducer, getInitialState, ActionType, getExpiryDate };