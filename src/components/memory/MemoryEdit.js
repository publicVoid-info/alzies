import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getFirebase } from '../../firebase/firebaseManager'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import uuidv4 from 'uuid/v4'

import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Check'
import CancelIcon from '@material-ui/icons/Cancel'
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
    link: {
        textDecoration: 'none',
        color: 'inherit'
    },
}))

export default function MemoryEdit(props) {

    const classes = useStyles()

    const [memory, setMemory] = React.useState({ id: '', headline: '', content: '' })
    const [message, setMessage] = React.useState('')

    const getMemory = (id) => {

        const docRef = getFirebase().collection('memories').doc(id)

        docRef.get().then(function (doc) {
            if (doc.exists) {
                setMemory({ id: doc.id, ...doc.data() })
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

    const handleClickSave = (memory) => () => {

        if (memory.id === '') {
            memory.id = uuidv4()
        }

        // Add a new document in collection "cities"
        getFirebase().collection('memories').doc(memory.id).set(memory)
            .then(function () {
                setMessage('Document successfully written!')
                props.history.push('/')
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
                            <TextField
                                id="standard-multiline-flexible"
                                label="Content"
                                multiline
                                rowsMax="20"
                                rows="5"
                                value={memory.content}
                                onChange={handleChange('content')}
                                className={classes.textField}
                                margin="normal"
                                required
                            />
                        </form>
                        <CardActions disableSpacing>
                            <IconButton className={classes.cardButton} onClick={handleClickSave(memory)}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton className={clsx(classes.cardButton, classes.link)}>
                                <Link to="/">
                                    <CancelIcon />
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