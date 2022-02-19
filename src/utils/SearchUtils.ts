import { SearchParams } from "../api/API";
import PagingUtils from "./PagingUtils";
import URLQueryUtils from "./URLQueryUtils";

export default class SearchUtils {
  static deleteSearch(params: URLSearchParams) {
    params.delete(SearchParams.SEARCH_TERM);
  }

  static getSearch(params: URLSearchParams): string | null {
    return params.get(SearchParams.SEARCH_TERM);
  }

  static getSearchUrlQuery(searchTerm?: string, pageNo?: number, pageSize?: number, defaultPageSize?: number): string | undefined {
    return URLQueryUtils.getQuery(this.getSearchUrlQueryParams(searchTerm, pageNo, pageSize, defaultPageSize));
  }

  static getSearchUrlQueryParams(searchTerm?: string, pageNo?: number, pageSize?: number, defaultPageSize?: number): { [key: string]: string } {
    let params: { [key: string]: string } = {};

    if ((searchTerm || "") !== "") {
      params[SearchParams.SEARCH_TERM] = searchTerm!;
    }

    params = {
      ...params,
      ...PagingUtils.getPageUrlQueryParams(pageNo, pageSize, defaultPageSize),
    };
    
    return params;
  }

  static hasSearch(params: URLSearchParams): boolean {
    return params.has(SearchParams.SEARCH_TERM);
  }

  static setSearch(params: URLSearchParams, value: string | null | undefined) {
    if (value && value?.length > 0) {
      params.set(SearchParams.SEARCH_TERM, value);
    } else {
      this.deleteSearch(params);
    }
  }
}