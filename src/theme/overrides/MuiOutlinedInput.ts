import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiOutlinedInput: Partial<StyleRules<
  ComponentNameToClassKey["MuiOutlinedInput"]
>> = {
  root: {},
  notchedOutline: {
    borderColor: "rgba(0,0,0,0.15)"
  }
};

export default MuiOutlinedInput;
