import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";
import paletteOptions from "../palette";

const MuiInputBase: Partial<StyleRules<
  ComponentNameToClassKey["MuiInputBase"]
>> = {
  root: {},
  input: {
    "&::placeholder": {
      opacity: 1,
      color: paletteOptions.text!.secondary
    }
  }
};

export default MuiInputBase;
