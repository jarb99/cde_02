import { StyleRules } from "@material-ui/core";
import { ToggleButtonClassKey } from "@material-ui/lab";
import paletteOptions, { isSimplePaletteColorOptions } from "../palette";

const MuiToggleButton: Partial<StyleRules<ToggleButtonClassKey>> = {
  root: {
    color: paletteOptions.icon,
    "&:hover": {
      backgroundColor: "rgba(208, 208, 208, 0.20)"
    },
    "&$selected": {
      backgroundColor: "rgba(208, 208, 208, 0.20)",
      color: isSimplePaletteColorOptions(paletteOptions.primary!)
        ? paletteOptions.primary.main
        : paletteOptions.primary![500],
      "&:hover": {
        backgroundColor: "rgba(208, 208, 208, 0.30)"
      }
    },
    "&:first-child": {
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4
    },
    "&:last-child": {
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4
    }
  }
};

export default MuiToggleButton;
