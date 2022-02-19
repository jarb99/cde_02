import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";
import paletteOptions from "../palette";

const MuiIconButton: Partial<StyleRules<
  ComponentNameToClassKey["MuiIconButton"]
>> = {
  root: {
    color: paletteOptions.icon,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.03)"
    }
  }
};

export default MuiIconButton;
