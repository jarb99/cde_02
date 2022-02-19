import { useCallback, useEffect, useState } from "react";
import * as _ from "lodash";

const useDelayedState = <T>(initialState: T, delay: number): [T, (state: T, immediate?: boolean) => void] => {
  const [state, setState] = useState<T>(initialState);
  const [nextState, setNextState] = useState<{ state: T, immediate: boolean }>({state: initialState, immediate: false});

  useEffect(() => {
      if (_.isEqual(state, nextState.state)) {
        return;
      }

      if (nextState.immediate) {
        setState(nextState.state);
      } else {
        const handler = setTimeout(() => {
          setState(nextState.state);
        }, delay);

        return () => {
          clearTimeout(handler);
        };
      }
    }
    , [state, setState, nextState, delay]
  );

  const setNext = useCallback((state: T, immediate: boolean = false) => {
    setNextState({state, immediate});
  }, [setNextState]);

  return [state, setNext];
};

export default useDelayedState;