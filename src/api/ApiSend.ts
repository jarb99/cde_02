import axios, { AxiosError, AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import { useCallback, useEffect, useReducer, useState } from "react";

enum ActionType {
  Queue      = "QUEUE",
  Executing  = "EXECUTING",
  Completed  = "COMPLETED",
  Cancelling = "CANCELLING",
  Cancelled  = "CANCELLED",
  Failed     = "FAILED",
  CleanedUp  = "CLEANED_UP",
}

interface Action<TPayload, TResponse extends any> {
  type: ActionType;
  payload?: Partial<State<TPayload, TResponse>>;
}

const queue = <TPayload, TResponse extends any>(payload: TPayload): Action<TPayload, TResponse> => {
  return {
    type: ActionType.Queue,
    payload: {
      payload: payload,
    }
  }
}

const executing = <TPayload, TResponse extends any>(): Action<TPayload, TResponse> => {
  return {
    type: ActionType.Executing,
  }
}

const completed = <TPayload, TResponse extends any>(response?: TResponse): Action<TPayload, TResponse> => {
  return {
    type: ActionType.Completed,
    payload: {
      response: response,
    }
  }
}

const cancelling = <TPayload, TResponse extends any>(): Action<TPayload, TResponse> => {
  return {
    type: ActionType.Cancelling,
  }
}

const cancelled = <TPayload, TResponse extends any>(): Action<TPayload, TResponse> => {
  return {
    type: ActionType.Cancelled,
  }
}

const failed = <TPayload, TResponse extends any>(error: AxiosError): Action<TPayload, TResponse> => {
  return {
    type: ActionType.Failed,
    payload: {
      error: error,
    }
  }
}

const cleanedUp = <TPayload, TResponse extends any>(): Action<TPayload, TResponse> => {
  return {
    type: ActionType.CleanedUp,
  }
}

export enum SendStatus {
  None       = "None",
  Queued     = "Queued",
  Executing  = "Executing",
  Completed  = "Completed",
  Cancelling = "Cancelling",
  Cancelled  = "Cancelled",
  Failed     = "Failed",
  CleanedUp  = "CleanedUp",
}

interface State<TPayload, TResponse extends any> {
  status: SendStatus,
  payload: TPayload | null;
  response: TResponse | null;
  error: AxiosError | null;
}

const getInitialState = <TPayload, TResponse extends any>(): State<TPayload, TResponse> => {
  return {
    status: SendStatus.None,
    payload: null,
    response: null,
    error: null,
  };
}

const reducer = <TPayload, TResponse extends any>(state: State<TPayload, TResponse>, action: Action<TPayload, TResponse>): State<TPayload, TResponse> => {
  switch (action.type) {
    case ActionType.Queue:
      return {
        ...state,
        ...action.payload,
        status: SendStatus.Queued,
        error: null,
      };

    case ActionType.Executing:
      return {
        ...state,
        ...action.payload,
        status: SendStatus.Executing,
      };

    case ActionType.Completed:
      return {
        ...state,
        ...action.payload,
        status: SendStatus.Completed,
      };
    
    case ActionType.Cancelling:
      return {
        ...state,
        ...action.payload,
        status: SendStatus.Cancelling,
      };
    
    case ActionType.Cancelled:
      return {
        ...state,
        ...action.payload,
        status: SendStatus.Cancelled,
      };

    case ActionType.Failed:
      return {
        ...state,
        ...action.payload,
        status: SendStatus.Failed,
      };

    case ActionType.CleanedUp:
      return {
        ...state,
        ...action.payload,
        status: SendStatus.CleanedUp,
      };

    default:
      return state;
  }
}

const useApiSend = <TPayload, TResponse extends any>(
  send: (payload: TPayload, cancelToken?: CancelToken) => Promise<AxiosResponse<TResponse>>
): [State<TPayload, TResponse>, (payload: TPayload) => void, () => void] => {
  
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const [tokenSource, setTokenSource] = useState<CancelTokenSource>();

  useEffect(() => {
    if (!state.payload) {
      return;
    }

    let active = true;
    let tokenSource = axios.CancelToken.source();
    setTokenSource(tokenSource);
    
    dispatch(executing());

    const sendPayload = () => {
      send(state.payload as TPayload, tokenSource.token).then(response => {
        if (active) {
          dispatch(completed(response.data));
        }
      }).catch(error => {
        if (active) {
          if (axios.isCancel(error)) {
            dispatch(cancelled());
          } else {
            dispatch(failed(error));
          }
        }
      });
    };

    sendPayload();

    return () => {
      active = false;
      dispatch(cleanedUp());
      tokenSource.cancel();
    };
  }, [send, state.payload]);

  const execute = useCallback((payload: TPayload) => {
    dispatch(queue(payload));
  }, [dispatch]);

  const cancel = useCallback(() => {
    if (state.status === SendStatus.Executing) {
      dispatch(cancelling());
      if (tokenSource) {
        tokenSource.cancel();
      }
    }
  }, [state.status, dispatch, tokenSource]);

  return [state as State<TPayload, TResponse>, execute, cancel];
}

export default useApiSend;