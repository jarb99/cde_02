import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiCardActions: Partial<StyleRules<
  ComponentNameToClassKey["MuiCardActions"]
>> = {
  root: {
    padding: "16px 24px"
  }
};

export default MuiCardActions;
