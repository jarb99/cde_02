import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";
import paletteOptions from "../palette";

const MuiTableRow: Partial<StyleRules<
  ComponentNameToClassKey["MuiTableRow"]
>> = {
  root: {
    "&$selected": {
      backgroundColor: paletteOptions.background!.default
    },
    "&$hover": {
      "&:hover": {
        backgroundColor: paletteOptions.background!.default
      }
    }
  }
};

export default MuiTableRow;
