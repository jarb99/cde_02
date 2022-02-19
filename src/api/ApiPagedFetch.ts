import axios, { AxiosError, CancelToken } from "axios";
import { useCallback, useEffect, useReducer, useState } from "react";
import { PageResults } from "./API";

enum ActionType {
  Fetching = "FETCHING",
  Fetched = "FETCHED",
  FetchFailed = "FETCH_FAILED",
  FetchCleanedUp = "FETCH_CLEANED_UP"
}

interface Action<TItem> {
  type: ActionType;
  payload: Partial<PagedFetchState<TItem>>;
}

const fetching = <TItem>(pageNo: number, pageSize: number): Action<TItem> => {
  return {
    type: ActionType.Fetching,
    payload: {
      fetchParams: {
        pageNo: pageNo,
        pageSize: pageSize
      }
    }
  }
};

const fetched = <TItem>(fetchDetails: { pageNo: number, pageSize: number, pageCount: number, totalItemCount: number, items: TItem[] }): Action<TItem> => {
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

export interface PagedFetchState<TItem> {
  pageNo: number;
  pageSize: number;
  pageCount: number;
  totalItemCount: number;
  isFetching: boolean;
  fetchParams: {
    pageNo: number,
    pageSize: number
  } | null,
  items: TItem[];
  isComplete: boolean;
  isCancelled: boolean;
  hasErrored: boolean;
  hasErroredWithNotFound: boolean;
  error: AxiosError<TItem[]> | null;
}

const getInitialState = <TItem>(pageNo: number, pageSize: number): PagedFetchState<TItem> => {
  return {
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

const reducer = <TItem>(state: PagedFetchState<TItem>, action: Action<TItem>): PagedFetchState<TItem> => {
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
        hasErroredWithNotFound: action.payload?.error?.response?.status === 404 || false
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

const useApiPagedFetch = <TItem>(
  fetch: (pageNo?: number, pageSize?: number, cancelToken?: CancelToken) => Promise<PageResults<TItem>>,
  pageNo: number,
  pageSize: number,
  shouldExecute: () => boolean = onlyTrue
): [PagedFetchState<TItem>, () => void] => {
  
  const [refetchTime, setRefetchTime] = useState(0);
  const [state, dispatch] = useReducer(reducer, getInitialState(pageNo, pageSize));
 
  useEffect(() => {
    if (!shouldExecute()) {
      return;
    }

    let active = true;
    let tokenSource = axios.CancelToken.source();

    dispatch(fetching(pageNo, pageSize));

    const fetchItems = () => {
      fetch(pageNo, pageSize, tokenSource.token).then(response => {
        if (active) {
          dispatch(fetched({
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
  }, [fetch, shouldExecute, pageNo, pageSize, refetchTime]);

  const refetch = useCallback(() => {
    setRefetchTime(Date.now());
  }, [setRefetchTime]);

  return [state as PagedFetchState<TItem>, refetch]
};

export default useApiPagedFetch;