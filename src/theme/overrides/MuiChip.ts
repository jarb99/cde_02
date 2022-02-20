import { StyleRules, colors } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiChip: Partial<StyleRules<ComponentNameToClassKey["MuiChip"]>> = {
  root: {
    backgroundColor: colors.grey[500],
    color: '#ffffff', //colors.lightBlue[50],
    fontSize: "11px",
    // height: 'auto',
    // padding: '1px',
  },
  deletable: {
    "&:focus": {
      backgroundColor: colors.blueGrey[100],
      // fontSize: "10px",

    }
  }
};

export default MuiChip;
