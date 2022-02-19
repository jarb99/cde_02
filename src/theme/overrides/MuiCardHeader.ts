import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiCardHeader: Partial<StyleRules<
  ComponentNameToClassKey["MuiCardHeader"]
>> = {
  root: {
    padding: "16px 24px"
  }
};

export default MuiCardHeader;
