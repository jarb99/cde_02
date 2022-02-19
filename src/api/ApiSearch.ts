import axios, { AxiosError, CancelToken } from "axios";
import { useCallback, useEffect, useReducer, useState } from "react";
import { SearchResults } from "./API";

enum ActionType {
  Fetching = "FETCHING",
  Fetched = "FETCHED",
  FetchFailed = "FETCH_FAILED",
  FetchCleanedUp = "FETCH_CLEANED_UP"
}

interface Action<TItem> {
  type: ActionType;
  payload: Partial<SearchState<TItem>>;
}

const fetching = <TItem>(searchTerm: string | undefined, pageNo: number, pageSize: number): Action<TItem> => {
  return {
    type: ActionType.Fetching,
    payload: {
      fetchParams: {
        searchTerm: searchTerm,
        pageNo: pageNo,
        pageSize: pageSize
      }
    }
  }
};

const fetched = <TItem>(fetchDetails: { searchTerm: string | undefined, pageNo: number, pageSize: number, pageCount: number, totalItemCount: number, items: TItem[] }): Action<TItem> => {
  return {
    type: ActionType.Fetched,
    payload: {
      ...fetchDetails
    }
  }
};

const fetchFailed = <TItem>(error: AxiosError<TItem[]>): Action<TItem> => {
  return {
    type: ActionType.FetchFailed,
    payload: {
      error: error
    }
  }
};

const fetchCleanedUp = <TItem>(): Action<TItem> => {
  return {
    type: ActionType.FetchCleanedUp,
    payload: {}
  }
};

export interface SearchState<TItem> {
  searchTerm: string | undefined;
  pageNo: number;
  pageSize: number;
  pageCount: number;
  totalItemCount: number;
  isFetching: boolean;
  fetchParams: {
    searchTerm: string | undefined,
    pageNo: number,
    pageSize: number,
  } | null,
  items: TItem[];
  isComplete: boolean;
  isCancelled: boolean;
  hasErrored: boolean;
  hasErroredWithNotFound: boolean;
  error: AxiosError<TItem[]> | null;
}

const getInitialState = <TItem>(searchTerm: string | undefined, pageNo: number, pageSize: number): SearchState<TItem> => {
  return {
    searchTerm: searchTerm,
    pageNo: pageNo,
    pageSize: pageSize,
    pageCount: 0,
    totalItemCount: 0,
    isFetching: false,
    fetchParams: null,
    items: [],
    isComplete: false,
    isCancelled: false,
    hasErrored: false,
    hasErroredWithNotFound: false,
    error: null
  };
};

const reducer = <TItem>(state: SearchState<TItem>, action: Action<TItem>): SearchState<TItem> => {
  switch (action.type) {
    case ActionType.Fetching:
      return {
        ...state,
        ...action.payload,
        isFetching: true,
        isComplete: false,
        isCancelled: false,
        hasErrored: false,
        hasErroredWithNotFound: false,
        error: null
      };

    case ActionType.Fetched:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
        fetchParams: null,
        isComplete: true,
      };

    case ActionType.FetchFailed:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
        hasErrored: true,
        hasErroredWithNotFound: action.payload?.error?.response?.status === 404 || false,
        items: []
      };

    case ActionType.FetchCleanedUp:
      return {
        ...state,
        ...action.payload,
        isFetching: false,
        isCancelled: state.isFetching,
        items: state.isFetching ? action.payload.items || [] : state.items
      };

    default:
      return state;
  }
};

const onlyTrue = (): boolean => true;

const useApiSearch = <TItem>(
  fetch: (search?: string, pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => Promise<SearchResults<TItem>>,
  searchTerm: string | undefined,
  pageNo: number,
  pageSize: number,
  shouldExecute: () => boolean = onlyTrue
): [SearchState<TItem>, () => void] => {
  
  const [refetchTime, setRefetchTime] = useState(0);
  const [state, dispatch] = useReducer(reducer, getInitialState(searchTerm, pageNo, pageSize));
 
  useEffect(() => {
    if (!shouldExecute()) {
      return;
    }

    let active = true;
    let tokenSource = axios.CancelToken.source();

    dispatch(fetching(searchTerm, pageNo, pageSize));

    const fetchItems = () => {
      fetch(searchTerm, pageNo, pageSize, tokenSource.token).then(response => {
        if (active) {
          dispatch(fetched({
            searchTerm: response.searchTerm,
            pageNo: response.pageNo,
            pageSize: response.pageSize,
            pageCount: response.pageCount,
            totalItemCount: response.totalItemCount,
            items: response.items
          }));
        }
      }).catch(error => {
        if (active) {
          dispatch(fetchFailed(error));
        }
      });
    };

    fetchItems();

    return () => {
      active = false;
      dispatch(fetchCleanedUp());
      tokenSource.cancel();
    };
  }, [fetch, shouldExecute, searchTerm, pageNo, pageSize, refetchTime]);

  const refetch = useCallback(() => {
    setRefetchTime(Date.now());
  }, [setRefetchTime]);

  return [state as SearchState<TItem>, refetch]
}

export default useApiSearch;