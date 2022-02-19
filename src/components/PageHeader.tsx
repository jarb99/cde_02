import React, { CSSProperties } from "react";
import { Box, Typography } from "@material-ui/core";

interface PageHeaderProps {
  title: string;
  style?: CSSProperties;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" style={props.style}>
      <Box>
        <Typography component="h1" variant="h3">
          {props.title}
        </Typography>
      </Box>
      <Box flexGrow={1}>
        {props.children}
      </Box>
    </Box>
  );
};

export default PageHeader;