import { CancelToken } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import { SearchResults } from "../api/API";
import PagingUtils from "./PagingUtils";
import SearchUtils from "./SearchUtils";
import useDebounce from "./Debounce";
import useApiSearch, { SearchState } from "../api/ApiSearch";

const onlyTrue = (): boolean => true;

const useUrlSearch = <TItem>(
  fetch: (search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => Promise<SearchResults<TItem>>,
  shouldExecute: () => boolean = onlyTrue,
  defaultPageSize: number = 10
): [SearchState<TItem>, () => void, string, (searchTerm: string) => void, (newPageSize: number) => void] => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const querySearchTerm = SearchUtils.getSearch(params) || "";
  const queryPageNo = PagingUtils.getPageNo(params);
  const queryPageSize = PagingUtils.getPageSize(params, defaultPageSize);

  const [searchTerm, setSearchTerm] = useState(querySearchTerm);
  const [debouncedSearchTerm, resetSearchTerm] = useDebounce(searchTerm, 300);

  const [fetchState, refetch] = useApiSearch<TItem>(fetch, querySearchTerm, queryPageNo, queryPageSize, shouldExecute);

  const getUrl = (search: string | null | undefined, pageNo: number, pageSize: number): string => {
    const query = new URLSearchParams(location.search);

    SearchUtils.setSearch(query, search);

    if (pageNo !== 1) {
      PagingUtils.setPageNo(query, pageNo);
    } else {
      PagingUtils.deletePageNo(query);
    }

    if (pageSize !== 10) {
      PagingUtils.setPageSize(query, pageSize);
    } else {
      PagingUtils.deletePageSize(query);
    }

    return location.pathname + "?" + query.toString();
  };

  const history = useHistory();

  const handleChangePageSize = (newPageSize: number) => {
    const newPageNo = Math.floor(((fetchState.pageNo - 1) * fetchState.pageSize) / newPageSize) + 1;
    history.push(getUrl(querySearchTerm, newPageNo, newPageSize));
  };

  useEffect(() => {
    setSearchTerm(querySearchTerm);
    resetSearchTerm(querySearchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== querySearchTerm) {
      history.push(getUrl(debouncedSearchTerm, 1, fetchState.pageSize))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return [fetchState, refetch, searchTerm, setSearchTerm, handleChangePageSize];
}

export default useUrlSearch;