import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import {
    setActiveTable,
    toggleDrawer
} from '../store/actions';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
// import BookmarksIcon from '@material-ui/icons/Bookmarks';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawerHeader: {
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        justifyContent: 'flex-end',
    },
    drawerPaper: {
        width: drawerWidth,
        position: 'fixed',
        zIndex: '2',
    },
}));

function DrawerMenu(props) {
    const classes = useStyles();

    const handleClickMenu = () => {
        props.toggleDrawer(!props.drawer.open);
    }

    const handleClickCard = () => {
        props.setActiveTable('card');
    }

    const handleClickTrash = () => {
        props.setActiveTable('trash');
    }

    return (
        <Drawer
            classes={{ paper: classes.drawerPaper }}
            onBackdropClick={handleClickMenu}
            open={props.open}
            variant="temporary"
            anchor="left"
            role="presentation"
        >
            <List>
                <ListItem className={classes.drawerHeader}
                    button key={"Menu"}
                    onClick={handleClickMenu}>
                    <IconButton>
                        <ChevronLeftIcon />
                    </IconButton>
                </ListItem>
                <Divider />
                <ListItem button key={"Cards"} onClick={handleClickCard}>
                    <ListItemIcon><SpeakerNotesIcon /></ListItemIcon>
                    <ListItemText primary={"Cards"} />
                </ListItem>
                {/* <Divider />
                <ListItem button key={"Tags"}>
                    <ListItemIcon><BookmarksIcon /></ListItemIcon>
                    <ListItemText primary={"Tags"} />
                </ListItem> */}
                <Divider />
                <ListItem button key={"Trash"} onClick={handleClickTrash}>
                    <ListItemIcon><DeleteIcon /></ListItemIcon>
                    <ListItemText primary={"Trash"} />
                </ListItem>
            </List>
        </Drawer>
    );
}

const mapStateToProps = (state) => {
    const storeState = state;
    return storeState;
}

export default connect(mapStateToProps, { setActiveTable, toggleDrawer })(DrawerMenu);