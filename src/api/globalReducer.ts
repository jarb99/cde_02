import produce from 'immer';
import Document from '../models/Document';

interface State {
  documents: Document[];
}

enum ActionType {
  loadAllDocuments = "LOAD_ALL_DOCUMENTS",
  updateDocument = "UPDATE_DOCUMENT"
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
    case ActionType.updateDocument:
      const { document } = payload;
      return produce(state, draft => {
        const index = state.documents.findIndex(r => r.id === document.id)
        draft.documents[index] = document
      })
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
export type { State };
