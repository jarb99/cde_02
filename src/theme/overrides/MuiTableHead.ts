import { StyleRules, colors } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiTableHead: Partial<StyleRules<
  ComponentNameToClassKey["MuiTableHead"]
>> = {
  root: {
    backgroundColor: colors.grey[50]
  }
};

export default MuiTableHead;
