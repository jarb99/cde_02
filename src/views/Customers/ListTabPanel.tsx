import * as React from "react";
import { Card, CardActions, CardContent, CardHeader, Typography } from "@material-ui/core";


const ListTabPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader/>
      <CardContent>
        <Typography align="center" variant="subtitle1">
          Nothing to see here, move along.
        </Typography>
      </CardContent>
      <CardActions/>
    </Card>
  );
};

export default ListTabPanel;