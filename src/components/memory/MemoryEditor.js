import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getFirestore, getFirebaseAuth } from '../../firebaseManager'
import uuidv4 from 'uuid/v4'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Editor from '../quill/Editor'
import TextField from '@material-ui/core/TextField'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        '& .MuiInput-input': {
            color: theme.palette.text.secondary,
        }
    },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function FullScreenDialog(props) {

    const classes = useStyles();
    const [open, setOpen] = React.useState(true)
    const [memory, setMemory] = React.useState({ owner: [], id: '', headline: '', content: '' })
    const [editorText, setEditorText] = React.useState('')

    const userId = (getFirebaseAuth().currentUser) ? getFirebaseAuth().currentUser.uid : ''

    const getMemory = (id) => {

        const docRef = getFirestore().collection('memories').doc(id)

        docRef.get().then(function (doc) {
            if (doc.exists) {
                setMemory({ id: doc.id, ...doc.data() })
                setEditorText(doc.data().content)
            }
        })
    }

    useEffect(() => {
        if (!props.match.params.id !== 'add') {
            getMemory(props.match.params.id)
        }
    }, [props.match.params.id])

    const handleChange = name => event => {

        setMemory({ ...memory, [name]: event.target.value })
    }

    const handleChangeEditor = () => text => {
        setEditorText(text)
        setMemory({ ...memory, content: text })
    }

    const handleClickSave = () => {

        if (memory.id === '') { memory.id = uuidv4() }
        if (memory.owner.length === 0) { memory.owner.push(userId) }

        getFirestore().collection('memories').doc(memory.id).set(memory)
            .then(function () {
                props.history.push('/home')
            })
    }

    function handleClose() {
        setOpen(false);
        props.history.push('/home')
    }

    return (
        <React.Fragment>
            <Dialog fullScreen open={open} TransitionComponent={Transition}>
                <AppBar className={classes.appBar} color="secondary">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <TextField
                            className={classes.title}
                            id="standard-name"
                            label="Headline"
                            value={memory.headline}
                            onChange={handleChange('headline')}
                            required
                        />
                        <Button color="inherit" onClick={handleClickSave}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>

                <Editor
                    theme="snow"
                    height="75vh"
                    onChange={handleChangeEditor()}
                    text={editorText}
                    readOnly={false} />
            </Dialog>
        </React.Fragment>
    )
}