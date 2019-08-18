import React, { useEffect } from 'react'
import { getFirestore, getFirebaseAuth } from '../../firebaseManager'

import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ShareIcon from '@material-ui/icons/Share'
import IconButton from '@material-ui/core/IconButton'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

export default function FindUsersDialog(props) {

    const [open, setOpen] = React.useState(false)
    const [userList, setUserList] = React.useState([])
    const anchorRef = React.useRef(null)

    const getUsers = () => {

        getFirestore().collection('users')
            .get()
            .then((qs) => {
                const result = []
                qs.forEach(
                    (doc) => {
                        if (getFirebaseAuth().currentUser.uid !== doc.id) {
                            result.push({ id: doc.id, ...doc.data() })
                        }
                    }
                )

                setUserList(() => result)
            })
    }

    function handleToggle() {
        setOpen(prevOpen => !prevOpen)
    }

    function handleClose(event) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    }

    useEffect(() => {
        getUsers()

    }, [userList])

    return (

        <React.Fragment>
            <IconButton
                ref={anchorRef}
                aria-controls="menu-list-grow"
                aria-haspopup="true"
                onClick={handleToggle}>
                <ShareIcon />
            </IconButton >
            <Popper open={open} anchorEl={anchorRef.current} keepMounted transition>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom ' ? 'center bottom' : 'center top' }}
                    >
                        <Paper id="menu-list-grow">
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    {userList.map((value, index) => {
                                        return <MenuItem key={index} onClick={handleClose}>{value.displayName}</MenuItem>
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
