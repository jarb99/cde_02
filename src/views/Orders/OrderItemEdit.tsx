import * as React from "react";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  Button,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Switch,
  TextField,
  Theme,
  Toolbar,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import SubscriptionSelect from "../Subscriptions/SubscriptionSelect";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import { ActionType, getInitialState, reducer, getExpiryDate } from "./OrderItemEditReducer";
import FormActions from "../../components/FormActions";
import useApiFetch from "../../api/ApiFetch";
import {
  getProducts,
  getCustomerSubscriptionPools,
  getCustomerSubscriptionsCurrent,
  getCustomerSubscriptionsRenewable
} from "../../api/API";
import ProductDetails from "../../models/ProductDetails";
import { AxiosError, CancelToken } from "axios";
import useApiPagedFetch from "../../api/ApiPagedFetch";
import SubscriptionKey, { equalsSubscriptionKey } from "../../models/SubscriptionKey";
import ItemType from "../../models/ItemType";
import LicenseType from "../../models/LicenseType";
import ExpirationType from "../../models/ExpirationType";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import ProductSummary from "../../models/ProductSummary";
import SubscriptionPool from "../../models/SubscriptionPool";
import FadeTransition from "../../components/FadeTransition";
import CustomerSubscriptionSummary, { getCustomerSubscriptionKey } from "../../models/CustomerSubscriptionSummary";
import PricingBand from "../../models/PricingBand";
import NumberInput from "../../components/NumberInput";
import { tryParseFloat } from "../../utils/ParsingUtils";
import { createRequestErrorMessage, ErrorMessageSize } from "../../components/RequestErrorMessage";
import orderItemSchema from "./OrderItemEditValidator";
import { ValidationError } from "yup";
import OrderItemSelect from "./OrderItemSelect";
import OrderDetailItem from "../../models/OrderDetailItem";
import Correlatable from "../../models/Correlatable";


export interface OrderItemEditValues {
  itemType: ItemType;
  renewedSubscriptionKey: SubscriptionKey | null;
  product: ProductSummary;
  licenseType: LicenseType;
  subscriptionPool: SubscriptionPool | null;
  expirationType: ExpirationType;
  alignToDate: Date | null;
  alignToSubscriptionKey: SubscriptionKey | null;
  alignToLine: OrderDetailItem & Correlatable | null;
  expiryDate: Date | null;
  applyProRataCalculation: boolean | null;
  quantity: number;
  renewalUnitPrice: number | null;
  pricingBandId: number | null;
  pricingBandUnitPrice: number | null;
  unitPrice: number;
  totalPrice: number;
}

interface OrderItemEditProps {
  title: string;
  submitText: string;
  orderDueDate: Date | null;
  customerId: number;
  correlationId: number | null;
  initialValues: OrderItemEditValues | null;
  orderItems: (OrderDetailItem & Correlatable)[];
  readonly?: boolean;
  onSubmit: (values: OrderItemEditValues) => void;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1
  },
  form: {
    marginTop: theme.spacing(1)
  },
  progress: {
    height: 1,
    marginTop: -1
  },
  switchCell: {
    alignSelf: "center"
  },
  switchLabel: {
    marginLeft: theme.spacing(1.5)
  }
}));

const useToggleButtonStyles = makeStyles((theme: Theme) => ({
  label: {
    minWidth: theme.spacing(26)    
  }
}));

function onlyOrDefault<T>(data: T[] | null, defaultValue: T | null = null): T | null {
  return data && data.length === 1 
    ? data[0] 
    : defaultValue;
}

const CalculatedUnitPriceVarianceErrorMessage = "Calculated value differs";

const OrderItemEdit: React.FC<OrderItemEditProps> = (props) => {
  const classes = useStyles();
  const toggleButtonClasses = useToggleButtonStyles();
  
  const [initialized, setInitialized] = useState(props.initialValues != null);
  const [loading, setLoading] = useState(true); 
  const [loadingError, setLoadingError] = useState<AxiosError | null>(null);

  const initialState = useMemo(() =>
      getInitialState(props.orderDueDate, props.initialValues ?? undefined, props.orderItems, props.correlationId),
    [props.orderDueDate, props.initialValues, props.orderItems, props.correlationId]);
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const [productsState] = useApiFetch(getProducts);

  const [subscriptionPoolsState] = useApiFetch(useCallback((cancelToken?: CancelToken) =>
    getCustomerSubscriptionPools(props.customerId, cancelToken), [props.customerId]));
  
  const [currentSubscriptionsState] = useApiPagedFetch(
    useCallback((pageNo, pageSize, cancelToken?: CancelToken) => 
      getCustomerSubscriptionsCurrent(props.customerId, pageNo, pageSize, cancelToken), 
      [props.customerId]),
    1,
    50);
  
  const [renewableSubscriptionsState] = useApiPagedFetch(
    useCallback((pageNo, pageSize, cancelToken?: CancelToken) => 
      getCustomerSubscriptionsRenewable(props.customerId, pageNo, pageSize, cancelToken), 
      [props.customerId]),
    1,
    50);

  // handle loading state
  useEffect(() => {
      const requests = [productsState, subscriptionPoolsState, currentSubscriptionsState, renewableSubscriptionsState];

      setLoading(requests.some(request => request.isFetching || (!request.isComplete && !request.hasErrored)));
      setLoadingError(requests.find(request => request.hasErrored && !request.hasErroredWithNotFound)?.error ?? null);
    },
    [productsState, subscriptionPoolsState, currentSubscriptionsState, renewableSubscriptionsState]
  );

  const getProduct = useCallback((id: number | null): ProductDetails | undefined =>
    (productsState.data || []).find(product => product.id === id)
  , [productsState.data]);

  const getSubscriptionPool = useCallback((id: number | null): SubscriptionPool | undefined =>
    (subscriptionPoolsState.data || []).find(pool => pool.id === id)
  , [subscriptionPoolsState.data]);

  const getDefaultValues = useCallback((itemType: ItemType = ItemType.New): OrderItemEditValues | null => {
    switch (itemType) {
      case ItemType.New:
        const onlyProduct = onlyOrDefault(productsState.data);

        if (onlyProduct == null) {
          return null;
        }
        
        const defaultQuantity = 1;
        const pricingBand = getPricingBand(onlyProduct, defaultQuantity);
        
        return {
          itemType: ItemType.New,
          renewedSubscriptionKey: null,
          product: onlyProduct,
          licenseType: LicenseType.Standalone,
          subscriptionPool: onlyOrDefault(subscriptionPoolsState.data),
          expirationType: ExpirationType.Default,
          alignToDate: null,
          alignToSubscriptionKey: null,
          alignToLine: null,
          expiryDate: null,
          applyProRataCalculation: null,
          quantity: defaultQuantity,
          renewalUnitPrice: onlyProduct.renewalUnitPrice ?? null,
          pricingBandId: pricingBand?.id ?? null,
          pricingBandUnitPrice: pricingBand?.unitPrice ?? null,
          unitPrice: pricingBand?.unitPrice ?? 0,
          totalPrice: defaultQuantity * (pricingBand?.unitPrice ?? 0)
        };

      case ItemType.Renewal:
        const onlySubscription = onlyOrDefault(renewableSubscriptionsState.items);
        
        if (onlySubscription == null) {
          return null;
        }
        
        const onlySubscriptionKey = getCustomerSubscriptionKey(onlySubscription, props.customerId);
        const product = getProduct(onlySubscription.product.id);
        
        return {
          itemType: ItemType.Renewal,
          renewedSubscriptionKey: onlySubscriptionKey,
          product: onlySubscription.product,
          licenseType: onlySubscription.licenseType,
          subscriptionPool: getSubscriptionPool(onlySubscriptionKey.poolId) ?? null,
          expirationType: ExpirationType.Default,
          alignToDate: null,
          alignToSubscriptionKey: null,
          alignToLine: null,
          expiryDate: null,
          applyProRataCalculation: null,
          quantity: onlySubscription.quantity,
          renewalUnitPrice: product?.renewalUnitPrice ?? null,
          pricingBandId: null,
          pricingBandUnitPrice: null,
          unitPrice: product?.renewalUnitPrice ?? 0,
          totalPrice: onlySubscription.quantity * (product?.renewalUnitPrice ?? 0)
        };
    }
    
    return null;
  },
  [getProduct, getSubscriptionPool, productsState.data, props.customerId, renewableSubscriptionsState.items, subscriptionPoolsState.data]);

  useEffect(() => {
      if (!initialized && !loading) {
        dispatch({type: ActionType.Reset, payload: getDefaultValues()});
        setInitialized(true);
      }
    },
    [initialized, setInitialized, loading, getDefaultValues]
  );

  const currentProduct = getProduct(state.data.productId);
  
  const getPricingBand = (product: ProductDetails, quantity: number): PricingBand | undefined => 
    (product.pricingBands || []).find(band => (band.minQuantity ?? 0) <= quantity && quantity <= (band.maxQuantity ?? Number.MAX_VALUE));
  
  const equalsSubscription = (subscriptionKey: SubscriptionKey | null, subscription: CustomerSubscriptionSummary) =>
    subscriptionKey != null && equalsSubscriptionKey(getCustomerSubscriptionKey(subscription, props.customerId), subscriptionKey);
  
  const handleItemTypeChanged = (event: React.MouseEvent<HTMLElement>, value: ItemType) => {
    if (props.readonly) {
      return;
    }
    
    if (value != null && value !== state.data.itemType) {
      const defaultValues = getDefaultValues(value);     
      
      if (defaultValues) {
        dispatch({type: ActionType.Reset, payload: defaultValues});
      } else {
        dispatch({type: ActionType.ItemTypeChanged, payload: value});
      }       
    }
  }
  
  const handleProductChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.readonly) {
      return;
    }
    
    const id = parseInt(event.target.value);
    
    dispatch({
      type: ActionType.ProductChanged, payload: {
        id: id,
        renewalUnitPrice: getProduct(id)?.renewalUnitPrice ?? null
      }
    });
  };

  const handleLicenseTypeChanged = (event: React.MouseEvent<HTMLElement>, value: LicenseType) => {
    if (props.readonly) {
      return;
    }

    dispatch({type: ActionType.LicenseTypeChanged, payload: value ?? state.data.licenseType});
  };

  const handlePoolChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.readonly) {
      return;
    }

    dispatch({
      type: ActionType.SubscriptionPoolChanged,
      payload: getSubscriptionPool(parseInt(event.target.value)) ?? null
    });
  };
  
  const handleExpirationChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.readonly) {
      return;
    }

    dispatch({type: ActionType.ExpirationChanged, payload: event.target.value as ExpirationType});
  };

  const handleAlignToSubscriptionChanged = (subscriptionKey: SubscriptionKey) => {
    if (props.readonly) {
      return;
    }

    dispatch({type: ActionType.AlignToSubscriptionChanged, payload: subscriptionKey});
  };
  
  const handleAlignToDateChanged = (date: MaterialUiPickersDate | null) => {
    if (props.readonly) {
      return;
    }
    
    dispatch({type: ActionType.AlignToDateChanged, payload: date != null ? date.toDate() : null});
  }; 
  
  const canAlignTo = (item: (OrderDetailItem & Correlatable)): Boolean => {
    if (!item.isActive) {
      return false;
    }

    if (item.correlationId === props.correlationId) {
      return false;
    }

    if (state.data.itemType === ItemType.Renewal) {
      return getExpiryDate(item, props.orderItems, (props.correlationId ? [props.correlationId] : [])) !== null;
    }

    return true;
  }

  const handleAlignToLineChanged = (item: (OrderDetailItem & Correlatable)) => {
    if (props.readonly) {
      return;
    }
    
    dispatch({type: ActionType.AlignToLineChanged, payload: item});
  }
  
  const handlePricingBandChanged = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    if (props.readonly) {
      return;
    }
    
    const id = parseInt(event.target.value);
    const unitPrice = currentProduct?.pricingBands.find(band => band.id === id)?.unitPrice;
    return dispatch({type: ActionType.PricingBandChanged, payload: {id: id, unitPrice: unitPrice!}});
  };
  
  const handleApplyProRataCalculationChanged = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (props.readonly) {
      return;
    }
    
    dispatch({type: ActionType.ApplyProRataCalculationChanged, payload: checked});
  };
  
  const handleQuantityChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.readonly) {
      return;
    }

    const quantity = tryParseFloat(event.target.value);

    dispatch({type: ActionType.QuantityChanged, payload: quantity ?? null});

    if (quantity != null && currentProduct && state.data.itemType === ItemType.New) {
      const pricingBand = getPricingBand(currentProduct, quantity);

      if (pricingBand && pricingBand.id !== state.data.pricingBandId) {
        dispatch({
          type: ActionType.PricingBandChanged,
          payload: {
            id: pricingBand?.id, 
            unitPrice: pricingBand?.unitPrice
          }});
      }
    }
  };
  
  const handleUnitPriceChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.readonly) {
      return;
    }

    dispatch({type: ActionType.UnitPriceChanged, payload: tryParseFloat(event.target.value) ?? null});
  };
  
  const handleTotalPriceChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.readonly) {
      return;
    }

    dispatch({type: ActionType.TotalPriceChanged, payload: tryParseFloat(event.target.value) ?? null});
  };
  
  // we recalculate the total price on blur based on the unit price to avoid rounding issues
  const handleTotalPriceBlur = () => {
    if (props.readonly) {
      return;
    }

    dispatch({type: ActionType.UnitPriceChanged, payload: state.data.unitPrice});
  };
  
  const handleRecalculateClick = () => {
    if (props.readonly) {
      return;
    }
    
    dispatch({type: ActionType.ApplyProRataCalculationChanged, payload: true});
  };
  
  const handleResetClick = () => {
    if (props.readonly) {
      return;
    }
    
    switch (state.data.itemType) {
      case ItemType.New:
        dispatch({type: ActionType.UnitPriceChanged, payload: state.data.pricingBandUnitPrice});
        break;
        
      case ItemType.Renewal:
        dispatch({type: ActionType.UnitPriceChanged, payload: state.data.renewalUnitPrice});
        break;
    }
  };
  
  const getRenewableSubscription = (subscriptionKey: SubscriptionKey) =>
    renewableSubscriptionsState.items.find(sub =>
      equalsSubscriptionKey(getCustomerSubscriptionKey(sub, props.customerId), subscriptionKey));
  
  const handleSubscriptionChanged = (subscriptionKey: SubscriptionKey) => {
    if (props.readonly) {
      return;
    }
    
    const subscription = getRenewableSubscription(subscriptionKey);

    dispatch({
      type: ActionType.SubscriptionChanged,
      payload: {
        subscriptionKey,
        renewalUnitPrice: getProduct(subscriptionKey.productId)?.renewalUnitPrice ?? null,
        subscriptionQuantity: subscription?.quantity || null,
        subscriptionPool: getSubscriptionPool(subscriptionKey.poolId) ?? null
      }});
  };
  
  const handleValidate = (onValid?: () => void) => {
    dispatch({type: ActionType.Validating});

    orderItemSchema.validate(
      state.data,
      {
        abortEarly: false,
        context: {
          subscriptionPools: subscriptionPoolsState.data,
          renewedSubscription: state.data.subscriptionKey != null
            ? getRenewableSubscription(state.data.subscriptionKey)
            : null
        }
      })
    .then(() => {
      dispatch({type: ActionType.Validated});

      if (onValid) {
        onValid();
      }
    })
    .catch((validationError: ValidationError) => {
      dispatch({
        type: ActionType.Validated,
        payload: Object.assign(
          {},
          ...validationError.inner.map(error => ({[error.path]: {errorMessage: error.message, type: error.type}}))
        )
      });
    });
  }

  const handleSubmit = () => {
    const onValid = () => props.onSubmit({
      itemType: state.data.itemType,
      renewedSubscriptionKey: state.data.subscriptionKey,
      product: currentProduct!,
      licenseType: state.data.licenseType,
      subscriptionPool: state.data.subscriptionPool,
      expirationType: state.data.expirationType!,
      alignToDate: state.data.alignToDate,
      alignToSubscriptionKey: state.data.alignToSubscriptionKey,
      alignToLine: state.data.alignToLine,
      expiryDate: state.data.expiryDate,
      applyProRataCalculation: state.data.applyProRataCalculation,
      quantity: state.data.quantity!,
      renewalUnitPrice: state.data.renewalUnitPrice,
      pricingBandId: state.data.pricingBandId,
      pricingBandUnitPrice: state.data.pricingBandUnitPrice,
      unitPrice: state.data.unitPrice!,
      totalPrice: state.data.totalPrice!
    });
    
    handleValidate(onValid);
  };
  
  const calculatedUnitPriceMismatch = state.data.unitPrice !== state.data.calculatedUnitPrice;
  
  return (
    <>
      <Toolbar>
        <Typography variant="h4" color="inherit" className={classes.title}>
          {props.title}
        </Typography>
        <IconButton edge="end" color="inherit" aria-label="close" onClick={props.onClose}>
          <CloseIcon/>
        </IconButton>
      </Toolbar>
      <Divider/>
      <FadeTransition in={loading} duration={!loading ? 100 : 800}>
        <LinearProgress className={classes.progress}/>
      </FadeTransition>
      <FadeTransition in={!loading && loadingError != null} duration={!loading ? 200 : 800}>
        <Grid container justify="center">
          <Grid item>
            {createRequestErrorMessage("An error has occurred during load", loadingError, undefined, ErrorMessageSize.Small)}
          </Grid>
        </Grid>
      </FadeTransition>
      <FadeTransition in={!loading && loadingError == null} duration={!loading ? 200 : 800}>
        <Container>
          <Grid container direction="column" alignItems="stretch" spacing={2} className={classes.form}>
            <Grid item>
              <ToggleButtonGroup exclusive size="small" value={state.data.itemType} onChange={handleItemTypeChanged}>
                <ToggleButton classes={toggleButtonClasses} value={ItemType.New}>
                  New
                </ToggleButton>
                <ToggleButton classes={toggleButtonClasses}
                              value={ItemType.Renewal}
                              disabled={
                                !renewableSubscriptionsState.isComplete ||
                                renewableSubscriptionsState.totalItemCount === 0}>
                  Subscription Renewal
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            {state.visibility.showSubscriptionSelection &&
            <Grid item>
              <SubscriptionSelect fullWidth
                                  variant="filled"
                                  label="Subscription"
                                  customerId={props.customerId}
                                  options={renewableSubscriptionsState.items}
                                  value={state.data.subscriptionKey}
                                  error={state.validationErrors.subscriptionKey != null}
                                  helperText={state.validationErrors.subscriptionKey?.errorMessage}
                                  onChange={handleSubscriptionChanged}/>
            </Grid>
            }
            {state.visibility.showProductSelection &&
            <Grid item>
              <TextField select 
                         label="Product" 
                         fullWidth
                         variant="filled"
                         value={loading ? "" : state.data.productId ?? ""}
                         error={state.validationErrors.productId != null}
                         helperText={state.validationErrors.productId?.errorMessage}
                         onChange={handleProductChanged}>
                {productsState.isComplete && productsState.data!.map(product => (
                  <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                ))}
                {(!productsState.isComplete || !productsState.data || productsState.data.length === 0) &&
                <MenuItem/>
                }
              </TextField>
            </Grid>
            }
            {state.visibility.showLicenseTypeSelection &&
            <Grid item>
              <ToggleButtonGroup exclusive size="small" value={state.data.licenseType} onChange={handleLicenseTypeChanged}>
                <ToggleButton classes={toggleButtonClasses} value={LicenseType.Standalone}>
                  Standalone
                </ToggleButton>
                <ToggleButton classes={toggleButtonClasses} value={LicenseType.Site}>
                  Site / Enterprise
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            }
            {state.visibility.showPoolSelection && subscriptionPoolsState.data && subscriptionPoolsState.data.length > 0 &&
            <Grid item>
              <TextField select 
                         label="Pool" 
                         fullWidth
                         variant="filled"
                         value={loading ? "" : state.data.subscriptionPool?.id ?? ""}
                         error={state.validationErrors.subscriptionPool != null}
                         helperText={state.validationErrors.subscriptionPool?.errorMessage}
                         onChange={handlePoolChanged}>
                {subscriptionPoolsState.isComplete && subscriptionPoolsState.data!.map(pool => (
                  <MenuItem key={pool.id} value={pool.id}>{pool.name}</MenuItem>
                ))}
                {(!subscriptionPoolsState.isComplete || !subscriptionPoolsState.data || subscriptionPoolsState.data.length === 0) &&
                <MenuItem/>
                }
              </TextField>
            </Grid>
            }
            {state.visibility.showExpirationSelection &&
            <Grid item>
              <TextField select 
                         label="Expiration" 
                         fullWidth
                         variant="filled"
                         value={state.data.expirationType ?? ""}
                         error={state.validationErrors.expirationType != null}
                         helperText={state.validationErrors.expirationType?.errorMessage}
                         onChange={handleExpirationChanged}>
                <MenuItem value={ExpirationType.Default}>Default (12 months)</MenuItem>
                <MenuItem value={ExpirationType.TwoYears}>2 years</MenuItem>
                <MenuItem value={ExpirationType.AlignToSubscription}
                          disabled={
                            !currentSubscriptionsState.items || 
                            !currentSubscriptionsState.items.some(item => !equalsSubscription(state.data.subscriptionKey, item))}>
                  Align to Subscription
                </MenuItem>
                <MenuItem value={ExpirationType.AlignToItem} 
                          disabled={!props.orderItems.some(item => item.correlationId !== props.correlationId)}>
                  Align to Item
                </MenuItem>
                <MenuItem value={ExpirationType.AlignToDate}>Align to Date</MenuItem>
              </TextField>
            </Grid>
            }
            {state.visibility.showAlignToSubscriptionSelection &&
            <Grid item>
              <SubscriptionSelect fullWidth
                                  variant="filled"
                                  label="Existing Subscription"
                                  customerId={props.customerId}
                                  options={currentSubscriptionsState.items}
                                  disabledOptions={currentSubscriptionsState.items.filter(item => equalsSubscription(state.data.subscriptionKey, item))}
                                  value={state.data.alignToSubscriptionKey}
                                  error={state.validationErrors.alignToSubscriptionKey != null}
                                  helperText={state.validationErrors.alignToSubscriptionKey?.errorMessage}
                                  onChange={handleAlignToSubscriptionChanged}/>
            </Grid>
            }
            {state.visibility.showAlignToDateSelection &&
            <Grid item>
              <KeyboardDatePicker fullWidth
                                  inputVariant="filled"
                                  format="DD MMM YYYY"
                                  label="Expiration Date"
                                  value={state.data.alignToDate}
                                  error={state.validationErrors.alignToDate != null}
                                  helperText={state.validationErrors.alignToDate?.errorMessage}
                                  onChange={handleAlignToDateChanged}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}/>
            </Grid>
            }
            {state.visibility.showAlignToLineSelection &&
            <Grid item>
              <OrderItemSelect fullWidth
                               variant="filled"
                               label="Line"
                               options={props.orderItems}
                               disabledOptions={props.orderItems.filter(item => !canAlignTo(item))}
                               value={state.data.alignToLine}
                               error={state.validationErrors.alignToLine != null}
                               helperText={state.validationErrors.alignToLine?.errorMessage}
                               onChange={handleAlignToLineChanged}/>
            </Grid>
            }
            {state.visibility.showPricingDetailsInput &&
            <>
              <Grid container item spacing={1}>
                <Grid item xs={6}>
                  {state.visibility.showPricingBandSelection &&
                  <TextField select 
                             label="Pricing Band" 
                             fullWidth
                             variant="filled"
                             value={loading ? "" : state.data.pricingBandId ?? ""}
                             error={state.validationErrors.pricingBandId != null}
                             helperText={state.validationErrors.pricingBandId?.errorMessage}
                             onChange={handlePricingBandChanged}>
                    {currentProduct && currentProduct.pricingBands && currentProduct.pricingBands.map(band => (
                      <MenuItem key={band.id} value={band.id}>
                        {`${band.minQuantity}${band.maxQuantity == null ? "+" : ""}${band.maxQuantity != null && band.minQuantity !== band.maxQuantity ? (` — ${band.maxQuantity}`) : ""}`}
                      </MenuItem>
                    ))}
                    {(!currentProduct || !currentProduct.pricingBands || currentProduct.pricingBands.length === 0) &&
                    <MenuItem/>
                    }
                  </TextField>
                  }
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Quantity"
                             InputProps={{
                               inputComponent: NumberInput,
                               inputProps: {
                                 min: 1,
                                 max: 999,
                                 step: 1,
                                 style: {
                                   textAlign: "right",
                                 },
                                 fractionDigits: 0,
                                 allowNegatives: false
                               }
                             }}
                             fullWidth
                             variant="filled"
                             value={state.data.quantity ?? ""}
                             error={state.validationErrors.quantity != null}
                             helperText={state.validationErrors.quantity?.errorMessage}
                             onChange={handleQuantityChanged}/>
                </Grid>
              </Grid>
              <Grid container item spacing={1}>
                <Grid item xs={6} className={classes.switchCell}>
                  {state.visibility.showApplyProRataCalculationSelection &&
                  <FormControlLabel
                    classes={{labelPlacementStart: classes.switchLabel}}
                    control={
                      <Switch checked={state.data.applyProRataCalculation ?? false}
                              onChange={handleApplyProRataCalculationChanged}
                              color="primary"/>
                    }
                    label="Pro rata calculation"
                    labelPlacement="start"
                  />
                  }
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Unit Price"
                             InputProps={{
                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                               inputComponent: NumberInput
                             }}
                             inputProps={{
                               style: {textAlign: "right"},
                               fractionDigits: 2,
                               allowNegatives: false
                             }}
                             fullWidth
                             variant="filled"
                             value={state.data.unitPrice ?? ""}
                             error={calculatedUnitPriceMismatch || state.validationErrors.unitPrice != null}
                             helperText={
                               calculatedUnitPriceMismatch
                                 ? CalculatedUnitPriceVarianceErrorMessage
                                 : state.validationErrors.unitPrice?.errorMessage
                             }
                             onChange={handleUnitPriceChanged}/>
                </Grid>
              </Grid>
              <Grid container item spacing={1}>
                <Grid item xs={6}>
                  {state.visibility.showExecutionDateSelection &&
                  <KeyboardDatePicker fullWidth
                                      disabled
                                      inputVariant="filled"
                                      format="DD MMM YYYY"
                                      label="Execution Date"
                                      value={state.data.executionDate}
                                      error={state.validationErrors.executionDate != null}
                                      helperText={state.validationErrors.executionDate?.errorMessage}
                                      onChange={() => {}}
                                      KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                      }}/>
                  }
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Total Price"
                             InputProps={{
                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                               inputComponent: NumberInput
                             }}
                             inputProps={{
                               style: {textAlign: "right"},
                               fractionDigits: 2,
                               allowNegatives: false
                             }}
                             fullWidth
                             variant="filled"
                             value={state.data.totalPrice ?? ""}
                             error={state.validationErrors.totalPrice != null}
                             helperText={state.validationErrors.totalPrice?.errorMessage}
                             onBlur={handleTotalPriceBlur}
                             onChange={handleTotalPriceChanged}/>
                </Grid>
              </Grid>
            </>
            }
            {!props.readonly &&
            <Grid container item justify="space-between">
              <Grid container item xs={6}>
                <Grid item>
                  <Button color="secondary"
                          onClick={handleResetClick}
                          disabled={
                            state.data.applyProRataCalculation ||
                            (state.data.itemType === ItemType.New && state.data.unitPrice === state.data.pricingBandUnitPrice) ||
                            (state.data.itemType === ItemType.Renewal && state.data.unitPrice === state.data.renewalUnitPrice)}>
                    Reset
                  </Button>
                </Grid>
                <Grid item>
                  {calculatedUnitPriceMismatch &&
                  <Button color="secondary" onClick={handleRecalculateClick}>
                    Recalculate
                  </Button>
                  }
                </Grid>
              </Grid>
              <Grid container item xs={6}>
                <FormActions onSubmit={handleSubmit} onCancel={props.onClose} submitText={props.submitText}/>
              </Grid>
            </Grid>
            }
          </Grid>
        </Container>
      </FadeTransition>
    </>
  );
};

export default OrderItemEdit;