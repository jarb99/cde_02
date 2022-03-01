interface State {
    documents: any[];
  }
  
  enum ActionType {
    loadAllDocuments = "LOAD_ALL_DOCUMENTS"
  }
  
  interface Action {
    type: ActionType;
    payload: any;
  }
  
  const globalReducer = (state: State, action: Action): State => {
    const { type, payload } = action;
    // let intermediateState: State;
    switch (type) {
      case ActionType.loadAllDocuments:
        return {
          ...state,
          documents: payload
        };
      default:
        return state;
    }
  };
  
  const initialState = {
    documents: []
  };
  
  // const withDataChange = (state: State, change: Partial<DataFields>) => ({
  //   ...state,
  //   data: {
  //     ...state.data,
  //     ...change
  //   }
  // });
  
  export { globalReducer, initialState, ActionType };
  