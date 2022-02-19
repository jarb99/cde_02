import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  makeStyles,
  Switch,
  Theme,
  Typography
} from "@material-ui/core";
import ResellerSummary from "../../models/ResellerSummary";
import FadeTransition from "../../components/FadeTransition";
import ResellerLink from "../Resellers/ResellerLink";

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

interface OrderResellerCardProps {
  reseller: ResellerSummary | null;
  active: boolean;
  showToggle: boolean;
  canToggle: boolean;
  toggleActive: () => void;
}

const OrderResellerCard: React.FC<OrderResellerCardProps> = ({reseller, active, showToggle, canToggle, toggleActive}: OrderResellerCardProps) => {
  const classes = useStyles();
  const location = `${reseller?.city || reseller?.state || ""}${(reseller?.city || reseller?.state) && reseller?.country?.name ? ", " : ""}${reseller?.country?.name || ""}`;
  
  const handleToggle = () => {
    if (canToggle) {
      toggleActive();
    }
  }

  const action = (
    <Switch checked={active} onClick={handleToggle} color="primary" size="small"/>
  );

  return (
    <Card className={classes.card}>
      <CardHeader className={classes.header} title={<Typography variant="h4">Reseller</Typography>} action={showToggle ? action : null}/>
      <Divider/>
      <CardContent
        className={classes.content}
        style={{overflow: "hidden"}}>
        <FadeTransition in={active} fadedOpacity={0.5}>
          <Box className={classes.container}>
            {!reseller && (
              <Typography variant="subtitle1" color="textSecondary" className={classes.message}>
                {"There is no reseller linked to this order"}
              </Typography>
            )}
            {reseller && (
              <Typography variant="h5" color="textPrimary">
                <ResellerLink customerId={reseller.id}>
                  {reseller.name}
                </ResellerLink>
              </Typography>
            )}
            {location &&
            <Typography
              variant="body1"
              color="textPrimary">
              {location}
            </Typography>
            }
          </Box>
        </FadeTransition>
      </CardContent>
    </Card>
  );
};

export default OrderResellerCard;