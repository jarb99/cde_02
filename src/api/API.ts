import axios, { AxiosResponse, CancelToken } from "axios";
import UserSummary from "../models/UserSummary";
import dateValueResponseTransform from "./transforms/DateValueResponseTransform";
import OrderSummary from "../models/OrderSummary";
import UserDetails from "../models/UserDetails";
import CustomerOrder from "../models/CustomerOrder";
import CustomerLicense from "../models/CustomerLicense";
import SubscriptionSummary from "../models/SubscriptionSummary";
import CustomerSubscriptionSummary from "../models/CustomerSubscriptionSummary";
import OrderDetails from "../models/OrderDetails";
import OrderUpdate from "../models/OrderUpdate";
import UserUpdate from "../models/UserUpdate";
import CountrySummary from "../models/CountrySummary";
import ProductDetails from "../models/ProductDetails";
import ContactSummary from "../models/ContactSummary";
import SubscriptionKey from "../models/SubscriptionKey";
import InvoiceSummary from "../models/InvoiceSummary";
import OrderInvoiceSummary from "../models/OrderInvoiceSummary";
import SubscriptionPool from "../models/SubscriptionPool";
import OrderCancelled from "../models/OrderCancelled";
import OrderPaid from "../models/OrderPaid";
import Configuration from "../configuration/configuration";
import CustomerSummary from "../models/CustomerSummary";
import CustomerDetails from "../models/CustomerDetails";
import CustomerUserSummary from "../models/CustomerUserSummary";
import CustomerUserUpdate from "../models/CustomerUserUpdate";
import ResellerSummary from "../models/ResellerSummary";


const api = axios.create({
  baseURL: "/api/",
  responseType: "json",
  transformResponse: dateValueResponseTransform
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.reload();
    } else {
      return Promise.reject(error);
    }
  });

export async function getConfiguration(cancelToken?: CancelToken): Promise<AxiosResponse<Configuration>> {
  return api.get<Configuration>('configuration', {cancelToken});
}

export class PagingParams {
  static readonly PAGE_NO: string = "pageNo";
  static readonly PAGE_SIZE: string = "pageSize";
}

export interface PageResults<TItem> {
  items: TItem[];
  pageNo: number;
  pageSize: number;
  pageCount: number;
  totalItemCount: number;
}

function getPageResults<T>(response: AxiosResponse<Array<T>>): PageResults<T> {
  const results: PageResults<T> = {
    items: response.data,
    pageNo: parseInt(response.headers["x-paging-pageno"]),
    pageSize: parseInt(response.headers["x-paging-pagesize"]),
    pageCount: parseInt(response.headers["x-paging-pagecount"]),
    totalItemCount: parseInt(response.headers["x-paging-totalitemcount"])
  };
  return results;
}

async function getPage<T>(
  url: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<PageResults<T>> {
  const params = {
    [PagingParams.PAGE_NO]: pageNo,
    [PagingParams.PAGE_SIZE]: pageSize
  };
  const response = await api.get<Array<T>>(url, {params, cancelToken});
  return getPageResults(response);
}

export class SearchParams {
  static readonly SEARCH_TERM: string = "search";
}

export interface SearchResults<TItem> extends PageResults<TItem> {
  searchTerm: string;
}

function getSearchResults<T>(
  response: AxiosResponse<Array<T>>
): SearchResults<T> {
  const results: SearchResults<T> = {
    ...getPageResults(response),
    searchTerm: response.headers["x-search-term"]
  };
  return results;
}

async function getSearch<T>(
  url: string,
  search?: string,
  pageNo?: number,
  pageSize?: number,
  otherParams?: {[key: string]: string | number | boolean | null} | null,
  cancelToken?: CancelToken
): Promise<SearchResults<T>> {
  const params = {
    ...otherParams,
    [SearchParams.SEARCH_TERM]: search && search !== "" ? search : null,
    [PagingParams.PAGE_NO]: pageNo,
    [PagingParams.PAGE_SIZE]: pageSize
  };
  const response = await api.get<Array<T>>(url, {params, cancelToken});
  return getSearchResults(response);
}

export async function getUsers(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<UserSummary>> {
  return await getSearch("/users", search, pageNo, pageSize, null, cancelToken);
}

export function getUser(userId: number, cancelToken?: CancelToken): Promise<AxiosResponse<UserDetails>> {
  return api.get<UserDetails>(`/users/${userId}`, {cancelToken});
}

export function updateUser(userId: number, userEdit: UserUpdate, cancelToken?: CancelToken): Promise<AxiosResponse> {
  return api.put(`/users/${userId}`, userEdit, {cancelToken});
}

export function updateUserXeroContact(userId: number, xeroContactId: string, cancelToken?: CancelToken): Promise<AxiosResponse> {
  return api.put(`/users/${userId}/XeroContact`, {xeroContactId} , {cancelToken});
}

export function deleteUserXeroContact(userId: number, cancelToken?: CancelToken): Promise<AxiosResponse> {
  return api.delete(`/users/${userId}/XeroContact`, {cancelToken});
}

export function getUserCustomers(
  userId: number,
  includeInactive?: boolean,
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<CustomerUserSummary>> {
  return getSearch(`/users/${userId}/customers`, search, pageNo, pageSize, {includeInactive: includeInactive ?? null}, cancelToken);
}
  
export function getContact(contactId: string, cancelToken?: CancelToken): Promise<AxiosResponse<ContactSummary>> {
  return api.get<ContactSummary>(`/contacts/${contactId}`, {cancelToken});
}

export function getContacts(
  // search?: string,
  // pageNo?: number,
  // pageSize?: number,
  search: string,
  cancelToken?: CancelToken
): Promise<AxiosResponse<ContactSummary[]>> {
  // return getSearch("/contacts", search, pageNo, pageSize, cancelToken);
  const params = {search};
  return api.get<ContactSummary[]>("/contacts", {params, cancelToken});
}

export function createXeroContact(userId: number, cancelToken?: CancelToken): Promise<AxiosResponse<ContactSummary>> {
  return api.post<ContactSummary>('/contacts', {userId}, {cancelToken});
}

export async function getOrders(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<OrderSummary>> {
  return getSearch("/orders", search, pageNo, pageSize, null, cancelToken);
}

export async function getDraftOrders(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<OrderSummary>> {
  return getSearch("/orders/draft", search, pageNo, pageSize, null, cancelToken);
}

export async function getPaidOrders(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<OrderSummary>> {
  return getSearch("/orders/paid", search, pageNo, pageSize, null, cancelToken);
}

export async function getCompleteOrders(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<OrderSummary>> {
  return getSearch("/orders/complete", search, pageNo, pageSize, null, cancelToken);
}

export async function getCancelledOrders(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<OrderSummary>> {
  return getSearch("/orders/cancelled", search, pageNo, pageSize, null, cancelToken);
}

export function getOrder(orderId: number, cancelToken?: CancelToken): Promise<AxiosResponse<OrderDetails>> {
  return api.get<OrderDetails>(`/orders/${orderId}`, {cancelToken});
}

export function createOrder(order: OrderUpdate, cancelToken?: CancelToken): Promise<AxiosResponse<{id: number}>> {
  return api.post("/orders", order, {cancelToken});
}

export function updateOrder(id: number, order: OrderUpdate, cancelToken?: CancelToken): Promise<AxiosResponse> {
  return api.put(`/orders/${id}`, order, {cancelToken});
}

export function cancelOrder(id: number, orderCancelled: OrderCancelled, cancelToken?: CancelToken): Promise<AxiosResponse<OrderDetails>> {
  return api.post(`/orders/cancelled/${id}`, orderCancelled, {cancelToken});
}

export function restoreOrder(id: number, cancelToken?: CancelToken): Promise<AxiosResponse<OrderDetails>> {
  return api.post(`/orders/restored/${id}`, {cancelToken});
}

export function updateOrderPayment(id: number, orderPaid: OrderPaid, cancelToken?: CancelToken): Promise<AxiosResponse<OrderDetails>> {
  return api.post(`/orders/paid/${id}`, orderPaid, {cancelToken});
}

export function executeOrderFulfillment(id: number, cancelToken?: CancelToken): Promise<AxiosResponse<OrderDetails>> {
  return api.post(`/orders/fulfillment/${id}`, {cancelToken});
}

export function updateOrderInvoices(
  id: number, 
  invoices: string[], 
  cancelToken?: CancelToken
): Promise<AxiosResponse> {
  return api.put(`/orders/${id}/invoices`, invoices, {cancelToken});  
}

export function exportOrderInvoice(
  id: number,
  cancelToken?: CancelToken
): Promise<AxiosResponse<OrderInvoiceSummary>> {
  return api.put(`/orders/${id}/invoice/export`, null, {cancelToken});
}

export function getSubscriptions(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<SubscriptionSummary>> {
  return getSearch("/subscriptions", search, pageNo, pageSize, null, cancelToken);
}

export function getCurrentSubscriptions(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<SubscriptionSummary>> {
  return getSearch("/subscriptions/current", search, pageNo, pageSize, null, cancelToken);
}

export function getExpiredSubscriptions(
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<SubscriptionSummary>> {
  return getSearch("/subscriptions/expired", search, pageNo, pageSize, null, cancelToken);
}

export function getSubscription(
  key: SubscriptionKey,
  cancelToken?: CancelToken
): Promise<AxiosResponse<SubscriptionSummary>> {
  const params = {
    "customerId":  key.customerId,
    "poolId":      key.poolId,
    "productId":   key.productId,
    "licenseType": key.licenseType,
    "expiryDate":  key.expiryDate,
  };
  return api.get<SubscriptionSummary>('/subscriptions/bykey', {params, cancelToken});
}

export function getCountries(cancelToken?: CancelToken): Promise<AxiosResponse<CountrySummary[]>> {
  return api.get<CountrySummary[]>('/countries', {cancelToken});
}

export function getProducts(cancelToken?: CancelToken): Promise<AxiosResponse<ProductDetails[]>> {
  return api.get<ProductDetails[]>('/products', {cancelToken});
}

export async function getCustomers(
  resellerId?: number,
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<CustomerSummary>> {
  return await getSearch("/customers", search, pageNo, pageSize, {resellerId: resellerId ?? null}, cancelToken);
}

export function getCustomer(customerId: number, cancelToken?: CancelToken): Promise<AxiosResponse<CustomerDetails>> {
  return api.get<CustomerDetails>(`/customers/${customerId}`, {cancelToken});
}

export function getReseller(resellerId: number, cancelToken?: CancelToken): Promise<AxiosResponse<ResellerSummary>> {
  return api.get<ResellerSummary>(`/resellers/${resellerId}`, {cancelToken});
}

export function getCustomerInvoices(customerId: number, cancelToken?: CancelToken): Promise<AxiosResponse<InvoiceSummary[]>> {
  return api.get<InvoiceSummary[]>(`/customers/${customerId}/invoices`, {cancelToken});
}

export function getCustomerLicensesCurrent(
  customerId: number,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<PageResults<CustomerLicense>> {
  return getPage(`/customers/${customerId}/licenses/current`, pageNo, pageSize, cancelToken);
}

export function getCustomerLicensesExpired(
  customerId: number,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<PageResults<CustomerLicense>> {
  return getPage(`/customers/${customerId}/licenses/expired`, pageNo, pageSize, cancelToken);
}

export function getCustomerOrdersRecent(customerId: number, cancelToken?: CancelToken): Promise<AxiosResponse<CustomerOrder[]>> {
  return api.get<CustomerOrder[]>(`/customers/${customerId}/orders/recent`, {cancelToken});
}

export function getCustomerOrders(
  customerId: number,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<PageResults<CustomerOrder>> {
  return getPage(`/customers/${customerId}/orders`, pageNo, pageSize, cancelToken);
}

export function getCustomerSubscriptionsCurrent(
  customerId: number,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<PageResults<CustomerSubscriptionSummary>> {
  return getPage(`/customers/${customerId}/subscriptions/current`, pageNo, pageSize, cancelToken);
}

export function getCustomerSubscriptionsExpired(
  customerId: number,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<PageResults<CustomerSubscriptionSummary>> {
  return getPage(`/customers/${customerId}/subscriptions/expired`, pageNo, pageSize, cancelToken);
}

export function getCustomerSubscriptionsRenewable(
  customerId: number,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<PageResults<CustomerSubscriptionSummary>> {
  return getPage(`/customers/${customerId}/subscriptions/renewable`, pageNo, pageSize, cancelToken);
}

export function getCustomerSubscriptionPools(customerId: number, cancelToken?: CancelToken): Promise<AxiosResponse<SubscriptionPool[]>> {
  return api.get<SubscriptionPool[]>(`/customers/${customerId}/subscriptions/pools`, {cancelToken});
}

export function getCustomerUsers(
  customerId: number,
  includeInactive?: boolean,
  search?: string,
  pageNo?: number,
  pageSize?: number,
  cancelToken?: CancelToken
): Promise<SearchResults<CustomerUserSummary>> {
  return getSearch(`/customers/${customerId}/users`, search, pageNo, pageSize, {includeInactive: includeInactive ?? null}, cancelToken);
}

export function updateCustomerUser(payload: CustomerUserUpdate, cancelToken?: CancelToken): Promise<AxiosResponse> {
  const {customerId, userId, role, isActive} = payload;
  return api.post(`customers/${customerId}/users/${userId}`, {role, isActive}, {cancelToken});
} 
