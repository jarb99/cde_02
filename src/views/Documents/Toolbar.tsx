import React from "react";
import {
    Theme,
    createStyles,
    makeStyles,
    Grid,
    Box,
    Chip,
    Typography,
} from "@material-ui/core";

const styles = (theme: Theme) =>
    createStyles({
        root: {},
    });

const useStyles = makeStyles(styles);

interface HeaderProps {
    //   title: string;
}

const Toolbar: React.FC<HeaderProps> = (props: HeaderProps) => {
    const classes = useStyles();

    const handleDelete = (e: React.SyntheticEvent) => {
        console.log(e);
    }

    return (
        <Box
            display="flex"
            flexDirection="row"
            className={classes.root}
            style={{
                height: "50px",
                alignItems: "center",
                padding: "10px",
            }}
        >
            <Grid alignItems="flex-end" container justify="flex-start" spacing={1}>
                <Grid item>
                    <Typography component="h6" variant="h6">
                        Filters:
                    </Typography>
                </Grid>
                <Grid item>
                    <Chip label="Revision..." size="small" onDelete={handleDelete} />
                </Grid>
                <Grid item>
                    <Chip label="Document Number..." size="small" onDelete={handleDelete} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Toolbar;
