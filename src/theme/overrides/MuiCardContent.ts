import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiCardContent: Partial<StyleRules<
  ComponentNameToClassKey["MuiCardContent"]
>> = {
  root: {
    padding: 24
  }
};

export default MuiCardContent;
