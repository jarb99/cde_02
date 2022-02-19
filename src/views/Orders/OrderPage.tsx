import * as React from "react";
import { useCallback, useEffect, useReducer, useState } from "react";
import Page from "../../components/Page";
import { generatePath, useHistory, useLocation, useParams } from "react-router";
import {
  Box,
  Button,
  Container,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Drawer,
  Fade,
  Grid,
  Grow,
  LinearProgress,
  makeStyles,
  Theme,
  Typography,
  useTheme,
} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import useApiFetch from "../../api/ApiFetch";
import useApiSend, { SendStatus } from "../../api/ApiSend";
import OrderDetails from "../../models/OrderDetails";
import {
  cancelOrder,
  createOrder,
  executeOrderFulfillment,
  getCustomer,
  getCustomerUsers,
  getOrder,
  getReseller,
  getUser,
  getUserCustomers,
  restoreOrder,
  updateOrder,
  updateOrderPayment
} from "../../api/API";
import { formatDate, formatTime } from "../../formatters/DateFormatters";
import OrderCustomerCard from "./OrderCustomerCard";
import OrderAffiliateCard from "./OrderAffiliateCard";
import OrderResellerCard from "./OrderResellerCard";
import OrderDetailsCard from "./OrderDetailsCard";
import OrderItemsCard from "./OrderItemsCard";
import { isGstApplicable } from "../../models/CountrySummary";
import OrderCustomer from "../../models/OrderCustomer";
import OrderDetailItem from "../../models/OrderDetailItem";
import ChangeTracking, { ChangeType } from "../../models/ChangeTracking";
import Correlatable from "../../models/Correlatable";
import OrderUser from "../../models/OrderUser";
import Modal from "../../components/Modal";
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import Confirmation from "../../components/Confirmation";
import RequestErrorDialog from "../../components/RequestErrorDialog";
import OrderStatus from "../../models/OrderStatus";
import OrderAffiliate from "../../models/OrderAffiliate";
import PaymentMethod from "../../models/PaymentMethod";
import { AxiosError, CancelToken } from "axios";
import ItemType from "../../models/ItemType";
import UserDetails from "../../models/UserDetails";
import UserSummary from "../../models/UserSummary";
import UserSelectDialog from "../Users/UserSelectDialog";
import { getDomainName } from "../Users/userUtils";
import { tryParseInt } from "../../utils/ParsingUtils";
import { addOrderPath, orderPath } from "../../Routes";
import { LocationDescriptor, LocationState } from "history";
import OrderUpdate from "../../models/OrderUpdate";
import OrderInvoicesCard from "./OrderInvoicesCard";
import OrderInvoiceSummary from "../../models/OrderInvoiceSummary";
import OrderItemEdit, { OrderItemEditValues } from "./OrderItemEdit";
import ExpirationType from "../../models/ExpirationType";
import PaymentIcon from '@material-ui/icons/Payment';
import OrderPaymentDialog from "./OrderPaymentDialog";
import OrderCancelDialog from "./OrderCancelDialog";
import { createRequestErrorMessage } from "../../components/RequestErrorMessage";
import OrderValidationErrors from "./OrderValidationErrors";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DialogTitle from "../../components/DialogTitle";
import ErrorDialog from "../../components/ErrorDialog";
import RestoreIcon from '@material-ui/icons/Restore';
import OrderEditButton from "./OrderEditButton";
import ResellerSummary from "../../models/ResellerSummary";
import CustomerDetails from "../../models/CustomerDetails";
import CustomerSelectDialog from "../Customers/CustomerSelectDialog";
import CustomerSummary from "../../models/CustomerSummary";
import useApiSearch from "../../api/ApiSearch";
import CustomerUserSummary from "../../models/CustomerUserSummary";
import useDelayedState from "../../utils/DelayedState";
import CustomerUserRole from "../../models/CustomerUserRole";


const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    buttonContainer: {
      margin: theme.spacing(-1),
      overflow: "hidden",
    },
    button: {
      margin: theme.spacing(1),
      overflow: "hidden",
    },
    results: {
      marginTop: theme.spacing(3)
    }
  });

const useStyles = makeStyles(styles);

enum OrderPageMode {
  View,
  Edit,
  Create,
}

enum OrderItemEditMode {
  Create,
  Modify,
  View
}

enum ActionType {
  FetchedOrder    = "FETCHED_ORDER",
  FetchedCustomer = "FETCHED_CUSTOMER",
  FetchedReseller = "FETCHED_RESELLER",
  FetchedUser     = "FETCHED_USER",
  Edit            = "EDIT",
  Saved           = "SAVED",
  Reset           = "RESET",
  SetDueDate      = "SET_DUE_DATE",
  SetReference    = "SET_REFERENCE",
  SetUser         = "SET_USER",
  SetCustomer     = "SET_CUSTOMER",
  SetReseller     = "SET_RESELLER",
  AddLineItem     = "ADD_LINE_ITEM",
  EditLineItem    = "EDIT_LINE_ITEM",
  DeleteLineItem  = "DELETE_LINE_ITEM",
  ClearLineItems  = "CLEAR_LINE_ITEMS",
  SetInvoices     = "SET_INVOICES",
}

interface FetchedOrderAction {
  type: ActionType.FetchedOrder;
  payload: {
    order: OrderDetails;
  }
}

interface FetchedCustomerAction {
  type: ActionType.FetchedCustomer;
  payload: {
    customer: CustomerDetails;
  }
}

interface FetchedResellerAction {
  type: ActionType.FetchedReseller;
  payload: {
    reseller: ResellerSummary;
  }
}

interface FetchedUserAction {
  type: ActionType.FetchedUser;
  payload: {
    user: UserDetails;
  }
}

interface EditAction {
  type: ActionType.Edit;
}

interface SavedAction {
  type: ActionType.Saved;
}

interface ResetAction {
  type: ActionType.Reset;
  payload: {
    order: OrderDetails | null;
  }
}

interface SetDueDateAction {
  type: ActionType.SetDueDate;
  payload: {
    dueDate: Date | null;
  }
}

interface SetReferenceAction {
  type: ActionType.SetReference;
  payload: {
    reference: string | null;
  }
}

interface SetUserAction {
  type: ActionType.SetUser;
  payload: {
    userId: number;
  }
}

interface SetCustomerAction {
  type: ActionType.SetCustomer;
  payload: {
    customerId: number;
  }
}

interface SetResellerAction {
  type: ActionType.SetReseller;
  payload: {
    active: boolean;
  }
}

interface AddLineItemAction {
  type: ActionType.AddLineItem;
  payload: {
    lineItem: OrderDetailItem;
  }
}

interface EditLineItemAction {
  type: ActionType.EditLineItem;
  payload: {
    lineItem: OrderDetailItem & Correlatable;
  }
}

interface DeleteLineItemAction {
  type: ActionType.DeleteLineItem;
  payload: {
    lineItem: OrderDetailItem & Correlatable;
  }
}

interface ClearLineItemsAction {
  type: ActionType.ClearLineItems;
}

interface SetInvoicesAction {
  type: ActionType.SetInvoices;
  payload: {
    invoices: OrderInvoiceSummary[];
  }
}

type Action =
  FetchedOrderAction
  | FetchedCustomerAction
  | FetchedResellerAction
  | FetchedUserAction
  | EditAction
  | SavedAction
  | ResetAction
  | SetDueDateAction
  | SetReferenceAction
  | SetUserAction
  | SetCustomerAction
  | SetResellerAction
  | AddLineItemAction
  | EditLineItemAction
  | DeleteLineItemAction
  | ClearLineItemsAction
  | SetInvoicesAction;

interface LoadState {
  loaded: boolean;
}

interface State {
  mode: OrderPageMode;
  reference: string | null;
  dueDate: Date | null;
  user: OrderUser & ChangeTracking & LoadState;
  customer: OrderCustomer & ChangeTracking & LoadState;
  affiliate: OrderAffiliate | null;
  initialResellerId: number | null;
  reseller: ResellerSummary & LoadState & { active: boolean } | null;
  items: (OrderDetailItem & Correlatable & ChangeTracking)[];
  nextItemCorrelationId: number;
  hasGst: boolean;
  total: number;
  gst: number;
  paymentMethod: PaymentMethod | undefined;
  couponCode: string | undefined;
  status: OrderStatus;
  cancelled: boolean;
  invoices: OrderInvoiceSummary[];
  createdDateTime: Date | undefined;
}

const OrderItemEditModeTitle = {
  [OrderItemEditMode.Modify]: "Edit Item",
  [OrderItemEditMode.Create]: "Add Item",
  [OrderItemEditMode.View]: "Item"
}

const calculateGst = (total: number): number =>
  Math.round(total / 11 * 100) / 100;

const calculateItemTotal = (item: OrderDetailItem): number =>
  item.quantity * item.unitPrice;

const calculateTotal = (items: (OrderDetailItem & ChangeTracking)[]): number =>
  items.filter(item => item.change !== ChangeType.Deleted && item.isActive)
  .reduce((subtotal, item) => subtotal + item.total, 0);

const withUpdatedCalculations = (state: State): State => {
  const items = state.items.map((item, index) => ({...item, total: calculateItemTotal(item)}));
  const total = calculateTotal(items);
  const gst = state.hasGst ? calculateGst(total) : 0;
  
  return {
    ...state,
    items,
    total,
    gst
  };
};

const getInitialState = (customerId?: number, resellerId?: number, mode?: OrderPageMode): State => {
  return {
    mode: mode || OrderPageMode.View,
    reference: null,
    dueDate: null,
    user: {
      ...({} as OrderUser),
      change: ChangeType.NoChange,
      loaded: false,
    },
    customer: {
      ...({} as OrderCustomer),
      id: customerId || 0,
      change: ChangeType.NoChange,
      loaded: false,
    },
    affiliate: null,
    initialResellerId: resellerId ?? null, // pins the resellerId to whatever was provided on adding a new order
    reseller: {
      ...({} as ResellerSummary),
      id: resellerId || 0,
      loaded: false,
      active: Boolean(resellerId)
    },
    items: [],
    nextItemCorrelationId: 1,
    hasGst: false,
    total: 0,
    gst: 0,
    paymentMethod: undefined,
    couponCode: undefined,
    status: OrderStatus.Draft,
    cancelled: false,
    invoices: [],
    createdDateTime: undefined,
  };
};

const getInitialOrderState = (order: OrderDetails): State => {
  let hasGst: boolean = order.orderStatus === OrderStatus.Draft ? isGstApplicable(order.customer?.country) : order.hasGst;
  let state: State = {
    ...getInitialState(),
    reference: order.reference,
    dueDate: order.dueDate,
    user: {
      ...order.user,
      change: ChangeType.NoChange,
      loaded: Boolean(order.user)
    },
    customer: {
      ...order.customer,
      change: ChangeType.NoChange,
      loaded: Boolean(order.customer)
    },
    affiliate: order.affiliate,
    initialResellerId: order.reseller?.id ?? null, // preserves the reseller to whatever has been saved, deactivating the reseller and saving will clear it 
    reseller: order.orderStatus === OrderStatus.Draft && order.reseller == null
      ? {
          ...({} as ResellerSummary),
          ...order.customer?.reseller,
          loaded: Boolean(order.customer?.reseller),
          active: false
        }
      : {
        ...({} as ResellerSummary),
        ...order.reseller,
          loaded: Boolean(order.reseller),
          active: Boolean(order.reseller)
        },
    items: [],
    nextItemCorrelationId: 1,
    hasGst: hasGst,
    total: order.totalPrice,
    gst: hasGst ? calculateGst(order.totalPrice) : 0,
    paymentMethod: order.paymentMethod,
    couponCode: order.couponCode,
    status: order.orderStatus,
    cancelled: !order.isActive,
    invoices: (order.invoices && order.invoices.map(invoice => ({...invoice}))) || [],
    createdDateTime: order.createdDateTime,
  };
  
  order.items.forEach(item => state.items.push({
    ...item,
    correlationId: state.nextItemCorrelationId++,
    change: ChangeType.NoChange
  }));
  
  // map target order item ids to correlation ids for align to item
  state.items = state.items.map(item =>
    item.alignToOrderItemId != null
      ? {
        ...item,
        alignToLineCorrelationId: state.items.find(i => i.id === item.alignToOrderItemId)?.correlationId
      }
      : item
  );
  
  return state;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.FetchedOrder:
      return getInitialOrderState(action.payload.order);
    
    case ActionType.FetchedCustomer:
      return withUpdatedCalculations({
        ...state,
        customer: {
          ...state.customer,
          ...action.payload.customer,
          loaded: true,
        },
        reseller: state.initialResellerId == null || state.reseller?.active !== true
          ? {
              ...({} as ResellerSummary),
              ...action.payload.customer.reseller,
              loaded: Boolean(action.payload.customer.reseller),
              active: Boolean(action.payload.customer.reseller)
            }
          : state.reseller, // preserve the initial reseller
        hasGst: state.status === OrderStatus.Draft ? isGstApplicable(state.customer.country) : state.hasGst,
      });
    
    case ActionType.FetchedReseller:
      return {
        ...state,
        reseller: {
          ...action.payload.reseller,
          loaded: Boolean(action.payload.reseller),
          active: Boolean(action.payload.reseller)
        }
      };
    
    case ActionType.FetchedUser:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user,
          loaded: true,
        }
      };
    
    case ActionType.Edit:
      return {
        ...state,
        mode: OrderPageMode.Edit,
      };
    
    case ActionType.Saved:
      return {
        ...state,
        mode: OrderPageMode.View,
      };

    case ActionType.Reset:
      if (action.payload.order) {
        return {
          ...(getInitialOrderState(action.payload.order)),
          // after the initial fetch, linked invoices may have changed so we need to preserve those changes
          invoices: state.invoices  
        };
      }
      return getInitialState();

    case ActionType.SetDueDate:
      return {
        ...state, 
        dueDate: action.payload.dueDate
      };
    
    case ActionType.SetReference:
      return {
        ...state,
        reference: action.payload.reference
      }

    case ActionType.SetUser:
      return {
        ...state,
        user: {
          ...({} as OrderUser),
          id: action.payload.userId,
          change: (state.user.id || 0) === 0 ? ChangeType.Added : ChangeType.Edited,
          loaded: false
        }
      };

    case ActionType.SetCustomer:
      return {
        ...state,
        customer: {
          ...({} as OrderCustomer),
          id: action.payload.customerId,
          change: ChangeType.Edited,
          loaded: false
        }
      };

    case ActionType.SetReseller:
      return {
        ...state,
        reseller: state.reseller != null
          ? {
              ...state.reseller,
              active: action.payload.active
            }
          : null
      };

    case ActionType.AddLineItem:
      return withUpdatedCalculations({
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload.lineItem,
            correlationId: state.nextItemCorrelationId,
            change: ChangeType.Added
          }
        ],
        nextItemCorrelationId: state.nextItemCorrelationId + 1,
      });

    case ActionType.EditLineItem:
      return withUpdatedCalculations({
        ...state,
        items: state.items.map((item, index) =>
          item.correlationId === action.payload.lineItem.correlationId
            ? {
              ...action.payload.lineItem,
              change: item.change === ChangeType.Added ? ChangeType.Added : ChangeType.Edited
            }
            : item),
      });

    case ActionType.DeleteLineItem:
      return withUpdatedCalculations({
        ...state,
        items: state.items.map((item, index) =>
          item.correlationId === action.payload.lineItem.correlationId
            ? {
              ...item,
              change: ChangeType.Deleted
            }
            : item)
      });
    
    case ActionType.ClearLineItems:
      return withUpdatedCalculations({
        ...state,
        items: state.items.map((item, index) =>
          item.isActive
            ? {
              ...item,
              change: ChangeType.Deleted
            }
            : item)
      });
      
    case ActionType.SetInvoices:
      return {
        ...state,
        invoices: action.payload.invoices.map(invoice => ({...invoice})) 
      };
  }
};

interface AddOrderUrlSearchParams {
  customerId?: number | undefined;
  resellerId?: number | undefined;
}

const parseAddOrderUrlSearchParams = (search: string): AddOrderUrlSearchParams => {
  const searchParams = new URLSearchParams(search);
  return {
    customerId: tryParseInt(searchParams.get("customer")),
    resellerId: tryParseInt(searchParams.get("reseller")),
  };
}

const createAddOrderLocationDescriptor = ({ customerId, resellerId }: AddOrderUrlSearchParams): LocationDescriptor<LocationState> => {
  const result: LocationDescriptor<LocationState> = {
    pathname: addOrderPath,
  }
  
  let params = [];
  
  if (customerId) {
    params.push(`customer=${customerId}`);
  }
  
  if (resellerId) {
    params.push(`reseller=${resellerId}`);
  }
  
  if (params.length > 0) {
    result.search = `?${params.join("&")}`;
  }
  
  return result;
}

const OrderPage: React.FC = () => {
  const {orderId} = useParams();
  const id = tryParseInt(orderId);

  const location = useLocation();

  const [state, dispatch] =
    useReducer(reducer, getInitialState(
      id ? undefined : (location.state as AddOrderUrlSearchParams)?.customerId,
      id ? undefined : (location.state as AddOrderUrlSearchParams)?.resellerId,
      id ? OrderPageMode.View : OrderPageMode.Create));

  const fetchOrder = useCallback((cancelToken?: CancelToken) => getOrder(id!, cancelToken), [id]);
  const shouldFetchOrder = useCallback(() => Boolean(id), [id]);
  const [fetchOrderState, refetchOrder] = useApiFetch<OrderDetails>(fetchOrder, shouldFetchOrder);
  
  useEffect(() => {
    if (fetchOrderState.isComplete) {
      dispatch({
        type: ActionType.FetchedOrder,
        payload: {
          order: fetchOrderState.data!
        }
      });
    }
  }, [fetchOrderState.isComplete, fetchOrderState.data]);

  const fetchCustomer = useCallback((cancelToken?: CancelToken) => getCustomer(state.customer.id!, cancelToken), [state.customer.id]);
  const shouldFetchCustomer = useCallback(() => Boolean(state.customer.id) && !state.customer.loaded, [state.customer.id, state.customer.loaded]);
  const [fetchCustomerState, retryFetchCustomer] = useApiFetch<CustomerDetails>(fetchCustomer, shouldFetchCustomer);

  useEffect(() => {
    if (fetchCustomerState.isComplete) {
      dispatch({
        type: ActionType.FetchedCustomer,
        payload: {
          customer: fetchCustomerState.data!
        }
      });
    }
  }, [fetchCustomerState.isComplete, fetchCustomerState.data]);
  
  const resellerId = state.reseller?.id ?? 0;
  const resellerLoaded = state.reseller?.loaded ?? false;
  const fetchReseller = useCallback((cancelToken?: CancelToken) => getReseller(resellerId!, cancelToken), [resellerId]);
  const shouldFetchReseller = useCallback(() => Boolean(resellerId) && !resellerLoaded, [resellerId, resellerLoaded]);
  const [fetchResellerState] = useApiFetch<ResellerSummary>(fetchReseller, shouldFetchReseller);
  
  useEffect(() => {
    if (fetchResellerState.isComplete) {
      dispatch({
        type: ActionType.FetchedReseller,
        payload: {
          reseller: fetchResellerState.data!
        }
      });
    }
  }, [fetchResellerState.isComplete, fetchResellerState.data])
  
  const fetchUser = useCallback((cancelToken?: CancelToken) => getUser(state.user.id!, cancelToken), [state.user.id]);
  const shouldFetchUser = useCallback(() => Boolean(state.user.id) && !state.user.loaded, [state.user.id, state.user.loaded]);
  const [fetchUserState, retryFetchUser] = useApiFetch<UserDetails>(fetchUser, shouldFetchUser);
  
  useEffect(() => {
    if (fetchUserState.isComplete) {
      dispatch({
        type: ActionType.FetchedUser,
        payload: {
          user: fetchUserState.data!
        }
      });
    }
  }, [fetchUserState.isComplete, fetchUserState.data]);
  
  const fetchUserCustomers = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getUserCustomers(state.user.id!, false, search, pageNo, pageSize, cancelToken), [state.user.id]);
  const shouldFetchUserCustomers = useCallback(() => state.status === OrderStatus.Draft && Boolean(state.user.id) && !Boolean(state.customer.id), [state.status, state.user.id, state.customer.id]);
  const [fetchUserCustomersState] = useApiSearch<CustomerUserSummary>(fetchUserCustomers, undefined, 1, 2, shouldFetchUserCustomers);
  
  useEffect(() => {
    if (!shouldFetchUserCustomers()) {
      return;
    }
        
    if (fetchUserCustomersState.isComplete) {
      if (fetchUserCustomersState.items.length === 1) {
        const id = fetchUserCustomersState.items[0].customer.id;
        dispatch({
          type: ActionType.SetCustomer,
          payload: {
            customerId: id
          }
        });
      }
    }
  }, [shouldFetchUserCustomers, fetchUserCustomersState.isComplete, fetchUserCustomersState.items]);
  
  const fetchCustomerUsers = useCallback((search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => getCustomerUsers(state.customer.id!, false, search, pageNo, pageSize, cancelToken), [state.customer.id]);
  const shouldFetchCustomerUsers = useCallback(() => state.status === OrderStatus.Draft && Boolean(state.customer.id) && !Boolean(state.user.id), [state.status, state.customer.id, state.user.id]);
  const [fetchCustomerUsersState] = useApiSearch<CustomerUserSummary>(fetchCustomerUsers, undefined, 1, 50, shouldFetchCustomerUsers);
  
  useEffect(() => {
    if (!shouldFetchCustomerUsers()) {
      return;
    }
        
    if (fetchCustomerUsersState.isComplete) {
      let user;
      
      if (fetchCustomerUsersState.items.length === 1) {
        user = fetchCustomerUsersState.items[0].user;
      } else {
        user = fetchCustomerUsersState.items.find(user => user.role === CustomerUserRole.Owner)?.user;
      }
      
      if (user != null) {
        dispatch({
          type: ActionType.FetchedUser,
          payload: {
            user: {
              ...user
            }
          }
        });
      }
    }
  }, [shouldFetchCustomerUsers, fetchCustomerUsersState.isComplete, fetchCustomerUsersState.items]);

  // ===========================================================================
  // Edit Due Date
  // ===========================================================================
  const handleSetDueDate = (date: Date | null) => {
    dispatch({
      type: ActionType.SetDueDate,
      payload: {
        dueDate: date
      }
    });
  }


  // ===========================================================================
  // Edit Reference
  // ===========================================================================
  const handleReferenceChanged = (reference: string | null) => {
    dispatch({
      type: ActionType.SetReference,
      payload: {
        reference: reference
      }
    });
  }
  
  
  // ===========================================================================
  // Change Customer
  // ===========================================================================
  const [changingCustomer, setChangingCustomer] = useState(false);

  const handleChangeCustomer = () =>
    setChangingCustomer(true);

  const handleSetCustomer = (selectedCustomer: CustomerSummary) => {
    if (selectedCustomer.id !== state.customer.id) {
      dispatch({
        type: ActionType.SetCustomer,
        payload: {
          customerId: selectedCustomer.id
        }
      });

      if (selectedCustomer.owner != null) {
        handleSetUser(selectedCustomer.owner);
      }
    }
    setChangingCustomer(false);
  };

  const handleCancelChangeCustomer = () =>
    setChangingCustomer(false);


  // ===========================================================================
  // Toggle Reseller
  // ===========================================================================
  const handleToggleReseller = () => {
    if (state.reseller?.loaded !== true) {
      return;
    }
    
    dispatch({
      type: ActionType.SetReseller,
      payload: {
        active: !state.reseller.active
      }
    });
  };
  
  
  // ===========================================================================
  // Change User
  // ===========================================================================
  const [changingUser, setChangingUser] = useState(false);
  
  const handleChangeUser = () => 
    setChangingUser(true);
  
  const handleSetUser = (selectedUser: UserSummary) => {
    if (selectedUser.id !== state.user.id) {
      dispatch({
        type: ActionType.SetUser, 
        payload: {
          userId: selectedUser.id,
        }
      });
    }
    setChangingUser(false);
  };
  
  const handleCancelChangeUser = () =>
    setChangingUser(false);


  // ===========================================================================
  // Change Invoices
  // ===========================================================================
  const handleSetInvoices = useCallback((selectedInvoices: OrderInvoiceSummary[]) => {
    dispatch({
      type: ActionType.SetInvoices,
      payload: {
        invoices: selectedInvoices
      }
    });
  }, []);
  
  
  // ===========================================================================
  // Item Edit
  // ===========================================================================
  const [showItemEdit, setShowItemEdit] = useState(false);
  const [itemEditMode, setItemEditMode] = useState(OrderItemEditMode.Create);
  const [editItemType, setEditItemType] = useState(ItemType.New);

  const handleShowItemEdit = (mode: OrderItemEditMode, itemType: ItemType) => {
    setShowItemEdit(true);
    setItemEditMode(mode);
    setEditItemType(itemType);
  }

  const handleSubmitItemEdit = (values: OrderItemEditValues) => {
    if (itemEditMode === OrderItemEditMode.Create) {
      handleSubmitAddItem(values);
    } else if (itemEditMode === OrderItemEditMode.Modify) {
      handleSubmitEditItem(values);
    } else {
      throw new Error(`unexpected OrderItemEditMode "${itemEditMode}"`);
    }
    setShowItemEdit(false);
  }

  const handleCancelItemEdit = () => {
    setShowItemEdit(false);
    if (editingItem) {
      setEditingItem(undefined);
    }
  }


  // ===========================================================================
  // View Item
  // ===========================================================================
  
  const handleViewItem = (item: OrderDetailItem & Correlatable) => {
    setEditingItem(item);
    handleShowItemEdit(OrderItemEditMode.View, item.type);
  }


  // ===========================================================================
  // Add Item
  // ===========================================================================
  
  const handleAddItem = (type: ItemType) => {
    handleShowItemEdit(OrderItemEditMode.Create, type);
  }
  
  const handleSubmitAddItem = (values: OrderItemEditValues) => {
    dispatch({
      type: ActionType.AddLineItem,
      payload: {
        lineItem: {
          id:                       undefined,
          isActive:                 true,
          type:                     values.itemType,
          renewedSubscriptionKey:   values.renewedSubscriptionKey ?? undefined,
          product:                  values.product,
          licenseType:              values.licenseType,
          subscriptionPool:         values.subscriptionPool ?? undefined,
          expirationType:           values.expirationType,
          alignToDate:              values.alignToDate ?? undefined,
          alignToSubscriptionKey:   values.alignToSubscriptionKey ?? undefined,
          alignToLineCorrelationId: values.alignToLine?.correlationId ?? undefined,
          expiryDate:               values.expiryDate ?? undefined, 
          applyProRataCalculation:  values.applyProRataCalculation ?? undefined,
          quantity:                 values.quantity,
          renewalUnitPrice:         values.renewalUnitPrice ?? undefined,
          pricingBandId:            values.pricingBandId ?? undefined,
          pricingBandUnitPrice:     values.pricingBandUnitPrice ?? undefined,
          unitPrice:                values.unitPrice,
          total:                    values.quantity * values.unitPrice,
          dateCreated:              new Date(),
        },
      }
    })
  }


  // ===========================================================================
  // Edit Item
  // ===========================================================================
  const [editingItem, setEditingItem] = useState<OrderDetailItem & Correlatable>();

  const handleEditItem = (item: OrderDetailItem & Correlatable) => {
    setEditingItem(item);
    handleShowItemEdit(OrderItemEditMode.Modify, item.type);
  }
  
  const handleSubmitEditItem = (values: OrderItemEditValues) => {
    dispatch({
      type: ActionType.EditLineItem,
      payload: {
        lineItem: {
          ...editingItem!,
          type:                     values.itemType,
          renewedSubscriptionKey:   values.renewedSubscriptionKey ?? undefined,
          product:                  values.product,
          licenseType:              values.licenseType,
          subscriptionPool:         values.subscriptionPool ?? undefined,
          expirationType:           values.expirationType,
          alignToDate:              values.alignToDate ?? undefined,
          alignToSubscriptionKey:   values.alignToSubscriptionKey ?? undefined,
          alignToLineCorrelationId: values.alignToLine?.correlationId ?? undefined,
          expiryDate:               values.expiryDate ?? undefined,
          applyProRataCalculation:  values.applyProRataCalculation ?? undefined,
          quantity:                 values.quantity,
          renewalUnitPrice:         values.renewalUnitPrice ?? undefined,
          pricingBandId:            values.pricingBandId ?? undefined,
          pricingBandUnitPrice:     values.pricingBandUnitPrice ?? undefined,
          unitPrice:                values.unitPrice,
        },
      }
    })
    setEditingItem(undefined);
  }


  // ===========================================================================
  // Clear Items
  // ===========================================================================
  const [confirmingClearItems, setConfirmingClearItems] = useState(false);

  const handleClearItems = () =>
    setConfirmingClearItems(true);
  
  const handleConfirmClearItems = () => {
    dispatch({
      type: ActionType.ClearLineItems,
    });
    setConfirmingClearItems(false);
  }
  
  const handleCancelClearItems = () =>
    setConfirmingClearItems(false);


  // ===========================================================================
  // Remove Item
  // ===========================================================================
  const [confirmingRemoveItem, setConfirmingRemoveItem] = useState<null | (OrderDetailItem & Correlatable)>(null);

  const handleRemoveItem = (item: OrderDetailItem & Correlatable) =>
    setConfirmingRemoveItem(item);
  
  const handleRemoveItemConfirmed = () => {
    dispatch({
      type: ActionType.DeleteLineItem,
      payload: {
        lineItem: confirmingRemoveItem!
      },
    });
    setConfirmingRemoveItem(null);
  }
  
  const handleRemoveItemCancelled = () =>
    setConfirmingRemoveItem(null);

  
  // ===========================================================================
  // Update Payment
  // ===========================================================================
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const [paymentSaveState, savePayment] = useApiSend(useCallback((payload: any, cancelToken?: CancelToken) =>
      updateOrderPayment(id!, payload, cancelToken),
    [id])); 
  const [paymentSaveErrors, setPaymentSaveErrors] = useState<React.ReactNode>(null);
  
  const handlePaidButtonClick = () => {
    setPaymentSaveErrors(null);
    setShowPaymentDialog(true);
  }
  
  const handlePaymentMethodDialogClose = () => {
    setShowPaymentDialog(false);
  }
    
  const handlePaymentSave = (paymentMethod: PaymentMethod, executeFulfillment: boolean) => {
    savePayment({paymentMethod, executeFulfillment: executeFulfillment});
  }
  
  useEffect(() => {
    if (paymentSaveState.status === SendStatus.Completed) {
      setShowPaymentDialog(false);
      dispatch({
        type: ActionType.Reset,
        payload: {
          order: paymentSaveState.response
        }
      });
    }
    
    if (paymentSaveState.status === SendStatus.Failed) {
      const validationErrors = getValidationErrors(paymentSaveState.error);
      if (validationErrors && validationErrors.length > 0) {
        setPaymentSaveErrors(<OrderValidationErrors errors={validationErrors}/>);
      } else {
        setPaymentSaveErrors(createRequestErrorMessage("An error has occurred marking the order as paid", paymentSaveState.error));
      }
    } 
  }, [paymentSaveState.status, paymentSaveState.response, paymentSaveState.error]);
  
  
  // ===========================================================================
  // Execute Fulfillment
  // ===========================================================================
  const [showFulfillmentConfirmation, setShowFulfillmentConfirmation] = useState<boolean>(false);
  const [fulfillmentExecutionState, executeFulfillment] = useApiSend(
    useCallback((payload: any, cancelToken?: CancelToken) => 
      executeOrderFulfillment(id!, cancelToken), 
      [id])); 
  const [fulfillmentErrors, setFulfillmentErrors] = useState<React.ReactNode>(null);
  
  const handleExecuteFulfillmentButtonClick = () => {
    setShowFulfillmentConfirmation(true);
  }
  
  const handleFulfillmentConfirmationClose = () => {
    setShowFulfillmentConfirmation(false);
  }
    
  const handleFulfillmentExecute = () => {
    setFulfillmentErrors(null);
    setShowFulfillmentConfirmation(false);
    executeFulfillment({});
  }
  
  const handleFulfillmentErrorsClose = () => {
    setFulfillmentErrors(null);
  }
  
  useEffect(() => {
    if (fulfillmentExecutionState.status === SendStatus.Completed) {
      setShowFulfillmentConfirmation(false);
      dispatch({
        type: ActionType.Reset,
        payload: {
          order: fulfillmentExecutionState.response
        }
      });
    }
    
    if (fulfillmentExecutionState.status === SendStatus.Failed) {
      const validationErrors = getValidationErrors(fulfillmentExecutionState.error);
      if (validationErrors && validationErrors.length > 0) {
        setFulfillmentErrors(<Box p={2}><OrderValidationErrors errors={validationErrors}/></Box>);
      } else {
        setFulfillmentErrors(createRequestErrorMessage("An error has occurred fulfilling the order", fulfillmentExecutionState.error));
      }
    } 
  }, [fulfillmentExecutionState.status, fulfillmentExecutionState.response, fulfillmentExecutionState.error]);

  const getValidationErrors = (error: AxiosError<any> | null): string[] | null => {
    const response = error?.response;
    
    if (response?.status === 400) {
      return response.data.validationErrors ?? null;
    }
    
    return null;
  }


  // ===========================================================================
  // Cancel Order
  // ===========================================================================
  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState<boolean>(false);
  const [cancelOrderState, executeCancelOrder] = useApiSend(
    useCallback((payload: any, cancelToken?: CancelToken) =>
        cancelOrder(id!, payload, cancelToken),
      [id]));
  const [cancelOrderErrors, setCancelOrderErrors] = useState<React.ReactNode>(null);

  const handleCancelOrderButtonClick = () => {
    setCancelOrderErrors(null);
    setShowCancelOrderDialog(true);
  }
  
  const handleCancelOrderDialogClose = () => {
    setShowCancelOrderDialog(false);
  }
  
  const handleCancelOrderConfirm = (creditInvoices: boolean) => {
    executeCancelOrder({creditInvoices: creditInvoices});
  }
  
  const handleCancelOrderErrorsClose = () => {
    setCancelOrderErrors(null);
  }
  
  useEffect(() => {
    if (cancelOrderState.status === SendStatus.Completed) {
      setShowCancelOrderDialog(false);
      dispatch({
        type: ActionType.Reset,
        payload: {
          order: cancelOrderState.response
        }
      });
    }

    if (cancelOrderState.status === SendStatus.Failed) {
      setCancelOrderErrors(createRequestErrorMessage("An error has occurred cancelling the order", cancelOrderState.error));
    }
  }, [cancelOrderState.status, cancelOrderState.response, cancelOrderState.error]);
  

  // ===========================================================================
  // Restore Order
  // ===========================================================================
  const [restoreOrderState, executeRestoreOrder] = useApiSend(
    useCallback((payload: any, cancelToken?: CancelToken) =>
        restoreOrder(id!, cancelToken),
      [id]));
  const [restoreOrderErrors, setRestoreOrderErrors] = useState<React.ReactNode>(null);

  const handleRestoreButtonClick = () => {
    setRestoreOrderErrors(null);
    executeRestoreOrder({});
  }
  
  const handleRestoreOrderErrorsClose = () => {
    setRestoreOrderErrors(null);
  }
  
  useEffect(() => {
    if (restoreOrderState.status === SendStatus.Completed) {
      dispatch({
        type: ActionType.Reset,
        payload: {
          order: restoreOrderState.response
        }
      });
    }

    if (restoreOrderState.status === SendStatus.Failed) {
      setRestoreOrderErrors(createRequestErrorMessage("An error has occurred restoring the order", restoreOrderState.error));
    }
  }, [restoreOrderState.status, restoreOrderState.response, restoreOrderState.error]);
  
  
  // ===========================================================================
  // Save
  // ===========================================================================

  const [saveState, save, cancelSave] = useApiSend(
    useCallback((payload: OrderUpdate, cancelToken?: CancelToken) => id
      ? updateOrder(id, payload, cancelToken)
      : createOrder(payload, cancelToken), [id]));
  const [showSaveError, setShowSaveError] = useState(false);
  
  const isSaving = [SendStatus.Executing, SendStatus.Cancelling].includes(saveState.status)
  const isFulfilling = [SendStatus.Queued, SendStatus.Executing].includes(fulfillmentExecutionState.status);
  const isCancelling = [SendStatus.Queued, SendStatus.Executing].includes(cancelOrderState.status);
  const isRestoring = [SendStatus.Queued, SendStatus.Executing].includes(restoreOrderState.status);
  
  const [showingEditButton, setShowingEditButton] = useState<boolean>(false);
  const [showingSaveButton, setShowingSaveButton] = useState<boolean>(false);
  const [showingCancelButton, setShowingCancelButton] = useState<boolean>(false);
  const [showingRestoreButton, setShowingRestoreButton] = useState<boolean>(false);

  const isUnpaid                       = [OrderStatus.Draft, state.status === OrderStatus.Finalized].includes(state.status);
  
  const showEditButton                 = state.mode === OrderPageMode.View && !showingSaveButton && !showingCancelButton && !showingRestoreButton && !state.cancelled && fetchOrderState.isComplete;
  const enableEditButton               = state.mode === OrderPageMode.View && fetchOrderState.isComplete && isUnpaid && !isCancelling;
  
  const showPaidButton                 = state.mode === OrderPageMode.View && !showingSaveButton && !showingCancelButton && !showingRestoreButton && fetchOrderState.isComplete && isUnpaid && !state.cancelled;
  const enablePaidButton               = state.mode === OrderPageMode.View && fetchOrderState.isComplete && !isCancelling && !state.cancelled;
  
  const showExecuteFulfillmentButton   = state.mode === OrderPageMode.View && !showingSaveButton && !showingCancelButton && !showingRestoreButton && fetchOrderState.isComplete && state.status === OrderStatus.Paid && !state.cancelled;
  const enableExecuteFulfillmentButton = state.mode === OrderPageMode.View && fetchOrderState.isComplete && !isFulfilling;
    
  const showRestoreOrderButton         = state.mode === OrderPageMode.View && fetchOrderState.isComplete && !showingEditButton && state.cancelled;
  const enableRestoreOrderButton       = state.mode === OrderPageMode.View && fetchOrderState.isComplete && !isRestoring && state.cancelled;
  
  const showSaveButton                 = [OrderPageMode.Edit, OrderPageMode.Create].includes(state.mode) && !showingEditButton && !(state.mode === OrderPageMode.Create && (isSaving || showingCancelButton));     // TODO: don't show save button until there's something to save?
  const enableSaveButton               = [OrderPageMode.Edit, OrderPageMode.Create].includes(state.mode) && !isSaving;
  
  const showCancelButton               = (state.mode === OrderPageMode.Edit && !showingEditButton) || (isSaving && !showingSaveButton);
  const enableCancelButton             = (state.mode === OrderPageMode.Edit && !isSaving) || (isSaving && saveState.status === SendStatus.Executing);

  const history = useHistory();
  useEffect(() => {
    if (saveState.status === SendStatus.Completed) {
      if (id) {
        dispatch({
          type: ActionType.Saved,
        });
        refetchOrder();
      } else {
        history.replace(generatePath(orderPath, { orderId: saveState.response.id }));
      }
    } else if (saveState.status === SendStatus.Failed) {
      setShowSaveError(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, saveState.status]);

  function handleSaveButtonClick() {
    const order: OrderUpdate = {
      reference: state.reference,
      dueDate: state.dueDate,
      userId: state.user.id,
      customerId: state.customer.id,
      resellerId: state.reseller?.active ? state.reseller?.id ?? null : null,
      items: state.items.filter(item => item.id || item.change === ChangeType.Added).map(item => ({
        id:                       item.id,
        isActive:                 item.isActive,
        type:                     item.type,
        renewedSubscriptionKey:   item.renewedSubscriptionKey,
        productId:                item.product.id,
        licenseType:              item.licenseType,
        subscriptionPoolId:       item.subscriptionPool?.id,
        expirationType:           item.expirationType,
        alignToDate:              item.alignToDate,
        alignToSubscriptionKey:   item.alignToSubscriptionKey,
        alignToLineCorrelationId: item.alignToLineCorrelationId,
        expiryDate:               item.expiryDate,
        applyProRataCalculation:  item.applyProRataCalculation,
        quantity:                 item.quantity,
        renewalUnitPrice:         item.renewalUnitPrice,
        pricingBandId:            item.pricingBandId,
        pricingBandUnitPrice:     item.pricingBandUnitPrice,
        unitPrice:                item.unitPrice,
        unitRrp:                  item.unitRrp,
        correlationId:            item.correlationId,
        change:                   item.change,
      })),
    };
    save(order);
  }

  function handleCancelButtonClick() {
    if (saveState.status === SendStatus.Executing) {
      cancelSave();
    } else {
      dispatch({
        type: ActionType.Reset, 
        payload: {
          order: fetchOrderState.data
        }
      });
    }
  }

  function handleSaveErrorClosed() {
    setShowSaveError(false);
  }

  // ===========================================================================

  function handleEditButtonClick() {
    dispatch({
      type: ActionType.Edit,
    });
  }

  const showAffiliateCard = Boolean(state.affiliate);
  const showResellerCard = Boolean(state.reseller?.loaded);
  const showMiddleColumn = showAffiliateCard || showResellerCard;
    
  const showEditControls = [OrderPageMode.Create, OrderPageMode.Edit].includes(state.mode);

  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
    
  const columnTransitionDuration = theme.transitions.duration.leavingScreen * 2;
  
  const [displayMiddleColumn, setDisplayMiddleColumn] = useDelayedState(showMiddleColumn, columnTransitionDuration);
  const [collapseMiddleColumn, setCollapseMiddleColumn] = useDelayedState(!showMiddleColumn, theme.transitions.duration.leavingScreen);

  useEffect(() => {
      setDisplayMiddleColumn(showMiddleColumn, !showMiddleColumn)
      setCollapseMiddleColumn(!showMiddleColumn, showMiddleColumn)
    }
    , [showMiddleColumn, setDisplayMiddleColumn, setCollapseMiddleColumn]);
    
  const columnShowHideTransition = {
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: columnTransitionDuration,
    })
  };

  const classes = useStyles();

  return (
    <Page className={classes.root} title={id ? `Order #${id}` : "New Order"}>
      <Container maxWidth={false}>
        {/* Header */}
        <div style={{
               paddingBottom: theme.spacing(2),
             }}>
          <Box display="flex"
               flexDirection="row"
               alignItems="center"
               style={{
                 paddingBottom: theme.spacing(1),
               }}>
            <Box>
              <Typography component="h1" variant="h3">
                {id ? `Order #${id}` : "New Order"}
              </Typography>
              {state.createdDateTime && (
                <Typography component="h2" variant="subtitle1">
                  {`${formatDate(state.createdDateTime)}, ${formatTime(state.createdDateTime)}`}
                </Typography>
              )}
            </Box>
            <Box className={classes.buttonContainer}
                 flexGrow={1}
                 display="flex"
                 flexDirection="row"
                 justifyContent="flex-end">

              {/* Restore */}
              <Grow in={showRestoreOrderButton}
                    onEntering={() => setShowingRestoreButton(true)}
                    onExited={() => setShowingRestoreButton(false)}
                    timeout={transitionDuration}
                    unmountOnExit>
                <Button variant="contained"
                        color="primary"
                        size="large"
                        className={classes.button}
                        startIcon={<RestoreIcon/>}
                        onClick={handleRestoreButtonClick}
                        disabled={!enableRestoreOrderButton}>
                  Restore
                </Button>
              </Grow>
              
              {/* Mark As Paid */}
              <Grow in={showPaidButton}
                    timeout={{enter: transitionDuration.enter * 3, exit: transitionDuration.exit}}
                    unmountOnExit>
                <Button variant="contained"
                        color="secondary"
                        size="large"
                        className={classes.button}
                        startIcon={<PaymentIcon/>}
                        onClick={handlePaidButtonClick}
                        disabled={!enablePaidButton}>
                  Mark As Paid
                </Button>
              </Grow>

              {/* Fulfil */}
              <Grow in={showExecuteFulfillmentButton}
                    timeout={{enter: transitionDuration.enter * 3, exit: transitionDuration.exit}}
                    unmountOnExit>
                <Button variant="contained"
                        color="secondary"
                        size="large"
                        className={classes.button}
                        startIcon={<LocalShippingIcon/>}
                        onClick={handleExecuteFulfillmentButtonClick}
                        disabled={!enableExecuteFulfillmentButton}>
                  Fulfil
                </Button>
              </Grow>
              
              {/* Edit */}
              <Grow in={showEditButton}
                    onEntering={() => setShowingEditButton(true)}
                    onExited={() => setShowingEditButton(false)}
                    timeout={transitionDuration}
                    unmountOnExit>

                <OrderEditButton className={classes.button} 
                                 disabled={!enableEditButton}
                                 onEditOrderClick={handleEditButtonClick} 
                                 onCancelOrderClick={handleCancelOrderButtonClick}/>
               
              </Grow>

              {/* Save */}
              <Grow in={showSaveButton}
                    onEntering={() => setShowingSaveButton(true)}
                    onExited={() => setShowingSaveButton(false)}
                    unmountOnExit={true}
                    timeout={{enter: transitionDuration.enter * 3, exit: transitionDuration.exit}}>
                <Button variant="contained"
                        color="secondary"
                        size="large"
                        className={classes.button}
                        startIcon={<SaveIcon/>}
                        onClick={handleSaveButtonClick}
                        disabled={!enableSaveButton}>
                  Save
                </Button>
              </Grow>

              {/* Cancel */}
              <Grow in={showCancelButton}
                    onEntering={() => setShowingCancelButton(true)}
                    onExited={() => setShowingCancelButton(false)}
                    unmountOnExit={true}
                    timeout={transitionDuration}>
                <span>
                  <Button variant="outlined"
                          color="default"
                          size="large"
                          className={classes.button}
                          startIcon={<CloseIcon/>}
                          onClick={handleCancelButtonClick}
                          disabled={!enableCancelButton}>
                    Cancel
                  </Button>
                </span>
              </Grow>
            </Box>
          </Box>
          <Fade in={fetchOrderState.isFetching || isSaving || isFulfilling || isCancelling || isRestoring}>
            <LinearProgress style={{ height: 1, marginTop: -1 }} />
          </Fade>
        </div>

        {/* Body */}
        <Grid container alignItems="stretch" spacing={3} justify="space-between">
          <Grid item xs={collapseMiddleColumn ? 6 : 4} style={columnShowHideTransition}>
            <OrderCustomerCard customer={state.customer}
                               loadingCustomer={fetchCustomerState.isFetching}
                               loadCustomerFailed={fetchCustomerState.hasErrored}
                               loadCustomerError={fetchCustomerState.error}
                               onRetryFetchCustomer={retryFetchCustomer}
                               user={state.user.loaded ? state.user : undefined}
                               loadingUser={fetchUserState.isFetching}
                               loadUserFailed={fetchUserState.hasErrored}
                               loadUserError={fetchUserState.error}
                               onRetryFetchUser={retryFetchUser}
                               hideNoUserMessage={fetchOrderState.isFetching || Boolean(state.user.id)}
                               hideNoCustomerMessage={fetchOrderState.isFetching || Boolean(state.user.id)}
                               showEditControls={showEditControls}
                               disableEditControls={isSaving}
                               onUserChange={handleChangeUser}
                               onCustomerChange={handleChangeCustomer}/>
                               
            <UserSelectDialog open={changingUser} 
                              onSelected={handleSetUser}
                              onCancel={handleCancelChangeUser}
                              customerId={state.customer.id !== 0 ? state.customer.id : undefined}
                              fixtures={{
                                companyName: state.customer.name,
                                domainName: getDomainName(state.user.email),
                                emailAddress: state.user.email
                              }}/>
                              
            <CustomerSelectDialog open={changingCustomer} 
                                  onSelected={handleSetCustomer} 
                                  onCancel={handleCancelChangeCustomer} 
                                  fixtures={{
                                    domainName: getDomainName(state.user.email),
                                    emailAddress: state.user.email
                                  }}/>
          </Grid>
          <Grow in={displayMiddleColumn} unmountOnExit={true} timeout={displayMiddleColumn ? columnTransitionDuration : 0}>
            <Grid item xs={4}>
              {showAffiliateCard &&
              <OrderAffiliateCard affiliate={state.affiliate}
                                  applicableValue={state.total}/>
              }
              {showResellerCard &&
              <OrderResellerCard reseller={state.reseller}
                                 active={state.reseller?.active ?? false}
                                 showToggle={state.status === OrderStatus.Draft}
                                 canToggle={state.mode === OrderPageMode.Create || state.mode === OrderPageMode.Edit}
                                 toggleActive={handleToggleReseller}/>
              }
            </Grid>
          </Grow>
          <Grid container item xs={collapseMiddleColumn ? 6 : 4} style={columnShowHideTransition}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <OrderDetailsCard editing={state.mode === OrderPageMode.Create || state.mode === OrderPageMode.Edit}
                                  reference={state.reference}
                                  dueDate={state.dueDate}
                                  status={state.status}
                                  cancelled={state.cancelled}
                                  paymentMethod={state.paymentMethod}
                                  couponCode={state.couponCode}
                                  onDueDateChanged={handleSetDueDate}
                                  onReferenceChanged={handleReferenceChanged}/>
              </Grid>
              <Grid item xs={12}>
                <OrderInvoicesCard isLoading={fetchOrderState.isFetching || fetchUserState.isFetching}
                                   disabled={state.mode !== OrderPageMode.View}
                                   orderId={id}
                                   customerId={state.customer.id}
                                   invoices={state.invoices}
                                   onLinkedInvoicesChanged={handleSetInvoices}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <OrderItemsCard isLoading={fetchOrderState.isFetching}
                            items={state.items.filter(item => item.change !== ChangeType.Deleted)}
                            showGst={state.hasGst}
                            gst={state.gst}
                            total={state.total}
                            showEditControls={showEditControls}
                            disableEditControls={isSaving}
                            onAddItem={handleAddItem}
                            disableAddItem={type => type === ItemType.Renewal && !Boolean(state.user.id)}
                            onClearItems={handleClearItems}
                            onViewItem={handleViewItem}
                            onEditItem={handleEditItem}
                            onRemoveItem={handleRemoveItem} />
            
            <Drawer anchor="right"
                    open={showItemEdit}
                    onClose={handleCancelItemEdit}>
              <OrderItemEdit title={OrderItemEditModeTitle[itemEditMode]}
                             submitText={itemEditMode === OrderItemEditMode.Create ? "Add" : "Done"}
                             orderDueDate={state.dueDate}
                             customerId={state.customer?.id}
                             correlationId={editingItem?.correlationId ?? null}
                             readonly={itemEditMode === OrderItemEditMode.View}
                             initialValues={(itemEditMode === OrderItemEditMode.View || itemEditMode === OrderItemEditMode.Modify) && editingItem 
                               ? ({
                                 itemType: editItemType,
                                 renewedSubscriptionKey: editingItem!.renewedSubscriptionKey ?? null,
                                 product: editingItem!.product,
                                 licenseType: editingItem!.licenseType,
                                 subscriptionPool: editingItem!.subscriptionPool ?? null, 
                                 expirationType: editingItem!.expirationType ?? ExpirationType.Default,
                                 alignToDate: editingItem!.alignToDate ?? null,
                                 alignToSubscriptionKey: editingItem!.alignToSubscriptionKey ?? null,
                                 alignToLine: state.items.find(item => item.change !== ChangeType.Deleted && item.correlationId === editingItem!.alignToLineCorrelationId) ?? null,
                                 expiryDate: editingItem!.expiryDate ?? null,
                                 applyProRataCalculation: editingItem!.applyProRataCalculation ?? null,
                                 quantity: editingItem!.quantity,
                                 renewalUnitPrice: editingItem!.renewalUnitPrice ?? null, 
                                 pricingBandId: editingItem!.pricingBandId ?? null,
                                 pricingBandUnitPrice: editingItem!.pricingBandUnitPrice ?? null,
                                 unitPrice: editingItem!.unitPrice,
                                 totalPrice: editingItem!.total
                               })
                               : null}
                             orderItems={state.items.filter(item => item.change !== ChangeType.Deleted)}
                             onSubmit={handleSubmitItemEdit}
                             onClose={handleCancelItemEdit}/>
            </Drawer>

            <Modal title="Clear Items | Confirmation"
                   icon={<WarningRoundedIcon />}
                   onClose={handleCancelClearItems}
                   open={confirmingClearItems}
                   disableClose={false}>
              <Confirmation summary="Really? Are you sure?"
                            message="All of the items will be removed from the order."
                            confirmText="Yeah, I'm sure"
                            onConfirm={handleConfirmClearItems}
                            cancelText="Uh, maybe not"
                            onCancel={handleCancelClearItems} />
            </Modal>

            <Modal title="Remove Item | Confirmation"
                   icon={<WarningRoundedIcon />}
                   onClose={handleRemoveItemCancelled}
                   open={Boolean(confirmingRemoveItem)}
                   disableClose={false}>
              <Confirmation summary="Really? Are you sure?"
                            message="This item will be removed from the order."
                            confirmText="Yeah, I'm sure"
                            onConfirm={handleRemoveItemConfirmed}
                            cancelText="Uh, maybe not"
                            onCancel={handleRemoveItemCancelled} />
            </Modal>
          </Grid>
        </Grid>
         
        <RequestErrorDialog
          open={showSaveError}
          message="An error occurred while saving the order"
          error={saveState.error}
          onClose={handleSaveErrorClosed} />

        <OrderPaymentDialog open={showPaymentDialog}
                            onCancel={handlePaymentMethodDialogClose}
                            onSave={handlePaymentSave}
                            errorComponent={paymentSaveErrors}
                            disabled={[SendStatus.Queued, SendStatus.Executing].includes(paymentSaveState.status)}
                            showProgress={[SendStatus.Queued, SendStatus.Executing].includes(paymentSaveState.status)}
                            paymentMethod={state.paymentMethod ?? null}/>

        <Dialog open={showFulfillmentConfirmation}
                onClose={handleFulfillmentConfirmationClose}>
          <DialogTitle title="Fulfil this order?"/>
          <DialogContent>
            <DialogContentText>
              Fulfilling this order will create the new subscriptions, generate new licences and send an email to the
              user with the new subscription details.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFulfillmentConfirmationClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleFulfillmentExecute} color="primary" autoFocus>
              Fulfil
            </Button>
          </DialogActions>
        </Dialog>

        <OrderCancelDialog open={showCancelOrderDialog}
                           onCancel={handleCancelOrderDialogClose}
                           onSave={handleCancelOrderConfirm}
                           errorComponent={cancelOrderErrors}
                           disabled={[SendStatus.Queued, SendStatus.Executing].includes(cancelOrderState.status)}
                           showProgress={[SendStatus.Queued, SendStatus.Executing].includes(cancelOrderState.status)} />
         
        <ErrorDialog open={fulfillmentErrors != null} title="Error" onClose={handleFulfillmentErrorsClose}>
          {fulfillmentErrors}
        </ErrorDialog>
         
        <ErrorDialog open={cancelOrderErrors != null} title="Error" onClose={handleCancelOrderErrorsClose}>
          {cancelOrderErrors}
        </ErrorDialog>
         
        <ErrorDialog open={restoreOrderErrors != null} title="Error" onClose={handleRestoreOrderErrorsClose}>
          {restoreOrderErrors}
        </ErrorDialog>         
      </Container>
    </Page>
  );
};

export { createAddOrderLocationDescriptor, parseAddOrderUrlSearchParams };
export default OrderPage;
