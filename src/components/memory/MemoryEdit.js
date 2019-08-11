import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getFirebase } from '../../firebaseManager'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import uuidv4 from 'uuid/v4'
import Editor from '../quill/Editor'

import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Check'
import BackIcon from '@material-ui/icons/ArrowBack'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Header from '../Header'
import Snackbar from '../dialogs/Snackbar'

const useStyles = makeStyles(theme => ({
    card: {
        width: '90%',
        height: '80vh',
        margin: '10px',
        padding: '10px',
    },
    textField: {
        margin: '10px',
        width: '90%',
    },
}))

export default function MemoryEdit(props) {

    const classes = useStyles()

    const [memory, setMemory] = React.useState({ id: '', headline: '', content: '' })
    const [editorText, setEditorText] = React.useState('')
    const [message, setMessage] = React.useState('')

    const getMemory = (id) => {

        const docRef = getFirebase().collection('memories').doc(id)

        docRef.get().then(function (doc) {
            if (doc.exists) {
                setMemory({ id: doc.id, ...doc.data() })
                setEditorText(doc.data().content)
            }
        }).catch(function (error) {
            setMessage(`Error getting document:, ${error}`);
        });
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

    const handleClickSave = (memory) => () => {

        if (memory.id === '') {
            memory.id = uuidv4()
        }

        // Add a new document in collection "cities"
        getFirebase().collection('memories').doc(memory.id).set(memory)
            .then(function () {
                setMessage('Document successfully written!')
            })
            .catch(function (error) {
                setMessage('Error writing document: ', error)
            })
    }

    const handleClickDelete = (memory) => () => {

        if (memory.id === '') {
            memory.id = uuidv4()
        }

        // Add a new document in collection "cities"
        getFirebase().collection('memories').doc(memory.id).delete()
            .then(function () {
                setMessage('Document deleted!')
                props.history.push('/')
            })
            .catch(function (error) {
                setMessage('Error deleting document: ', error)
            })
    }

    return (
        <nav >
            <Header />
            <main>
                <Container maxWidth="xl">
                    <Card className={classes.card} elevation={4} >
                        <form className={classes.container} noValidate autoComplete="off" >
                            <TextField
                                id="standard-name"
                                label="Headline"
                                className={classes.textField}
                                value={memory.headline}
                                onChange={handleChange('headline')}
                                margin="normal"
                                required
                            />
                            <Editor
                                theme="snow"
                                onChange={handleChangeEditor()}
                                text={editorText} />
                        </form>
                        <CardActions disableSpacing>
                            <IconButton className={classes.cardButton} onClick={handleClickSave(memory)}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton className={clsx(classes.cardButton, classes.link)}>
                                <Link to="/">
                                    <BackIcon />
                                </Link>
                            </IconButton>
                            <IconButton className={classes.cardButton} onClick={handleClickDelete(memory)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>
                    </Card>
                    {
                        message && <Snackbar message={message} />
                    }

                </Container>
            </main>
        </nav>
    )
}