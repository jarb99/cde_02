import produce from "immer";
import { Simulate } from "react-dom/test-utils";
import Document from "../../models/Document";

enum SidebarVisibility {
  hidden = "HIDDEN",
  partial = "PARTIAL",
  full = "FULL",
}

enum ActionType {
  loadAllDocuments = "LOAD_ALL_DOCUMENTS",
  updateDocument = "UPDATE_DOCUMENT",
  expandClick = "EXPAND_CLICK",
}

interface Action {
  type: ActionType;
  payload?: any;
}

interface State {
  documents: Document[];
  sidebarVisibility: SidebarVisibility;
}

const initialState = {
  documents: [],
  sidebarVisibility: SidebarVisibility.partial,
};

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  // let intermediateState: State;
  switch (type) {
    case ActionType.loadAllDocuments:
      return {
        ...state,
        documents: payload,
      };
    case ActionType.updateDocument:
      const { document } = payload;
      return produce(state, (draft) => {
        const index = state.documents.findIndex((r) => r.id === document.id);
        draft.documents[index] = document;
        console.log("return produce:");
        console.log("draft.documents[index]", draft.documents[index]);
        console.log("document", document);
      });
    case ActionType.expandClick:
      switch (state.sidebarVisibility) {
        case SidebarVisibility.full:
          return {
            ...state,
            sidebarVisibility: SidebarVisibility.partial,
          };
        case SidebarVisibility.partial:
          return {
            ...state,
            sidebarVisibility: SidebarVisibility.full,
          };
        default:
          return state;
      }
    default:
      return state;
  }
};

export { reducer, initialState, ActionType, SidebarVisibility };
export type { State };
