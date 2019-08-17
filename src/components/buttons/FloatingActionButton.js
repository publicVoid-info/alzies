import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Fab from '@material-ui/core/Fab'

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        position: 'fixed',
        bottom: 0,
        right: theme.spacing(2),
    },
}));

export default function FloatingActionButton(props) {

    const classes = useStyles()

    return (
        <React.Fragment>
            <Fab
                className={classes.fab}
                color={props.color}
                aria-label={props.label}
                onClick={(props.onClick) ? props.onClick() : null}>
                {props.children}
            </Fab>
        </React.Fragment>
    );
}
