import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import AlarmIcon from '@material-ui/icons/Alarm';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import WorkIcon from '@material-ui/icons/Work';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    drawerPaper: {
        top: '64px',
        width: drawerWidth,
        position: 'absolute',
        zIndex: '2',
    },
}));

export default function DrawerMenu(props) {
    const classes = useStyles();

    return (

        <Drawer
            variant="persistent"
            anchor="left"
            open={props.open}
            classes={{ paper: classes.drawerPaper }}
            role="presentation"
        >
            <Divider />
            <List>
                <ListItem button key={"Cards"}>
                    <ListItemIcon><SpeakerNotesIcon /></ListItemIcon>
                    <ListItemText primary={"Cards"} />
                </ListItem>
                <ListItem button key={"Reminders"}>
                    <ListItemIcon><AlarmIcon /></ListItemIcon>
                    <ListItemText primary={"Reminders"} />
                </ListItem>
                <Divider />
                <ListItem button key={"Tags"}>
                    <ListItemIcon><BookmarksIcon /></ListItemIcon>
                    <ListItemText primary={"Tags"} />
                </ListItem>
                <Divider />
                <ListItem button key={"Arquive"}>
                    <ListItemIcon><WorkIcon /></ListItemIcon>
                    <ListItemText primary={"Arquive"} />
                </ListItem>
                <ListItem button key={"Trash"}>
                    <ListItemIcon><DeleteForeverIcon /></ListItemIcon>
                    <ListItemText primary={"Trash"} />
                </ListItem>
            </List>
        </Drawer>
    );
}