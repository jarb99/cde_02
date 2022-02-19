import { StyleRules, colors } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiChip: Partial<StyleRules<ComponentNameToClassKey["MuiChip"]>> = {
  root: {
    backgroundColor: colors.blueGrey[50],
    color: colors.blueGrey[900]
  },
  deletable: {
    "&:focus": {
      backgroundColor: colors.blueGrey[100]
    }
  }
};

export default MuiChip;
