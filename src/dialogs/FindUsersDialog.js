import React from 'react';
import { getFirestore } from '../helpers/firebase';
import { AuthContext } from '../store/store';

import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import { ClickAwayListener } from '@material-ui/core';

export default class FindUsersDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            userList: [],
        };

        this.anchorRef = React.createRef(null);
    };

    getUsers = () => {

        const currentUser = this.context;

        getFirestore().collection('users')
            .get()
            .then((qs) => {
                const result = []
                qs.forEach(
                    (doc) => {
                        if (currentUser.uid !== doc.id) {
                            result.push({ id: doc.id, ...doc.data() });
                        };
                    }
                )

                this.setState({
                    userList: result
                });
            })
            .catch();
    };

    handleToggle = () => {
        this.setState({
            open: !this.state.open,
        });
    };

    handleClose = (event) => {
        if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
            return;
        }

        this.setState({
            open: false,
        });
    };

    handleSelect = (user) => {

        this.props.onSelectUser(user);

        this.setState({
            open: false,
        });
    };

    componentDidMount() {

        this.getUsers();

    };

    render() {
        return (

            <React.Fragment>
                <IconButton
                    ref={this.anchorRef}
                    aria-controls="menu-list-grow"
                    aria-haspopup="true"
                    onClick={this.handleToggle}>
                    <ShareIcon />
                </IconButton >
                <Popper open={this.state.open} anchorEl={this.anchorRef.current} keepMounted transition>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom ' ? 'center bottom' : 'center top' }}
                        >
                            <Paper id="menu-list-grow">
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {this.state.userList.map((value, index) => {
                                            return (
                                                <MenuItem
                                                    key={value.uid}
                                                    onClick={() => this.handleSelect(value)}>
                                                    {value.displayName}
                                                </MenuItem>
                                            )
                                        })}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </React.Fragment>
        )
    }
}

FindUsersDialog.contextType = AuthContext;