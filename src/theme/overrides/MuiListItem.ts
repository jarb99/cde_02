import { StyleRules } from "@material-ui/core";
import { ComponentNameToClassKey } from "@material-ui/core/styles/overrides";

const MuiListItem: Partial<StyleRules<
  ComponentNameToClassKey["MuiListItem"]
>> = {
  button: {
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)"
    }
  }
};

export default MuiListItem;
