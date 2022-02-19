import { StyleRules, colors } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiLinearProgress: Partial<StyleRules<
  ComponentNameToClassKey["MuiLinearProgress"]
>> = {
  root: {
    borderRadius: 3,
    overflow: "hidden"
  },
  colorPrimary: {
    backgroundColor: colors.blueGrey[50]
  }
};

export default MuiLinearProgress;
