import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiPaper: Partial<StyleRules<ComponentNameToClassKey["MuiPaper"]>> = {
  root: {},
  elevation1: {
    boxShadow: "0 0 0 1px rgba(63,63,68,0.05), 0 1px 3px 0 rgba(63,63,68,0.15)"
  }
};

export default MuiPaper;
