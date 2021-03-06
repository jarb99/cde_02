import axios, { AxiosResponse, CancelToken } from "axios";
import Configuration from "../configuration/configuration";
import dateValueResponseTransform from "./transforms/DateValueResponseTransform";
import "./mockDB"; // MOCK DATABASE

import IWorkflow from "../models/Workflow";
import SaveWorkflow from "../models/SaveWorkflow";
import SaveDocument from "../models/SaveDocument";
import Document from "../models/Document";

const api = axios.create({
  baseURL: "/api/",
  responseType: "json",
  transformResponse: dateValueResponseTransform
});




export async function getConfiguration(
  cancelToken?: CancelToken
): Promise<AxiosResponse<Configuration>> {
  // console.log("get configuration");
  return api.get<Configuration>("configuration", { cancelToken });
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
  const response = await api.get<Array<T>>(url, { params, cancelToken });
  return getPageResults(response);
}

// export function getWorkflows(
//   workflowId: number,
//   cancelToken?: CancelToken,
//   pageNo?: number,
//   pageSize?: number,
// ): Promise<PageResults<IWorkflow>> {
//   return getPage(`/workflows/${workflowId}`, pageNo, pageSize, cancelToken);
// }

export function getWorkflowLatest(
  workflowId: string,
  cancelToken?: CancelToken
): Promise<AxiosResponse<IWorkflow>> {
  console.log("doing workflow api call, ID:", workflowId);
  return api.get<IWorkflow>(`/workflows/latest/${workflowId}`, { cancelToken });
}

export function saveWorkflow(
  payload: SaveWorkflow,
  cancelToken?: CancelToken
): Promise<AxiosResponse> {
  const { workflowId, flow } = payload;
  return api.post(
    `workflows/save`,
    {
      workflowId: workflowId,
      flow: JSON.stringify(flow)
    },
    { cancelToken }
  );
}

export function getAllDocuments(
  getAll: boolean,
  cancelToken?: CancelToken
): Promise<AxiosResponse<Document[]>> {
  return api.get<Document[]>(`/documents`, { cancelToken });
}

export function updateDocument<TData>(
  payload: SaveDocument<TData>,
  cancelToken?: CancelToken
): Promise<AxiosResponse> {
  console.log();
  return api.post(
    `/updateDocument`, payload, { cancelToken }
  );
}

