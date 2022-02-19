import URLQueryUtils from "./URLQueryUtils";
import { PagingParams } from "../api/API";

export default class PagingUtils {
  static calculateNewPageNo(pageNo: number, pageSize: number, newPageSize: number): number {
    return Math.floor(((pageNo - 1) * pageSize) / newPageSize) + 1;
  }
  
  static deletePageNo(params: URLSearchParams) {
    params.delete(PagingParams.PAGE_NO);
  }

  static hasPageNo(params: URLSearchParams): boolean {
    return params.has(PagingParams.PAGE_NO);
  }

  static getPageNo(params: URLSearchParams): number {
    return URLQueryUtils.getInt(PagingParams.PAGE_NO, params, 1)!;
  }

  static setPageNo(params: URLSearchParams, value: number | undefined) {
    if (value) {
      params.set(PagingParams.PAGE_NO, value.toString());
    } else {
      this.deletePageNo(params);
    }
  }

  static deletePageSize(params: URLSearchParams) {
    params.delete(PagingParams.PAGE_SIZE);
  }

  static hasPageSize(params: URLSearchParams): boolean {
    return params.has(PagingParams.PAGE_SIZE);
  }

  static getPageSize(
    params: URLSearchParams,
    defaultValue: number = 10,
    min: number = 1,
    max: number = 100
  ): number {
    return URLQueryUtils.getInt(
      PagingParams.PAGE_SIZE,
      params,
      defaultValue,
      value => value >= min && value <= max
    )!;
  }

  static setPageSize(params: URLSearchParams, value: number | undefined) {
    if (value) {
      params.set(PagingParams.PAGE_SIZE, value.toString());
    } else {
      this.deletePageSize(params);
    }
  }

  static getPageUrlQuery(pageNo?: number, pageSize?: number, defaultPageSize?: number): string | undefined {
    return URLQueryUtils.getQuery(this.getPageUrlQueryParams(pageNo, pageSize, defaultPageSize));
  }

  static getPageUrlQueryParams(pageNo?: number, pageSize?: number, defaultPageSize?: number): { [key: string]: string } {
    let params: { [key: string]: string } = {};

    if (pageNo && pageNo !== 1) {
      params[PagingParams.PAGE_NO] = pageNo.toString();
    }

    if (pageSize && (!defaultPageSize || pageSize !== defaultPageSize)) {
      params[PagingParams.PAGE_SIZE] = pageSize.toString();
    }

    return params;
  }
}
