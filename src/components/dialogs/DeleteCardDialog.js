import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

function DeleteCardDialog(props) {

    const [open, setOpen] = React.useState(false)

    function handleClickOpen() {
        setOpen(true)
    }

    function handleClose(modalResult) {
        setOpen(false)

        if (modalResult) {
            props.handleDelete()
        }
    }

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen} >
                <DeleteIcon />
            </IconButton >
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                disableBackdropClick
                disableEscapeKeyDown
            >
                <DialogTitle id="alert-dialog-title">{"Apagar o Card?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="primary" variant="text" autoFocus>
                        Cancelar
                    </Button>
                    <Button onClick={() => handleClose(true)} color="primary" variant="text" >
                        Continuar
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default DeleteCardDialog