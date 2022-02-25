import axios, { AxiosError, AxiosResponse, CancelToken } from "axios";
import { useCallback, useEffect, useReducer, useState } from "react";


enum ActionType {
  Fetching = "FETCHING",
  Fetched = "FETCHED",
  FetchFailed = "FETCH_FAILED",
  FetchCleanedUp = "FETCH_CLEANED_UP"
}

interface Action<TData> {
  type: ActionType;
  payload?: Partial<State<TData>>;
}

const fetching = <TData>(): Action<TData> => {
  return {
    type: ActionType.Fetching
  }
};

const fetched = <TData>(item: TData): Action<TData> => {
  return {
    type: ActionType.Fetched,
    payload: {
      data: item
    }
  }
};

const fetchFailed = <TData>(error: AxiosError<TData>): Action<TData> => {
  return {
    type: ActionType.FetchFailed,
    payload: {
      error: error
    }
  }
};

const fetchCleanedUp = <TData>(): Action<TData> => {
  return {
    type: ActionType.FetchCleanedUp
  }
};

interface State<TData> {
  isFetching: boolean;
  isComplete: boolean;
  data: TData | null;
  isCancelled: boolean;
  hasErrored: boolean;
  hasErroredWithNotFound: boolean;
  error: AxiosError<TData> | null;
}

const getInitialState = <TData>(): State<TData> => {
  return {
    isFetching: false,
    isComplete: false,
    data: null,
    isCancelled: false,
    hasErrored: false,
    hasErroredWithNotFound: false,
    error: null
  };
};

const reducer = <TData>(state: State<TData>, action: Action<TData>): State<TData> => {
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
        isComplete: true
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
        isCancelled: state.isFetching
      };
      
    default:
      return state;
  }
};

const onlyTrue = (): boolean => true;

const useApiFetch = <TData>(
  fetch: (cancelToken?: CancelToken) => Promise<AxiosResponse<TData>>,
  shouldExecute: () => boolean = onlyTrue
): [State<TData>, () => void] => {
  
  const [refetchTime, setRefetchTime] = useState(0);
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    if (!shouldExecute()) {
      return;
    }

    let active = true;
    let tokenSource = axios.CancelToken.source();
    
    dispatch(fetching());

    const fetchData = () => {

      fetch(tokenSource.token).then(response => {
        if (active) {
          dispatch(fetched(response.data));
        }
      }).catch(error => {
        if (active) {
          dispatch(fetchFailed(error));
        }
      });
    };

    fetchData();

    return () => {
      active = false;
      dispatch(fetchCleanedUp());
      tokenSource.cancel();
    };
  }, [fetch, shouldExecute, refetchTime]);

  const refetch = useCallback(() => {
    setRefetchTime(Date.now());
  }, [setRefetchTime]);

  return [state as State<TData>, refetch]
};

export default useApiFetch;
