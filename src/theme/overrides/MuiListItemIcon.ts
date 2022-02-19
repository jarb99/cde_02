import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";
import paletteOptions from "../palette";

const MuiListItemIcon: Partial<StyleRules<
  ComponentNameToClassKey["MuiListItemIcon"]
>> = {
  root: {
    color: paletteOptions.icon,
    minWidth: 32
  }
};

export default MuiListItemIcon;
