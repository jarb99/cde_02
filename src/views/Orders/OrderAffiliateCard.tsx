import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Switch,
  Theme,
  Typography
} from "@material-ui/core";
import OrderAffiliate from "../../models/OrderAffiliate";
import { formatAud } from "../../formatters/NumberFormatters";

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    card: {},
    header: {},
    content: {
      padding: theme.spacing(0),
      '&:last-child': {
        paddingBottom: 0
      }
    },
    container: {
      padding: theme.spacing(2, 3)
    },
    message: {
      display: 'flex',
      textAlign: 'center',
      justifyContent: 'center'
    },
    details: {
      padding: theme.spacing(1, 3)
    }
  });

const useStyles = makeStyles(styles);

interface OrderAffiliateCardProps {
  affiliate: OrderAffiliate | null;
  applicableValue: number;
}

const OrderAffiliateCard: React.FC<OrderAffiliateCardProps> = (props: OrderAffiliateCardProps) => {
  const classes = useStyles();

  const amount = (props.affiliate?.rate || 0) / 100 * props.applicableValue;

  return (
    <Card className={classes.card}>
      <CardHeader className={classes.header} title={<Typography variant="h4">Affiliate</Typography>} />
      <Divider />
      <CardContent
        className={classes.content}
        style={{ overflow: "hidden" }}>
        <Box className={classes.container}>
          {!props.affiliate && (
            <Typography variant="subtitle1" color="textSecondary" className={classes.message}>
              {"There is no affiliate linked to this order"}
            </Typography>
          )}
          {props.affiliate && (
            <Typography variant="h5">
              {props.affiliate.name}
            </Typography>
          )}
        </Box>
        {props.affiliate && (
          <>
          <Divider />
          <div className={classes.details}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              spacing={0}>
              <Grid item>
                <Typography variant="caption">
                  Code
                </Typography>
                <Typography variant="h6" style={{fontFamily: "monospace", textAlign: "left"}}>
                  {props.affiliate.code}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" style={{textAlign: "right"}}>
                  Rate
                </Typography>
                <Typography variant="h6" style={{textAlign: "right"}}>
                  {`${props.affiliate.rate}%`}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" style={{textAlign: "right"}}>
                  Amount
                </Typography>
                <Typography variant="h6" style={{textAlign: "right"}}>
                  {formatAud(amount)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{textAlign: "right"}}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center">
                    <Grid item>
                      <Switch checked={props.affiliate.isPaid} />
                    </Grid>
                    <Grid item>Paid</Grid>
                  </Grid>
                </Typography>
              </Grid>
            </Grid>
          </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderAffiliateCard;