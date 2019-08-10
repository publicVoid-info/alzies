import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        position: 'fixed',
        bottom: 0,
        right: theme.spacing(2),
    },
}));

export default function FloatingActionButton({ onClick }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Fab color="primary" aria-label="add" className={classes.fab} onClick={(onClick) ? onClick() : null}>
                <AddIcon />
            </Fab>
        </React.Fragment>
    );
}
